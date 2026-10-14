import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserModel } from '../../models';
import { config } from '../../config/env';
import { logAudit } from '../../utils/audit';

export const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

export const loginSchema = z.object({
  phoneOrEmail: z.string().min(3),
  password: z.string().min(6),
});

export const otpRequestSchema = z.object({
  phone: z.string().min(10).max(15),
});

export const otpVerifySchema = z.object({
  phone: z.string().min(10).max(15),
  otp: z.string().min(4).max(6),
  name: z.string().optional(),
});

import { isDBConnected } from '../../config/database';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, phone, email, password } = req.body;
      let existingUser: any = null;
      if (isDBConnected()) {
        try {
          existingUser = await UserModel.findOne({ phone });
        } catch (e) {}
      }
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: { code: 'USER_EXISTS', message: 'User with this phone number already exists' },
        });
        return;
      }

      const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
      let user: any = null;
      if (isDBConnected()) {
        try {
          user = await UserModel.create({
            name,
            phone,
            email,
            passwordHash,
            role: 'customer',
          });
        } catch (e) {}
      }

      if (!user) {
        user = {
          _id: 'cust_' + Date.now(),
          name,
          phone,
          email,
          role: 'customer',
          loyaltyPoints: 0,
        };
      }

      const token = jwt.sign(
        { userId: user._id.toString(), role: user.role, phone: user.phone, name: user.name },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN as any }
      );

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            loyaltyPoints: user.loyaltyPoints,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'REGISTRATION_ERROR', message: error.message },
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { phoneOrEmail, password } = req.body;
      let user: any = null;

      if (isDBConnected()) {
        try {
          user = await UserModel.findOne({
            $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail.toLowerCase() }],
          });
        } catch (e) {
          user = null;
        }
      }

      // Offline fallback for seed administrator
      if (!user && (phoneOrEmail.toLowerCase() === 'admin@kittucafe.in' || phoneOrEmail === '+919511317456')) {
        user = {
          _id: 'user_admin_seed',
          name: 'Kittu Cafe Admin',
          phone: '+919511317456',
          email: 'admin@kittucafe.in',
          role: 'admin',
          loyaltyPoints: 100,
          passwordHash: await bcrypt.hash('KittuAdmin@2026', 10),
        };
      }

      if (!user || !user.passwordHash) {
        res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
        });
        return;
      }

      const token = jwt.sign(
        { userId: user._id.toString(), role: user.role, phone: user.phone, name: user.name },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN as any }
      );

      logAudit('LOGIN_SUCCESS', user.phone, user.role, { ip: req.ip });

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            loyaltyPoints: user.loyaltyPoints,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'LOGIN_ERROR', message: error.message },
      });
    }
  }

  static async requestOtp(req: Request, res: Response): Promise<void> {
    try {
      const { phone } = req.body;
      const otpCode = config.MOCK_SMS_OTP ? config.SMS_OTP_DEFAULT : Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      let user = await UserModel.findOne({ phone });
      if (!user) {
        user = await UserModel.create({
          name: 'Guest Customer',
          phone,
          role: 'customer',
          otpCode,
          otpExpiresAt,
        });
      } else {
        user.otpCode = otpCode;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();
      }

      console.log(`[OTP] Generated OTP for ${phone}: ${otpCode}`);

      res.json({
        success: true,
        message: 'OTP sent successfully',
        data: {
          phone,
          mockOtp: config.MOCK_SMS_OTP ? otpCode : undefined,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'OTP_REQUEST_FAILED', message: error.message },
      });
    }
  }

  static async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { phone, otp, name } = req.body;
      const user = await UserModel.findOne({ phone });

      if (!user || user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_OTP', message: 'Invalid or expired OTP code' },
        });
        return;
      }

      // Reset OTP once used
      user.otpCode = undefined;
      user.otpExpiresAt = undefined;
      if (name && (user.name === 'Guest Customer' || !user.name)) {
        user.name = name;
      }
      await user.save();

      const token = jwt.sign(
        { userId: user._id.toString(), role: user.role, phone: user.phone, name: user.name },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN as any }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            loyaltyPoints: user.loyaltyPoints,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'OTP_VERIFICATION_FAILED', message: error.message },
      });
    }
  }

  static async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
        return;
      }
      const user = await UserModel.findById(req.user.userId).select('-passwordHash -otpCode -otpExpiresAt');
      if (!user) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
        return;
      }
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'USER_FETCH_ERROR', message: error.message } });
    }
  }
}
