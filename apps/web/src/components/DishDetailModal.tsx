'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Plus,
  Minus,
  Clock,
  Flame,
  Star,
  Check,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChefHat,
  Utensils,
  Share2,
} from 'lucide-react';
import { IMenuItem } from '@kittu-cafe/shared';
import { formatPrice } from '../lib/api';
import { useCartStore } from '../store/useCartStore';

interface DishDetailModalProps {
  item: IMenuItem | null;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ item, onClose }) => {
  const addItem = useCartStore((state) => state.addItem);

  const [selectedVariant, setSelectedVariant] = useState<string>(
    item?.variants && item.variants.length > 0 ? item.variants[0].name : ''
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!item) return null;

  // Calculate dynamic live unit price
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
      prev.includes(addonName) ? prev.filter((name) => name !== addonName) : [...prev, addonName]
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
      specialInstructions: specialInstructions.trim() || undefined,
      imageUrl: item.imageUrl,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 800);
  };

  const itemSlug = item.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFEFA] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#EBE0D2] shadow-2xl flex flex-col overflow-hidden relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-lg"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero HD Image Header with Badges */}
        <div className="relative w-full h-64 sm:h-76 bg-[#FAF6F0] overflow-hidden shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Floating Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <div
              className="px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-emerald-500/80 shadow-md flex items-center gap-1.5"
              title="100% Pure Vegetarian"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-[11px] font-black uppercase text-emerald-900 tracking-wider">
                100% Veg
              </span>
            </div>

            {item.isBestseller && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#D97736] to-[#E6866B] text-white shadow-md">
                <Flame className="w-3.5 h-3.5 fill-white" />
                Bestseller
              </span>
            )}

            {item.isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-500 text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                Chef's Special
              </span>
            )}
          </div>

          {/* Bottom Overlay Info on Image */}
          <div className="absolute bottom-4 inset-x-4 flex items-end justify-between text-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/50 backdrop-blur-md text-xs font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  {item.rating || 4.9} ({item.ratingCount || 240}+ reviews)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/50 backdrop-blur-md text-xs font-bold text-white/90">
                  <Clock className="w-3.5 h-3.5 text-[#D97736]" />
                  {item.preparationTimeMinutes || 10} mins
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight drop-shadow-sm text-white">
                {item.name}
              </h2>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs uppercase font-bold text-white/80 block">Starting at</span>
              <span className="text-2xl font-black text-amber-300 drop-shadow-md">
                {formatPrice(item.basePriceInPaise)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Detailed Story & Flavors */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#C86D51] mb-1.5 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              Culinary Details & Taste
            </h3>
            <p className="text-sm text-[#4E342E] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Quick Info Grid (Calories, Spice, Serving) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 py-3 px-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE0D2]">
            <div className="text-center">
              <span className="block text-[10px] font-bold uppercase text-[#8D6E63] tracking-wider">
                Calories
              </span>
              <span className="text-sm font-black text-[#231709]">
                {item.calories ? `${item.calories} kcal` : 'Fresh Prep'}
              </span>
            </div>

            <div className="text-center border-x border-[#EBE0D2]">
              <span className="block text-[10px] font-bold uppercase text-[#8D6E63] tracking-wider">
                Spice Level
              </span>
              <span className="text-sm font-black text-[#D97736]">
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
              <span className="text-sm font-black text-[#231709] line-clamp-1">
                {item.servingSize || '1 Portion'}
              </span>
            </div>
          </div>

          {/* Key Ingredients Chips */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div>
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

          {/* Chef's Note Box */}
          {item.chefNote && (
            <div className="p-3.5 rounded-2xl bg-[#FFF8EE] border border-[#F3DFC1] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#D97736] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ChefHat className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#A0522D] block">
                  Chef Rampal's Note (Kittu Cafe Dausa)
                </span>
                <p className="text-xs text-[#5D4037] italic mt-0.5">
                  "{item.chefNote}"
                </p>
              </div>
            </div>
          )}

          {/* Variants Selector */}
          {item.variants && item.variants.length > 0 && (
            <div className="pt-2 border-t border-[#FAF6F0]">
              <label className="block text-xs font-black uppercase tracking-wider text-[#C86D51] mb-2.5">
                Select Size / Portion
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.variants.map((v) => (
                  <label
                    key={v.name}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedVariant === v.name
                        ? 'border-[#D97736] bg-[#FBECE7]/50 shadow-xs'
                        : 'border-[#EBE0D2] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="dish-variant"
                        checked={selectedVariant === v.name}
                        onChange={() => setSelectedVariant(v.name)}
                        className="text-[#D97736] focus:ring-[#D97736]"
                      />
                      <span className="text-xs sm:text-sm font-bold text-[#231709]">
                        {v.name}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-[#D97736]">
                      {formatPrice(v.priceInPaise)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add-on Groups */}
          {item.addOnGroups && item.addOnGroups.length > 0 && (
            <div className="pt-2 border-t border-[#FAF6F0]">
              {item.addOnGroups.map((group) => (
                <div key={group.title} className="mb-4 last:mb-0">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#C86D51] mb-2">
                    {group.title}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.items.map((addon) => {
                      const isChecked = selectedAddOns.includes(addon.name);
                      return (
                        <label
                          key={addon.name}
                          className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'border-[#D97736] bg-[#FBECE7]/50 shadow-xs'
                              : 'border-[#EBE0D2] hover:bg-[#FAF6F0]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleAddOn(addon.name)}
                              className="rounded text-[#D97736] focus:ring-[#D97736]"
                            />
                            <span className="text-xs font-bold text-[#231709]">
                              {addon.name}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-[#D97736]">
                            +{formatPrice(addon.priceInPaise)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div className="pt-2 border-t border-[#FAF6F0]">
            <label className="block text-xs font-black uppercase tracking-wider text-[#4E342E] mb-1.5">
              Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Less sugar, extra crispy, spicy chutney, no onions..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736] bg-[#FFFEFA]"
            />
          </div>

          {/* Link to Dedicated Page */}
          <div className="text-center pt-1">
            <Link
              href={`/menu/${itemSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97736] hover:text-[#B85C20] hover:underline"
              onClick={onClose}
            >
              <span>View dedicated full page story for {item.name}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Floating Bottom Bar: Quantity & Instant Add */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#EBE0D2] flex items-center justify-between gap-3 shadow-lg shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center border border-[#EBE0D2] rounded-2xl bg-[#FAF6F0] p-1 shadow-inner">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-xl hover:bg-white text-[#4E342E] flex items-center justify-center transition-colors cursor-pointer"
              title="Decrease quantity"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="w-10 text-center text-sm font-black text-[#231709]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-xl hover:bg-white text-[#4E342E] flex items-center justify-center transition-colors cursor-pointer"
              title="Increase quantity"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Add to Order CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!item.isAvailable || isAdded}
            className={`flex-1 py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-between shadow-xl transition-all active:scale-98 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : item.isAvailable
                ? 'btn-3d-primary text-white'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>{isAdded ? 'Added to Cart!' : 'Add to Order'}</span>
            </div>
            <span className="font-extrabold text-base">
              {formatPrice(totalPricePaise)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
