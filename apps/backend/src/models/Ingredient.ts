import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredientDocument extends Document {
  name: string;
  unit: string; // e.g. "grams", "ml", "pieces"
  currentStock: number;
  lowStockThreshold: number;
  costPerUnitInPaise: number;
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema = new Schema<IIngredientDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    unit: { type: String, required: true, default: 'grams' },
    currentStock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, required: true, min: 0, default: 500 },
    costPerUnitInPaise: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

export const IngredientModel =
  mongoose.models.Ingredient || mongoose.model<IIngredientDocument>('Ingredient', IngredientSchema);
