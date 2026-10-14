'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97736] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">Legal & Transparency</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#231709] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-stone-500">Last updated: October 2026 &bull; Kittu Cafe, Dausa, Rajasthan</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#EBE0D2] shadow-3d space-y-6 text-xs sm:text-sm text-[#5D4037] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">1. Introduction</h2>
          <p>
            At Kittu Cafe ({`"`}we{`"`}, {`"`}our{`"`}, or {`"`}us{`"`}), accessible from kittucafe.in, one of our main priorities is the privacy of our visitors and guests. This Privacy Policy outlines the types of information that is collected and recorded by Kittu Cafe and how we use it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">2. Information We Collect</h2>
          <p>
            When you place an online food order, reserve a table, or contact us through our website or mobile application, we may collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact information: Name, phone number, and optional email address.</li>
            <li>Order and delivery information: Delivery address, dietary preferences, and order history.</li>
            <li>Transaction information: Payment status, payment method (UPI, Cash on Delivery, Card). Note: We never store your raw banking credentials or UPI PIN.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">3. How We Use Your Information</h2>
          <p>We use your information exclusively to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process, prepare, and deliver your food and beverage orders.</li>
            <li>Notify you regarding your live order status via SMS / WhatsApp.</li>
            <li>Confirm and manage your dine-in table reservations.</li>
            <li>Send applicable promotional discounts, coupons, and seasonal menu updates (you may opt out at any time).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">4. Data Protection & Security</h2>
          <p>
            We implement strict technical and organizational safeguards to ensure your personal data is protected against unauthorized access, loss, or misuse. We never sell, rent, or trade your personal information to third-party brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#231709]">5. Contact Us</h2>
          <p>
            If you have questions or require more information about our Privacy Policy, please contact us at:
          </p>
          <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#EBE0D2] text-xs">
            <p className="font-bold text-[#231709]">{BUSINESS_CONFIG.name}</p>
            <p>{BUSINESS_CONFIG.address}</p>
            <p>Phone: {BUSINESS_CONFIG.contactNumber}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
