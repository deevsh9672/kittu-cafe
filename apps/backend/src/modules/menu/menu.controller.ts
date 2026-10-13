import { Request, Response } from 'express';
import { MenuCategoryModel, MenuItemModel } from '../../models';
import { logAudit } from '../../utils/audit';

export class MenuController {
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await MenuCategoryModel.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
      res.json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, icon, sortOrder } = req.body;
      const category = await MenuCategoryModel.create({
        name,
        description,
        icon,
        sortOrder: sortOrder || 0,
      });
      if (req.user) {
        logAudit('CREATE_CATEGORY', req.user.phone, req.user.role, { categoryId: category._id, name });
      }
      res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
    }
  }

  static async getMenu(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, dietaryType, search, isFeatured, isBestseller, availableOnly } = req.query;

      const filter: any = {};
      if (availableOnly !== 'false') {
        filter.isAvailable = true;
      }
      if (categoryId) {
        filter.categoryId = categoryId;
      }
      if (dietaryType) {
        filter.dietaryType = dietaryType;
      }
      if (isFeatured === 'true') {
        filter.isFeatured = true;
      }
      if (isBestseller === 'true') {
        filter.isBestseller = true;
      }
      if (search && typeof search === 'string') {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const items = await MenuItemModel.find(filter)
        .populate('categoryId', 'name icon sortOrder')
        .sort({ isBestseller: -1, name: 1 });

      const categories = await MenuCategoryModel.find({ isActive: true }).sort({ sortOrder: 1 });

      res.json({
        success: true,
        data: {
          categories,
          items,
          count: items.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async getItem(req: Request, res: Response): Promise<void> {
    try {
      const item = await MenuItemModel.findById(req.params.id).populate('categoryId', 'name icon');
      if (!item) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
        return;
      }
      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  static async createItem(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        description,
        categoryId,
        basePriceInPaise,
        imageUrl,
        dietaryType,
        isAvailable,
        isFeatured,
        isBestseller,
        preparationTimeMinutes,
        variants,
        addOnGroups,
      } = req.body;

      const item = await MenuItemModel.create({
        name,
        description,
        categoryId,
        basePriceInPaise: Number(basePriceInPaise),
        imageUrl,
        dietaryType: dietaryType || 'veg',
        isAvailable: isAvailable ?? true,
        isFeatured: isFeatured ?? false,
        isBestseller: isBestseller ?? false,
        preparationTimeMinutes: preparationTimeMinutes || 15,
        variants: variants || [],
        addOnGroups: addOnGroups || [],
      });

      if (req.user) {
        logAudit('CREATE_MENU_ITEM', req.user.phone, req.user.role, { itemId: item._id, name });
      }

      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
    }
  }

  static async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const item = await MenuItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!item) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
        return;
      }

      if (req.user) {
        logAudit('UPDATE_MENU_ITEM', req.user.phone, req.user.role, { itemId: item._id, updates: req.body });
      }

      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }

  static async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const item = await MenuItemModel.findByIdAndDelete(req.params.id);
      if (!item) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
        return;
      }

      if (req.user) {
        logAudit('DELETE_MENU_ITEM', req.user.phone, req.user.role, { itemId: item._id, name: item.name });
      }

      res.json({ success: true, message: 'Menu item deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } });
    }
  }

  static async toggleAvailability(req: Request, res: Response): Promise<void> {
    try {
      const item = await MenuItemModel.findById(req.params.id);
      if (!item) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
        return;
      }

      item.isAvailable = !item.isAvailable;
      await item.save();

      if (req.user) {
        logAudit('TOGGLE_AVAILABILITY', req.user.phone, req.user.role, {
          itemId: item._id,
          isAvailable: item.isAvailable,
        });
      }

      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }
}
