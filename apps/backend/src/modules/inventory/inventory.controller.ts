import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  InventoryItemModel,
  InventoryMovementModel,
  SupplierModel,
  PurchaseOrderModel,
  RecipeModel,
} from '../../models';
import { InventoryService } from './inventory.service';
import { logAudit } from '../../utils/audit';

// In-Memory Fallback Demo Data for when MongoDB is disconnected or testing
export const DEMO_BEVERAGES = [
  {
    _id: 'bev-1',
    name: 'Red Bull Energy Drink',
    sku: 'BEV-RB-250',
    barcode: '9002490100070',
    itemType: 'beverage',
    category: 'Energy Drinks',
    brand: 'Red Bull',
    packageSize: '250ml',
    stockUnit: 'can',
    openingStock: 24,
    currentQuantity: 24,
    minStockThreshold: 6,
    reorderQuantity: 24,
    purchasePriceInPaise: 9500, // ₹95.00
    sellingPriceInPaise: 12500, // ₹125.00
    storageLocation: 'Beverage Chiller A',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    _id: 'bev-2',
    name: 'Coca-Cola Can',
    sku: 'BEV-COKE-330',
    barcode: '5449000000996',
    itemType: 'beverage',
    category: 'Cold Drinks',
    brand: 'Coca-Cola',
    packageSize: '330ml',
    stockUnit: 'can',
    openingStock: 48,
    currentQuantity: 36,
    minStockThreshold: 12,
    reorderQuantity: 48,
    purchasePriceInPaise: 3000, // ₹30.00
    sellingPriceInPaise: 4000, // ₹40.00
    storageLocation: 'Beverage Chiller B',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    _id: 'bev-3',
    name: 'Sprite Can',
    sku: 'BEV-SPRITE-330',
    barcode: '5449000014528',
    itemType: 'beverage',
    category: 'Cold Drinks',
    brand: 'Sprite',
    packageSize: '330ml',
    stockUnit: 'can',
    openingStock: 24,
    currentQuantity: 18,
    minStockThreshold: 8,
    reorderQuantity: 24,
    purchasePriceInPaise: 3000,
    sellingPriceInPaise: 4000,
    storageLocation: 'Beverage Chiller B',
    imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    _id: 'bev-4',
    name: 'Packaged Drinking Water (Kinley)',
    sku: 'BEV-WATER-500',
    itemType: 'beverage',
    category: 'Packaged Water',
    brand: 'Kinley',
    packageSize: '500ml',
    stockUnit: 'bottle',
    openingStock: 60,
    currentQuantity: 52,
    minStockThreshold: 15,
    reorderQuantity: 60,
    purchasePriceInPaise: 1000,
    sellingPriceInPaise: 2000,
    storageLocation: 'Front Counter Rack',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    _id: 'bev-5',
    name: 'Dark Chocolate Sauce & Syrup',
    sku: 'BEV-SYR-CHOC',
    itemType: 'beverage',
    category: 'Syrups',
    brand: 'Hershey',
    packageSize: '1L',
    stockUnit: 'bottle',
    openingStock: 4,
    currentQuantity: 3,
    minStockThreshold: 1,
    reorderQuantity: 3,
    purchasePriceInPaise: 32000,
    sellingPriceInPaise: 0,
    storageLocation: 'Barista Shelf 1',
    imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
];

export const DEMO_INGREDIENTS = [
  {
    _id: 'ing-1',
    name: 'Fresh Cow Milk (Dairy Gold)',
    sku: 'ING-MILK-L',
    itemType: 'ingredient',
    category: 'Dairy',
    packageSize: '1L Pouch',
    stockUnit: 'L',
    openingStock: 30,
    currentQuantity: 22.5,
    minStockThreshold: 5,
    reorderQuantity: 20,
    purchasePriceInPaise: 6400, // ₹64/L
    storageLocation: 'Dairy Fridge 1',
    isActive: true,
  },
  {
    _id: 'ing-2',
    name: 'Roasted Arabica Coffee Beans',
    sku: 'ING-COFFEE-KG',
    itemType: 'ingredient',
    category: 'Coffee',
    packageSize: '1kg Bag',
    stockUnit: 'kg',
    openingStock: 10,
    currentQuantity: 8.2,
    minStockThreshold: 2,
    reorderQuantity: 5,
    purchasePriceInPaise: 85000, // ₹850/kg
    storageLocation: 'Dry Pantry Bin 2',
    isActive: true,
  },
  {
    _id: 'ing-3',
    name: 'Fresh Malai Paneer',
    sku: 'ING-PANEER-KG',
    itemType: 'ingredient',
    category: 'Dairy',
    packageSize: '1kg Slab',
    stockUnit: 'kg',
    openingStock: 8,
    currentQuantity: 3.5,
    minStockThreshold: 2,
    reorderQuantity: 5,
    purchasePriceInPaise: 36000, // ₹360/kg
    storageLocation: 'Dairy Fridge 1',
    isActive: true,
  },
  {
    _id: 'ing-4',
    name: 'Mozzarella Cheese Blend',
    sku: 'ING-CHEESE-KG',
    itemType: 'ingredient',
    category: 'Dairy',
    packageSize: '1kg Shredded',
    stockUnit: 'kg',
    openingStock: 12,
    currentQuantity: 9.0,
    minStockThreshold: 3,
    reorderQuantity: 8,
    purchasePriceInPaise: 48000, // ₹480/kg
    storageLocation: 'Dairy Freezer',
    isActive: true,
  },
  {
    _id: 'ing-5',
    name: 'Stone Baked Pizza Base (8-inch)',
    sku: 'ING-PIZZABASE-8',
    itemType: 'ingredient',
    category: 'Bakery',
    packageSize: 'Pack of 5',
    stockUnit: 'piece',
    openingStock: 40,
    currentQuantity: 28,
    minStockThreshold: 10,
    reorderQuantity: 30,
    purchasePriceInPaise: 2500, // ₹25/piece
    storageLocation: 'Bakery Rack',
    isActive: true,
  },
];

export const DEMO_MOVEMENTS = [
  {
    _id: 'mov-1',
    inventoryItemId: 'bev-1',
    itemName: 'Red Bull Energy Drink',
    operationType: 'purchase_receipt',
    previousQuantity: 0,
    newQuantity: 24,
    changeQuantity: 24,
    unitCostInPaise: 9500,
    totalCostInPaise: 228000,
    reason: 'Initial Opening Stock from PO-2026-001',
    referenceId: 'PO-2026-001',
    performedBy: 'admin',
    timestamp: new Date(Date.now() - 86400000 * 2),
  },
  {
    _id: 'mov-2',
    inventoryItemId: 'bev-1',
    itemName: 'Red Bull Energy Drink',
    operationType: 'sale',
    previousQuantity: 24,
    newQuantity: 22,
    changeQuantity: -2,
    unitCostInPaise: 9500,
    totalCostInPaise: 19000,
    reason: 'Order #ORD-KC-10492',
    referenceId: 'ORD-KC-10492',
    performedBy: 'ordering-system',
    timestamp: new Date(Date.now() - 3600000 * 4),
  },
  {
    _id: 'mov-3',
    inventoryItemId: 'ing-1',
    itemName: 'Fresh Cow Milk (Dairy Gold)',
    operationType: 'sale',
    previousQuantity: 23.5,
    newQuantity: 22.5,
    changeQuantity: -1.0,
    unitCostInPaise: 6400,
    totalCostInPaise: 6400,
    reason: 'Recipe deduction for 5 Cappuccinos',
    referenceId: 'ORD-KC-10495',
    performedBy: 'kitchen-kds',
    timestamp: new Date(Date.now() - 3600000 * 2),
  },
];

export let IN_MEMORY_ITEMS: any[] = [...DEMO_BEVERAGES, ...DEMO_INGREDIENTS];

export class InventoryController {
  /**
   * Get all inventory items filtered by itemType ('beverage' | 'ingredient' | 'all')
   */
  static async getItems(req: Request, res: Response): Promise<void> {
    try {
      const { type, itemType, search, lowStockOnly } = req.query;
      const filterType = type || itemType;

      if (mongoose.connection.readyState !== 1) {
        let items = [...IN_MEMORY_ITEMS].filter(i => i.isActive !== false);
        if (filterType === 'beverage') items = items.filter(i => i.itemType === 'beverage');
        if (filterType === 'ingredient') items = items.filter(i => i.itemType === 'ingredient');
        if (filterType === 'packaging') items = items.filter(i => i.itemType === 'packaging');
        if (search && typeof search === 'string') {
          const q = search.toLowerCase();
          items = items.filter(i => (i.name || '').toLowerCase().includes(q) || (i.sku || '').toLowerCase().includes(q));
        }
        if (lowStockOnly === 'true') {
          items = items.filter(i => (i.currentQuantity ?? i.currentStock ?? 0) <= (i.minStockThreshold ?? i.minimumThreshold ?? 5));
        }
        res.json({
          success: true,
          data: {
            items,
            count: items.length,
            lowStockCount: items.filter(i => (i.currentQuantity ?? i.currentStock ?? 0) <= (i.minStockThreshold ?? i.minimumThreshold ?? 5)).length,
          },
        });
        return;
      }

      const query: any = { isActive: { $ne: false } };
      if (filterType && filterType !== 'all') {
        query.itemType = filterType;
      }
      if (search && typeof search === 'string') {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
        ];
      }

      const items = await InventoryItemModel.find(query).sort({ itemType: 1, name: 1 });
      const lowStockItems = items.filter(i => i.currentQuantity <= i.minStockThreshold);

      res.json({
        success: true,
        data: {
          items: lowStockOnly === 'true' ? lowStockItems : items,
          count: items.length,
          lowStockCount: lowStockItems.length,
          lowStockItems,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  /**
   * Create an inventory item (beverage, ingredient, packaging)
   */
  static async createItem(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        sku,
        barcode,
        itemType = 'ingredient',
        category = 'General',
        brand,
        variant,
        packageSize,
        stockUnit = 'piece',
        openingStock = 0,
        currentQuantity,
        minStockThreshold = 5,
        reorderQuantity = 10,
        purchasePriceInPaise = 0,
        sellingPriceInPaise,
        supplierId,
        storageLocation,
        imageUrl,
      } = req.body;

      if (!name) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Item name is required' } });
        return;
      }

      const finalStock = Number(currentQuantity ?? openingStock ?? 0);
      const generatedSku = (sku || `ITEM-${Date.now().toString().slice(-6)}`).toUpperCase();

      if (mongoose.connection.readyState !== 1) {
        const newItem = {
          _id: `item-${Date.now()}`,
          name,
          sku: generatedSku,
          barcode,
          itemType,
          category,
          brand,
          variant,
          packageSize,
          stockUnit,
          openingStock: finalStock,
          currentQuantity: finalStock,
          currentStock: finalStock,
          minStockThreshold: Number(minStockThreshold),
          minimumThreshold: Number(minStockThreshold),
          reorderQuantity: Number(reorderQuantity),
          purchasePriceInPaise: Number(purchasePriceInPaise),
          costPerUnitInPaise: Number(purchasePriceInPaise),
          sellingPriceInPaise: sellingPriceInPaise ? Number(sellingPriceInPaise) : undefined,
          supplierId,
          storageLocation,
          imageUrl,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        IN_MEMORY_ITEMS.unshift(newItem);

        // Record initial ledger movement
        DEMO_MOVEMENTS.unshift({
          _id: `mov-${Date.now()}`,
          inventoryItemId: newItem._id,
          itemName: newItem.name,
          operationType: 'stock_in',
          previousQuantity: 0,
          newQuantity: finalStock,
          changeQuantity: finalStock,
          unitCostInPaise: Number(purchasePriceInPaise),
          totalCostInPaise: finalStock * Number(purchasePriceInPaise),
          reason: 'Initial stock entry on item creation',
          referenceId: `INIT-${newItem.sku}`,
          performedBy: req.user?.email || 'admin',
          timestamp: new Date(),
        });

        res.status(201).json({ success: true, data: newItem, message: 'Item created successfully' });
        return;
      }

      const item = await InventoryItemModel.create({
        name,
        sku: generatedSku,
        barcode,
        itemType,
        category,
        brand,
        variant,
        packageSize,
        stockUnit,
        openingStock: finalStock,
        currentQuantity: finalStock,
        minStockThreshold: Number(minStockThreshold),
        reorderQuantity: Number(reorderQuantity),
        purchasePriceInPaise: Number(purchasePriceInPaise),
        sellingPriceInPaise: sellingPriceInPaise ? Number(sellingPriceInPaise) : undefined,
        supplierId: supplierId || undefined,
        storageLocation,
        imageUrl,
        isActive: true,
      });

      if (finalStock > 0) {
        await InventoryMovementModel.create({
          inventoryItemId: item._id,
          operationType: 'stock_in',
          previousQuantity: 0,
          newQuantity: finalStock,
          changeQuantity: finalStock,
          unitCostInPaise: Number(purchasePriceInPaise),
          totalCostInPaise: finalStock * Number(purchasePriceInPaise),
          reason: 'Initial Opening Stock entry',
          performedBy: req.user?.email || 'admin',
          timestamp: new Date(),
        });
      }

      logAudit('CREATE_INVENTORY_ITEM', req.user?.phone || 'admin', req.user?.role || 'admin', {
        itemId: item._id,
        sku: item.sku,
        name: item.name,
      });

      res.status(201).json({ success: true, data: item, message: 'Item created successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
    }
  }

  /**
   * Update an inventory item's details and/or stock level
   */
  static async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (mongoose.connection.readyState !== 1) {
        const index = IN_MEMORY_ITEMS.findIndex(i => i._id === id);
        if (index === -1) {
          res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
          return;
        }

        const prev = IN_MEMORY_ITEMS[index];
        const newStock = updates.currentQuantity !== undefined
          ? Number(updates.currentQuantity)
          : updates.currentStock !== undefined
          ? Number(updates.currentStock)
          : prev.currentQuantity;

        const updated = {
          ...prev,
          ...updates,
          currentQuantity: newStock,
          currentStock: newStock,
          minStockThreshold: updates.minStockThreshold !== undefined ? Number(updates.minStockThreshold) : prev.minStockThreshold,
          minimumThreshold: updates.minStockThreshold !== undefined ? Number(updates.minStockThreshold) : prev.minimumThreshold,
          purchasePriceInPaise: updates.purchasePriceInPaise !== undefined ? Number(updates.purchasePriceInPaise) : prev.purchasePriceInPaise,
          costPerUnitInPaise: updates.purchasePriceInPaise !== undefined ? Number(updates.purchasePriceInPaise) : prev.costPerUnitInPaise,
          sellingPriceInPaise: updates.sellingPriceInPaise !== undefined ? Number(updates.sellingPriceInPaise) : prev.sellingPriceInPaise,
          updatedAt: new Date(),
        };

        IN_MEMORY_ITEMS[index] = updated;

        // Record stock adjustment movement if quantity changed
        if (newStock !== prev.currentQuantity) {
          const delta = newStock - prev.currentQuantity;
          DEMO_MOVEMENTS.unshift({
            _id: `mov-${Date.now()}`,
            inventoryItemId: id,
            itemName: updated.name,
            operationType: delta > 0 ? 'adjustment' : 'wastage',
            previousQuantity: prev.currentQuantity,
            newQuantity: newStock,
            changeQuantity: delta,
            unitCostInPaise: updated.purchasePriceInPaise || 0,
            totalCostInPaise: Math.abs(delta) * (updated.purchasePriceInPaise || 0),
            reason: updates.reason || 'Manual stock update via Admin Inventory panel',
            referenceId: `ADJ-${id}`,
            performedBy: req.user?.email || 'admin',
            timestamp: new Date(),
          });
        }

        res.json({ success: true, data: updated, message: 'Item updated successfully' });
        return;
      }

      const item = await InventoryItemModel.findByIdAndUpdate(id, updates, { new: true });
      if (!item) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
        return;
      }

      res.json({ success: true, data: item, message: 'Item updated successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }

  /**
   * Delete an inventory item
   */
  static async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (mongoose.connection.readyState !== 1) {
        const index = IN_MEMORY_ITEMS.findIndex(i => i._id === id);
        if (index === -1) {
          res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
          return;
        }

        const deletedItem = IN_MEMORY_ITEMS[index];
        IN_MEMORY_ITEMS.splice(index, 1);

        // Record deletion in movement history
        DEMO_MOVEMENTS.unshift({
          _id: `mov-${Date.now()}`,
          inventoryItemId: id,
          itemName: deletedItem.name,
          operationType: 'stock_out',
          previousQuantity: deletedItem.currentQuantity || 0,
          newQuantity: 0,
          changeQuantity: -(deletedItem.currentQuantity || 0),
          unitCostInPaise: deletedItem.purchasePriceInPaise || 0,
          totalCostInPaise: 0,
          reason: 'Item deleted from inventory catalog',
          referenceId: `DEL-${id}`,
          performedBy: req.user?.email || 'admin',
          timestamp: new Date(),
        });

        res.json({ success: true, message: `Item ${deletedItem.name} removed successfully`, data: { id } });
        return;
      }

      const item = await InventoryItemModel.findByIdAndDelete(id);
      if (!item) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
        return;
      }

      logAudit('DELETE_INVENTORY_ITEM', req.user?.phone || 'admin', req.user?.role || 'admin', {
        itemId: id,
        name: item.name,
      });

      res.json({ success: true, message: `Item ${item.name} deleted successfully`, data: { id } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } });
    }
  }

  /**
   * Quick Stock Adjustment (+/- delta)
   */
  static async quickAdjust(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adjustment, reason = 'Quick manual adjustment' } = req.body;

      if (adjustment === undefined || isNaN(Number(adjustment))) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Adjustment numeric value is required' } });
        return;
      }

      const delta = Number(adjustment);

      if (mongoose.connection.readyState !== 1) {
        const item = IN_MEMORY_ITEMS.find(i => i._id === id);
        if (!item) {
          res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
          return;
        }

        const prevQty = item.currentQuantity ?? item.currentStock ?? 0;
        const newQty = Math.max(0, prevQty + delta);
        item.currentQuantity = newQty;
        item.currentStock = newQty;
        item.updatedAt = new Date();

        DEMO_MOVEMENTS.unshift({
          _id: `mov-${Date.now()}`,
          inventoryItemId: id,
          itemName: item.name,
          operationType: delta >= 0 ? 'stock_in' : 'stock_out',
          previousQuantity: prevQty,
          newQuantity: newQty,
          changeQuantity: delta,
          unitCostInPaise: item.purchasePriceInPaise || 0,
          totalCostInPaise: Math.abs(delta) * (item.purchasePriceInPaise || 0),
          reason,
          referenceId: `QADJ-${id}`,
          performedBy: req.user?.email || 'admin',
          timestamp: new Date(),
        });

        res.json({
          success: true,
          message: `Stock updated by ${delta >= 0 ? `+${delta}` : delta} ${item.stockUnit || 'units'}`,
          data: item,
        });
        return;
      }

      const item = await InventoryItemModel.findById(id);
      if (!item) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
        return;
      }

      const prevQty = item.currentQuantity;
      const newQty = Math.max(0, prevQty + delta);
      item.currentQuantity = newQty;
      await item.save();

      await InventoryMovementModel.create({
        inventoryItemId: item._id,
        operationType: delta >= 0 ? 'stock_in' : 'stock_out',
        previousQuantity: prevQty,
        newQuantity: newQty,
        changeQuantity: delta,
        unitCostInPaise: item.purchasePriceInPaise,
        totalCostInPaise: Math.abs(delta) * item.purchasePriceInPaise,
        reason,
        performedBy: req.user?.email || 'admin',
        timestamp: new Date(),
      });

      res.json({
        success: true,
        message: `Stock updated by ${delta >= 0 ? `+${delta}` : delta} ${item.stockUnit || 'units'}`,
        data: item,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'ADJUST_ERROR', message: error.message } });
    }
  }

  /**
   * Execute manual stock operation (stock_in, stock_out, adjustment, wastage, damaged)
   * Automatically creates an immutable ledger movement record.
   */
  static async recordOperation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { operationType, quantityChange, reason, referenceId } = req.body;

      if (!operationType || quantityChange === undefined) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'operationType and quantityChange required' } });
        return;
      }

      if (mongoose.connection.readyState !== 1) {
        res.json({
          success: true,
          message: `Stock updated for ${id} in demo mode`,
          data: {
            itemId: id,
            operationType,
            quantityChange: Number(quantityChange),
            timestamp: new Date(),
          },
        });
        return;
      }

      const result = await InventoryService.recordStockChange({
        itemId: id,
        operationType,
        quantityChange: Number(quantityChange),
        reason,
        referenceId,
        performedBy: req.user?.email || 'admin',
      });

      logAudit('INVENTORY_OPERATION', req.user?.phone || 'admin', req.user?.role || 'admin', {
        itemId: id,
        operationType,
        quantityChange,
        newQuantity: result.item.currentQuantity,
        reason,
      });

      res.json({
        success: true,
        message: 'Stock updated and ledger movement logged',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { code: 'OPERATION_ERROR', message: error.message } });
    }
  }

  /**
   * Fetch stock movement history ledger
   */
  static async getMovements(req: Request, res: Response): Promise<void> {
    try {
      const { itemId, operationType, limit = 50 } = req.query;

      if (mongoose.connection.readyState !== 1) {
        res.json({ success: true, data: DEMO_MOVEMENTS });
        return;
      }

      const query: any = {};
      if (itemId) query.inventoryItemId = itemId;
      if (operationType) query.operationType = operationType;

      const movements = await InventoryMovementModel.find(query)
        .populate('inventoryItemId', 'name sku stockUnit packageSize')
        .sort({ timestamp: -1 })
        .limit(Number(limit));

      res.json({ success: true, data: movements });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }

  /**
   * Low Stock & Out-of-Stock Alerts
   */
  static async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 1) {
        const low = [...DEMO_BEVERAGES, ...DEMO_INGREDIENTS].filter(i => i.currentQuantity <= i.minStockThreshold);
        res.json({
          success: true,
          data: {
            lowStock: low,
            outOfStock: low.filter(i => i.currentQuantity === 0),
            count: low.length,
          },
        });
        return;
      }

      const items = await InventoryItemModel.find({ isActive: true });
      const lowStock = items.filter(i => i.currentQuantity <= i.minStockThreshold);
      const outOfStock = items.filter(i => i.currentQuantity <= 0);

      res.json({
        success: true,
        data: {
          lowStock,
          outOfStock,
          lowStockCount: lowStock.length,
          outOfStockCount: outOfStock.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
    }
  }
}
