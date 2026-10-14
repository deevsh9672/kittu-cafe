'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Coffee,
  Clock,
  MapPin,
  ShoppingBag,
  Calendar,
  Sparkles,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

interface QuickOption {
  icon: any;
  label: string;
  hindiLabel: string;
  query: string;
}

const QUICK_OPTIONS: QuickOption[] = [
  {
    icon: ShoppingBag,
    label: 'View Digital Menu & Offers',
    hindiLabel: 'डिजिटल मेनू और ऑफ़र्स देखें',
    query: 'Hello Kittu Cafe! I would like to see the digital menu and current special offers.',
  },
  {
    icon: Clock,
    label: 'Track My Active Order',
    hindiLabel: 'अपना चालू ऑर्डर ट्रैक करें',
    query: 'Hello Kittu Cafe! Could you please help me track the status of my order?',
  },
  {
    icon: Calendar,
    label: 'Book a Table in Advance',
    hindiLabel: 'टेबल सीटिंग बुक करें',
    query: 'Hello! I would like to reserve a table at Kittu Cafe, Dausa.',
  },
  {
    icon: MapPin,
    label: 'Cafe Location in Dausa',
    hindiLabel: 'कैफ़े की लोकेशन और पता',
    query: 'Hello! Please share Kittu Cafe exact location in Shiv Colony, Dausa and Google Maps link.',
  },
  {
    icon: Phone,
    label: 'Speak with Cafe Manager',
    hindiLabel: 'मैनेजर से सीधे बात करें',
    query: 'Hello! I need to speak directly with the Kittu Cafe manager regarding my order.',
  },
];

export const WhatsAppChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [hasPrompted, setHasPrompted] = useState(false);

  // Subtle peek notification badge after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenWhatsApp = (messageText: string) => {
    const textToSend = encodeURIComponent(messageText.trim() || 'Hello Kittu Cafe Dausa! I have an inquiry.');
    const whatsappUrl = `https://wa.me/919511317456?text=${textToSend}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    handleOpenWhatsApp(customMessage);
    setCustomMessage('');
  };

  return (
    <>
      {/* Floating WhatsApp Trigger Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
        {/* Teaser Tooltip when closed */}
        {!isOpen && hasPrompted && (
          <div
            onClick={() => setIsOpen(true)}
            className="mb-2 hidden sm:flex items-center gap-2 bg-[#231709] text-white px-3.5 py-2 rounded-2xl shadow-xl border border-[#D97736]/40 cursor-pointer text-xs animate-bounce"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold">Need help? Chat with Kittu Cafe on WhatsApp</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasPrompted(false);
              }}
              className="text-stone-400 hover:text-white ml-1 text-sm font-bold"
            >
              &times;
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setHasPrompted(false);
          }}
          className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer"
          aria-label="Open WhatsApp Customer Service Assistant"
        >
          <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:opacity-50" />
          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <MessageCircle className="w-7 h-7 fill-white text-[#128C7E]" />
          )}
        </button>
      </div>

      {/* Interactive WhatsApp Chat Dialog */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-24 sm:inset-x-auto sm:bottom-24 sm:right-6 z-50 sm:w-96 max-w-sm rounded-3xl bg-white border border-[#EBE0D2] shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#FAF6F0] text-[#231709] flex items-center justify-center font-black shadow-inner">
                  <Coffee className="w-5 h-5 text-[#D97736]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#128C7E]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm leading-tight">Kittu Cafe Dausa</h3>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
                </div>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>Online</span>
                  <span>•</span>
                  <span>Replies within ~2 mins</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="p-4 bg-[#ECE5DD]/40 space-y-3.5 max-h-[380px] overflow-y-auto">
            {/* Cafe Greeting Bubble */}
            <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs border border-stone-200/60 max-w-[90%] space-y-1.5">
              <p className="text-xs text-[#231709] font-medium leading-relaxed">
                <strong className="text-[#075E54]">Namaste! Welcome to Kittu Cafe. 🙏</strong>
                <br />
                नमस्ते! किट्टू कैफ़े दौसा में आपका स्वागत है। हमारे स्पेशल कॉफ़ी, बर्गर या पिज़्ज़ा का आनंद लेने के लिए नीचे दिए गए विकल्प चुनें या सीधे मैसेज लिखें:
              </p>
              <span className="text-[10px] text-stone-400 block text-right">Just now</span>
            </div>

            {/* Quick action buttons */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-bold text-[#5D4037] px-1 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D97736]" />
                <span>Quick Actions (त्वरित सेवा)</span>
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {QUICK_OPTIONS.map((opt, idx) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOpenWhatsApp(opt.query)}
                      className="p-2.5 rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#EBE0D2] text-left transition-all flex items-center gap-2.5 group shadow-xs cursor-pointer active:scale-98"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] group-hover:bg-[#FBECE7] text-[#D97736] flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-[#231709] block truncate group-hover:text-[#C86D51]">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-stone-500 block truncate">
                          {opt.hindiLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Message Input Footer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-[#EBE0D2] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your message to Kittu Cafe..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#25D366] bg-[#FAF6F0]/60 placeholder:text-stone-400"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:bg-[#128C7E] transition-colors shrink-0 shadow-sm cursor-pointer"
              title="Send to WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
