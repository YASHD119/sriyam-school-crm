import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Clock, 
  CheckCircle2, 
  Layers, 
  GraduationCap,
  X,
  FileText
} from 'lucide-react';
import { Course, UserSession } from '../types';

interface CoursesViewProps {
  courses: Course[];
  currentUser: UserSession;
  onAddCourse?: (course: Omit<Course, 'id' | 'enrolledCount' | 'modulesCount'>) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  currentUser,
  onAddCourse
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isStudent = currentUser.role === 'STUDENT';

  const [newCourse, setNewCourse] = useState({
    title: '',
    code: 'PHY-102',
    department: 'Department of Physical Sciences',
    semester: 'Grade 10 • Semester II',
    instructor: currentUser.name,
    status: 'ACTIVE' as Course['status'],
    description: ''
  });

  const filteredCourses = courses.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || c.department.includes(deptFilter);
    return matchesSearch && matchesDept;
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.code) return;
    if (onAddCourse) {
      onAddCourse(newCourse);
    }
    setIsAddModalOpen(false);
    setNewCourse({
      title: '',
      code: 'PHY-102',
      department: 'Department of Physical Sciences',
      semester: 'Grade 10 • Semester II',
      instructor: currentUser.name,
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
            <span>{isStudent ? 'My Enrolled Courses' : 'Academic Course Offerings'}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {filteredCourses.length} Courses
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isStudent 
              ? 'Access enrolled subjects, syllabus breakdown, modules, and assigned faculty.' 
              : 'Institutional curriculum catalog, department assignments, and class section enrollments.'}
          </p>
        </div>

        {!isStudent && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Course</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search course title, code, instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Physical">Physical Sciences</option>
            <option value="Mathematical">Mathematical Sciences</option>
            <option value="Chemical">Chemical Sciences</option>
            <option value="Biological">Biological Sciences</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
          >
            <div>
              {/* Badge & Code */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {course.code}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>{course.status}</span>
                </span>
              </div>

              {/* Title & Department */}
              <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                {course.title}
              </h3>
              <p className="text-xs font-medium text-emerald-700 mb-3">
                {course.department} • {course.semester}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                {course.description}
              </p>
            </div>

            {/* Footer Stats */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.enrolledCount} Students</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.modulesCount} Modules</span>
                </span>
              </div>

              <div className="font-medium text-slate-700">
                Lead: {course.instructor}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>Create New Course Offering</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder="e.g. Modern Physics & Optics"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    placeholder="PHY-102"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Department
                  </label>
                  <select
                    value={newCourse.department}
                    onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Department of Physical Sciences">Physical Sciences</option>
                    <option value="Department of Mathematical Sciences">Mathematical Sciences</option>
                    <option value="Department of Chemical Sciences">Chemical Sciences</option>
                    <option value="Department of Biological Sciences">Biological Sciences</option>
                    <option value="Department of Computer Science">Computer Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Semester / Grade
                  </label>
                  <input
                    type="text"
                    value={newCourse.semester}
                    onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
                    placeholder="Grade 11 • Semester I"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Course Synopsis & Objectives
                </label>
                <textarea
                  rows={3}
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Summary of syllabus, topics covered, and prerequisite knowledge..."
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
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
