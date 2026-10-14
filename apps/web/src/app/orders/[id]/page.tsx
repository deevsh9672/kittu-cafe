'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  Phone,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { IOrder, OrderStatus } from '@kittu-cafe/shared';
import { formatPrice } from '../../../lib/api';
import { io } from 'socket.io-client';

const ORDER_STEPS: { status: OrderStatus; label: string; icon: any }[] = [
  { status: 'pending_confirmation', label: 'Order Received', icon: Clock },
  { status: 'confirmed', label: 'Confirmed by Cafe', icon: CheckCircle2 },
  { status: 'accepted_by_kitchen', label: 'Sent to Kitchen', icon: ChefHat },
  { status: 'preparing', label: 'Freshly Preparing', icon: ChefHat },
  { status: 'ready_for_pickup', label: 'Ready for Pickup', icon: ShoppingBag },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
  { status: 'completed', label: 'Enjoy your Meal!', icon: Sparkles },
];

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial order status
    fetch(`http://localhost:5000/api/v1/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrder(data.data);
        }
      })
      .catch((err) => console.warn('Could not fetch order, using local state:', err))
      .finally(() => setLoading(false));

    // 2. Connect to Socket.io for live push notifications
    const socket = io('http://localhost:5000');
    socket.emit('join:order', orderId);

    socket.on('order:status_updated', (data: { orderId: string; status: OrderStatus; order: IOrder }) => {
      if (data.orderId === orderId || (data.order && data.order._id === orderId)) {
        setOrder(data.order);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  const currentStatusIndex = order
    ? ORDER_STEPS.findIndex((s) => s.status === order.status)
    : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E342E] hover:text-[#C86D51]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>My Orders</span>
          </Link>
          <span className="text-stone-300">•</span>
          <Link
            href={`/orders/${orderId}/track`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#D97736] hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Screen</span>
          </Link>
        </div>
        <span className="text-xs font-medium text-[#5D4037]">
          Order ID: <span className="font-mono font-bold text-[#231709]">{order?.orderNumber || orderId}</span>
        </span>
      </div>

      {/* Main Status Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#FAF6F0] to-[#F5EBE1] border border-[#DFCDB8] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FBECE7] text-[#C86D51]">
              <span className="w-2 h-2 rounded-full bg-[#D97736] animate-pulse" />
              Live Order Status
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231709]">
              {order?.status === 'completed'
                ? 'Order Delivered!'
                : order?.status === 'preparing'
                ? 'Preparing your freshly crafted food...'
                : 'Order Confirmed & In Progress'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5D4037]">
              Estimated prep & dispatch: 15–20 minutes at Kittu Cafe, Dausa.
            </p>
          </div>

          <a
            href="tel:+919511317456"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#231709] text-white text-xs font-bold hover:bg-[#3E2723] transition-colors shrink-0 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-[#D97736]" />
            <span>Call Cafe (+91 95113 17456)</span>
          </a>
        </div>

        {/* Timeline Stepper */}
        <div className="pt-4 border-t border-[#DFCDB8]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ORDER_STEPS.slice(0, 4).map((step, idx) => {
              const Icon = step.icon;
              const isPast = currentStatusIndex >= idx;
              const isCurrent = currentStatusIndex === idx;

              return (
                <div
                  key={step.status}
                  className={`p-3 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-white border-[#D97736] shadow-sm'
                      : isPast
                      ? 'bg-white/60 border-emerald-500/40 text-emerald-800'
                      : 'bg-transparent border-[#DFCDB8]/60 text-[#8D6E63]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isCurrent
                          ? 'bg-[#D97736] text-white'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#FAF6F0] text-[#8D6E63]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold">Step {idx + 1}</span>
                  </div>
                  <p className="text-xs font-bold leading-tight text-[#231709]">{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Item Details & Receipt */}
      <div className="bg-white rounded-3xl border border-[#EBE0D2] p-6 space-y-4">
        <h3 className="text-base font-bold text-[#231709] pb-3 border-b border-[#FAF6F0]">
          Order Summary & Receipt
        </h3>

        {order?.items && (
          <div className="divide-y divide-[#FAF6F0] space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#231709]">{item.name}</span>
                  <span className="text-[#5D4037] ml-2">x {item.quantity}</span>
                  {item.selectedVariant && (
                    <span className="block text-[11px] text-[#C86D51]">{item.selectedVariant.name}</span>
                  )}
                </div>
                <span className="font-bold text-[#231709]">{formatPrice(item.totalPriceInPaise)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-[#FAF6F0] space-y-1.5 text-xs text-[#5D4037]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order?.subtotalInPaise || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span>{formatPrice(order?.taxInPaise || 0)}</span>
          </div>
          {order?.deliveryFeeInPaise ? (
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatPrice(order.deliveryFeeInPaise)}</span>
            </div>
          ) : null}
          <div className="pt-2 border-t border-[#EBE0D2] flex justify-between text-sm font-extrabold text-[#231709]">
            <span>Total Paid / Payable</span>
            <span className="text-[#C86D51]">{formatPrice(order?.totalInPaise || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
