'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Coffee,
  ArrowRight,
  Sparkles,
  User,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { IMenuItem, IMenuCategory } from '@kittu-cafe/shared';
import { ProductCard } from '../../components/ProductCard';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatPrice } from '../../lib/api';
import { MENU_CATEGORIES, MENU_ITEMS } from '../../data/menuData';

// Category icons helper for Image 1 style
const getCategoryIcon = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('all')) return '✨';
  if (lower.includes('coffee') || lower.includes('hot') || lower.includes('cold')) return '☕';
  if (lower.includes('burger') || lower.includes('sandwich')) return '🍔';
  if (lower.includes('pizza') || lower.includes('garlic')) return '🍕';
  if (lower.includes('snack') || lower.includes('fries') || lower.includes('momo') || lower.includes('pasta')) return '🍟';
  if (lower.includes('dessert') || lower.includes('shake') || lower.includes('waffle')) return '🍨';
  return '🍽️';
};

export default function MenuPage() {
  const [categories, setCategories] = useState<IMenuCategory[]>(MENU_CATEGORIES);
  const [items, setItems] = useState<IMenuItem[]>(MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non_veg'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');

  const { user } = useAuthStore();
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
            setCategories([
              { _id: 'all', name: 'All', sortOrder: 0, isActive: true },
              ...data.data.categories,
            ]);
          }
          if (data.data.items?.length > 0) {
            const backendItems: IMenuItem[] = data.data.items.map((bItem: any) => {
              const matchedLocal = MENU_ITEMS.find(
                (local) => local.name.toLowerCase() === bItem.name.toLowerCase()
              );
              return {
                ...bItem,
                imageUrl: bItem.imageUrl || matchedLocal?.imageUrl || MENU_ITEMS[0].imageUrl,
                ingredients: bItem.ingredients || matchedLocal?.ingredients,
                spiceLevel: bItem.spiceLevel || matchedLocal?.spiceLevel,
                calories: bItem.calories || matchedLocal?.calories,
                rating: bItem.rating || matchedLocal?.rating || 4.8,
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

  const userName = user?.name ? user.name.split(' ')[0] : 'Guest';

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* =========================================================================
            TOP USER GREETING & HEADER (Image 1 Style: Avatar + Hi, David)
           ========================================================================= */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-500 block">Welcome Back</span>
              <h2 className="text-base sm:text-lg font-black text-[#1F2937] leading-none">
                Hi, {userName} 👋
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-[#1B4332] shadow-xs"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1B4332] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* =========================================================================
            PAGE TITLE & SEARCH BAR WITH FILTER BUTTON (Image 1 Style)
           ========================================================================= */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-4xl font-black text-[#1F2937] tracking-tight">
            Explore Our Delicious Menu
          </h1>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search burger, pizza, cappuccino, fries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-stone-200 text-sm font-medium text-[#1F2937] placeholder:text-stone-400 focus:outline-none focus:border-[#1B4332] shadow-xs"
              />
            </div>

            {/* Filter Toggle Button (Image 1 Style: Green Icon Button) */}
            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                dietaryFilter === 'veg'
                  ? 'bg-[#1B4332] text-white ring-2 ring-[#1B4332]/30'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
              title="Toggle Pure Veg Only"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            CATEGORIES SLIDER (Image 1 Style: Deep Green Active Pill)
           ========================================================================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
            <span>Categories</span>
            <span>{filteredItems.length} items</span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat._id;
              const icon = getCategoryIcon(cat.name);
              const displayName = cat.name.replace('All Categories', 'All');

              return (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs ${
                    isSelected
                      ? 'bg-[#1B4332] text-white shadow-md'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{displayName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            PRODUCT GRID (Image 1 Style: 2 Col Mobile, 4 Col Desktop)
           ========================================================================= */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-stone-200 shadow-xs">
            <Coffee className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-700">No dishes found</h3>
            <p className="text-xs text-stone-400">Try modifying your search or choosing a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredItems.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* =========================================================================
            STICKY FLOATING CART BAR
           ========================================================================= */}
        {totalItemCount > 0 && (
          <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 z-40 animate-slide-up">
            <Link
              href="/cart"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#1B4332] text-white cursor-pointer shadow-2xl border border-white/20 transition-transform active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm text-white">
                  {totalItemCount}
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-emerald-200">Total in Cart</span>
                  <span className="text-base font-black text-white">{formatPrice(subtotalPaise)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-white text-[#1B4332] px-3.5 py-2 rounded-xl shadow-xs">
                <span>View Cart</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
