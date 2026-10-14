'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Flame, Clock, Sparkles, Utensils } from 'lucide-react';
import { IMenuItem } from '@kittu-cafe/shared';
import { formatPrice } from '../lib/api';
import { useCartStore } from '../store/useCartStore';
import { ItemCustomizeModal } from './ItemCustomizeModal';

interface ProductCardProps {
  item: IMenuItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const [showModal, setShowModal] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const hasCustomizations =
    (item.variants && item.variants.length > 0) ||
    (item.addOnGroups && item.addOnGroups.length > 0);

  const handleAddClick = () => {
    if (hasCustomizations) {
      setShowModal(true);
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
      <div className="group relative bg-[#FFFEFA] rounded-3xl border border-[#EBE0D2]/80 p-4 sm:p-5 flex flex-col justify-between shadow-3d card-3d-tilt shine-effect transition-all duration-300 overflow-hidden">
        {/* Subtle 3D Top Sheen */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#D97736]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div>
          {/* Food Image Container */}
          <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-4 bg-[#FAF6F0] border border-[#DFCDB8]/40">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#DFCDB8] bg-gradient-to-br from-[#FAF6F0] to-[#F5EBE1]">
                <Utensils className="w-10 h-10 stroke-[1.5]" />
                <span className="text-[10px] font-bold tracking-wider text-[#8D6E63] mt-1 uppercase">
                  Kittu Cafe Dausa
                </span>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
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

            <div className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
              <Clock className="w-3 h-3 text-[#D97736]" />
              <span>{item.preparationTimeMinutes || 12}m</span>
            </div>
          </div>

          {/* Dish Title & Description */}
          <Link href={`/menu/${itemSlug}`} className="block">
            <h3 className="font-extrabold text-base text-[#231709] tracking-tight mb-1.5 group-hover:text-[#C86D51] transition-colors line-clamp-1 hover:underline">
              {item.name}
            </h3>
          </Link>
          <p className="text-xs text-[#6D4C41] line-clamp-2 leading-relaxed mb-4 font-normal">
            {item.description || 'Prepared fresh at Kittu Cafe with artisanal ingredients.'}
          </p>
        </div>

        {/* Pricing and 3D Action Button */}
        <div className="flex items-end justify-between pt-3 border-t border-[#FAF6F0]">
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

          <button
            onClick={handleAddClick}
            disabled={!item.isAvailable}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 cursor-pointer ${
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

      {showModal && <ItemCustomizeModal item={item} onClose={() => setShowModal(false)} />}
    </>
  );
};
