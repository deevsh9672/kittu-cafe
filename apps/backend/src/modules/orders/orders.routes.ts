import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authenticate, requireRoles } from '../../middlewares/auth';

const router = Router();

// Customer facing routes
router.post('/calculate', OrdersController.calculate);
router.post('/', OrdersController.createOrder); // Guest or authenticated
router.get('/', OrdersController.adminGetOrders);
router.get('/my-orders', authenticate, OrdersController.getMyOrders);
router.get('/:id', OrdersController.getOrderById);
router.patch('/:id/cancel', OrdersController.cancelOrder);

// Admin / Staff routes
router.get(
  '/admin/all',
  authenticate,
  requireRoles('admin', 'manager', 'cashier'),
  OrdersController.adminGetOrders
);
router.patch(
  '/admin/:id/status',
  authenticate,
  requireRoles('admin', 'manager', 'cashier', 'kitchen', 'delivery'),
  OrdersController.adminUpdateStatus
);
router.patch(
  '/admin/:id/payment',
  authenticate,
  requireRoles('admin', 'manager', 'cashier'),
  OrdersController.adminUpdatePayment
);

export default router;
