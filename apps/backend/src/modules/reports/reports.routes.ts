import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authenticate, requireRoles } from '../../middlewares/auth';

const router = Router();

router.use(authenticate, requireRoles('admin', 'manager'));

router.get('/dashboard', ReportsController.getDashboardMetrics);
router.get('/sales', ReportsController.getSalesReport);

export default router;
