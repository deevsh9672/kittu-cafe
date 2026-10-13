import { Router } from 'express';
import { KDSController } from './kds.controller';
import { authenticate, requireRoles } from '../../middlewares/auth';

const router = Router();

// Tablet KDS screen accessible by kitchen staff, managers, and admin
router.get(
  '/orders',
  authenticate,
  requireRoles('admin', 'manager', 'kitchen', 'cashier'),
  KDSController.getActiveOrders
);

router.patch(
  '/orders/:id/status',
  authenticate,
  requireRoles('admin', 'manager', 'kitchen'),
  KDSController.updateOrderStatus
);

export default router;
