import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Tag, 
  BookOpen, 
  AlertCircle,
  X 
} from 'lucide-react';
import { CalendarEvent, UserSession } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  currentUser: UserSession;
  onAddEvent?: (event: CalendarEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  currentUser,
  onAddEvent
}) => {
  const [filterType, setFilterType] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const isStudent = currentUser.role === 'STUDENT';

  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    date: '2026-12-10',
    type: 'EXAM',
    timing: '10:00 AM - 01:00 PM',
    tag: 'All Students'
  });

  const filteredEvents = events.filter(e => filterType === 'ALL' || e.type === filterType);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    if (onAddEvent) {
      onAddEvent({
        ...newEvent,
        id: `evt-${Date.now()}`
      });
    }
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Global Academic Calendar</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              December 2026
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master timetable for examinations, assignment due dates, webinars, and institutional holidays.
          </p>
        </div>

        {!isStudent && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Event</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'EXAM', 'DEADLINE', 'LECTURE', 'HOLIDAY'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === t 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t === 'ALL' ? 'All Events' : t}
          </button>
        ))}
      </div>

      {/* Events Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-emerald-400 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  evt.type === 'EXAM' ? 'bg-rose-100 text-rose-800' :
                  evt.type === 'DEADLINE' ? 'bg-amber-100 text-amber-800' :
                  evt.type === 'HOLIDAY' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {evt.type}
                </span>

                <span className="text-[11px] font-mono text-slate-500">
                  {evt.date}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-2 leading-snug">
                {evt.title}
              </h3>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{evt.timing}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                <Tag className="w-3 h-3" />
                <span>Target: {evt.tag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-emerald-600" />
                <span>Create Calendar Entry</span>
              </h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Physics Practical Examination"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="EXAM">Examination</option>
                    <option value="DEADLINE">Deadline</option>
                    <option value="LECTURE">Special Lecture</option>
                    <option value="HOLIDAY">Holiday</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Timing & Schedule
                </label>
                <input
                  type="text"
                  value={newEvent.timing}
                  onChange={(e) => setNewEvent({ ...newEvent, timing: e.target.value })}
                  placeholder="09:00 AM - 12:00 PM"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
                >
                  Publish to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
