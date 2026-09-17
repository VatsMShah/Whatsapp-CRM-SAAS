import React from 'react';
import {
  Package,
  Truck,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Flame,
  Send,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';
import { BookingLead, Transporter, WorkspaceTenant } from '../../types';

interface DashboardOverviewProps {
  bookings: BookingLead[];
  transporters: Transporter[];
  activeTenant: WorkspaceTenant;
  onNavigateTab: (tab: string) => void;
  onOpenBroadcast: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  bookings,
  transporters,
  activeTenant,
  onNavigateTab,
  onOpenBroadcast,
}) => {
  const hotLeads = bookings.filter((b) => b.leadScore === 'HOT');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider border border-emerald-500/30">
                Live Operations Hub
              </span>
              <span className="text-xs text-slate-400">WhatsApp Cloud Automation v20.0</span>
            </div>
            <h2 className="text-2xl font-display font-extrabold text-white mt-2 tracking-tight">
              Welcome back, {activeTenant.name} 👋
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Your WhatsApp chatbot is actively capturing customer freight bookings and transporter registrations. Manage all leads, dispatch 1-click broadcasts, and auto-match loads below.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenBroadcast}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>1-Click Broadcast</span>
            </button>
            <button
              onClick={() => onNavigateTab('matcher')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Auto-Match Loads</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Customer Bookings
            </div>
            <div className="text-2xl font-display font-bold text-white mt-1">
              {bookings.length}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-1 font-medium">
              <span>Mirroring `book_vehicle`</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Registered Fleet */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Registered Transporters
            </div>
            <div className="text-2xl font-display font-bold text-white mt-1">
              {transporters.length}
            </div>
            <div className="text-[11px] text-teal-400 flex items-center space-x-1 mt-1 font-medium">
              <span>Mirroring `provide_vehicle`</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Hot Leads */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Hot Commercial Leads
            </div>
            <div className="text-2xl font-display font-bold text-rose-400 mt-1">
              {hotLeads.length}
            </div>
            <div className="text-[11px] text-rose-300 flex items-center space-x-1 mt-1 font-medium">
              <span>🔥 Urgent loading date</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Live WhatsApp Status */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Bot Pipeline Status
            </div>
            <div className="text-lg font-display font-bold text-emerald-400 mt-1">
              24/7 Active
            </div>
            <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-1 font-mono">
              <span>{activeTenant.phoneNumber}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Hot Leads Stream & Transporter Fleet Corridor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Hot Booking Inquiries (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Live Inbound Freight Demands</h3>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
            >
              View All Tables ➔
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => (
              <div
                key={b.user_id}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-white">{b.contactName}</span>
                    <span className="text-[10px] text-slate-400">({b.company})</span>
                    {b.leadScore === 'HOT' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300">
                        HOT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium mt-1">
                    <span>{b.loadingCity}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span>{b.unloadingCity}</span>
                    <span className="text-slate-500 font-normal">| {b.vehicleType}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('matcher')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition"
                >
                  Auto-Match
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Fleet Corridor & Instant Action (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">Top Active Corridors</h3>
            </div>
            <span className="text-xs text-slate-400">Fleet Availability</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Mumbai ➔ Delhi / NCR</div>
                <div className="text-[11px] text-slate-400">22ft & 32ft Open Trucks Available</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                High Demand
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Ahmedabad ➔ Bengaluru</div>
                <div className="text-[11px] text-slate-400">32ft MXL Container Fleet</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold">
                Available
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Pune ➔ Mumbai Corridor</div>
                <div className="text-[11px] text-slate-400">14ft & 17ft Tempos & Pickups</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                Immediate
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
