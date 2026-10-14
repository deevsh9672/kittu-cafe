'use client';

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  Calendar,
  Search,
  Filter,
  DollarSign,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { IExpense } from '@kittu-cafe/shared';
import { formatPrice } from '../../../lib/api';

const DEMO_EXPENSES: IExpense[] = [
  {
    _id: 'exp-1',
    title: 'Cafe Premises Monthly Rent (Shiv Colony)',
    category: 'rent',
    amountInPaise: 2500000, // ₹25,000
    date: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    paymentMethod: 'Bank Transfer / NEFT',
    notes: 'Paid to Property Owner for October 2026',
    recordedBy: 'Amit Sharma (Owner)',
  },
  {
    _id: 'exp-2',
    title: 'JVVNL Electricity Bill (Commercial Tariff)',
    category: 'utilities',
    amountInPaise: 950000, // ₹9,500
    date: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    paymentMethod: 'UPI',
    notes: 'Power consumption for espresso machine, ovens, & ACs',
    recordedBy: 'Vikram Singh (Manager)',
  },
  {
    _id: 'exp-3',
    title: 'Paper Cups, Straws & Takeaway Boxes',
    category: 'supplies',
    amountInPaise: 420000, // ₹4,200
    date: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    paymentMethod: 'Cash',
    notes: 'Bulk order of 1,000 embossed kraft cups and boxes',
    recordedBy: 'Vikram Singh (Manager)',
  },
  {
    _id: 'exp-4',
    title: 'Espresso Grouphead & Steam Wand Servicing',
    category: 'maintenance',
    amountInPaise: 350000, // ₹3,500
    date: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
    paymentMethod: 'UPI',
    notes: 'Descaling, gasket replacements, and pressure valve tuning',
    recordedBy: 'Amit Sharma (Owner)',
  },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<IExpense[]>(DEMO_EXPENSES);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExp, setNewExp] = useState({
    title: '',
    category: 'supplies' as IExpense['category'],
    amountInRupees: '',
    paymentMethod: 'UPI',
    notes: '',
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/admin/expenses')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setExpenses(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.notes || '').toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    return true;
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newExp.amountInRupees);
    if (!newExp.title || isNaN(amount) || amount <= 0) return;

    const created: IExpense = {
      _id: 'exp-' + Date.now(),
      title: newExp.title,
      category: newExp.category,
      amountInPaise: Math.round(amount * 100),
      date: new Date().toISOString(),
      paymentMethod: newExp.paymentMethod,
      notes: newExp.notes,
      recordedBy: 'Admin / Kittu Cafe',
    };

    fetch('http://localhost:5000/api/v1/admin/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch(() => {});

    setExpenses([created, ...expenses]);
    setIsModalOpen(false);
    setNewExp({
      title: '',
      category: 'supplies',
      amountInRupees: '',
      paymentMethod: 'UPI',
      notes: '',
    });
  };

  const totalExpensePaise = expenses.reduce((acc, e) => acc + e.amountInPaise, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
            Cost Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
            Operating Expenses
          </h1>
          <p className="text-xs text-[#5D4037]">
            Log rent, electricity, packaging supplies, equipment servicing, and local marketing expenses in Dausa.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Logged Expenses
          </span>
          <span className="text-2xl font-black text-rose-600">
            {formatPrice(totalExpensePaise)}
          </span>
          <p className="text-[11px] text-stone-500">{expenses.length} Entries Recorded</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Rent & Fixed Overhead
          </span>
          <span className="text-2xl font-black text-[#231709]">
            {formatPrice(
              expenses
                .filter((e) => e.category === 'rent')
                .reduce((acc, e) => acc + e.amountInPaise, 0)
            )}
          </span>
          <p className="text-[11px] text-stone-500">Commercial lease in Shiv Colony</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Utilities & Supplies
          </span>
          <span className="text-2xl font-black text-[#D97736]">
            {formatPrice(
              expenses
                .filter((e) => e.category === 'utilities' || e.category === 'supplies')
                .reduce((acc, e) => acc + e.amountInPaise, 0)
            )}
          </span>
          <p className="text-[11px] text-stone-500">Electricity, water & packaging</p>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Search expenses by title or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-transparent focus:outline-none text-[#231709]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#EBE0D2] text-xs font-bold text-[#231709] bg-white cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="rent">Rent</option>
            <option value="utilities">Utilities</option>
            <option value="supplies">Supplies</option>
            <option value="maintenance">Maintenance</option>
            <option value="marketing">Marketing</option>
            <option value="salaries">Salaries</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Expense Table */}
      <div className="rounded-3xl bg-white border border-[#EBE0D2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#EBE0D2] text-[10px] font-black uppercase text-[#5D4037] tracking-wider">
              <tr>
                <th className="p-4">Expense Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Recorded By</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {filtered.map((exp) => (
                <tr key={exp._id} className="hover:bg-[#FFFDFB] transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-[#231709] block text-xs">{exp.title}</span>
                    {exp.notes && (
                      <span className="text-[11px] text-stone-500 block truncate max-w-sm">
                        {exp.notes}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-4 text-stone-500 whitespace-nowrap">
                    {new Date(exp.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="p-4 text-stone-600 font-medium">{exp.paymentMethod || 'UPI'}</td>
                  <td className="p-4 text-stone-500">{exp.recordedBy || 'Manager'}</td>
                  <td className="p-4 text-right font-black text-sm text-rose-600">
                    {formatPrice(exp.amountInPaise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#EBE0D2] shadow-2xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
                Expense Entry
              </span>
              <h3 className="text-lg font-black text-[#231709] mt-0.5">
                Record New Expense
              </h3>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#231709]">Expense Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Water dispenser jars refill"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Amount (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 1500"
                    value={newExp.amountInRupees}
                    onChange={(e) => setNewExp({ ...newExp, amountInRupees: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231709]">Category</label>
                  <select
                    value={newExp.category}
                    onChange={(e) => setNewExp({ ...newExp, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736] bg-white cursor-pointer"
                  >
                    <option value="supplies">Supplies</option>
                    <option value="utilities">Utilities</option>
                    <option value="rent">Rent</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="marketing">Marketing</option>
                    <option value="salaries">Salaries</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#231709]">Payment Method</label>
                <select
                  value={newExp.paymentMethod}
                  onChange={(e) => setNewExp({ ...newExp, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736] bg-white cursor-pointer"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                  <option value="Debit / Credit Card">Debit / Credit Card</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#231709]">Notes / Invoice Reference</label>
                <input
                  type="text"
                  placeholder="Optional details or bill number"
                  value={newExp.notes}
                  onChange={(e) => setNewExp({ ...newExp, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FAF6F0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black cursor-pointer shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
