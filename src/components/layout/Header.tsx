import React from 'react';
import { Search, Bell, Send, ShieldCheck, RefreshCw, UserCheck } from 'lucide-react';
import { ClientCompanyProfile } from '../../types';

interface HeaderProps {
  title: string;
  subtitle: string;
  clientProfile: ClientCompanyProfile;
  onOpenBroadcastModal: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  clientProfile,
  onOpenBroadcastModal,
  onRefreshData,
  isRefreshing,
}) => {
  return (
    <header className="h-16 bg-[#0c1222]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center space-x-2.5">
          <h1 className="text-lg font-display font-extrabold text-white tracking-tight">{title}</h1>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            {clientProfile.name}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Global Actions */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads, phone, PIN..."
            className="w-full bg-slate-900/90 border border-slate-700/60 rounded-xl pl-8 pr-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Sync with Supabase Button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            title="Sync live from Supabase"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition text-xs font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Sync Live</span>
          </button>
        )}

        {/* 1-Click Broadcast Trigger Button */}
        <button
          onClick={onOpenBroadcastModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-md shadow-emerald-600/25 transition transform active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>1-Click Broadcast</span>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white relative transition">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5"></span>
        </button>

        {/* Client Admin Profile (No hardcoded owner names) */}
        <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-white flex items-center space-x-1">
              <span>Portal Admin</span>
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-400">{clientProfile.name}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
