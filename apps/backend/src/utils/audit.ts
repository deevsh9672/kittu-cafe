import { AuditLogModel } from '../models';

export async function logAudit(
  action: string,
  performedBy: string,
  role: string,
  details?: any,
  ipAddress?: string
): Promise<void> {
  try {
    await AuditLogModel.create({
      action,
      performedBy,
      role,
      details,
      ipAddress,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('[AuditLog] Failed to record audit log:', err);
  }
}
