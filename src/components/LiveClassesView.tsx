import React, { useState } from 'react';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  Plus, 
  Play, 
  X,
  Radio,
  Sparkles
} from 'lucide-react';
import { LiveClass, UserSession } from '../types';

interface LiveClassesViewProps {
  liveClasses: LiveClass[];
  currentUser: UserSession;
  onAddClass?: (cls: LiveClass) => void;
}

export const LiveClassesView: React.FC<LiveClassesViewProps> = ({
  liveClasses,
  currentUser,
  onAddClass
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isStudent = currentUser.role === 'STUDENT';

  const [newClass, setNewClass] = useState<Omit<LiveClass, 'id'>>({
    title: '',
    course: 'Advanced Mechanics & Gravitational Dynamics',
    instructor: currentUser.name,
    date: 'Today',
    time: '04:00 PM - 05:00 PM',
    duration: '60 Mins',
    meetUrl: 'https://meet.sriyamschool.edu.in/room-live',
    status: 'SCHEDULED'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.title) return;
    if (onAddClass) {
      onAddClass({
        ...newClass,
        id: `live-${Date.now()}`
      });
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Live Virtual Classrooms</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>Online Lectures</span>
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time interactive video lectures, doubt clarification webinars, and laboratory broadcasts.
          </p>
        </div>

        {!isStudent && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Live Class</span>
          </button>
        )}
      </div>

      {/* Grid of Live Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {liveClasses.map((cls) => (
          <div
            key={cls.id}
            className={`rounded-2xl border p-5 flex flex-col justify-between transition ${
              cls.status === 'LIVE'
                ? 'bg-gradient-to-b from-rose-50/60 to-white border-rose-300 shadow-md ring-1 ring-rose-400/30'
                : 'bg-white border-slate-200 shadow-sm hover:border-emerald-400'
            }`}
          >
            <div>
              {/* Status & Course */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {cls.course}
                </span>

                {cls.status === 'LIVE' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                    <Radio className="w-3 h-3" />
                    <span>HAPPENING NOW</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {cls.status}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-2 leading-snug">
                {cls.title}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.time} ({cls.duration})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Faculty: <strong>{cls.instructor}</strong></span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Encrypted Stream
              </span>

              <a
                href={cls.meetUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition ${
                  cls.status === 'LIVE'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{cls.status === 'LIVE' ? 'Join Live Room' : 'Class Link'}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-600" />
                <span>Schedule New Live Lecture</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Lecture Title *
                </label>
                <input
                  type="text"
                  required
                  value={newClass.title}
                  onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                  placeholder="e.g. Revision & Numerical Problems: Kepler Laws"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Course
                  </label>
                  <select
                    value={newClass.course}
                    onChange={(e) => setNewClass({ ...newClass, course: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Advanced Mechanics & Gravitational Dynamics">Advanced Mechanics</option>
                    <option value="Differential Calculus & Coordinate Geometry">Differential Calculus</option>
                    <option value="Organic Reaction Mechanisms & Stereochemistry">Organic Chemistry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={newClass.time}
                    onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                    placeholder="10:00 AM - 11:30 AM"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
