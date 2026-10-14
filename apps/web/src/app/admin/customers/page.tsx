'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  ShoppingBag,
  Award,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '../../../lib/api';

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpendPaise: number;
  loyaltyTier: 'Gold' | 'Silver' | 'Bronze';
  lastVisit: string;
  favoriteItem: string;
}

const DEMO_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-1',
    name: 'Aarav Sharma',
    phone: '+91 98290 11223',
    totalOrders: 18,
    totalSpendPaise: 485000,
    loyaltyTier: 'Gold',
    lastVisit: 'Yesterday, 6:45 PM',
    favoriteItem: 'Kittu Hazelnut Cold Coffee',
  },
  {
    id: 'cust-2',
    name: 'Pooja Verma',
    phone: '+91 94140 33445',
    totalOrders: 9,
    totalSpendPaise: 242000,
    loyaltyTier: 'Silver',
    lastVisit: '2 days ago',
    favoriteItem: 'Grilled Paneer Tikka Sandwich',
  },
  {
    id: 'cust-3',
    name: 'Deepak Meena',
    phone: '+91 97850 55667',
    totalOrders: 5,
    totalSpendPaise: 115000,
    loyaltyTier: 'Bronze',
    lastVisit: '5 days ago',
    favoriteItem: 'Veg Loaded Farmhouse Pizza',
  },
  {
    id: 'cust-4',
    name: 'Sneha Jain',
    phone: '+91 96100 77889',
    totalOrders: 14,
    totalSpendPaise: 389000,
    loyaltyTier: 'Gold',
    lastVisit: 'Today, 1:15 PM',
    favoriteItem: 'Classic Handcrafted Cappuccino',
  },
  {
    id: 'cust-5',
    name: 'Rohit Khandelwal',
    phone: '+91 91660 99001',
    totalOrders: 3,
    totalSpendPaise: 78000,
    loyaltyTier: 'Bronze',
    lastVisit: 'Last week',
    favoriteItem: 'Peri Peri Masala Fries',
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>(DEMO_CUSTOMERS);
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.favoriteItem.toLowerCase().includes(search.toLowerCase())
  );

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Gold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
            <Award className="w-3 h-3 text-amber-600" />
            Gold Tier
          </span>
        );
      case 'Silver':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-stone-200 text-stone-800">
            Silver Tier
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-50 text-orange-800">
            Bronze Tier
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
          Customer Loyalty & CRM
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
          Customer Directory
        </h1>
        <p className="text-xs text-[#5D4037]">
          Track repeat visitors, lifetime spend, favorite orders, and loyalty tiers for guests in Dausa.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Registered Guests
          </span>
          <span className="text-xl font-black text-[#231709]">{customers.length} Guests</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Gold Loyalty Members
          </span>
          <span className="text-xl font-black text-amber-600">
            {customers.filter((c) => c.loyaltyTier === 'Gold').length} Patrons
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Combined Spend
          </span>
          <span className="text-xl font-black text-emerald-700">
            {formatPrice(customers.reduce((acc, c) => acc + c.totalSpendPaise, 0))}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Avg Spend / Guest
          </span>
          <span className="text-xl font-black text-[#D97736]">
            {formatPrice(
              Math.round(
                customers.reduce((acc, c) => acc + c.totalSpendPaise, 0) / customers.length
              )
            )}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by customer name, phone number, or favorite dish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-[#231709]"
        />
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white border border-[#EBE0D2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#EBE0D2] text-[10px] font-black uppercase text-[#5D4037] tracking-wider">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4 text-center">Orders</th>
                <th className="p-4">Total Spend</th>
                <th className="p-4">Loyalty Tier</th>
                <th className="p-4">Favorite Dish</th>
                <th className="p-4 text-right">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#FFFDFB] transition-colors">
                  <td className="p-4 font-bold text-sm text-[#231709]">{customer.name}</td>
                  <td className="p-4 text-stone-600 font-mono">
                    <a href={`tel:${customer.phone}`} className="hover:underline">
                      {customer.phone}
                    </a>
                  </td>
                  <td className="p-4 text-center font-bold">{customer.totalOrders}</td>
                  <td className="p-4 font-black text-emerald-700">
                    {formatPrice(customer.totalSpendPaise)}
                  </td>
                  <td className="p-4">{getTierBadge(customer.loyaltyTier)}</td>
                  <td className="p-4 text-stone-600 font-medium">{customer.favoriteItem}</td>
                  <td className="p-4 text-right text-stone-500 font-medium">
                    {customer.lastVisit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
