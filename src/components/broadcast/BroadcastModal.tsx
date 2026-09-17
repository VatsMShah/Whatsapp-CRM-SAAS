import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2, MessageSquare, Bell, Megaphone, Users, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BroadcastTemplate, BroadcastType } from '../../types';
import { DEFAULT_TEMPLATES, sendBulkBroadcast, SendBroadcastResult } from '../../services/whatsapp';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecipients: Array<{
    name?: string;
    contactName?: string;
    driverName?: string;
    phone?: string;
    driverPhone?: string;
    loadingCity?: string;
    unloadingCity?: string;
    vehicleType?: string;
    material?: string;
    loadingDate?: string;
    [key: string]: any;
  }>;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  selectedRecipients,
}) => {
  const [selectedType, setSelectedType] = useState<BroadcastType>('follow_up');
  const [selectedTemplate, setSelectedTemplate] = useState<BroadcastTemplate>(DEFAULT_TEMPLATES[0]);
  const [customText, setCustomText] = useState(DEFAULT_TEMPLATES[0].text);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<SendBroadcastResult | null>(null);

  if (!isOpen) return null;

  const handleSelectTemplate = (tpl: BroadcastTemplate) => {
    setSelectedTemplate(tpl);
    setSelectedType(tpl.type);
    setCustomText(tpl.text);
  };

  const sampleRecipient = selectedRecipients[0] || {
    name: 'Rahul Verma',
    loadingCity: 'Mumbai',
    unloadingCity: 'Delhi',
    vehicleType: 'Truck (22 Ft Open)',
    loadingDate: '25/09/2026',
    material: 'Industrial Motors',
    phone: '+91 98205 00159',
  };

  // Preview generated with real recipient data
  const previewText = customText
    .replace(/{{name}}/g, sampleRecipient.name || sampleRecipient.contactName || sampleRecipient.driverName || 'Customer')
    .replace(/{{from}}/g, sampleRecipient.loadingCity || 'Mumbai')
    .replace(/{{to}}/g, sampleRecipient.unloadingCity || 'Delhi')
    .replace(/{{vehicle}}/g, sampleRecipient.vehicleType || 'Truck')
    .replace(/{{date}}/g, sampleRecipient.loadingDate || 'this week')
    .replace(/{{material}}/g, sampleRecipient.material || 'Machinery');

  const handleDispatch = async () => {
    setIsSending(true);
    try {
      const result = await sendBulkBroadcast(
        (selectedRecipients.length > 0 ? selectedRecipients : [sampleRecipient]) as any,
        customText,
        selectedType
      );
      setSendResult(result);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                1-Click WhatsApp Broadcast & Follow-Up
              </h2>
              <p className="text-xs text-slate-400">
                Dispatch personalized messages via Meta Cloud API
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSendResult(null);
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {sendResult ? (
            /* Success State */
            <div className="text-center py-6 space-y-4 animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Messages Dispatched Successfully!
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Delivered to {sendResult.successful} of {sendResult.total} selected recipient(s) via WhatsApp Cloud API.
                </p>
              </div>

              {/* Delivery list preview */}
              <div className="max-h-48 overflow-y-auto rounded-xl bg-slate-950 border border-slate-800 p-3 text-left space-y-2">
                {sendResult.recipients.map((rec, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div>
                      <div className="font-semibold text-white">{rec.name}</div>
                      <div className="text-[10px] text-slate-400">{rec.phone}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Delivered
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSendResult(null);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Recipient Count Banner */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-200">
                    Selected Recipients:
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                  {selectedRecipients.length > 0 ? selectedRecipients.length : 1} contact(s)
                </span>
              </div>

              {/* Message Type Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  Choose Campaign Type
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      const t = DEFAULT_TEMPLATES.find((x) => x.type === 'follow_up') || DEFAULT_TEMPLATES[0];
                      handleSelectTemplate(t);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex flex-col space-y-1 ${
                      selectedType === 'follow_up'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-semibold text-xs text-white">
                      <Bell className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Follow-Up</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Re-engage open leads</span>
                  </button>

                  <button
                    onClick={() => {
                      const t = DEFAULT_TEMPLATES.find((x) => x.type === 'reminder') || DEFAULT_TEMPLATES[1];
                      handleSelectTemplate(t);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex flex-col space-y-1 ${
                      selectedType === 'reminder'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-semibold text-xs text-white">
                      <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                      <span>Reminder</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Loading / dispatch alerts</span>
                  </button>

                  <button
                    onClick={() => {
                      const t = DEFAULT_TEMPLATES.find((x) => x.type === 'publicity') || DEFAULT_TEMPLATES[2];
                      handleSelectTemplate(t);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex flex-col space-y-1 ${
                      selectedType === 'publicity'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-semibold text-xs text-white">
                      <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Publicity / Offer</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Promotions & Load alerts</span>
                  </button>
                </div>
              </div>

              {/* Template Text Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Message Template
                  </label>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    Merge tags: &#123;&#123;name&#125;&#125;, &#123;&#123;from&#125;&#125;, &#123;&#123;to&#125;&#125;, &#123;&#123;vehicle&#125;&#125;, &#123;&#123;date&#125;&#125;
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                />
              </div>

              {/* Live WhatsApp Preview Bubble */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Live Preview on Customer's WhatsApp
                </label>
                <div className="p-4 rounded-xl bg-[#0b141a] border border-slate-800 relative">
                  <div className="max-w-md bg-[#005c4b] text-white p-3 rounded-2xl rounded-tl-none shadow-md text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {previewText}
                    <div className="text-[9px] text-emerald-200 text-right mt-1.5 flex items-center justify-end space-x-1">
                      <span>10:45 AM</span>
                      <CheckCircle2 className="w-3 h-3 text-teal-300 inline" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!sendResult && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              disabled={isSending}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 active:scale-95"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching via Meta API...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    Send in 1-Click to {selectedRecipients.length > 0 ? selectedRecipients.length : 1} Contact(s)
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
