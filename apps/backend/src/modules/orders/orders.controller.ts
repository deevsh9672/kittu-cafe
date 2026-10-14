import { Request, Response } from 'express';
import { OrderModel, UserModel, CouponModel } from '../../models';
import { OrdersService, CartInputItem } from './orders.service';
import { OrderStatus, OrderType, PaymentMethod } from '@kittu-cafe/shared';
import { emitOrderCreated, emitOrderStatusUpdated } from '../../utils/socket';
import { logAudit } from '../../utils/audit';
import { InventoryService } from '../inventory/inventory.service';
import Razorpay from 'razorpay';
import { config } from '../../config/env';
import { isDBConnected } from '../../config/database';

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

// In-memory resilient store for local testing or when MongoDB is offline
const IN_MEMORY_ORDERS: any[] = [
  {
    _id: 'ord-1791975795976',
    orderNumber: 'KC-2026-9597',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98290 11223',
    orderType: 'delivery',
    status: 'confirmed',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    deliveryAddress: { street: 'House #42, Lane 3', area: 'Shiv Colony, Mariyara Wale', city: 'Dausa', postalCode: '303303' },
    items: [
      {
        menuItemId: 'seed-coffee-1',
        name: 'Classic Handcrafted Cappuccino',
        quantity: 1,
        selectedVariant: { name: 'Regular (250ml)', priceInPaise: 14000 },
        unitPriceInPaise: 14000,
        totalPriceInPaise: 14000,
      },
      {
        menuItemId: 'seed-sandwich-1',
        name: 'Grilled Paneer Tikka Sandwich',
        quantity: 2,
        unitPriceInPaise: 13000,
        totalPriceInPaise: 26000,
      },
    ],
    subtotalInPaise: 40000,
    taxInPaise: 2000,
    deliveryFeeInPaise: 4000,
    discountInPaise: 0,
    totalInPaise: 46000,
    createdAt: new Date().toISOString(),
    statusHistory: [{ status: 'confirmed', timestamp: new Date(), notes: 'Order confirmed & in progress' }],
  },
  {
    _id: 'ord_1',
    orderNumber: 'KC-990123',
    customerName: 'Amit Meena',
    customerPhone: '+91 98290 12345',
    orderType: 'delivery',
    status: 'confirmed',
    totalInPaise: 27100,
    paymentMethod: 'razorpay',
    paymentStatus: 'captured',
    deliveryAddress: { street: 'Near SBI Bank, Agra Road', area: 'Shiv Colony', city: 'Dausa', postalCode: '303303' },
    items: [
      { menuItemId: 'seed-coffee-1', name: 'Classic Handcrafted Cappuccino', quantity: 2, unitPriceInPaise: 11000, totalPriceInPaise: 22000 },
      { menuItemId: 'seed-snacks-1', name: 'Peri Peri Masala Fries', quantity: 1, unitPriceInPaise: 9000, totalPriceInPaise: 9000 },
    ],
    subtotalInPaise: 31000,
    taxInPaise: 1550,
    deliveryFeeInPaise: 0,
    discountInPaise: 5450,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    statusHistory: [{ status: 'confirmed', timestamp: new Date(), notes: 'Order confirmed' }],
  },
  {
    _id: 'ord_2',
    orderNumber: 'KC-990124',
    customerName: 'Pooja Sharma',
    customerPhone: '+91 94140 54321',
    orderType: 'dine_in',
    tableNumber: 'Table T1',
    status: 'preparing',
    totalInPaise: 22000,
    paymentMethod: 'cash_at_counter',
    paymentStatus: 'pending',
    items: [{ menuItemId: 'seed-pizza-1', name: 'Veg Loaded Farmhouse Pizza', quantity: 1, unitPriceInPaise: 22000, totalPriceInPaise: 22000 }],
    subtotalInPaise: 22000,
    taxInPaise: 1100,
    deliveryFeeInPaise: 0,
    discountInPaise: 1100,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    statusHistory: [
      { status: 'confirmed', timestamp: new Date(), notes: 'Order confirmed' },
      { status: 'preparing', timestamp: new Date(), notes: 'Sent to kitchen' },
    ],
  },
];

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
        let existing: any = null;
        if (isDBConnected()) {
          try {
            existing = await OrderModel.findOne({ idempotencyKey });
          } catch (e) {
            existing = null;
          }
        }
        if (!existing) {
          existing = IN_MEMORY_ORDERS.find((o) => o.idempotencyKey === idempotencyKey);
        }
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

      const orderId = 'ord-' + Date.now();
      const normalizedAddress =
        typeof deliveryAddress === 'string'
          ? { street: deliveryAddress, area: 'Shiv Colony', city: 'Dausa', postalCode: '303303' }
          : deliveryAddress;

      const orderData: any = {
        _id: orderId,
        orderNumber,
        customerId: req.user?.userId,
        customerName,
        customerPhone,
        customerEmail,
        orderType,
        tableNumber,
        deliveryAddress: normalizedAddress,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let order: any = orderData;
      if (isDBConnected()) {
        try {
          order = await OrderModel.create(orderData);
        } catch (dbErr: any) {
          console.warn('[Orders] Could not persist to DB, using in-memory fallback:', dbErr.message);
        }
      }
      IN_MEMORY_ORDERS.unshift(order);

      // Update coupon usage if applied
      if (calculation.couponCode && isDBConnected()) {
        try {
          await CouponModel.updateOne({ code: calculation.couponCode }, { $inc: { usedCount: 1 } });
        } catch (e) {}
      }

      // Deduct inventory if order is immediately confirmed (e.g. COD / Dine-in)
      if (initialStatus === 'confirmed') {
        try {
          await InventoryService.deductForOrder(
            order._id.toString(),
            order.items.map((i: any) => ({ menuItemId: i.menuItemId.toString(), quantity: i.quantity }))
          );
        } catch (invErr: any) {
          console.warn('[Inventory] Warning during order deduction:', invErr.message);
        }
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

      let orders: any[] = [];
      if (isDBConnected()) {
        try {
          orders = await OrderModel.find({
            $or: [{ customerId: req.user.userId }, { customerPhone: req.user.phone }],
          }).sort({ createdAt: -1 });
        } catch (e) {
          orders = [];
        }
      }

      if (orders.length === 0) {
        orders = IN_MEMORY_ORDERS.filter(
          (o) => o.customerId === req.user?.userId || o.customerPhone === req.user?.phone
        );
      }

      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      let order: any = null;
      if (isDBConnected()) {
        try {
          order = await OrderModel.findById(req.params.id);
        } catch (e) {
          order = null;
        }
      }

      if (!order) {
        order = IN_MEMORY_ORDERS.find((o) => o._id === req.params.id || o.orderNumber === req.params.id);
      }

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
      let order: any = null;

      if (isDBConnected()) {
        try {
          order = await OrderModel.findById(req.params.id);
        } catch (e) {
          order = null;
        }
      }

      if (!order) {
        order = IN_MEMORY_ORDERS.find((o) => o._id === req.params.id || o.orderNumber === req.params.id);
      }

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
      if (!order.statusHistory) order.statusHistory = [];
      order.statusHistory.push({
        status: 'cancelled',
        changedBy: req.user?.name || order.customerName,
        timestamp: new Date(),
        notes: reason,
      });

      if (order.save && typeof order.save === 'function') {
        await order.save();
      }

      // Release reserved stock for cancelled order
      try {
        await InventoryService.restoreCancelledOrder(order._id.toString());
      } catch (restErr: any) {
        console.warn('[Inventory] Warning restoring cancelled order stock:', restErr.message);
      }

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

      if (isDBConnected()) {
        try {
          const skip = (Number(page) - 1) * Number(limit);
          const orders = await OrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
          const total = await OrderModel.countDocuments(filter);

          res.json({
            success: true,
            data: {
              orders: orders.length > 0 ? orders : IN_MEMORY_ORDERS,
              total: orders.length > 0 ? total : IN_MEMORY_ORDERS.length,
              page: Number(page),
              totalPages: Math.ceil((orders.length > 0 ? total : IN_MEMORY_ORDERS.length) / Number(limit)) || 1,
            },
          });
          return;
        } catch (dbErr) {}
      }

      // Fallback
      let result = [...IN_MEMORY_ORDERS];
      if (status) result = result.filter((o) => o.status === status);
      if (orderType) result = result.filter((o) => o.orderType === orderType);

      res.json({
        success: true,
        data: {
          orders: result,
          total: result.length,
          page: 1,
          totalPages: 1,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async adminUpdateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status, notes } = req.body as { status: OrderStatus; notes?: string };
      let order: any = null;

      if (isDBConnected()) {
        try {
          order = await OrderModel.findById(req.params.id);
        } catch (e) {
          order = null;
        }
      }

      if (!order) {
        order = IN_MEMORY_ORDERS.find((o) => o._id === req.params.id || o.orderNumber === req.params.id);
      }

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
      if (!order.statusHistory) order.statusHistory = [];
      order.statusHistory.push({
        status,
        changedBy: req.user?.name || req.user?.phone || 'Staff',
        timestamp: new Date(),
        notes,
      });

      if (order.save && typeof order.save === 'function') {
        await order.save();
      }

      // If status completed, award loyalty points (1 point per ₹100 spent)
      if (status === 'completed' && order.customerId && isDBConnected()) {
        const pointsEarned = Math.floor(order.totalInPaise / 10000);
        if (pointsEarned > 0) {
          try {
            await UserModel.findByIdAndUpdate(order.customerId, {
              $inc: { loyaltyPoints: pointsEarned },
            });
          } catch (e) {}
        }
      }

      // If status confirmed or accepted, trigger inventory deduction
      if (['confirmed', 'accepted_by_kitchen'].includes(status)) {
        try {
          await InventoryService.deductForOrder(
            order._id.toString(),
            order.items.map((i: any) => ({ menuItemId: i.menuItemId.toString(), quantity: i.quantity }))
          );
        } catch (invErr: any) {
          console.warn('[Inventory] Warning during status update deduction:', invErr.message);
        }
      }

      emitOrderStatusUpdated(order._id.toString(), status, order);

      res.json({ success: true, message: `Order status updated to ${status}`, data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'UPDATE_STATUS_ERROR', message: error.message } });
    }
  }
}
