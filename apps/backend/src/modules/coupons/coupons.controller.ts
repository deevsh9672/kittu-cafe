import { Request, Response } from 'express';
import { CouponModel } from '../../models';
import { logAudit } from '../../utils/audit';

export class CouponsController {
  static async validateCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { code, subtotalInPaise } = req.body;
      if (!code) {
        res.status(400).json({ success: false, error: { code: 'MISSING_CODE', message: 'Coupon code required' } });
        return;
      }

      const coupon = await CouponModel.findOne({
        code: code.trim().toUpperCase(),
        isActive: true,
        expiryDate: { $gte: new Date() },
      });

      if (!coupon) {
        res.status(404).json({
          success: false,
          error: { code: 'INVALID_COUPON', message: 'Coupon code is invalid or expired' },
        });
        return;
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        res.status(400).json({
          success: false,
          error: { code: 'USAGE_LIMIT_EXCEEDED', message: 'This coupon has reached its maximum redemptions' },
        });
        return;
      }

      if (subtotalInPaise < coupon.minOrderInPaise) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MIN_ORDER_NOT_MET',
            message: `Minimum order amount for this coupon is ₹${(coupon.minOrderInPaise / 100).toFixed(2)}`,
          },
        });
        return;
      }

      let discountInPaise = 0;
      if (coupon.discountType === 'percentage') {
        const calculated = Math.round((subtotalInPaise * coupon.discountValue) / 100);
        discountInPaise = coupon.maxDiscountInPaise ? Math.min(calculated, coupon.maxDiscountInPaise) : calculated;
      } else {
        discountInPaise = coupon.discountValue;
      }

      res.json({
        success: true,
        message: 'Coupon applied successfully',
        data: {
          code: coupon.code,
          discountInPaise,
          description: coupon.description,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'VALIDATE_ERROR', message: error.message } });
    }
  }

  static async getCoupons(req: Request, res: Response): Promise<void> {
    try {
      const coupons = await CouponModel.find().sort({ createdAt: -1 });
      res.json({ success: true, data: coupons });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async createCoupon(req: Request, res: Response): Promise<void> {
    try {
      const coupon = await CouponModel.create({
        ...req.body,
        code: req.body.code.toUpperCase().trim(),
      });

      if (req.user) {
        logAudit('CREATE_COUPON', req.user.phone, req.user.role, { code: coupon.code });
      }

      res.status(201).json({ success: true, data: coupon });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
    }
  }

  static async toggleActive(req: Request, res: Response): Promise<void> {
    try {
      const coupon = await CouponModel.findById(req.params.id);
      if (!coupon) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Coupon not found' } });
        return;
      }
      coupon.isActive = !coupon.isActive;
      await coupon.save();
      res.json({ success: true, data: coupon });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }
}
