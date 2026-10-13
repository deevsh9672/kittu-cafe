import { create } from 'zustand';

export interface MobileCartItem {
  id: string;
  menuItemId: string;
  name: string;
  unitPriceInPaise: number;
  quantity: number;
  selectedVariantName?: string;
  selectedAddOnNames?: string[];
  specialInstructions?: string;
}

interface MobileCartStore {
  items: MobileCartItem[];
  orderType: 'delivery' | 'pickup' | 'dine_in';
  tableNumber: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  appliedCoupon: string | null;
  discountInPaise: number;
  addItem: (item: Omit<MobileCartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setOrderType: (type: 'delivery' | 'pickup' | 'dine_in') => void;
  setCustomerInfo: (name: string, phone: string, address?: string) => void;
  setAppliedCoupon: (code: string | null, discountInPaise: number) => void;
  subtotalInPaise: () => number;
}

export const useMobileCart = create<MobileCartStore>((set, get) => ({
  items: [],
  orderType: 'delivery',
  tableNumber: '',
  deliveryAddress: 'Shiv Colony, Mariyara Wale, Dausa',
  customerName: 'Guest Customer',
  customerPhone: '+91 95113 17456',
  appliedCoupon: null,
  discountInPaise: 0,
  addItem: (newItem) => {
    const key = `${newItem.menuItemId}-${newItem.selectedVariantName || 'def'}`;
    set((state) => {
      const idx = state.items.findIndex((i) => i.id === key);
      if (idx > -1) {
        const copy = [...state.items];
        copy[idx].quantity += newItem.quantity;
        return { items: copy };
      }
      return { items: [...state.items, { ...newItem, id: key }] };
    });
  },
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateQuantity: (id, delta) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    })),
  clearCart: () => set({ items: [], appliedCoupon: null, discountInPaise: 0 }),
  setOrderType: (orderType) => set({ orderType }),
  setCustomerInfo: (customerName, customerPhone, deliveryAddress) =>
    set({
      customerName,
      customerPhone,
      deliveryAddress: deliveryAddress || 'Shiv Colony, Dausa',
    }),
  setAppliedCoupon: (appliedCoupon, discountInPaise) => set({ appliedCoupon, discountInPaise }),
  subtotalInPaise: () => {
    return get().items.reduce((sum, item) => sum + item.unitPriceInPaise * item.quantity, 0);
  },
}));
