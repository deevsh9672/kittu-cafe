'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { IMenuItem } from '@kittu-cafe/shared';
import { formatPrice } from '../lib/api';
import { useCartStore } from '../store/useCartStore';

interface ItemCustomizeModalProps {
  item: IMenuItem | null;
  onClose: () => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({ item, onClose }) => {
  const addItem = useCartStore((state) => state.addItem);

  const [selectedVariant, setSelectedVariant] = useState<string>(
    item?.variants && item.variants.length > 0 ? item.variants[0].name : ''
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  // Compute live price
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFEFA] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#EBE0D2] shadow-2xl p-6">
        <div className="flex items-start justify-between pb-4 border-b border-[#FAF6F0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center rounded-sm">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
              </span>
              <h3 className="text-lg font-bold text-[#231709]">{item.name}</h3>
            </div>
            <p className="text-xs text-[#5D4037]">{item.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F5EBE1] text-[#4E342E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Variants */}
        {item.variants && item.variants.length > 0 && (
          <div className="py-4 border-b border-[#FAF6F0]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#C86D51] mb-2.5">
              Select Size / Option
            </label>
            <div className="space-y-2">
              {item.variants.map((v) => (
                <label
                  key={v.name}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedVariant === v.name
                      ? 'border-[#D97736] bg-[#FBECE7]/40'
                      : 'border-[#EBE0D2] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="variant"
                      checked={selectedVariant === v.name}
                      onChange={() => setSelectedVariant(v.name)}
                      className="text-[#D97736] focus:ring-[#D97736]"
                    />
                    <span className="text-sm font-medium text-[#231709]">{v.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[#4E342E]">{formatPrice(v.priceInPaise)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Addons */}
        {item.addOnGroups && item.addOnGroups.length > 0 && (
          <div className="py-4 border-b border-[#FAF6F0]">
            {item.addOnGroups.map((group) => (
              <div key={group.title} className="mb-4 last:mb-0">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C86D51] mb-2">
                  {group.title}
                </label>
                <div className="space-y-2">
                  {group.items.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.name);
                    return (
                      <label
                        key={addon.name}
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          isChecked ? 'border-[#D97736] bg-[#FBECE7]/30' : 'border-[#EBE0D2] hover:bg-[#FAF6F0]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleAddOn(addon.name)}
                            className="rounded text-[#D97736] focus:ring-[#D97736]"
                          />
                          <span className="text-sm text-[#231709]">{addon.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#5D4037]">
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

        {/* Special Instructions */}
        <div className="py-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4E342E] mb-1.5">
            Special Instructions (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Less sugar, extra crispy, no ice"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full text-sm p-3 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736] bg-[#FFFEFA]"
          />
        </div>

        {/* Footer controls: Quantity and Add Button */}
        <div className="pt-4 border-t border-[#FAF6F0] flex items-center justify-between gap-4">
          <div className="flex items-center border border-[#EBE0D2] rounded-xl bg-white p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 rounded-lg hover:bg-[#FAF6F0] text-[#4E342E]"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 text-sm font-bold text-[#231709]">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 rounded-lg hover:bg-[#FAF6F0] text-[#4E342E]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 rounded-xl bg-[#231709] hover:bg-[#3E2723] text-white font-bold text-sm flex items-center justify-between shadow-md transition-all active:scale-98"
          >
            <span>Add to Order</span>
            <span>{formatPrice(totalPricePaise)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
