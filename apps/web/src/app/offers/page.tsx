'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Tag,
  Copy,
  Check,
  Percent,
  Clock,
  Sparkles,
  ArrowRight,
  Gift,
  ShieldCheck,
} from 'lucide-react';
import { formatPrice } from '../../lib/api';

interface OfferCoupon {
  code: string;
  title: string;
  discountDisplay: string;
  description: string;
  minOrderPaise: number;
  validUntil: string;
  badge: string;
  category: string;
}

const OFFERS: OfferCoupon[] = [
  {
    code: 'KITTU50',
    title: 'Flat ₹50 OFF Special',
    discountDisplay: '₹50 OFF',
    description: 'Get flat ₹50 discount on all online orders above ₹249 across our food and beverage menu.',
    minOrderPaise: 24900,
    validUntil: '31 Dec 2026',
    badge: 'Popular',
    category: 'Daily Special',
  },
  {
    code: 'WELCOME50',
    title: 'Welcome New Guest Offer',
    discountDisplay: '50% OFF',
    description: 'Special 50% discount up to ₹100 on your first digital order with Kittu Cafe.',
    minOrderPaise: 15000,
    validUntil: '31 Dec 2026',
    badge: 'First Order',
    category: 'Welcome Offer',
  },
  {
    code: 'STUDENT10',
    title: 'Dausa Student Special',
    discountDisplay: '10% OFF',
    description: 'Enjoy 10% instant off on cold coffees, pizzas, and burger combos during study hours.',
    minOrderPaise: 19900,
    validUntil: 'Ongoing',
    badge: 'Student Perk',
    category: 'Study Hour',
  },
  {
    code: 'PARTY20',
    title: 'Cafe Party & Celebration Bonanza',
    discountDisplay: '20% OFF',
    description: 'Planning a birthday or group gathering? Enjoy 20% off on bulk orders above ₹999.',
    minOrderPaise: 99900,
    validUntil: '31 Dec 2026',
    badge: 'Group Feasts',
    category: 'Bulk Orders',
  },
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">
          Exclusive Savings
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#231709] tracking-tight">
          Deals, Coupons & Offers
        </h1>
        <p className="text-xs sm:text-sm text-[#5D4037] leading-relaxed">
          Enjoy artisanal coffee and handcrafted bites at unbeatable prices. Copy your favorite promo code and apply it during checkout.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OFFERS.map((offer) => {
          const isCopied = copiedCode === offer.code;
          return (
            <div
              key={offer.code}
              className="relative rounded-3xl bg-[#FFFEFA] border border-[#EBE0D2] p-6 flex flex-col justify-between shadow-3d space-y-5 overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-900">
                    {offer.badge}
                  </span>
                  <span className="text-xs font-bold text-stone-500">{offer.category}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-[#D97736]" />
                  <span>Valid till {offer.validUntil}</span>
                </div>
              </div>

              {/* Offer Details */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#C86D51]">
                    {offer.discountDisplay}
                  </span>
                  <h3 className="text-base font-bold text-[#231709]">{offer.title}</h3>
                </div>
                <p className="text-xs text-[#5D4037] leading-relaxed">
                  {offer.description}
                </p>
                <div className="text-[11px] font-semibold text-stone-500">
                  Minimum Order Value: {formatPrice(offer.minOrderPaise)}
                </div>
              </div>

              {/* Coupon Code Strip with 1-Click Copy */}
              <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-dashed border-[#DFCDB8] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-[#D97736]" />
                  <span className="font-mono text-sm font-black text-[#231709] tracking-widest">
                    {offer.code}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#231709] hover:bg-[#3E2723] text-white shadow-xs'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to Redeem Banner */}
      <div className="p-8 rounded-3xl bg-[#231709] text-white border border-[#3E2723] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#D97736]">
            <Gift className="w-4 h-4" />
            <span>How to Redeem in 3 Easy Steps</span>
          </div>
          <h3 className="text-xl font-black">Ready to feast on artisanal bites?</h3>
          <p className="text-xs text-[#DFCDB8]">
            1. Add items to your cart &bull; 2. Paste code at checkout &bull; 3. Enjoy fresh savings!
          </p>
        </div>

        <Link
          href="/menu"
          className="px-6 py-3.5 rounded-2xl btn-3d-primary text-white text-xs font-black flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-lg"
        >
          <span>Order Now with Coupon</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Link>
      </div>
    </div>
  );
}
