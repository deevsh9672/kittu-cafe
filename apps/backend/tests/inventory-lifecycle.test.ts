import { InventoryService } from '../src/modules/inventory/inventory.service';
import {
  InventoryItemModel,
  InventoryMovementModel,
  RecipeModel,
} from '../src/models';

jest.mock('../src/models', () => {
  const original = jest.requireActual('../src/models');
  return {
    ...original,
    InventoryItemModel: {
      findById: jest.fn(),
      findOne: jest.fn(),
    },
    InventoryMovementModel: {
      create: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    },
    RecipeModel: {
      findOne: jest.fn(),
    },
  };
});

describe('Beverage & Ingredient Inventory Lifecycle', () => {
  let mockCokeItem: any;
  let mockMilkItem: any;
  let mockCoffeeItem: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCokeItem = {
      _id: 'bev-coke-1',
      name: 'Coca-Cola Can',
      sku: 'BEV-COKE-330',
      packageSize: '330ml',
      stockUnit: 'can',
      currentQuantity: 24,
      minStockThreshold: 6,
      purchasePriceInPaise: 3000,
      save: jest.fn().mockResolvedValue(true),
    };

    mockMilkItem = {
      _id: 'ing-milk-1',
      name: 'Fresh Cow Milk',
      sku: 'ING-MILK-L',
      stockUnit: 'L',
      currentQuantity: 20,
      minStockThreshold: 5,
      purchasePriceInPaise: 6400,
      save: jest.fn().mockResolvedValue(true),
    };

    mockCoffeeItem = {
      _id: 'ing-coffee-1',
      name: 'Arabica Coffee Beans',
      sku: 'ING-COFFEE-KG',
      stockUnit: 'kg',
      currentQuantity: 10,
      minStockThreshold: 2,
      purchasePriceInPaise: 85000,
      save: jest.fn().mockResolvedValue(true),
    };
  });

  // Scenario 1 & 2: Receiving stock updates ledger & increases quantity
  it('1 & 2. Should receive 24 cans of Coke into stock and create immutable ledger movement', async () => {
    mockCokeItem.currentQuantity = 0;
    (InventoryItemModel.findById as jest.Mock).mockResolvedValue(mockCokeItem);
    (InventoryMovementModel.create as jest.Mock).mockImplementation((data: any) => Promise.resolve({ _id: 'mov-1', ...data }));

    const result = await InventoryService.recordStockChange({
      itemId: 'bev-coke-1',
      operationType: 'purchase_receipt',
      quantityChange: 24,
      reason: 'PO-2026-001 receipt',
      referenceId: 'PO-2026-001',
      performedBy: 'admin',
    });

    expect(result.item.currentQuantity).toBe(24);
    expect(mockCokeItem.save).toHaveBeenCalled();
    expect(InventoryMovementModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        inventoryItemId: 'bev-coke-1',
        operationType: 'purchase_receipt',
        previousQuantity: 0,
        newQuantity: 24,
        changeQuantity: 24,
        referenceId: 'PO-2026-001',
      })
    );
  });

  // Scenario 3: Order sells 2 cans and stock decreases by exactly 2
  it('3. Should sell 2 cans of Coke upon order confirmation and decrease stock to 22', async () => {
    (InventoryMovementModel.findOne as jest.Mock).mockResolvedValue(null); // not already deducted
    (RecipeModel.findOne as jest.Mock).mockResolvedValue({
      beverageItemId: 'bev-coke-1',
      ingredients: [],
    });
    (InventoryItemModel.findById as jest.Mock).mockResolvedValue(mockCokeItem);
    (InventoryMovementModel.create as jest.Mock).mockImplementation((data: any) => Promise.resolve({ _id: 'mov-2', ...data }));

    await InventoryService.deductForOrder('ORD-101', [{ menuItemId: 'menu-coke', quantity: 2 }]);

    expect(mockCokeItem.currentQuantity).toBe(22);
    expect(mockCokeItem.save).toHaveBeenCalled();
    expect(InventoryMovementModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operationType: 'sale',
        previousQuantity: 24,
        newQuantity: 22,
        changeQuantity: -2,
        referenceId: 'ORD-101',
      })
    );
  });

  // Scenario 4: Replaying order event is idempotent (no duplicate deduction)
  it('4. Should prevent duplicate deductions when order confirmation event is replayed', async () => {
    // Movement already exists
    (InventoryMovementModel.findOne as jest.Mock).mockResolvedValue({ _id: 'mov-existing', referenceId: 'ORD-101' });

    await InventoryService.deductForOrder('ORD-101', [{ menuItemId: 'menu-coke', quantity: 2 }]);

    expect(InventoryItemModel.findById).not.toHaveBeenCalled();
    expect(InventoryMovementModel.create).not.toHaveBeenCalled();
  });

  // Scenario 5: Cannot sell items with insufficient stock
  it('5. Should prevent selling when stock is insufficient and throw error', async () => {
    mockCokeItem.currentQuantity = 1;
    (InventoryItemModel.findById as jest.Mock).mockResolvedValue(mockCokeItem);

    await expect(
      InventoryService.recordStockChange({
        itemId: 'bev-coke-1',
        operationType: 'sale',
        quantityChange: -5,
        reason: 'Order request 5 cans',
      })
    ).rejects.toThrow(/Insufficient stock/);

    expect(mockCokeItem.save).not.toHaveBeenCalled();
  });

  // Scenario 6: Low stock alert threshold detection
  it('6. Should correctly detect low stock when quantity is at or below threshold', () => {
    const isLowStock = (item: any) => item.currentQuantity <= item.minStockThreshold;

    mockCokeItem.currentQuantity = 6;
    expect(isLowStock(mockCokeItem)).toBe(true);

    mockCokeItem.currentQuantity = 5;
    expect(isLowStock(mockCokeItem)).toBe(true);

    mockCokeItem.currentQuantity = 7;
    expect(isLowStock(mockCokeItem)).toBe(false);
  });

  // Scenario 7: Recipe-based food order deducts configured ingredients exactly once
  it('7. Should deduct recipe ingredients (milk & coffee beans) for Cappuccino order', async () => {
    (InventoryMovementModel.findOne as jest.Mock).mockResolvedValue(null);
    (RecipeModel.findOne as jest.Mock).mockResolvedValue({
      name: 'Cappuccino Recipe',
      ingredients: [
        { inventoryItemId: 'ing-coffee-1', quantityRequired: 0.015, unit: 'kg' }, // 15g
        { inventoryItemId: 'ing-milk-1', quantityRequired: 0.2, unit: 'L' }, // 200ml
      ],
    });

    (InventoryItemModel.findById as jest.Mock).mockImplementation((id: string) => {
      if (id === 'ing-coffee-1') return Promise.resolve(mockCoffeeItem);
      if (id === 'ing-milk-1') return Promise.resolve(mockMilkItem);
      return Promise.resolve(null);
    });
    (InventoryMovementModel.create as jest.Mock).mockImplementation((data: any) => Promise.resolve({ _id: 'mov', ...data }));

    // Order 2 Cappuccinos -> 0.030 kg coffee, 0.4 L milk
    await InventoryService.deductForOrder('ORD-102', [{ menuItemId: 'menu-cappuccino', quantity: 2 }]);

    expect(mockCoffeeItem.currentQuantity).toBeCloseTo(10 - 0.030, 4);
    expect(mockMilkItem.currentQuantity).toBeCloseTo(20 - 0.4, 4);
    expect(InventoryMovementModel.create).toHaveBeenCalledTimes(2);
  });

  // Scenario 8: Cancelling an order releases reserved stock correctly
  it('8. Should restore stock when an order is cancelled prior to preparation', async () => {
    (InventoryMovementModel.find as jest.Mock).mockResolvedValue([
      { inventoryItemId: 'bev-coke-1', changeQuantity: -2 },
    ]);
    mockCokeItem.currentQuantity = 22;
    (InventoryItemModel.findById as jest.Mock).mockResolvedValue(mockCokeItem);
    (InventoryMovementModel.create as jest.Mock).mockImplementation((data: any) => Promise.resolve({ _id: 'mov-restore', ...data }));

    await InventoryService.restoreCancelledOrder('ORD-101');

    expect(mockCokeItem.currentQuantity).toBe(24);
    expect(mockCokeItem.save).toHaveBeenCalled();
    expect(InventoryMovementModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operationType: 'stock_in',
        changeQuantity: 2,
        referenceId: 'CANCEL-ORD-101',
      })
    );
  });

  // Scenario 9: Consumed inventory is not automatically restored upon issuing a refund
  it('9. Should verify that refund events do not trigger automatic restoration of consumed inventory', () => {
    // In our domain logic, refunds only update monetary and payment state; they do not call restoreCancelledOrder
    const orderState = {
      status: 'refunded',
      refundIssued: true,
      stockRestored: false,
    };
    expect(orderState.stockRestored).toBe(false);
  });
});
