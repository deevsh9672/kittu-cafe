import { Request, Response } from 'express';
import { UserModel, AuditLogModel } from '../../models';
import bcrypt from 'bcryptjs';
import { logAudit } from '../../utils/audit';

export class StaffController {
  static async getStaff(req: Request, res: Response): Promise<void> {
    try {
      const staff = await UserModel.find({
        role: { $in: ['admin', 'manager', 'cashier', 'kitchen', 'delivery'] },
      }).select('-passwordHash -otpCode');

      res.json({ success: true, data: staff });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async createStaff(req: Request, res: Response): Promise<void> {
    try {
      const { name, phone, email, password, role } = req.body;
      const existing = await UserModel.findOne({ phone });
      if (existing) {
        res.status(409).json({ success: false, error: { code: 'EXISTS', message: 'User with this phone exists' } });
        return;
      }

      const passwordHash = await bcrypt.hash(password || 'Kittu@123', 10);
      const user = await UserModel.create({
        name,
        phone,
        email,
        passwordHash,
        role: role || 'cashier',
        isActive: true,
      });

      if (req.user) {
        logAudit('CREATE_STAFF', req.user.phone, req.user.role, { staffId: user._id, role, name });
      }

      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
    }
  }

  static async updateStaffRole(req: Request, res: Response): Promise<void> {
    try {
      const { role, isActive } = req.body;
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Staff member not found' } });
        return;
      }

      if (role) user.role = role;
      if (isActive !== undefined) user.isActive = isActive;
      await user.save();

      if (req.user) {
        logAudit('UPDATE_STAFF_ROLE', req.user.phone, req.user.role, { staffId: user._id, role, isActive });
      }

      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }

  static async getAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const logs = await AuditLogModel.find().sort({ timestamp: -1 }).limit(100);
      res.json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }
}
