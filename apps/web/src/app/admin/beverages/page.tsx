'use client';

import React, { useState, useEffect } from 'react';
import {
  Wine,
  Plus,
  ArrowDownUp,
  AlertTriangle,
  Search,
  CheckCircle2,
  RefreshCw,
  Package,
  Layers,
  Trash2,
  X,
  Edit2,
} from 'lucide-react';
import { IInventoryItem } from '@kittu-cafe/shared';
import { formatPrice } from '../../../lib/api';

const DEFAULT_BEVERAGES: IInventoryItem[] = [
  {
    _id: 'bev-1',
    name: 'Red Bull Energy Drink (Can)',
    itemType: 'beverage',
    category: 'Energy Drinks',
    currentStock: 48,
    minimumThreshold: 20,
    unit: 'can',
    costPerUnitInPaise: 9500,
    sellingPriceInPaise: 13500,
    packageSize: '250ml Slim Can',
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'bev-2',
    name: 'Coca-Cola (Glass Bottle / Can)',
    itemType: 'beverage',
    category: 'Carbonated Soft Drinks',
    currentStock: 12, // Low stock!
    minimumThreshold: 24,
    unit: 'can',
    costPerUnitInPaise: 2800,
    sellingPriceInPaise: 5000,
    packageSize: '300ml Can',
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'bev-3',
    name: 'Sprite (Can)',
    itemType: 'beverage',
    category: 'Carbonated Soft Drinks',
    currentStock: 36,
    minimumThreshold: 15,
    unit: 'can',
    costPerUnitInPaise: 2800,
    sellingPriceInPaise: 5000,
    packageSize: '300ml Can',
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'bev-4',
    name: 'Packaged Natural Spring Water',
    itemType: 'beverage',
    category: 'Water',
    currentStock: 60,
    minimumThreshold: 24,
    unit: 'bottle',
    costPerUnitInPaise: 1200,
    sellingPriceInPaise: 2500,
    packageSize: '1 Liter Bottle',
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'bev-5',
    name: 'Monin Roasted Hazelnut Syrup',
    itemType: 'beverage',
    category: 'Syrups & Flavors',
    currentStock: 4,
    minimumThreshold: 2,
    unit: 'bottle',
    costPerUnitInPaise: 75000,
    sellingPriceInPaise: 0,
    packageSize: '750ml Glass Bottle',
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: 'bev-6',
    name: 'Monin Madagascar Vanilla Syrup',
    itemType: 'beverage',
    category: 'Syrups & Flavors',
    currentStock: 1, // Low stock
    minimumThreshold: 2,
    unit: 'bottle',
    costPerUnitInPaise: 75000,
    sellingPriceInPaise: 0,
    packageSize: '750ml Glass Bottle',
    lastUpdated: new Date().toISOString(),
  },
];

