import React, { useState } from 'react';
import {
  Package,
  Search,
  Send,
  Zap,
  Phone,
  Building2,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';
import { BookingLead } from '../../types';

interface BookingsTableProps {
  bookings: BookingLead[];
  onSelectBookingForMatch: (booking: BookingLead) => void;
  onOpenBroadcastForSelected: (selected: BookingLead[]) => void;
  onUpdateStatus: (userId: string, status: BookingLead['status']) => void;
}

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  onSelectBookingForMatch,
  onOpenBroadcastForSelected,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.contactName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.phone || '').includes(searchTerm) ||
      (b.loadingPin || '').includes(searchTerm) ||
      (b.unloadingPin || '').includes(searchTerm) ||
      (b.material || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || (b.status || 'new') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBookings.map((b) => b.user_id));
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
    return bookings.filter((b) => selectedIds.includes(b.user_id));
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search & Filter */}
        <div className="flex items-center space-x-2.5 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer, phone, PIN or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="all">All Statuses</option>
            <option value="new">New Demand</option>
            <option value="quoted">Quoted</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center space-x-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => onOpenBroadcastForSelected(getSelectedObjects())}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast ({selectedIds.length})</span>
            </button>
          )}

          <div className="text-xs text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
            Total: <span className="text-white font-bold">{bookings.length}</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-sm">
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No Bookings Found</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                {searchTerm || statusFilter !== 'all'
                  ? 'No entries match your search query.'
                  : 'Customer booking leads received on WhatsApp will appear here in real-time.'}
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
                      checked={selectedIds.length === filteredBookings.length && filteredBookings.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                    />
                  </th>
                  <th className="p-3.5">Customer & Company</th>
                  <th className="p-3.5">Route (PINs)</th>
                  <th className="p-3.5">Vehicle Type</th>
                  <th className="p-3.5">Cargo / Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-4">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredBookings.map((b) => {
                  const isSelected = selectedIds.includes(b.user_id);
                  return (
                    <tr
                      key={b.user_id}
                      className={`hover:bg-slate-800/40 transition ${
                        isSelected ? 'bg-emerald-500/5' : ''
                      }`}
                    >
                      <td className="p-3.5 pl-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(b.user_id)}
                          className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                        />
                      </td>

                      {/* Customer & Company */}
                      <td className="p-3.5">
                        <div className="font-bold text-white">{b.contactName || 'WhatsApp Customer'}</div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                          {b.company && <span>{b.company} • </span>}
                          <span className="font-mono text-emerald-400">{b.phone}</span>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="p-3.5">
                        <div className="flex items-center space-x-1.5 font-mono text-slate-200">
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                            {b.loadingPin || 'N/A'}
                          </span>
                          <span className="text-emerald-400">➔</span>
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                            {b.unloadingPin || 'N/A'}
                          </span>
                        </div>
                        {b.cargoType && (
                          <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
                            {b.cargoType}
                          </div>
                        )}
                      </td>

                      {/* Vehicle */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{b.vehicleType || 'Any Vehicle'}</div>
                        {b.vehicleSubType && (
                          <div className="text-[11px] text-slate-400">{b.vehicleSubType}</div>
                        )}
                      </td>

                      {/* Cargo & Date */}
                      <td className="p-3.5">
                        <div className="text-slate-200 truncate max-w-[140px]">{b.material || 'General'}</div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{b.loadingDate || 'Flexible'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <select
                          value={b.status || 'new'}
                          onChange={(e) => onUpdateStatus(b.user_id, e.target.value as any)}
                          className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="new">New</option>
                          <option value="quoted">Quoted</option>
                          <option value="in_transit">In Transit</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right pr-4">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onSelectBookingForMatch(b)}
                            title="Auto-match with registered transporters"
                            className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition"
                          >
                            <Zap className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenBroadcastForSelected([b])}
                            title="Send WhatsApp Follow-up"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
