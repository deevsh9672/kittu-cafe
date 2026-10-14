'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Award,
  Calendar,
  LogOut,
  Edit2,
  Check,
  Coffee,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function CustomerProfilePage() {
  const router = useRouter();
  const { user, token, savedAddresses, updateProfile, logout } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(user?.email || 'aarav@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98290 11223');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // If user is not logged in, provide easy login or guest demo preview
  const activeUser = user || {
    id: 'cust-demo-1',
    name: 'Aarav Sharma',
    phone: '+91 98290 11223',
    email: 'aarav@example.com',
    role: 'customer',
    loyaltyPoints: 180,
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 space-y-8">
      {/* Top Banner / Welcome Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#231709] via-[#3E2723] to-[#1B0F05] text-[#FAF6F0] p-6 sm:p-8 overflow-hidden shadow-xl border border-[#3E2723]">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D97736]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D97736] to-[#C86D51] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[#D97736]/30 border border-white/20">
              {activeUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">{activeUser.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#D97736] text-white">
                  Gold Member
                </span>
              </div>
              <p className="text-xs text-[#DFCDB8] flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-[#D97736]" />
                <span>{activeUser.phone}</span>
                {activeUser.email && (
                  <>
                    <span className="text-stone-500">•</span>
                    <span>{activeUser.email}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 border border-rose-400/20 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Loyalty Beans Tier Progress */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-[#DFCDB8] mb-1">
              <span>Loyalty Beans</span>
              <Award className="w-4 h-4 text-[#D97736]" />
            </div>
            <div className="text-2xl font-black text-white">{activeUser.loyaltyPoints} Beans</div>
            <p className="text-[11px] text-[#DFCDB8]/70 mt-1">₹180 worth discount on your next cafe order</p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-[#DFCDB8] mb-1">
              <span>Saved Addresses</span>
              <MapPin className="w-4 h-4 text-[#D97736]" />
            </div>
            <div className="text-2xl font-black text-white">{savedAddresses.length} in Dausa</div>
            <Link href="/profile/addresses" className="text-[11px] text-[#D97736] hover:underline block mt-1">
              Manage Addresses &rarr;
            </Link>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-[#DFCDB8] mb-1">
              <span>Preferred Cafe</span>
              <Coffee className="w-4 h-4 text-[#D97736]" />
            </div>
            <div className="text-base font-black text-white">Kittu Cafe, Dausa</div>
            <p className="text-[11px] text-[#DFCDB8]/70 mt-1">Shiv Colony, Mariyara Wale</p>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Edit Form Modal/Drawer if active */}
      {isEditing && (
        <div className="bg-white rounded-3xl border border-[#DFCDB8] p-6 shadow-md space-y-4">
          <h3 className="text-sm font-black text-[#231709]">Update Profile Details</h3>
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#5D4037] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
              />
            </div>
            <div>
              <label className="font-bold text-[#5D4037] block mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
              />
            </div>
            <div>
              <label className="font-bold text-[#5D4037] block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#EBE0D2] focus:outline-none focus:border-[#D97736]"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-[#DFCDB8] text-[#5D4037] font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl btn-3d-primary text-white font-black text-xs shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/orders"
          className="p-5 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs hover:border-[#D97736] transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FBECE7] text-[#C86D51] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-black text-[#231709]">My Orders</h3>
            <p className="text-xs text-[#5D4037]">Live tracking & previous receipts</p>
          </div>
        </Link>

        <Link
          href="/profile/addresses"
          className="p-5 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs hover:border-[#D97736] transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] text-[#D97736] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-black text-[#231709]">Saved Addresses</h3>
            <p className="text-xs text-[#5D4037]">Manage home, work & Dausa delivery</p>
          </div>
        </Link>

        <Link
          href="/book-table"
          className="p-5 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs hover:border-[#D97736] transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-black text-[#231709]">Book a Table</h3>
            <p className="text-xs text-[#5D4037]">Reserve your cafe seating in advance</p>
          </div>
        </Link>

        <Link
          href="/offers"
          className="p-5 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs hover:border-[#D97736] transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-black text-[#231709]">Coupons & Offers</h3>
            <p className="text-xs text-[#5D4037]">Exclusive discounts for Kittu loyalists</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity / Default Address preview */}
      <div className="bg-white rounded-3xl border border-[#EBE0D2] p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#231709]">Default Delivery Destination</h2>
          <Link href="/profile/addresses" className="text-xs font-bold text-[#D97736] hover:underline">
            Manage All
          </Link>
        </div>

        {savedAddresses.length > 0 ? (
          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#DFCDB8] flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#C86D51] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-[#231709]">{savedAddresses[0].label}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D97736] text-white">Default</span>
              </div>
              <p className="text-[#5D4037]">
                {savedAddresses[0].street}, {savedAddresses[0].area}, {savedAddresses[0].city} - {savedAddresses[0].postalCode}
              </p>
              {savedAddresses[0].landmark && (
                <p className="text-stone-500 text-[11px]">Landmark: {savedAddresses[0].landmark}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-500">No saved addresses yet.</p>
        )}
      </div>
    </div>
  );
}
