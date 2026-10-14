'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Store,
  Heart,
  User,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const MobileQuickBar: React.FC = () => {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setTotalCount(items.reduce((sum, item) => sum + item.quantity, 0));
  }, [items]);

  // Don't show bottom bar on admin panel
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Home', icon: Home, active: pathname === '/' },
    {
      href: '/menu',
      label: 'Shop',
      icon: Store,
      active: pathname.startsWith('/menu'),
    },
    {
      href: '/offers',
      label: 'Favorite',
      icon: Heart,
      active: pathname === '/offers',
    },
    {
      href: '/cart',
      label: 'Cart',
      icon: ShoppingBag,
      active: pathname === '/cart',
      badge: totalCount,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
      active: pathname.startsWith('/profile') || pathname === '/login',
    },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] px-3 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.active;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
              isActive
                ? 'text-[#1B4332] font-black scale-105'
                : 'text-stone-400 font-semibold hover:text-stone-700'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'stroke-[2.5] fill-[#1B4332]/10' : 'stroke-[1.8]'
                }`}
              />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#1B4332] text-white text-[9px] font-black px-1 py-0.2 rounded-full min-w-[15px] text-center shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
