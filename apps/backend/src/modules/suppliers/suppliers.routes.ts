import { Router } from 'express';
import { SuppliersController } from './suppliers.controller';
import { authenticate } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';

const router = Router();

router.get('/', authenticate, SuppliersController.getSuppliers);
router.post('/', authenticate, requireRoles(['admin', 'manager']), SuppliersController.createSupplier);
router.put('/:id', authenticate, requireRoles(['admin', 'manager']), SuppliersController.updateSupplier);
router.patch('/:id', authenticate, requireRoles(['admin', 'manager']), SuppliersController.updateSupplier);
router.delete('/:id', authenticate, requireRoles(['admin', 'manager']), SuppliersController.deleteSupplier);

export default router;
