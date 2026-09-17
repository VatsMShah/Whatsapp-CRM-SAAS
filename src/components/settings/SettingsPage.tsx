import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, Key, CheckCircle2, Copy, Save, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkspaceTenant } from '../../types';

interface SettingsPageProps {
  activeTenant: WorkspaceTenant;
  onUpdateTenant: (updated: WorkspaceTenant) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  activeTenant,
  onUpdateTenant,
}) => {
  const [phoneNumberId, setPhoneNumberId] = useState(activeTenant.phoneNumberId || '1240163099173755');
  const [phoneNumber, setPhoneNumber] = useState(activeTenant.phoneNumber || '+91 99309 95959');
  const [clientName, setClientName] = useState(activeTenant.name || 'Traket Transport');
  const [supabaseUrl, setSupabaseUrl] = useState(activeTenant.supabaseUrl || 'https://your-project.supabase.co');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const webhookEndpoint = `${supabaseUrl}/functions/v1/TraketFUnction/webhook`;

  const handleSave = () => {
    onUpdateTenant({
      ...activeTenant,
      name: clientName,
      phoneNumber,
      phoneNumberId,
      supabaseUrl,
    });
    setSavedSuccess(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Client Workspace & WhatsApp Integration Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure WhatsApp Cloud API tokens, phone numbers, and database connections for this workspace
          </p>
        </div>
        {savedSuccess && (
          <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      {/* Workspace Details */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Client Organization Details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Company / Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              WhatsApp Business Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Meta WhatsApp Cloud API Credentials */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
          <Key className="w-4 h-4 text-emerald-400" />
          <span>Meta WhatsApp Cloud API Configuration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              WhatsApp Phone Number ID
            </label>
            <input
              type="text"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Webhook Verify Token
            </label>
            <input
              type="text"
              readOnly
              value="traketautomation"
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-400 font-mono"
            />
          </div>
        </div>

        {/* Webhook Endpoint URL with copy button */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Permanent Webhook Callback URL (Paste in Meta Developer Dashboard)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={webhookEndpoint}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-emerald-400 font-mono"
            />
            <button
              onClick={copyWebhook}
              className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedWebhook ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Database Connection */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Supabase Database Connection</span>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Supabase Project URL
          </label>
          <input
            type="text"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-medium">Connected Tables:</span>
            <span className="text-emerald-400 font-mono">book_vehicle, provide_vehicle, users_master, support</span>
          </div>
          <span className="text-slate-400">Realtime Active</span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Workspace Settings</span>
        </button>
      </div>
    </div>
  );
};
