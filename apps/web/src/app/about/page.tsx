'use client';

import React from 'react';
import Link from 'next/link';
import {
  Coffee,
  Heart,
  Award,
  Users,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

export default function AboutPage() {
  return (
    <div className="space-y-16 py-10 pb-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#231709] via-[#2F1C0C] to-[#1A1006] text-white p-8 sm:p-14 overflow-hidden border border-[#3E2723] shadow-2xl">
          {/* Aesthetic glow overlays */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D97736]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C86D51]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D97736]/20 border border-[#D97736]/40 text-xs font-black uppercase tracking-wider text-[#D97736]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Artisanal Coffee & Kitchen • Dausa, Rajasthan</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Crafting Memorable Flavours in the Heart of Dausa.
            </h1>

            <p className="text-sm sm:text-base text-[#DFCDB8] leading-relaxed">
              At Kittu Cafe, we believe food is more than nourishment—it is a celebration of warmth, conversation, and artisanal craftsmanship. Welcome to Dausa’s premium haven for coffee lovers and food connoisseurs.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/menu"
                className="px-6 py-3 rounded-2xl btn-3d-primary text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
              <Link
                href="/book-table"
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Reserve a Table</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & Ethos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">
                Our Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#231709] tracking-tight mt-1">
                From Bean to Cup, Passion in Every Detail.
              </h2>
            </div>

            <p className="text-sm text-[#5D4037] leading-relaxed">
              Founded with the vision to bring contemporary cafe culture to Dausa, Kittu Cafe combines authentic Italian espresso techniques with rich Rajasthani warmth. Whether you are stepping in for a brisk morning cappuccino, hosting a cozy work session, or sharing stone-baked pizza with loved ones, our doors are always open.
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                {
                  title: '100% Arabica Handcrafted Roast',
                  desc: 'Sourced from the misty hills of Chikmagalur, freshly ground for every cup to ensure optimum crema and balanced sweetness.',
                },
                {
                  title: 'Farm-Fresh Dairy & Local Produce',
                  desc: 'We partner directly with certified local dairy farmers and produce vendors in Rajasthan for pure milk, butter, and vegetables.',
                },
                {
                  title: 'Strict FSSAI Hygiene Standards',
                  desc: 'Zero compromise on cleanliness. Every dish is prepared in a temperature-controlled, sanitized kitchen with filtered water.',
                },
              ].map((point) => (
                <div key={point.title} className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#231709]">{point.title}</h4>
                    <p className="text-xs text-[#6D4C41] mt-0.5">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Stat Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-[#FFFEFA] border border-[#EBE0D2] shadow-3d space-y-2 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FBECE7] flex items-center justify-center text-[#C86D51]">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#231709]">20,000+</h3>
              <p className="text-xs font-semibold text-[#5D4037]">Cups of Handcrafted Coffee Served</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFFEFA] border border-[#EBE0D2] shadow-3d space-y-2 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#231709]">4.9 / 5.0</h3>
              <p className="text-xs font-semibold text-[#5D4037]">Customer Satisfaction Rating</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFFEFA] border border-[#EBE0D2] shadow-3d space-y-2 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#231709]">100%</h3>
              <p className="text-xs font-semibold text-[#5D4037]">Pure Veg & Hygienic Preparation</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFFEFA] border border-[#EBE0D2] shadow-3d space-y-2 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#231709]">45+</h3>
              <p className="text-xs font-semibold text-[#5D4037]">Signature Recipes & Beverages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ambiance & Location Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF6F0] border border-[#EBE0D2] shadow-3d space-y-8">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">
              Visit Us in Dausa
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight">
              Comfortable Seating, High-Speed WiFi & Calming Vibes
            </h2>
            <p className="text-xs sm:text-sm text-[#5D4037]">
              Located conveniently in Shiv Colony, Mariyara Wale, Dausa. Easy parking, air-conditioned seating, and attentive service make Kittu Cafe the top destination in town.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-[#EBE0D2] space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#FBECE7] flex items-center justify-center text-[#D97736]">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#231709] uppercase tracking-wider">Address</h4>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                {BUSINESS_CONFIG.address}
              </p>
              <a
                href={BUSINESS_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-black text-[#D97736] hover:underline pt-1"
              >
                <span>Open Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EBE0D2] space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#231709] uppercase tracking-wider">Operating Hours</h4>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                Monday – Thursday: 10:00 AM – 10:30 PM<br />
                Friday – Sunday: 10:00 AM – 11:00 PM
              </p>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                Open All 7 Days
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EBE0D2] space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#231709] uppercase tracking-wider">Reservations & Orders</h4>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                Call us directly or send a WhatsApp message for party reservations and instant pickup.
              </p>
              <a
                href={`tel:${BUSINESS_CONFIG.contactNumber}`}
                className="inline-flex items-center gap-1 text-xs font-black text-[#D97736] hover:underline pt-1"
              >
                <span>{BUSINESS_CONFIG.contactNumber}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
