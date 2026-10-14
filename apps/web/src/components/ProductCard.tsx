'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Flame, Clock, Sparkles, Utensils, Eye, Star, Info } from 'lucide-react';
import { IMenuItem } from '@kittu-cafe/shared';
import { formatPrice } from '../lib/api';
import { useCartStore } from '../store/useCartStore';
import { DishDetailModal } from './DishDetailModal';

interface ProductCardProps {
  item: IMenuItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const hasCustomizations =
    (item.variants && item.variants.length > 0) ||
    (item.addOnGroups && item.addOnGroups.length > 0);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasCustomizations) {
      setShowDetailModal(true);
    } else {
      addItem({
        menuItemId: item._id,
        name: item.name,
        unitPriceInPaise: item.basePriceInPaise,
        quantity: 1,
        imageUrl: item.imageUrl,
      });
    }
  };

  const itemSlug = item.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return (
    <>
      <div
        onClick={() => setShowDetailModal(true)}
        className="group relative bg-[#FFFEFA] rounded-3xl border border-[#EBE0D2]/80 p-4 sm:p-5 flex flex-col justify-between shadow-3d card-3d-tilt shine-effect transition-all duration-300 overflow-hidden cursor-pointer hover:border-[#D97736]/60"
      >
        {/* Subtle 3D Top Sheen */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#D97736]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div>
          {/* Food Image Container with Hover Quick View */}
          <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-3.5 bg-[#FAF6F0] border border-[#DFCDB8]/40">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#DFCDB8] bg-gradient-to-br from-[#FAF6F0] to-[#F5EBE1]">
                <Utensils className="w-10 h-10 stroke-[1.5]" />
                <span className="text-[10px] font-bold tracking-wider text-[#8D6E63] mt-1 uppercase">
                  Kittu Cafe Dausa
                </span>
              </div>
            )}

            {/* Hover Quick View Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-2xs">
              <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-[#231709] font-black text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <Eye className="w-3.5 h-3.5 text-[#D97736]" />
                View Full Details
              </span>
            </div>

            {/* Badges Overlay */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
              {item.dietaryType === 'veg' ? (
                <div
                  className="w-5 h-5 rounded-md bg-white/95 backdrop-blur-xs border border-emerald-500/80 shadow-xs flex items-center justify-center"
                  title="100% Pure Vegetarian"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-xs" />
                </div>
              ) : (
                <div
                  className="w-5 h-5 rounded-md bg-white/95 backdrop-blur-xs border border-rose-500/80 shadow-xs flex items-center justify-center"
                  title="Non-Vegetarian"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                </div>
              )}

              {item.isBestseller && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-xs text-[#C86D51] border border-[#E6866B]/40 shadow-xs">
                  <Flame className="w-3 h-3 text-[#D97736] fill-[#D97736]" />
                  Bestseller
                </span>
              )}
            </div>

            {/* Rating or Prep Time Pill */}
            <div className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold shadow-xs z-10 pointer-events-none">
              <Clock className="w-3 h-3 text-[#D97736]" />
              <span>{item.preparationTimeMinutes || 10}m</span>
            </div>

            {item.rating && (
              <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-extrabold z-10 pointer-events-none">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>{item.rating}</span>
              </div>
            )}
          </div>

          {/* Dish Title & Description */}
          <div className="mb-2">
            <h3 className="font-extrabold text-base text-[#231709] tracking-tight mb-1 group-hover:text-[#C86D51] transition-colors line-clamp-1">
              {item.name}
            </h3>
            <p className="text-xs text-[#6D4C41] line-clamp-2 leading-relaxed font-normal">
              {item.description || 'Prepared fresh at Kittu Cafe with artisanal ingredients.'}
            </p>
          </div>

          {/* Ingredients highlight tags if available */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.ingredients.slice(0, 2).map((ing) => (
                <span
                  key={ing}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#FAF6F0] text-[#8D6E63] border border-[#EBE0D2]/60 line-clamp-1"
                >
                  {ing}
                </span>
              ))}
              {item.ingredients.length > 2 && (
                <span className="text-[10px] font-bold text-[#D97736] px-1 py-0.5">
                  +{item.ingredients.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing and Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#FAF6F0] mt-auto">
          <div>
            <span className="text-lg font-black text-[#231709] tracking-tight">
              {formatPrice(item.basePriceInPaise)}
            </span>
            {hasCustomizations && (
              <span className="block text-[10px] font-bold text-[#C86D51] tracking-wide uppercase">
                Customizable
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Detail View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailModal(true);
              }}
              className="p-2 rounded-xl text-[#8D6E63] hover:text-[#D97736] hover:bg-[#FAF6F0] border border-[#EBE0D2]/80 transition-colors cursor-pointer"
              title="View dish details"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddClick}
              disabled={!item.isAvailable}
              className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform active:scale-95 ${
                item.isAvailable
                  ? 'btn-3d-primary text-white'
                  : 'bg-stone-200 text-stone-500 cursor-not-allowed shadow-none'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{item.isAvailable ? 'ADD' : 'SOLD OUT'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Dish Detail Modal */}
      {showDetailModal && (
        <DishDetailModal
          item={item}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  );
};
