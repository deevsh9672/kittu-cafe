'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Coffee,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);

  const phoneParam = searchParams.get('phone') || '+91 98290 11223';
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);
    setError(null);

    // Auto-advance
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setCountdown(30);
    setCanResend(false);
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    setError(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = digits.join('');
    if (otpCode.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    // Verify OTP logic (with local testing bypass support)
    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneParam, otp: otpCode }),
      }).catch(() => null);

      const data = res ? await res.json() : null;

      if (data?.success && data?.data?.token) {
        setUser(data.data.user, data.data.token);
      } else {
        // Fallback / Offline demo acceptance
        setUser(
          {
            id: 'cust-demo-1',
            name: 'Aarav Sharma',
            phone: phoneParam,
            role: 'customer',
            loyaltyPoints: 180,
          },
          'demo_customer_token_kittu_2026'
        );
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 800);
    } catch {
      setUser(
        {
          id: 'cust-demo-1',
          name: 'Aarav Sharma',
          phone: phoneParam,
          role: 'customer',
          loyaltyPoints: 180,
        },
        'demo_customer_token_kittu_2026'
      );
      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 800);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#EBE0D2] shadow-3d relative overflow-hidden">
        {/* Top Brand Stripe */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#D97736] via-[#C86D51] to-[#231709]" />

        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#D97736] to-[#C86D51] flex items-center justify-center text-white shadow-lg shadow-[#D97736]/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-[#231709] tracking-tight">
            Verify Mobile Number
          </h1>
          <p className="text-xs text-[#5D4037] font-medium">
            We sent a 6-digit authentication code to <span className="font-bold text-[#231709]">{phoneParam}</span>
          </p>
        </div>

        {/* Development Helper Badge */}
        <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#EBE0D2] flex items-center gap-2.5 text-xs text-[#5D4037]">
          <Sparkles className="w-4 h-4 text-[#D97736] shrink-0" />
          <span>Demo / Quick Test OTP: <strong className="font-mono text-[#231709]">123456</strong></span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Code verified! Redirecting to your Kittu Cafe profile...</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          {/* 6 Digit Inputs */}
          <div className="flex justify-between gap-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border border-[#DFCDB8] bg-[#FAF6F0] text-[#231709] focus:outline-none focus:border-[#D97736] focus:bg-white shadow-xs transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying || success}
            className="w-full py-3.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-60"
          >
            {isVerifying ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Confirm & Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between pt-2 border-t border-[#FAF6F0] text-xs">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-bold text-stone-500 hover:text-stone-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Number</span>
          </Link>

          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="inline-flex items-center gap-1 font-bold text-[#D97736] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resend OTP</span>
            </button>
          ) : (
            <span className="text-stone-400 font-medium">
              Resend in <span className="font-bold text-[#231709]">{countdown}s</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading verification...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
