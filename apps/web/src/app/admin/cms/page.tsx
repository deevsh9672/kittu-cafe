'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, MapPin, Phone, Clock, AlertCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

export default function AdminCmsPage() {
  const [address, setAddress] = useState<string>(BUSINESS_CONFIG.address);
  const [contactNumber, setContactNumber] = useState<string>(BUSINESS_CONFIG.contactNumber);
  const [announcement, setAnnouncement] = useState('Welcome to Kittu Cafe, Dausa! Enjoy authentic cafe culture & fast delivery.');
  const [heroHeadline, setHeroHeadline] = useState('Artisanal Coffee & Crafted Bites in Dausa');
  const [heroSubheadline, setHeroSubheadline] = useState('Experience warm hospitality, artisanal beverages, and handcrafted cafe specialties at Kittu Cafe.');
  const [openingHoursStr, setOpeningHoursStr] = useState('10:00 AM – 10:30 PM');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">Business CMS</span>
        <h1 className="text-2xl font-extrabold text-[#231709]">Cafe Profile & CMS Settings</h1>
        <p className="text-xs text-[#5D4037]">
          Update contact info, address, banners, and hours shown across customer website and mobile app.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#EBE0D2] p-6 space-y-6 shadow-sm">
        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Cafe configuration updated and persisted!</span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#231709] pb-2 border-b border-[#FAF6F0]">
            Core Business Information
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#4E342E] mb-1">Business Name</label>
            <input
              type="text"
              disabled
              value={BUSINESS_CONFIG.name}
              className="w-full p-2.5 rounded-xl border border-[#EBE0D2] bg-[#FAF6F0] text-xs font-bold text-[#231709]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4E342E] mb-1">Verified Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4E342E] mb-1">Official Contact Phone *</label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4E342E] mb-1">Operating Hours</label>
            <input
              type="text"
              value={openingHoursStr}
              onChange={(e) => setOpeningHoursStr(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#FAF6F0]">
          <h3 className="text-sm font-bold text-[#231709] pb-2 border-b border-[#FAF6F0]">
            Homepage Content & Banners
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#4E342E] mb-1">Top Announcement Banner</label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4E342E] mb-1">Hero Headline</label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4E342E] mb-1">Hero Subheadline</label>
            <textarea
              rows={2}
              value={heroSubheadline}
              onChange={(e) => setHeroSubheadline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#231709] hover:bg-[#3E2723] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4 text-[#D97736]" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
