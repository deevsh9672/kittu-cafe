import { Router } from 'express';
import { RestaurantController } from './restaurant.controller';
import { authenticate, requireRoles } from '../../middlewares/auth';

const router = Router();

// Public route
router.get('/', RestaurantController.getDetails);

// Admin-only update route
router.put('/admin', authenticate, requireRoles('admin', 'manager'), RestaurantController.updateDetails);

export default router;
