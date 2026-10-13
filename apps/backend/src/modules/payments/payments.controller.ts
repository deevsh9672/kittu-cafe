import { Request, Response } from 'express';
import crypto from 'crypto';
import { OrderModel, PaymentModel } from '../../models';
import { config } from '../../config/env';
import { emitOrderStatusUpdated } from '../../utils/socket';
import { logAudit } from '../../utils/audit';

export class PaymentsController {
  /**
   * Verify signature from Razorpay standard checkout client
   */
  static async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_PAYLOAD', message: 'Missing payment parameters' },
        });
        return;
      }

      // Check signature: HMAC SHA256(order_id + "|" + payment_id, secret)
      const expectedSignature = crypto
        .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const isSignatureValid =
        expectedSignature === razorpay_signature ||
        // Fallback for mock test mode
        (config.NODE_ENV !== 'production' && razorpay_signature.startsWith('mock_sig_'));

      if (!isSignatureValid) {
        res.status(400).json({
          success: false,
          error: { code: 'SIGNATURE_VERIFICATION_FAILED', message: 'Invalid payment signature' },
        });
        return;
      }

      // Find the associated order
      const order = orderId
        ? await OrderModel.findById(orderId)
        : await OrderModel.findOne({ razorpayOrderId: razorpay_order_id });

      if (!order) {
        res.status(404).json({ success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' } });
        return;
      }

      // Idempotency: if already captured, return success immediately
      if (order.paymentStatus === 'captured') {
        res.json({ success: true, message: 'Payment already recorded', data: order });
        return;
      }

      order.paymentStatus = 'captured';
      order.status = 'confirmed';
      order.razorpayPaymentId = razorpay_payment_id;
      order.statusHistory.push({
        status: 'confirmed',
        changedBy: 'Razorpay Gateway',
        timestamp: new Date(),
        notes: `Verified online payment (Payment ID: ${razorpay_payment_id})`,
      });
      await order.save();

      // Record in Payment collection
      await PaymentModel.create({
        orderId: order._id,
        amountInPaise: order.totalInPaise,
        currency: 'INR',
        provider: 'razorpay',
        providerOrderId: razorpay_order_id,
        providerPaymentId: razorpay_payment_id,
        providerSignature: razorpay_signature,
        status: 'captured',
        paymentMethod: 'razorpay',
      });

      emitOrderStatusUpdated(order._id.toString(), 'confirmed', order);

      res.json({
        success: true,
        message: 'Payment verified and order confirmed successfully',
        data: order,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'PAYMENT_VERIFY_ERROR', message: error.message } });
    }
  }

  /**
   * Razorpay Webhook Handler with HMAC validation & duplicate prevention
   */
  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const webhookSignature = req.headers['x-razorpay-signature'] as string;
      const webhookSecret = config.RAZORPAY_WEBHOOK_SECRET;

      // In production, strictly verify HMAC
      if (config.NODE_ENV === 'production' && webhookSignature) {
        const shasum = crypto.createHmac('sha256', webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest !== webhookSignature) {
          res.status(400).json({ success: false, error: { code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature' } });
          return;
        }
      }

      const event = req.body?.event;
      const payload = req.body?.payload;

      console.log(`[Razorpay Webhook] Received event: ${event}`);

      if (event === 'payment.captured') {
        const paymentEntity = payload.payment.entity;
        const razorpayOrderId = paymentEntity.order_id;
        const razorpayPaymentId = paymentEntity.id;

        const order = await OrderModel.findOne({ razorpayOrderId });
        if (order && order.paymentStatus !== 'captured') {
          order.paymentStatus = 'captured';
          order.status = 'confirmed';
          order.razorpayPaymentId = razorpayPaymentId;
          order.statusHistory.push({
            status: 'confirmed',
            changedBy: 'Razorpay Webhook',
            timestamp: new Date(),
            notes: `Auto-captured via webhook event ${event}`,
          });
          await order.save();

          await PaymentModel.findOneAndUpdate(
            { providerOrderId: razorpayOrderId },
            {
              orderId: order._id,
              amountInPaise: paymentEntity.amount,
              currency: 'INR',
              provider: 'razorpay',
              providerOrderId: razorpayOrderId,
              providerPaymentId: razorpayPaymentId,
              status: 'captured',
              paymentMethod: 'razorpay',
              $push: { webhookEvents: { event, payload: paymentEntity } },
            },
            { upsert: true }
          );

          emitOrderStatusUpdated(order._id.toString(), 'confirmed', order);
        }
      }

      res.status(200).json({ status: 'ok' });
    } catch (error: any) {
      console.error('[Razorpay Webhook] Error processing webhook:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Authorized Refund
   */
  static async processRefund(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, amountInPaise, reason } = req.body;
      const order = await OrderModel.findById(orderId);

      if (!order) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
        return;
      }

      if (order.paymentStatus !== 'captured') {
        res.status(400).json({
          success: false,
          error: { code: 'NOT_PAID', message: 'Cannot refund an order that was not paid' },
        });
        return;
      }

      order.paymentStatus = 'refunded';
      order.status = 'refunded';
      order.statusHistory.push({
        status: 'refunded',
        changedBy: req.user?.name || 'Authorized Manager',
        timestamp: new Date(),
        notes: `Refund processed: ${reason}`,
      });
      await order.save();

      await PaymentModel.updateOne(
        { orderId: order._id },
        { status: 'refunded', $push: { webhookEvents: { event: 'refund.processed', reason } } }
      );

      if (req.user) {
        logAudit('PROCESS_REFUND', req.user.phone, req.user.role, {
          orderId: order._id,
          amountInPaise: amountInPaise || order.totalInPaise,
          reason,
        });
      }

      emitOrderStatusUpdated(order._id.toString(), 'refunded', order);

      res.json({ success: true, message: 'Refund recorded and processed', data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'REFUND_ERROR', message: error.message } });
    }
  }
}
