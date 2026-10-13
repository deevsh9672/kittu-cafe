'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Coffee,
  ShoppingBag,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { BUSINESS_CONFIG, IMenuItem } from '@kittu-cafe/shared';
import { ProductCard } from '../components/ProductCard';

const DEFAULT_FEATURED: IMenuItem[] = [
  {
    _id: 'seed-coffee-1',
    name: 'Classic Handcrafted Cappuccino',
    description: 'Rich double-shot espresso topped with velvet steamed milk froth.',
    categoryId: 'c1',
    basePriceInPaise: 11000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 8,
    variants: [
      { name: 'Regular (250ml)', priceInPaise: 11000, isDefault: true },
      { name: 'Large (350ml)', priceInPaise: 14000 },
    ],
    addOnGroups: [
      {
        title: 'Customizations',
        minSelections: 0,
        maxSelections: 2,
        items: [
          { name: 'Extra Espresso Shot', priceInPaise: 3000 },
          { name: 'Caramel Syrup', priceInPaise: 2500 },
        ],
      },
    ],
  },
  {
    _id: 'seed-coffee-2',
    name: 'Kittu Hazelnut Cold Coffee',
    description: 'Creamy chilled thick blend with roasted hazelnut syrup and ice cream.',
    categoryId: 'c1',
    basePriceInPaise: 14000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 10,
    variants: [
      { name: 'Regular', priceInPaise: 14000, isDefault: true },
      { name: 'Thick Frappe', priceInPaise: 17000 },
    ],
    addOnGroups: [],
  },
  {
    _id: 'seed-sandwich-1',
    name: 'Grilled Paneer Tikka Sandwich',
    description: 'Marinated cottage cheese, capsicum, onions, mint chutney, and molten cheese.',
    categoryId: 'c2',
    basePriceInPaise: 13000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 12,
    variants: [],
    addOnGroups: [],
  },
  {
    _id: 'seed-pizza-1',
    name: 'Veg Loaded Farmhouse Pizza',
    description: 'Crispy base loaded with fresh mozzarella, capsicum, red onions, and sweet corn.',
    categoryId: 'c3',
    basePriceInPaise: 22000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: false,
    preparationTimeMinutes: 18,
    variants: [
      { name: 'Medium (8 inch)', priceInPaise: 22000, isDefault: true },
      { name: 'Large (10 inch)', priceInPaise: 32000 },
    ],
    addOnGroups: [],
  },
];

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<IMenuItem[]>(DEFAULT_FEATURED);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/menu?isFeatured=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.items?.length > 0) {
          setFeaturedItems(data.data.items);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-20 pb-28">
      {/* 3D Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF4EC] via-[#FFFDF9] to-[#FAF6F0] pt-14 pb-24 border-b border-[#EBE0D2]/80">
        {/* Soft Ambient 3D Glow Backdrops */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#D97736]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#C86D51]/10 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-7">
              {/* Floating 3D Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EBE0D2] shadow-3d">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">
                  Kittu Cafe • Shiv Colony, Dausa
                </span>
                <span className="text-xs text-[#8D6E63] font-medium hidden sm:inline">• Kitchen Active</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#231709] leading-[1.12]">
                Artisanal Brews & Handcrafted Bites in{' '}
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97736] to-[#C86D51]">
                  Dausa
                  <span className="absolute left-0 bottom-1 w-full h-2 bg-[#D97736]/20 -z-10 rounded-full" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#5D4037] leading-relaxed max-w-xl font-medium">
                Experience warm cafe luxury. Freshly roasted espresso blends, stone-baked pizzas, gourmet grilled sandwiches, and thick cold frappes prepared to perfection.
              </p>

              {/* 3D Tactile Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/menu"
                  className="px-7 py-4 rounded-2xl btn-3d-primary text-white font-extrabold text-sm flex items-center gap-2.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D97736]" />
                  <span>Order Food Online</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>

                <Link
                  href="/book-table"
                  className="px-6 py-4 rounded-2xl btn-3d-light text-[#231709] font-extrabold text-sm flex items-center gap-2 border border-[#EBE0D2] cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#C86D51]" />
                  <span>Reserve Table</span>
                </Link>

                <a
                  href={`tel:${BUSINESS_CONFIG.contactNumber}`}
                  className="px-4 py-3 text-xs font-bold text-[#4E342E] hover:text-[#C86D51] flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#D97736]" />
                  <span>+91 95113 17456</span>
                </a>
              </div>

              {/* 3D Elevated Feature Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EBE0D2]/70">
                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#EBE0D2] shadow-3d text-center">
                  <span className="block text-xl font-black text-[#231709]">100%</span>
                  <span className="text-[11px] font-bold text-[#5D4037]">Pure & Fresh</span>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#EBE0D2] shadow-3d text-center">
                  <span className="block text-xl font-black text-[#231709]">₹150</span>
                  <span className="text-[11px] font-bold text-[#5D4037]">Min. Delivery</span>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#EBE0D2] shadow-3d text-center">
                  <span className="block text-xl font-black text-[#231709]">15–20m</span>
                  <span className="text-[11px] font-bold text-[#5D4037]">Fast Kitchen</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Luxury Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* 3D Decorative Floating Ring */}
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-3xl bg-gradient-to-br from-[#D97736] to-[#C86D51] opacity-20 blur-xl animate-float pointer-events-none" />

                {/* 3D Showcase Panel */}
                <div className="rounded-3xl glass-dark-3d p-7 text-white space-y-6 animate-float relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D97736] to-[#C86D51] flex items-center justify-center text-white shadow-lg">
                        <Coffee className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-white tracking-tight leading-tight">
                          Kittu Cafe Dausa
                        </h3>
                        <p className="text-[11px] text-[#DFCDB8]">Artisanal Kitchen & Espresso</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Open Now
                    </span>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-3 bg-black/25 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center justify-between text-xs text-[#DFCDB8]">
                      <span className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#D97736]" /> Daily Service
                      </span>
                      <span className="font-bold text-white">10:00 AM – 10:30 PM</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#DFCDB8]">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#D97736]" /> Verified Address
                      </span>
                      <span className="font-bold text-white">Shiv Colony, Dausa</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#DFCDB8]">
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Payment Modes
                      </span>
                      <span className="font-bold text-white">UPI, Cards & Cash</span>
                    </div>
                  </div>

                  {/* 3D Promo Box */}
                  <div className="rounded-2xl bg-gradient-to-r from-[#D97736] to-[#C86D51] p-4 text-white shadow-md space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Welcome Special
                      </span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-md font-mono text-[10px]">
                        CODE: KITTU50
                      </span>
                    </div>
                    <p className="text-xs font-medium text-white/90">
                      Enjoy 50% discount up to ₹100 on your first digital order!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Featured Menu Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBECE7] border border-[#E6866B]/30 text-xs font-bold uppercase tracking-wider text-[#C86D51] mb-2">
              <Flame className="w-3.5 h-3.5 text-[#D97736] fill-[#D97736]" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231709] tracking-tight">
              Featured Cafe Specialties
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#C86D51] hover:text-[#D97736] transition-colors"
          >
            <span>Explore Full 40+ Item Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      </section>

      {/* 3D Location & Directions Card */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#FFFEFA] border border-[#EBE0D2] shadow-3d p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">
                Locate Kittu Cafe
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#231709] tracking-tight">
                Authentic Cafe Vibes in Shiv Colony, Dausa
              </h3>
              <p className="text-sm text-[#5D4037] leading-relaxed">
                Whether dropping in for your morning espresso, having an evening catch-up over peri peri fries and milkshakes, or hosting dinner with stone-baked pizzas, Kittu Cafe offers the perfect ambiance.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={BUSINESS_CONFIG.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl btn-3d-primary text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#D97736]" />
                  <span>Google Maps Directions</span>
                </a>

                <Link
                  href="/book-table"
                  className="px-5 py-3 rounded-xl btn-3d-light text-[#231709] text-xs font-bold flex items-center gap-2 border border-[#DFCDB8] cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#C86D51]" />
                  <span>Reserve a Table</span>
                </Link>
              </div>
            </div>

            {/* Location Data Box with 3D inset */}
            <div className="bg-[#FAF6F0] rounded-2xl p-6 border border-[#EBE0D2] space-y-4 shadow-inner">
              <h4 className="font-extrabold text-[#231709] text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified Cafe Location Data
              </h4>
              <div className="space-y-3 text-xs text-[#5D4037]">
                <div className="p-3 bg-white rounded-xl border border-[#EBE0D2]">
                  <span className="font-bold block text-[#231709]">Exact Address</span>
                  <span>{BUSINESS_CONFIG.address}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#EBE0D2]">
                  <span className="font-bold block text-[#231709]">Direct Phone</span>
                  <a href={`tel:${BUSINESS_CONFIG.contactNumber}`} className="text-[#C86D51] font-bold hover:underline">
                    {BUSINESS_CONFIG.contactNumber}
                  </a>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#EBE0D2]">
                  <span className="font-bold block text-[#231709]">Timings (Asia/Kolkata)</span>
                  <span>Open Daily: 10:00 AM – 10:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
