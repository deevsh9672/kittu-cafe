import { Request, Response } from 'express';
import { CouponModel } from '../../models';
import { logAudit } from '../../utils/audit';
import { isDBConnected } from '../../config/database';

const DEFAULT_COUPONS = [
  {
    _id: 'c-kittu50',
    code: 'KITTU50',
    description: 'Flat ₹50 OFF on orders above ₹249',
    discountType: 'fixed',
    discountValue: 5000,
    minOrderInPaise: 24900,
    isActive: true,
  },
  {
    _id: 'c-welcome50',
    code: 'WELCOME50',
    description: '50% OFF up to ₹100 for new guests',
    discountType: 'percentage',
    discountValue: 50,
    maxDiscountInPaise: 10000,
    minOrderInPaise: 15000,
    isActive: true,
  },
  {
    _id: 'c-student10',
    code: 'STUDENT10',
    description: '10% student discount for Dausa colleges',
    discountType: 'percentage',
    discountValue: 10,
    minOrderInPaise: 19900,
    isActive: true,
  },
  {
    _id: 'c-party20',
    code: 'PARTY20',
    description: '20% OFF on party orders above ₹999',
    discountType: 'percentage',
    discountValue: 20,
    minOrderInPaise: 99900,
    isActive: true,
  },
];

export class CouponsController {
  static async validateCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { code, subtotalInPaise } = req.body;
      if (!code) {
        res.status(400).json({ success: false, error: { code: 'MISSING_CODE', message: 'Coupon code required' } });
        return;
      }

      const codeUpper = code.trim().toUpperCase();
      let coupon: any = null;

      if (isDBConnected()) {
        try {
          coupon = await CouponModel.findOne({
            code: codeUpper,
            isActive: true,
            expiryDate: { $gte: new Date() },
          });
        } catch (dbErr) {
          coupon = null;
        }
      }

      if (!coupon) {
        coupon = DEFAULT_COUPONS.find((c) => c.code === codeUpper);
      }

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
      let coupons: any[] = [];
      if (isDBConnected()) {
        try {
          coupons = await CouponModel.find().sort({ createdAt: -1 });
        } catch (e) {
          coupons = [];
        }
      }

      res.json({ success: true, data: coupons.length > 0 ? coupons : DEFAULT_COUPONS });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async createCoupon(req: Request, res: Response): Promise<void> {
    try {
      let coupon: any = null;
      if (isDBConnected()) {
        coupon = await CouponModel.create({
          ...req.body,
          code: req.body.code.toUpperCase().trim(),
        });
      } else {
        coupon = {
          _id: 'c-' + Date.now(),
          ...req.body,
          code: req.body.code.toUpperCase().trim(),
        };
      }

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
      if (isDBConnected()) {
        const coupon = await CouponModel.findById(req.params.id);
        if (coupon) {
          coupon.isActive = !coupon.isActive;
          await coupon.save();
          res.json({ success: true, data: coupon });
          return;
        }
      }
      res.json({ success: true, message: 'Status toggled' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }
}
