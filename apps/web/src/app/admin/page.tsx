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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    today: {
      totalOrders: 0,
      revenueInPaise: 0,
      pendingCount: 0,
      completedCount: 0,
      aovInPaise: 0,
      reservationsToday: 0,
    },
    lowStockCount: 0,
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    let serverData: any = null;
    try {
      const res = await fetch(`${API_BASE}/admin/reports/dashboard`, {
        headers: {
          Authorization: 'Bearer mock_admin_token',
        },
      });
      const data = await res.json();
      if (data.success && data.data) {
        serverData = data.data;
      }
    } catch (err) {
      console.warn('Dashboard server fetch fallback:', err);
    }

    // Merge with local shared orders for real-time responsiveness
    let localShared: any[] = [];
    if (typeof window !== 'undefined') {
      try {
        localShared = JSON.parse(localStorage.getItem('kittu_shared_orders') || '[]');
      } catch {}
    }

    const combinedMap = new Map<string, any>();
    if (serverData?.recentOrders) {
      for (const ord of serverData.recentOrders) {
        combinedMap.set(String(ord._id || ord.orderNumber), ord);
      }
    }
    for (const ord of localShared) {
      const key = String(ord._id || ord.orderNumber);
      if (!combinedMap.has(key)) {
        combinedMap.set(key, ord);
      } else {
        // Local might have latest status from user click
        combinedMap.set(key, { ...combinedMap.get(key), ...ord });
      }
    }

    const allRecent = Array.from(combinedMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    const eligibleOrders = allRecent.filter((o) => !['cancelled', 'refunded'].includes(o.status));
    const calculatedRevenue = eligibleOrders.reduce((acc, o) => acc + (Number(o.totalInPaise) || 0), 0);
    const pendingCount = allRecent.filter((o) =>
      ['pending_confirmation', 'confirmed', 'accepted_by_kitchen', 'preparing', 'ready_for_pickup'].includes(o.status)
    ).length;
    const completedCount = allRecent.filter((o) => o.status === 'completed').length;
    const totalOrders = Math.max(allRecent.length, serverData?.today?.totalOrders || 0);
    const finalRevenue = Math.max(calculatedRevenue, serverData?.today?.revenueInPaise || 0);
    const finalAov = totalOrders > 0 ? Math.round(finalRevenue / (eligibleOrders.length || 1)) : 0;

    setMetrics({
      today: {
        totalOrders,
        revenueInPaise: finalRevenue,
        pendingCount: Math.max(pendingCount, serverData?.today?.pendingCount || 0),
        completedCount: Math.max(completedCount, serverData?.today?.completedCount || 0),
        aovInPaise: finalAov,
        reservationsToday: serverData?.today?.reservationsToday || 0,
      },
      lowStockCount: serverData?.lowStockCount || 0,
      recentOrders: allRecent.slice(0, 8),
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 4000);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'kittu_shared_orders') {
        fetchDashboard();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
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
            className="p-2 rounded-xl bg-white border border-[#EBE0D2] hover:bg-[#FAF6F0] text-[#4E342E] transition-colors cursor-pointer"
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
            {metrics.recentOrders.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#FAF6F0] text-center text-xs text-stone-500 font-medium">
                No orders placed yet today.
              </div>
            ) : (
              metrics.recentOrders.map((ord: any) => {
                const itemsSummary = Array.isArray(ord.items)
                  ? ord.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')
                  : 'Order items';
                const locationSummary =
                  ord.orderType === 'dine_in'
                    ? `${ord.tableNumber || 'Dine-in'}`
                    : `${ord.orderType?.replace('_', ' ') || 'Takeaway'}`;

                return (
                  <div
                    key={ord._id || ord.orderNumber}
                    className="p-4 rounded-xl bg-[#FAF6F0] border border-[#EBE0D2] flex items-center justify-between"
                  >
                    <div className="max-w-[70%]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#231709]">
                          {ord.orderNumber || ord._id}
                        </span>
                        <span className="text-[11px] font-bold text-[#C86D51]">
                          {formatPrice(ord.totalInPaise)}
                        </span>
                      </div>
                      <p className="text-xs text-[#5D4037] truncate">{itemsSummary}</p>
                      <span className="text-[11px] text-[#C86D51] font-semibold capitalize">
                        {ord.customerName} • {locationSummary}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        ord.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'preparing' || ord.status === 'accepted_by_kitchen'
                          ? 'bg-amber-100 text-amber-800'
                          : ord.status === 'ready_for_pickup'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-[#FBECE7] text-[#C86D51]'
                      }`}
                    >
                      {ord.status?.replace('_', ' ')}
                    </span>
                  </div>
                );
              })
            )}
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
