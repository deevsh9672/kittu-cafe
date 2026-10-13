'use client';

import React, { useState } from 'react';
import { CalendarDays, CheckCircle, XCircle, Phone, Clock, Users } from 'lucide-react';
import { ReservationStatus } from '@kittu-cafe/shared';

const DEMO_BOOKINGS: any[] = [
  {
    _id: 'b1',
    reservationNumber: 'RES-891024',
    customerName: 'Rohit Khandelwal',
    customerPhone: '+91 98280 98765',
    partySize: 4,
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '19:30',
    tableNumber: 'Table T1',
    status: 'confirmed',
    specialRequests: 'Anniversary celebration',
  },
  {
    _id: 'b2',
    reservationNumber: 'RES-891025',
    customerName: 'Sunita Sharma',
    customerPhone: '+91 94130 11223',
    partySize: 2,
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '20:30',
    tableNumber: 'Table T3',
    status: 'seated',
  },
];

export default function AdminReservationsPage() {
  const [bookings, setBookings] = useState<any[]>(DEMO_BOOKINGS);

  const handleUpdateStatus = (id: string, status: ReservationStatus) => {
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">Host Desk</span>
        <h1 className="text-2xl font-extrabold text-[#231709]">Table Reservations Calendar</h1>
        <p className="text-xs text-[#5D4037]">Manage guest seating, party size, and table assignments.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBE0D2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#4E342E] uppercase font-bold border-b border-[#EBE0D2]">
              <tr>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date & Slot</th>
                <th className="p-4">Guests</th>
                <th className="p-4">Table</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0]">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-[#FFFEFA] transition-colors">
                  <td className="p-4 font-mono font-bold text-[#231709]">{booking.reservationNumber}</td>
                  <td className="p-4">
                    <span className="font-bold block text-[#231709]">{booking.customerName}</span>
                    <a href={`tel:${booking.customerPhone}`} className="text-[#C86D51] hover:underline flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />
                      <span>{booking.customerPhone}</span>
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold block text-[#231709]">{booking.reservationDate}</span>
                    <span className="text-[11px] text-[#5D4037]">{booking.reservationTime}</span>
                  </td>
                  <td className="p-4 font-bold text-[#231709]">{booking.partySize} Guests</td>
                  <td className="p-4 font-bold text-[#C86D51]">{booking.tableNumber}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                        booking.status === 'seated'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.status === 'confirmed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'seated')}
                        className="px-2.5 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800"
                      >
                        Seat Guests
                      </button>
                    )}
                    {booking.status === 'seated' && (
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'completed')}
                        className="px-2.5 py-1.5 bg-[#231709] text-white rounded-lg font-bold hover:bg-[#3E2723]"
                      >
                        Complete ✓
                      </button>
                    )}
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
