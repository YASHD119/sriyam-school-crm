import React from 'react';
import { 
  Users, 
  UserPlus, 
  BookOpen, 
  CreditCard, 
  ShieldCheck, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  Lock, 
  Eye, 
  ChevronRight,
  ShieldAlert,
  Bell
} from 'lucide-react';
import { Lead, StudentRecord, ProtectedDocument, FeeInvoice, SecurityAuditLog } from '../types';

interface AdminDashboardOverviewProps {
  leads: Lead[];
  students: StudentRecord[];
  documents: ProtectedDocument[];
  fees: FeeInvoice[];
  logs: SecurityAuditLog[];
  onNavigateTab: (tab: any) => void;
  onOpenDoc: (doc: ProtectedDocument) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  leads,
  students,
  documents,
  fees,
  logs,
  onNavigateTab,
  onOpenDoc
}) => {
  const activeLeads = leads.filter(l => l.status !== 'ENROLLED' && l.status !== 'CLOSED').length;
  const enrolledCount = students.length;
  const totalRevenue = fees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);
  const blockedCount = logs.filter(l => l.status === 'BLOCKED' || l.status === 'FLAGGED').length;

  return (
    <div className="space-y-6">
      {/* Welcome & System Status Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sriyam School ERP & CRM Sentinel</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrative Control Center
          </h1>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Manage school admissions, student SIS directories, fee collection, and protected digital curriculum distribution with enforced anti-leak DRM watermarking.
          </p>
        </div>

        {/* Quick action buttons on banner */}
        <div className="mt-6 pt-4 border-t border-emerald-700/60 flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigateTab('leads')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admissions Pipeline</span>
          </button>

          <button
            onClick={() => onNavigateTab('students')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Issue Student Logins</span>
          </button>

          <button
            onClick={() => onNavigateTab('vault')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Vault</span>
          </button>

          <button
            onClick={() => onNavigateTab('audit')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>DRM Audit Telemetry</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Admissions */}
        <div 
          onClick={() => onNavigateTab('leads')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Admission Funnel</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{activeLeads}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active applicant inquiries</span>
          </p>
        </div>

        {/* Enrolled Students */}
        <div 
          onClick={() => onNavigateTab('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Enrolled Students</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{enrolledCount}</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Across Grades 9 to 12
          </p>
        </div>

        {/* Fees Collected */}
        <div 
          onClick={() => onNavigateTab('fees')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fee Collection</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-purple-600 font-semibold mt-1">
            Term 2 fees reconciled
          </p>
        </div>

        {/* Security / DRM Shield Interceptions */}
        <div 
          onClick={() => onNavigateTab('audit')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">DRM Interceptions</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 transition">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-rose-700">{blockedCount}</h3>
          <p className="text-xs text-rose-600 font-semibold mt-1">
            Blocked downloads & prints
          </p>
        </div>
      </div>

      {/* Split Section: Recent Admissions Leads & DRM Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Admissions Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Recent Admission Inquiries</span>
            </h3>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View CRM Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 3).map((lead) => (
              <div key={lead.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{lead.studentName}</h4>
                  <p className="text-[11px] text-slate-500">
                    {lead.gradeApplying} • Guardian: {lead.guardianName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {lead.status.replace('_', ' ')}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{lead.createdAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live DRM Sentinel & Watermark Feed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Real-Time DRM Security Telemetry</span>
            </h3>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Full Audit Logs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {logs.slice(0, 3).map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    {log.status === 'BLOCKED' ? (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                    ) : log.status === 'FLAGGED' ? (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    )}
                    <span>{log.action.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate max-w-[260px]">
                    {log.actorName} • {log.details}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    log.status === 'BLOCKED' ? 'bg-rose-100 text-rose-800' :
                    log.status === 'FLAGGED' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {log.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {log.timestamp.split(' ')[1]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Featured Protected Documents Preview */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Published Curriculum & Protected Notes</span>
            </h3>
            <p className="text-xs text-slate-500">
              Students access these materials in strict read-only mode with anti-download protection.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('vault')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Manage All Vault Materials</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.slice(0, 3).map((doc) => (
            <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {doc.subject}
                  </span>
                  <span className="text-rose-600 font-mono flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Protected</span>
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Grade: {doc.grade} • {doc.totalPages} Pages
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  {doc.viewsCount} Student Views
                </span>
                <button
                  onClick={() => onOpenDoc(doc)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Test Reader</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

