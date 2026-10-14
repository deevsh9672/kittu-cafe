'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97736] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">Legal & Terms</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#231709] tracking-tight">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-stone-500">Effective Date: October 2026 &bull; Kittu Cafe, Dausa, Rajasthan</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#EBE0D2] shadow-3d space-y-6 text-xs sm:text-sm text-[#5D4037] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">1. Agreement to Terms</h2>
          <p>
            By accessing or placing an order on our platform (kittucafe.in or mobile app), you agree to be bound by these Terms and Conditions and our Privacy Policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">2. Food Preparation & Availability</h2>
          <p>
            All food and beverage items are freshly prepared to order at our cafe in Dausa. Menu item availability is subject to real-time inventory levels. We reserve the right to mark items as sold out when stock is depleted.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">3. Pricing & Taxes</h2>
          <p>
            All prices listed on the menu are in Indian Rupees (INR ₹). Orders are subject to standard applicable Goods and Services Tax (5% GST for restaurant services). Delivery fees, if applicable, are clearly calculated before checkout confirmation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">4. Table Reservations & Dine-in Conduct</h2>
          <p>
            Table bookings are held for a maximum of 15 minutes past the reserved time slot. Guests are requested to maintain a respectful, welcoming atmosphere for other patrons in our dining area.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">5. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of India and the jurisdiction of Dausa, Rajasthan.
          </p>
        </section>
      </div>
    </div>
  );
}
