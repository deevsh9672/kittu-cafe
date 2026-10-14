'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  Home,
  Briefcase,
  Building,
  ArrowLeft,
  Star,
} from 'lucide-react';
import { useAuthStore, SavedAddress } from '../../../store/useAuthStore';

export default function SavedAddressesPage() {
  const { savedAddresses, addAddress, removeAddress, setDefaultAddress } = useAuthStore();

  const [isAdding, setIsAdding] = useState(false);
  const [label, setLabel] = useState('Home');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('Shiv Colony, Mariyara Wale');
  const [city, setCity] = useState('Dausa');
  const [postalCode, setPostalCode] = useState('303303');
  const [landmark, setLandmark] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !area) return;

    addAddress({
      label,
      street,
      area,
      city,
      postalCode,
      landmark: landmark || undefined,
      isDefault,
    });

    // Reset form
    setStreet('');
    setLandmark('');
    setIsAdding(false);
  };

  const getLabelIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <Home className="w-4 h-4 text-[#D97736]" />;
      case 'office':
      case 'work':
        return <Briefcase className="w-4 h-4 text-[#C86D51]" />;
      default:
        return <Building className="w-4 h-4 text-[#5D4037]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5D4037] hover:text-[#C86D51]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-3d-primary text-white text-xs font-black shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'Add New Address'}</span>
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-black text-[#231709]">Delivery Addresses</h1>
        <p className="text-xs text-[#5D4037]">
          Save your favourite delivery locations across Dausa for faster checkout.
        </p>
      </div>

      {/* Add New Address Card */}
      {isAdding && (
        <div className="bg-white rounded-3xl border border-[#DFCDB8] p-6 sm:p-8 shadow-md space-y-4">
          <h2 className="text-sm font-black text-[#231709]">New Delivery Address in Dausa</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="flex gap-2">
              {['Home', 'Office', 'Other'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLabel(type)}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                    label === type
                      ? 'bg-[#231709] text-white border-[#231709]'
                      : 'bg-[#FAF6F0] text-[#5D4037] border-[#DFCDB8]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#5D4037] block mb-1">House / Flat / Street *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House #14, Lane 2"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5D4037] block mb-1">Colony / Locality / Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shiv Colony, Mariyara Wale"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5D4037] block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736] bg-[#FAF6F0]"
                />
              </div>

              <div>
                <label className="font-bold text-[#5D4037] block mb-1">Postal Code (PIN)</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736] bg-[#FAF6F0]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-[#5D4037] block mb-1">Nearby Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Near Kittu Cafe or Water Tank"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded accent-[#D97736]"
              />
              <label htmlFor="isDefault" className="text-xs font-bold text-[#5D4037] cursor-pointer">
                Make this my primary delivery address
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border border-[#DFCDB8] text-[#5D4037] font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl btn-3d-primary text-white font-black text-xs shadow-md"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedAddresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between ${
              addr.isDefault
                ? 'border-[#D97736] shadow-md ring-1 ring-[#D97736]/20'
                : 'border-[#EBE0D2] shadow-xs hover:border-[#DFCDB8]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#FAF6F0] text-[#231709]">
                  {getLabelIcon(addr.label)}
                  {addr.label}
                </span>

                {addr.isDefault && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#D97736]">
                    <Star className="w-3.5 h-3.5 fill-[#D97736]" />
                    Default
                  </span>
                )}
              </div>

              <div className="text-xs space-y-1 text-[#5D4037]">
                <p className="font-bold text-[#231709]">{addr.street}</p>
                <p>{addr.area}</p>
                <p>
                  {addr.city}, Rajasthan - {addr.postalCode}
                </p>
                {addr.landmark && (
                  <p className="text-[11px] text-stone-500">Landmark: {addr.landmark}</p>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#FAF6F0] flex items-center justify-between text-xs">
              {!addr.isDefault ? (
                <button
                  type="button"
                  onClick={() => setDefaultAddress(addr.id)}
                  className="font-bold text-[#D97736] hover:underline cursor-pointer"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5" /> Primary Address
                </span>
              )}

              {savedAddresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAddress(addr.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
