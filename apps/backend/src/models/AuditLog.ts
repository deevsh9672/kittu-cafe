import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLogDocument extends Document {
  action: string;
  performedBy: string;
  role: string;
  ipAddress?: string;
  details?: any;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    action: { type: String, required: true, index: true },
    performedBy: { type: String, required: true, index: true },
    role: { type: String, required: true },
    ipAddress: { type: String },
    details: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const AuditLogModel =
  mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
