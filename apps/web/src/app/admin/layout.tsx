'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  Package,
  CalendarDays,
  Tag,
  Users,
  Settings,
  Coffee,
  ExternalLink,
} from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Live Orders', icon: UtensilsCrossed },
  { href: '/admin/kds', label: 'Kitchen KDS', icon: ChefHat },
  { href: '/admin/menu', label: 'Menu Manager', icon: Coffee },
  { href: '/admin/inventory', label: 'Inventory & Stock', icon: Package },
  { href: '/admin/reservations', label: 'Table Bookings', icon: CalendarDays },
  { href: '/admin/coupons', label: 'Coupons & Offers', icon: Tag },
  { href: '/admin/staff', label: 'Staff & Audit', icon: Users },
  { href: '/admin/cms', label: 'Cafe Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#231709] text-white flex flex-col justify-between shrink-0 border-r border-[#3E2723]">
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D97736] flex items-center justify-center font-bold text-white">
                K
              </div>
              <div>
                <span className="font-bold text-sm block leading-tight text-white">Kittu Cafe</span>
                <span className="text-[10px] text-[#D97736] font-semibold uppercase tracking-wider">
                  Admin & Operations
                </span>
              </div>
            </Link>
          </div>

          <nav className="space-y-1">
            {ADMIN_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#D97736] text-white'
                      : 'text-[#DFCDB8] hover:bg-[#3E2723] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#3E2723] space-y-2">
          <div className="px-3 py-2 rounded-xl bg-[#3E2723]/50 text-[11px] text-[#DFCDB8]">
            <span className="block font-bold text-white">Location</span>
            <span>Shiv Colony, Dausa 303303</span>
          </div>
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 text-xs text-[#DFCDB8] hover:text-white transition-colors"
          >
            <span>Customer Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
