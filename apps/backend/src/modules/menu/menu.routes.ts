import { Router } from 'express';
import { MenuController } from './menu.controller';
import { authenticate, requireRoles } from '../../middlewares/auth';

const router = Router();

// Public routes
router.get('/', MenuController.getMenu);
router.get('/categories', MenuController.getCategories);
router.get('/:id', MenuController.getItem);

// Admin / Manager protected routes
router.post('/categories', authenticate, requireRoles('admin', 'manager'), MenuController.createCategory);
router.post('/items', authenticate, requireRoles('admin', 'manager'), MenuController.createItem);
router.put('/items/:id', authenticate, requireRoles('admin', 'manager'), MenuController.updateItem);
router.patch('/items/:id/toggle-availability', authenticate, requireRoles('admin', 'manager', 'cashier', 'kitchen'), MenuController.toggleAvailability);
router.delete('/items/:id', authenticate, requireRoles('admin', 'manager'), MenuController.deleteItem);

export default router;
