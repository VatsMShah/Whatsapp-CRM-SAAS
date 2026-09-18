import React from 'react';
import {
  Package,
  Truck,
  Zap,
  ArrowUpRight,
  Send,
  CheckCircle2,
  Activity,
  LifeBuoy,
} from 'lucide-react';
import { BookingLead, Transporter, ClientCompanyProfile } from '../../types';

interface DashboardOverviewProps {
  bookings: BookingLead[];
  transporters: Transporter[];
  clientProfile: ClientCompanyProfile;
  onNavigateTab: (tab: string) => void;
  onOpenBroadcast: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  bookings,
  transporters,
  clientProfile,
  onNavigateTab,
  onOpenBroadcast,
}) => {
  const activeBookings = bookings.length;
  const registeredTransporters = transporters.length;

  const statCards = [
    {
      title: 'Total Inbound Bookings',
      value: activeBookings,
      subtitle: activeBookings > 0 ? 'Live from Supabase' : 'Waiting for new leads',
      icon: Package,
      color: 'from-emerald-600 to-teal-500',
      tab: 'bookings',
    },
    {
      title: 'Transporter Fleet',
      value: registeredTransporters,
      subtitle: registeredTransporters > 0 ? 'Verified & available' : 'Registered via bot',
      icon: Truck,
      color: 'from-blue-600 to-cyan-500',
      tab: 'transporters',
    },
    {
      title: 'Smart Match Engine',
      value: 'Auto-Match',
      subtitle: 'Pair loads with trucks',
      icon: Zap,
      color: 'from-purple-600 to-indigo-500',
      tab: 'matcher',
      isText: true,
    },
    {
      title: '1-Click Outreach',
      value: 'Ready',
      subtitle: 'Broadcast follow-ups',
      icon: Send,
      color: 'from-amber-600 to-orange-500',
      tab: 'broadcast',
      isText: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              Live Operations Hub
            </span>
            <span className="text-xs text-slate-400">Connected to Supabase Database</span>
          </div>
          <h2 className="text-xl font-display font-bold text-white mt-1.5">
            Welcome to {clientProfile.name} Automation
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Realtime customer freight demands, fleet registrations, and automated dispatch intelligence.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateTab('matcher')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Smart Matcher</span>
          </button>
          <button
            onClick={onOpenBroadcast}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>1-Click Broadcast</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 transition cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-400">{card.title}</div>
                  <div className="text-2xl font-bold font-display text-white mt-1.5 flex items-baseline space-x-2">
                    <span>{card.value}</span>
                    {card.isText && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{card.subtitle}</div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-md group-hover:scale-105 transition`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-emerald-300">
                <span>View details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings & Operations View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List: Recent Customer Bookings */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Package className="w-4 h-4 text-emerald-400" />
                <span>Recent WhatsApp Bookings</span>
              </h3>
              <p className="text-xs text-slate-400">Live incoming freight demand requests</p>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="py-12 px-4 rounded-xl bg-slate-950/50 border border-slate-800/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Database is Clean & Ready</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  When customers message{' '}
                  <span className="text-emerald-400 font-mono font-bold">{clientProfile.phoneNumber}</span>, their booking requests will appear here instantly.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('bookings')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              >
                Go to Bookings Desk
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {bookings.slice(0, 4).map((b) => (
                <div
                  key={b.user_id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {b.contactName ? b.contactName.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {b.contactName || b.company || 'Customer Lead'}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        📍 {b.loadingPin || 'PIN'} ➔ {b.unloadingPin || 'PIN'} • 🚛 {b.vehicleType || 'Any'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-mono font-semibold text-emerald-400">{b.phone}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(b.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Panel: Fleet & WhatsApp Bot Status */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>Transporter Fleet</span>
            </h3>
            <p className="text-xs text-slate-400">Registered drivers & available vehicles</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Fleet Records</span>
              <span className="font-bold text-white">{registeredTransporters}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">WhatsApp Automation</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active 24/7</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">WhatsApp Line</span>
              <span className="font-mono text-slate-300">{clientProfile.phoneNumber}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onNavigateTab('transporters')}
              className="w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition text-center"
            >
              View Transporter Registry
            </button>
            <button
              onClick={() => onNavigateTab('matcher')}
              className="w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition text-center"
            >
              Open Smart Matcher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
