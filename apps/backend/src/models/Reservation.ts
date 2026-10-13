import mongoose, { Schema, Document } from 'mongoose';
import { ReservationStatus } from '@kittu-cafe/shared';

export interface IReservationDocument extends Document {
  reservationNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM
  tableNumber?: string;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservationDocument>(
  {
    reservationNumber: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true, index: true },
    customerEmail: { type: String, trim: true },
    partySize: { type: Number, required: true, min: 1, max: 20 },
    reservationDate: { type: String, required: true, index: true },
    reservationTime: { type: String, required: true },
    tableNumber: { type: String, default: 'Table T1' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'],
      default: 'confirmed',
      index: true,
    },
    specialRequests: { type: String },
  },
  { timestamps: true }
);

// Prevent double booking on identical table, date, and time slot
ReservationSchema.index({ reservationDate: 1, reservationTime: 1, tableNumber: 1 });

export const ReservationModel =
  mongoose.models.Reservation || mongoose.model<IReservationDocument>('Reservation', ReservationSchema);
