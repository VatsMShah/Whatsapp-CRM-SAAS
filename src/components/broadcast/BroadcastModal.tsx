import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  Users,
  MessageSquare,
  Truck,
  Package,
  CreditCard,
  Megaphone,
} from 'lucide-react';
import { dbService } from '../../services/supabase';
import { BroadcastTemplate } from '../../types';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecipients: any[];
}

const TEMPLATES: BroadcastTemplate[] = [
  {
    id: 't1',
    name: 'Load Follow-up',
    type: 'follow_up',
    title: '🚚 Freight Demand Follow-up',
    text: '🙏 Hello {{name}},\n\nWe have verified trucks available for your route ({{route}}). Would you like to confirm the booking or get best market freight rates today?\n\n- Traket Transport Desk',
    variables: ['name', 'route'],
  },
  {
    id: 't2',
    name: 'Transporter Availability',
    type: 'follow_up',
    title: '🚛 Check Vehicle Availability',
    text: '🚚 Hello {{name}},\n\nDo you have available vehicles ready for dispatch today? We have immediate high-paying loads ready for loading.\n\nReply with your current location.\n- Traket Logistics',
    variables: ['name'],
  },
  {
    id: 't3',
    name: 'Corridor Publicity',
    type: 'publicity',
    title: '📢 Special Rate Announcement',
    text: '🌟 Special Freight Rates Alert!\n\nTraket Transport offers guaranteed vehicle placement and verified rates for all major industrial hubs.\n\nBook your load directly on WhatsApp 24/7!',
    variables: [],
  },
  {
    id: 't4',
    name: 'Payment Reminder',
    type: 'reminder',
    title: '💳 Advance / Balance Clearance',
    text: '📋 Dear {{name}},\n\nThis is a polite reminder regarding pending clearance for {{company}} vehicle placement. Kindly confirm receipt.\n\n- Traket Accounts Team',
    variables: ['name', 'company'],
  },
];

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  selectedRecipients,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<BroadcastTemplate>(TEMPLATES[0]);
  const [customMessage, setCustomMessage] = useState(TEMPLATES[0].text);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSelectTemplate = (t: BroadcastTemplate) => {
    setSelectedTemplate(t);
    setCustomMessage(t.text);
  };

  const handleSendBroadcast = async () => {
    if (selectedRecipients.length === 0) return;
    setIsSending(true);
    try {
      for (const rec of selectedRecipients) {
        const phone = rec.phone || rec.driverPhone;
        if (!phone) continue;
        const name = rec.contactName || rec.driverName || 'Customer';
        const company = rec.company || '';
        const route = rec.loadingPin ? `${rec.loadingPin} ➔ ${rec.unloadingPin}` : 'your route';

        const finalMsg = customMessage
          .replace(/\{\{name\}\}/g, name)
          .replace(/\{\{company\}\}/g, company)
          .replace(/\{\{route\}\}/g, route);

        await dbService.sendAgentMessage(phone, finalMsg);
      }
      setSendSuccess(true);
      setTimeout(() => {
        setSendSuccess(false);
        onClose();
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0c1222] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">1-Click WhatsApp Broadcast & Follow-up</h3>
              <p className="text-xs text-slate-400">Dispatch instant messages to selected contacts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Target Audience Summary */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Target Recipients:</span>
              <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {selectedRecipients.length} Selected
              </span>
            </div>
            <span className="text-[11px] text-emerald-400">Meta WhatsApp Cloud API</span>
          </div>

          {/* Template Selector Pills */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">
              Select Message Campaign Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTemplate(t)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-medium transition ${
                    selectedTemplate.id === t.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">{t.title}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Composer */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">
              Message Content (WhatsApp Formatted)
            </label>
            <textarea
              rows={6}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-sans"
            />
            <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-2">
              <span>Available tags:</span>
              <code className="text-emerald-400 bg-slate-900 px-1 rounded">{'{{name}}'}</code>
              <code className="text-emerald-400 bg-slate-900 px-1 rounded">{'{{company}}'}</code>
              <code className="text-emerald-400 bg-slate-900 px-1 rounded">{'{{route}}'}</code>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSendBroadcast}
            disabled={isSending || selectedRecipients.length === 0}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
          >
            {isSending ? (
              <span>Sending WhatsApp Broadcast...</span>
            ) : sendSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Dispatched Successfully!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send to {selectedRecipients.length} Contact(s)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
