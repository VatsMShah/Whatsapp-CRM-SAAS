import React, { useState } from 'react';
import {
  Zap,
  Package,
  Truck,
  Send,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { BookingLead, Transporter } from '../../types';

interface SmartMatcherProps {
  bookings: BookingLead[];
  transporters: Transporter[];
  selectedBooking?: BookingLead;
  onOpenBroadcastForTransporter: (transporter: Transporter) => void;
}

export const SmartMatcher: React.FC<SmartMatcherProps> = ({
  bookings,
  transporters,
  selectedBooking,
  onOpenBroadcastForTransporter,
}) => {
  const [activeBookingId, setActiveBookingId] = useState<string>(
    selectedBooking ? selectedBooking.user_id : bookings.length > 0 ? bookings[0].user_id : ''
  );

  const activeBooking = bookings.find((b) => b.user_id === activeBookingId) || bookings[0];

  const matchedTransporters = transporters.filter((t) => {
    if (!activeBooking) return true;
    const vehicleMatch =
      !activeBooking.vehicleType ||
      !t.vehicleType ||
      t.vehicleType.toLowerCase().includes(activeBooking.vehicleType.toLowerCase()) ||
      activeBooking.vehicleType.toLowerCase().includes(t.vehicleType.toLowerCase());

    return vehicleMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/20 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
              Intelligent Corridor Engine
            </span>
          </div>
          <h2 className="text-lg font-display font-bold text-white mt-1.5">
            Smart Load-to-Transporter Matcher
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Automatically pairs active customer load bookings with available transporter fleet registered in Supabase.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">No Inbound Bookings Yet</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Once customers submit freight demands via WhatsApp, the smart matcher will instantly discover matching transporters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Select Booking */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>1. Select Freight Demand</span>
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {bookings.map((b) => {
                const isSelected = b.user_id === (activeBooking ? activeBooking.user_id : '');
                return (
                  <div
                    key={b.user_id}
                    onClick={() => setActiveBookingId(b.user_id)}
                    className={`p-3.5 rounded-xl cursor-pointer transition border text-xs ${
                      isSelected
                        ? 'bg-purple-500/15 border-purple-500/50 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{b.contactName || b.company || 'Customer Booking'}</span>
                      <span className="font-mono text-[10px] text-emerald-400">{b.phone}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      📍 {b.loadingPin || 'PIN'} ➔ {b.unloadingPin || 'PIN'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      🚛 {b.vehicleType || 'Any Vehicle'} • {b.material || 'General'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Matching Transporters */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>2. Matched Transporters ({matchedTransporters.length})</span>
              </h3>
            </div>

            {matchedTransporters.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400">
                No matching vehicles currently found for this load requirement.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {matchedTransporters.map((t) => (
                  <div
                    key={t.user_id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{t.driverName || 'Verified Driver'}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">
                          {t.vehicleNumber || 'No Plate'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        🚛 {t.vehicleType || 'Commercial'} • Capacity: {t.capacity || 'Standard'}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400">{t.driverPhone}</div>
                    </div>

                    <button
                      onClick={() => onOpenBroadcastForTransporter(t)}
                      className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Alert Transporter</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
