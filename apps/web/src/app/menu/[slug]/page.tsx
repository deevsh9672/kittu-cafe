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
    // 1. Check local demo mock dict by slug
    if (DEMO_ITEMS[slug]) {
      setItem(DEMO_ITEMS[slug]);
      return;
    }

    // 2. Or try fetching from backend API
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
            // Fallback to first demo item
            setItem(Object.values(DEMO_ITEMS)[0]);
          }
        }
      })
      .catch(() => {
        // Fallback default
        setItem(Object.values(DEMO_ITEMS)[0]);
      });
  }, [slug]);

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D97736] border-t-transparent rounded-full animate-spin" />
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
        // Remove siblings from same group
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
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5D4037]">
          <Link href="/menu" className="hover:text-[#D97736] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Digital Menu</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <span className="text-[#231709] line-clamp-1">{item.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-xl border border-[#EBE0D2] bg-white transition-colors cursor-pointer ${
              isLiked ? 'text-rose-500 fill-rose-500' : 'text-stone-500 hover:text-rose-500'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-[#EBE0D2] bg-white text-stone-500 hover:text-[#D97736] transition-colors cursor-pointer relative"
            title="Share item link"
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

      {/* Main Item Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Visual Dish Presentation */}
        <div className="space-y-4">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#FAF6F0] via-white to-[#F5EBE1] border border-[#EBE0D2] p-8 aspect-square flex flex-col justify-between shadow-3d overflow-hidden">
            {/* Background Aesthetic Watermark */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#D97736]/5 blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                {item.dietaryType === 'veg' ? (
                  <div className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-600" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md bg-rose-50 border border-rose-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-rose-600" />
                  </div>
                )}
                {item.isBestseller && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-[#FBECE7] to-[#F7D8CE] text-[#C86D51] border border-[#E6866B]/30 shadow-xs">
                    <Flame className="w-3.5 h-3.5 text-[#D97736] fill-[#D97736]" />
                    Bestseller
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/90 border border-[#EBE0D2] text-xs font-bold text-[#5D4037] shadow-xs">
                <Clock className="w-3.5 h-3.5 text-[#D97736]" />
                <span>{item.preparationTimeMinutes || 10} mins prep</span>
              </div>
            </div>

            {/* Dish Image or Icon Representation */}
            <div className="my-auto text-center space-y-3 relative z-10 py-4">
              {item.imageUrl ? (
                <div className="w-56 h-56 mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-[#D97736] to-[#C86D51] flex items-center justify-center text-white shadow-xl shadow-[#D97736]/20 border-2 border-white">
                  <Sparkles className="w-14 h-14" />
                </div>
              )}
              <h2 className="text-xl font-black text-[#231709] tracking-tight">{item.name}</h2>
              <span className="inline-block text-xs font-bold text-[#D97736] tracking-wider uppercase">
                Artisanal Kitchen • Kittu Cafe Dausa
              </span>
            </div>

            {/* Quality Badges */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#EBE0D2]/80 relative z-10">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5D4037]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Fresh Daily Prep</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5D4037]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hygienic FSSAI Kitchen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customization & Ordering Form */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-[#C86D51] uppercase tracking-wider">
              Item Details & Customization
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
              {item.name}
            </h1>
            <p className="text-sm text-[#5D4037] mt-3 leading-relaxed">
              {item.description}
            </p>

            {/* Quick Nutrition & Spice Metrics */}
            <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE0D2] mt-4">
              <div className="text-center">
                <span className="block text-[10px] font-bold uppercase text-[#8D6E63] tracking-wider">
                  Calories
                </span>
                <span className="text-xs sm:text-sm font-black text-[#231709]">
                  {item.calories ? `${item.calories} kcal` : 'Fresh Daily'}
                </span>
              </div>
              <div className="text-center border-x border-[#EBE0D2]">
                <span className="block text-[10px] font-bold uppercase text-[#8D6E63] tracking-wider">
                  Spice Profile
                </span>
                <span className="text-xs sm:text-sm font-black text-[#D97736]">
                  {item.spiceLevel === 'hot'
                    ? '🌶️🌶️🌶️ Hot'
                    : item.spiceLevel === 'medium'
                    ? '🌶️🌶️ Medium'
                    : item.spiceLevel === 'mild'
                    ? '🌶️ Mild'
                    : '🌿 Non-Spicy'}
                </span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-bold uppercase text-[#8D6E63] tracking-wider">
                  Serving Size
                </span>
                <span className="text-xs sm:text-sm font-black text-[#231709] line-clamp-1">
                  {item.servingSize || '1 Portion'}
                </span>
              </div>
            </div>

            {/* Key Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#C86D51] mb-2">
                  Key Artisanal Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-[#F5EBE1] text-[#3E2723] border border-[#DFCDB8]"
                    >
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Chef's Note */}
            {item.chefNote && (
              <div className="p-3.5 rounded-2xl bg-[#FFF8EE] border border-[#F3DFC1] mt-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#A0522D] block">
                  👨‍🍳 Chef's Recommendation (Kittu Cafe Dausa)
                </span>
                <p className="text-xs text-[#5D4037] italic mt-0.5">
                  "{item.chefNote}"
                </p>
              </div>
            )}
          </div>

          {/* Size / Variant Selector */}
          {item.variants && item.variants.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
                Select Portion Size
              </label>
              <div className="grid grid-cols-2 gap-3">
                {item.variants.map((v, idx) => {
                  const isSelected = selectedVariantIndex === idx;
                  return (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#D97736] bg-[#FBECE7]/40 ring-2 ring-[#D97736]/20 shadow-xs'
                          : 'border-[#EBE0D2] bg-white hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#231709]">{v.name}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#D97736] bg-[#D97736] text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#D97736] mt-1 block">
                        {formatPrice(v.priceInPaise)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-on Groups */}
          {item.addOnGroups && item.addOnGroups.length > 0 && (
            <div className="space-y-4">
              {item.addOnGroups.map((group) => (
                <div key={group.title} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
                      {group.title}
                    </label>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {group.maxSelections === 1 ? 'Choose 1' : `Up to ${group.maxSelections}`}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((addon) => {
                      const isChecked = selectedAddOns.includes(addon.name);
                      return (
                        <button
                          key={addon.name}
                          type="button"
                          onClick={() => handleAddOnToggle(addon.name, group.maxSelections)}
                          className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                            isChecked
                              ? 'border-[#D97736] bg-[#FBECE7]/30'
                              : 'border-[#EBE0D2] bg-white hover:bg-[#FAF6F0]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                isChecked
                                  ? 'border-[#D97736] bg-[#D97736] text-white'
                                  : 'border-stone-300'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-semibold text-[#231709]">
                              {addon.name}
                            </span>
                          </div>
                          <span className="text-xs font-black text-[#5D4037]">
                            +{formatPrice(addon.priceInPaise)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity and Add to Cart Section */}
          <div className="pt-4 border-t border-[#EBE0D2] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold block">
                  Total Price
                </span>
                <span className="text-2xl font-black text-[#231709]">
                  {formatPrice(totalPriceInPaise)}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 bg-white border border-[#EBE0D2] rounded-2xl p-1.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-[#FAF6F0] hover:bg-[#F5EBE1] flex items-center justify-center text-[#231709] transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-black text-sm w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-[#FAF6F0] hover:bg-[#F5EBE1] flex items-center justify-center text-[#231709] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : item.isAvailable
                  ? 'btn-3d-primary text-white hover:scale-[1.01]'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Added to Cart!</span>
                </>
              ) : item.isAvailable ? (
                <>
                  <ShoppingBag className="w-5 h-5 text-[#D97736]" />
                  <span>Add to Order • {formatPrice(totalPriceInPaise)}</span>
                </>
              ) : (
                <span>Currently Out of Stock</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
