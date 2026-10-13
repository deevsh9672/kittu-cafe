import { create } from 'zustand';

export interface CartItem {
  id: string; // unique key: itemId + variantName + addOns
  menuItemId: string;
  name: string;
  unitPriceInPaise: number;
  quantity: number;
  selectedVariantName?: string;
  selectedAddOnNames?: string[];
  specialInstructions?: string;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  orderType: 'delivery' | 'pickup' | 'dine_in';
  tableNumber: string;
  deliveryAddress: {
    street: string;
    area: string;
    city: string;
    postalCode: string;
    landmark?: string;
  };
  appliedCoupon: string | null;
  discountInPaise: number;
  customerDetails: {
    name: string;
    phone: string;
    email: string;
  };
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setOrderType: (type: 'delivery' | 'pickup' | 'dine_in') => void;
  setTableNumber: (table: string) => void;
  setDeliveryAddress: (address: Partial<CartStore['deliveryAddress']>) => void;
  setCustomerDetails: (details: Partial<CartStore['customerDetails']>) => void;
  setAppliedCoupon: (code: string | null, discountInPaise: number) => void;
  subtotalInPaise: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  orderType: 'delivery',
  tableNumber: '',
  deliveryAddress: {
    street: '',
    area: 'Shiv Colony',
    city: 'Dausa',
    postalCode: '303303',
    landmark: '',
  },
  appliedCoupon: null,
  discountInPaise: 0,
  customerDetails: {
    name: '',
    phone: '',
    email: '',
  },
  addItem: (newItem) => {
    const key = `${newItem.menuItemId}-${newItem.selectedVariantName || 'default'}-${(newItem.selectedAddOnNames || []).sort().join('-')}`;
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.id === key);
      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += newItem.quantity;
        return { items: updated };
      }
      return { items: [...state.items, { ...newItem, id: key }] };
    });
  },
  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },
  updateQuantity: (id, delta) => {
    set((state) => {
      const updated = state.items
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0);
      return { items: updated };
    });
  },
  clearCart: () => set({ items: [], appliedCoupon: null, discountInPaise: 0 }),
  setOrderType: (orderType) => set({ orderType }),
  setTableNumber: (tableNumber) => set({ tableNumber }),
  setDeliveryAddress: (address) =>
    set((state) => ({ deliveryAddress: { ...state.deliveryAddress, ...address } })),
  setCustomerDetails: (details) =>
    set((state) => ({ customerDetails: { ...state.customerDetails, ...details } })),
  setAppliedCoupon: (appliedCoupon, discountInPaise) => set({ appliedCoupon, discountInPaise }),
  subtotalInPaise: () => {
    return get().items.reduce((sum, item) => sum + item.unitPriceInPaise * item.quantity, 0);
  },
}));
