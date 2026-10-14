'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  RefreshCw,
  Wine,
  Carrot,
  Box,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  History,
  TrendingDown,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  itemType: 'beverage' | 'ingredient' | 'packaging';
  category: string;
  brand?: string;
  stockUnit: string;
  currentQuantity: number;
  currentStock?: number;
  minStockThreshold: number;
  minimumThreshold?: number;
  purchasePriceInPaise: number;
  costPerUnitInPaise?: number;
  sellingPriceInPaise?: number;
  storageLocation?: string;
  packageSize?: string;
  isActive?: boolean;
}

const DEFAULT_ITEMS: InventoryItem[] = [
  {
    _id: 'bev-1',
    name: 'Red Bull Energy Drink',
    sku: 'BEV-RB-250',
    itemType: 'beverage',
    category: 'Energy Drinks',
    brand: 'Red Bull',
    packageSize: '250ml Slim Can',
    stockUnit: 'can',
    currentQuantity: 24,
    minStockThreshold: 6,
    purchasePriceInPaise: 9500, // ₹95
    sellingPriceInPaise: 12500, // ₹125
    storageLocation: 'Beverage Chiller A',
  },
  {
    _id: 'bev-2',
    name: 'Coca-Cola Can',
    sku: 'BEV-COKE-330',
    itemType: 'beverage',
    category: 'Cold Drinks',
    brand: 'Coca-Cola',
    packageSize: '330ml Can',
    stockUnit: 'can',
    currentQuantity: 36,
    minStockThreshold: 12,
    purchasePriceInPaise: 3000,
    sellingPriceInPaise: 4000,
    storageLocation: 'Beverage Chiller B',
  },
  {
    _id: 'bev-3',
    name: 'Sprite Can',
    sku: 'BEV-SPRITE-330',
    itemType: 'beverage',
    category: 'Cold Drinks',
    brand: 'Sprite',
    packageSize: '330ml Can',
    stockUnit: 'can',
    currentQuantity: 8, // Low stock!
    minStockThreshold: 10,
    purchasePriceInPaise: 3000,
    sellingPriceInPaise: 4000,
    storageLocation: 'Beverage Chiller B',
  },
  {
    _id: 'ing-1',
    name: 'Fresh Cow Milk (Dairy Gold)',
    sku: 'ING-MILK-L',
    itemType: 'ingredient',
    category: 'Dairy',
    packageSize: '1L Pouch',
    stockUnit: 'L',
    currentQuantity: 22.5,
    minStockThreshold: 8,
    purchasePriceInPaise: 6400, // ₹64/L
    storageLocation: 'Dairy Fridge 1',
  },
  {
    _id: 'ing-2',
    name: 'Roasted Arabica Coffee Beans',
    sku: 'ING-COFFEE-KG',
    itemType: 'ingredient',
    category: 'Coffee & Espresso',
    packageSize: '1kg Vacuum Bag',
    stockUnit: 'kg',
    currentQuantity: 8.5,
    minStockThreshold: 2.5,
    purchasePriceInPaise: 85000, // ₹850/kg
    storageLocation: 'Dry Pantry Bin 2',
  },
  {
    _id: 'ing-3',
    name: 'Fresh Malai Paneer',
    sku: 'ING-PANEER-KG',
    itemType: 'ingredient',
    category: 'Dairy',
    packageSize: '1kg Block',
    stockUnit: 'kg',
    currentQuantity: 1.5, // Low stock!
    minStockThreshold: 3.0,
    purchasePriceInPaise: 36000, // ₹360/kg
    storageLocation: 'Dairy Fridge 1',
  },
  {
    _id: 'ing-4',
    name: 'Mozzarella Cheese Blend',
    sku: 'ING-CHEESE-KG',
    itemType: 'ingredient',
    category: 'Dairy',
    packageSize: '1kg Shredded',
    stockUnit: 'kg',
    currentQuantity: 9.0,
    minStockThreshold: 3.0,
    purchasePriceInPaise: 48000, // ₹480/kg
    storageLocation: 'Dairy Freezer',
  },
  {
    _id: 'ing-5',
    name: 'Stone Baked Pizza Base (8-inch)',
    sku: 'ING-PIZZABASE-8',
    itemType: 'ingredient',
    category: 'Bakery',
    packageSize: 'Pack of 5',
    stockUnit: 'piece',
    currentQuantity: 28,
    minStockThreshold: 10,
    purchasePriceInPaise: 2500, // ₹25/piece
    storageLocation: 'Bakery Rack',
  },
  {
    _id: 'pack-1',
    name: 'Hot Coffee Kraft Cups (250ml)',
    sku: 'PKG-CUP-250',
    itemType: 'packaging',
    category: 'Disposable Packaging',
    packageSize: 'Pack of 100',
    stockUnit: 'piece',
    currentQuantity: 240,
    minStockThreshold: 50,
    purchasePriceInPaise: 350, // ₹3.50/cup
    storageLocation: 'Storage Loft Shelf C',
  },
];

