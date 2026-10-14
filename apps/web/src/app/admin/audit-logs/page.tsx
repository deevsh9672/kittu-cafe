'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Activity,
  Server,
  Lock,
  UserCheck,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  details: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'warning' | 'critical';
}

const DEMO_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    actor: 'Amit Sharma',
    role: 'Owner',
    action: 'PRICE_UPDATE',
    target: 'Kittu Hazelnut Cold Coffee',
    details: 'Base price adjusted from ₹130 to ₹140 (Paise: 13000 -> 14000)',
    ip: '192.168.1.10 (Cafe POS Station)',
    timestamp: 'Today, 2:15 PM',
    status: 'success',
  },
  {
    id: 'log-2',
    actor: 'Vikram Singh',
    role: 'Manager',
    action: 'INVENTORY_OVERRIDE',
    target: 'Fresh Whole Dairy Milk',
    details: 'Physical count verified and adjusted (+5.0L delivery receipt)',
    ip: '192.168.1.14 (Kitchen Tablet)',
    timestamp: 'Today, 11:30 AM',
    status: 'success',
  },
  {
    id: 'log-3',
    actor: 'Cashier Station #1',
    role: 'Cashier',
    action: 'ORDER_CANCELLED',
    target: 'Order #ORD-1079',
    details: 'Guest requested cancellation before kitchen dispatch. Refund initiated.',
    ip: '192.168.1.12 (Billing Counter)',
    timestamp: 'Yesterday, 8:40 PM',
    status: 'warning',
  },
  {
    id: 'log-4',
    actor: 'Admin Portal',
    role: 'System',
    action: 'STAFF_LOGIN',
    target: 'admin@kittucafe.in',
    details: 'Session token issued with Owner privileges (Role: owner)',
    ip: '103.21.12.84 (Dausa Broadband)',
    timestamp: 'Yesterday, 9:00 AM',
    status: 'success',
  },
  {
    id: 'log-5',
    actor: 'System Scheduler',
    role: 'Daemon',
    action: 'DAILY_BACKUP',
    target: 'MongoDB Database',
    details: 'Snapshot of all collections and immutable ledgers persisted.',
    ip: '127.0.0.1 (Internal Worker)',
    timestamp: 'Yesterday, 2:00 AM',
    status: 'success',
  },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(DEMO_LOGS);
  const [search, setSearch] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
          Security & Compliance
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
          Audit Logs & System Health
        </h1>
        <p className="text-xs text-[#5D4037]">
          Immutable activity tracking for all administrative actions, price adjustments, role escalations, and system health.
        </p>
      </div>

      {/* System Health Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-bold uppercase">
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span>API Server Uptime</span>
          </div>
          <span className="text-xl font-black text-[#231709]">99.98%</span>
          <span className="text-[10px] text-emerald-600 font-semibold block">Online on Port 5000</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-bold uppercase">
            <Activity className="w-3.5 h-3.5 text-[#D97736]" />
            <span>DB Query Latency</span>
          </div>
          <span className="text-xl font-black text-[#231709]">12 ms</span>
          <span className="text-[10px] text-stone-500 font-semibold block">MongoDB Atlas Primary</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-bold uppercase">
            <HardDrive className="w-3.5 h-3.5 text-blue-600" />
            <span>Ledger Integrity</span>
          </div>
          <span className="text-xl font-black text-emerald-600">100% Valid</span>
          <span className="text-[10px] text-stone-500 font-semibold block">Zero Tampering Detected</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-bold uppercase">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>RBAC Security</span>
          </div>
          <span className="text-xl font-black text-[#231709]">Active</span>
          <span className="text-[10px] text-stone-500 font-semibold block">Owner / Staff Enforced</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE0D2] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Filter audit logs by actor, action type, target item, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-[#231709]"
        />
      </div>

      {/* Audit Log Table */}
      <div className="rounded-3xl bg-white border border-[#EBE0D2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#EBE0D2] text-[10px] font-black uppercase text-[#5D4037] tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor & Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Activity Description</th>
                <th className="p-4 text-right">Terminal IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#FFFDFB] transition-colors">
                  <td className="p-4 text-stone-500 whitespace-nowrap font-medium">
                    {log.timestamp}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-[#231709] block">{log.actor}</span>
                    <span className="text-[10px] text-stone-500 font-semibold uppercase">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-black bg-[#FAF6F0] text-[#231709] border border-[#EBE0D2]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-stone-700">{log.target}</td>
                  <td className="p-4 text-stone-600 max-w-sm truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="p-4 text-right font-mono text-[11px] text-stone-500">
                    {log.ip}
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
