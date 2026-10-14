'use client';

import React, { useState } from 'react';
import { Plus, Flame, Clock, Heart, Star, Check, ShoppingBag, Eye } from 'lucide-react';
import { IMenuItem } from '@kittu-cafe/shared';
import { formatPrice } from '../lib/api';
import { useCartStore } from '../store/useCartStore';
import { DishDetailModal } from './DishDetailModal';

interface ProductCardProps {
  item: IMenuItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
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
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <div
        onClick={() => setShowDetailModal(true)}
        className="group relative bg-white rounded-3xl border border-[#F0ECE4] p-3.5 sm:p-4 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
      >
        <div>
          {/* Top Floating Heart Button (Image 1 Style) */}
          <button
            onClick={handleToggleFavorite}
            aria-label="Save to favorites"
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xs transition-transform hover:scale-110 active:scale-90"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite
                  ? 'fill-[#1B4332] text-[#1B4332]'
                  : 'text-stone-300 hover:text-[#1B4332]'
              }`}
            />
          </button>

          {/* Top Left Veg Badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 pointer-events-none">
            <div
              className="w-5 h-5 rounded-md bg-white/95 backdrop-blur-xs border border-emerald-500/80 shadow-xs flex items-center justify-center"
              title="100% Pure Vegetarian"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-600 shadow-xs" />
            </div>

            {item.isBestseller && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 shadow-xs">
                <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
                Hot
              </span>
            )}
          </div>

          {/* Food Image Container */}
          <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden mb-3 bg-[#FAF8F5] flex items-center justify-center">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
            ) : (
              <div className="text-stone-300 font-bold text-xs uppercase tracking-wider">
                Kittu Cafe
              </div>
            )}

            {/* Hover Quick View Pill */}
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-2xs">
              <span className="px-3 py-1 rounded-full bg-white text-[#1B4332] font-black text-[11px] shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <Eye className="w-3 h-3 text-[#1B4332]" />
                View Details
              </span>
            </div>
          </div>

          {/* Dish Title */}
          <h3 className="font-bold text-sm sm:text-base text-[#1F2937] tracking-tight group-hover:text-[#1B4332] transition-colors truncate">
            {item.name}
          </h3>

          {/* Star Rating & Reviews */}
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-[#1F2937]">
              {item.rating || 4.8}
            </span>
            <span className="text-[11px] text-stone-400 font-medium">
              ({item.ratingCount || 120}+)
            </span>
            <span className="text-stone-300 mx-1">•</span>
            <span className="text-[11px] text-stone-500 font-medium flex items-center gap-0.5">
              <Clock className="w-3 h-3 text-stone-400" />
              {item.preparationTimeMinutes || 10}m
            </span>
          </div>

          {/* Short description */}
          <p className="text-[11px] text-stone-500 line-clamp-1 mt-1 leading-relaxed">
            {item.description || 'Handcrafted fresh with artisanal ingredients.'}
          </p>
        </div>

        {/* Pricing & Quick-Add Cart Button (Image 1 Style) */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100">
          <div>
            <span className="text-base sm:text-lg font-black text-[#1F2937] tracking-tight block">
              {formatPrice(item.basePriceInPaise)}
            </span>
            {hasCustomizations && (
              <span className="text-[10px] font-semibold text-[#1B4332] uppercase tracking-wide">
                Customizable
              </span>
            )}
          </div>

          {/* Forest Green Cart Quick Button */}
          <button
            onClick={handleAddClick}
            disabled={!item.isAvailable}
            title={item.isAvailable ? 'Add to cart' : 'Sold out'}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
              justAdded
                ? 'bg-emerald-600 text-white scale-105'
                : item.isAvailable
                ? 'bg-[#1B4332] hover:bg-[#143326] text-white active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
            }`}
          >
            {justAdded ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
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
