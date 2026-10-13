import { MenuItemModel, RestaurantModel, CouponModel } from '../../models';
import { IOrderItemSnapshot, OrderType } from '@kittu-cafe/shared';

export interface CartInputItem {
  menuItemId: string;
  quantity: number;
  selectedVariantName?: string;
  selectedAddOnNames?: string[];
  specialInstructions?: string;
}

export interface CalculationResult {
  items: IOrderItemSnapshot[];
  subtotalInPaise: number;
  taxInPaise: number;
  deliveryFeeInPaise: number;
  discountInPaise: number;
  totalInPaise: number;
  couponCode?: string;
}

export class OrdersService {
  static async calculateOrder(
    inputItems: CartInputItem[],
    orderType: OrderType,
    couponCode?: string
  ): Promise<CalculationResult> {
    if (!inputItems || inputItems.length === 0) {
      throw new Error('Cart cannot be empty');
    }

    const restaurant = await RestaurantModel.findOne();
    const taxRate = restaurant?.taxPercentage ? restaurant.taxPercentage / 100 : 0.05;
    const baseDeliveryFee = restaurant?.deliveryFeeInPaise || 4000;
    const freeDeliveryThreshold = restaurant?.freeDeliveryThresholdInPaise || 49900;

    const snapshots: IOrderItemSnapshot[] = [];
    let subtotalInPaise = 0;

    for (const item of inputItems) {
      if (item.quantity <= 0) {
        throw new Error(`Quantity for item ${item.menuItemId} must be at least 1`);
      }

      const menuItem = await MenuItemModel.findById(item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} does not exist`);
      }
      if (!menuItem.isAvailable) {
        throw new Error(`Item "${menuItem.name}" is currently sold out`);
      }

      let unitPriceInPaise = menuItem.basePriceInPaise;
      let selectedVariant: { name: string; priceInPaise: number } | undefined;

      if (item.selectedVariantName && menuItem.variants && menuItem.variants.length > 0) {
        const variant = menuItem.variants.find((v: any) => v.name === item.selectedVariantName);
        if (variant) {
          unitPriceInPaise = variant.priceInPaise;
          selectedVariant = { name: variant.name, priceInPaise: variant.priceInPaise };
        }
      }

      const selectedAddOns: Array<{ name: string; priceInPaise: number }> = [];
      if (item.selectedAddOnNames && item.selectedAddOnNames.length > 0 && menuItem.addOnGroups) {
        for (const addOnName of item.selectedAddOnNames) {
          for (const group of menuItem.addOnGroups) {
            const addOn = group.items.find((a: any) => a.name === addOnName);
            if (addOn) {
              unitPriceInPaise += addOn.priceInPaise;
              selectedAddOns.push({ name: addOn.name, priceInPaise: addOn.priceInPaise });
            }
          }
        }
      }

      const totalPriceInPaise = unitPriceInPaise * item.quantity;
      subtotalInPaise += totalPriceInPaise;

      snapshots.push({
        menuItemId: menuItem._id.toString(),
        name: menuItem.name,
        quantity: item.quantity,
        unitPriceInPaise,
        totalPriceInPaise,
        selectedVariant,
        selectedAddOns: selectedAddOns.length > 0 ? selectedAddOns : undefined,
        specialInstructions: item.specialInstructions,
      });
    }

    // Minimum order validation for delivery
    if (orderType === 'delivery' && restaurant?.minOrderInPaise && subtotalInPaise < restaurant.minOrderInPaise) {
      throw new Error(`Minimum order amount for delivery is ₹${(restaurant.minOrderInPaise / 100).toFixed(2)}`);
    }

    // Calculate delivery fee
    let deliveryFeeInPaise = 0;
    if (orderType === 'delivery') {
      deliveryFeeInPaise = subtotalInPaise >= freeDeliveryThreshold ? 0 : baseDeliveryFee;
    }

    // Tax calculation
    const taxInPaise = Math.round(subtotalInPaise * taxRate);

    // Coupon discount calculation
    let discountInPaise = 0;
    let appliedCoupon: string | undefined;

    if (couponCode) {
      const coupon = await CouponModel.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
        expiryDate: { $gte: new Date() },
      });

      if (coupon) {
        if (subtotalInPaise >= coupon.minOrderInPaise) {
          if (coupon.discountType === 'percentage') {
            const calculatedDiscount = Math.round((subtotalInPaise * coupon.discountValue) / 100);
            discountInPaise = coupon.maxDiscountInPaise
              ? Math.min(calculatedDiscount, coupon.maxDiscountInPaise)
              : calculatedDiscount;
          } else {
            discountInPaise = coupon.discountValue;
          }
          appliedCoupon = coupon.code;
        }
      }
    }

    const totalInPaise = Math.max(0, subtotalInPaise + taxInPaise + deliveryFeeInPaise - discountInPaise);

    return {
      items: snapshots,
      subtotalInPaise,
      taxInPaise,
      deliveryFeeInPaise,
      discountInPaise,
      totalInPaise,
      couponCode: appliedCoupon,
    };
  }
}
