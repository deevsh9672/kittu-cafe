import mongoose, { Schema, Document } from 'mongoose';

export type StockOperationType =
  | 'stock_in'
  | 'stock_out'
  | 'sale'
  | 'wastage'
  | 'damaged'
  | 'adjustment'
  | 'purchase_receipt';

export interface IInventoryMovement extends Document {
  inventoryItemId: mongoose.Types.ObjectId;
  operationType: StockOperationType;
  previousQuantity: number;
  newQuantity: number;
  changeQuantity: number; // positive for addition, negative for deduction
  unitCostInPaise?: number;
  totalCostInPaise?: number;
  reason?: string;
  referenceId?: string; // Order ID or PO Number or Invoice Ref
  performedBy?: string; // staff email or phone
  timestamp: Date;
}

const InventoryMovementSchema = new Schema<IInventoryMovement>(
  {
    inventoryItemId: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true, index: true },
    operationType: {
      type: String,
      enum: ['stock_in', 'stock_out', 'sale', 'wastage', 'damaged', 'adjustment', 'purchase_receipt'],
      required: true,
      index: true,
    },
    previousQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    changeQuantity: { type: Number, required: true },
    unitCostInPaise: { type: Number, default: 0 },
    totalCostInPaise: { type: Number, default: 0 },
    reason: { type: String, trim: true },
    referenceId: { type: String, trim: true, index: true },
    performedBy: { type: String, default: 'system' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

InventoryMovementSchema.index({ inventoryItemId: 1, timestamp: -1 });

export const InventoryMovementModel = mongoose.model<IInventoryMovement>(
  'InventoryMovement',
  InventoryMovementSchema
);
