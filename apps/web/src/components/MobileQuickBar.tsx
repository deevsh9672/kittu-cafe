'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coffee,
  ShoppingBag,
  Sparkles,
  Clock,
  Phone,
  Home,
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
      label: 'Menu',
      icon: Coffee,
      active: pathname.startsWith('/menu'),
    },
    {
      href: '/offers',
      label: 'Offers',
      icon: Sparkles,
      active: pathname === '/offers',
    },
    {
      href: '/orders',
      label: 'Orders',
      icon: Clock,
      active: pathname.startsWith('/orders'),
    },
    {
      href: '/cart',
      label: 'Cart',
      icon: ShoppingBag,
      active: pathname === '/cart',
      badge: totalCount,
    },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFEFA]/95 backdrop-blur-lg border-t border-[#EBE0D2] shadow-2xl px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.active;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
              isActive
                ? 'text-[#C86D51] font-black'
                : 'text-[#8D6E63] font-semibold hover:text-[#231709]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#D97736] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
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
