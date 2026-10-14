'use client';

import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  UtensilsCrossed,
  Package,
  CalendarDays,
  ShieldAlert,
  Trash2,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'order' | 'inventory' | 'reservation' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'inventory',
    title: 'Low Stock Alert: Fresh Dairy Milk',
    message: 'Milk stock has fallen to 8.0L (minimum safe threshold is 20.0L). Tap to order from Rajasthan Fresh Dairy.',
    timestamp: '10 minutes ago',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'order',
    title: 'New Online Order #ORD-1083 Received',
    message: 'Order for 2x Kittu Hazelnut Cold Coffee, 1x Veg Loaded Farmhouse Pizza received from Table 4.',
    timestamp: '25 minutes ago',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'reservation',
    title: 'Table Reservation for 6 Guests',
    message: 'Party booking requested by Rajesh Sharma for today at 8:00 PM (Outdoor Patio).',
    timestamp: '1 hour ago',
    isRead: false,
  },
  {
    id: 'n4',
    type: 'inventory',
    title: 'Coca-Cola Cans Depleted',
    message: 'Only 12 cans remain in chiller. Automatic PO draft created for Dausa Beverage Distributors.',
    timestamp: '2 hours ago',
    isRead: true,
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Daily Database Backup Completed',
    message: 'Automated snapshot of all 1,420 orders, inventory ledgers, and customer profiles saved successfully.',
    timestamp: '4 hours ago',
    isRead: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.isRead;
    return n.type === filterType;
  });

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'inventory':
        return <Package className="w-5 h-5 text-rose-600" />;
      case 'order':
        return <UtensilsCrossed className="w-5 h-5 text-[#D97736]" />;
      case 'reservation':
        return <CalendarDays className="w-5 h-5 text-blue-600" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
            Operational Alerts
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
            Notifications Center
          </h1>
          <p className="text-xs text-[#5D4037]">
            Real-time kitchen order pings, inventory threshold triggers, and table reservations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#EBE0D2] text-xs font-bold text-[#231709] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
          >
            Mark All Read
          </button>
          <button
            onClick={handleClearAll}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#EBE0D2] text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: 'Unread' },
          { id: 'order', label: 'Orders' },
          { id: 'inventory', label: 'Inventory' },
          { id: 'reservation', label: 'Bookings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === tab.id
                ? 'bg-[#231709] text-white shadow-xs'
                : 'bg-white border border-[#EBE0D2] text-stone-600 hover:bg-[#FAF6F0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-white rounded-3xl border border-[#EBE0D2]">
            <Bell className="w-8 h-8 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#231709]">No notifications</h3>
            <p className="text-xs text-stone-500">You are all caught up!</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                item.isRead
                  ? 'bg-white border-[#EBE0D2] opacity-80'
                  : 'bg-[#FFFEFA] border-[#D97736]/40 shadow-xs'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE0D2] shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-[#231709]">{item.title}</h4>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#5D4037] leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
