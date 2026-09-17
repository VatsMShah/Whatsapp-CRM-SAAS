import React, { useState } from 'react';
import { Database, Search, Phone, Clock, Key } from 'lucide-react';
import { SessionRecord } from '../../types';

interface SessionsTableProps {
  sessions: SessionRecord[];
}

export const SessionsTable: React.FC<SessionsTableProps> = ({ sessions }) => {
  const [search, setSearch] = useState('');

  const filtered = sessions.filter(
    (s) =>
      s.phone?.includes(search) ||
      s.user_id?.includes(search) ||
      s.state?.includes(search) ||
      s.flow_type?.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search session ID, phone, state..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Mirroring Supabase Table: <code className="text-emerald-400 bg-slate-900 px-2 py-1 rounded">users_master</code>
        </span>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="p-3.5">Session User ID</th>
              <th className="p-3.5">Phone Number</th>
              <th className="p-3.5">Current Bot State</th>
              <th className="p-3.5">Flow Type</th>
              <th className="p-3.5">Session Payload JSON</th>
              <th className="p-3.5 text-right">Last Interaction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {filtered.map((s) => (
              <tr key={s.user_id} className="table-row-hover">
                <td className="p-3.5 font-bold text-slate-200 truncate max-w-xs">{s.user_id}</td>
                <td className="p-3.5 text-emerald-400 font-bold">{s.phone}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    {s.state}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-sans font-semibold text-[10px]">
                    {s.flow_type || 'main'}
                  </span>
                </td>
                <td className="p-3.5 max-w-md truncate text-slate-400" title={JSON.stringify(s.data)}>
                  {JSON.stringify(s.data)}
                </td>
                <td className="p-3.5 text-right text-slate-400 font-sans">{new Date(s.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
