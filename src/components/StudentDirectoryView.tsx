import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Phone, 
  Mail, 
  BookOpen, 
  Award,
  X,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentDirectoryViewProps {
  students: StudentRecord[];
  onAddStudent: (student: Omit<StudentRecord, 'id'>) => void;
}

export const StudentDirectoryView: React.FC<StudentDirectoryViewProps> = ({
  students,
  onAddStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [isCreateLoginOpen, setIsCreateLoginOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState<{ student: StudentRecord; pass: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // New Student state
  const [newStudentData, setNewStudentData] = useState({
    rollNo: `SRI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    grade: 'Grade 10',
    section: 'A',
    guardianName: '',
    phone: '',
    email: '',
    attendance: 95.0,
    gpa: '9.0 / 10',
    feeStatus: 'PAID' as StudentRecord['feeStatus'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    active: true
  });

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'ALL' || s.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const handleGenerateLogin = (student: StudentRecord) => {
    const randomPass = `Sriyam#${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedCreds({
      student,
      pass: randomPass
    });
    setIsCreateLoginOpen(true);
  };

  const handleCopyCredentials = () => {
    if (!generatedCreds) return;
    const text = `Sriyam School Portal Credentials:\nStudent: ${generatedCreds.student.name}\nRoll No / Login ID: ${generatedCreds.student.rollNo}\nPortal URL: https://portal.sriyamschool.edu.in\nTemporary Password: ${generatedCreds.pass}\nSecurity Note: Access is strict Read-Only. Direct file download and screenshot capture are disabled.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.name || !newStudentData.phone) return;
    onAddStudent(newStudentData);
    setIsAddStudentOpen(false);
    // Reset form
    setNewStudentData({
      rollNo: `SRI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      grade: 'Grade 10',
      section: 'A',
      guardianName: '',
      phone: '',
      email: '',
      attendance: 95.0,
      gpa: '9.0 / 10',
      feeStatus: 'PAID',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      active: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Student Information System (SIS)</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {students.length} Enrolled Students
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage student records, generate secure read-only logins, and track fee and attendance statuses.
          </p>
        </div>

        <button
          onClick={() => setIsAddStudentOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Filter Grade:</span>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Grades</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Student & Roll No</th>
                <th className="py-3.5 px-4">Grade & Section</th>
                <th className="py-3.5 px-4">Guardian & Phone</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">GPA Score</th>
                <th className="py-3.5 px-4">Fee Status</th>
                <th className="py-3.5 px-4 text-right">Student Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr 
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="hover:bg-slate-50/80 transition cursor-pointer group"
                >
                  {/* Name & Roll */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 ring-2 ring-transparent group-hover:ring-emerald-500/30 transition"
                      />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition">
                          {student.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {student.rollNo}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Grade */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700">
                      {student.grade} - {student.section}
                    </span>
                  </td>

                  {/* Guardian */}
                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium">{student.guardianName}</div>
                    <div className="text-[11px] text-slate-400">{student.phone}</div>
                  </td>

                  {/* Attendance */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            student.attendance >= 90 ? 'bg-emerald-500' :
                            student.attendance >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-700 font-medium">
                        {student.attendance}%
                      </span>
                    </div>
                  </td>

                  {/* GPA */}
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {student.gpa}
                  </td>

                  {/* Fee Status */}
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      student.feeStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                      student.feeStatus === 'PARTIAL' ? 'bg-blue-100 text-blue-800' :
                      student.feeStatus === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {student.feeStatus}
                    </span>
                  </td>

                  {/* Login Action */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleGenerateLogin(student)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[11px] font-semibold transition shadow-sm"
                      title="Issue Student Login Credentials"
                    >
                      <Key className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Issue Login</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Login Modal */}
      {isCreateLoginOpen && generatedCreds && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Student Login Provisioned
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Generated for {generatedCreds.student.name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateLoginOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                  <span className="text-emerald-800 font-medium">Access Level:</span>
                  <span className="font-bold text-emerald-950 px-2 py-0.5 rounded bg-emerald-200/80 text-[10px]">
                    STRICT READ-ONLY
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-800 font-medium">Login User ID:</span>
                  <span className="font-mono font-bold text-emerald-950 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {generatedCreds.student.rollNo}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-800 font-medium">Temporary Password:</span>
                  <span className="font-mono font-bold text-emerald-950 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {generatedCreds.pass}
                  </span>
                </div>
              </div>

              {/* Security Policy Reminder */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Sriyam Content Protection Policy:</strong> This student login has zero editing/download privileges. All curriculum documents viewed are watermarked with their identity.
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleCopyCredentials}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-md"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials for SMS/Email'}</span>
                </button>
                <button
                  onClick={() => setIsCreateLoginOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Enroll New Student in SIS</span>
              </h3>
              <button 
                onClick={() => setIsAddStudentOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentData.name}
                    onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
                    placeholder="e.g. Priyanshu Sharma"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Roll Number (System Auto)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={newStudentData.rollNo}
                    className="w-full text-xs px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Grade
                  </label>
                  <select
                    value={newStudentData.grade}
                    onChange={(e) => setNewStudentData({ ...newStudentData, grade: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Section
                  </label>
                  <select
                    value={newStudentData.section}
                    onChange={(e) => setNewStudentData({ ...newStudentData, section: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentData.guardianName}
                    onChange={(e) => setNewStudentData({ ...newStudentData, guardianName: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newStudentData.phone}
                    onChange={(e) => setNewStudentData({ ...newStudentData, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

