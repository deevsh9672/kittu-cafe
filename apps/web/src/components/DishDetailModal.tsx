'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Plus,
  Minus,
  Star,
  Clock,
  Flame,
  Check,
  ShoppingBag,
  Sparkles,
  Share2,
} from 'lucide-react';
import { IMenuItem } from '@kittu-cafe/shared';
import { formatPrice } from '../lib/api';
import { useCartStore } from '../store/useCartStore';

interface DishDetailModalProps {
  item: IMenuItem | null;
  onClose: () => void;
}

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

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ item, onClose }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedVariant, setSelectedVariant] = useState<string>(
    item?.variants && item.variants.length > 0 ? item.variants[0].name : ''
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!item) return null;

  // Calculate live dynamic price
  let currentUnitPaise = item.basePriceInPaise;
  if (selectedVariant && item.variants) {
    const v = item.variants.find((v) => v.name === selectedVariant);
    if (v) currentUnitPaise = v.priceInPaise;
  }
  if (item.addOnGroups) {
    for (const group of item.addOnGroups) {
      for (const addon of group.items) {
        if (selectedAddOns.includes(addon.name)) {
          currentUnitPaise += addon.priceInPaise;
        }
      }
    }
  }

  const totalPricePaise = currentUnitPaise * quantity;

  const handleToggleAddOn = (addonName: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonName) ? prev.filter((n) => n !== addonName) : [...prev, addonName]
    );
  };

  const handleAddToCart = () => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      unitPriceInPaise: currentUnitPaise,
      quantity,
      selectedVariantName: selectedVariant || undefined,
      selectedAddOnNames: selectedAddOns.length > 0 ? selectedAddOns : undefined,
      imageUrl: item.imageUrl,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
  };

  const handleOrderNow = () => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      unitPriceInPaise: currentUnitPaise,
      quantity,
      selectedVariantName: selectedVariant || undefined,
      selectedAddOnNames: selectedAddOns.length > 0 ? selectedAddOns : undefined,
      imageUrl: item.imageUrl,
    });
    onClose();
    router.push('/checkout');
  };

  // Default fallback ingredients if none specified
  const displayIngredients =
    item.ingredients && item.ingredients.length > 0
      ? item.ingredients
      : ['Fresh Paneer', 'Crisp Salad', 'Vine Tomatoes', 'Artisanal Herbs', 'Olive Dressing'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[32px] max-w-lg w-full max-h-[92vh] overflow-y-auto border border-[#EBE0D2]/70 shadow-2xl flex flex-col relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar (Image 1 Style: Back Arrow + Favorite Heart) */}
        <div className="flex items-center justify-between p-4 sm:p-5 pb-2">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Dish Details
          </span>

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            title="Add to favorites"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite
                  ? 'fill-[#1B4332] text-[#1B4332]'
                  : 'text-stone-400 hover:text-[#1B4332]'
              }`}
            />
          </button>
        </div>

        {/* Hero Food Photography (Image 1 Style: Centered Hero Dish) */}
        <div className="relative px-6 py-2 flex flex-col items-center">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center">
            {/* Ambient soft glow */}
            <div className="absolute inset-4 rounded-full bg-amber-100/50 blur-2xl pointer-events-none" />
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-contain relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Pure Veg Badge */}
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              100% Pure Veg • Kittu Cafe
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-3 space-y-5">
          {/* Title, Rating, Quantity Counter & Price (Image 1 Style) */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1F2937] tracking-tight leading-tight">
                {item.name}
              </h2>

              {/* Quantity Counter Pill */}
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
                <span className="text-xs text-stone-400 font-medium">
                  ({item.ratingCount || 180}+ reviews)
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {item.preparationTimeMinutes || 10} mins
                </span>
              </div>

              <span className="text-2xl font-black text-[#1F2937]">
                {formatPrice(totalPricePaise)}
              </span>
            </div>
          </div>

          {/* Details Section (Image 1 Style) */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-black text-[#1F2937] uppercase tracking-wider">
              Details
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              {item.description ||
                'Indulge in handcrafted perfection freshly prepared by our chefs in Shiv Colony, Dausa. Balanced aroma, premium artisanal ingredients, and savory warmth in every bite.'}
            </p>
          </div>

          {/* Ingredients Section (Image 1 Style: Emojis and Pills) */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-[#1F2937] uppercase tracking-wider">
              Ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {displayIngredients.map((ing) => (
                <div
                  key={ing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-white transition-colors"
                >
                  <span className="text-sm">{getIngredientEmoji(ing)}</span>
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Variants Selector if available */}
          {item.variants && item.variants.length > 0 && (
            <div className="space-y-2 pt-1 border-t border-stone-100">
              <h4 className="text-xs font-black text-stone-500 uppercase tracking-wider">
                Select Size / Portion
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {item.variants.map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setSelectedVariant(v.name)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex justify-between items-center transition-all cursor-pointer ${
                      selectedVariant === v.name
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

          {/* Add-ons Selector if available */}
          {item.addOnGroups && item.addOnGroups.length > 0 && (
            <div className="space-y-2 pt-1 border-t border-stone-100">
              <h4 className="text-xs font-black text-stone-500 uppercase tracking-wider">
                Custom Add-ons
              </h4>
              <div className="space-y-1.5">
                {item.addOnGroups.map((group) =>
                  group.items.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.name);
                    return (
                      <label
                        key={addon.name}
                        onClick={() => handleToggleAddOn(addon.name)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-[#1B4332] bg-[#1B4332]/5 font-bold text-[#1B4332]'
                            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isChecked
                                ? 'bg-[#1B4332] border-[#1B4332] text-white'
                                : 'border-stone-300'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{addon.name}</span>
                        </div>
                        <span className="font-bold">+{formatPrice(addon.priceInPaise)}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dual Bottom Actions (Image 1 Style: ORDER NOW & ADD TO CART) */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-t border-stone-100 flex items-center gap-3">
          {/* Order Now (Outline deep green button) */}
          <button
            onClick={handleOrderNow}
            className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-[#1B4332] text-[#1B4332] font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-[#1B4332]/5 transition-colors cursor-pointer text-center"
          >
            ORDER NOW
          </button>

          {/* Add to Cart (Solid deep green button) */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-[#1B4332] hover:bg-[#143326] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer text-center"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>ADDED!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
