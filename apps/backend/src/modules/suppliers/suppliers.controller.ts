import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { SupplierModel } from '../../models';
import { logAudit } from '../../utils/audit';

export const DEMO_SUPPLIERS = [
  {
    _id: 'sup-1',
    name: 'Dausa Beverage & Chiller Distributors',
    contactPerson: 'Mukesh Sharma',
    phone: '+91 98290 11223',
    email: 'sales@dausabeverages.com',
    address: 'Shop 14, Mandi Road, Dausa, Rajasthan 303303',
    gstin: '08AAAAA0000A1Z5',
    paymentTerms: 'Net 15 days',
    categoriesSupplied: ['Cold Drinks', 'Energy Drinks', 'Packaged Water'],
    notes: 'Primary supplier for Red Bull, Coke, and Sprite cans.',
    isActive: true,
  },
  {
    _id: 'sup-2',
    name: 'Rajasthan Dairy & Farm Fresh',
    contactPerson: 'Rajesh Meena',
    phone: '+91 94140 44556',
    email: 'orders@rajdairydausa.in',
    address: 'Near Old Bus Stand, Dausa, Rajasthan 303303',
    gstin: '08BBBBB1111B2Z4',
    paymentTerms: 'Weekly Cash / UPI',
    categoriesSupplied: ['Dairy', 'Paneer', 'Cheese'],
    notes: 'Daily morning delivery of fresh cow milk and malai paneer.',
    isActive: true,
  },
  {
    _id: 'sup-3',
    name: 'Jaipur Roasters & Bakery Supplies',
    contactPerson: 'Anand Verma',
    phone: '+91 98281 77889',
    email: 'supplies@jaipurroasters.com',
    address: 'MI Road, Jaipur, Rajasthan 302001',
    paymentTerms: 'Advance / 30 Days',
    categoriesSupplied: ['Coffee', 'Syrups', 'Bakery'],
    notes: 'Speciality arabica beans and stone-baked pizza bases.',
    isActive: true,
  },
];

export let IN_MEMORY_SUPPLIERS = [...DEMO_SUPPLIERS];

export class SuppliersController {
  static async getSuppliers(req: Request, res: Response): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 1) {
        res.json({ success: true, data: IN_MEMORY_SUPPLIERS.filter(s => s.isActive !== false) });
        return;
      }
      const suppliers = await SupplierModel.find({ isActive: { $ne: false } }).sort({ name: 1 });
      res.json({ success: true, data: suppliers });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async createSupplier(req: Request, res: Response): Promise<void> {
    try {
      const { name, contactPerson, phone, email, address, gstin, paymentTerms, categoriesSupplied, notes } = req.body;
      if (!name || !contactPerson || !phone) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Name, contactPerson, and phone are required' } });
        return;
      }

      if (mongoose.connection.readyState !== 1) {
        const sup = { _id: `sup-${Date.now()}`, ...req.body, isActive: true };
        IN_MEMORY_SUPPLIERS.unshift(sup);
        res.status(201).json({ success: true, data: sup, message: 'Supplier added successfully' });
        return;
      }

      const supplier = await SupplierModel.create({
        name,
        contactPerson,
        phone,
        email,
        address,
        gstin,
        paymentTerms,
        categoriesSupplied: categoriesSupplied || [],
        notes,
      });

      logAudit('CREATE_SUPPLIER', req.user?.phone || 'admin', req.user?.role || 'admin', { supplierId: supplier._id, name });
      res.status(201).json({ success: true, data: supplier, message: 'Supplier added successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
    }
  }

  static async updateSupplier(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (mongoose.connection.readyState !== 1) {
        const idx = IN_MEMORY_SUPPLIERS.findIndex(s => s._id === id);
        if (idx === -1) {
          res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Supplier not found' } });
          return;
        }
        IN_MEMORY_SUPPLIERS[idx] = { ...IN_MEMORY_SUPPLIERS[idx], ...updates, updatedAt: new Date() };
        res.json({ success: true, data: IN_MEMORY_SUPPLIERS[idx], message: 'Supplier updated successfully' });
        return;
      }

      const supplier = await SupplierModel.findByIdAndUpdate(id, updates, { new: true });
      if (!supplier) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Supplier not found' } });
        return;
      }
      res.json({ success: true, data: supplier, message: 'Supplier updated successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }

  static async deleteSupplier(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (mongoose.connection.readyState !== 1) {
        const idx = IN_MEMORY_SUPPLIERS.findIndex(s => s._id === id);
        if (idx === -1) {
          res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Supplier not found' } });
          return;
        }
        IN_MEMORY_SUPPLIERS.splice(idx, 1);
        res.json({ success: true, message: 'Supplier deleted successfully', data: { id } });
        return;
      }

      const supplier = await SupplierModel.findByIdAndDelete(id);
      if (!supplier) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Supplier not found' } });
        return;
      }
      res.json({ success: true, message: 'Supplier deleted successfully', data: { id } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } });
    }
  }
}
