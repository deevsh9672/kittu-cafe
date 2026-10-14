'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  ArrowRight,
  ExternalLink,
  ChefHat,
  Bike,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
} from 'lucide-react';
import { IOrder, OrderStatus } from '@kittu-cafe/shared';
import { formatPrice } from '../../lib/api';

const MOCK_CUSTOMER_ORDERS: Partial<IOrder>[] = [
  {
    _id: 'ord-live-dausa-101',
    orderNumber: 'KC-2026-0891',
    orderType: 'delivery',
    status: 'preparing',
    paymentStatus: 'captured',
    paymentMethod: 'razorpay',
    subtotalInPaise: 42000,
    taxInPaise: 2100,
    deliveryFeeInPaise: 0,
    discountInPaise: 5000,
    totalInPaise: 39100,
    createdAt: new Date().toISOString() as any,
    items: [
      {
        menuItemId: 'item-espresso',
        name: 'Cappuccino (Large)',
        quantity: 2,
        unitPriceInPaise: 16000,
        totalPriceInPaise: 32000,
      },
      {
        menuItemId: 'item-fries',
        name: 'Peri Peri French Fries',
        quantity: 1,
        unitPriceInPaise: 10000,
        totalPriceInPaise: 10000,
      },
    ] as any,
  },
  {
    _id: 'ord-prev-dausa-098',
    orderNumber: 'KC-2026-0742',
    orderType: 'dine_in',
    status: 'completed',
    paymentStatus: 'captured',
    paymentMethod: 'cash_on_delivery',
    subtotalInPaise: 29000,
    taxInPaise: 1450,
    totalInPaise: 30450,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() as any,
    items: [
      {
        menuItemId: 'item-burger',
        name: 'Crispy Veg Supreme Burger',
        quantity: 1,
        unitPriceInPaise: 15000,
        totalPriceInPaise: 15000,
      },
      {
        menuItemId: 'item-shake',
        name: 'Thick Belgian Chocolate Shake',
        quantity: 1,
        unitPriceInPaise: 14000,
        totalPriceInPaise: 14000,
      },
    ] as any,
  },
];

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/orders');
      const data = await res.json();
      const serverOrders = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.data?.orders)
        ? data.data.orders
        : [];

      let localShared: any[] = [];
      if (typeof window !== 'undefined') {
        try {
          localShared = JSON.parse(localStorage.getItem('kittu_shared_orders') || '[]');
        } catch {}
      }

      const unique = new Map<string, any>();
      for (const o of [...localShared, ...serverOrders, ...MOCK_CUSTOMER_ORDERS]) {
        const key = o._id || o.orderNumber;
        if (!unique.has(key)) unique.set(key, o);
      }
      setOrders(Array.from(unique.values()));
    } catch {
      let localShared: any[] = [];
      if (typeof window !== 'undefined') {
        try {
          localShared = JSON.parse(localStorage.getItem('kittu_shared_orders') || '[]');
        } catch {}
      }
      const unique = new Map<string, any>();
      for (const o of [...localShared, ...MOCK_CUSTOMER_ORDERS]) {
        const key = o._id || o.orderNumber;
        if (!unique.has(key)) unique.set(key, o);
      }
      setOrders(Array.from(unique.values()));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_confirmation':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" /> Received
          </span>
        );
      case 'confirmed':
      case 'accepted_by_kitchen':
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-orange-50 text-orange-800 border border-orange-200">
            <ChefHat className="w-3.5 h-3.5 text-[#D97736]" /> Preparing Food
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-800 border border-blue-200">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-600" /> Ready for Pickup
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-800 border border-purple-200">
            <Bike className="w-3.5 h-3.5 text-purple-600" /> Out for Delivery
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-stone-100 text-stone-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#231709]">My Cafe Orders</h1>
          <p className="text-xs text-[#5D4037]">
            Track active live kitchen orders and review your past dining receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="p-2.5 rounded-xl bg-white border border-[#EBE0D2] text-[#5D4037] hover:text-[#231709] transition-colors shadow-xs cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/menu"
            className="px-4 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black shadow-sm"
          >
            Order New Food
          </Link>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#D97736] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#5D4037]">Loading your orders from Kittu Cafe...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EBE0D2] p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF6F0] text-[#C86D51] flex items-center justify-center">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-[#231709]">No Orders Found</h3>
          <p className="text-xs text-[#5D4037] max-w-sm mx-auto">
            You haven't placed any food orders yet. Browse our freshly prepared burgers, pizzas, and beverages!
          </p>
          <Link
            href="/menu"
            className="inline-block px-5 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black shadow-md"
          >
            View Digital Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isLive = order.status !== 'completed' && order.status !== 'cancelled';
            return (
              <div
                key={order._id}
                className={`p-6 rounded-3xl bg-white border transition-all space-y-4 ${
                  isLive
                    ? 'border-[#D97736] shadow-md ring-1 ring-[#D97736]/20'
                    : 'border-[#EBE0D2] shadow-xs'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#FAF6F0]">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-[#231709]">
                        {order.orderNumber || order._id}
                      </span>
                      <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-[#FAF6F0] text-[#5D4037]">
                        {order.orderType?.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 block">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'Just now'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-1.5 text-xs">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[#5D4037]">
                      <span>
                        <strong className="text-[#231709]">{item.quantity}x</strong> {item.name}
                        {item.selectedVariant && (
                          <span className="text-[11px] text-stone-500 ml-1">
                            ({item.selectedVariant.name})
                          </span>
                        )}
                      </span>
                      <span className="font-bold text-[#231709]">
                        {formatPrice(item.totalPriceInPaise)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer action row */}
                <div className="pt-3 border-t border-[#FAF6F0] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-stone-500">Total: </span>
                    <span className="font-black text-base text-[#C86D51]">
                      {formatPrice(order.totalInPaise)}
                    </span>
                    <span className="text-[11px] text-stone-500 ml-1.5 uppercase font-medium">
                      ({order.paymentMethod?.replace('_', ' ')})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/orders/${order._id}/track`}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black shadow-xs transition-all ${
                        isLive
                          ? 'btn-3d-primary text-white shadow-md'
                          : 'bg-[#FAF6F0] text-[#231709] border border-[#DFCDB8] hover:bg-[#F5EBE1]'
                      }`}
                    >
                      <span>{isLive ? 'Live Track Status' : 'View Full Details'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
