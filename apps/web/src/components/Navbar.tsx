'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, ShoppingBag, Calendar, Phone, ShieldCheck, MapPin } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 bg-[#FFFEFA]/90 backdrop-blur-md border-b border-[#EBE0D2]/80 shadow-xs">
      {/* Top 3D micro-bar with verified cafe information */}
      <div className="bg-[#231709] text-[#FAF6F0] text-xs py-1.5 px-4 border-b border-[#3E2723]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#D97736]" />
            <span className="font-medium">W82P+3P7, Shiv Colony, Mariyara Wale, Dausa, Rajasthan</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[#DFCDB8]">Open Daily: 10:00 AM – 10:30 PM</span>
            <a
              href="tel:+919511317456"
              className="flex items-center gap-1.5 text-[#D97736] hover:underline font-bold"
            >
              <Phone className="w-3 h-3" />
              <span>+91 95113 17456</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D97736] to-[#C86D51] flex items-center justify-center text-white shadow-md shadow-[#D97736]/20 border border-white/20 transition-transform group-hover:scale-105">
            <Coffee className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-[#231709] block leading-tight">
              Kittu Cafe
            </span>
            <span className="text-[10px] tracking-widest uppercase font-extrabold text-[#C86D51]">
              Dausa • Rajasthan
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7">
          <Link
            href="/menu"
            className={`text-sm transition-colors ${
              pathname === '/menu' ? 'text-[#C86D51] font-extrabold' : 'text-[#4E342E] font-bold hover:text-[#C86D51]'
            }`}
          >
            Digital Menu
          </Link>
          <Link
            href="/book-table"
            className={`text-sm transition-colors ${
              pathname === '/book-table' ? 'text-[#C86D51] font-extrabold' : 'text-[#4E342E] font-bold hover:text-[#C86D51]'
            }`}
          >
            Book Table
          </Link>
          <Link
            href="/#about"
            className="text-sm font-bold text-[#4E342E] hover:text-[#C86D51] transition-colors"
          >
            About & Directions
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#F5EBE1] text-[#3E2723] hover:bg-[#EBE0D2] transition-colors border border-[#DFCDB8] shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C86D51]" />
            <span>Staff Portal</span>
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl btn-3d-primary text-white cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#D97736]" />
            <span className="text-xs font-bold hidden sm:inline">Cart</span>
            {totalItemCount > 0 && (
              <span className="bg-[#D97736] text-white text-[11px] font-black px-2 py-0.5 rounded-full min-w-[22px] text-center shadow-xs">
                {totalItemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};
