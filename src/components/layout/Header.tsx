import React from 'react';
import { Search, Bell, Sparkles, Send, ShieldCheck, RefreshCw } from 'lucide-react';
import { WorkspaceTenant } from '../../types';

interface HeaderProps {
  title: string;
  subtitle: string;
  activeTenant: WorkspaceTenant;
  onOpenBroadcastModal: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  activeTenant,
  onOpenBroadcastModal,
  onRefreshData,
  isRefreshing,
}) => {
  return (
    <header className="h-18 glass-nav px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-display font-bold text-white tracking-tight">{title}</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            {activeTenant.name}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Global Actions */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads, PIN, routes..."
            className="w-full bg-slate-900/90 border border-slate-700/60 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition"
          />
        </div>

        {/* Refresh button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            title="Sync with Supabase"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        )}

        {/* 1-Click Broadcast Trigger Button */}
        <button
          onClick={onOpenBroadcastModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/25 transition-all transform active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>1-Click Broadcast / Follow-up</span>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white relative transition">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
            VS
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-white flex items-center space-x-1">
              <span>Vatsal Shah</span>
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-400">Owner & Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};
