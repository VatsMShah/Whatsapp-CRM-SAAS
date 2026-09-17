import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Truck,
  Database,
  LifeBuoy,
  Send,
  Zap,
  Settings,
  ChevronDown,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { WorkspaceTenant } from '../../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeTenant: WorkspaceTenant;
  tenants: WorkspaceTenant[];
  onSelectTenant: (tenant: WorkspaceTenant) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeTenant,
  tenants,
  onSelectTenant,
}) => {
  const [tenantDropdownOpen, setTenantDropdownOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: '' },
    { id: 'inbox', label: 'Live 2-Way Inbox', icon: MessageSquare, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { id: 'bookings', label: 'Bookings (book_vehicle)', icon: Package, badge: '5 Active' },
    { id: 'transporters', label: 'Transporters (provide_vehicle)', icon: Truck, badge: '4 Registered' },
    { id: 'sessions', label: 'Master Sessions (users_master)', icon: Database, badge: '' },
    { id: 'support', label: 'Support Desk (support)', icon: LifeBuoy, badge: '' },
    { id: 'broadcast', label: '1-Click Broadcast & Follow-ups', icon: Send, badge: 'Smart' },
    { id: 'matcher', label: 'Smart Load-Vehicle Matcher', icon: Zap, badge: 'AI Match' },
    { id: 'settings', label: 'Workspace & API Settings', icon: Settings, badge: '' },
  ];

  return (
    <aside className="w-72 bg-[#0c1222] border-r border-slate-800/80 flex flex-col h-screen select-none">
      {/* App Branding */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-bold text-lg tracking-tight text-white">FlowSync</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">WhatsApp Logistics CRM</p>
          </div>
        </div>
      </div>

      {/* Multi-Tenant Workspace Selector */}
      <div className="p-3 border-b border-slate-800/60 relative">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5 block">
          Current Workspace
        </label>
        <button
          onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800/70 transition-all text-left"
        >
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <div className="text-sm font-semibold text-white truncate">{activeTenant.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{activeTenant.phoneNumber}</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </button>

        {/* Dropdown Options */}
        {tenantDropdownOpen && (
          <div className="absolute top-full left-3 right-3 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl animate-fade-in">
            <div className="px-3 py-1 text-[11px] text-slate-400 font-medium">Switch Client Workspace</div>
            {tenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => {
                  onSelectTenant(tenant);
                  setTenantDropdownOpen(false);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition ${
                  tenant.id === activeTenant.id ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-slate-300'
                }`}
              >
                <div className="truncate">
                  <div className="text-xs font-semibold">{tenant.name}</div>
                  <div className="text-[10px] text-slate-400">{tenant.phoneNumber}</div>
                </div>
                {tenant.id === activeTenant.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-800 text-slate-400 border border-slate-700/50'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Live WhatsApp Status Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 status-dot"></span>
            <div>
              <div className="text-[11px] font-semibold text-slate-200">WhatsApp Cloud API</div>
              <div className="text-[10px] text-emerald-400">Online & Listening</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">v20.0</span>
        </div>
      </div>
    </aside>
  );
};
