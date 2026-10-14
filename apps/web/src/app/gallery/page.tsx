'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Coffee,
  Sparkles,
  ArrowRight,
  Maximize2,
  X,
  ExternalLink,
  Flame,
  UtensilsCrossed,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'coffee' | 'beverages' | 'food' | 'ambiance';
  title: string;
  subtitle: string;
  tag: string;
  gradient: string;
  badgeColor: string;
  orderLink?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    category: 'coffee',
    title: 'Artisanal Latte Art & Cappuccino',
    subtitle: 'Micro-textured steamed foam poured over single-origin espresso.',
    tag: 'Coffee Bar',
    gradient: 'from-[#5D4037] via-[#3E2723] to-[#231709]',
    badgeColor: 'bg-amber-100 text-amber-900',
    orderLink: '/menu/classic-handcrafted-cappuccino',
  },
  {
    id: 'g2',
    category: 'beverages',
    title: 'Kittu Hazelnut Thick Frappe',
    subtitle: 'Blended with roasted hazelnut syrup, cream, and Belgian chocolate drip.',
    tag: 'Cold Brews',
    gradient: 'from-[#C86D51] via-[#D97736] to-[#4E342E]',
    badgeColor: 'bg-orange-100 text-orange-900',
    orderLink: '/menu/kittu-hazelnut-cold-coffee',
  },
  {
    id: 'g3',
    category: 'food',
    title: 'Stone-Baked Farmhouse Pizza',
    subtitle: 'Loaded with bell peppers, sweet corn, olives, and fresh mozzarella.',
    tag: 'Italian Oven',
    gradient: 'from-[#B71C1C] via-[#880E4F] to-[#311B92]',
    badgeColor: 'bg-rose-100 text-rose-900',
    orderLink: '/menu/veg-loaded-farmhouse-pizza',
  },
  {
    id: 'g4',
    category: 'food',
    title: 'Grilled Paneer Tikka Multigrain Sandwich',
    subtitle: 'Charred tandoori paneer slices with mint chutney & melted cheese.',
    tag: 'Gourmet Sandwiches',
    gradient: 'from-[#E65100] via-[#BF360C] to-[#3E2723]',
    badgeColor: 'bg-emerald-100 text-emerald-900',
    orderLink: '/menu/grilled-paneer-tikka-sandwich',
  },
  {
    id: 'g5',
    category: 'ambiance',
    title: 'Warm Wooden Interiors & Cozy Booths',
    subtitle: 'Ideal for romantic dates, family celebrations, and remote work.',
    tag: 'Cafe Atmosphere',
    gradient: 'from-[#231709] via-[#3E2723] to-[#1A1006]',
    badgeColor: 'bg-stone-200 text-stone-900',
    orderLink: '/book-table',
  },
  {
    id: 'g6',
    category: 'beverages',
    title: 'Chilled Energy Boosters & Mocktails',
    subtitle: 'Red Bull Tropical Infusions, Virgin Mojitos & Blue Curacao fizzers.',
    tag: 'Beverage Lounge',
    gradient: 'from-[#0D47A1] via-[#01579B] to-[#004D40]',
    badgeColor: 'bg-cyan-100 text-cyan-900',
    orderLink: '/menu',
  },
  {
    id: 'g7',
    category: 'food',
    title: 'Crispy Peri Peri French Fries & Cheesy Dip',
    subtitle: 'Golden fries dusted in hot African peri peri seasoning.',
    tag: 'Quick Bites',
    gradient: 'from-[#D84315] via-[#E64A19] to-[#BF360C]',
    badgeColor: 'bg-amber-100 text-amber-900',
    orderLink: '/menu',
  },
  {
    id: 'g8',
    category: 'coffee',
    title: 'Velvet Espresso Shots & Mocha',
    subtitle: 'Rich 100% Arabica crema extracted under 9 bars of pressure.',
    tag: 'Espresso Bar',
    gradient: 'from-[#3E2723] via-[#4E342E] to-[#231709]',
    badgeColor: 'bg-amber-100 text-amber-900',
    orderLink: '/menu',
  },
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'coffee' | 'beverages' | 'food' | 'ambiance'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filteredItems = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">
          Visual Experience
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#231709] tracking-tight">
          Kittu Cafe Photo Gallery
        </h1>
        <p className="text-xs sm:text-sm text-[#5D4037] max-w-xl">
          Take a look at our artisanal coffees, mouth-watering kitchen dishes, refreshing beverages, and cozy cafe vibes in Dausa, Rajasthan.
        </p>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'coffee', label: 'Coffee & Espresso' },
            { id: 'beverages', label: 'Beverages & Shakes' },
            { id: 'food', label: 'Pizzas & Sandwiches' },
            { id: 'ambiance', label: 'Ambiance & Seating' },
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'btn-3d-primary text-white scale-102'
                    : 'bg-white text-[#4E342E] hover:bg-[#FAF6F0] border border-[#EBE0D2] shadow-3d'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-3xl overflow-hidden border border-[#EBE0D2] bg-white shadow-3d shadow-3d-hover transition-all duration-300 flex flex-col justify-between"
          >
            {/* Visual Box */}
            <div
              className={`h-56 w-full bg-gradient-to-br ${item.gradient} p-5 flex flex-col justify-between text-white relative cursor-pointer`}
              onClick={() => setSelectedPhoto(item)}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.badgeColor}`}>
                  {item.tag}
                </span>
                <button
                  type="button"
                  className="w-8 h-8 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Expand photo"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="my-auto text-center">
                <Coffee className="w-12 h-12 mx-auto opacity-70 group-hover:scale-110 transition-transform" />
              </div>

              <div className="text-[11px] font-medium text-white/80">
                Click to expand
              </div>
            </div>

            {/* Info and action */}
            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-extrabold text-sm text-[#231709] tracking-tight group-hover:text-[#C86D51] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6D4C41] mt-1 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              {item.orderLink && (
                <div className="pt-2 border-t border-[#FAF6F0]">
                  <Link
                    href={item.orderLink}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-[#D97736] hover:underline"
                  >
                    <span>Order / Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FFFEFA] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-white/20 relative">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`h-80 w-full bg-gradient-to-br ${selectedPhoto.gradient} flex flex-col items-center justify-center text-white p-8 relative`}>
              <Coffee className="w-20 h-20 opacity-80" />
              <span className="mt-4 text-xs font-black uppercase tracking-widest text-white/90">
                Kittu Cafe • Dausa, Rajasthan
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${selectedPhoto.badgeColor} mb-2`}>
                  {selectedPhoto.tag}
                </span>
                <h2 className="text-xl font-black text-[#231709]">{selectedPhoto.title}</h2>
                <p className="text-xs sm:text-sm text-[#5D4037] mt-1 leading-relaxed">
                  {selectedPhoto.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EBE0D2]">
                <span className="text-xs text-stone-500 font-medium">Shiv Colony, Mariyara Wale, Dausa</span>
                {selectedPhoto.orderLink && (
                  <Link
                    href={selectedPhoto.orderLink}
                    onClick={() => setSelectedPhoto(null)}
                    className="px-5 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View / Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
