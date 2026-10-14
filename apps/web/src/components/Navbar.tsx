'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coffee,
  ShoppingBag,
  Calendar,
  Phone,
  ShieldCheck,
  MapPin,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/menu', label: 'Digital Menu' },
    { href: '/offers', label: 'Offers' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/book-table', label: 'Book Table' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFEFA]/95 backdrop-blur-md border-b border-[#EBE0D2]/80 shadow-xs">
      {/* Top micro-bar with verified cafe information */}
      <div className="bg-[#231709] text-[#FAF6F0] text-xs py-1.5 px-4 border-b border-[#3E2723]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#D97736]" />
            <span className="font-medium text-[11px] sm:text-xs">
              W82P+3P7, Shiv Colony, Mariyara Wale, Dausa, Rajasthan
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[#DFCDB8] text-[11px]">
              Open Daily: 10:00 AM – 10:30 PM
            </span>
            <a
              href="tel:+919511317456"
              className="flex items-center gap-1.5 text-[#D97736] hover:underline font-bold text-[11px]"
            >
              <Phone className="w-3 h-3" />
              <span>+91 95113 17456</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
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

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/menu'
                ? pathname.startsWith('/menu')
                : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'text-[#C86D51] font-black'
                    : 'text-[#4E342E] font-bold hover:text-[#C86D51]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Actions / Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Staff Portal Link */}
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-[#F5EBE1] text-[#3E2723] hover:bg-[#EBE0D2] transition-colors border border-[#DFCDB8] shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C86D51]" />
            <span>Staff Portal</span>
          </Link>

          {/* Customer Auth Profile or Login */}
          {mounted && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#DFCDB8] hover:border-[#D97736] shadow-xs cursor-pointer transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D97736] to-[#C86D51] text-white flex items-center justify-center text-xs font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-[#231709] hidden sm:inline max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EBE0D2] py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-[#FAF6F0]">
                    <p className="font-black text-[#231709] truncate">{user.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user.phone}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#D97736]">
                      <Sparkles className="w-3 h-3" />
                      <span>{user.loyaltyPoints} Loyalty Beans</span>
                    </div>
                  </div>

                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-2 text-[#5D4037] hover:bg-[#FAF6F0] font-bold"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#C86D51]" />
                    <span>My Orders & Tracking</span>
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-[#5D4037] hover:bg-[#FAF6F0] font-bold"
                  >
                    <User className="w-3.5 h-3.5 text-[#D97736]" />
                    <span>Customer Profile</span>
                  </Link>

                  <Link
                    href="/profile/addresses"
                    className="flex items-center gap-2 px-4 py-2 text-[#5D4037] hover:bg-[#FAF6F0] font-bold"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#5D4037]" />
                    <span>Saved Addresses</span>
                  </Link>

                  <div className="pt-1 mt-1 border-t border-[#FAF6F0]">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-white text-[#231709] hover:bg-[#FAF6F0] transition-colors border border-[#DFCDB8] shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-[#D97736]" />
              <span className="hidden sm:inline">Login / Register</span>
              <span className="sm:hidden">Login</span>
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl btn-3d-primary text-white cursor-pointer active:scale-95 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#D97736]" />
            <span className="text-xs font-bold hidden sm:inline">Cart</span>
            {totalItemCount > 0 && (
              <span className="bg-[#D97736] text-white text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-xs">
                {totalItemCount}
              </span>
            )}
          </Link>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#231709] hover:bg-[#FAF6F0] border border-transparent hover:border-[#DFCDB8] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFEFA] border-b border-[#DFCDB8] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`p-3 rounded-xl border text-center font-bold ${
                  pathname === link.href || (link.href === '/menu' && pathname.startsWith('/menu'))
                    ? 'bg-[#FAF6F0] text-[#C86D51] border-[#D97736]'
                    : 'bg-white text-[#4E342E] border-[#EBE0D2]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#FAF6F0] flex flex-col gap-2">
            <Link
              href="/orders"
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EBE0D2] text-xs font-bold text-[#231709]"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D97736]" />
                <span>My Orders & Live Tracking</span>
              </div>
              <span className="text-[#C86D51]">&rarr;</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center justify-between p-3 rounded-xl bg-[#F5EBE1] border border-[#DFCDB8] text-xs font-bold text-[#3E2723]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C86D51]" />
                <span>Staff Admin & Kitchen KDS</span>
              </div>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
