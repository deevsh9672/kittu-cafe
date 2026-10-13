import { Router } from 'express';
import { ReservationsController } from './reservations.controller';
import { authenticate, requireRoles } from '../../middlewares/auth';

const router = Router();

// Customer routes
router.get('/availability', ReservationsController.checkAvailability);
router.post('/', ReservationsController.createReservation);
router.get('/my-reservations', authenticate, ReservationsController.getMyReservations);

// Admin routes
router.get('/admin/all', authenticate, requireRoles('admin', 'manager', 'cashier'), ReservationsController.adminGetReservations);
router.patch('/admin/:id/status', authenticate, requireRoles('admin', 'manager', 'cashier'), ReservationsController.adminUpdateStatus);

export default router;
