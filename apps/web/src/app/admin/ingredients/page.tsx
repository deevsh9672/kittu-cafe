'use client';

import React, { useState, useEffect } from 'react';
import {
  Carrot,
  Plus,
  AlertTriangle,
  Search,
  CheckCircle2,
  RefreshCw,
  Scale,
  ChefHat,
  Trash2,
  X,
  Edit2,
} from 'lucide-react';
import { IInventoryItem } from '@kittu-cafe/shared';
import { formatPrice } from '../../../lib/api';

const DEFAULT_INGREDIENTS: IInventoryItem[] = [
  {
    _id: 'ing-1',
    name: '100% Arabica Coffee Beans (Whole)',
    itemType: 'ingredient',
    category: 'Coffee & Espresso',
    currentStock: 14.5,
    minimumThreshold: 5.0,
    unit: 'kg',
    costPerUnitInPaise: 110000, // ₹1,100 per kg
    packageSize: '1kg Vacuum Bag',
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'ing-2',
    name: 'Fresh Whole Dairy Milk',
    itemType: 'ingredient',
    category: 'Dairy',
    currentStock: 8.0, // Low stock!
    minimumThreshold: 20.0,
    unit: 'L',
    costPerUnitInPaise: 6500, // ₹65 per L
    packageSize: '1 Liter Pouch',
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'ing-3',
    name: 'Malai Paneer (Fresh Cottage Cheese)',
    itemType: 'ingredient',
    category: 'Dairy',
    currentStock: 9.2,
    minimumThreshold: 4.0,
    unit: 'kg',
    costPerUnitInPaise: 38000, // ₹380 per kg
    packageSize: '1kg Block',
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'ing-4',
    name: '100% Mozzarella Pizza Cheese (Diced)',
    itemType: 'ingredient',
    category: 'Dairy',
    currentStock: 12.0,
    minimumThreshold: 5.0,
    unit: 'kg',
    costPerUnitInPaise: 48000, // ₹480 per kg
    packageSize: '2kg Bag',
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'ing-5',
    name: 'Fresh Red Tomatoes & Capsicum',
    itemType: 'ingredient',
    category: 'Vegetables',
    currentStock: 18.5,
    minimumThreshold: 10.0,
    unit: 'kg',
    costPerUnitInPaise: 4000, // ₹40 per kg
    packageSize: 'Daily Market Crate',
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'ing-6',
    name: 'Artisanal Multigrain Bread Loaves',
    itemType: 'ingredient',
    category: 'Bakery',
    currentStock: 4, // Low stock
    minimumThreshold: 8,
    unit: 'packet',
    costPerUnitInPaise: 4500, // ₹45 per loaf
    packageSize: '400g Sliced Loaf',
    lastUpdated: new Date().toISOString(),
  },
];

