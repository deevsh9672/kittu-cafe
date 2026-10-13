import { Router } from 'express';
import { CouponsController } from './coupons.controller';
import { authenticate, requireRoles } from '../../middlewares/auth';

const router = Router();

// Public checkout validation
router.post('/validate', CouponsController.validateCoupon);

// Admin routes
router.get('/', authenticate, requireRoles('admin', 'manager'), CouponsController.getCoupons);
router.post('/', authenticate, requireRoles('admin', 'manager'), CouponsController.createCoupon);
router.patch('/:id/toggle-active', authenticate, requireRoles('admin', 'manager'), CouponsController.toggleActive);

export default router;
