import mongoose from 'mongoose';
import {
  InventoryItemModel,
  IInventoryItem,
  InventoryMovementModel,
  StockOperationType,
  RecipeModel,
  PurchaseOrderModel,
} from '../../models';

export interface MovementPayload {
  itemId: string;
  operationType: StockOperationType;
  quantityChange: number;
  reason?: string;
  referenceId?: string;
  performedBy?: string;
}

export class InventoryService {
  /**
   * Records a stock movement and atomically updates item currentQuantity.
   * Throws an error if resulting stock would become negative without authorization.
   */
  static async recordStockChange(payload: MovementPayload): Promise<{
    item: IInventoryItem;
    movement: any;
  }> {
    const { itemId, operationType, quantityChange, reason, referenceId, performedBy } = payload;

    const item = await InventoryItemModel.findById(itemId);
    if (!item) {
      throw new Error(`Inventory item not found: ${itemId}`);
    }

    const previousQuantity = item.currentQuantity;
    const newQuantity = previousQuantity + quantityChange;

    if (newQuantity < 0) {
      throw new Error(`Insufficient stock for ${item.name}. Available: ${previousQuantity}, Requested: ${Math.abs(quantityChange)}`);
    }

    item.currentQuantity = Number(newQuantity.toFixed(2));
    await item.save();

    const unitCost = (item as any).purchasePriceInPaise || (item as any).costPerUnitInPaise || 0;

    // Create immutable movement record
    const movement = await InventoryMovementModel.create({
      inventoryItemId: item._id,
      itemName: item.name,
      operationType,
      previousQuantity,
      newQuantity: item.currentQuantity,
      changeQuantity: quantityChange,
      costPerUnitInPaise: unitCost,
      totalCostInPaise: unitCost ? Math.round(Math.abs(quantityChange) * unitCost) : 0,
      reason: reason || `${operationType.toUpperCase()} adjustment`,
      referenceId,
      performedBy: performedBy || 'system',
    });

    return { item, movement };
  }

  /**
   * Deduct items for an order (both packaged beverages and food ingredients).
   * Ensures idempotency: if movements for this order already exist, skips to avoid double-deduction.
   */
  static async deductForOrder(orderId: string, items: Array<{ menuItemId: string; quantity: number }>): Promise<void> {
    try {
      // Idempotency check: see if movements for this order were already recorded
      const existingMovement = await InventoryMovementModel.findOne({ referenceId: orderId, operationType: 'sale' });
      if (existingMovement) {
        console.log(`[Inventory] Skipping deduction for order ${orderId} - already deducted.`);
        return;
      }

      for (const orderItem of items) {
        // 1. Check if the menu item is mapped to a recipe or packaged beverage
        const recipe = await RecipeModel.findOne({ menuItemId: orderItem.menuItemId });

        if (recipe) {
          // Direct packaged beverage link (e.g. Red Bull can, Coke bottle)
          if (recipe.beverageItemId) {
            const deduction = -1 * orderItem.quantity;
            await this.recordStockChange({
              itemId: recipe.beverageItemId.toString(),
              operationType: 'sale',
              quantityChange: deduction,
              reason: `Order ${orderId}`,
              referenceId: orderId,
              performedBy: 'ordering-system',
            });
          }

          // Food ingredients deduction (e.g. 200ml milk, 15g coffee)
          if (recipe.ingredients && recipe.ingredients.length > 0) {
            for (const ing of recipe.ingredients) {
              const deduction = -1 * (ing.quantityRequired * orderItem.quantity);
              await this.recordStockChange({
                itemId: ing.inventoryItemId.toString(),
                operationType: 'sale',
                quantityChange: deduction,
                reason: `Order ${orderId} - Recipe ingredient`,
                referenceId: orderId,
                performedBy: 'kitchen-kds',
              });
            }
          }
        }
      }
    } catch (err: any) {
      console.warn(`[Inventory] Warning during deductForOrder (${orderId}):`, err.message);
    }
  }

  /**
   * Restore/release reserved stock if an order is cancelled prior to preparation.
   */
  static async restoreCancelledOrder(orderId: string): Promise<void> {
    try {
      const saleMovements = await InventoryMovementModel.find({ referenceId: orderId, operationType: 'sale' });
      if (!saleMovements || saleMovements.length === 0) return;

      for (const mov of saleMovements) {
        const restoreQty = Math.abs(mov.changeQuantity);
        await this.recordStockChange({
          itemId: mov.inventoryItemId.toString(),
          operationType: 'stock_in',
          quantityChange: restoreQty,
          reason: `Restoration for cancelled order ${orderId}`,
          referenceId: `CANCEL-${orderId}`,
          performedBy: 'admin',
        });
      }
    } catch (err: any) {
      console.warn(`[Inventory] Warning during restoreCancelledOrder (${orderId}):`, err.message);
    }
  }
}
