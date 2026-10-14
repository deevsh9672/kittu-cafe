'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  CalendarDays,
  Coffee,
  Layers,
  Wine,
  Carrot,
  History,
  Truck,
  FileSpreadsheet,
  AlertTriangle,
  Tag,
  Users,
  BarChart3,
  Receipt,
  UserCheck,
  Settings,
  QrCode,
  Bell,
  ShieldAlert,
  ExternalLink,
  ChevronDown,
  Menu as MenuIcon,
  X,
  Package,
} from 'lucide-react';

interface NavGroup {
  groupTitle: string;
  items: {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const ADMIN_NAVIGATION: NavGroup[] = [
  {
    groupTitle: 'Operations',
    items: [
      { href: '/admin', label: 'Overview Dashboard', icon: LayoutDashboard },
      { href: '/admin/orders', label: 'Live Orders', icon: UtensilsCrossed, badge: 'Live' },
      { href: '/admin/kds', label: 'Kitchen KDS', icon: ChefHat },
      { href: '/admin/reservations', label: 'Table Bookings', icon: CalendarDays },
    ],
  },
  {
    groupTitle: 'Menu & Catalog',
    items: [
      { href: '/admin/menu', label: 'Dishes & Recipes', icon: Coffee },
      { href: '/admin/categories', label: 'Menu Categories', icon: Layers },
    ],
  },
  {
    groupTitle: 'Inventory & Supply',
    items: [
      { href: '/admin/inventory', label: 'All Inventory & Supply', icon: Package },
      { href: '/admin/beverages', label: 'Beverage Stock (Bottles/Cans)', icon: Wine },
      { href: '/admin/ingredients', label: 'Food Ingredients (kg/L)', icon: Carrot },
      { href: '/admin/stock-movements', label: 'Stock Movement Ledger', icon: History },
      { href: '/admin/low-stock', label: 'Low Stock Alerts', icon: AlertTriangle, badge: 'Alert' },
      { href: '/admin/suppliers', label: 'Suppliers Directory', icon: Truck },
      { href: '/admin/purchase-orders', label: 'Purchase Orders (PO)', icon: FileSpreadsheet },
    ],
  },
  {
    groupTitle: 'Finance & Analytics',
    items: [
      { href: '/admin/sales-reports', label: 'Sales & Profit Analytics', icon: BarChart3 },
      { href: '/admin/expenses', label: 'Operating Expenses', icon: Receipt },
    ],
  },
  {
    groupTitle: 'Marketing & CRM',
    items: [
      { href: '/admin/coupons', label: 'Coupons & Discounts', icon: Tag },
      { href: '/admin/customers', label: 'Customer Directory', icon: Users },
      { href: '/admin/qr-menu', label: 'QR Table Generator', icon: QrCode },
    ],
  },
  {
    groupTitle: 'Management & System',
    items: [
      { href: '/admin/staff', label: 'Staff & Roles', icon: UserCheck },
      { href: '/admin/cms', label: 'Cafe CMS & Branding', icon: Settings },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell },
      { href: '/admin/audit-logs', label: 'Audit Logs & Security', icon: ShieldAlert },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#231709] text-white p-4 flex items-center justify-between border-b border-[#3E2723]">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D97736] flex items-center justify-center font-bold text-white">
            K
          </div>
          <div>
            <span className="font-bold text-sm block leading-tight text-white">Kittu Cafe</span>
            <span className="text-[10px] text-[#D97736] font-semibold uppercase tracking-wider">
              Admin & Operations (21 Modules)
            </span>
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-[#3E2723] text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Sheet */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:flex w-full md:w-72 bg-[#231709] text-white flex-col justify-between shrink-0 border-r border-[#3E2723] h-auto md:h-screen sticky top-0 overflow-y-auto`}
      >
        <div className="p-5 space-y-6">
          {/* Header */}
          <div className="hidden md:flex items-center justify-between pb-2 border-b border-[#3E2723]">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D97736] to-[#C86D51] flex items-center justify-center font-black text-white shadow-md">
                K
              </div>
              <div>
                <span className="font-black text-sm block leading-tight text-white">Kittu Cafe</span>
                <span className="text-[10px] text-[#D97736] font-bold uppercase tracking-wider">
                  21-Module Admin Suite
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-6">
            {ADMIN_NAVIGATION.map((group) => (
              <div key={group.groupTitle} className="space-y-1">
                <span className="block px-3 text-[10px] font-black uppercase tracking-widest text-[#DFCDB8]/60">
                  {group.groupTitle}
                </span>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-[#D97736] text-white shadow-xs'
                          : 'text-[#DFCDB8] hover:bg-[#3E2723] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                            item.badge === 'Alert'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Location & Customer Link */}
        <div className="p-4 border-t border-[#3E2723] space-y-2 bg-[#1A1006]">
          <div className="px-3 py-2 rounded-xl bg-[#2F1C0C] text-[11px] text-[#DFCDB8] space-y-0.5">
            <span className="block font-bold text-white">Kittu Cafe, Dausa</span>
            <span className="text-[10px] text-stone-400">Shiv Colony &bull; +91 95113 17456</span>
          </div>
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#DFCDB8] hover:text-white transition-colors"
          >
            <span>Customer Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
