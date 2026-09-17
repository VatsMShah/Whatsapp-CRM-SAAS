import React, { useState, useMemo } from 'react';
import {
  Search,
  Truck,
  Phone,
  ShieldCheck,
  Send,
  MapPin,
  CheckSquare,
  Square,
  Download,
  CheckCircle2,
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('all');

  const filteredTransporters = useMemo(() => {
    return transporters.filter((t) => {
      const matchesSearch =
        t.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.routePreference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.driverPhone?.includes(searchQuery);

      const matchesVehicle = vehicleFilter === 'all' || t.vehicleType === vehicleFilter;
      return matchesSearch && matchesVehicle;
    });
  }, [transporters, searchQuery, vehicleFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTransporters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTransporters.map((t) => t.user_id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedRows = useMemo(() => {
    return transporters.filter((t) => selectedIds.includes(t.user_id));
  }, [transporters, selectedIds]);

  const exportCSV = () => {
    const rowsToExport = selectedRows.length > 0 ? selectedRows : filteredTransporters;
    const headers = ['Vehicle Number', 'Driver Name', 'Vehicle Type', 'Capacity', 'Routes', 'Phone', 'Availability'];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headers.join(','),
        ...rowsToExport.map((r) =>
          [
            `"${r.vehicleNumber}"`,
            `"${r.driverName}"`,
            r.vehicleType,
            `"${r.capacity}"`,
            `"${r.routePreference}"`,
            r.driverPhone,
            `"${r.availability}"`,
          ].join(',')
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transporters_fleet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search driver, vehicle number, routes..."
              className="w-full bg-slate-900 border border-slate-700/70 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Vehicle Types</option>
            <option value="Truck">Trucks (Open / Close)</option>
            <option value="Container">Containers</option>
            <option value="Tempo">Tempos (7ft - 17ft)</option>
            <option value="Trailer / ODC">Trailers / ODC</option>
          </select>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/70 hover:border-slate-600 text-xs font-medium text-slate-200 hover:text-white transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Fleet CSV</span>
        </button>
      </div>

      {/* Floating 1-Click Multi-Select Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/90 to-slate-900 border border-emerald-500/40 p-3.5 rounded-2xl shadow-xl flex items-center justify-between animate-slide-up">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-semibold text-white">
              {selectedIds.length} transporter{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => onOpenBroadcastForSelected(selectedRows)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>1-Click Load Broadcast / Inquiry</span>
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

      {/* Table Mirror */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-3.5 w-10 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                    {selectedIds.length > 0 && selectedIds.length === filteredTransporters.length ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5">Vehicle Info</th>
                <th className="p-3.5">Driver / Owner Name</th>
                <th className="p-3.5">Payload Capacity</th>
                <th className="p-3.5">Preferred Routes</th>
                <th className="p-3.5">Phone & Verification</th>
                <th className="p-3.5">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredTransporters.map((row) => {
                const isSelected = selectedIds.includes(row.user_id);
                return (
                  <tr
                    key={row.user_id}
                    className={`table-row-hover ${isSelected ? 'bg-emerald-950/20' : ''}`}
                  >
                    <td className="p-3.5 text-center">
                      <button onClick={() => toggleSelectRow(row.user_id)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>
                    </td>

                    {/* Vehicle */}
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-emerald-400 text-sm">{row.vehicleNumber}</div>
                      <div className="text-slate-400 text-[11px] flex items-center space-x-1 mt-0.5">
                        <Truck className="w-3.5 h-3.5 text-slate-500" />
                        <span>{row.vehicleType}</span>
                      </div>
                    </td>

                    {/* Driver */}
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{row.driverName}</div>
                      {row.notes && <div className="text-slate-400 text-[11px] truncate max-w-xs">{row.notes}</div>}
                    </td>

                    {/* Capacity */}
                    <td className="p-3.5">
                      <span className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 font-semibold text-slate-200">
                        {row.capacity}
                      </span>
                    </td>

                    {/* Routes */}
                    <td className="p-3.5 max-w-sm">
                      <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate" title={row.routePreference}>
                          {row.routePreference}
                        </span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="p-3.5">
                      <div className="flex items-center space-x-1.5 text-slate-200">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{row.driverPhone}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[10px] text-emerald-400 mt-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Transporter</span>
                      </div>
                    </td>

                    {/* Availability */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>{row.availability || 'Available'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
