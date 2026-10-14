'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ShoppingBag, Coffee, ArrowRight, Sparkles } from 'lucide-react';
import { IMenuItem, IMenuCategory } from '@kittu-cafe/shared';
import { ProductCard } from '../../components/ProductCard';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../lib/api';

const DEFAULT_CATEGORIES: IMenuCategory[] = [
  { _id: 'all', name: 'All Categories', sortOrder: 0, isActive: true },
  { _id: 'c1', name: 'Hot & Cold Coffee', sortOrder: 1, isActive: true },
  { _id: 'c2', name: 'Burgers & Sandwiches', sortOrder: 2, isActive: true },
  { _id: 'c3', name: 'Pizzas & Garlic Breads', sortOrder: 3, isActive: true },
  { _id: 'c4', name: 'Snacks & Sides', sortOrder: 4, isActive: true },
  { _id: 'c5', name: 'Desserts & Shakes', sortOrder: 5, isActive: true },
];

const DEFAULT_ITEMS: IMenuItem[] = [
  {
    _id: 'seed-coffee-1',
    name: 'Classic Handcrafted Cappuccino',
    description: 'Rich double-shot espresso topped with velvet steamed milk froth.',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&auto=format&fit=crop&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    categoryId: 'c2',
    basePriceInPaise: 13000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 12,
    variants: [],
    addOnGroups: [
      {
        title: 'Add-ons',
        minSelections: 0,
        maxSelections: 2,
        items: [{ name: 'Extra Cheese Slice', priceInPaise: 2500 }],
      },
    ],
  },
  {
    _id: 'seed-burger-1',
    name: 'Crispy Veg Supreme Burger',
    description: 'Spiced potato & herb patty with crisp lettuce, sliced tomato, cheese, and special cafe dressing.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    categoryId: 'c2',
    basePriceInPaise: 12000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 10,
    variants: [
      { name: 'Single Patty', priceInPaise: 12000, isDefault: true },
      { name: 'Double Patty & Cheese', priceInPaise: 16000 },
    ],
    addOnGroups: [],
  },
  {
    _id: 'seed-pizza-1',
    name: 'Veg Loaded Farmhouse Pizza',
    description: 'Crispy base loaded with fresh mozzarella, capsicum, red onions, mushrooms, and sweet corn.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
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
  {
    _id: 'seed-snacks-1',
    name: 'Peri Peri Masala Fries',
    description: 'Crispy golden potato fries tossed in fiery African peri peri spice blend.',
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
    categoryId: 'c4',
    basePriceInPaise: 9000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: false,
    isBestseller: true,
    preparationTimeMinutes: 8,
    variants: [],
    addOnGroups: [
      {
        title: 'Dips',
        minSelections: 0,
        maxSelections: 2,
        items: [
          { name: 'Cheesy Jalapeno Dip', priceInPaise: 2500 },
          { name: 'Tandoori Mayo Dip', priceInPaise: 2000 },
        ],
      },
    ],
  },
  {
    _id: 'seed-dessert-1',
    name: 'Sizzling Brownie with Vanilla',
    description: 'Warm fudge brownie served sizzling with rich chocolate sauce and cold vanilla ice cream.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    categoryId: 'c5',
    basePriceInPaise: 15000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    preparationTimeMinutes: 10,
    variants: [],
    addOnGroups: [],
  },
  {
    _id: 'seed-dessert-2',
    name: 'Belgian Chocolate Thick Shake',
    description: 'Rich dark chocolate ganache blended with premium dairy cream and ice cream.',
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    categoryId: 'c5',
    basePriceInPaise: 16000,
    dietaryType: 'veg',
    isAvailable: true,
    isFeatured: true,
    isBestseller: false,
    preparationTimeMinutes: 7,
    variants: [],
    addOnGroups: [],
  },
];

export default function MenuPage() {
  const [categories, setCategories] = useState<IMenuCategory[]>(DEFAULT_CATEGORIES);
  const [items, setItems] = useState<IMenuItem[]>(DEFAULT_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non_veg'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');

  const cartItems = useCartStore((state) => state.items);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPaise = useCartStore((state) => state.subtotalInPaise)();

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.categories?.length > 0) {
            setCategories([{ _id: 'all', name: 'All Categories', sortOrder: 0, isActive: true }, ...data.data.categories]);
          }
          if (data.data.items?.length > 0) {
            setItems(data.data.items);
          }
        }
      })
      .catch(() => {});
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-9 pb-32">
      {/* Header with 3D Styling */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">
            Artisanal Selection
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#231709] tracking-tight">
            Kittu Cafe Digital Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#5D4037] font-medium max-w-xl">
            Freshly prepared food & beverage items. All prices calculated with minor-unit accuracy.
          </p>
        </div>

        {/* 3D Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          {/* 3D Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#5D4037] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coffee, sandwich, pizza, fries..."
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
