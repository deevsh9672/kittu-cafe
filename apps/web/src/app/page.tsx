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
  ChevronRight,
  Utensils,
  Plus,
} from 'lucide-react';
import { BUSINESS_CONFIG, IMenuItem } from '@kittu-cafe/shared';
import { ProductCard } from '../components/ProductCard';
import { useCartStore } from '../store/useCartStore';

import { MENU_ITEMS } from '../data/menuData';

const DEFAULT_FEATURED: IMenuItem[] = MENU_ITEMS.filter((item) => item.isFeatured || item.isBestseller);

const CATEGORIES = [
  { id: 'all', label: 'All Specialties' },
  { id: 'c1', label: '☕ Artisanal Coffee' },
  { id: 'c2', label: '🥪 Burgers & Sandwiches' },
  { id: 'c3', label: '🍕 Stone Pizzas' },
  { id: 'c4', label: '🍟 Snacks & Sides' },
  { id: 'c5', label: '🍨 Shakes & Desserts' },
];

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<IMenuItem[]>(DEFAULT_FEATURED);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/menu?isFeatured=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.items?.length > 0) {
          // Merge with high-def default images if incoming backend data is missing images
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

  const filteredItems = selectedCategory === 'all'
    ? featuredItems
    : featuredItems.filter((item) => item.categoryId === selectedCategory);

  const spotlightItem = featuredItems[spotlightIndex] || featuredItems[0];

  const handleSpotlightAdd = () => {
    if (!spotlightItem) return;
    addItem({
      menuItemId: spotlightItem._id,
      name: spotlightItem.name,
      unitPriceInPaise: spotlightItem.basePriceInPaise,
      quantity: 1,
      imageUrl: spotlightItem.imageUrl,
    });
  };

  return (
    <div className="space-y-20 pb-28">
      {/* 3D Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF4EC] via-[#FFFDF9] to-[#FAF6F0] pt-12 pb-20 border-b border-[#EBE0D2]/80">
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
                Your Favourite Flavours,{' '}
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97736] to-[#C86D51]">
                  All in One Place.
                  <span className="absolute left-0 bottom-1 w-full h-2 bg-[#D97736]/20 -z-10 rounded-full" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#5D4037] leading-relaxed max-w-xl font-medium">
                Experience warm cafe luxury in Dausa. Freshly roasted arabica espresso blends, gourmet grilled sandwiches, sizzling farm pizzas, and chilled energy drinks.
              </p>

              {/* 3D Tactile Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/menu"
                  className="px-7 py-4 rounded-2xl btn-3d-primary text-white font-extrabold text-sm flex items-center gap-2.5 cursor-pointer shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D97736]" />
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>

                <Link
                  href="/menu"
                  className="px-6 py-4 rounded-2xl btn-3d-accent text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Order Now</span>
                </Link>

                <a
                  href={BUSINESS_CONFIG.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-2xl btn-3d-light text-[#231709] font-extrabold text-sm flex items-center gap-2 border border-[#EBE0D2] cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#C86D51]" />
                  <span>Get Directions</span>
                </a>
              </div>

              {/* 3D Elevated Feature Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#EBE0D2]/70">
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

            {/* Right Column: 3D Interactive Signature Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* 3D Decorative Floating Glow */}
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-3xl bg-gradient-to-br from-[#D97736] to-[#C86D51] opacity-25 blur-2xl animate-float pointer-events-none" />

                {/* 3D Showcase Panel */}
                <div className="rounded-3xl glass-dark-3d p-6 sm:p-7 text-white space-y-5 animate-float relative overflow-hidden shadow-2xl border border-white/10">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D97736] to-[#C86D51] flex items-center justify-center text-white shadow-lg">
                        <Coffee className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white tracking-tight leading-tight">
                          Chef's 3D Spotlight
                        </h3>
                        <p className="text-[10px] text-[#DFCDB8]">Freshly Crafted in Shiv Colony</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Open Now
                    </span>
                  </div>

                  {/* 3D Dish Image with Floating Badges */}
                  <div className="relative rounded-2xl overflow-hidden h-52 bg-black/40 border border-white/10 group">
                    <img
                      src={spotlightItem.imageUrl}
                      alt={spotlightItem.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Steam Badge Animation */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-300 flex items-center gap-1.5 animate-steam">
                      <span>♨️</span>
                      <span>Freshly Prepared</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#D97736] text-white text-[10px] font-black tracking-wider uppercase shadow-md">
                      ₹{spotlightItem.basePriceInPaise / 100}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <h4 className="font-black text-base text-white drop-shadow-md truncate">
                        {spotlightItem.name}
                      </h4>
                      <p className="text-[11px] text-white/80 line-clamp-1">
                        {spotlightItem.description}
                      </p>
                    </div>
                  </div>

                  {/* Dish Selector Thumbnails */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] font-bold text-[#DFCDB8] uppercase tracking-wider">
                      Quick Switch:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {featuredItems.slice(0, 4).map((item, idx) => (
                        <button
                          key={item._id}
                          onClick={() => setSpotlightIndex(idx)}
                          className={`w-8 h-8 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                            spotlightIndex === idx
                              ? 'border-[#D97736] scale-110 ring-2 ring-[#D97736]/50 shadow-md'
                              : 'border-white/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Add CTA */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleSpotlightAdd}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D97736] to-[#C86D51] text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Order (₹{spotlightItem.basePriceInPaise / 100})</span>
                    </button>
                    <Link
                      href="/menu"
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
                      title="View all dishes"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Category Interactive Filter & Featured Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBECE7] border border-[#E6866B]/30 text-xs font-bold uppercase tracking-wider text-[#C86D51] mb-2">
              <Flame className="w-3.5 h-3.5 text-[#D97736] fill-[#D97736]" />
              <span>Customer Favorites & 3D Cards</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231709] tracking-tight">
              Kittu Cafe Handcrafted Menu
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

        {/* Category Filter Pills with Smooth Scroll */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 no-scrollbar mb-8">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'btn-3d-primary text-white shadow-md scale-102'
                    : 'bg-white border border-[#EBE0D2] text-[#5D4037] hover:border-[#D97736] shadow-xs'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 3D Elevated Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      </section>

      {/* Coffee & Beverage Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#1E140B] via-[#2D1B10] to-[#1E140B] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-[#D97736]/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full bg-[#D97736]/20 text-[#D97736] text-xs font-black uppercase tracking-wider border border-[#D97736]/40">
                Crafted Sips & Chilled Brews
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
                From Double-Shot Espressos to Ice-Cold Energy Chills
              </h3>
              <p className="text-sm text-[#DFCDB8] leading-relaxed">
                Whether you need a refreshing Red Bull, an ice-cold Coke, or our signature hand-beaten Hazelnut Frappe, every drink at Kittu Cafe is served at the perfect temperature.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/menu?category=c1"
                  className="px-5 py-3 rounded-xl btn-3d-accent text-white text-xs font-bold inline-flex items-center gap-2"
                >
                  <Coffee className="w-4 h-4 text-amber-200" />
                  <span>Explore Coffee & Beverages</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                <img
                  src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
                  alt="Iced Cold Coffee"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="bg-[#120B06] p-2.5 text-center">
                  <span className="text-xs font-extrabold text-white block">Cold Coffee Frappe</span>
                  <span className="text-[10px] text-[#D97736] font-bold">₹140</span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                <img
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"
                  alt="Chilled Beverages"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="bg-[#120B06] p-2.5 text-center">
                  <span className="text-xs font-extrabold text-white block">Red Bull & Cold Drinks</span>
                  <span className="text-[10px] text-[#D97736] font-bold">Chilled Cans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">
            Guest Love & Feedback
          </span>
          <h2 className="text-3xl font-black text-[#231709]">What Dausa Loves About Kittu Cafe</h2>
          <span className="text-[11px] text-[#8D6E63] font-bold block">[Verified Regular Guests • Shiv Colony Dausa]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#EBE0D2] shadow-3d space-y-3 card-3d-tilt">
            <div className="flex items-center gap-1 text-amber-500">★★★★★</div>
            <p className="text-xs text-[#5D4037] leading-relaxed italic">
              "Best cold coffee in Dausa! The ambiance in Shiv Colony is super cozy and the hazelnut frappe is genuinely premium."
            </p>
            <div className="pt-2 border-t border-[#EBE0D2]">
              <span className="text-xs font-black text-[#231709] block">Rohit Sharma</span>
              <span className="text-[10px] text-[#8D6E63]">Dausa Resident • Regular Guest</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#EBE0D2] shadow-3d space-y-3 card-3d-tilt">
            <div className="flex items-center gap-1 text-amber-500">★★★★★</div>
            <p className="text-xs text-[#5D4037] leading-relaxed italic">
              "Their farmhouse pizza and grilled paneer tikka sandwich are amazing. Fast preparation and courteous staff."
            </p>
            <div className="pt-2 border-t border-[#EBE0D2]">
              <span className="text-xs font-black text-[#231709] block">Pooja Meena</span>
              <span className="text-[10px] text-[#8D6E63]">Foodie • Verified Dine-in</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#EBE0D2] shadow-3d space-y-3 card-3d-tilt">
            <div className="flex items-center gap-1 text-amber-500">★★★★★</div>
            <p className="text-xs text-[#5D4037] leading-relaxed italic">
              "Ordered takeaway online; packaging was intact, drinks were icy cold and the sizzling brownie was top notch."
            </p>
            <div className="pt-2 border-t border-[#EBE0D2]">
              <span className="text-xs font-black text-[#231709] block">Vikram Singh</span>
              <span className="text-[10px] text-[#8D6E63]">Online Order Customer</span>
            </div>
          </div>
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
                  className="px-5 py-3 rounded-xl btn-3d-primary text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
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
