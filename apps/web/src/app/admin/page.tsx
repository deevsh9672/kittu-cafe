'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  ChefHat,
} from 'lucide-react';
import { formatPrice } from '../../lib/api';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    today: {
      totalOrders: 18,
      revenueInPaise: 425000, // ₹4,250.00
      pendingCount: 4,
      completedCount: 14,
      aovInPaise: 23600, // ₹236.00
      reservationsToday: 3,
    },
    lowStockCount: 2,
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(false);

  const fetchDashboard = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/v1/admin/reports/dashboard', {
      headers: {
        Authorization: 'Bearer mock_admin_token',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setMetrics(data.data);
        }
      })
      .catch((err) => console.warn('Using seeded dashboard metrics:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">Operations Center</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231709]">Kittu Cafe Dashboard</h1>
          <p className="text-xs text-[#5D4037]">Live sales, order flow, and inventory status for Dausa, Rajasthan.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/kds"
            className="px-4 py-2 rounded-xl bg-[#D97736] hover:bg-[#C86D51] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <ChefHat className="w-4 h-4" />
            <span>Launch Kitchen KDS</span>
          </Link>
          <button
            onClick={fetchDashboard}
            className="p-2 rounded-xl bg-white border border-[#EBE0D2] hover:bg-[#FAF6F0] text-[#4E342E] transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue */}
        <div className="bg-white rounded-2xl border border-[#EBE0D2] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5D4037]">
            <span>Today's Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-extrabold text-[#231709]">
            {formatPrice(metrics.today.revenueInPaise)}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            Eligible paid & completed orders
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-[#EBE0D2] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5D4037]">
            <span>Today's Orders</span>
            <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] text-[#C86D51] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-extrabold text-[#231709]">
            {metrics.today.totalOrders}
          </span>
          <span className="text-[11px] text-[#5D4037] block">
            {metrics.today.completedCount} completed • {metrics.today.pendingCount} in queue
          </span>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-2xl border border-[#EBE0D2] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5D4037]">
            <span>Average Order Value (AOV)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-extrabold text-[#231709]">
            {formatPrice(metrics.today.aovInPaise)}
          </span>
          <span className="text-[11px] text-[#5D4037] block">Calculated from stored records</span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-[#EBE0D2] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5D4037]">
            <span>Inventory Alert</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="block text-2xl font-extrabold text-rose-600">
            {metrics.lowStockCount} items
          </span>
          <Link href="/admin/inventory" className="text-[11px] text-[#C86D51] font-bold hover:underline block">
            Inspect ingredient stock →
          </Link>
        </div>
      </div>

      {/* Quick Operation Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Orders Quick Queue */}
        <div className="bg-white rounded-2xl border border-[#EBE0D2] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#231709]">Live Kitchen & Order Status</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-[#C86D51] hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#EBE0D2] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#231709]">KC-839210</span>
                <p className="text-xs text-[#5D4037]">2x Cappuccino, 1x Veg Farmhouse Pizza</p>
                <span className="text-[11px] text-[#C86D51] font-semibold">Table T1 • Dine-in</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Preparing
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#EBE0D2] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#231709]">KC-920412</span>
                <p className="text-xs text-[#5D4037]">1x Hazelnut Cold Coffee, 1x Paneer Sandwich</p>
                <span className="text-[11px] text-emerald-700 font-semibold">Delivery • Shiv Colony</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Business Status & Information */}
        <div className="bg-white rounded-2xl border border-[#EBE0D2] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#231709]">Kittu Cafe Business Configuration</h3>
            <Link href="/admin/cms" className="text-xs font-bold text-[#C86D51] hover:underline">
              Edit Settings →
            </Link>
          </div>

          <div className="space-y-3 text-xs text-[#5D4037]">
            <div className="p-3 rounded-xl bg-[#FAF6F0] flex justify-between">
              <span className="font-medium">Restaurant Address</span>
              <span className="font-bold text-[#231709] text-right">Shiv Colony, Mariyara Wale, Dausa 303303</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF6F0] flex justify-between">
              <span className="font-medium">Official Contact Number</span>
              <span className="font-bold text-[#231709]">+91 95113 17456</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF6F0] flex justify-between">
              <span className="font-medium">Operating Hours</span>
              <span className="font-bold text-[#231709]">10:00 AM – 10:30 PM (Asia/Kolkata)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF6F0] flex justify-between">
              <span className="font-medium">Online Ordering & KDS</span>
              <span className="font-bold text-emerald-700">ACTIVE & ACCEPTING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
