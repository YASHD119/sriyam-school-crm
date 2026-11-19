import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  Clock, 
  Award, 
  UserCheck, 
  CreditCard, 
  Bell, 
  Eye, 
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import { UserSession, ProtectedDocument, Notice } from '../types';

interface StudentPortalDashboardProps {
  currentUser: UserSession;
  documents: ProtectedDocument[];
  notices: Notice[];
  onOpenDoc: (doc: ProtectedDocument) => void;
  onNavigateTab: (tab: any) => void;
}

export const StudentPortalDashboard: React.FC<StudentPortalDashboardProps> = ({
  currentUser,
  documents,
  notices,
  onOpenDoc,
  onNavigateTab
}) => {
  const details = currentUser.studentDetails;
  const grade = details?.grade || 'Grade 10';

  // Filter student accessible docs
  const myDocs = documents.filter(d => d.grade.includes(grade) || d.grade.includes('All Grades'));

  return (
    <div className="space-y-6">
      {/* Student Welcome & Digital ID Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  STUDENT PORTAL
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {details?.rollNo}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                {currentUser.name}
              </h1>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>{details?.grade} • {details?.section}</span>
                <span>•</span>
                <span>Guardian: {details?.guardianName}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Attendance: {details?.attendancePercent}%</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('vault')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Protected Notes</span>
            </button>
          </div>
        </div>

        {/* Security Policy Badge */}
        <div className="mt-6 pt-4 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-200/80">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Strict Read-Only Permission: Content download and screen captures are monitored and disabled.</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-300">
            <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dynamic Watermark Active</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attendance Rate</p>
            <h3 className="text-xl font-extrabold text-emerald-700 mt-1">{details?.attendancePercent}%</h3>
            <span className="text-[10px] text-emerald-600 font-medium">Eligible for Board Exams</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Study Materials</p>
            <h3 className="text-xl font-extrabold text-blue-700 mt-1">{myDocs.length} Modules</h3>
            <span className="text-[10px] text-blue-600 font-medium">Read-Only Protected</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Term Fee Status</p>
            <h3 className="text-xl font-extrabold text-emerald-700 mt-1">{details?.feeStatus}</h3>
            <span className="text-[10px] text-emerald-600 font-medium">Term 2 Cleared</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next Examination</p>
            <h3 className="text-xl font-extrabold text-amber-700 mt-1">Dec 02</h3>
            <span className="text-[10px] text-amber-600 font-medium">Physics Mid-Term</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recommended Protected Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Assigned Curriculum & Revision Notes</span>
            </h3>
            <p className="text-xs text-slate-500">
              Encrypted notes for {grade}. Click to open in the Secure Canvas Reader.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('vault')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All ({myDocs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myDocs.slice(0, 2).map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {doc.subject}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-600 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Download Disabled</span>
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Author: {doc.uploadedBy} • {doc.totalPages} Pages
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  DRM Watermark Armed
                </span>
                <button
                  onClick={() => onOpenDoc(doc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Secure Reader</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Notices for Students */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600" />
          <span>Recent School Circulars</span>
        </h3>

        <div className="space-y-3">
          {notices.slice(0, 2).map((notice) => (
            <div key={notice.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-emerald-800">{notice.category}</span>
                <span className="text-slate-400">{notice.publishedDate}</span>
              </div>
              <h5 className="font-bold text-slate-900 text-xs">{notice.title}</h5>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {notice.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