export default function BeverageStockPage() {
  const [items, setItems] = useState<IInventoryItem[]>(DEFAULT_BEVERAGES);
  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [adjustModalItem, setAdjustModalItem] = useState<IInventoryItem | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Stock In - Restock');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<IInventoryItem | null>(null);

  const [newBeverage, setNewBeverage] = useState({
    name: '',
    category: 'Cold Drinks',
    packageSize: '250ml Can',
    unit: 'can',
    currentStock: 24,
    minimumThreshold: 10,
    costPerUnit: 35,
    sellingPrice: 50,
  });

  const fetchBeverages = () => {
    fetch('http://localhost:5000/api/v1/admin/inventory?itemType=beverage', {
      headers: { Authorization: 'Bearer mock_admin_token' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const list = Array.isArray(data.data) ? data.data : data.data.items;
          if (list && list.length > 0) {
            setItems(list.map((i: any) => ({
              ...i,
              currentStock: i.currentQuantity ?? i.currentStock ?? 0,
              minimumThreshold: i.minStockThreshold ?? i.minimumThreshold ?? 5,
              unit: i.stockUnit || i.unit || 'can',
              costPerUnitInPaise: i.purchasePriceInPaise ?? i.costPerUnitInPaise ?? 0,
              sellingPriceInPaise: i.sellingPriceInPaise || 0,
            })));
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchBeverages();
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
          ? { ...i, currentStock: Math.max(0, i.currentStock + delta), lastUpdated: new Date().toISOString() }
          : i
      )
    );

    fetch(`http://localhost:5000/api/v1/admin/inventory/${id}/adjust`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock_admin_token',
      },
      body: JSON.stringify({ adjustment: delta, reason: 'Quick beverage update' }),
    }).catch(() => {});
  };

  const handleCreateBeverage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBeverage.name.trim()) return;

    const payload = {
      name: newBeverage.name.trim(),
      itemType: 'beverage',
      category: newBeverage.category,
      packageSize: newBeverage.packageSize,
      stockUnit: newBeverage.unit,
      openingStock: Number(newBeverage.currentStock),
      currentQuantity: Number(newBeverage.currentStock),
      minStockThreshold: Number(newBeverage.minimumThreshold),
      purchasePriceInPaise: Math.round(Number(newBeverage.costPerUnit) * 100),
      sellingPriceInPaise: Math.round(Number(newBeverage.sellingPrice) * 100),
    };

    const localItem: IInventoryItem = {
      _id: `bev-${Date.now()}`,
      name: payload.name,
      itemType: 'beverage',
      category: payload.category,
      currentStock: payload.openingStock,
      minimumThreshold: payload.minStockThreshold,
      unit: payload.stockUnit,
      costPerUnitInPaise: payload.purchasePriceInPaise,
      sellingPriceInPaise: payload.sellingPriceInPaise,
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

  const handleDeleteBeverage = async () => {
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
    const newStock = Math.max(0, adjustModalItem.currentStock + adjustQuantity);

    // Call backend API
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-900">
              Discrete Can & Bottle Units
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
            Beverage Stock Manager
          </h1>
          <p className="text-xs text-[#5D4037]">
            Track packaged cans, glass bottles, and beverage syrups for Kittu Cafe with exact unit counts.
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
            <span>Low Stock Only</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D97736] to-[#C86D51] text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Beverage</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Beverage Types
          </span>
          <span className="text-xl font-black text-[#231709]">{items.length} Products</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Discrete Units
          </span>
          <span className="text-xl font-black text-[#231709]">
            {items.reduce((acc, i) => acc + i.currentStock, 0)} Units
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Low Stock Warnings
          </span>
          <span className="text-xl font-black text-rose-600">
            {items.filter((i) => i.currentStock <= i.minimumThreshold).length} Items
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Inventory Value
          </span>
          <span className="text-xl font-black text-emerald-700">
            {formatPrice(
              items.reduce((acc, i) => acc + i.currentStock * (i.costPerUnitInPaise || 0), 0)
            )}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Search beverage by brand, name or category (e.g. Red Bull, Coke, Syrup)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-[#231709]"
        />
      </div>

      {/* Beverage Table */}
      <div className="rounded-3xl bg-white border border-[#EBE0D2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#EBE0D2] text-[10px] font-black uppercase text-[#5D4037] tracking-wider">
              <tr>
                <th className="p-4">Beverage Product</th>
                <th className="p-4">Package Spec</th>
                <th className="p-4 text-center">Current Stock</th>
                <th className="p-4 text-center">Min. Threshold</th>
                <th className="p-4">Unit Cost</th>
                <th className="p-4">Selling Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {filteredItems.map((item) => {
                const isLow = item.currentStock <= item.minimumThreshold;
                return (
                  <tr key={item._id} className="hover:bg-[#FFFDFB] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D97736] shrink-0">
                          <Wine className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#231709] block text-xs">{item.name}</span>
                          <span className="text-[10px] text-stone-500">{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-stone-600 font-medium">
                      {item.packageSize || 'Discrete Can'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-black text-sm ${isLow ? 'text-rose-600' : 'text-[#231709]'}`}>
                        {item.currentStock} {item.unit}s
                      </span>
                    </td>
                    <td className="p-4 text-center text-stone-500 font-medium">
                      {item.minimumThreshold} {item.unit}s
                    </td>
                    <td className="p-4 text-stone-600 font-bold">
                      {formatPrice(item.costPerUnitInPaise || 0)}
                    </td>
                    <td className="p-4 font-black text-[#231709]">
                      {item.sellingPriceInPaise ? formatPrice(item.sellingPriceInPaise) : 'In-Recipe'}
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
                          Optimal
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="inline-flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-[#EBE0D2]">
                          <button
                            onClick={() => handleQuickAdjust(item._id, -1)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-stone-100 text-[#4E342E] font-black flex items-center justify-center text-xs shadow-xs"
                            title="Deduct 1"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(item._id, 1)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-stone-100 text-[#4E342E] font-black flex items-center justify-center text-xs shadow-xs"
                            title="Add 1"
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
                          title="Delete Beverage"
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

      {/* Adjust Stock Modal */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#EBE0D2] shadow-2xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
                Stock Audit Adjustment
              </span>
              <h3 className="text-lg font-black text-[#231709] mt-0.5">
                {adjustModalItem.name}
              </h3>
              <p className="text-xs text-stone-500">
                Current Count: <strong>{adjustModalItem.currentStock} {adjustModalItem.unit}s</strong>
              </p>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#231709]">
                  Quantity to Add (+) or Deduct (-)
                </label>
                <input
                  type="number"
                  required
                  value={adjustQuantity || ''}
                  onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 0)}
                  placeholder="e.g. +24 for receiving stock or -2 for breakage"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                />
                <span className="text-[10px] text-stone-400 block">
                  New stock will become: {adjustModalItem.currentStock + adjustQuantity} {adjustModalItem.unit}s
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#231709]">Reason for Adjustment</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736] bg-white cursor-pointer"
                >
                  <option value="Stock In - Supplier Delivery">Stock In - Supplier Delivery</option>
                  <option value="Stock In - Restock">Stock In - Restock</option>
                  <option value="Wastage / Damaged Can">Wastage / Damaged Can</option>
                  <option value="Physical Count Correction">Physical Count Correction</option>
                  <option value="Staff Complimentary Consumption">Staff Complimentary Consumption</option>
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
                  {isSubmitting ? 'Recording Ledger...' : 'Confirm Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Beverage Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#EBE0D2] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE0D2]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
                  Beverage Catalog
                </span>
                <h3 className="text-xl font-black text-[#231709]">Add New Beverage</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBeverage} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#231709]">Beverage Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diet Coke, Red Bull Tropical, Frooti"
                  value={newBeverage.name}
                  onChange={(e) => setNewBeverage({ ...newBeverage, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Category</label>
                  <input
                    type="text"
                    value={newBeverage.category}
                    onChange={(e) => setNewBeverage({ ...newBeverage, category: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Package Spec</label>
                  <input
                    type="text"
                    value={newBeverage.packageSize}
                    onChange={(e) => setNewBeverage({ ...newBeverage, packageSize: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Opening Stock</label>
                  <input
                    type="number"
                    value={newBeverage.currentStock}
                    onChange={(e) => setNewBeverage({ ...newBeverage, currentStock: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Min. Threshold</label>
                  <input
                    type="number"
                    value={newBeverage.minimumThreshold}
                    onChange={(e) => setNewBeverage({ ...newBeverage, minimumThreshold: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={newBeverage.costPerUnit}
                    onChange={(e) => setNewBeverage({ ...newBeverage, costPerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={newBeverage.sellingPrice}
                    onChange={(e) => setNewBeverage({ ...newBeverage, sellingPrice: parseFloat(e.target.value) || 0 })}
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
                  Save Beverage
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
              <h3 className="text-lg font-black text-[#231709]">Delete Beverage?</h3>
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
                onClick={handleDeleteBeverage}
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
