import mongoose, { Schema, Document } from 'mongoose';

export type InventoryItemType = 'beverage' | 'ingredient' | 'packaging';

export interface IInventoryItem extends Document {
  name: string;
  sku: string;
  barcode?: string;
  itemType: InventoryItemType;
  category: string;
  brand?: string;
  variant?: string;
  packageSize?: string; // e.g. '250ml', '330ml', '500ml', '1L', '1kg'
  stockUnit: string; // 'can', 'bottle', 'piece', 'g', 'kg', 'ml', 'L'
  openingStock: number;
  currentQuantity: number;
  minStockThreshold: number;
  reorderQuantity: number;
  purchasePriceInPaise: number;
  sellingPriceInPaise?: number; // For direct sellable beverages like Red Bull or Coke
  supplierId?: mongoose.Types.ObjectId;
  batchNumber?: string;
  expiryDate?: Date;
  storageLocation?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    barcode: { type: String, trim: true, sparse: true },
    itemType: {
      type: String,
      enum: ['beverage', 'ingredient', 'packaging'],
      required: true,
      index: true,
    },
    category: { type: String, required: true, index: true },
    brand: { type: String, trim: true },
    variant: { type: String, trim: true },
    packageSize: { type: String, trim: true },
    stockUnit: { type: String, required: true, trim: true },
    openingStock: { type: Number, default: 0, min: 0 },
    currentQuantity: { type: Number, required: true, default: 0 },
    minStockThreshold: { type: Number, required: true, default: 5 },
    reorderQuantity: { type: Number, default: 10 },
    purchasePriceInPaise: { type: Number, required: true, min: 0 },
    sellingPriceInPaise: { type: Number, min: 0 },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    batchNumber: { type: String },
    expiryDate: { type: Date },
    storageLocation: { type: String, trim: true },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

InventoryItemSchema.index({ currentQuantity: 1, minStockThreshold: 1 });
InventoryItemSchema.index({ name: 'text', brand: 'text', sku: 'text' });

export const InventoryItemModel = mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
