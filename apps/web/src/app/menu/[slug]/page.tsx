'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Flame,
  Clock,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Share2,
  Heart,
  Star,
  ChevronRight,
} from 'lucide-react';
import { IMenuItem } from '@kittu-cafe/shared';
import { formatPrice } from '../../../lib/api';
import { useCartStore } from '../../../store/useCartStore';
import { MENU_ITEMS } from '../../../data/menuData';

const DEMO_ITEMS: Record<string, IMenuItem> = MENU_ITEMS.reduce((acc, it) => {
  const s = it.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  acc[s] = it;
  return acc;
}, {} as Record<string, IMenuItem>);

// Helper to assign cute emoji icons to ingredients
const getIngredientEmoji = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('cheese') || lower.includes('paneer') || lower.includes('mozzarella')) return '🧀';
  if (lower.includes('tomato')) return '🍅';
  if (lower.includes('onion')) return '🧅';
  if (lower.includes('lettuce') || lower.includes('salad') || lower.includes('argula') || lower.includes('spinach')) return '🥬';
  if (lower.includes('egg')) return '🥚';
  if (lower.includes('coffee') || lower.includes('espresso') || lower.includes('arabica')) return '☕';
  if (lower.includes('milk') || lower.includes('cream') || lower.includes('froth')) return '🥛';
  if (lower.includes('bread') || lower.includes('bun') || lower.includes('toast') || lower.includes('crust')) return '🍞';
  if (lower.includes('chocolate') || lower.includes('cocoa') || lower.includes('brownie')) return '🍫';
  if (lower.includes('chili') || lower.includes('jalapeno') || lower.includes('pepper') || lower.includes('spicy')) return '🌶️';
  if (lower.includes('olive') || lower.includes('herbs') || lower.includes('basil') || lower.includes('oregano')) return '🌿';
  if (lower.includes('vanilla') || lower.includes('ice cream') || lower.includes('shake')) return '🍦';
  if (lower.includes('potato') || lower.includes('fries')) return '🥔';
  if (lower.includes('garlic')) return '🧄';
  if (lower.includes('corn')) return '🌽';
  if (lower.includes('butter')) return '🧈';
  return '✨';
};

