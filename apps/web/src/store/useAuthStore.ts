import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  loyaltyPoints: number;
}

export interface SavedAddress {
  id: string;
  label: string; // Home, Office, Other
  street: string;
  area: string;
  city: string;
  postalCode: string;
  landmark?: string;
  isDefault?: boolean;
}

interface AuthStore {
  user: CustomerUser | null;
  token: string | null;
  savedAddresses: SavedAddress[];
  setUser: (user: CustomerUser | null, token: string | null) => void;
  updateProfile: (data: Partial<CustomerUser>) => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  logout: () => void;
}

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    street: 'House #42, Lane 3',
    area: 'Shiv Colony, Mariyara Wale',
    city: 'Dausa',
    postalCode: '303303',
    landmark: 'Near Kittu Cafe',
    isDefault: true,
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: {
        id: 'cust-demo-1',
        name: 'Aarav Sharma',
        phone: '+91 98290 11223',
        email: 'aarav@example.com',
        role: 'customer',
        loyaltyPoints: 180,
      },
      token: 'demo_customer_token_kittu_2026',
      savedAddresses: DEFAULT_ADDRESSES,

      setUser: (user, token) => set({ user, token }),

      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      addAddress: (address) =>
        set((state) => {
          const newAddress: SavedAddress = {
            ...address,
            id: 'addr-' + Date.now(),
            isDefault: state.savedAddresses.length === 0 || address.isDefault,
          };
          const updated = address.isDefault
            ? state.savedAddresses.map((a) => ({ ...a, isDefault: false }))
            : [...state.savedAddresses];
          return { savedAddresses: [...updated, newAddress] };
        }),

      removeAddress: (id) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.filter((a) => a.id !== id),
        })),

      setDefaultAddress: (id) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        })),

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'kittu_auth_storage',
    }
  )
);
