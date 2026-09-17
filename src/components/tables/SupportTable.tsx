import React from 'react';
import { LifeBuoy, Phone, Mail, CheckCircle, Clock } from 'lucide-react';
import { SupportTicket } from '../../types';

export const SupportTable: React.FC = () => {
  const sampleTickets: SupportTicket[] = [
    {
      user_id: 'sup_301',
      phone: '+91 98205 00159',
      contactName: 'Rahul Verma',
      subject: 'Inquiry on transit insurance & GPS live tracking link',
      status: 'in_progress',
      priority: 'high',
      updated_at: '15 mins ago',
    },
    {
      user_id: 'sup_302',
      phone: '+91 94220 88712',
      contactName: 'Priya Kulkarni',
      subject: 'Invoice copy request for past consignment',
      status: 'resolved',
      priority: 'medium',
      updated_at: '2 hours ago',
    },
    {
      user_id: 'sup_303',
      phone: '+91 98190 22345',
      contactName: 'Gurpreet Singh',
      subject: 'Toll reimbursement policy for trailer category',
      status: 'open',
      priority: 'medium',
      updated_at: '4 hours ago',
    }
  ];

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LifeBuoy className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Customer Support & Inquiries Desk</h3>
        </div>
        <span className="text-xs text-slate-400">
          Mirroring Supabase Table: <code className="text-emerald-400 bg-slate-900 px-2 py-1 rounded">support</code>
        </span>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="p-3.5">Ticket ID</th>
              <th className="p-3.5">Customer Name & Phone</th>
              <th className="p-3.5">Subject / Query</th>
              <th className="p-3.5">Priority</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sampleTickets.map((t) => (
              <tr key={t.user_id} className="table-row-hover">
                <td className="p-3.5 font-mono text-slate-400 font-bold">{t.user_id}</td>
                <td className="p-3.5">
                  <div className="font-semibold text-white">{t.contactName}</div>
                  <div className="text-[11px] text-emerald-400 font-mono">{t.phone}</div>
                </td>
                <td className="p-3.5 text-slate-200">{t.subject}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.priority === 'high'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center space-x-1 w-max ${
                      t.status === 'resolved'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : t.status === 'in_progress'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    <span>{t.status === 'resolved' ? '✓ Resolved' : t.status === 'in_progress' ? 'In Progress' : 'Open Ticket'}</span>
                  </span>
                </td>
                <td className="p-3.5 text-right text-slate-400">{t.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
