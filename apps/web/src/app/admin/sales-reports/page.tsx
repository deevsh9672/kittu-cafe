'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Banknote,
  QrCode,
  Calendar,
  ArrowUpRight,
  PieChart,
  Percent,
} from 'lucide-react';
import { formatPrice } from '../../../lib/api';

export default function SalesReportsPage() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('month');

  // Realistic Metrics for Kittu Cafe (in paise)
  const grossRevenuePaise = 24500000; // ₹2,45,000
  const cogsPaise = 7850000; // ₹78,500 (32% food cost)
  const grossProfitPaise = grossRevenuePaise - cogsPaise; // ₹1,66,500
  const operatingExpensesPaise = 5200000; // ₹52,000 (Rent, Electricity, Supplies)
  const netProfitPaise = grossProfitPaise - operatingExpensesPaise; // ₹1,14,500
  const totalOrders = 684;
  const avgOrderValuePaise = Math.round(grossRevenuePaise / totalOrders); // ~₹358

  const paymentBreakdown = [
    { method: 'UPI (PhonePe, GPay, Paytm)', percentage: 68, amountPaise: Math.round(grossRevenuePaise * 0.68) },
    { method: 'Cash on Delivery / Counter', percentage: 22, amountPaise: Math.round(grossRevenuePaise * 0.22) },
    { method: 'Credit / Debit Card POS', percentage: 10, amountPaise: Math.round(grossRevenuePaise * 0.10) },
  ];

  const fulfillmentBreakdown = [
    { type: 'Dine-In Tables', count: 320, percentage: 47 },
    { type: 'Takeaway Counter', count: 210, percentage: 31 },
    { type: 'Home Delivery (Dausa)', count: 154, percentage: 22 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
            Financial Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
            Sales & Profit Analytics
          </h1>
          <p className="text-xs text-[#5D4037]">
            True net profit accounting for Kittu Cafe factoring ingredient deductions and operational overheads.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#EBE0D2] rounded-2xl shadow-xs">
          {(['today', 'week', 'month'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                timeRange === r
                  ? 'bg-[#231709] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {r === 'today' ? 'Today' : r === 'week' ? 'Last 7 Days' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Gross Revenue
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              +14% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-[#231709]">
            {formatPrice(grossRevenuePaise)}
          </h3>
          <p className="text-[11px] text-stone-500">{totalOrders} Orders Completed</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              COGS (Food & Drinks Cost)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
              32.0%
            </span>
          </div>
          <h3 className="text-2xl font-black text-rose-600">
            {formatPrice(cogsPaise)}
          </h3>
          <p className="text-[11px] text-stone-500">Atomic inventory deduction cost</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Operating Expenses
            </span>
            <span className="text-[10px] font-bold text-stone-500">Fixed + Variable</span>
          </div>
          <h3 className="text-2xl font-black text-stone-700">
            {formatPrice(operatingExpensesPaise)}
          </h3>
          <p className="text-[11px] text-stone-500">Rent, electricity & staff</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#231709] text-white border border-[#3E2723] shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#D97736] uppercase tracking-wider">
              Net Cafe Profit
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              46.7% Margin
            </span>
          </div>
          <h3 className="text-2xl font-black text-emerald-400">
            {formatPrice(netProfitPaise)}
          </h3>
          <p className="text-[11px] text-[#DFCDB8]">Net takeaway after all costs</p>
        </div>
      </div>

      {/* Breakdowns Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-black text-[#231709]">Payment Method Distribution</h3>
            <p className="text-xs text-stone-500">Share of revenue collected across digital and cash channels</p>
          </div>

          <div className="space-y-3 pt-2">
            {paymentBreakdown.map((pm) => (
              <div key={pm.method} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#231709]">{pm.method}</span>
                  <span className="font-mono font-bold text-stone-600">
                    {formatPrice(pm.amountPaise)} ({pm.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#FAF6F0] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D97736] to-[#C86D51] rounded-full"
                    style={{ width: `${pm.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fulfillment Channels */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-black text-[#231709]">Order Fulfillment Channels</h3>
            <p className="text-xs text-stone-500">Volume breakdown by customer order type in Dausa</p>
          </div>

          <div className="space-y-3 pt-2">
            {fulfillmentBreakdown.map((fb) => (
              <div key={fb.type} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#231709]">{fb.type}</span>
                  <span className="font-bold text-stone-600">
                    {fb.count} orders ({fb.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#FAF6F0] overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${fb.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
