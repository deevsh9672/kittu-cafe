import { Request, Response } from 'express';
import { OrderModel, UserModel, CouponModel } from '../../models';
import { OrdersService, CartInputItem } from './orders.service';
import { OrderStatus, OrderType, PaymentMethod } from '@kittu-cafe/shared';
import { emitOrderCreated, emitOrderStatusUpdated } from '../../utils/socket';
import { logAudit } from '../../utils/audit';
import Razorpay from 'razorpay';
import { config } from '../../config/env';

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_confirmation: ['confirmed', 'cancelled'],
  confirmed: ['accepted_by_kitchen', 'cancelled'],
  accepted_by_kitchen: ['preparing', 'cancelled'],
  preparing: ['ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['out_for_delivery', 'completed', 'cancelled'],
  out_for_delivery: ['completed', 'cancelled'],
  completed: ['refund_pending', 'refunded'],
  cancelled: ['refund_pending', 'refunded'],
  refund_pending: ['refunded'],
  refunded: [],
};

export class OrdersController {
  static async calculate(req: Request, res: Response): Promise<void> {
    try {
      const { items, orderType, couponCode } = req.body;
      const calculation = await OrdersService.calculateOrder(items, orderType, couponCode);
      res.json({ success: true, data: calculation });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { code: 'CALCULATION_ERROR', message: error.message } });
    }
  }

  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const {
        items,
        orderType,
        customerName,
        customerPhone,
        customerEmail,
        tableNumber,
        deliveryAddress,
        paymentMethod,
        couponCode,
        preparationNotes,
        idempotencyKey,
      } = req.body;

      // Idempotency check
      if (idempotencyKey) {
        const existing = await OrderModel.findOne({ idempotencyKey });
        if (existing) {
          res.status(200).json({ success: true, message: 'Existing order returned (idempotent)', data: existing });
          return;
        }
      }

      const calculation = await OrdersService.calculateOrder(items, orderType, couponCode);

      const orderNumber = `KC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      let razorpayOrderId: string | undefined;
      const initialStatus: OrderStatus = paymentMethod === 'razorpay' ? 'pending_confirmation' : 'confirmed';

      if (paymentMethod === 'razorpay') {
        try {
          const rzpOrder = await razorpay.orders.create({
            amount: calculation.totalInPaise,
            currency: 'INR',
            receipt: orderNumber,
            notes: {
              customerName,
              customerPhone,
              orderType,
            },
          });
          razorpayOrderId = rzpOrder.id;
        } catch (rzpErr: any) {
          console.warn('[Razorpay] Mock order ID generated (test/offline mode):', rzpErr.message);
          razorpayOrderId = `order_mock_${Date.now()}`;
        }
      }

      const order = await OrderModel.create({
        orderNumber,
        customerId: req.user?.userId,
        customerName,
        customerPhone,
        customerEmail,
        orderType,
        tableNumber,
        deliveryAddress,
        items: calculation.items,
        subtotalInPaise: calculation.subtotalInPaise,
        taxInPaise: calculation.taxInPaise,
        deliveryFeeInPaise: calculation.deliveryFeeInPaise,
        discountInPaise: calculation.discountInPaise,
        totalInPaise: calculation.totalInPaise,
        couponCode: calculation.couponCode,
        status: initialStatus,
        paymentMethod,
        paymentStatus: 'pending',
        razorpayOrderId,
        idempotencyKey,
        preparationNotes,
        statusHistory: [
          {
            status: initialStatus,
            changedBy: customerName || 'Customer',
            timestamp: new Date(),
            notes: 'Order initiated',
          },
        ],
      });

      // Update coupon usage if applied
      if (calculation.couponCode) {
        await CouponModel.updateOne({ code: calculation.couponCode }, { $inc: { usedCount: 1 } });
      }

      emitOrderCreated(order);

      res.status(201).json({
        success: true,
        data: {
          order,
          razorpay: razorpayOrderId
            ? {
                orderId: razorpayOrderId,
                amount: calculation.totalInPaise,
                currency: 'INR',
                keyId: config.RAZORPAY_KEY_ID,
              }
            : undefined,
        },
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { code: 'ORDER_CREATION_FAILED', message: error.message } });
    }
  }

  static async getMyOrders(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Auth required' } });
        return;
      }

      const orders = await OrderModel.find({
        $or: [{ customerId: req.user.userId }, { customerPhone: req.user.phone }],
      }).sort({ createdAt: -1 });

      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const order = await OrderModel.findById(req.params.id);
      if (!order) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
        return;
      }
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { reason } = req.body;
      const order = await OrderModel.findById(req.params.id);
      if (!order) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
        return;
      }

      // Check if cancellation is permitted
      if (!['pending_confirmation', 'confirmed'].includes(order.status)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'CANNOT_CANCEL',
            message: `Order cannot be cancelled in state "${order.status}". Please contact Kittu Cafe at +91 95113 17456.`,
          },
        });
        return;
      }

      order.status = 'cancelled';
      order.cancellationReason = reason || 'Customer requested cancellation';
      order.statusHistory.push({
        status: 'cancelled',
        changedBy: req.user?.name || order.customerName,
        timestamp: new Date(),
        notes: reason,
      });
      await order.save();

      emitOrderStatusUpdated(order._id.toString(), 'cancelled', order);

      res.json({ success: true, message: 'Order cancelled successfully', data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'CANCEL_ERROR', message: error.message } });
    }
  }

  static async adminGetOrders(req: Request, res: Response): Promise<void> {
    try {
      const { status, orderType, search, limit = 50, page = 1 } = req.query;
      const filter: any = {};

      if (status) filter.status = status;
      if (orderType) filter.orderType = orderType;
      if (search && typeof search === 'string') {
        filter.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { customerName: { $regex: search, $options: 'i' } },
          { customerPhone: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const orders = await OrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
      const total = await OrderModel.countDocuments(filter);

      res.json({
        success: true,
        data: {
          orders,
          total,
          page: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async adminUpdateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status, notes } = req.body as { status: OrderStatus; notes?: string };
      const order = await OrderModel.findById(req.params.id);

      if (!order) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
        return;
      }

      const allowedTransitions = VALID_TRANSITIONS[order.status as OrderStatus] || [];
      if (!allowedTransitions.includes(status)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TRANSITION',
            message: `Transition from "${order.status}" to "${status}" is not permitted. Permitted: [${allowedTransitions.join(', ')}]`,
          },
        });
        return;
      }

      order.status = status;
      order.statusHistory.push({
        status,
        changedBy: req.user?.name || req.user?.phone || 'Staff',
        timestamp: new Date(),
        notes,
      });

      // If status completed, award loyalty points (1 point per ₹100 spent)
      if (status === 'completed' && order.customerId) {
        const pointsEarned = Math.floor(order.totalInPaise / 10000);
        if (pointsEarned > 0) {
          await UserModel.findByIdAndUpdate(order.customerId, {
            $inc: { loyaltyPoints: pointsEarned },
          });
        }
      }

      await order.save();

      if (req.user) {
        logAudit('UPDATE_ORDER_STATUS', req.user.phone, req.user.role, {
          orderId: order._id,
          orderNumber: order.orderNumber,
          oldStatus: order.status,
          newStatus: status,
        });
      }

      emitOrderStatusUpdated(order._id.toString(), status, order);

      res.json({ success: true, message: `Status updated to ${status}`, data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'STATUS_UPDATE_ERROR', message: error.message } });
    }
  }
}
