'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Package,
  Wine,
  Carrot,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { IInventoryItem } from '@kittu-cafe/shared';
import { formatPrice } from '../../../lib/api';

const DEMO_LOW_STOCK: IInventoryItem[] = [
  {
    _id: 'bev-2',
    name: 'Coca-Cola (Glass Bottle / Can)',
    itemType: 'beverage',
    category: 'Carbonated Soft Drinks',
    currentStock: 12,
    minimumThreshold: 24,
    unit: 'can',
    costPerUnitInPaise: 2800,
    packageSize: '300ml Can',
  },
  {
    _id: 'ing-2',
    name: 'Fresh Whole Dairy Milk',
    itemType: 'ingredient',
    category: 'Dairy',
    currentStock: 8.0,
    minimumThreshold: 20.0,
    unit: 'L',
    costPerUnitInPaise: 6500,
    packageSize: '1 Liter Pouch',
  },
  {
    _id: 'bev-6',
    name: 'Monin Madagascar Vanilla Syrup',
    itemType: 'beverage',
    category: 'Syrups & Flavors',
    currentStock: 1,
    minimumThreshold: 2,
    unit: 'bottle',
    costPerUnitInPaise: 75000,
    packageSize: '750ml Glass Bottle',
  },
  {
    _id: 'ing-6',
    name: 'Artisanal Multigrain Bread Loaves',
    itemType: 'ingredient',
    category: 'Bakery',
    currentStock: 4,
    minimumThreshold: 8,
    unit: 'packet',
    costPerUnitInPaise: 4500,
    packageSize: '400g Sliced Loaf',
  },
];

export default function LowStockAlertsPage() {
  const [items, setItems] = useState<IInventoryItem[]>(DEMO_LOW_STOCK);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/admin/inventory/low-stock')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setItems(data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-900">
              Immediate Action Required
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
            Low Stock & Depletion Alerts
          </h1>
          <p className="text-xs text-[#5D4037]">
            Items that have dropped to or below their safe reorder threshold in Kittu Cafe.
          </p>
        </div>

        <Link
          href="/admin/purchase-orders"
          className="px-4 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Go to Purchase Orders</span>
        </Link>
      </div>

      {/* Alert Banner */}
      <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black">
            {items.length} critical inventory items require immediate supplier reordering.
          </h3>
          <p className="text-xs text-rose-800 leading-relaxed">
            Running out of milk or cola cans will automatically mark signature beverages as sold out on the digital menu. Reorder from your local Dausa vendors before weekend peaks.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const deficit = Math.max(0, item.minimumThreshold * 2 - item.currentStock);
          const estimatedCost = Math.round(deficit * (item.costPerUnitInPaise || 0));
          const isSeverelyLow = item.currentStock <= item.minimumThreshold * 0.5;

          return (
            <div
              key={item._id}
              className="p-6 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div
                className={`absolute top-0 inset-x-0 h-1.5 ${
                  isSeverelyLow ? 'bg-rose-500' : 'bg-amber-500'
                }`}
              />

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                        item.itemType === 'beverage'
                          ? 'bg-orange-50 border-orange-200 text-[#D97736]'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}
                    >
                      {item.itemType === 'beverage' ? (
                        <Wine className="w-5 h-5" />
                      ) : (
                        <Carrot className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#231709]">{item.name}</h3>
                      <span className="text-[10px] text-stone-500 font-bold uppercase">
                        {item.category} &bull; {item.packageSize || item.unit}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isSeverelyLow
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isSeverelyLow ? 'Critical Low' : 'Low Stock'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#FAF6F0] border border-[#EBE0D2] text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase block">
                      Current Stock
                    </span>
                    <span className="text-base font-black text-rose-600">
                      {item.currentStock} {item.unit}s
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase block">
                      Min. Threshold
                    </span>
                    <span className="text-base font-black text-stone-700">
                      {item.minimumThreshold} {item.unit}s
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Suggested Reorder:</span>
                    <strong className="text-[#231709]">
                      +{deficit.toFixed(0)} {item.unit}s
                    </strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Estimated PO Cost:</span>
                    <strong className="text-emerald-700">{formatPrice(estimatedCost)}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#FAF6F0] flex items-center justify-between">
                <Link
                  href={item.itemType === 'beverage' ? '/admin/beverages' : '/admin/ingredients'}
                  className="text-xs font-bold text-[#D97736] hover:underline flex items-center gap-1"
                >
                  <span>Quick Adjust Stock</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/admin/purchase-orders"
                  className="px-3.5 py-1.5 rounded-xl bg-[#231709] hover:bg-[#3E2723] text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Create PO
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
