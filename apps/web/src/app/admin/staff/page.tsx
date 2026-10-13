'use client';

import React, { useState } from 'react';
import { Users, Shield, History, Plus } from 'lucide-react';

const DEMO_STAFF = [
  { _id: 's1', name: 'Kittu Admin', phone: '+91 95113 17456', email: 'admin@kittucafe.in', role: 'admin', isActive: true },
  { _id: 's2', name: 'Chef Rampal', phone: '+91 95113 17457', email: 'kitchen@kittucafe.in', role: 'kitchen', isActive: true },
  { _id: 's3', name: 'Mahesh Cashier', phone: '+91 98291 00221', email: 'cashier@kittucafe.in', role: 'cashier', isActive: true },
];

const DEMO_AUDIT_LOGS = [
  { action: 'UPDATE_ORDER_STATUS', performedBy: '+919511317457', role: 'kitchen', details: 'Order KC-104921 marked as preparing', time: '5 mins ago' },
  { action: 'LOGIN_SUCCESS', performedBy: '+919511317456', role: 'admin', details: 'Staff portal sign-in from Dausa IP', time: '22 mins ago' },
  { action: 'ADJUST_STOCK', performedBy: '+919511317456', role: 'admin', details: 'Full Cream Milk adjusted by +2000ml', time: '1 hour ago' },
];

export default function AdminStaffPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">Access Control</span>
        <h1 className="text-2xl font-extrabold text-[#231709]">Staff Members & Audit Trails</h1>
        <p className="text-xs text-[#5D4037]">Role-based access permissions (Admin, Kitchen, Cashier, Delivery).</p>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-2xl border border-[#EBE0D2] overflow-hidden shadow-sm space-y-4 p-5">
        <h3 className="text-sm font-bold text-[#231709]">Active Team Members</h3>
        <div className="divide-y divide-[#FAF6F0]">
          {DEMO_STAFF.map((member) => (
            <div key={member._id} className="py-3 first:pt-0 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#231709] block">{member.name}</span>
                <span className="text-xs text-[#5D4037]">{member.phone} • {member.email}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#FBECE7] text-[#C86D51]">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-[#EBE0D2] overflow-hidden shadow-sm space-y-4 p-5">
        <h3 className="text-sm font-bold text-[#231709] flex items-center gap-2">
          <History className="w-4 h-4 text-[#C86D51]" />
          <span>Security & Action Audit Logs</span>
        </h3>
        <div className="divide-y divide-[#FAF6F0] text-xs">
          {DEMO_AUDIT_LOGS.map((log, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-[#231709] mr-2">{log.action}</span>
                <span className="text-[#5D4037]">{log.details}</span>
              </div>
              <span className="text-stone-400 shrink-0 ml-4">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
