import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('*'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/kittu_cafe'),
  JWT_SECRET: z.string().default('kittu_cafe_default_jwt_secret_dausa_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().default('kittu_cafe_default_refresh_secret'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_placeholder'),
  RAZORPAY_KEY_SECRET: z.string().default('rzp_secret_placeholder'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('rzp_webhook_secret_placeholder'),
  MOCK_SMS_OTP: z.string().default('true').transform(val => val === 'true'),
  SMS_OTP_DEFAULT: z.string().default('123456'),
  SEED_ADMIN_EMAIL: z.string().default('admin@kittucafe.in'),
  SEED_ADMIN_PASSWORD: z.string().default('KittuAdmin@2026'),
  SEED_ADMIN_PHONE: z.string().default('+919511317456'),
});

export const config = envSchema.parse(process.env);
