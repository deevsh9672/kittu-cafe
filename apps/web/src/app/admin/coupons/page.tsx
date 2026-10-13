'use client';

import React, { useState } from 'react';
import { Tag, Plus, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice } from '../../../lib/api';

const DEMO_COUPONS = [
  {
    _id: 'c1',
    code: 'KITTU50',
    description: '50% discount up to ₹100 on orders above ₹200',
    discountType: 'percentage',
    discountValue: 50,
    maxDiscountInPaise: 10000,
    minOrderInPaise: 20000,
    usedCount: 42,
    isActive: true,
  },
  {
    _id: 'c2',
    code: 'WELCOME50',
    description: 'Flat ₹50 OFF for welcome orders above ₹250',
    discountType: 'fixed',
    discountValue: 5000,
    minOrderInPaise: 25000,
    usedCount: 78,
    isActive: true,
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(DEMO_COUPONS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">Promotions</span>
          <h1 className="text-2xl font-extrabold text-[#231709]">Coupons & Offers</h1>
          <p className="text-xs text-[#5D4037]">Create promo discount codes with server-authoritative validations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBE0D2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#4E342E] uppercase font-bold border-b border-[#EBE0D2]">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Description</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Redeemed</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-[#FFFEFA] transition-colors">
                  <td className="p-4 font-mono font-bold text-sm text-[#C86D51]">{coupon.code}</td>
                  <td className="p-4 text-[#5D4037]">{coupon.description}</td>
                  <td className="p-4 font-bold text-[#231709]">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% (up to ${formatPrice(coupon.maxDiscountInPaise || 0)})`
                      : formatPrice(coupon.discountValue)}
                  </td>
                  <td className="p-4 text-[#231709]">{formatPrice(coupon.minOrderInPaise)}</td>
                  <td className="p-4 font-bold text-[#231709]">{coupon.usedCount} times</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
