import { Router } from 'express';
import { StaffController } from './staff.controller';
import { authenticate, requireRoles } from '../../middlewares/auth';

const router = Router();

router.use(authenticate, requireRoles('admin'));

router.get('/', StaffController.getStaff);
router.post('/', StaffController.createStaff);
router.patch('/:id', StaffController.updateStaffRole);
router.get('/audit-logs', StaffController.getAuditLogs);

export default router;
