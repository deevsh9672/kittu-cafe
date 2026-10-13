import mongoose, { Schema, Document, Types } from 'mongoose';
import { OrderStatus, OrderType, PaymentMethod, PaymentStatus, IOrderItemSnapshot } from '@kittu-cafe/shared';

export interface IOrderStatusHistory {
  status: OrderStatus;
  changedBy: string;
  timestamp: Date;
  notes?: string;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  customerId?: Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: {
    street: string;
    area: string;
    city: string;
    postalCode: string;
    landmark?: string;
  };
  items: IOrderItemSnapshot[];
  subtotalInPaise: number;
  taxInPaise: number;
  deliveryFeeInPaise: number;
  discountInPaise: number;
  totalInPaise: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  idempotencyKey?: string;
  preparationNotes?: string;
  cancellationReason?: string;
  statusHistory: IOrderStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true, index: true },
    customerEmail: { type: String },
    orderType: {
      type: String,
      enum: ['delivery', 'pickup', 'dine_in'],
      required: true,
      index: true,
    },
    tableNumber: { type: String },
    deliveryAddress: {
      street: { type: String },
      area: { type: String },
      city: { type: String },
      postalCode: { type: String },
      landmark: { type: String },
    },
    items: [
      {
        menuItemId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPriceInPaise: { type: Number, required: true, min: 0 },
        totalPriceInPaise: { type: Number, required: true, min: 0 },
        selectedVariant: {
          name: { type: String },
          priceInPaise: { type: Number },
        },
        selectedAddOns: [
          {
            name: { type: String },
            priceInPaise: { type: Number },
          },
        ],
        specialInstructions: { type: String },
      },
    ],
    subtotalInPaise: { type: Number, required: true, min: 0 },
    taxInPaise: { type: Number, required: true, min: 0, default: 0 },
    deliveryFeeInPaise: { type: Number, required: true, min: 0, default: 0 },
    discountInPaise: { type: Number, required: true, min: 0, default: 0 },
    totalInPaise: { type: Number, required: true, min: 0 },
    couponCode: { type: String },
    status: {
      type: String,
      enum: [
        'pending_confirmation',
        'confirmed',
        'accepted_by_kitchen',
        'preparing',
        'ready_for_pickup',
        'out_for_delivery',
        'completed',
        'cancelled',
        'refund_pending',
        'refunded',
      ],
      default: 'pending_confirmation',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cash_on_delivery', 'cash_at_pickup', 'cash_at_counter', 'upi_at_counter'],
      default: 'cash_on_delivery',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },
    idempotencyKey: { type: String, unique: true, sparse: true },
    preparationNotes: { type: String },
    cancellationReason: { type: String },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedBy: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        notes: { type: String },
      },
    ],
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1, status: 1 });

export const OrderModel = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
