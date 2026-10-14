import mongoose, { Schema, Document } from 'mongoose';

export type ExpenseCategory =
  | 'rent'
  | 'utilities'
  | 'salaries'
  | 'supplies'
  | 'maintenance'
  | 'marketing'
  | 'other';

export interface IExpense extends Document {
  title: string;
  category: ExpenseCategory;
  amountInPaise: number;
  date: Date;
  description?: string;
  receiptUrl?: string;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['rent', 'utilities', 'salaries', 'supplies', 'maintenance', 'marketing', 'other'],
      required: true,
      index: true,
    },
    amountInPaise: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now, index: true },
    description: { type: String, trim: true },
    receiptUrl: { type: String },
    recordedBy: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

export const ExpenseModel = mongoose.model<IExpense>('Expense', ExpenseSchema);
