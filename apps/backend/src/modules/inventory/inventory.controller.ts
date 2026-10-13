import { Request, Response } from 'express';
import { IngredientModel } from '../../models';
import { logAudit } from '../../utils/audit';

export class InventoryController {
  static async getInventory(req: Request, res: Response): Promise<void> {
    try {
      const items = await IngredientModel.find().sort({ name: 1 });
      const lowStockItems = items.filter(i => i.currentStock <= i.lowStockThreshold);

      res.json({
        success: true,
        data: {
          items,
          lowStockCount: lowStockItems.length,
          lowStockItems,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async adjustStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adjustment, reason } = req.body; // adjustment can be positive or negative

      const item = await IngredientModel.findById(id);
      if (!item) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ingredient not found' } });
        return;
      }

      item.currentStock = Math.max(0, item.currentStock + Number(adjustment));
      await item.save();

      if (req.user) {
        logAudit('ADJUST_STOCK', req.user.phone, req.user.role, {
          ingredientId: item._id,
          name: item.name,
          adjustment,
          newStock: item.currentStock,
          reason,
        });
      }

      res.json({ success: true, message: 'Stock adjusted', data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'ADJUST_ERROR', message: error.message } });
    }
  }

  static async createIngredient(req: Request, res: Response): Promise<void> {
    try {
      const { name, unit, currentStock, lowStockThreshold, costPerUnitInPaise } = req.body;
      const item = await IngredientModel.create({
        name,
        unit,
        currentStock: Number(currentStock),
        lowStockThreshold: Number(lowStockThreshold),
        costPerUnitInPaise: Number(costPerUnitInPaise || 0),
      });
      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
    }
  }
}
