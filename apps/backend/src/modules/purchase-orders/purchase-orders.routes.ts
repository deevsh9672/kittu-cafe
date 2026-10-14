import { Router } from 'express';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { authenticate } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';

const router = Router();

router.get('/', authenticate, PurchaseOrdersController.getOrders);
router.post('/', authenticate, requireRoles(['admin', 'manager']), PurchaseOrdersController.createOrder);
router.post('/:id/receive', authenticate, requireRoles(['admin', 'manager']), PurchaseOrdersController.receiveOrder);

export default router;
