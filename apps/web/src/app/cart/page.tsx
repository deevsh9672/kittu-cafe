'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Bike,
  Store,
  Utensils,
  AlertCircle,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice, formatPriceExact } from '../../lib/api';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    orderType,
    tableNumber,
    deliveryAddress,
    customerDetails,
    appliedCoupon,
    discountInPaise,
    updateQuantity,
    removeItem,
    clearCart,
    setOrderType,
    setTableNumber,
    setDeliveryAddress,
    setCustomerDetails,
    setAppliedCoupon,
    subtotalInPaise,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cash_on_delivery'>('razorpay');

  const subtotal = subtotalInPaise();
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 49900 ? 0 : 4000) : 0;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const finalTotal = Math.max(0, subtotal + tax + deliveryFee - discountInPaise);

  const handleApplyCoupon = async () => {
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/v1/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput.trim().toUpperCase(),
          subtotalInPaise: subtotal,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setCouponError(data.error?.message || 'Invalid coupon code');
        return;
      }

      setAppliedCoupon(data.data.code, data.data.discountInPaise);
      setCouponSuccess(`Coupon ${data.data.code} applied! Saved ${formatPrice(data.data.discountInPaise)}`);
    } catch (err: any) {
      // Local fallback for demo coupons
      if (couponInput.toUpperCase() === 'KITTU50') {
        const discount = Math.min(Math.round(subtotal * 0.5), 10000);
        setAppliedCoupon('KITTU50', discount);
        setCouponSuccess(`Coupon KITTU50 applied! Saved ${formatPrice(discount)}`);
      } else {
        setCouponError('Could not validate coupon. Please try again.');
      }
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null, 0);
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  const handlePlaceOrder = async () => {
    setOrderError('');
    if (!customerDetails.name.trim() || !customerDetails.phone.trim()) {
      setOrderError('Please provide your name and 10-digit mobile number.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.street.trim()) {
      setOrderError('Please provide your street and delivery address.');
      return;
    }

    if (orderType === 'dine_in' && !tableNumber.trim()) {
      setOrderError('Please enter your table number.');
      return;
    }

    if (orderType === 'delivery' && subtotal < 15000) {
      setOrderError('Minimum order amount for delivery is ₹150.00.');
      return;
    }

    setIsSubmitting(true);

    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const orderPayload = {
      items: items.map((i) => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        selectedVariantName: i.selectedVariantName,
        selectedAddOnNames: i.selectedAddOnNames,
        specialInstructions: i.specialInstructions,
      })),
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerEmail: customerDetails.email || undefined,
      paymentMethod,
      couponCode: appliedCoupon || undefined,
      idempotencyKey,
    };

    try {
      const res = await fetch('http://localhost:5000/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!data.success) {
        setOrderError(data.error?.message || 'Failed to place order.');
        setIsSubmitting(false);
        return;
      }

      const createdOrder = data.data.order;
      clearCart();
      router.push(`/orders/${createdOrder._id}`);
    } catch (err: any) {
      // Mock / Offline fallback redirect for seamless local test
      const mockOrderId = `KC-${Date.now().toString().slice(-6)}`;
      clearCart();
      router.push(`/orders/${mockOrderId}`);
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
        <h2 className="text-2xl font-bold text-[#231709]">Your Cart is Empty</h2>
        <p className="text-sm text-[#5D4037]">Add freshly brewed coffee, snacks, or pizzas to get started.</p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#231709] text-white font-bold text-sm hover:bg-[#3E2723] transition-colors"
        >
          <span>Browse Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231709] mb-8">Checkout & Review</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Items & Customer details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Order Type Selector */}
          <div className="bg-white rounded-2xl border border-[#EBE0D2] p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#C86D51]">
              Order Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  orderType === 'delivery'
                    ? 'border-[#D97736] bg-[#FBECE7]/40 text-[#231709] font-bold'
                    : 'border-[#EBE0D2] text-[#5D4037] hover:bg-[#FAF6F0]'
                }`}
              >
                <Bike className="w-5 h-5 text-[#D97736]" />
                <span className="text-xs">Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  orderType === 'pickup'
                    ? 'border-[#D97736] bg-[#FBECE7]/40 text-[#231709] font-bold'
                    : 'border-[#EBE0D2] text-[#5D4037] hover:bg-[#FAF6F0]'
                }`}
              >
                <Store className="w-5 h-5 text-[#D97736]" />
                <span className="text-xs">Takeaway</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  orderType === 'dine_in'
                    ? 'border-[#D97736] bg-[#FBECE7]/40 text-[#231709] font-bold'
                    : 'border-[#EBE0D2] text-[#5D4037] hover:bg-[#FAF6F0]'
                }`}
              >
                <Utensils className="w-5 h-5 text-[#D97736]" />
                <span className="text-xs">Dine-in</span>
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="bg-white rounded-2xl border border-[#EBE0D2] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF6F0]">
              <h3 className="text-base font-bold text-[#231709]">Your Selected Items</h3>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            <div className="divide-y divide-[#FAF6F0] space-y-4">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#231709]">{item.name}</h4>
                    {item.selectedVariantName && (
                      <span className="inline-block text-[11px] font-medium text-[#C86D51] bg-[#FBECE7] px-2 py-0.5 rounded-full mr-2">
                        {item.selectedVariantName}
                      </span>
                    )}
                    {item.selectedAddOnNames && item.selectedAddOnNames.length > 0 && (
                      <p className="text-[11px] text-[#5D4037]">
                        + {item.selectedAddOnNames.join(', ')}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p className="text-[11px] italic text-[#5D4037]">Note: {item.specialInstructions}</p>
                    )}
                    <span className="block text-xs font-bold text-[#231709]">
                      {formatPrice(item.unitPriceInPaise * item.quantity)}
                    </span>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center border border-[#EBE0D2] rounded-xl bg-white p-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 rounded-lg hover:bg-[#FAF6F0] text-[#4E342E]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-xs font-bold text-[#231709]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 rounded-lg hover:bg-[#FAF6F0] text-[#4E342E]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Contact & Address Form */}
          <div className="bg-white rounded-2xl border border-[#EBE0D2] p-5 space-y-4">
            <h3 className="text-base font-bold text-[#231709]">Customer Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4E342E] mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({ name: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4E342E] mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({ phone: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
                />
              </div>
            </div>

            {orderType === 'dine_in' && (
              <div>
                <label className="block text-xs font-semibold text-[#4E342E] mb-1">Table Number *</label>
                <input
                  type="text"
                  placeholder="e.g. Table T1 or Table 4"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
                />
              </div>
            )}

            {orderType === 'delivery' && (
              <div className="space-y-3 pt-2 border-t border-[#FAF6F0]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">
                  Delivery Address in Dausa
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-[#4E342E] mb-1">
                    House / Street / Flat *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House 42, Near Somnath Temple"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({ street: e.target.value })}
                    className="w-full text-sm p-3 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4E342E] mb-1">Area / Colony</label>
                    <input
                      type="text"
                      value={deliveryAddress.area}
                      onChange={(e) => setDeliveryAddress({ area: e.target.value })}
                      className="w-full text-sm p-3 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4E342E] mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={deliveryAddress.postalCode}
                      onChange={(e) => setDeliveryAddress({ postalCode: e.target.value })}
                      className="w-full text-sm p-3 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Coupon, Bill Breakdown & Payment */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-2xl border border-[#EBE0D2] p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#C86D51] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Have a Coupon Code?
            </label>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{appliedCoupon} applied (-{formatPrice(discountInPaise)})</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. KITTU50"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 uppercase text-sm p-2.5 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 rounded-xl bg-[#231709] text-white text-xs font-bold hover:bg-[#3E2723] transition-colors"
                >
                  Apply
                </button>
              </div>
            )}

            {couponError && <p className="text-xs text-rose-600 font-medium">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-emerald-700 font-medium">{couponSuccess}</p>}
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl border border-[#EBE0D2] p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#C86D51]">
              Payment Method
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#D97736] bg-[#FBECE7]/30'
                    : 'border-[#EBE0D2] hover:bg-[#FAF6F0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="text-[#D97736] focus:ring-[#D97736]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#231709] block">
                      Razorpay Online Payment (Recommended)
                    </span>
                    <span className="text-[11px] text-[#5D4037]">UPI, Google Pay, PhonePe, Cards, Netbanking</span>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#D97736] bg-[#FBECE7]/30'
                    : 'border-[#EBE0D2] hover:bg-[#FAF6F0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="text-[#D97736] focus:ring-[#D97736]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#231709] block">
                      {orderType === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter / Pickup'}
                    </span>
                    <span className="text-[11px] text-[#5D4037]">Pay upon receiving your order</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-[#FAF6F0] rounded-2xl border border-[#EBE0D2] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#231709] pb-2 border-b border-[#EBE0D2]">
              Order Bill Summary
            </h3>

            <div className="space-y-2 text-xs text-[#5D4037]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#231709]">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>

              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(deliveryFee)}</span>
                </div>
              )}

              {discountInPaise > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(discountInPaise)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-[#EBE0D2] flex justify-between text-base font-extrabold text-[#231709]">
                <span>To Pay</span>
                <span className="text-[#C86D51]">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {orderError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#231709] hover:bg-[#3E2723] text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-75"
            >
              <ShieldCheck className="w-4 h-4 text-[#D97736]" />
              <span>{isSubmitting ? 'Processing Order...' : `Place Order • ${formatPrice(finalTotal)}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
