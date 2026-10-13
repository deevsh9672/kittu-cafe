import mongoose, { Schema, Document, Types } from 'mongoose';
import { PaymentStatus, PaymentMethod } from '@kittu-cafe/shared';

export interface IPaymentDocument extends Document {
  orderId: Types.ObjectId;
  amountInPaise: number;
  currency: string;
  provider: 'razorpay' | 'cash';
  providerOrderId?: string;
  providerPaymentId?: string;
  providerSignature?: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  webhookEvents: any[];
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    amountInPaise: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    provider: { type: String, enum: ['razorpay', 'cash'], default: 'razorpay' },
    providerOrderId: { type: String, index: true },
    providerPaymentId: { type: String, index: true },
    providerSignature: { type: String },
    status: {
      type: String,
      enum: ['pending', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cash_on_delivery', 'cash_at_pickup', 'cash_at_counter', 'upi_at_counter'],
      required: true,
    },
    webhookEvents: [
      {
        event: { type: String },
        receivedAt: { type: Date, default: Date.now },
        payload: { type: Schema.Types.Mixed },
      },
    ],
  },
  { timestamps: true }
);

export const PaymentModel =
  mongoose.models.Payment || mongoose.model<IPaymentDocument>('Payment', PaymentSchema);
