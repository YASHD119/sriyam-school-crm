import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  User, 
  Tag, 
  AlertTriangle, 
  Plus, 
  Filter, 
  Search,
  X
} from 'lucide-react';
import { Notice, UserSession } from '../types';

interface NoticesViewProps {
  notices: Notice[];
  currentUser: UserSession;
  onAddNotice?: (notice: Omit<Notice, 'id' | 'publishedDate'>) => void;
}

export const NoticesView: React.FC<NoticesViewProps> = ({
  notices,
  currentUser,
  onAddNotice
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);

  const isStudent = currentUser.role === 'STUDENT';

  const [newNoticeData, setNewNoticeData] = useState({
    title: '',
    category: 'CIRCULAR' as Notice['category'],
    targetAudience: 'ALL' as Notice['targetAudience'],
    publishedBy: currentUser.name,
    content: '',
    priority: 'HIGH' as Notice['priority']
  });

  const visibleNotices = notices.filter(n => {
    if (isStudent && n.targetAudience === 'STAFF') return false;
    const matchesSearch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeData.title || !newNoticeData.content) return;
    if (onAddNotice) {
      onAddNotice(newNoticeData);
    }
    setIsAddNoticeOpen(false);
    setNewNoticeData({
      title: '',
      category: 'CIRCULAR',
      targetAudience: 'ALL',
      publishedBy: currentUser.name,
      content: '',
      priority: 'HIGH'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>School Circulars & Official Announcements</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {visibleNotices.length} Published
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official communications, examination schedules, policy updates, and holiday circulars.
          </p>
        </div>

        {!isStudent && (
          <button
            onClick={() => setIsAddNoticeOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Circular</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="EXAM">Examinations</option>
            <option value="CIRCULAR">Administrative Circulars</option>
            <option value="EVENT">Sports & Events</option>
          </select>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {visibleNotices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-400 shadow-sm transition space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  notice.priority === 'URGENT' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                  notice.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  {notice.priority} NOTICE
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {notice.category}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  Audience: <strong className="text-slate-700">{notice.targetAudience}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>{notice.publishedDate}</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {notice.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              {notice.content}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Authorized Signatory: <strong className="text-slate-600">{notice.publishedBy}</strong></span>
              <span className="text-emerald-700 font-semibold">Official Sriyam Gazette</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Notice Modal */}
      {isAddNoticeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                <span>Draft New Official Circular</span>
              </h3>
              <button 
                onClick={() => setIsAddNoticeOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Circular Subject / Title *
                </label>
                <input
                  type="text"
                  required
                  value={newNoticeData.title}
                  onChange={(e) => setNewNoticeData({ ...newNoticeData, title: e.target.value })}
                  placeholder="e.g. Schedule for Second Term Practical Assessments"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={newNoticeData.category}
                    onChange={(e) => setNewNoticeData({ ...newNoticeData, category: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="CIRCULAR">Administrative Circular</option>
                    <option value="EXAM">Examination & Hall Tickets</option>
                    <option value="EVENT">Sports & Events</option>
                    <option value="HOLIDAY">Holiday Notification</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newNoticeData.targetAudience}
                    onChange={(e) => setNewNoticeData({ ...newNoticeData, targetAudience: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="ALL">All School (Students, Parents, Staff)</option>
                    <option value="STUDENTS">Students Only</option>
                    <option value="PARENTS">Parents Only</option>
                    <option value="STAFF">Faculty & Staff Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Announcement Text *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newNoticeData.content}
                  onChange={(e) => setNewNoticeData({ ...newNoticeData, content: e.target.value })}
                  placeholder="Type the complete circular text here..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddNoticeOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

