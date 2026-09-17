import React, { useState } from 'react';
import {
  Truck,
  Search,
  Send,
  Phone,
  ShieldCheck,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Transporter } from '../../types';

interface TransportersTableProps {
  transporters: Transporter[];
  onOpenBroadcastForSelected: (selected: Transporter[]) => void;
}

export const TransportersTable: React.FC<TransportersTableProps> = ({
  transporters,
  onOpenBroadcastForSelected,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredTransporters = transporters.filter((t) => {
    return (
      (t.driverPhone || '').includes(searchTerm) ||
      (t.vehicleType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.vehicleNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.driverName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.routePreference || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTransporters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTransporters.map((t) => t.user_id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getSelectedObjects = () => {
    return transporters.filter((t) => selectedIds.includes(t.user_id));
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by phone, vehicle number, or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center space-x-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => onOpenBroadcastForSelected(getSelectedObjects())}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast ({selectedIds.length})</span>
            </button>
          )}

          <div className="text-xs text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
            Registered Fleet: <span className="text-white font-bold">{transporters.length}</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-sm">
        {filteredTransporters.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No Transporters Registered</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                {searchTerm
                  ? 'No transporters match your search query.'
                  : 'Transporters and drivers who register their vehicles via WhatsApp will appear here.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-3.5 pl-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredTransporters.length && filteredTransporters.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-700 text-blue-500 focus:ring-0"
                    />
                  </th>
                  <th className="p-3.5">Driver / Contact</th>
                  <th className="p-3.5">Vehicle Type</th>
                  <th className="p-3.5">Vehicle Number</th>
                  <th className="p-3.5">Capacity / Route</th>
                  <th className="p-3.5">Availability</th>
                  <th className="p-3.5 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredTransporters.map((t) => {
                  const isSelected = selectedIds.includes(t.user_id);
                  return (
                    <tr
                      key={t.user_id}
                      className={`hover:bg-slate-800/40 transition ${
                        isSelected ? 'bg-blue-500/5' : ''
                      }`}
                    >
                      <td className="p-3.5 pl-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(t.user_id)}
                          className="rounded border-slate-700 text-blue-500 focus:ring-0"
                        />
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-white flex items-center space-x-1.5">
                          <span>{t.driverName || 'Registered Transporter'}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {t.driverPhone || 'No Phone'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{t.vehicleType || 'Commercial Vehicle'}</div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-200">
                          {t.vehicleNumber || 'Pending'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="text-slate-200">{t.capacity || 'Standard'}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px] mt-0.5">
                          {t.routePreference || 'All Corridors'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          {t.availability || 'Available'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right pr-4">
                        <button
                          onClick={() => onOpenBroadcastForSelected([t])}
                          title="Check Availability via WhatsApp"
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
