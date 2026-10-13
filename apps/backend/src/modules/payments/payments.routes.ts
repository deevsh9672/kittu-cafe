import { Router } from 'express';
import { PaymentsController } from './payments.controller';
import { authenticate, requireRoles } from '../../middlewares/auth';

const router = Router();

// Client verification after Razorpay checkout completion
router.post('/verify', PaymentsController.verifyPayment);

// Razorpay webhook endpoint
router.post('/webhooks/razorpay', PaymentsController.handleWebhook);

// Authorized refund endpoint
router.post('/refund', authenticate, requireRoles('admin', 'manager'), PaymentsController.processRefund);

export default router;
