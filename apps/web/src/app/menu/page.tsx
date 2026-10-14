'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ShoppingBag, Coffee, ArrowRight, Sparkles, Eye, Info } from 'lucide-react';
import { IMenuItem, IMenuCategory } from '@kittu-cafe/shared';
import { ProductCard } from '../../components/ProductCard';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../lib/api';
import { MENU_CATEGORIES, MENU_ITEMS } from '../../data/menuData';

export default function MenuPage() {
  const [categories, setCategories] = useState<IMenuCategory[]>(MENU_CATEGORIES);
  const [items, setItems] = useState<IMenuItem[]>(MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non_veg'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');

  const cartItems = useCartStore((state) => state.items);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPaise = useCartStore((state) => state.subtotalInPaise)();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    fetch(`${apiUrl}/menu`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.categories?.length > 0) {
            setCategories([{ _id: 'all', name: 'All Categories', sortOrder: 0, isActive: true }, ...data.data.categories]);
          }
          if (data.data.items?.length > 0) {
            // Merge with local rich items so high-def images and culinary details are always present
            const backendItems: IMenuItem[] = data.data.items.map((bItem: any) => {
              const matchedLocal = MENU_ITEMS.find((local) => local.name.toLowerCase() === bItem.name.toLowerCase());
              return {
                ...bItem,
                imageUrl: bItem.imageUrl || matchedLocal?.imageUrl || MENU_ITEMS[0].imageUrl,
                ingredients: bItem.ingredients || matchedLocal?.ingredients,
                spiceLevel: bItem.spiceLevel || matchedLocal?.spiceLevel,
                calories: bItem.calories || matchedLocal?.calories,
                rating: bItem.rating || matchedLocal?.rating || 4.9,
                ratingCount: bItem.ratingCount || matchedLocal?.ratingCount || 150,
                chefNote: bItem.chefNote || matchedLocal?.chefNote,
                servingSize: bItem.servingSize || matchedLocal?.servingSize,
              };
            });
            setItems(backendItems);
          }
        }
      })
      .catch(() => {
        // Fallback to local high-def MENU_ITEMS
        setItems(MENU_ITEMS);
      });
  }, []);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (selectedCategory !== 'all') {
          const catId = typeof item.categoryId === 'string' ? item.categoryId : (item.categoryId as any)?._id;
          if (catId !== selectedCategory) return false;
        }
        if (dietaryFilter !== 'all' && item.dietaryType !== dietaryFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = (item.description || '').toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.basePriceInPaise - b.basePriceInPaise;
        if (sortBy === 'price_desc') return b.basePriceInPaise - a.basePriceInPaise;
        return 0;
      });
  }, [items, selectedCategory, dietaryFilter, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-32">
      {/* Header with 3D Styling */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#C86D51] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D97736]" />
            Artisanal Selection • Dausa, Rajasthan
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#231709] tracking-tight mt-1">
            Kittu Cafe Digital Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#5D4037] font-medium max-w-xl mt-1.5">
            Freshly prepared gourmet dishes & specialty coffees. Click any dish to view full culinary details, ingredients, calories & Chef's notes.
          </p>
        </div>

        {/* 3D Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          {/* 3D Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#5D4037] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cappuccino, pizza, paneer tikka, fries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#EBE0D2] bg-white text-sm focus:outline-none focus:border-[#D97736] shadow-3d"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
            {/* Pure Veg 3D Pill */}
            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-md ring-2 ring-emerald-200'
                  : 'bg-white border-[#EBE0D2] text-[#4E342E] shadow-3d hover:bg-[#FAF6F0]'
              }`}
            >
              <div className="w-3.5 h-3.5 border-2 border-emerald-600 rounded-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
              </div>
              <span>Pure Veg Only</span>
            </button>

            {/* Sort Selector with 3D bevel */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold border border-[#EBE0D2] bg-white text-[#4E342E] focus:outline-none shadow-3d cursor-pointer"
            >
              <option value="default">Sort: Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 3D Category Pills Slider */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none pt-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'btn-3d-primary text-white scale-102'
                    : 'bg-white text-[#4E342E] hover:bg-[#FAF6F0] border border-[#EBE0D2] shadow-3d'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-24 text-center space-y-3 bg-[#FFFEFA] rounded-3xl border border-[#EBE0D2] shadow-3d">
          <Coffee className="w-12 h-12 text-[#C86D51] mx-auto opacity-70" />
          <h3 className="text-base font-bold text-[#231709]">No dishes found</h3>
          <p className="text-xs text-[#5D4037]">Try modifying your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {/* 3D Sticky Floating Order Bar */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 z-40 animate-slide-up">
          <Link
            href="/cart"
            className="flex items-center justify-between p-4 rounded-2xl btn-3d-primary text-white cursor-pointer shadow-2xl border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D97736] flex items-center justify-center font-black text-sm text-white shadow-xs">
                {totalItemCount}
              </div>
              <div>
                <span className="block text-[11px] font-medium text-[#DFCDB8]">Current Cart</span>
                <span className="text-base font-black text-white">{formatPrice(subtotalPaise)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#D97736] uppercase tracking-wider">
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
