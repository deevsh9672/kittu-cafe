import mongoose, { Schema, Document, Types } from 'mongoose';
import { DietaryType, IMenuItemVariant, IAddOnGroup } from '@kittu-cafe/shared';

export interface IMenuItemDocument extends Document {
  name: string;
  description: string;
  categoryId: Types.ObjectId;
  basePriceInPaise: number;
  imageUrl?: string;
  dietaryType: DietaryType;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  preparationTimeMinutes: number;
  variants: IMenuItemVariant[];
  addOnGroups: IAddOnGroup[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItemDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: '', trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'MenuCategory', required: true, index: true },
    basePriceInPaise: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    dietaryType: {
      type: String,
      enum: ['veg', 'non_veg', 'egg', 'vegan'],
      default: 'veg',
      index: true,
    },
    isAvailable: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isBestseller: { type: Boolean, default: false, index: true },
    preparationTimeMinutes: { type: Number, default: 15 },
    variants: [
      {
        name: { type: String, required: true },
        priceInPaise: { type: Number, required: true, min: 0 },
        isDefault: { type: Boolean, default: false },
      },
    ],
    addOnGroups: [
      {
        title: { type: String, required: true },
        minSelections: { type: Number, default: 0 },
        maxSelections: { type: Number, default: 5 },
        items: [
          {
            name: { type: String, required: true },
            priceInPaise: { type: Number, required: true, min: 0 },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Compound index for menu listing and filtering
MenuItemSchema.index({ categoryId: 1, isAvailable: 1, basePriceInPaise: 1 });

export const MenuItemModel =
  mongoose.models.MenuItem || mongoose.model<IMenuItemDocument>('MenuItem', MenuItemSchema);
