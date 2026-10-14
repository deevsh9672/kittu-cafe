'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Calendar,
  Layers,
} from 'lucide-react';
import { IInventoryMovement } from '@kittu-cafe/shared';
import { formatPrice } from '../../../lib/api';

const DEMO_MOVEMENTS: IInventoryMovement[] = [
  {
    _id: 'mov-1',
    itemId: 'bev-1',
    itemName: 'Red Bull Energy Drink (Can)',
    operationType: 'stock_in',
    quantity: 24,
    previousStock: 24,
    newStock: 48,
    costPerUnitInPaise: 9500,
    totalCostInPaise: 228000,
    reason: 'Weekly Delivery from Dausa Beverage Distributors',
    staffName: 'Vikram Singh (Manager)',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: 'mov-2',
    itemId: 'bev-2',
    itemName: 'Coca-Cola (Glass Bottle / Can)',
    operationType: 'sale',
    quantity: 2,
    previousStock: 14,
    newStock: 12,
    costPerUnitInPaise: 2800,
    totalCostInPaise: 5600,
    reason: 'Deducted for Order #ORD-1082',
    referenceId: 'ORD-1082',
    staffName: 'Automated Recipe Deduction',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: 'mov-3',
    itemId: 'ing-2',
    itemName: 'Fresh Whole Dairy Milk',
    operationType: 'sale',
    quantity: 1.5,
    previousStock: 9.5,
    newStock: 8.0,
    costPerUnitInPaise: 6500,
    totalCostInPaise: 9750,
    reason: 'Order #ORD-1081 (Cappuccinos & Hazelnut Cold Coffees)',
    referenceId: 'ORD-1081',
    staffName: 'Automated Recipe Deduction',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    _id: 'mov-4',
    itemId: 'ing-1',
    itemName: '100% Arabica Coffee Beans (Whole)',
    operationType: 'stock_in',
    quantity: 10,
    previousStock: 4.5,
    newStock: 14.5,
    costPerUnitInPaise: 110000,
    totalCostInPaise: 1100000,
    reason: 'Chikmagalur Roaster Direct PO #PO-2026-004',
    referenceId: 'PO-2026-004',
    staffName: 'Amit Sharma (Owner)',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    _id: 'mov-5',
    itemId: 'bev-3',
    itemName: 'Sprite (Can)',
    operationType: 'wastage',
    quantity: 1,
    previousStock: 37,
    newStock: 36,
    costPerUnitInPaise: 2800,
    totalCostInPaise: 2800,
    reason: 'Can dented and leaking during carton unloading',
    staffName: 'Ramesh Patel (Staff)',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
  },
  {
    _id: 'mov-6',
    itemId: 'ing-3',
    itemName: 'Malai Paneer (Fresh Cottage Cheese)',
    operationType: 'adjustment',
    quantity: 0.8,
    previousStock: 10.0,
    newStock: 9.2,
    costPerUnitInPaise: 38000,
    totalCostInPaise: 30400,
    reason: 'Daily physical inventory scale reconciliation',
    staffName: 'Chef Rahul',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
];

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<IInventoryMovement[]>(DEMO_MOVEMENTS);
  const [search, setSearch] = useState('');
  const [selectedOp, setSelectedOp] = useState<string>('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/admin/inventory/movements')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setMovements(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredMovements = movements.filter((m) => {
    const matchesSearch =
      m.itemName.toLowerCase().includes(search.toLowerCase()) ||
      (m.reason || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.referenceId || '').toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedOp !== 'all' && m.operationType !== selectedOp) return false;
    return true;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Date,Item,Operation,Quantity,PrevStock,NewStock,UnitCostPaise,TotalCostPaise,Reason,Staff\n';
    const rows = filteredMovements
      .map(
        (m) =>
          `"${m._id}","${m.createdAt}","${m.itemName}","${m.operationType}","${m.quantity}","${m.previousStock}","${m.newStock}","${m.costPerUnitInPaise}","${m.totalCostInPaise}","${m.reason}","${m.staffName || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kittu_cafe_stock_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getOpBadge = (op: string) => {
    switch (op) {
      case 'stock_in':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
            <ArrowDownLeft className="w-3 h-3 text-emerald-700" />
            Stock In
          </span>
        );
      case 'sale':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
            <ArrowUpRight className="w-3 h-3 text-blue-700" />
            Order Sale
          </span>
        );
      case 'wastage':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800">
            Wastage
          </span>
        );
      case 'adjustment':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
            Adjustment
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-stone-100 text-stone-800">
            {op}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-stone-200 text-stone-800">
              Immutable Audit Log
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
            Stock Movement Ledger
          </h1>
          <p className="text-xs text-[#5D4037]">
            Every inventory receipt, sale deduction, recipe allocation, and audit adjustment is permanently recorded.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by item name, order ID, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-transparent focus:outline-none text-[#231709]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={selectedOp}
            onChange={(e) => setSelectedOp(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#EBE0D2] text-xs font-bold text-[#231709] bg-white cursor-pointer"
          >
            <option value="all">All Operations</option>
            <option value="stock_in">Stock In</option>
            <option value="sale">Sales Deductions</option>
            <option value="wastage">Wastage</option>
            <option value="adjustment">Adjustments</option>
          </select>
        </div>
      </div>

      {/* Movement Table */}
      <div className="rounded-3xl bg-white border border-[#EBE0D2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#EBE0D2] text-[10px] font-black uppercase text-[#5D4037] tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Item Name</th>
                <th className="p-4">Operation</th>
                <th className="p-4 text-center">Qty Delta</th>
                <th className="p-4 text-center">Stock Path</th>
                <th className="p-4">Cost Value</th>
                <th className="p-4">Reason / Order Ref</th>
                <th className="p-4">Staff / Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {filteredMovements.map((m) => {
                const isPositive = m.operationType === 'stock_in';
                return (
                  <tr key={m._id} className="hover:bg-[#FFFDFB] transition-colors">
                    <td className="p-4 text-stone-500 font-medium whitespace-nowrap">
                      {new Date(m.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4 font-bold text-[#231709]">{m.itemName}</td>
                    <td className="p-4">{getOpBadge(m.operationType)}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`font-black ${
                          isPositive ? 'text-emerald-600' : 'text-stone-700'
                        }`}
                      >
                        {isPositive ? '+' : '-'}{m.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono text-[11px] text-stone-600">
                      {m.previousStock} &rarr; <span className="font-bold text-[#231709]">{m.newStock}</span>
                    </td>
                    <td className="p-4 font-bold text-[#231709]">
                      {m.totalCostInPaise ? formatPrice(m.totalCostInPaise) : '—'}
                    </td>
                    <td className="p-4 text-stone-600 max-w-xs truncate" title={m.reason}>
                      {m.reason}
                    </td>
                    <td className="p-4 text-stone-500 font-medium whitespace-nowrap">
                      {m.staffName || 'System'}
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
