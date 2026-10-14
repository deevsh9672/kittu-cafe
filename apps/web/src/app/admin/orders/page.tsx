'use client';

import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Phone,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Printer,
  XCircle,
  RefreshCw,
  Bell,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { IOrder, OrderStatus } from '@kittu-cafe/shared';
import { formatPrice } from '../../../lib/api';
import { io, Socket } from 'socket.io-client';

const DEMO_ORDERS: any[] = [
  {
    _id: 'ord-1791975795976',
    orderNumber: 'KC-2026-9597',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98290 11223',
    orderType: 'delivery',
    status: 'confirmed',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    deliveryAddress: { street: 'House #42, Lane 3', area: 'Shiv Colony, Mariyara Wale', city: 'Dausa', postalCode: '303303' },
    items: [
      {
        menuItemId: 'seed-coffee-1',
        name: 'Classic Handcrafted Cappuccino',
        quantity: 1,
        selectedVariant: { name: 'Regular (250ml)', priceInPaise: 14000 },
        unitPriceInPaise: 14000,
        totalPriceInPaise: 14000,
      },
      {
        menuItemId: 'seed-sandwich-1',
        name: 'Grilled Paneer Tikka Sandwich',
        quantity: 2,
        unitPriceInPaise: 13000,
        totalPriceInPaise: 26000,
      },
    ],
    subtotalInPaise: 40000,
    taxInPaise: 2000,
    deliveryFeeInPaise: 4000,
    discountInPaise: 0,
    totalInPaise: 46000,
    createdAt: new Date().toISOString(),
    statusHistory: [{ status: 'confirmed', timestamp: new Date(), notes: 'Order confirmed & in progress' }],
  },
  {
    _id: 'ord_1',
    orderNumber: 'KC-990123',
    customerName: 'Amit Meena',
    customerPhone: '+91 98290 12345',
    orderType: 'delivery',
    status: 'confirmed',
    totalInPaise: 27100,
    paymentMethod: 'razorpay',
    paymentStatus: 'captured',
    deliveryAddress: { street: 'Near SBI Bank, Agra Road', area: 'Shiv Colony', city: 'Dausa' },
    items: [
      { name: 'Classic Handcrafted Cappuccino', quantity: 2, totalPriceInPaise: 22000 },
      { name: 'Peri Peri Masala Fries', quantity: 1, totalPriceInPaise: 9000 },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'ord_2',
    orderNumber: 'KC-990124',
    customerName: 'Pooja Sharma',
    customerPhone: '+91 94140 54321',
    orderType: 'dine_in',
    tableNumber: 'Table T1',
    status: 'preparing',
    totalInPaise: 22000,
    paymentMethod: 'cash_at_counter',
    paymentStatus: 'pending',
    items: [{ name: 'Veg Loaded Farmhouse Pizza', quantity: 1, totalPriceInPaise: 22000 }],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>(DEMO_ORDERS);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsRefreshing(true);
    let remoteOrders: any[] = [];

    // 1. Fetch from admin endpoint
    try {
      const res = await fetch('http://localhost:5000/api/v1/orders/admin/all', {
        headers: { Authorization: 'Bearer mock_admin_token' },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.orders)) {
        remoteOrders = data.data.orders;
      }
    } catch {
      // Try fallback endpoint
      try {
        const res = await fetch('http://localhost:5000/api/v1/orders');
        const data = await res.json();
        if (data.success && Array.isArray(data.data?.orders)) {
          remoteOrders = data.data.orders;
        }
      } catch {}
    }

    // 2. Read local browser storage orders (for cross-tab sync)
    let localShared: any[] = [];
    if (typeof window !== 'undefined') {
      try {
        localShared = JSON.parse(localStorage.getItem('kittu_shared_orders') || '[]');
      } catch {}
    }

    // 3. Merge unique orders
    const allCombined = [...localShared, ...remoteOrders, ...DEMO_ORDERS];
    const uniqueMap = new Map<string, any>();
    for (const ord of allCombined) {
      const key = ord._id || ord.orderNumber;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, ord);
      }
    }

    const merged = Array.from(uniqueMap.values());
    // Sort by createdAt desc
    merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    setOrders(merged);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();

    // Setup Socket.IO listener for real-time live events
    let socket: Socket;
    try {
      socket = io('http://localhost:5000');
      socket.emit('join:admin');

      socket.on('order:created', (newOrder: any) => {
        setOrders((prev) => {
          const exists = prev.some((o) => o._id === newOrder._id || o.orderNumber === newOrder.orderNumber);
          if (exists) return prev;
          return [newOrder, ...prev];
        });
        setNewOrderAlert(`New order ${newOrder.orderNumber || newOrder._id} received from ${newOrder.customerName}!`);
        setTimeout(() => setNewOrderAlert(null), 6000);
      });

      socket.on('order:status_updated', (data: any) => {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === data.orderId || o.orderNumber === data.orderId
              ? { ...o, status: data.status, ...(data.order || {}) }
              : o
          )
        );
      });
    } catch {}

    // Polling interval every 4s
    const interval = setInterval(fetchOrders, 4000);

    // Cross-tab storage listener
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'kittu_shared_orders') {
        fetchOrders();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      if (socket) socket.disconnect();
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      await fetch(`http://localhost:5000/api/v1/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_admin_token',
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      // Local fallback
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner if new order arrived */}
      {newOrderAlert && (
        <div className="p-4 rounded-2xl bg-[#FBECE7] border border-[#E6866B] text-[#C86D51] font-bold text-xs flex items-center justify-between shadow-md animate-bounce">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 animate-spin text-[#D97736]" />
            <span>{newOrderAlert}</span>
          </div>
          <button onClick={() => setNewOrderAlert(null)} className="text-stone-500 hover:text-stone-800 font-bold">
            &times;
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">Order Desk</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-700">Live Socket Active</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#231709]">Live Order Management</h1>
          <p className="text-xs text-[#5D4037]">Accept, dispatch, print receipts, and reconcile payments in real-time.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#EBE0D2] hover:bg-[#FAF6F0] text-xs font-bold text-[#4E342E] flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Refresh orders from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#D97736] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Orders</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#EBE0D2] hover:bg-[#FAF6F0] text-xs font-bold text-[#4E342E] flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#C86D51]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EBE0D2]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#5D4037] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order number, customer name, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-[#EBE0D2] rounded-xl bg-white text-[#4E342E] focus:outline-none"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending_confirmation">Pending Confirmation</option>
            <option value="confirmed">Confirmed</option>
            <option value="accepted_by_kitchen">Accepted by Kitchen</option>
            <option value="preparing">Preparing</option>
            <option value="ready_for_pickup">Ready for Pickup</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#EBE0D2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#4E342E] uppercase font-bold border-b border-[#EBE0D2]">
              <tr>
                <th className="p-4">Order No</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Type / Location</th>
                <th className="p-4">Items</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500">
                    No orders matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const addressStr =
                    typeof order.deliveryAddress === 'string'
                      ? order.deliveryAddress
                      : order.deliveryAddress
                      ? `${order.deliveryAddress.street || ''}, ${order.deliveryAddress.area || ''}`
                      : 'Takeaway';

                  return (
                    <tr key={order._id || order.orderNumber} className="hover:bg-[#FFFEFA] transition-colors">
                      <td className="p-4 font-mono font-bold text-[#231709]">
                        {order.orderNumber || order._id}
                        <span className="block text-[10px] font-normal text-stone-400">
                          {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold block text-[#231709]">{order.customerName}</span>
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="text-[#C86D51] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{order.customerPhone}</span>
                        </a>
                      </td>
                      <td className="p-4">
                        <span className="capitalize font-semibold block text-[#231709]">{order.orderType?.replace('_', ' ')}</span>
                        <span className="text-[11px] text-[#5D4037] line-clamp-1">
                          {order.tableNumber || addressStr}
                        </span>
                      </td>
                      <td className="p-4 space-y-0.5 max-w-[200px]">
                        {order.items?.map((i: any, idx: number) => (
                          <span key={idx} className="block text-[#5D4037] truncate">
                            <strong className="text-[#231709]">{i.quantity}x</strong> {i.name}
                            {i.selectedVariant && (
                              <span className="text-[10px] text-stone-400 ml-1">({i.selectedVariant.name})</span>
                            )}
                          </span>
                        ))}
                      </td>
                      <td className="p-4 font-black text-[#231709]">{formatPrice(order.totalInPaise)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block capitalize ${
                            order.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'preparing' || order.status === 'accepted_by_kitchen'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'ready_for_pickup'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-[#FBECE7] text-[#C86D51]'
                          }`}
                        >
                          {order.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'accepted_by_kitchen')}
                            className="px-2.5 py-1.5 bg-[#231709] text-white rounded-lg font-bold hover:bg-[#3E2723] cursor-pointer"
                          >
                            Send to Kitchen
                          </button>
                        )}
                        {order.status === 'accepted_by_kitchen' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'preparing')}
                            className="px-2.5 py-1.5 bg-[#D97736] text-white rounded-lg font-bold hover:bg-[#C86D51] cursor-pointer"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'ready_for_pickup')}
                            className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 cursor-pointer"
                          >
                            Pack & Ready
                          </button>
                        )}
                        {order.status === 'ready_for_pickup' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'completed')}
                            className="px-2.5 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800 cursor-pointer"
                          >
                            Mark Delivered ✓
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
