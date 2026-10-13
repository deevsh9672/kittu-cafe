import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuCategoryDocument extends Document {
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuCategorySchema = new Schema<IMenuCategoryDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    icon: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const MenuCategoryModel =
  mongoose.models.MenuCategory || mongoose.model<IMenuCategoryDocument>('MenuCategory', MenuCategorySchema);
