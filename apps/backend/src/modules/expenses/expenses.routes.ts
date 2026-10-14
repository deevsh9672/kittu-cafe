import { Router } from 'express';
import { ExpensesController } from './expenses.controller';
import { authenticate } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';

const router = Router();

router.get('/', authenticate, ExpensesController.getExpenses);
router.post('/', authenticate, requireRoles(['admin', 'manager']), ExpensesController.createExpense);

export default router;
