import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { authenticate } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';

const router = Router();

// Public / Staff read items
router.get('/', authenticate, InventoryController.getItems);
router.get('/alerts', authenticate, InventoryController.getAlerts);
router.get('/movements', authenticate, InventoryController.getMovements);

// Staff with inventory permissions
router.post(
  '/',
  authenticate,
  requireRoles(['admin', 'manager']),
  InventoryController.createItem
);

router.put(
  '/:id',
  authenticate,
  requireRoles(['admin', 'manager']),
  InventoryController.updateItem
);

router.patch(
  '/:id',
  authenticate,
  requireRoles(['admin', 'manager']),
  InventoryController.updateItem
);

router.patch(
  '/:id/adjust',
  authenticate,
  requireRoles(['admin', 'manager', 'cashier']),
  InventoryController.quickAdjust
);

router.delete(
  '/:id',
  authenticate,
  requireRoles(['admin', 'manager']),
  InventoryController.deleteItem
);

router.post(
  '/:id/operate',
  authenticate,
  requireRoles(['admin', 'manager', 'cashier']),
  InventoryController.recordOperation
);

export default router;
