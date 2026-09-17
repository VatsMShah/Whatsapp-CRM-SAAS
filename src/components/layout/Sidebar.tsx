import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Truck,
  LifeBuoy,
  Send,
  Zap,
  Building2,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { ClientCompanyProfile } from '../../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  clientProfile: ClientCompanyProfile;
  bookingCount: number;
  transporterCount: number;
  activeChatCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  clientProfile,
  bookingCount,
  transporterCount,
  activeChatCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: '',
      description: 'Operations overview & KPIs',
    },
    {
      id: 'bookings',
      label: 'Customer Bookings',
      icon: Package,
      badge: bookingCount > 0 ? `${bookingCount} Demands` : '',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      description: 'Freight requests from WhatsApp',
    },
    {
      id: 'transporters',
      label: 'Transporter Fleet',
      icon: Truck,
      badge: transporterCount > 0 ? `${transporterCount} Registered` : '',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      description: 'Available trucks & vehicles',
    },
    {
      id: 'inbox',
      label: 'Live WhatsApp Inbox',
      icon: MessageSquare,
      badge: activeChatCount > 0 ? `${activeChatCount} Active` : 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      description: '2-way chat with takeover',
    },
    {
      id: 'broadcast',
      label: '1-Click Broadcast',
      icon: Send,
      badge: 'Smart',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      description: 'Outreach & payment follow-ups',
    },
    {
      id: 'matcher',
      label: 'Smart Matcher',
      icon: Zap,
      badge: 'Auto',
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      description: 'Load-to-vehicle matching',
    },
    {
      id: 'support',
      label: 'Support Desk',
      icon: LifeBuoy,
      badge: '',
      description: 'Customer help tickets',
    },
  ];

  return (
    <aside className="w-72 bg-[#0b101d] border-r border-slate-800/80 flex flex-col h-screen select-none">
      {/* App Branding */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/20">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-extrabold text-base tracking-tight text-white">
                Shrimad Raj
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">WhatsApp Logistics CRM</p>
          </div>
        </div>
      </div>

      {/* Clean Single Client Card (No confusing multi-tenant dropdown) */}
      <div className="p-4 border-b border-slate-800/60">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white truncate">{clientProfile.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{clientProfile.phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full group text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600/20 via-emerald-500/15 to-transparent text-emerald-300 border border-emerald-500/30 shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`p-1.5 rounded-lg transition ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-900 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{item.description}</div>
                </div>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1.5 flex-shrink-0 ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Live System Status Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div>
              <div className="text-[11px] font-bold text-slate-200">WhatsApp Cloud API</div>
              <div className="text-[10px] text-emerald-400 font-medium">Live & Synchronized</div>
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded-md">
            v20.0
          </span>
        </div>
      </div>
    </aside>
  );
};