export default function MenuItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const [item, setItem] = useState<IMenuItem | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (DEMO_ITEMS[slug]) {
      setItem(DEMO_ITEMS[slug]);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    fetch(`${apiUrl}/menu`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.items) {
          const found = data.data.items.find(
            (i: IMenuItem) =>
              i._id === slug ||
              i.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug
          );
          if (found) {
            setItem(found);
          } else {
            setItem(Object.values(DEMO_ITEMS)[0]);
          }
        }
      })
      .catch(() => {
        setItem(Object.values(DEMO_ITEMS)[0]);
      });
  }, [slug]);

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentVariant = item.variants && item.variants.length > 0 ? item.variants[selectedVariantIndex] : null;
  const basePrice = currentVariant ? currentVariant.priceInPaise : item.basePriceInPaise;

  const addOnsTotal = (item.addOnGroups || []).reduce((acc, group) => {
    return (
      acc +
      group.items
        .filter((addon) => selectedAddOns.includes(addon.name))
        .reduce((sum, addon) => sum + addon.priceInPaise, 0)
    );
  }, 0);

  const unitPriceInPaise = basePrice + addOnsTotal;
  const totalPriceInPaise = unitPriceInPaise * quantity;

  const handleAddOnToggle = (addonName: string, maxSelections: number) => {
    if (selectedAddOns.includes(addonName)) {
      setSelectedAddOns(selectedAddOns.filter((name) => name !== addonName));
    } else {
      if (maxSelections === 1) {
        const group = item.addOnGroups?.find((g) => g.items.some((i) => i.name === addonName));
        const siblingNames = group?.items.map((i) => i.name) || [];
        const filtered = selectedAddOns.filter((name) => !siblingNames.includes(name));
        setSelectedAddOns([...filtered, addonName]);
      } else {
        setSelectedAddOns([...selectedAddOns, addonName]);
      }
    }
  };

  const handleAddToCart = () => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      selectedVariantName: currentVariant?.name,
      selectedAddOnNames: selectedAddOns,
      unitPriceInPaise,
      quantity,
      imageUrl: item.imageUrl,
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleOrderNow = () => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      selectedVariantName: currentVariant?.name,
      selectedAddOnNames: selectedAddOns,
      unitPriceInPaise,
      quantity,
      imageUrl: item.imageUrl,
    });
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const displayIngredients =
    item.ingredients && item.ingredients.length > 0
      ? item.ingredients
      : ['Fresh Paneer', 'Crisp Salad', 'Vine Tomatoes', 'Artisanal Herbs', 'Olive Dressing'];

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header & Breadcrumbs (Image 1 Style: Back arrow + Heart) */}
        <div className="flex items-center justify-between">
          <Link
            href="/menu"
            className="w-10 h-10 rounded-full bg-white border border-stone-200 text-stone-700 flex items-center justify-center transition-transform active:scale-95 shadow-xs"
            title="Back to menu"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </Link>

          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Kittu Cafe Artisanal Selection
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center transition-transform active:scale-95 shadow-xs cursor-pointer"
              title="Save to favorites"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isLiked
                    ? 'fill-[#1B4332] text-[#1B4332]'
                    : 'text-stone-400 hover:text-[#1B4332]'
                }`}
              />
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white border border-stone-200 text-stone-500 hover:text-[#1B4332] flex items-center justify-center shadow-xs cursor-pointer relative"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
              {isCopied && (
                <span className="absolute -bottom-8 right-0 bg-[#231709] text-white text-[10px] py-1 px-2 rounded shadow-md whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Item Card (Image 1 Style Light Theme) */}
        <div className="bg-white rounded-[32px] border border-stone-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Centered Hero Dish Photography */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center">
              <div className="absolute inset-4 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>100% Pure Veg • Artisanal Recipe</span>
            </div>
          </div>

          {/* Right Column: Dish Info, Details, Ingredients & Actions */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl sm:text-4xl font-black text-[#1F2937] tracking-tight">
                  {item.name}
                </h1>

                {/* Quantity Pill Counter */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 rounded-full bg-white text-[#1B4332] flex items-center justify-center font-bold shadow-xs hover:bg-stone-50 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-black text-[#1F2937] min-w-[16px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold shadow-xs hover:bg-[#143326] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{item.rating || 4.8}</span>
                  </div>
                  <span className="text-xs text-stone-400">({item.ratingCount || 150}+)</span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {item.preparationTimeMinutes || 10}m prep
                  </span>
                </div>

                <span className="text-2xl sm:text-3xl font-black text-[#1F2937]">
                  {formatPrice(totalPriceInPaise)}
                </span>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">
                Details
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {item.description ||
                  'Carefully prepared by master chefs using premium single-origin spices and fresh produce in Shiv Colony, Dausa.'}
              </p>
            </div>

            {/* Ingredients Section (Image 1 Style Emojis & Pills) */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-400">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {displayIngredients.map((ing) => (
                  <div
                    key={ing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs"
                  >
                    <span>{getIngredientEmoji(ing)}</span>
                    <span>{ing}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Variants */}
            {item.variants && item.variants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-400">
                  Select Size
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {item.variants.map((v, idx) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex justify-between items-center transition-all cursor-pointer ${
                        selectedVariantIndex === idx
                          ? 'border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332] ring-1 ring-[#1B4332]'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="font-extrabold">{formatPrice(v.priceInPaise)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dual Bottom Actions (Image 1 Style: ORDER NOW + ADD TO CART) */}
            <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
              <button
                type="button"
                onClick={handleOrderNow}
                className="flex-1 py-4 px-4 rounded-2xl border-2 border-[#1B4332] text-[#1B4332] font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-[#1B4332]/5 transition-colors cursor-pointer text-center"
              >
                ORDER NOW
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
                className="flex-1 py-4 px-4 rounded-2xl bg-[#1B4332] hover:bg-[#143326] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer text-center"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>ADDED!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>ADD TO CART</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
