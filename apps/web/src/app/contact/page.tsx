'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  MessageSquare,
  Send,
  ExternalLink,
  CheckCircle2,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <span className="text-xs font-black uppercase tracking-wider text-[#C86D51]">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#231709] tracking-tight">
          Contact & Directions
        </h1>
        <p className="text-xs sm:text-sm text-[#5D4037] leading-relaxed">
          We would love to hear from you. Whether you have questions regarding table reservations, private party catering, dietary requests, or just want to say hi, reach out to our team in Dausa.
        </p>
      </div>

      {/* Main Grid: Details & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Address Card */}
          <div className="p-6 rounded-3xl bg-[#FFFEFA] border border-[#EBE0D2] shadow-3d space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FBECE7] flex items-center justify-center text-[#D97736]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#231709]">Cafe Location</h3>
                <span className="text-[11px] text-stone-500 font-semibold uppercase">Shiv Colony, Dausa</span>
              </div>
            </div>
            <p className="text-xs text-[#5D4037] leading-relaxed">
              {BUSINESS_CONFIG.address}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={BUSINESS_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-3d-primary text-white text-xs font-black cursor-pointer shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-white" />
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-white" />
              </a>
            </div>
          </div>

          {/* Phone & Direct WhatsApp */}
          <div className="p-6 rounded-3xl bg-[#FFFEFA] border border-[#EBE0D2] shadow-3d space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#231709]">Phone & WhatsApp</h3>
                <span className="text-[11px] text-stone-500 font-semibold uppercase">Instant Support</span>
              </div>
            </div>
            <div className="space-y-2">
              <a
                href={`tel:${BUSINESS_CONFIG.contactNumber}`}
                className="block text-sm font-black text-[#231709] hover:text-[#D97736] transition-colors"
              >
                {BUSINESS_CONFIG.contactNumber}
              </a>
              <p className="text-xs text-[#6D4C41]">
                Available every day for order status, takeaway pickups, and party bookings.
              </p>
            </div>
            <a
              href={`https://wa.me/919511317456?text=${encodeURIComponent(
                'Hello Kittu Cafe, I would like to make an inquiry about orders/table reservation.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Operating Hours */}
          <div className="p-6 rounded-3xl bg-[#FFFEFA] border border-[#EBE0D2] shadow-3d space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#231709]">Cafe Hours</h3>
                <span className="text-[11px] text-stone-500 font-semibold uppercase">Open 7 Days a Week</span>
              </div>
            </div>
            <div className="text-xs text-[#5D4037] space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold">Monday – Thursday</span>
                <span>10:00 AM – 10:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Friday – Sunday</span>
                <span>10:00 AM – 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-[#EBE0D2] shadow-3d space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#231709]">Send Us a Message</h2>
            <p className="text-xs text-[#5D4037] mt-1">
              Fill in your details below and our team will get back to you shortly.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-3 bg-[#FAF6F0] rounded-2xl border border-emerald-200 p-6 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#231709]">Message Received!</h3>
              <p className="text-xs text-[#5D4037] max-w-sm mx-auto">
                Thank you for contacting Kittu Cafe. We have received your inquiry and will respond within a few hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
                }}
                className="mt-2 text-xs font-black text-[#D97736] hover:underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#231709]">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#231709]">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#231709]">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#231709]">Inquiry Type</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736] bg-white cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Party / Birthday Booking">Party / Birthday Booking</option>
                    <option value="Corporate Catering">Corporate Catering</option>
                    <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#231709]">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE0D2] text-xs focus:outline-none focus:border-[#D97736] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform active:scale-95"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Embedded Map Section */}
      <div className="rounded-3xl overflow-hidden border border-[#EBE0D2] shadow-3d space-y-0">
        <div className="bg-[#231709] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D97736]" />
            <span className="text-xs font-bold">Kittu Cafe Google Maps Locator (Shiv Colony, Dausa)</span>
          </div>
          <a
            href={BUSINESS_CONFIG.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#D97736] hover:underline flex items-center gap-1"
          >
            <span>Open in Maps App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="w-full h-80 bg-stone-200 relative">
          <iframe
            title="Kittu Cafe Location Map"
            src="https://maps.google.com/maps?q=26.8951,76.3386&hl=en&z=15&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
