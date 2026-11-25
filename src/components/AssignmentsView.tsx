import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Award,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Assignment, UserSession } from '../types';

interface AssignmentsViewProps {
  assignments: Assignment[];
  currentUser: UserSession;
  onAddAssignment?: (assignment: Assignment) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  currentUser,
  onAddAssignment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isStudent = currentUser.role === 'STUDENT';

  const [newAsg, setNewAsg] = useState<Omit<Assignment, 'id' | 'submissionsCount' | 'totalStudents'>>({
    title: '',
    course: 'Advanced Mechanics & Gravitational Dynamics',
    dueDate: '2026-12-15',
    totalMarks: 25,
    status: 'ACTIVE',
    description: ''
  });

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsg.title) return;
    if (onAddAssignment) {
      onAddAssignment({
        ...newAsg,
        id: `asg-${Date.now()}`,
        submissionsCount: 0,
        totalStudents: 140
      });
    }
    setIsAddModalOpen(false);
    setNewAsg({
      title: '',
      course: 'Advanced Mechanics & Gravitational Dynamics',
      dueDate: '2026-12-15',
      totalMarks: 25,
      status: 'ACTIVE',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{isStudent ? 'My Course Assignments' : 'Assessment & Assignment Manager'}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {filteredAssignments.length} Assignments
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isStudent 
              ? 'View problem sheets, deadlines, submission status, and evaluated grades.' 
              : 'Create assignments, monitor submission progress, and publish academic grade rubrics.'}
          </p>
        </div>

        {!isStudent && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Assignment</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assignment title, course..."
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
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active (In Progress)</option>
            <option value="EVALUATED">Evaluated</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssignments.map((asg) => {
          const submissionPercent = Math.round((asg.submissionsCount / asg.totalStudents) * 100);

          return (
            <div
              key={asg.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm transition p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {asg.course}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    asg.status === 'ACTIVE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {asg.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-2 leading-snug">
                  {asg.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  {asg.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                {/* Due Date & Marks */}
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: <strong>{asg.dueDate}</strong></span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {asg.totalMarks} Marks
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Submissions</span>
                    <span className="font-semibold text-slate-700">
                      {asg.submissionsCount} / {asg.totalStudents} ({submissionPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${submissionPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span>Create New Assignment</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={newAsg.title}
                  onChange={(e) => setNewAsg({ ...newAsg, title: e.target.value })}
                  placeholder="e.g. Problem Set 3: Rotational Dynamics"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Course
                  </label>
                  <select
                    value={newAsg.course}
                    onChange={(e) => setNewAsg({ ...newAsg, course: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Advanced Mechanics & Gravitational Dynamics">Advanced Mechanics</option>
                    <option value="Differential Calculus & Coordinate Geometry">Differential Calculus</option>
                    <option value="Organic Reaction Mechanisms & Stereochemistry">Organic Chemistry</option>
                    <option value="Cellular Biology, Genetics & Evolution">Cellular Biology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newAsg.dueDate}
                    onChange={(e) => setNewAsg({ ...newAsg, dueDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Instructions & Question References
                </label>
                <textarea
                  rows={3}
                  value={newAsg.description}
                  onChange={(e) => setNewAsg({ ...newAsg, description: e.target.value })}
                  placeholder="State requirements, reference document page numbers, and grading rubric..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
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
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
