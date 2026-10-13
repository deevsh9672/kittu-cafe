import { OrdersService } from '../src/modules/orders/orders.service';
import { MenuItemModel, RestaurantModel, CouponModel } from '../src/models';

// Mock models for pure deterministic unit testing
jest.mock('../src/models', () => {
  const original = jest.requireActual('../src/models');
  return {
    ...original,
    RestaurantModel: {
      findOne: jest.fn().mockResolvedValue({
        taxPercentage: 5,
        deliveryFeeInPaise: 4000,
        minOrderInPaise: 15000,
        freeDeliveryThresholdInPaise: 49900,
      }),
    },
    MenuItemModel: {
      findById: jest.fn().mockImplementation((id: string) => {
        if (id === 'item-coffee') {
          return Promise.resolve({
            _id: 'item-coffee',
            name: 'Cappuccino',
            basePriceInPaise: 11000, // ₹110.00
            isAvailable: true,
            variants: [
              { name: 'Regular', priceInPaise: 11000 },
              { name: 'Large', priceInPaise: 14000 },
            ],
            addOnGroups: [
              {
                title: 'Customizations',
                items: [{ name: 'Extra Shot', priceInPaise: 3000 }],
              },
            ],
          });
        }
        if (id === 'item-soldout') {
          return Promise.resolve({
            _id: 'item-soldout',
            name: 'Sold Out Drink',
            basePriceInPaise: 8000,
            isAvailable: false,
          });
        }
        return Promise.resolve(null);
      }),
    },
    CouponModel: {
      findOne: jest.fn().mockImplementation(({ code }: { code: string }) => {
        if (code === 'SAVE50') {
          return Promise.resolve({
            code: 'SAVE50',
            discountType: 'fixed',
            discountValue: 5000, // ₹50.00
            minOrderInPaise: 10000,
            isActive: true,
          });
        }
        return Promise.resolve(null);
      }),
    },
  };
});

describe('Orders Pricing and Calculations Engine', () => {
  it('calculates correct base price, tax, and delivery fee in integer paise', async () => {
    const input = [
      {
        menuItemId: 'item-coffee',
        quantity: 2,
        selectedVariantName: 'Regular',
      },
    ];

    const result = await OrdersService.calculateOrder(input, 'delivery');

    // Subtotal: 2 * 11000 = 22000 paise (₹220.00)
    expect(result.subtotalInPaise).toBe(22000);

    // Delivery fee: 4000 paise (since 22000 < 49900 free threshold)
    expect(result.deliveryFeeInPaise).toBe(4000);

    // Tax: 5% of 22000 = 1100 paise (₹11.00)
    expect(result.taxInPaise).toBe(1100);

    // Total = 22000 + 4000 + 1100 = 27100 paise (₹271.00)
    expect(result.totalInPaise).toBe(27100);
    expect(result.items[0].unitPriceInPaise).toBe(11000);
    expect(result.items[0].totalPriceInPaise).toBe(22000);
  });

  it('correctly prices variants and add-on customizations', async () => {
    const input = [
      {
        menuItemId: 'item-coffee',
        quantity: 1,
        selectedVariantName: 'Large', // 14000 paise
        selectedAddOnNames: ['Extra Shot'], // + 3000 paise
      },
    ];

    const result = await OrdersService.calculateOrder(input, 'pickup');

    // Subtotal: 14000 + 3000 = 17000 paise (₹170.00)
    expect(result.subtotalInPaise).toBe(17000);
    // Pickup order has no delivery fee
    expect(result.deliveryFeeInPaise).toBe(0);
    // Tax: 5% of 17000 = 850 paise
    expect(result.taxInPaise).toBe(850);
    expect(result.totalInPaise).toBe(17850);
  });

  it('applies coupons and prevents negative total', async () => {
    const input = [
      {
        menuItemId: 'item-coffee',
        quantity: 2,
        selectedVariantName: 'Regular',
      },
    ];

    const result = await OrdersService.calculateOrder(input, 'pickup', 'SAVE50');

    expect(result.discountInPaise).toBe(5000); // ₹50 off
    expect(result.couponCode).toBe('SAVE50');
    // Subtotal 22000 + Tax 1100 - Discount 5000 = 18100
    expect(result.totalInPaise).toBe(18100);
  });

  it('rejects unavailable (sold out) items', async () => {
    const input = [{ menuItemId: 'item-soldout', quantity: 1 }];
    await expect(OrdersService.calculateOrder(input, 'pickup')).rejects.toThrow(
      'Item "Sold Out Drink" is currently sold out'
    );
  });

  it('rejects non-existent items', async () => {
    const input = [{ menuItemId: 'invalid-item', quantity: 1 }];
    await expect(OrdersService.calculateOrder(input, 'pickup')).rejects.toThrow(
      'Menu item invalid-item does not exist'
    );
  });
});
