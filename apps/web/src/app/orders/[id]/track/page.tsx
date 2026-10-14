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
  AlertTriangle,
  RotateCcw,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react';
import { IOrder, OrderStatus } from '@kittu-cafe/shared';
import { formatPrice } from '../../../../lib/api';
import { io, Socket } from 'socket.io-client';

const ORDER_STEPS: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
  {
    status: 'pending_confirmation',
    label: 'Order Placed',
    desc: 'Waiting for cafe kitchen acceptance',
    icon: Clock,
  },
  {
    status: 'confirmed',
    label: 'Order Confirmed',
    desc: 'Cafe manager verified your order',
    icon: CheckCircle2,
  },
  {
    status: 'accepted_by_kitchen',
    label: 'Kitchen Station',
    desc: 'Kittu Cafe chef queued your meal',
    icon: ChefHat,
  },
  {
    status: 'preparing',
    label: 'Freshly Preparing',
    desc: 'Cooking with fresh local ingredients',
    icon: Sparkles,
  },
  {
    status: 'ready_for_pickup',
    label: 'Packed & Ready',
    desc: 'Sealed hot and ready at counter',
    icon: ShoppingBag,
  },
  {
    status: 'out_for_delivery',
    label: 'Out for Delivery',
    desc: 'On the way across Dausa',
    icon: Bike,
  },
  {
    status: 'completed',
    label: 'Order Delivered',
    desc: 'Enjoy your meal at Kittu Cafe!',
    icon: CheckCircle2,
  },
];

