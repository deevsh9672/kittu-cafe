import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@kittu-cafe/shared';

export interface IUserAddress {
  street: string;
  area: string;
  city: string;
  postalCode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface IUserDocument extends Document {
  name: string;
  phone: string;
  email?: string;
  passwordHash?: string;
  role: UserRole;
  isActive: boolean;
  savedAddresses: IUserAddress[];
  loyaltyPoints: number;
  otpCode?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, index: true, trim: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ['admin', 'manager', 'cashier', 'kitchen', 'delivery', 'customer'],
      default: 'customer',
      index: true,
    },
    isActive: { type: Boolean, default: true },
    savedAddresses: [
      {
        street: { type: String, required: true },
        area: { type: String, required: true },
        city: { type: String, required: true, default: 'Dausa' },
        postalCode: { type: String, required: true, default: '303303' },
        landmark: { type: String },
        isDefault: { type: Boolean, default: false },
      },
    ],
    loyaltyPoints: { type: Number, default: 0, min: 0 },
    otpCode: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
