'use client';

import React, { useState } from 'react';
import {
  QrCode,
  Printer,
  Coffee,
  Download,
  Wifi,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

const TABLES = [
  { id: 't1', label: 'Table 1', zone: 'Indoor Main Lounge' },
  { id: 't2', label: 'Table 2', zone: 'Indoor Main Lounge' },
  { id: 't3', label: 'Table 3', zone: 'Indoor Cozy Booth' },
  { id: 't4', label: 'Table 4', zone: 'Indoor Cozy Booth' },
  { id: 't5', label: 'Table 5', zone: 'Window Seat' },
  { id: 't6', label: 'Table 6', zone: 'Window Seat' },
  { id: 't7', label: 'Table 7', zone: 'Outdoor Patio' },
  { id: 't8', label: 'Table 8', zone: 'Outdoor Patio' },
  { id: 't9', label: 'Table 9', zone: 'Outdoor Patio' },
  { id: 't10', label: 'Table 10', zone: 'Party Lounge' },
  { id: 'counter', label: 'Main Counter', zone: 'Order Pickup' },
  { id: 'takeaway', label: 'Takeaway Kiosk', zone: 'Express Window' },
];

export default function QrMenuPage() {
  const [selectedTable, setSelectedTable] = useState(TABLES[0]);

  const qrTargetUrl = `https://kittucafe.in/menu?table=${selectedTable.id}`;
  // Generate reliable QR code via SVG/QR API
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    qrTargetUrl
  )}&color=23-23-9&bgcolor=255-254-250`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D97736]">
            Dine-In Digital Experience
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231709] tracking-tight mt-1">
            QR Table Generator & Acrylic Standees
          </h1>
          <p className="text-xs text-[#5D4037]">
            Generate and print table-specific QR codes for contactless ordering and instant kitchen dispatch.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print Standee Badge</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table Selector Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#EBE0D2] shadow-xs space-y-4">
            <h3 className="text-sm font-black text-[#231709]">Select Dining Table / Station</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TABLES.map((t) => {
                const isSelected = selectedTable.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTable(t)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#D97736] bg-[#FBECE7]/40 ring-2 ring-[#D97736]/20 shadow-xs'
                        : 'border-[#EBE0D2] bg-white hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <span className="font-black text-xs text-[#231709] block">{t.label}</span>
                    <span className="text-[10px] text-stone-500 font-semibold">{t.zone}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#EBE0D2] space-y-2 text-xs text-[#5D4037]">
            <span className="font-bold text-[#231709] block">How It Works:</span>
            <p>
              1. Guest sits at <strong>{selectedTable.label}</strong> and scans the QR code using any smartphone camera.
            </p>
            <p>
              2. The digital menu opens instantly with <strong>Table #{selectedTable.id}</strong> pre-tagged.
            </p>
            <p>
              3. When they checkout, the Kitchen Display System (KDS) immediately flashes orders for <strong>{selectedTable.label}</strong> with zero waiter delay!
            </p>
          </div>
        </div>

        {/* Printable Standee Preview Card (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            id="printable-standee"
            className="w-full max-w-sm rounded-3xl bg-[#FFFEFA] border-2 border-[#231709] p-6 text-center space-y-5 shadow-2xl relative overflow-hidden"
          >
            {/* Top Brand Banner */}
            <div className="space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#D97736] flex items-center justify-center text-white shadow-md">
                <Coffee className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-[#231709] tracking-tight">Kittu Cafe</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C86D51]">
                Dausa &bull; Artisanal Kitchen
              </span>
            </div>

            {/* Table Number Highlight */}
            <div className="py-2 px-4 rounded-xl bg-[#231709] text-white inline-block shadow-xs">
              <span className="text-sm font-black tracking-wider uppercase">
                {selectedTable.label}
              </span>
            </div>

            {/* Rendered QR Code */}
            <div className="p-4 bg-white rounded-2xl border-2 border-[#EBE0D2] inline-block shadow-inner">
              <img
                src={qrImageSrc}
                alt={`QR code for ${selectedTable.label}`}
                className="w-48 h-48 mx-auto"
              />
            </div>

            {/* Instructions */}
            <div className="space-y-1">
              <p className="text-xs font-black text-[#231709] uppercase tracking-wider">
                Scan to View Digital Menu & Order
              </p>
              <p className="text-[10px] text-stone-500 font-mono truncate">
                {qrTargetUrl}
              </p>
            </div>

            {/* WiFi & Bottom Perks */}
            <div className="pt-3 border-t border-[#EBE0D2] flex items-center justify-between text-[10px] font-semibold text-stone-600">
              <div className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-[#D97736]" />
                <span>Free WiFi: KittuCafe_Guest</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D97736]" />
                <span>Shiv Colony</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
