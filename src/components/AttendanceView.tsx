import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Percent, 
  X 
} from 'lucide-react';
import { AttendanceSession, UserSession } from '../types';

interface AttendanceViewProps {
  sessions: AttendanceSession[];
  currentUser: UserSession;
  onRecordSession?: (session: AttendanceSession) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  sessions,
  currentUser,
  onRecordSession
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const isStudent = currentUser.role === 'STUDENT';

  const [newSession, setNewSession] = useState<Omit<AttendanceSession, 'id' | 'status'>>({
    date: new Date().toISOString().split('T')[0],
    course: 'Advanced Mechanics & Dynamics',
    section: 'Grade 10 - Section A',
    faculty: currentUser.name,
    presentCount: 39,
    totalCount: 42
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRecordSession) {
      onRecordSession({
        ...newSession,
        id: `att-${Date.now()}`,
        status: 'SUBMITTED'
      });
    }
    setIsRecordOpen(false);
  };

  const filteredSessions = sessions.filter(s => 
    s.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{isStudent ? 'My Attendance Record' : 'Institutional Attendance Tracking'}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {isStudent ? `${currentUser.studentDetails?.attendancePercent}% Average` : `${sessions.length} Logged Sessions`}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isStudent 
              ? 'Attendance records for lectures, laboratory sessions, and mandatory curricular events.' 
              : 'Log daily attendance per class section, monitor absentees, and export compliance reports.'}
          </p>
        </div>

        {!isStudent && (
          <button
            onClick={() => setIsRecordOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Take Class Attendance</span>
          </button>
        )}
      </div>

      {/* Student Banner if Student */}
      {isStudent && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Attendance Health Status
            </span>
            <h3 className="text-xl font-extrabold mt-0.5">
              {currentUser.studentDetails?.attendancePercent}% Attendance Rate
            </h3>
            <p className="text-xs text-emerald-100/80 mt-1">
              Minimum 75% required by Board Regulations. Your status is <strong>Excellent</strong>.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <UserCheck className="w-8 h-8 text-emerald-300" />
          </div>
        </div>
      )}

      {/* Attendance Sessions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search session, class, faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Course & Class</th>
                <th className="py-3.5 px-4">Faculty Incharge</th>
                <th className="py-3.5 px-4">Turnout</th>
                <th className="py-3.5 px-4">Percentage</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.map((s) => {
                const pct = Math.round((s.presentCount / s.totalCount) * 100);

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {s.date}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{s.course}</div>
                      <div className="text-[11px] text-slate-500">{s.section}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {s.faculty}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-emerald-700">{s.presentCount}</span> / {s.totalCount} Present
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${pct >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-700">{pct}%</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Modal */}
      {isRecordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span>Log Class Attendance</span>
              </h3>
              <button 
                onClick={() => setIsRecordOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Course
                </label>
                <select
                  value={newSession.course}
                  onChange={(e) => setNewSession({ ...newSession, course: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Advanced Mechanics & Dynamics">Advanced Mechanics</option>
                  <option value="Differential Calculus">Differential Calculus</option>
                  <option value="Organic Chemistry Lab">Organic Chemistry</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Class & Section
                </label>
                <input
                  type="text"
                  required
                  value={newSession.section}
                  onChange={(e) => setNewSession({ ...newSession, section: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Present Count
                  </label>
                  <input
                    type="number"
                    value={newSession.presentCount}
                    onChange={(e) => setNewSession({ ...newSession, presentCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Total Strength
                  </label>
                  <input
                    type="number"
                    value={newSession.totalCount}
                    onChange={(e) => setNewSession({ ...newSession, totalCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
                >
                  Submit Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