export default function IngredientsStockPage() {
  const [items, setItems] = useState<IInventoryItem[]>(DEFAULT_INGREDIENTS);
  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [adjustModalItem, setAdjustModalItem] = useState<IInventoryItem | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Stock In - Morning Market');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<IInventoryItem | null>(null);

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    category: 'Dairy',
    unit: 'kg',
    currentStock: 10,
    minimumThreshold: 4,
    costPerUnit: 120,
    packageSize: '1kg Pack',
  });

  const fetchIngredients = () => {
    fetch('http://localhost:5000/api/v1/admin/inventory?itemType=ingredient', {
      headers: { Authorization: 'Bearer mock_admin_token' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const list = Array.isArray(data.data) ? data.data : data.data.items;
          if (list && list.length > 0) {
            setItems(
              list.map((i: any) => ({
                ...i,
                currentStock: i.currentQuantity ?? i.currentStock ?? 0,
                minimumThreshold: i.minStockThreshold ?? i.minimumThreshold ?? 4,
                unit: i.stockUnit || i.unit || 'kg',
                costPerUnitInPaise: i.purchasePriceInPaise ?? i.costPerUnitInPaise ?? 0,
              }))
            );
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterLowStock && item.currentStock > item.minimumThreshold) return false;
    return true;
  });

  const handleQuickAdjust = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i._id === id
          ? { ...i, currentStock: Math.max(0, Number((i.currentStock + delta).toFixed(2))), lastUpdated: new Date().toISOString() }
          : i
      )
    );

    fetch(`http://localhost:5000/api/v1/admin/inventory/${id}/adjust`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock_admin_token',
      },
      body: JSON.stringify({ adjustment: delta, reason: 'Quick ingredient update' }),
    }).catch(() => {});
  };

  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredient.name.trim()) return;

    const payload = {
      name: newIngredient.name.trim(),
      itemType: 'ingredient',
      category: newIngredient.category,
      packageSize: newIngredient.packageSize,
      stockUnit: newIngredient.unit,
      openingStock: Number(newIngredient.currentStock),
      currentQuantity: Number(newIngredient.currentStock),
      minStockThreshold: Number(newIngredient.minimumThreshold),
      purchasePriceInPaise: Math.round(Number(newIngredient.costPerUnit) * 100),
    };

    const localItem: IInventoryItem = {
      _id: `ing-${Date.now()}`,
      name: payload.name,
      itemType: 'ingredient',
      category: payload.category,
      currentStock: payload.openingStock,
      minimumThreshold: payload.minStockThreshold,
      unit: payload.stockUnit,
      costPerUnitInPaise: payload.purchasePriceInPaise,
      packageSize: payload.packageSize,
      lastUpdated: new Date().toISOString(),
    };

    setItems([localItem, ...items]);
    setIsAddModalOpen(false);

    try {
      await fetch('http://localhost:5000/api/v1/admin/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_admin_token',
        },
        body: JSON.stringify(payload),
      });
    } catch {}
  };

  const handleDeleteIngredient = async () => {
    if (!deletingItem) return;
    setItems((prev) => prev.filter((i) => i._id !== deletingItem._id));

    try {
      await fetch(`http://localhost:5000/api/v1/admin/inventory/${deletingItem._id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer mock_admin_token' },
      });
    } catch {}
    setDeletingItem(null);
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalItem || adjustQuantity === 0) return;

    setIsSubmitting(true);
    const newStock = Math.max(0, Number((adjustModalItem.currentStock + adjustQuantity).toFixed(2)));

    fetch('http://localhost:5000/api/v1/admin/inventory/record-movement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer mock_admin_token' },
      body: JSON.stringify({
        itemId: adjustModalItem._id,
        operationType: adjustQuantity > 0 ? 'stock_in' : 'stock_out',
        quantity: Math.abs(adjustQuantity),
        reason: adjustReason,
        staffName: 'Admin / Kittu Cafe',
      }),
    })
      .catch(() => {})
      .finally(() => {
        // Update local state
        setItems(
          items.map((i) =>
            i._id === adjustModalItem._id
              ? { ...i, currentStock: newStock, lastUpdated: new Date().toISOString() }
              : i
          )
        );
        setIsSubmitting(false);
        setAdjustModalItem(null);
        setAdjustQuantity(0);
      });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900">
              Bulk Weight & Volume Units (kg, L, g)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
            Food Ingredients & Recipe Supply
          </h1>
          <p className="text-xs text-[#5D4037]">
            Monitor bulk kitchen ingredients used in coffees, sandwiches, pizzas, and desserts with fractional unit precision.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterLowStock
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-[#EBE0D2] text-[#3E2723] hover:bg-[#FAF6F0]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Ingredients Only</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D97736] to-[#C86D51] text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Ingredient</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Ingredient Items
          </span>
          <span className="text-xl font-black text-[#231709]">{items.length} Tracked</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Low Stock Ingredients
          </span>
          <span className="text-xl font-black text-rose-600">
            {items.filter((i) => i.currentStock <= i.minimumThreshold).length} Needs Reorder
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Dairy & Coffee Value
          </span>
          <span className="text-xl font-black text-[#D97736]">
            {formatPrice(
              items
                .filter((i) => i.category === 'Dairy' || i.category === 'Coffee & Espresso')
                .reduce((acc, i) => acc + i.currentStock * (i.costPerUnitInPaise || 0), 0)
            )}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Pantry Valuation
          </span>
          <span className="text-xl font-black text-emerald-700">
            {formatPrice(
              items.reduce((acc, i) => acc + i.currentStock * (i.costPerUnitInPaise || 0), 0)
            )}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Search ingredients by name or category (e.g. Milk, Cheese, Coffee Beans, Paneer)..."
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
                <th className="p-4">Ingredient Name</th>
                <th className="p-4">Package Form</th>
                <th className="p-4 text-center">Available Stock</th>
                <th className="p-4 text-center">Threshold</th>
                <th className="p-4">Cost / Unit</th>
                <th className="p-4">Total Value</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {filteredItems.map((item) => {
                const isLow = item.currentStock <= item.minimumThreshold;
                return (
                  <tr key={item._id} className="hover:bg-[#FFFDFB] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                          <Scale className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#231709] block text-xs">{item.name}</span>
                          <span className="text-[10px] text-stone-500">{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-stone-600 font-medium">
                      {item.packageSize || 'Bulk Pack'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-black text-sm ${isLow ? 'text-rose-600' : 'text-[#231709]'}`}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className="p-4 text-center text-stone-500 font-medium">
                      {item.minimumThreshold} {item.unit}
                    </td>
                    <td className="p-4 text-stone-600 font-bold">
                      {formatPrice(item.costPerUnitInPaise || 0)} / {item.unit}
                    </td>
                    <td className="p-4 font-black text-[#231709]">
                      {formatPrice(Math.round(item.currentStock * (item.costPerUnitInPaise || 0)))}
                    </td>
                    <td className="p-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Sufficient
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="inline-flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-[#EBE0D2]">
                          <button
                            onClick={() => handleQuickAdjust(item._id, item.unit === 'g' || item.unit === 'ml' ? -250 : -1)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-stone-100 text-[#4E342E] font-black flex items-center justify-center text-xs shadow-xs"
                            title="Deduct"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(item._id, item.unit === 'g' || item.unit === 'ml' ? 250 : 1)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-stone-100 text-[#4E342E] font-black flex items-center justify-center text-xs shadow-xs"
                            title="Add"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setAdjustModalItem(item);
                            setAdjustQuantity(0);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#EBE0D2] bg-white hover:bg-[#FAF6F0] text-xs font-bold text-[#231709] transition-colors cursor-pointer"
                        >
                          Adjust
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Delete Ingredient"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#EBE0D2] shadow-2xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
                Kitchen Stock Adjustment
              </span>
              <h3 className="text-lg font-black text-[#231709] mt-0.5">
                {adjustModalItem.name}
              </h3>
              <p className="text-xs text-stone-500">
                Current Level: <strong>{adjustModalItem.currentStock} {adjustModalItem.unit}</strong>
              </p>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#231709]">
                  Quantity Change ({adjustModalItem.unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={adjustQuantity || ''}
                  onChange={(e) => setAdjustQuantity(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. +5.0 (Restock) or -0.5 (Prep Waste)"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                />
                <span className="text-[10px] text-stone-400 block">
                  New stock will be: {(adjustModalItem.currentStock + adjustQuantity).toFixed(2)} {adjustModalItem.unit}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#231709]">Reason</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736] bg-white cursor-pointer"
                >
                  <option value="Stock In - Morning Market">Stock In - Morning Market</option>
                  <option value="Stock In - Supplier Receiving">Stock In - Supplier Receiving</option>
                  <option value="Preparation Spillage / Wastage">Preparation Spillage / Wastage</option>
                  <option value="Physical Weigh-in Adjustment">Physical Weigh-in Adjustment</option>
                  <option value="Batch Recipe Preparation">Batch Recipe Preparation</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FAF6F0]">
                <button
                  type="button"
                  onClick={() => setAdjustModalItem(null)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || adjustQuantity === 0}
                  className="px-5 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording...' : 'Update Quantity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Ingredient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#EBE0D2] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE0D2]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
                  Kitchen Inventory
                </span>
                <h3 className="text-xl font-black text-[#231709]">Add Food Ingredient</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIngredient} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#231709]">Ingredient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arabica Beans, Malai Paneer, Mozzarella"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Category</label>
                  <input
                    type="text"
                    value={newIngredient.category}
                    onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Measurement Unit</label>
                  <select
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="L">Liters (L)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="piece">Pieces</option>
                    <option value="packet">Packets</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Current Stock</label>
                  <input
                    type="number"
                    step="any"
                    value={newIngredient.currentStock}
                    onChange={(e) => setNewIngredient({ ...newIngredient, currentStock: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Min. Threshold</label>
                  <input
                    type="number"
                    step="any"
                    value={newIngredient.minimumThreshold}
                    onChange={(e) => setNewIngredient({ ...newIngredient, minimumThreshold: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Cost per Unit (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={newIngredient.costPerUnit}
                    onChange={(e) => setNewIngredient({ ...newIngredient, costPerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Package Specification</label>
                  <input
                    type="text"
                    value={newIngredient.packageSize}
                    onChange={(e) => setNewIngredient({ ...newIngredient, packageSize: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EBE0D2]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D97736] to-[#C86D51] text-white text-xs font-black shadow-md"
                >
                  Save Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-[#EBE0D2] shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#231709]">Delete Ingredient?</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to remove <strong>"{deletingItem.name}"</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl border border-[#EBE0D2] text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteIngredient}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
