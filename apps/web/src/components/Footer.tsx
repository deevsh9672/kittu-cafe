import React from 'react';
import Link from 'next/link';
import { Coffee, MapPin, Phone, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#231709] text-[#FAF6F0] pt-12 pb-8 border-t border-[#3E2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Cafe Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#D97736] flex items-center justify-center text-white">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {BUSINESS_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-[#DFCDB8] leading-relaxed">
              Handcrafted coffee, gourmet sandwiches, stone-baked pizzas, and heartwarming hospitality in Dausa, Rajasthan.
            </p>
          </div>

          {/* Location & Directions */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-[#D97736] uppercase">Location</h4>
            <div className="flex items-start gap-2.5 text-sm text-[#DFCDB8]">
              <MapPin className="w-4 h-4 text-[#D97736] shrink-0 mt-0.5" />
              <span>{BUSINESS_CONFIG.address}</span>
            </div>
            <a
              href={BUSINESS_CONFIG.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97736] hover:underline pt-1"
            >
              <span>Get Google Maps Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-[#D97736] uppercase">Hours & Contact</h4>
            <div className="flex items-center gap-2 text-sm text-[#DFCDB8]">
              <Phone className="w-4 h-4 text-[#D97736] shrink-0" />
              <a href={`tel:${BUSINESS_CONFIG.contactNumber}`} className="hover:underline">
                {BUSINESS_CONFIG.contactNumber}
              </a>
            </div>
            <div className="flex items-start gap-2 text-sm text-[#DFCDB8]">
              <Clock className="w-4 h-4 text-[#D97736] shrink-0 mt-0.5" />
              <div>
                <p>Mon – Thu: 10:00 AM – 10:30 PM</p>
                <p>Fri – Sun: 10:00 AM – 11:00 PM</p>
              </div>
            </div>
          </div>

          {/* Quick Links & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-[#D97736] uppercase">Explore</h4>
            <ul className="space-y-1.5 text-xs text-[#DFCDB8]">
              <li>
                <Link href="/menu" className="hover:text-white transition-colors">
                  Digital Menu & Ordering
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-white transition-colors">
                  Deals & Promo Offers
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/book-table" className="hover:text-white transition-colors">
                  Book a Table
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Kittu Cafe
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Directions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Policies & Staff Link Bar */}
        <div className="pt-6 pb-2 border-t border-[#3E2723]/60 flex flex-wrap items-center justify-between text-xs text-[#DFCDB8] gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-[#D97736] transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-[#D97736] transition-colors">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link href="/refund-policy" className="hover:text-[#D97736] transition-colors">
              Refund & Cancellation
            </Link>
          </div>

          <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1.5 font-bold text-[#D97736]">
            <ShieldCheck className="w-4 h-4" />
            <span>Staff / Admin Login</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-[#3E2723]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#DFCDB8] gap-4">
          <p>© {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved.</p>
          <p className="flex items-center gap-1 text-center">
            <span>Shiv Colony, Mariyara Wale, Dausa 303303 • GST & FSSAI Compliant Platform</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
