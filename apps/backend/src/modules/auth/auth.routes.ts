import { Router } from 'express';
import { AuthController, registerSchema, loginSchema, otpRequestSchema, otpVerifySchema } from './auth.controller';
import { validateBody } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/otp/request', validateBody(otpRequestSchema), AuthController.requestOtp);
router.post('/otp/verify', validateBody(otpVerifySchema), AuthController.verifyOtp);
router.get('/me', authenticate, AuthController.getMe);

export default router;
