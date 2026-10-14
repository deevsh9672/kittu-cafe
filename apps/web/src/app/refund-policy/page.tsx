'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97736] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">Customer Protection</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#231709] tracking-tight">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs text-stone-500">Effective Date: October 2026 &bull; Kittu Cafe, Dausa, Rajasthan</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#EBE0D2] shadow-3d space-y-6 text-xs sm:text-sm text-[#5D4037] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">1. Order Cancellation Policy</h2>
          <p>
            Because we prepare all beverages and kitchen dishes fresh upon receipt:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Orders can be cancelled free of charge if the kitchen has not yet started preparation ({`"`}Order Placed{`"`} status).</li>
            <li>Once an order transitions to {`"`}In Kitchen / Preparing{`"`}, cancellation is no longer possible as ingredients and preparation time have already been allocated.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">2. Eligibility for Refunds</h2>
          <p>You are entitled to a full or partial refund in the following scenarios:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Incorrect item delivered or missing items from your parcel.</li>
            <li>Major quality discrepancy verified by our cafe team or store manager.</li>
            <li>Order cancelled by Kittu Cafe due to ingredient depletion or emergency store closure.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">3. Refund Processing Timelines</h2>
          <p>
            Approved refunds are credited directly back to the original source payment method (UPI, Debit/Credit Card) within 3 to 5 business days, in compliance with standard Reserve Bank of India (RBI) payment gateway timelines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">4. How to Request Support</h2>
          <p>
            If you encounter any issue with your order, please notify us immediately via phone or WhatsApp at{' '}
            <a href={`tel:${BUSINESS_CONFIG.contactNumber}`} className="font-bold text-[#D97736] hover:underline">
              {BUSINESS_CONFIG.contactNumber}
            </a>{' '}
            with your Order ID.
          </p>
        </section>
      </div>
    </div>
  );
}
