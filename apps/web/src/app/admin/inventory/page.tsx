'use client';

import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Minus, Check } from 'lucide-react';
import { IIngredient } from '@kittu-cafe/shared';

const DEMO_INGREDIENTS: any[] = [
  { _id: 'ing_1', name: 'Roasted Coffee Beans', unit: 'grams', currentStock: 5000, lowStockThreshold: 1000 },
  { _id: 'ing_2', name: 'Full Cream Milk', unit: 'ml', currentStock: 2500, lowStockThreshold: 3000 }, // Low stock!
  { _id: 'ing_3', name: 'Mozzarella Cheese', unit: 'grams', currentStock: 8000, lowStockThreshold: 1500 },
  { _id: 'ing_4', name: 'Fresh Paneer', unit: 'grams', currentStock: 800, lowStockThreshold: 1000 }, // Low stock!
  { _id: 'ing_5', name: 'Potato Fries (Frozen)', unit: 'grams', currentStock: 12000, lowStockThreshold: 2000 },
];

export default function AdminInventoryPage() {
  const [ingredients, setIngredients] = useState<any[]>(DEMO_INGREDIENTS);

  const fetchInventory = () => {
    fetch('http://localhost:5000/api/v1/admin/inventory', {
      headers: { Authorization: 'Bearer mock_admin_token' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.items?.length > 0) {
          setIngredients(data.data.items);
        }
      })
      .catch((err) => console.warn('Using seeded inventory items:', err));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjust = async (id: string, delta: number) => {
    setIngredients((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, currentStock: Math.max(0, i.currentStock + delta) } : i
      )
    );

    try {
      await fetch(`http://localhost:5000/api/v1/admin/inventory/${id}/adjust`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_admin_token',
        },
        body: JSON.stringify({ adjustment: delta, reason: 'Quick manual adjustment' }),
      });
    } catch (e) {
      // Local fallback
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">Stock Control</span>
        <h1 className="text-2xl font-extrabold text-[#231709]">Inventory & Ingredient Stock</h1>
        <p className="text-xs text-[#5D4037]">Real-time ingredient levels with automated low-stock warnings.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBE0D2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#4E342E] uppercase font-bold border-b border-[#EBE0D2]">
              <tr>
                <th className="p-4">Ingredient Name</th>
                <th className="p-4">Current Level</th>
                <th className="p-4">Unit</th>
                <th className="p-4">Threshold</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Quick Stock Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {ingredients.map((item) => {
                const isLow = item.currentStock <= item.lowStockThreshold;

                return (
                  <tr key={item._id} className="hover:bg-[#FFFEFA] transition-colors">
                    <td className="p-4 font-bold text-[#231709]">{item.name}</td>
                    <td className="p-4 font-mono font-bold text-sm text-[#231709]">
                      {item.currentStock.toLocaleString()}
                    </td>
                    <td className="p-4 text-[#5D4037]">{item.unit}</td>
                    <td className="p-4 text-[#5D4037]">{item.lowStockThreshold.toLocaleString()}</td>
                    <td className="p-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Healthy Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1 border border-[#EBE0D2] rounded-xl p-1 bg-[#FAF6F0]">
                        <button
                          onClick={() => handleAdjust(item._id, -500)}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-stone-100 text-[#4E342E] font-bold text-[11px]"
                          title="Deduct 500 units"
                        >
                          -500
                        </button>
                        <button
                          onClick={() => handleAdjust(item._id, 500)}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-stone-100 text-[#4E342E] font-bold text-[11px]"
                          title="Add 500 units"
                        >
                          +500
                        </button>
                        <button
                          onClick={() => handleAdjust(item._id, 1000)}
                          className="px-2 py-1 rounded-lg bg-[#231709] text-white hover:bg-[#3E2723] font-bold text-[11px]"
                          title="Restock 1000 units"
                        >
                          +1k
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
    </div>
  );
}
