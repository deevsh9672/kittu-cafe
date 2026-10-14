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
  Star,
  CheckCircle2,
  Utensils,
  ChevronRight,
  Plus,
  Package,
  Truck,
  Heart,
} from 'lucide-react';
import { BUSINESS_CONFIG, IMenuItem } from '@kittu-cafe/shared';
import { ProductCard } from '../components/ProductCard';
import { formatPrice } from '../lib/api';
import { useCartStore } from '../store/useCartStore';
import { MENU_ITEMS } from '../data/menuData';

const DEFAULT_FEATURED: IMenuItem[] = MENU_ITEMS.filter((item) => item.isFeatured || item.isBestseller);

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'c1', label: 'Coffee', icon: '☕' },
  { id: 'c2', label: 'Burger & Sandwich', icon: '🍔' },
  { id: 'c3', label: 'Pizza', icon: '🍕' },
  { id: 'c4', label: 'Snacks & Fries', icon: '🍟' },
  { id: 'c5', label: 'Desserts & Ice Cream', icon: '🍨' },
];

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<IMenuItem[]>(DEFAULT_FEATURED);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    fetch(`${apiUrl}/menu?isFeatured=true`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.items?.length > 0) {
          const merged = data.data.items.map((item: IMenuItem) => {
            const fallback = DEFAULT_FEATURED.find((d) => d._id === item._id || d.name === item.name);
            return {
              ...item,
              imageUrl: item.imageUrl || fallback?.imageUrl,
            };
          });
          setFeaturedItems(merged);
        }
      })
      .catch(() => {});
  }, []);

  const filteredItems =
    selectedCategory === 'all'
      ? featuredItems
      : featuredItems.filter((item) => item.categoryId === selectedCategory);

  return (
    <div className="space-y-16 sm:space-y-24 pb-28 bg-[#FAF7F2]">
      {/* =========================================================================
          HERO SECTION (Inspired by Image 2 - Maison Crumb Café Luxury Light Theme)
         ========================================================================= */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-[#EBE0D2]/80 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Editorial Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              {/* Top Rating Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#EBE0D2] shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="text-[11px] font-black uppercase tracking-wider text-[#231709]">
                  Top-Rated Artisan Cafe in Dausa, Rajasthan
                </span>
              </div>

              {/* Editorial Headline */}
              <h1 className="text-4xl sm:text-6xl font-serif font-medium tracking-tight text-[#231709] leading-[1.12]">
                Freshly Brewed. <br className="hidden sm:inline" />
                Chef Crafted. <br />
                <span className="italic font-normal text-[#C86D51]">Ready to Order.</span>
              </h1>

              {/* Warm narrative paragraph */}
              <p className="text-sm sm:text-base text-[#5D4037] leading-relaxed max-w-xl font-normal">
                From artisan espresso roasts and handcrafted stone pizzas to gourmet grilled burgers and chilled thick shakes, Kittu Cafe brings warmth and restaurant quality together in one beautifully curated dining experience in Shiv Colony, Dausa. Dine in, order online, or reserve your table.
              </p>

              {/* Primary Dual Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href="/menu"
                  className="px-8 py-4 rounded-2xl bg-[#231709] hover:bg-[#3A2619] text-white font-extrabold text-sm flex items-center gap-2.5 transition-transform active:scale-95 shadow-md shadow-[#231709]/20"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D97736]" />
                  <span>Order Online</span>
                </Link>

                <Link
                  href="/menu"
                  className="px-7 py-4 rounded-2xl bg-white/80 hover:bg-white text-[#231709] font-extrabold text-sm flex items-center gap-2 border border-[#231709]/70 transition-all shadow-xs"
                >
                  <span>View Menu</span>
                </Link>

                <a
                  href={BUSINESS_CONFIG.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-4 rounded-2xl text-[#8D6E63] hover:text-[#231709] font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#C86D51]" />
                  <span>Locate Cafe</span>
                </a>
              </div>

              {/* Micro Trust Indicators (Image 2 Style) */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#EBE0D2]/80 text-xs text-[#5D4037] font-semibold">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#C86D51]" />
                  <span>Same-day pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C86D51]" />
                  <span>Local delivery (20–30 min)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  <span>100% Pure Veg</span>
                </div>
              </div>
            </div>

            {/* Right Column: Artisan Food Spread & Floating Today's Specials Card */}
            <div className="lg:col-span-5 relative">
              {/* Main Food Photography Table Spread */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 group">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85"
                  alt="Kittu Cafe Table Spread"
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 text-white pointer-events-none">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                    Artisanal Kitchen
                  </span>
                  <p className="text-sm font-extrabold">Handcrafted with Passion • Dausa</p>
                </div>
              </div>

              {/* Floating "Today's Specials" Card (Image 2 Signature Element) */}
              <div className="hidden sm:block absolute -bottom-6 -right-6 w-64 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#EBE0D2] space-y-3 animate-float">
                <div className="flex items-center justify-between border-b border-[#FAF6F0] pb-2">
                  <span className="text-xs font-serif font-bold text-[#231709] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97736]" />
                    Today's Specials
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Fresh
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Special Item 1 */}
                  <div className="flex items-center gap-2.5 text-xs">
                    <img
                      src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=120&auto=format&fit=crop&q=80"
                      alt="Cappuccino"
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-[#231709] block truncate">Classic Cappuccino</span>
                      <span className="text-[11px] text-[#C86D51] font-extrabold">₹110</span>
                    </div>
                  </div>

                  {/* Special Item 2 */}
                  <div className="flex items-center gap-2.5 text-xs">
                    <img
                      src="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=120&auto=format&fit=crop&q=80"
                      alt="Sandwich"
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-[#231709] block truncate">Paneer Tikka Sandwich</span>
                      <span className="text-[11px] text-[#C86D51] font-extrabold">₹130</span>
                    </div>
                  </div>

                  {/* Special Item 3 */}
                  <div className="flex items-center gap-2.5 text-xs">
                    <img
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&auto=format&fit=crop&q=80"
                      alt="Pizza"
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-[#231709] block truncate">Farmhouse Pizza</span>
                      <span className="text-[11px] text-[#C86D51] font-extrabold">₹220</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/menu"
                  className="block pt-1 text-[11px] font-bold text-[#1B4332] hover:text-emerald-900 flex items-center justify-between border-t border-[#FAF6F0]"
                >
                  <span>Pickup in 20 min</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MENU EXPLORATION SECTION (Inspired by Image 1 Left - Light Theme Cards)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Handcrafted Daily in Shiv Colony</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1F2937] tracking-tight">
              Explore Our Delicious Menu
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
              Tap any dish to view ingredients, calories, chef notes & customize your order.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#1B4332] hover:underline"
          >
            <span>View Full Menu ({MENU_ITEMS.length}+ items)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Pills Slider (Image 1 Style: Deep Green Active Pill) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs ${
                  isSelected
                    ? 'bg-[#1B4332] text-white shadow-md'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Col on Mobile / 4-Col on Desktop Food Grid (Image 1 Style Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredItems.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          CAFE STORY & AMBIANCE SECTION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-[#EBE0D2] p-8 sm:p-12 shadow-[0_10px_35px_rgba(0,0,0,0.04)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">
              The Kittu Cafe Experience
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#231709]">
              Dausa's Cozy Gathering Spot For Handcrafted Flavors
            </h3>
            <p className="text-xs sm:text-sm text-[#5D4037] leading-relaxed">
              Situated in the vibrant neighborhood of Shiv Colony, Kittu Cafe was founded with a simple promise: to brew exceptional coffee, serve warm delicious food prepared with fresh ingredients, and offer a welcoming space for students, families, and friends to connect.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EBE0D2]/60">
                <span className="block text-lg font-black text-[#231709]">100%</span>
                <span className="text-[11px] text-[#5D4037] font-semibold">Pure Vegetarian</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EBE0D2]/60">
                <span className="block text-lg font-black text-[#231709]">10:00 AM</span>
                <span className="text-[11px] text-[#5D4037] font-semibold">To 10:30 PM Daily</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EBE0D2]/60">
                <span className="block text-lg font-black text-[#231709]">4.9 ★</span>
                <span className="text-[11px] text-[#5D4037] font-semibold">Google Rating</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=500&q=80"
              alt="Cafe interior"
              className="rounded-2xl h-44 w-full object-cover shadow-sm"
            />
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80"
              alt="Pouring hot coffee"
              className="rounded-2xl h-44 w-full object-cover shadow-sm mt-4"
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          RESERVATION & TABLE BOOKING BANNER
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#231709] text-white p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97736]">
              Planning a Gathering or Date?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">Book Your Table at Kittu Cafe</h3>
            <p className="text-xs text-[#DFCDB8] max-w-lg">
              Enjoy dedicated hospitality, custom party arrangements, or an intimate booth with fresh brews.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/book-table"
              className="px-6 py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#143326] text-white font-extrabold text-xs shadow-md"
            >
              Reserve a Table
            </Link>
            <a
              href="tel:+919511317456"
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#D97736]" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
