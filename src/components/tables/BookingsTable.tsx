import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  Send,
  Sparkles,
  MapPin,
  Calendar,
  Phone,
  Building,
  CheckSquare,
  Square,
  CheckCircle2,
  Clock,
  Truck,
  Flame,
  Zap,
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof BookingLead>('updated_at');
  const [sortAsc, setSortAsc] = useState(false);

  // Filtered and sorted bookings
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        const matchesSearch =
          b.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.loadingPin?.includes(searchQuery) ||
          b.unloadingPin?.includes(searchQuery) ||
          b.material?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.phone?.includes(searchQuery);

        const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
        const matchesScore = scoreFilter === 'all' || b.leadScore === scoreFilter;

        return matchesSearch && matchesStatus && matchesScore;
      })
      .sort((a, b) => {
        const valA = a[sortField] || '';
        const valB = b[sortField] || '';
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [bookings, searchQuery, statusFilter, scoreFilter, sortField, sortAsc]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBookings.map((b) => b.user_id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedRows = useMemo(() => {
    return bookings.filter((b) => selectedIds.includes(b.user_id));
  }, [bookings, selectedIds]);

  const exportCSV = () => {
    const rowsToExport = selectedRows.length > 0 ? selectedRows : filteredBookings;
    const headers = [
      'User ID',
      'Contact Name',
      'Company',
      'Phone',
      'Loading PIN',
      'Loading City',
      'Unloading PIN',
      'Unloading City',
      'Vehicle Type',
      'Material',
      'Loading Date',
      'Status',
      'Lead Score',
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headers.join(','),
        ...rowsToExport.map((r) =>
          [
            r.user_id,
            `"${r.contactName}"`,
            `"${r.company}"`,
            r.phone,
            r.loadingPin,
            r.loadingCity,
            r.unloadingPin,
            r.unloadingCity,
            `"${r.vehicleType} (${r.vehicleSubType})"`,
            `"${r.material}"`,
            r.loadingDate,
            r.status,
            r.leadScore,
          ].join(',')
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `traket_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Action Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, PIN, client, phone..."
              className="w-full bg-slate-900 border border-slate-700/70 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New Lead</option>
            <option value="quoted">Quoted</option>
            <option value="assigned">Transporter Assigned</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
          </select>

          {/* Lead Score Filter */}
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Lead Scores</option>
            <option value="HOT">🔥 Hot Leads</option>
            <option value="WARM">⚡ Warm Leads</option>
            <option value="COLD">❄️ Cold Leads</option>
          </select>
        </div>

        {/* Export & Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/70 hover:border-slate-600 text-xs font-medium text-slate-200 hover:text-white transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Floating 1-Click Multi-Select Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/90 to-slate-900 border border-emerald-500/40 p-3.5 rounded-2xl shadow-xl flex items-center justify-between animate-slide-up">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-semibold text-white">
              {selectedIds.length} lead{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => onOpenBroadcastForSelected(selectedRows)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>1-Click Follow-up / Reminder</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table Mirror View */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-3.5 w-10 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                    {selectedIds.length > 0 && selectedIds.length === filteredBookings.length ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5">Score</th>
                <th className="p-3.5">Customer & Company</th>
                <th className="p-3.5">Route (PIN ➔ City)</th>
                <th className="p-3.5">Vehicle Required</th>
                <th className="p-3.5">Cargo & Material</th>
                <th className="p-3.5">Loading Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Smart Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No booking records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((row) => {
                  const isSelected = selectedIds.includes(row.user_id);
                  return (
                    <tr
                      key={row.user_id}
                      className={`table-row-hover ${
                        isSelected ? 'bg-emerald-950/20' : ''
                      }`}
                    >
                      {/* Select Checkbox */}
                      <td className="p-3.5 text-center">
                        <button onClick={() => toggleSelectRow(row.user_id)}>
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Lead Score */}
                      <td className="p-3.5 whitespace-nowrap">
                        {row.leadScore === 'HOT' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
                            <span>HOT</span>
                          </span>
                        )}
                        {row.leadScore === 'WARM' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>WARM</span>
                          </span>
                        )}
                        {row.leadScore === 'COLD' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                            COLD
                          </span>
                        )}
                      </td>

                      {/* Customer & Company */}
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{row.contactName || 'Valued Customer'}</div>
                        <div className="text-slate-400 text-[11px] flex items-center space-x-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-500" />
                          <span>{row.company || 'Direct Transport'}</span>
                        </div>
                        <div className="text-slate-500 text-[10px] flex items-center space-x-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          <span>{row.phone}</span>
                        </div>
                      </td>

                      {/* Route & Indian PIN Resolution */}
                      <td className="p-3.5">
                        <div className="flex items-center space-x-1.5 font-medium text-slate-200">
                          <span className="text-emerald-400 font-bold">{row.loadingCity}</span>
                          <span className="text-slate-500">➔</span>
                          <span className="text-teal-400 font-bold">{row.unloadingCity}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                          <span>PIN: {row.loadingPin} ➔ {row.unloadingPin}</span>
                          {row.estimatedDistanceKm && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 text-[10px]">
                              ~{row.estimatedDistanceKm} km
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Vehicle Type */}
                      <td className="p-3.5">
                        <div className="font-medium text-slate-200">{row.vehicleType}</div>
                        <div className="text-[11px] text-slate-400">{row.vehicleSubType || 'Standard Body'}</div>
                        <span className="inline-block mt-1 text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400">
                          {row.cargoType}
                        </span>
                      </td>

                      {/* Cargo Description */}
                      <td className="p-3.5 max-w-xs">
                        <div className="truncate text-slate-300" title={row.material}>
                          {row.material || 'General Cargo'}
                        </div>
                      </td>

                      {/* Loading Date */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{row.loadingDate || 'Immediate'}</span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-3.5 whitespace-nowrap">
                        <select
                          value={row.status || 'new'}
                          onChange={(e) => onUpdateStatus(row.user_id, e.target.value as any)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="new">🟡 New Lead</option>
                          <option value="quoted">🔵 Quoted</option>
                          <option value="assigned">🟢 Transporter Assigned</option>
                          <option value="in_transit">🟣 In Transit</option>
                          <option value="completed">✅ Completed</option>
                        </select>
                      </td>

                      {/* Smart Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onSelectBookingForMatch(row)}
                            title="Match with Transporters"
                            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium transition"
                          >
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>Auto-Match</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