export default function AdminInventoryMasterPage() {
  const [items, setItems] = useState<InventoryItem[]>(DEFAULT_ITEMS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'beverage' | 'ingredient' | 'packaging'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low_stock'>('all');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('Stock In - Restock');
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);

  // Add Item Form State
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    itemType: 'ingredient' as 'beverage' | 'ingredient' | 'packaging',
    category: 'Dairy',
    brand: '',
    stockUnit: 'kg',
    openingStock: 10,
    minStockThreshold: 5,
    purchasePrice: 100, // in Rupees
    sellingPrice: 0, // in Rupees
    storageLocation: 'Main Storage Room',
    packageSize: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchItems = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/v1/admin/inventory', {
      headers: { Authorization: 'Bearer mock_admin_token' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.items?.length > 0) {
          setItems(data.data.items);
        }
      })
      .catch(() => {
        // Fallback to local items
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Quick Adjustment (+/- delta)
  const handleQuickAdjust = async (id: string, delta: number) => {
    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const prevQty = item.currentQuantity ?? item.currentStock ?? 0;
          const newQty = Math.max(0, Number((prevQty + delta).toFixed(2)));
          return { ...item, currentQuantity: newQty, currentStock: newQty };
        }
        return item;
      })
    );

    const sign = delta > 0 ? `+${delta}` : `${delta}`;
    showToast(`Stock updated: ${sign}`);

    try {
      await fetch(`http://localhost:5000/api/v1/admin/inventory/${id}/adjust`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_admin_token',
        },
        body: JSON.stringify({
          adjustment: delta,
          reason: delta > 0 ? 'Quick stock restock' : 'Quick manual deduction',
        }),
      });
    } catch (e) {
      // Local fallback
    }
  };

  // Submit Detailed Stock Adjustment
  const handleDetailedAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;

    const delta = adjustReason.includes('Wastage') || adjustReason.includes('Damage') || adjustReason.includes('Consumption')
      ? -Math.abs(adjustAmount)
      : Math.abs(adjustAmount);

    await handleQuickAdjust(adjustingItem._id, delta);
    setAdjustingItem(null);
    setAdjustAmount(10);
  };

  // Submit New Item Creation
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    const payload = {
      name: newItem.name.trim(),
      sku: newItem.sku.trim() || `ITEM-${Date.now().toString().slice(-6)}`,
      itemType: newItem.itemType,
      category: newItem.category,
      brand: newItem.brand || undefined,
      stockUnit: newItem.stockUnit,
      openingStock: Number(newItem.openingStock),
      currentQuantity: Number(newItem.openingStock),
      minStockThreshold: Number(newItem.minStockThreshold),
      purchasePriceInPaise: Math.round(Number(newItem.purchasePrice) * 100),
      sellingPriceInPaise: newItem.sellingPrice ? Math.round(Number(newItem.sellingPrice) * 100) : undefined,
      storageLocation: newItem.storageLocation,
      packageSize: newItem.packageSize,
    };

    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_admin_token',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setItems([data.data, ...items]);
      } else {
        // Fallback local creation
        const localItem: InventoryItem = {
          _id: `item-${Date.now()}`,
          ...payload,
          purchasePriceInPaise: payload.purchasePriceInPaise,
        };
        setItems([localItem, ...items]);
      }
    } catch {
      const localItem: InventoryItem = {
        _id: `item-${Date.now()}`,
        ...payload,
        purchasePriceInPaise: payload.purchasePriceInPaise,
      };
      setItems([localItem, ...items]);
    }

    showToast(`Added "${newItem.name}" to inventory!`);
    setIsAddModalOpen(false);
    setNewItem({
      name: '',
      sku: '',
      itemType: 'ingredient',
      category: 'Dairy',
      brand: '',
      stockUnit: 'kg',
      openingStock: 10,
      minStockThreshold: 5,
      purchasePrice: 100,
      sellingPrice: 0,
      storageLocation: 'Main Storage Room',
      packageSize: '',
    });
  };

  // Submit Item Edit
  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updatedList = items.map((i) => (i._id === editingItem._id ? editingItem : i));
    setItems(updatedList);

    try {
      await fetch(`http://localhost:5000/api/v1/admin/inventory/${editingItem._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_admin_token',
        },
        body: JSON.stringify(editingItem),
      });
    } catch {
      // Local fallback
    }

    showToast(`Updated "${editingItem.name}"`);
    setEditingItem(null);
  };

  // Delete Item
  const handleDeleteItem = async () => {
    if (!deletingItem) return;

    setItems((prev) => prev.filter((i) => i._id !== deletingItem._id));
    showToast(`Removed "${deletingItem.name}" from inventory`);

    try {
      await fetch(`http://localhost:5000/api/v1/admin/inventory/${deletingItem._id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer mock_admin_token' },
      });
    } catch {
      // Local fallback
    }

    setDeletingItem(null);
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        (item.sku || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q) ||
        (item.storageLocation || '').toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (typeFilter !== 'all' && item.itemType !== typeFilter) return false;

      const qty = item.currentQuantity ?? item.currentStock ?? 0;
      const threshold = item.minStockThreshold ?? item.minimumThreshold ?? 5;
      if (statusFilter === 'low_stock' && qty > threshold) return false;

      return true;
    });
  }, [items, search, typeFilter, statusFilter]);

  // Summary Metrics
  const totalItemsCount = items.length;
  const lowStockCount = items.filter(
    (i) => (i.currentQuantity ?? i.currentStock ?? 0) <= (i.minStockThreshold ?? i.minimumThreshold ?? 5)
  ).length;
  const totalValuation = items.reduce((acc, i) => {
    const qty = i.currentQuantity ?? i.currentStock ?? 0;
    const cost = (i.purchasePriceInPaise ?? i.costPerUnitInPaise ?? 0) / 100;
    return acc + qty * cost;
  }, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#231709] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#D97736] animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Package className="w-3.5 h-3.5 text-[#D97736]" />
            <span>Kittu Cafe • Inventory & Supply Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight">
            Inventory & Supply Master
          </h1>
          <p className="text-xs text-[#5D4037]">
            Full management: Add new items, update stock counts, adjust thresholds, and delete items.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchItems}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#EBE0D2] bg-white hover:bg-[#FAF6F0] text-[#4E342E] transition-colors cursor-pointer"
            title="Refresh Stock Levels"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/stock-movements"
            className="px-4 py-2.5 rounded-xl border border-[#EBE0D2] bg-white hover:bg-[#FAF6F0] text-xs font-bold text-[#4E342E] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <History className="w-4 h-4 text-[#C86D51]" />
            <span className="hidden sm:inline">Ledger Log</span>
          </Link>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D97736] to-[#C86D51] hover:from-[#C86D51] hover:to-[#B25D42] text-white text-xs font-extrabold inline-flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Catalog Items
          </span>
          <span className="text-2xl font-black text-[#231709] mt-0.5 block">{totalItemsCount}</span>
          <span className="text-[11px] text-stone-500 font-medium">Ingredients, cans & packaging</span>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'low_stock' ? 'all' : 'low_stock')}
          className={`p-4 rounded-2xl border shadow-xs cursor-pointer transition-all ${
            statusFilter === 'low_stock'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
              : 'bg-white border-[#EBE0D2] hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
              Low Stock Warnings
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-black text-rose-600 mt-0.5 block">{lowStockCount}</span>
          <span className="text-[11px] text-rose-700 font-medium">Click to {statusFilter === 'low_stock' ? 'show all' : 'filter alert items'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Inventory Asset Value
          </span>
          <span className="text-2xl font-black text-emerald-700 mt-0.5 block">
            ₹{totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[11px] text-stone-500 font-medium">At current purchase cost</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Connected Suppliers
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-2xl font-black text-[#231709]">4 Vendors</span>
            <Link href="/admin/suppliers" className="text-xs text-[#D97736] font-bold hover:underline inline-flex items-center gap-1">
              View <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Dausa, Jaipur & Dairy</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#EBE0D2]">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search items by name, SKU, category (e.g. Red Bull, Milk, Paneer, Cups)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent focus:outline-none text-[#231709]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-stone-400 hover:text-stone-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Status Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#231709] text-white'
                  : 'bg-[#FAF6F0] text-[#5D4037] hover:bg-stone-200'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setStatusFilter('low_stock')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                statusFilter === 'low_stock'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Low Stock ({lowStockCount})</span>
            </button>
          </div>
        </div>

        {/* Type Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {[
            { id: 'all', label: 'All Stock Types' },
            { id: 'beverage', label: '🍾 Beverages & Cans' },
            { id: 'ingredient', label: '🧀 Ingredients & Dairy' },
            { id: 'packaging', label: '📦 Packaging & Disposables' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                typeFilter === tab.id
                  ? 'bg-[#D97736] text-white shadow-xs'
                  : 'bg-[#FAF6F0] text-[#5D4037] hover:bg-stone-200 border border-[#EBE0D2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Master Table */}
      <div className="rounded-3xl bg-white border border-[#EBE0D2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#EBE0D2] text-[10px] font-black uppercase text-[#5D4037] tracking-wider">
              <tr>
                <th className="p-4">Item & SKU</th>
                <th className="p-4">Type / Category</th>
                <th className="p-4 text-center">Current Stock</th>
                <th className="p-4 text-center">Min. Threshold</th>
                <th className="p-4">Purchase Cost</th>
                <th className="p-4">Storage Location</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-center">Quick Stock Update</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-stone-500">
                    <p className="font-bold text-sm text-[#231709]">No inventory items found</p>
                    <p className="text-xs text-stone-400 mt-1">Try clearing your search query or add a new item.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const qty = item.currentQuantity ?? item.currentStock ?? 0;
                  const threshold = item.minStockThreshold ?? item.minimumThreshold ?? 5;
                  const isLow = qty <= threshold;
                  const cost = (item.purchasePriceInPaise ?? item.costPerUnitInPaise ?? 0) / 100;

                  return (
                    <tr key={item._id} className="hover:bg-[#FFFDFB] transition-colors">
                      {/* Name & SKU */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D97736] shrink-0">
                            {item.itemType === 'beverage' ? (
                              <Wine className="w-4 h-4" />
                            ) : item.itemType === 'packaging' ? (
                              <Box className="w-4 h-4" />
                            ) : (
                              <Carrot className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <span className="font-extrabold text-[#231709] block text-xs">{item.name}</span>
                            <span className="text-[10px] font-mono text-stone-400">{item.sku}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Type */}
                      <td className="p-4">
                        <span className="font-bold text-[#231709] block text-[11px]">{item.category}</span>
                        <span className="text-[10px] text-stone-400 capitalize">{item.itemType}</span>
                      </td>

                      {/* Current Stock */}
                      <td className="p-4 text-center">
                        <span className={`font-black text-sm ${isLow ? 'text-rose-600' : 'text-[#231709]'}`}>
                          {qty.toLocaleString()} {item.stockUnit}
                        </span>
                      </td>

                      {/* Threshold */}
                      <td className="p-4 text-center text-stone-500 font-bold">
                        {threshold.toLocaleString()} {item.stockUnit}
                      </td>

                      {/* Purchase Cost */}
                      <td className="p-4">
                        <span className="font-bold text-[#231709] block text-xs">₹{cost}</span>
                        <span className="text-[10px] text-stone-400">per {item.stockUnit}</span>
                      </td>

                      {/* Storage Location */}
                      <td className="p-4 text-stone-600 font-medium">
                        {item.storageLocation || 'Main Kitchen Storage'}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Optimal
                          </span>
                        )}
                      </td>

                      {/* Quick Adjust +/- Buttons */}
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-[#EBE0D2]">
                          <button
                            onClick={() => handleQuickAdjust(item._id, item.stockUnit === 'g' || item.stockUnit === 'ml' ? -500 : -1)}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 text-[#4E342E] font-extrabold flex items-center justify-center text-xs shadow-xs cursor-pointer active:scale-90"
                            title="Quick Deduct"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(item._id, item.stockUnit === 'g' || item.stockUnit === 'ml' ? 500 : 1)}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 text-[#4E342E] font-extrabold flex items-center justify-center text-xs shadow-xs cursor-pointer active:scale-90"
                            title="Quick Add +1"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(item._id, item.stockUnit === 'g' || item.stockUnit === 'ml' ? 1000 : 10)}
                            className="px-2 h-7 rounded-lg bg-[#231709] hover:bg-[#3E2723] text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs cursor-pointer active:scale-90"
                            title="Quick Restock +10"
                          >
                            {item.stockUnit === 'g' || item.stockUnit === 'ml' ? '+1k' : '+10'}
                          </button>
                        </div>
                      </td>

                      {/* Actions (Audit Modal, Edit, Delete) */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setAdjustingItem(item);
                              setAdjustAmount(item.stockUnit === 'g' || item.stockUnit === 'ml' ? 500 : 10);
                            }}
                            className="p-1.5 rounded-lg border border-[#EBE0D2] bg-white hover:bg-[#FAF6F0] text-stone-700 transition-colors cursor-pointer"
                            title="Adjust Stock Quantity & Log Reason"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D97736]" />
                          </button>

                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 rounded-lg border border-[#EBE0D2] bg-white hover:bg-[#FAF6F0] text-stone-700 transition-colors cursor-pointer"
                            title="Edit Item Details"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-stone-600" />
                          </button>

                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: ADD NEW ITEM ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-[#EBE0D2] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE0D2]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
                  Catalog Expansion
                </span>
                <h3 className="text-xl font-black text-[#231709]">Add New Inventory Item</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Item Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vanilla Ice Cream, Paper Straws, Sprite"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Item Type *</label>
                  <select
                    value={newItem.itemType}
                    onChange={(e) => setNewItem({ ...newItem, itemType: e.target.value as any })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  >
                    <option value="ingredient">Food Ingredient / Dairy</option>
                    <option value="beverage">Beverage (Can / Bottle)</option>
                    <option value="packaging">Packaging & Disposable</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Dairy, Coffee, Cold Drinks, Bakery"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">SKU Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ING-VAN-1L"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Stock Unit *</label>
                  <select
                    value={newItem.stockUnit}
                    onChange={(e) => setNewItem({ ...newItem, stockUnit: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                  >
                    <option value="can">can</option>
                    <option value="bottle">bottle</option>
                    <option value="kg">kg</option>
                    <option value="g">grams (g)</option>
                    <option value="L">Liters (L)</option>
                    <option value="ml">ml</option>
                    <option value="piece">piece</option>
                    <option value="packet">packet / pouch</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Opening / Current Stock *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newItem.openingStock}
                    onChange={(e) => setNewItem({ ...newItem, openingStock: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Low Stock Alert Threshold *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newItem.minStockThreshold}
                    onChange={(e) => setNewItem({ ...newItem, minStockThreshold: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Purchase Price (₹) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newItem.purchasePrice}
                    onChange={(e) => setNewItem({ ...newItem, purchasePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Selling Price (₹) (If sellable)</label>
                  <input
                    type="number"
                    step="any"
                    value={newItem.sellingPrice}
                    onChange={(e) => setNewItem({ ...newItem, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Storage Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Dairy Fridge 1, Dry Pantry Bin 2, Beverage Chiller A"
                    value={newItem.storageLocation}
                    onChange={(e) => setNewItem({ ...newItem, storageLocation: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EBE0D2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs font-bold text-[#5D4037] hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D97736] to-[#C86D51] text-white text-xs font-extrabold shadow-md hover:opacity-95"
                >
                  Save & Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT ITEM ================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-[#EBE0D2] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE0D2]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
                  Catalog Modification
                </span>
                <h3 className="text-xl font-black text-[#231709]">Edit Item Details</h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Item Name</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Category</label>
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Stock Unit</label>
                  <input
                    type="text"
                    value={editingItem.stockUnit}
                    onChange={(e) => setEditingItem({ ...editingItem, stockUnit: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Current Stock Level</label>
                  <input
                    type="number"
                    step="any"
                    value={editingItem.currentQuantity ?? editingItem.currentStock ?? 0}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        currentQuantity: parseFloat(e.target.value) || 0,
                        currentStock: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Low Stock Threshold</label>
                  <input
                    type="number"
                    step="any"
                    value={editingItem.minStockThreshold ?? editingItem.minimumThreshold ?? 5}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        minStockThreshold: parseFloat(e.target.value) || 0,
                        minimumThreshold: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Purchase Price (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={(editingItem.purchasePriceInPaise ?? editingItem.costPerUnitInPaise ?? 0) / 100}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        purchasePriceInPaise: Math.round((parseFloat(e.target.value) || 0) * 100),
                        costPerUnitInPaise: Math.round((parseFloat(e.target.value) || 0) * 100),
                      })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Selling Price (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={(editingItem.sellingPriceInPaise || 0) / 100}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        sellingPriceInPaise: Math.round((parseFloat(e.target.value) || 0) * 100),
                      })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Storage Location</label>
                  <input
                    type="text"
                    value={editingItem.storageLocation || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, storageLocation: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EBE0D2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs font-bold text-[#5D4037] hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#231709] text-white text-xs font-extrabold shadow-md hover:bg-[#3E2723]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DETAILED STOCK ADJUSTMENT ================= */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#EBE0D2] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE0D2]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
                  Stock Level Adjustment
                </span>
                <h3 className="text-lg font-black text-[#231709] mt-0.5">{adjustingItem.name}</h3>
                <p className="text-xs text-stone-500">
                  Current Count: <strong>{(adjustingItem.currentQuantity ?? adjustingItem.currentStock ?? 0).toLocaleString()} {adjustingItem.stockUnit}</strong>
                </p>
              </div>
              <button
                onClick={() => setAdjustingItem(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDetailedAdjust} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#231709]">Adjustment Reason / Action</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white"
                >
                  <option value="Stock In - Restock">🟢 Stock In — Restock / Purchase Received</option>
                  <option value="Consumption - Kitchen Usage">🔴 Stock Out — Kitchen Consumption</option>
                  <option value="Wastage - Spoiled / Expired">⚠️ Wastage — Spoiled / Expired</option>
                  <option value="Damage - Broken / Leaking">⚠️ Damage — Broken / Leaking Bottle/Can</option>
                  <option value="Physical Audit Count">📋 Physical Audit Count Correction</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#231709]">
                  Quantity to Apply ({adjustingItem.stockUnit})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  min="0.1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-black p-3 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[#EBE0D2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs font-bold text-[#5D4037] hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D97736] to-[#C86D51] text-white text-xs font-extrabold shadow-md hover:opacity-95"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-[#EBE0D2] shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#231709]">Delete Inventory Item?</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to remove <strong>"{deletingItem.name}"</strong> ({deletingItem.sku}) from the catalog? This action will remove it from real-time tracking.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs font-bold text-[#5D4037] hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
