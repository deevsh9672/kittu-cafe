import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ExpenseModel } from '../../models';
import { logAudit } from '../../utils/audit';

export const DEMO_EXPENSES = [
  {
    _id: 'exp-1',
    title: 'Cafe Shop Rent (Shiv Colony, Dausa)',
    category: 'rent',
    amountInPaise: 2500000, // ₹25,000.00
    date: new Date(Date.now() - 86400000 * 10),
    description: 'Monthly store rental for Shiv Colony location',
    recordedBy: 'admin',
  },
  {
    _id: 'exp-2',
    title: 'Electricity & Chiller Power Bill (JVVNL)',
    category: 'utilities',
    amountInPaise: 685000, // ₹6,850.00
    date: new Date(Date.now() - 86400000 * 7),
    description: 'Commercial 3-phase electricity consumption',
    recordedBy: 'admin',
  },
  {
    _id: 'exp-3',
    title: 'Cafe Packaging Paper Bags & Cups',
    category: 'supplies',
    amountInPaise: 450000, // ₹4,500.00
    date: new Date(Date.now() - 86400000 * 3),
    description: '500 custom branded Kittu Cafe takeaway boxes and hot cups',
    recordedBy: 'admin',
  },
];

export class ExpensesController {
  static async getExpenses(req: Request, res: Response): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 1) {
        res.json({ success: true, data: DEMO_EXPENSES });
        return;
      }
      const expenses = await ExpenseModel.find().sort({ date: -1 });
      res.json({ success: true, data: expenses });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async createExpense(req: Request, res: Response): Promise<void> {
    try {
      const { title, category, amountInPaise, description, receiptUrl, date } = req.body;
      if (!title || !category || !amountInPaise) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Title, category, amountInPaise required' } });
        return;
      }

      if (mongoose.connection.readyState !== 1) {
        const exp = { _id: `exp-${Date.now()}`, ...req.body, date: date || new Date(), recordedBy: req.user?.email || 'admin' };
        res.status(201).json({ success: true, data: exp });
        return;
      }

      const expense = await ExpenseModel.create({
        title,
        category,
        amountInPaise: Number(amountInPaise),
        description,
        receiptUrl,
        date: date || new Date(),
        recordedBy: req.user?.email || 'admin',
      });

      logAudit('CREATE_EXPENSE', req.user?.phone || 'admin', req.user?.role || 'admin', { expenseId: expense._id, title, amountInPaise });
      res.status(201).json({ success: true, data: expense });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
    }
  }
}
