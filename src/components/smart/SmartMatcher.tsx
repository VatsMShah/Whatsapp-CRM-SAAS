import React, { useState } from 'react';
import {
  Sparkles,
  Truck,
  ArrowRight,
  Send,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Building,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookingLead, Transporter } from '../../types';

interface SmartMatcherProps {
  bookings: BookingLead[];
  transporters: Transporter[];
  selectedBooking?: BookingLead;
  onOpenBroadcastForTransporter?: (transporter: Transporter) => void;
}

export const SmartMatcher: React.FC<SmartMatcherProps> = ({
  bookings,
  transporters,
  selectedBooking: initialBooking,
}) => {
  const [activeBooking, setActiveBooking] = useState<BookingLead>(
    initialBooking || bookings[0]
  );
  const [assignedTransporterId, setAssignedTransporterId] = useState<string | null>(null);

  // Match algorithm: Matches vehicleType and checks route keywords
  const matchedTransporters = transporters.map((t) => {
    let matchScore = 60;

    // Vehicle type match
    if (t.vehicleType.toLowerCase() === activeBooking.vehicleType.toLowerCase()) {
      matchScore += 25;
    }

    // Route keyword match (check if loadingCity or unloadingCity is in route preference)
    const routeText = (t.routePreference || '').toLowerCase();
    const loadCity = (activeBooking.loadingCity || '').toLowerCase();
    const unloadCity = (activeBooking.unloadingCity || '').toLowerCase();

    if (loadCity && routeText.includes(loadCity)) matchScore += 10;
    if (unloadCity && routeText.includes(unloadCity)) matchScore += 10;

    return {
      ...t,
      matchScore: Math.min(matchScore, 99),
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const handleAssign = (t: Transporter) => {
    setAssignedTransporterId(t.user_id);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-white">
              Smart Load-to-Transporter Auto-Matcher
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              AI algorithm automatically pairs customer freight demands with registered fleet drivers traveling the same corridor
            </p>
          </div>
        </div>
      </div>

      {/* Main Matching Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Select Booking Demand (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Customer Demands ({bookings.length})
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {bookings.map((booking) => {
              const isSelected = booking.user_id === activeBooking?.user_id;
              return (
                <button
                  key={booking.user_id}
                  onClick={() => {
                    setActiveBooking(booking);
                    setAssignedTransporterId(null);
                  }}
                  className={`w-full p-4 rounded-2xl text-left transition border ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-950/50 to-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/50'
                      : 'glass-card border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-white truncate">
                      {booking.contactName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {booking.loadingDate}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-300 mb-1">
                    <span>{booking.loadingCity}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span>{booking.unloadingCity}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 truncate">
                    {booking.vehicleType} • {booking.material}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Matched Transporters List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Target Load Requirement:
              </span>
              <div className="text-xs text-emerald-400 font-medium mt-0.5">
                {activeBooking.loadingCity} ➔ {activeBooking.unloadingCity} • {activeBooking.vehicleType} ({activeBooking.material})
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs">
              {matchedTransporters.length} Transporter Matches
            </span>
          </div>

          {/* Transporter Cards */}
          <div className="space-y-3">
            {matchedTransporters.map((transporter) => {
              const isAssigned = assignedTransporterId === transporter.user_id;

              return (
                <div
                  key={transporter.user_id}
                  className={`glass-card p-5 rounded-2xl border transition ${
                    isAssigned
                      ? 'border-emerald-500 bg-emerald-950/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Transporter details */}
                    <div className="flex items-start space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">
                        <Truck className="w-6 h-6" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-base text-emerald-400">
                            {transporter.vehicleNumber}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            ({transporter.driverName})
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 font-medium mt-0.5">
                          {transporter.vehicleType} • Capacity: <span className="text-white font-bold">{transporter.capacity}</span>
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                          <span>Corridor:</span>
                          <span className="text-slate-200 font-medium">{transporter.routePreference}</span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score & Action */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                        <span>{transporter.matchScore}% Match</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <a
                          href={`https://wa.me/${transporter.driverPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hi ${transporter.driverName} ji, from Traket Transport. We have an urgent load available for ${activeBooking.loadingCity} to ${activeBooking.unloadingCity}. Vehicle required: ${activeBooking.vehicleType}. Material: ${activeBooking.material}. Loading date: ${activeBooking.loadingDate}. Please share your best rate!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch on WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleAssign(transporter)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                            isAssigned
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          {isAssigned ? '✓ Assigned' : 'Assign Load'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
