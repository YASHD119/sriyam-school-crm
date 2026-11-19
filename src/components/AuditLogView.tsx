import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  Clock, 
  Lock, 
  Eye, 
  AlertTriangle,
  Fingerprint,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { SecurityAuditLog } from '../types';

interface AuditLogViewProps {
  logs: SecurityAuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.documentTitle && log.documentTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Security DRM & Forensic Access Audit Logs</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Active Sentinel
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time audit telemetry tracking document access, watermark stamping, and blocked download/screenshot attempts.
          </p>
        </div>
      </div>

      {/* Security Engine Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Security Events</p>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">{logs.length}</h3>
          <span className="text-[10px] text-emerald-600 font-medium">All logged with IP & timestamp</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Blocked Print Attempts</p>
          <h3 className="text-xl font-extrabold text-rose-700 mt-1">
            {logs.filter(l => l.action === 'PRINT_ATTEMPT_BLOCKED').length}
          </h3>
          <span className="text-[10px] text-rose-500 font-medium">Intercepted before spooling</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Screen Capture Shields</p>
          <h3 className="text-xl font-extrabold text-amber-700 mt-1">
            {logs.filter(l => l.action === 'SCREEN_CAPTURE_BLOCKED' || l.action === 'TAB_SWITCH_BLUR').length}
          </h3>
          <span className="text-[10px] text-amber-600 font-medium">Blur shield auto-deployed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Forensic Watermarks Stamped</p>
          <h3 className="text-xl font-extrabold text-emerald-700 mt-1">
            {logs.filter(l => l.action === 'DOCUMENT_VIEWED').length + 84}
          </h3>
          <span className="text-[10px] text-emerald-600 font-medium">100% Student-attributed</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student, IP, document, action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Events</option>
            <option value="BLOCKED">Blocked Violations</option>
            <option value="FLAGGED">Flagged / Shielded</option>
            <option value="LOGGED">Standard Access</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Timestamp & IP</th>
                <th className="py-3.5 px-4">Student / Actor</th>
                <th className="py-3.5 px-4">Event & Action</th>
                <th className="py-3.5 px-4">Document Affected</th>
                <th className="py-3.5 px-4">Incident Details</th>
                <th className="py-3.5 px-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="font-mono text-slate-900 font-semibold">{log.timestamp}</div>
                    <div className="text-[11px] font-mono text-slate-400">IP: {log.ipAddress}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{log.actorName}</div>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {log.actorRole}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                    {log.documentTitle || '—'}
                  </td>

                  <td className="py-3 px-4 text-slate-500 max-w-sm text-[11px]">
                    {log.details}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'BLOCKED' ? 'bg-rose-100 text-rose-800' :
                      log.status === 'FLAGGED' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {log.status === 'BLOCKED' && <Lock className="w-2.5 h-2.5" />}
                      {log.status === 'FLAGGED' && <AlertTriangle className="w-2.5 h-2.5" />}
                      {log.status === 'LOGGED' && <CheckCircle2 className="w-2.5 h-2.5" />}
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

