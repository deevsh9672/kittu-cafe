'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Calendar,
  CreditCard,
  Banknote,
  Tag,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../lib/api';
import { OrderType, PaymentMethod } from '@kittu-cafe/shared';
import { useAuthStore } from '../../store/useAuthStore';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotalPaise = useCartStore((state) => state.subtotalInPaise)();

  const { user, savedAddresses } = useAuthStore();

  // Form states
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [deliveryAddress, setDeliveryAddress] = useState(
    savedAddresses.find((a) => a.isDefault)?.street
      ? `${savedAddresses.find((a) => a.isDefault)?.street}, ${savedAddresses.find((a) => a.isDefault)?.area}, Dausa`
      : ''
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [preparationNotes, setPreparationNotes] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPaise, setDiscountPaise] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const taxPaise = Math.round(subtotalPaise * 0.05);
  const deliveryFeePaise = orderType === 'delivery' ? (subtotalPaise >= 49900 ? 0 : 4000) : 0;
  const totalPaise = Math.max(0, subtotalPaise + taxPaise + deliveryFeePaise - discountPaise);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'KITTU50') {
      if (subtotalPaise < 20000) {
        setCouponError('Minimum order of ₹200 required for KITTU50');
        return;
      }
      const disc = Math.min(Math.round(subtotalPaise * 0.5), 10000);
      setDiscountPaise(disc);
      setAppliedCoupon('KITTU50');
    } else if (code === 'WELCOME50') {
      if (subtotalPaise < 25000) {
        setCouponError('Minimum order of ₹250 required for WELCOME50');
        return;
      }
      setDiscountPaise(5000);
      setAppliedCoupon('WELCOME50');
    } else {
      setCouponError('Invalid or expired coupon code');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!customerName || !customerPhone) {
      alert('Please enter your name and phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        orderType,
        customerName,
        customerPhone,
        tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        paymentMethod,
        couponCode: appliedCoupon || undefined,
        preparationNotes,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          selectedVariantName: i.selectedVariantName,
          selectedAddOnNames: i.selectedAddOnNames,
        })),
      };

      const res = await fetch('http://localhost:5000/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data?.order) {
        const placed = data.data.order;
        if (typeof window !== 'undefined') {
          try {
            const current = JSON.parse(localStorage.getItem('kittu_shared_orders') || '[]');
            localStorage.setItem('kittu_shared_orders', JSON.stringify([placed, ...current]));
          } catch {}
        }
        clearCart();
        router.push(`/orders/${placed._id}/track`);
      } else {
        // Local fallback order placement
        const mockOrder = {
          _id: `ord-${Date.now()}`,
          orderNumber: `KC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName,
          customerPhone,
          orderType,
          tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
          deliveryAddress,
          paymentMethod,
          paymentStatus: 'pending',
          status: 'confirmed',
          totalInPaise: totalPaise,
          items: items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            totalPriceInPaise: i.unitPriceInPaise * i.quantity,
          })),
          createdAt: new Date().toISOString(),
        };
        if (typeof window !== 'undefined') {
          try {
            const current = JSON.parse(localStorage.getItem('kittu_shared_orders') || '[]');
            localStorage.setItem('kittu_shared_orders', JSON.stringify([mockOrder, ...current]));
          } catch {}
        }
        clearCart();
        router.push(`/orders/${mockOrder._id}/track`);
      }
    } catch {
      const mockId = `ord-${Date.now()}`;
      clearCart();
      router.push(`/orders/${mockId}/track`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto text-[#C86D51]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-[#231709]">Your Cart is Empty</h2>
        <p className="text-xs text-[#5D4037]">Add delicious bites and drinks from our menu before checking out.</p>
        <Link href="/menu" className="inline-block px-6 py-3 rounded-xl btn-3d-primary text-white text-xs font-bold">
          Explore Digital Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-bold text-[#8D6E63] hover:text-[#C86D51] mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cart Review</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
          {/* Order Type Selector */}
          <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#EBE0D2] shadow-3d space-y-4">
            <h3 className="text-base font-black text-[#231709] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D97736]" />
              1. Choose Order Type
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['dine_in', 'takeaway', 'pickup', 'delivery'] as OrderType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`py-3 px-2 rounded-xl text-xs font-black capitalize transition-all border ${
                    orderType === type
                      ? 'btn-3d-primary text-white shadow-md'
                      : 'bg-white text-[#5D4037] border-[#EBE0D2] hover:bg-[#FAF6F0]'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#EBE0D2] shadow-3d space-y-4">
            <h3 className="text-base font-black text-[#231709]">2. Guest Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-[#5D4037] block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dev Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] bg-white focus:outline-none focus:border-[#D97736]"
                />
              </div>
              <div>
                <label className="font-bold text-[#5D4037] block mb-1">Phone Number (SMS / WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] bg-white focus:outline-none focus:border-[#D97736]"
                />
              </div>
            </div>

            {orderType === 'dine_in' && (
              <div>
                <label className="font-bold text-[#5D4037] block mb-1">Table Number</label>
                <input
                  type="text"
                  placeholder="e.g. Table 4"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] bg-white focus:outline-none focus:border-[#D97736]"
                />
              </div>
            )}

            {orderType === 'delivery' && (
              <div>
                <label className="font-bold text-[#5D4037] block mb-1">Dausa Delivery Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="House/Street, Shiv Colony, Dausa..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] bg-white focus:outline-none focus:border-[#D97736]"
                />
              </div>
            )}

            <div>
              <label className="font-bold text-[#5D4037] block mb-1">Special Cooking / Preparation Notes</label>
              <input
                type="text"
                placeholder="e.g. Less spicy, extra hot cappuccino"
                value={preparationNotes}
                onChange={(e) => setPreparationNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] bg-white focus:outline-none focus:border-[#D97736]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#EBE0D2] shadow-3d space-y-4">
            <h3 className="text-base font-black text-[#231709]">3. Payment Mode</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#C86D51] bg-[#FBECE7] ring-1 ring-[#C86D51]'
                    : 'border-[#EBE0D2] bg-white'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#C86D51]" />
                <div>
                  <span className="font-black text-xs text-[#231709] block">
                    {orderType === 'dine_in' ? 'Pay at Counter / Table' : 'Cash / UPI on Delivery'}
                  </span>
                  <span className="text-[10px] text-[#5D4037]">Pay cash or scan QR upon arrival</span>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('razorpay')}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#C86D51] bg-[#FBECE7] ring-1 ring-[#C86D51]'
                    : 'border-[#EBE0D2] bg-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#C86D51]" />
                <div>
                  <span className="font-black text-xs text-[#231709] block">Online Instant Pay (Razorpay)</span>
                  <span className="text-[10px] text-[#5D4037]">UPI, Cards, NetBanking</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl btn-3d-primary text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-[#D97736]" />
            <span>{isSubmitting ? 'Processing Order...' : `Confirm Order • ${formatPrice(totalPaise)}`}</span>
          </button>
        </form>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Box */}
          <div className="bg-[#FFFEFA] p-5 rounded-2xl border border-[#EBE0D2] shadow-3d space-y-3">
            <span className="text-xs font-black text-[#231709] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#C86D51]" />
              Have a Promo Code?
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Try KITTU50 or WELCOME50"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-[#EBE0D2] text-xs font-bold uppercase focus:outline-none focus:border-[#D97736]"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 rounded-xl bg-[#231709] text-white text-xs font-black hover:bg-[#352115]"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-[11px] text-rose-600 font-bold">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Coupon {appliedCoupon} applied! Saved {formatPrice(discountPaise)}
              </p>
            )}
          </div>

          {/* Cart Breakdown */}
          <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#EBE0D2] shadow-3d space-y-4">
            <h3 className="text-sm font-black text-[#231709]">Order Summary ({items.length} items)</h3>
            <div className="divide-y divide-[#FAF6F0] max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#231709]">{item.name}</span>
                    <span className="text-[10px] text-[#8D6E63] block">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-black text-[#231709]">{formatPrice(item.unitPriceInPaise * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-[#EBE0D2] text-xs text-[#5D4037]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#231709]">{formatPrice(subtotalPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-bold text-[#231709]">{formatPrice(taxPaise)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-[#231709]">
                    {deliveryFeePaise === 0 ? 'FREE' : formatPrice(deliveryFeePaise)}
                  </span>
                </div>
              )}
              {discountPaise > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount ({appliedCoupon})</span>
                  <span>-{formatPrice(discountPaise)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#231709] pt-2 border-t border-[#EBE0D2]">
                <span>Total Amount</span>
                <span className="text-[#C86D51]">{formatPrice(totalPaise)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
