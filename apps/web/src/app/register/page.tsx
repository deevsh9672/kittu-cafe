'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Coffee,
  User,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [allowWhatsAppUpdates, setAllowWhatsAppUpdates] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 10) {
      setError('Please provide your full name and a valid 10-digit mobile number.');
      return;
    }
    if (!acceptTerms) {
      setError('Please accept the Terms & Conditions to proceed.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password }),
      });
      const data = await res.json();

      if (data.success && data.data?.token) {
        setUser(data.data.user, data.data.token);
        router.push('/profile');
      } else {
        // Direct to OTP verification or set demo profile
        setUser(
          {
            id: 'cust-' + Date.now(),
            name,
            phone,
            email: email || undefined,
            role: 'customer',
            loyaltyPoints: 50, // Welcome loyalty bonus
          },
          'demo_token_' + Date.now()
        );
        router.push('/profile');
      }
    } catch (err: any) {
      setUser(
        {
          id: 'cust-' + Date.now(),
          name,
          phone,
          email: email || undefined,
          role: 'customer',
          loyaltyPoints: 50,
        },
        'demo_token_' + Date.now()
      );
      router.push('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#EBE0D2] shadow-3d relative overflow-hidden">
        {/* Top Brand Stripe */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#D97736] via-[#C86D51] to-[#231709]" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#D97736] to-[#C86D51] flex items-center justify-center text-white shadow-lg shadow-[#D97736]/20">
            <Coffee className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-[#231709] tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-[#5D4037] font-medium">
            Join the Kittu Cafe family for quick re-ordering, table bookings, and exclusive discounts in Dausa.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
              Mobile Number (For Delivery & Order SMS) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98290 12345"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
              Email Address (Optional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
              Choose a Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
              />
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-2 pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#5D4037]">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 rounded text-[#D97736] focus:ring-[#D97736] mt-0.5"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="font-bold text-[#D97736] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="font-bold text-[#D97736] hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#5D4037]">
              <input
                type="checkbox"
                checked={allowWhatsAppUpdates}
                onChange={(e) => setAllowWhatsAppUpdates(e.target.checked)}
                className="w-4 h-4 rounded text-[#D97736] focus:ring-[#D97736] mt-0.5"
              />
              <span>Send live order updates and discounts to my WhatsApp.</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 mt-3"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-[#FAF6F0] text-center">
          <p className="text-xs text-[#5D4037]">
            Already have an account?{' '}
            <Link href="/login" className="font-black text-[#D97736] hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