export default function OrderLiveTrackingRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const fetchOrderData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
      }
    } catch (err) {
      console.warn('Could not fetch order from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();

    // Setup Socket.IO
    let socket: Socket;
    try {
      socket = io('http://localhost:5000', {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1500,
      });

      socket.on('connect', () => {
        setSocketConnected(true);
        socket.emit('join:order', orderId);
      });

      socket.on('disconnect', () => {
        setSocketConnected(false);
      });

      socket.on(
        'order:status_updated',
        (data: { orderId: string; status: OrderStatus; order: IOrder }) => {
          if (data.orderId === orderId || (data.order && data.order._id === orderId)) {
            setOrder(data.order);
          }
        }
      );
    } catch {
      setSocketConnected(false);
    }

    // Polling fallback every 8 seconds if socket disconnects
    const pollInterval = setInterval(() => {
      fetchOrderData();
    }, 8000);

    return () => {
      clearInterval(pollInterval);
      if (socket) socket.disconnect();
    };
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    setCancelMessage(null);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Customer requested cancellation from tracking page' }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
        setCancelMessage('Order has been successfully cancelled.');
      } else {
        setCancelMessage(data.message || 'Cannot cancel order once preparation is in progress.');
      }
    } catch {
      setCancelMessage('Order cancellation requested. Please call cafe at +91 95113 17456.');
    } finally {
      setCancelling(false);
    }
  };

  const getStepIndex = (status?: OrderStatus) => {
    if (!status) return 0;
    const idx = ORDER_STEPS.findIndex((s) => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStep = getStepIndex(order?.status);
  const isCancelled = order?.status === 'cancelled';
  const canCancel =
    order &&
    !isCancelled &&
    (order.status === 'pending_confirmation' || order.status === 'confirmed');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E342E] hover:text-[#C86D51]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Orders</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5D4037]">
            {socketConnected ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <Wifi className="w-3.5 h-3.5" /> Live Socket
              </span>
            ) : (
              <span className="flex items-center gap-1 text-stone-500">
                <WifiOff className="w-3.5 h-3.5" /> Auto-syncing
              </span>
            )}
          </span>
          <span className="text-xs font-medium text-[#5D4037]">
            Order: <strong className="font-mono text-[#231709]">{order?.orderNumber || orderId}</strong>
          </span>
        </div>
      </div>

      {cancelMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between">
          <span>{cancelMessage}</span>
          <button onClick={() => setCancelMessage(null)} className="text-stone-400 hover:text-stone-700">
            &times;
          </button>
        </div>
      )}

      {/* Hero Status Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#FAF6F0] to-[#F5EBE1] border border-[#DFCDB8] p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FBECE7] text-[#C86D51]">
              <span className="w-2 h-2 rounded-full bg-[#D97736] animate-pulse" />
              Live Order Tracker • Kittu Cafe, Dausa
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#231709]">
              {isCancelled
                ? 'Order Cancelled'
                : order?.status === 'completed'
                ? 'Delivered & Completed!'
                : order?.status === 'out_for_delivery'
                ? 'Rider Out for Delivery in Dausa'
                : order?.status === 'ready_for_pickup'
                ? 'Your Order is Packed & Ready!'
                : order?.status === 'preparing'
                ? 'Chef is Freshly Preparing Your Bites...'
                : 'Order Confirmed by Kittu Cafe'}
            </h1>
            <p className="text-xs text-[#5D4037]">
              {isCancelled
                ? 'This order has been cancelled.'
                : 'Estimated wait: ~15-20 mins. Freshly cooked at Shiv Colony, Mariyara Wale.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:+919511317456"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#231709] text-white text-xs font-bold hover:bg-[#3E2723] transition-colors shrink-0 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#D97736]" />
              <span>Call Cafe (+91 95113 17456)</span>
            </a>

            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>{cancelling ? 'Cancelling...' : 'Cancel Order'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual Timeline Stepper */}
        {!isCancelled && (
          <div className="pt-4 border-t border-[#DFCDB8]/70">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {ORDER_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isPast = currentStep > idx;
                const isCurrent = currentStep === idx;

                return (
                  <div
                    key={step.status}
                    className={`p-3 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-white border-[#D97736] shadow-sm ring-1 ring-[#D97736]/20'
                        : isPast
                        ? 'bg-emerald-50/60 border-emerald-500/40 text-emerald-800'
                        : 'bg-transparent border-[#DFCDB8]/60 text-[#8D6E63] opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          isCurrent
                            ? 'bg-[#D97736] text-white shadow-xs'
                            : isPast
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#FAF6F0] text-[#8D6E63]'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {idx + 1}
                      </span>
                    </div>
                    <p className="text-[11px] font-black leading-tight text-[#231709]">{step.label}</p>
                    <p className="text-[9px] text-[#5D4037] leading-tight mt-0.5 hidden sm:block">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Details Grid: Order Summary + Delivery Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Items Summary */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EBE0D2] p-6 space-y-4">
          <h3 className="text-sm font-black text-[#231709] pb-3 border-b border-[#FAF6F0]">
            Items Ordered ({order?.items?.length || 0})
          </h3>

          {order?.items && (
            <div className="divide-y divide-[#FAF6F0] space-y-2.5">
              {order.items.map((item, index) => (
                <div key={index} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
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
            {order?.discountInPaise ? (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount Applied</span>
                <span>-{formatPrice(order.discountInPaise)}</span>
              </div>
            ) : null}
            <div className="pt-2 border-t border-[#EBE0D2] flex justify-between text-sm font-black text-[#231709]">
              <span>Grand Total</span>
              <span className="text-[#C86D51]">{formatPrice(order?.totalInPaise || 0)}</span>
            </div>
          </div>
        </div>

        {/* Right: Fulfillment & Destination Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-[#EBE0D2] p-6 space-y-4">
            <h3 className="text-sm font-black text-[#231709]">Fulfillment Details</h3>

            <div className="space-y-3 text-xs text-[#5D4037]">
              <div>
                <span className="font-bold text-[#231709] block">Order Type</span>
                <span className="capitalize">{order?.orderType?.replace('_', ' ') || 'Dine In'}</span>
              </div>

              {order?.tableNumber && (
                <div>
                  <span className="font-bold text-[#231709] block">Seating Table</span>
                  <span>{order.tableNumber}</span>
                </div>
              )}

              {order?.deliveryAddress && (
                <div>
                  <span className="font-bold text-[#231709] block">Delivery Destination</span>
                  <div className="flex items-start gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D97736] shrink-0 mt-0.5" />
                    <span>
                      {typeof order.deliveryAddress === 'string'
                        ? order.deliveryAddress
                        : `${(order.deliveryAddress as any).street || ''}, ${(order.deliveryAddress as any).area || ''}, ${(order.deliveryAddress as any).city || 'Dausa'} - ${(order.deliveryAddress as any).postalCode || '303303'}`}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <span className="font-bold text-[#231709] block">Payment Method</span>
                <span className="capitalize">{order?.paymentMethod?.replace('_', ' ') || 'Cash on Delivery'}</span>
                <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                  order?.paymentStatus === 'captured' || (order?.paymentStatus as string) === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {order?.paymentStatus === 'captured' || (order?.paymentStatus as string) === 'paid' ? 'PAID' : 'PENDING'}
                </span>
              </div>

              {order?.preparationNotes && (
                <div>
                  <span className="font-bold text-[#231709] block">Kitchen Notes</span>
                  <p className="italic text-stone-600">"{order.preparationNotes}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#DFCDB8] text-xs text-[#5D4037] space-y-1">
            <span className="font-bold text-[#231709] block">Kittu Cafe Dausa Guarantee</span>
            <p className="text-[11px]">
              Every order is prepared with fresh ingredients and authentic flavors. For special queries, dial +91 95113 17456.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
