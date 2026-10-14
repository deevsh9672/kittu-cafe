'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Phone,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [phoneOrEmail, setPhoneOrEmail] = useState('+91 98290 11223');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) {
      setMessage({ type: 'error', text: 'Please enter your phone number or email.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setMessage({
        type: 'success',
        text: 'OTP sent to your number. For testing in Dausa, use 123456.',
      });
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      setLoading(false);
      setMessage({
        type: 'success',
        text: 'Password updated successfully! Redirecting to login...',
      });
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#EBE0D2] shadow-3d relative overflow-hidden">
        {/* Top Brand Stripe */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#D97736] via-[#C86D51] to-[#231709]" />

        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#D97736] to-[#C86D51] flex items-center justify-center text-white shadow-lg shadow-[#D97736]/20">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-[#231709] tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-xs text-[#5D4037] font-medium">
            {step === 1
              ? 'Enter your registered phone or email to receive a reset code.'
              : 'Enter the 6-digit OTP and your new password.'}
          </p>
        </div>

        {message && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              message.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {message.type === 'error' ? (
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
                Phone Number or Email
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="+91 98290 XXXXX or email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Reset OTP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
                  6-Digit OTP Code
                </label>
                <span className="text-[11px] font-bold text-[#D97736] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> (Demo: 123456)
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs font-mono tracking-widest text-center font-bold focus:outline-none focus:border-[#D97736]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#231709]">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save New Password</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-[#FAF6F0] text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
