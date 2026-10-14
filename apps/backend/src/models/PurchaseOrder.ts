import mongoose, { Schema, Document } from 'mongoose';

export type PurchaseOrderStatus =
  | 'draft'
  | 'ordered'
  | 'partially_received'
  | 'received'
  | 'cancelled';

export interface IPurchaseOrderItem {
  inventoryItemId: mongoose.Types.ObjectId;
  itemName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitCostInPaise: number;
  taxPercent: number;
  totalCostInPaise: number;
}

export interface IPurchaseOrder extends Document {
  poNumber: string;
  supplierId: mongoose.Types.ObjectId;
  items: IPurchaseOrderItem[];
  totalAmountInPaise: number;
  status: PurchaseOrderStatus;
  invoiceReference?: string;
  orderedDate?: Date;
  receivedDate?: Date;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseOrderItemSchema = new Schema<IPurchaseOrderItem>(
  {
    inventoryItemId: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    itemName: { type: String, required: true },
    orderedQuantity: { type: Number, required: true, min: 1 },
    receivedQuantity: { type: Number, default: 0, min: 0 },
    unitCostInPaise: { type: Number, required: true, min: 0 },
    taxPercent: { type: Number, default: 0 },
    totalCostInPaise: { type: Number, required: true },
  },
  { _id: false }
);

const PurchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    poNumber: { type: String, required: true, unique: true, uppercase: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true, index: true },
    items: [PurchaseOrderItemSchema],
    totalAmountInPaise: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'ordered', 'partially_received', 'received', 'cancelled'],
      default: 'draft',
      index: true,
    },
    invoiceReference: { type: String, trim: true },
    orderedDate: { type: Date },
    receivedDate: { type: Date },
    notes: { type: String },
    createdBy: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

export const PurchaseOrderModel = mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
