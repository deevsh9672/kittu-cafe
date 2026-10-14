'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Coffee,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@kittucafe.in');
  const [password, setPassword] = useState('KittuCafe@Admin2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Call authentication endpoint or store session demo token
    setTimeout(() => {
      if (password.length < 4) {
        setError('Please enter a valid password.');
        setIsLoading(false);
        return;
      }

      // Store auth token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'kittu_admin_token',
          JSON.stringify({
            token: 'kittu_admin_session_token_' + Date.now(),
            role: email.includes('admin') ? 'owner' : email.includes('kitchen') ? 'kitchen' : 'cashier',
            email,
          })
        );
      }

      setIsLoading(false);
      router.push('/admin');
    }, 600);
  };

  const handleQuickLogin = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#EBE0D2] shadow-3d relative overflow-hidden">
        {/* Top Decorative Strip */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#D97736] via-[#C86D51] to-[#231709]" />

        {/* Cafe Identity */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#D97736] to-[#C86D51] flex items-center justify-center text-white shadow-lg shadow-[#D97736]/20">
            <Coffee className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#231709] tracking-tight">
              Kittu Cafe Staff Portal
            </h1>
            <p className="text-xs text-[#5D4037] font-medium mt-1">
              Authorized Cafe Management & Kitchen Operations
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
              Staff Email / User ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@kittucafe.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
                Password / PIN
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all mt-2 active:scale-95"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Log In to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Demo Roles Quick Autofill Bar */}
        <div className="pt-4 border-t border-[#FAF6F0] space-y-2.5">
          <span className="block text-[10px] font-black uppercase tracking-wider text-stone-400 text-center">
            Demo Credentials (1-Click Fill)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@kittucafe.in', 'KittuCafe@Admin2026')}
              className="px-2 py-1.5 rounded-lg border border-[#EBE0D2] bg-[#FAF6F0] hover:bg-[#F5EBE1] text-[11px] font-bold text-[#3E2723] text-center cursor-pointer transition-colors"
            >
              Owner
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('cashier@kittucafe.in', 'Cashier@2026')}
              className="px-2 py-1.5 rounded-lg border border-[#EBE0D2] bg-[#FAF6F0] hover:bg-[#F5EBE1] text-[11px] font-bold text-[#3E2723] text-center cursor-pointer transition-colors"
            >
              Cashier
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('kitchen@kittucafe.in', 'Kitchen@2026')}
              className="px-2 py-1.5 rounded-lg border border-[#EBE0D2] bg-[#FAF6F0] hover:bg-[#F5EBE1] text-[11px] font-bold text-[#3E2723] text-center cursor-pointer transition-colors"
            >
              KDS Staff
            </button>
          </div>
        </div>

        {/* Return to Public Site */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs font-bold text-[#D97736] hover:underline"
          >
            &larr; Return to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}
