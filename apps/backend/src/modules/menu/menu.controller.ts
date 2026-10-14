import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { MenuCategoryModel, MenuItemModel } from '../../models';
import { logAudit } from '../../utils/audit';

const FALLBACK_CATEGORIES = [
  { _id: 'c1', name: 'Hot & Cold Coffee', description: 'Fresh espresso brews & frappes', icon: 'coffee', sortOrder: 1, isActive: true },
  { _id: 'c2', name: 'Burgers & Sandwiches', description: 'Gourmet sandwiches & burgers', icon: 'sandwich', sortOrder: 2, isActive: true },
  { _id: 'c3', name: 'Pizzas & Garlic Breads', description: 'Stone baked crispy pizzas', icon: 'pizza', sortOrder: 3, isActive: true },
  { _id: 'c4', name: 'Snacks & Sides', description: 'Fries, nachos & bites', icon: 'utensils', sortOrder: 4, isActive: true },
  { _id: 'c5', name: 'Desserts & Shakes', description: 'Thick shakes & brownies', icon: 'ice-cream', sortOrder: 5, isActive: true },
];

const FALLBACK_ITEMS = [
  {
    _id: 'seed-coffee-1',
    name: 'Classic Handcrafted Cappuccino',
    description: 'Rich double-shot espresso topped with velvet steamed milk froth.',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=900&auto=format&fit=crop&q=85',
    categoryId: 'c1',
    basePriceInPaise: 11000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 8,
    variants: [
      { name: 'Regular (250ml)', priceInPaise: 11000, isDefault: true },
      { name: 'Large (350ml)', priceInPaise: 14000 },
    ],
    addOnGroups: [],
  },
  {
    _id: 'seed-coffee-2',
    name: 'Kittu Hazelnut Cold Coffee',
    description: 'Creamy chilled thick blend with roasted hazelnut syrup and ice cream.',
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=85',
    categoryId: 'c1',
    basePriceInPaise: 14000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 10,
    variants: [
      { name: 'Regular', priceInPaise: 14000, isDefault: true },
      { name: 'Thick Frappe', priceInPaise: 17000 },
    ],
    addOnGroups: [],
  },
  {
    _id: 'seed-sandwich-1',
    name: 'Grilled Paneer Tikka Sandwich',
    description: 'Marinated cottage cheese, capsicum, onions, mint chutney, and molten cheese.',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=900&auto=format&fit=crop&q=85',
    categoryId: 'c2',
    basePriceInPaise: 13000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 12,
    variants: [],
    addOnGroups: [],
  },
  {
    _id: 'seed-burger-1',
    name: 'Crispy Veg Supreme Burger',
    description: 'Spiced potato & herb patty with crisp lettuce, sliced tomato, cheese, and special cafe dressing.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=85',
    categoryId: 'c2',
    basePriceInPaise: 12000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 10,
    variants: [],
    addOnGroups: [],
  },
  {
    _id: 'seed-pizza-1',
    name: 'Veg Loaded Farmhouse Pizza',
    description: 'Crispy base loaded with fresh mozzarella, capsicum, red onions, and sweet corn.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=85',
    categoryId: 'c3',
    basePriceInPaise: 22000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 18,
    variants: [
      { name: 'Medium (8 inch)', priceInPaise: 22000, isDefault: true },
      { name: 'Large (10 inch)', priceInPaise: 32000 },
    ],
    addOnGroups: [],
  },
  {
    _id: 'seed-snacks-1',
    name: 'Peri Peri Masala Fries',
    description: 'Crispy golden potato fries tossed in fiery African peri peri spice blend.',
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=900&auto=format&fit=crop&q=85',
    categoryId: 'c4',
    basePriceInPaise: 9000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 8,
    variants: [],
    addOnGroups: [],
  },
  {
    _id: 'seed-dessert-1',
    name: 'Sizzling Hot Brownie with Vanilla Ice Cream',
    description: 'Warm fudge brownie served sizzling with rich chocolate sauce and cold vanilla ice cream.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&auto=format&fit=crop&q=85',
    categoryId: 'c5',
    basePriceInPaise: 15000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 10,
    variants: [],
    addOnGroups: [],
  },
  {
    _id: 'seed-dessert-2',
    name: 'Belgian Chocolate Thick Shake',
    description: 'Rich dark chocolate ganache blended with premium dairy cream and ice cream.',
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900&auto=format&fit=crop&q=85',
    categoryId: 'c5',
    basePriceInPaise: 16000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 7,
    variants: [],
    addOnGroups: [],
  },
];

export class MenuController {
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 1) {
        res.json({ success: true, data: FALLBACK_CATEGORIES });
        return;
      }
      const categories = await MenuCategoryModel.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
      res.json({ success: true, data: categories });
    } catch {
      res.json({ success: true, data: FALLBACK_CATEGORIES });
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
      if (mongoose.connection.readyState !== 1) {
        let items = FALLBACK_ITEMS;
        if (req.query.categoryId) {
          items = items.filter((i) => i.categoryId === req.query.categoryId);
        }
        res.json({
          success: true,
          data: {
            categories: FALLBACK_CATEGORIES,
            items,
            count: items.length,
          },
        });
        return;
      }

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
    } catch {
      let items = FALLBACK_ITEMS;
      if (req.query.categoryId) {
        items = items.filter((i) => i.categoryId === req.query.categoryId);
      }
      res.json({
        success: true,
        data: {
          categories: FALLBACK_CATEGORIES,
          items,
          count: items.length,
        },
      });
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
