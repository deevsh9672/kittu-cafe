'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, Plus, ToggleLeft, ToggleRight, Trash2, Upload, Download } from 'lucide-react';
import { IMenuItem } from '@kittu-cafe/shared';
import { formatPrice } from '../../../lib/api';

const INITIAL_ADMIN_ITEMS: any[] = [
  {
    _id: 'i1',
    name: 'Classic Handcrafted Cappuccino',
    categoryName: 'Hot & Cold Coffee',
    basePriceInPaise: 11000,
    dietaryType: 'veg',
    isAvailable: true,
    isBestseller: true,
  },
  {
    _id: 'i2',
    name: 'Kittu Hazelnut Cold Coffee',
    categoryName: 'Hot & Cold Coffee',
    basePriceInPaise: 14000,
    dietaryType: 'veg',
    isAvailable: true,
    isBestseller: true,
  },
  {
    _id: 'i3',
    name: 'Grilled Paneer Tikka Sandwich',
    categoryName: 'Burgers & Sandwiches',
    basePriceInPaise: 13000,
    dietaryType: 'veg',
    isAvailable: true,
    isBestseller: true,
  },
  {
    _id: 'i4',
    name: 'Veg Loaded Farmhouse Pizza',
    categoryName: 'Pizzas & Garlic Breads',
    basePriceInPaise: 22000,
    dietaryType: 'veg',
    isAvailable: true,
    isBestseller: false,
  },
  {
    _id: 'i5',
    name: 'Peri Peri Masala Fries',
    categoryName: 'Snacks & Sides',
    basePriceInPaise: 9000,
    dietaryType: 'veg',
    isAvailable: true,
    isBestseller: true,
  },
];

export default function AdminMenuPage() {
  const [items, setItems] = useState<any[]>(INITIAL_ADMIN_ITEMS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Hot & Cold Coffee');

  const fetchItems = () => {
    fetch('http://localhost:5000/api/v1/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.items?.length > 0) {
          setItems(data.data.items);
        }
      })
      .catch((err) => console.warn('Using seeded menu items:', err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleToggle = async (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, isAvailable: !i.isAvailable } : i))
    );

    try {
      await fetch(`http://localhost:5000/api/v1/menu/items/${id}/toggle-availability`, {
        method: 'PATCH',
        headers: { Authorization: 'Bearer mock_admin_token' },
      });
    } catch (e) {
      // Local fallback
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const pricePaise = Math.round(parseFloat(newItemPrice) * 100);
    const createdItem = {
      _id: `new_${Date.now()}`,
      name: newItemName,
      categoryName: newItemCategory,
      basePriceInPaise: pricePaise,
      dietaryType: 'veg',
      isAvailable: true,
      isBestseller: false,
    };

    setItems([createdItem, ...items]);
    setNewItemName('');
    setNewItemPrice('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">Catalog Management</span>
          <h1 className="text-2xl font-extrabold text-[#231709]">Menu Manager</h1>
          <p className="text-xs text-[#5D4037]">Add dishes, configure integer paise prices, and toggle sold-out status.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#231709] hover:bg-[#3E2723] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-[#D97736]" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-2xl border border-[#EBE0D2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#4E342E] uppercase font-bold border-b border-[#EBE0D2]">
              <tr>
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price (INR)</th>
                <th className="p-4">Dietary</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-[#FFFEFA] transition-colors">
                  <td className="p-4 font-bold text-[#231709]">{item.name}</td>
                  <td className="p-4 text-[#5D4037]">{item.categoryName || 'Beverages'}</td>
                  <td className="p-4 font-mono font-bold text-[#231709]">
                    {formatPrice(item.basePriceInPaise)}
                  </td>
                  <td className="p-4">
                    <span className="w-3.5 h-3.5 border-2 border-emerald-600 rounded-sm flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {item.isAvailable ? 'In Stock' : 'Sold Out'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggle(item._id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        item.isAvailable
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {item.isAvailable ? 'Mark Sold Out' : 'Enable Item'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#EBE0D2] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#231709]">Add New Dish to Menu</h3>
            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#4E342E] mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Belgian Hot Chocolate"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EBE0D2] text-sm focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4E342E] mb-1">Category *</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EBE0D2] text-sm focus:outline-none focus:border-[#D97736]"
                >
                  <option value="Hot & Cold Coffee">Hot & Cold Coffee</option>
                  <option value="Burgers & Sandwiches">Burgers & Sandwiches</option>
                  <option value="Pizzas & Garlic Breads">Pizzas & Garlic Breads</option>
                  <option value="Snacks & Sides">Snacks & Sides</option>
                  <option value="Desserts & Shakes">Desserts & Shakes</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#4E342E] mb-1">Price in INR (₹) *</label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="e.g. 130"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EBE0D2] text-sm focus:outline-none focus:border-[#D97736]"
                />
                <span className="text-[10px] text-[#5D4037] mt-1 block">
                  Automatically stored as integer paise on backend.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#231709] text-white font-bold hover:bg-[#3E2723]"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
