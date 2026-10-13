import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { authenticate, requireRoles } from '../../middlewares/auth';

const router = Router();

router.use(authenticate, requireRoles('admin', 'manager', 'kitchen'));

router.get('/', InventoryController.getInventory);
router.post('/create', InventoryController.createIngredient);
router.patch('/:id/adjust', InventoryController.adjustStock);

export default router;
