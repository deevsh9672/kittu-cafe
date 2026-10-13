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
} from 'lucide-react';
import { IOrder, OrderStatus } from '@kittu-cafe/shared';
import { formatPrice } from '../../../lib/api';

const DEMO_ORDERS: any[] = [
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>(DEMO_ORDERS);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/v1/orders/admin/all', {
      headers: { Authorization: 'Bearer mock_admin_token' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.orders?.length > 0) {
          setOrders(data.data.orders);
        }
      })
      .catch((err) => console.warn('Using seeded admin orders:', err));
  };

  useEffect(() => {
    fetchOrders();
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
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">Order Desk</span>
          <h1 className="text-2xl font-extrabold text-[#231709]">Live Order Management</h1>
          <p className="text-xs text-[#5D4037]">Accept, dispatch, print receipts, and reconcile payments.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#EBE0D2] hover:bg-[#FAF6F0] text-xs font-bold text-[#4E342E] flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-[#C86D51]" />
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
            <option value="all">All Statuses</option>
            <option value="pending_confirmation">Pending Confirmation</option>
            <option value="confirmed">Confirmed</option>
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
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-[#FFFEFA] transition-colors">
                  <td className="p-4 font-mono font-bold text-[#231709]">{order.orderNumber}</td>
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
                    <span className="capitalize font-semibold block text-[#231709]">{order.orderType}</span>
                    <span className="text-[11px] text-[#5D4037]">
                      {order.tableNumber || order.deliveryAddress?.area || 'Takeaway'}
                    </span>
                  </td>
                  <td className="p-4 space-y-0.5">
                    {order.items.map((i: any, idx: number) => (
                      <span key={idx} className="block text-[#5D4037]">
                        {i.quantity}x {i.name}
                      </span>
                    ))}
                  </td>
                  <td className="p-4 font-bold text-[#231709]">{formatPrice(order.totalInPaise)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block capitalize ${
                        order.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'preparing'
                          ? 'bg-amber-100 text-amber-800'
                          : order.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-[#FBECE7] text-[#C86D51]'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'accepted_by_kitchen')}
                        className="px-2.5 py-1.5 bg-[#231709] text-white rounded-lg font-bold hover:bg-[#3E2723]"
                      >
                        Send to Kitchen
                      </button>
                    )}
                    {order.status === 'ready_for_pickup' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'completed')}
                        className="px-2.5 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800"
                      >
                        Mark Delivered ✓
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
