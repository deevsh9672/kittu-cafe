/**
 * Kittu Cafe Platform - Shared Core Domain Definitions
 * Verified location: Shiv Colony, Mariyara Wale, Dausa, Rajasthan 303303
 */

export const BUSINESS_CONFIG = {
  name: "Kittu Cafe",
  businessType: "Cafe / Restaurant",
  address: "W82P+3P7, Shiv Colony, Mariyara Wale, Dausa, Rajasthan 303303",
  contactNumber: "+91 95113 17456",
  country: "India",
  currency: "INR",
  currencySymbol: "₹",
  timeZone: "Asia/Kolkata",
  primaryLanguage: "English",
  secondaryLanguage: "Hindi",
  mapsUrl: "https://www.google.com/maps/place/Kittu+cafe/data=!4m2!3m1!1s0x0:0xce3785a196c26746",
  coordinates: {
    latitude: 26.8978,
    longitude: 76.3354
  }
} as const;

export type UserRole =
  | 'admin'
  | 'manager'
  | 'cashier'
  | 'kitchen'
  | 'delivery'
  | 'customer';

export type OrderType = 'delivery' | 'pickup' | 'dine_in';

export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'accepted_by_kitchen'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'
  | 'refund_pending'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded';

export type PaymentMethod =
  | 'razorpay'
  | 'cash_on_delivery'
  | 'cash_at_pickup'
  | 'cash_at_counter'
  | 'upi_at_counter';

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'seated'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type DietaryType = 'veg' | 'non_veg' | 'egg' | 'vegan';

export type StockMovementType =
  | 'purchase'
  | 'consumption'
  | 'wastage'
  | 'adjustment'
  | 'return';

export interface CurrencyAmount {
  paise: number; // Integer minor unit representation
}

export function formatINR(paise: number): string {
  const rupees = (paise / 100).toFixed(2);
  return `₹${rupees}`;
}

export interface IMenuItemVariant {
  _id?: string;
  name: string; // e.g. "Regular", "Large"
  priceInPaise: number;
  isDefault?: boolean;
}

export interface IMenuItemAddOn {
  _id?: string;
  name: string; // e.g. "Extra Cheese", "Espresso Shot"
  priceInPaise: number;
}

export interface IAddOnGroup {
  _id?: string;
  title: string;
  minSelections: number;
  maxSelections: number;
  items: IMenuItemAddOn[];
}

export interface IMenuItem {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  imageUrl?: string;
  basePriceInPaise: number;
  dietaryType: DietaryType;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  preparationTimeMinutes: number;
  variants: IMenuItemVariant[];
  addOnGroups: IAddOnGroup[];
  ingredients?: string[];
  spiceLevel?: 'none' | 'mild' | 'medium' | 'hot';
  calories?: number;
  rating?: number;
  ratingCount?: number;
  chefNote?: string;
  servingSize?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMenuCategory {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface IOrderItemSnapshot {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPriceInPaise: number;
  totalPriceInPaise: number;
  selectedVariant?: {
    name: string;
    priceInPaise: number;
  };
  selectedAddOns?: Array<{
    name: string;
    priceInPaise: number;
  }>;
  specialInstructions?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: {
    street: string;
    area: string;
    city: string;
    postalCode: string;
    landmark?: string;
  };
  items: IOrderItemSnapshot[];
  subtotalInPaise: number;
  taxInPaise: number;
  deliveryFeeInPaise: number;
  discountInPaise: number;
  totalInPaise: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentOrderId?: string;
  paymentId?: string;
  preparationNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITableReservation {
  _id: string;
  reservationNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM
  tableId?: string;
  tableNumber?: string;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IIngredient {
  _id: string;
  name: string;
  unit: string; // e.g. "grams", "ml", "pieces"
  currentStock: number;
  lowStockThreshold: number;
  costPerUnitInPaise: number;
  updatedAt?: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // Percentage or paise
  maxDiscountInPaise?: number;
  minOrderInPaise: number;
  usageLimit?: number;
  usedCount: number;
  perCustomerLimit: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

export interface IInventoryItem {
  _id: string;
  name: string;
  itemType: 'beverage' | 'ingredient' | 'packaging';
  category?: string;
  currentStock: number;
  minimumThreshold: number;
  unit: string;
  costPerUnitInPaise?: number;
  sellingPriceInPaise?: number;
  packageSize?: string;
  supplierId?: string;
  lastUpdated?: string;
}

export interface IInventoryMovement {
  _id: string;
  itemId: string;
  itemName: string;
  operationType: 'stock_in' | 'stock_out' | 'sale' | 'wastage' | 'adjustment' | 'purchase_order_receipt';
  quantity: number;
  previousStock: number;
  newStock: number;
  costPerUnitInPaise?: number;
  totalCostInPaise?: number;
  reason: string;
  referenceId?: string;
  staffName?: string;
  createdAt: string;
}

export interface ISupplier {
  _id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  paymentTerms?: string;
  categoriesSupplied?: string[];
  isActive: boolean;
}

export interface IPurchaseOrderItem {
  itemId: string;
  itemName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitCostInPaise: number;
  totalCostInPaise: number;
}

export interface IPurchaseOrder {
  _id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  status: 'draft' | 'ordered' | 'partial' | 'received' | 'cancelled';
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  invoiceNumber?: string;
  items: IPurchaseOrderItem[];
  totalAmountInPaise: number;
  notes?: string;
}

export interface IExpense {
  _id: string;
  title: string;
  category: 'rent' | 'utilities' | 'supplies' | 'maintenance' | 'marketing' | 'salaries' | 'other';
  amountInPaise: number;
  date: string;
  paymentMethod?: string;
  notes?: string;
  recordedBy?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
