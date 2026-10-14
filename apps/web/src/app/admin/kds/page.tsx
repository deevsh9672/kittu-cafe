'use client';

import React, { useState, useEffect } from 'react';
import { ChefHat, Volume2, VolumeX, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { IOrder, OrderStatus } from '@kittu-cafe/shared';
import { io } from 'socket.io-client';

const DEMO_KDS_ORDERS: any[] = [
  {
    _id: 'ord_1',
    orderNumber: 'KC-104921',
    orderType: 'dine_in',
    tableNumber: 'Table T2',
    status: 'accepted_by_kitchen',
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(), // 6 mins ago
    items: [
      { name: 'Classic Handcrafted Cappuccino', quantity: 2, selectedVariant: { name: 'Regular' }, specialInstructions: 'Extra hot' },
      { name: 'Peri Peri Masala Fries', quantity: 1, specialInstructions: 'Crispy' },
    ],
  },
  {
    _id: 'ord_2',
    orderNumber: 'KC-104922',
    orderType: 'delivery',
    status: 'preparing',
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(), // 14 mins ago
    items: [
      { name: 'Veg Loaded Farmhouse Pizza', quantity: 1, selectedVariant: { name: 'Medium (8 inch)' } },
      { name: 'Kittu Hazelnut Cold Coffee', quantity: 1 },
    ],
  },
  {
    _id: 'ord_3',
    orderNumber: 'KC-104923',
    orderType: 'pickup',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(), // 22 mins ago (Delayed!)
    items: [
      { name: 'Grilled Paneer Tikka Sandwich', quantity: 2, specialInstructions: 'No onions' },
    ],
  },
];

export default function KdsPage() {
  const [orders, setOrders] = useState<any[]>(DEMO_KDS_ORDERS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Clock tick every 10 seconds to update timers
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const SOCKET_BASE = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin.replace(':3000', ':5000').replace(':3001', ':5000') : 'http://localhost:5000');

  // Fetch KDS queue from API & listen on WebSockets
  const fetchKds = () => {
    fetch(`${API_BASE}/kds/orders`, {
      headers: { Authorization: 'Bearer mock_staff_token' },
    })
      .then((res) => res.json())
      .then((data) => {
        let serverOrders: any[] = [];
        if (data.success && Array.isArray(data.data?.orders)) {
          serverOrders = data.data.orders;
        }
        let localShared: any[] = [];
        if (typeof window !== 'undefined') {
          try {
            localShared = JSON.parse(localStorage.getItem('kittu_shared_orders') || '[]');
          } catch {}
        }
        const activeLocal = localShared.filter(
          (o: any) => o.status !== 'completed' && o.status !== 'cancelled'
        );
        const unique = new Map<string, any>();
        for (const o of [...activeLocal, ...serverOrders, ...DEMO_KDS_ORDERS]) {
          const key = String(o._id || o.orderNumber);
          if (!unique.has(key)) unique.set(key, o);
        }
        setOrders(Array.from(unique.values()));
      })
      .catch((err) => console.warn('Using seeded KDS queue:', err));
  };

  useEffect(() => {
    fetchKds();

    let socket: any = null;
    try {
      socket = io(SOCKET_BASE);
      socket.emit('join:kitchen');

      socket.on('order:created', (newOrder: any) => {
        setOrders((prev) => [...prev, newOrder]);
        if (soundEnabled) {
          console.log('[KDS Sound Alert] Chime sound triggered for new incoming order!');
        }
      });

      socket.on('order:status_updated', (data: any) => {
        fetchKds();
      });
    } catch {}

    const interval = setInterval(fetchKds, 5000);

    return () => {
      clearInterval(interval);
      if (socket) socket.disconnect();
    };
  }, [soundEnabled]);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev
        .map((o) => (o._id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus } : o))
        .filter((o) => newStatus !== 'ready_for_pickup') // Remove from active KDS once ready
    );

    if (typeof window !== 'undefined') {
      try {
        const current = JSON.parse(localStorage.getItem('kittu_shared_orders') || '[]');
        const updated = current.map((o: any) =>
          o._id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus } : o
        );
        localStorage.setItem('kittu_shared_orders', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch {}
    }

    try {
      await fetch(`${API_BASE}/kds/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_staff_token',
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn('Updated locally in KDS mode');
    }
  };

  const getElapsedMinutes = (dateStr: string) => {
    const diffMs = currentTime - new Date(dateStr).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  return (
    <div className="space-y-6">
      {/* Top Tablet Bar */}
      <div className="bg-[#231709] text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D97736] flex items-center justify-center text-white">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Kitchen Display System (KDS)</h1>
            <p className="text-xs text-[#DFCDB8]">
              Kittu Cafe • Active Queue: <span className="font-bold text-[#D97736]">{orders.length} tickets</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-colors ${
              soundEnabled
                ? 'bg-emerald-800/80 border-emerald-600 text-white'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
          </button>

          <button
            onClick={fetchKds}
            className="p-2 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 transition-colors"
            title="Refresh KDS Queue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders Board */}
      {orders.length === 0 ? (
        <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-[#EBE0D2]">
          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-[#231709]">All Caught Up!</h3>
          <p className="text-xs text-[#5D4037]">No pending kitchen tickets. New orders will chime instantly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((order) => {
            const elapsedMins = getElapsedMinutes(order.createdAt);
            const isDelayed = elapsedMins >= 20;
            const isWarning = elapsedMins >= 10 && elapsedMins < 20;

            return (
              <div
                key={order._id}
                className={`rounded-2xl border bg-white shadow-sm flex flex-col justify-between overflow-hidden transition-all ${
                  isDelayed
                    ? 'border-rose-400 ring-2 ring-rose-200'
                    : isWarning
                    ? 'border-amber-400 ring-2 ring-amber-100'
                    : 'border-[#EBE0D2]'
                }`}
              >
                <div>
                  {/* Card Header with Elapsed Time Badge */}
                  <div
                    className={`p-3.5 flex items-center justify-between text-xs font-bold border-b ${
                      isDelayed
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : isWarning
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-[#FAF6F0] border-[#EBE0D2] text-[#231709]'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-sm block">{order.orderNumber}</span>
                      <span className="text-[10px] uppercase font-semibold text-[#5D4037]">
                        {order.orderType === 'dine_in'
                          ? `Dine-in (${order.tableNumber || 'Table T1'})`
                          : order.orderType === 'delivery'
                          ? 'Home Delivery'
                          : 'Pickup / Takeaway'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white shadow-xs">
                      {isDelayed && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />}
                      <span>{elapsedMins}m</span>
                    </div>
                  </div>

                  {/* Order Items list */}
                  <div className="p-4 space-y-3 divide-y divide-[#FAF6F0]">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="pt-2 first:pt-0 space-y-1">
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-extrabold text-[#231709] leading-tight">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                        {item.selectedVariant && (
                          <span className="inline-block text-[11px] font-semibold text-[#C86D51] bg-[#FBECE7] px-2 py-0.5 rounded-md">
                            {item.selectedVariant.name}
                          </span>
                        )}
                        {item.specialInstructions && (
                          <p className="text-[11px] font-medium text-amber-800 bg-amber-50 p-1.5 rounded-md">
                            ⚠️ Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* KDS Action Buttons */}
                <div className="p-3 bg-[#FAF6F0] border-t border-[#EBE0D2] flex gap-2">
                  {order.status !== 'preparing' && (
                    <button
                      onClick={() => updateStatus(order._id, 'preparing')}
                      className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      Start Preparing
                    </button>
                  )}

                  <button
                    onClick={() => updateStatus(order._id, 'ready_for_pickup')}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Mark Ready ✓
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
