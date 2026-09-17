import React, { useEffect, useState } from 'react';
import { LifeBuoy, Search, Phone, Clock, CheckCircle2 } from 'lucide-react';
import { dbService } from '../../services/supabase';
import { SupportTicket } from '../../types';

export const SupportTable: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSupport();
  }, []);

  const loadSupport = async () => {
    setIsLoading(true);
    const data = await dbService.getSupportTickets();
    setTickets(data);
    setIsLoading(false);
  };

  const filteredTickets = tickets.filter(
    (t) =>
      (t.contactName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.phone || '').includes(searchTerm) ||
      (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Search */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search support inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="text-xs text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
          Total Inquiries: <span className="text-white font-bold">{tickets.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-sm">
        {filteredTickets.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No Support Inquiries</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Any customer issues or inquiries sent to the WhatsApp bot will be listed here.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-3.5 pl-4">Customer</th>
                  <th className="p-3.5">Subject / Query</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-4">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredTickets.map((t) => (
                  <tr key={t.user_id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 pl-4">
                      <div className="font-bold text-white">{t.contactName || 'WhatsApp User'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{t.phone}</div>
                    </td>
                    <td className="p-3.5 text-slate-200">{t.subject}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right pr-4 text-slate-400 text-[11px]">
                      {new Date(t.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
