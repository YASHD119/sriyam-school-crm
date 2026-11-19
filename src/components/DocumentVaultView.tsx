import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Lock, 
  ShieldCheck, 
  Plus, 
  BookOpen, 
  Clock, 
  Sparkles,
  FileQuestion,
  Fingerprint,
  X
} from 'lucide-react';
import { ProtectedDocument, UserSession } from '../types';

interface DocumentVaultViewProps {
  documents: ProtectedDocument[];
  currentUser: UserSession;
  onOpenViewer: (doc: ProtectedDocument) => void;
  onAddDocument: (doc: Omit<ProtectedDocument, 'id' | 'uploadedAt' | 'viewsCount'>) => void;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  documents,
  currentUser,
  onOpenViewer,
  onAddDocument
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const isStudent = currentUser.role === 'STUDENT';
  const studentGrade = currentUser.studentDetails?.grade;

  // Filter documents: if student, only show matching grade or general materials
  const visibleDocs = documents.filter(doc => {
    if (isStudent && studentGrade) {
      const gradeMatches = doc.grade.includes(studentGrade) || doc.grade.includes('All Grades');
      if (!gradeMatches) return false;
    }
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'ALL' || doc.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  // Upload state for teachers/admins
  const [uploadData, setUploadData] = useState({
    title: '',
    subject: 'Physics',
    grade: 'Grade 10 & 11',
    uploadedBy: currentUser.name,
    type: 'CURRICULUM_NOTES' as ProtectedDocument['type'],
    classification: 'CONFIDENTIAL' as ProtectedDocument['classification'],
    totalPages: 2,
    fileSize: '3.4 MB (Encrypted Canvas)',
    pages: [
      {
        pageNumber: 1,
        header: 'SRIYAM SCHOOL • SECURE CURRICULUM VAULT',
        sections: [
          {
            title: '1. Module Overview & Core Tenets',
            body: [
              'This module contains proprietary lecture material prepared exclusively for registered Sriyam School students.',
              'All rights reserved. Reproduction, distribution, and unauthorized capture are strictly prohibited under the School Code of Conduct.'
            ],
            callout: 'ATTENTION STUDENTS: Notes must be reviewed prior to weekly class tutorials.'
          }
        ]
      }
    ]
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title) return;
    onAddDocument(uploadData);
    setIsUploadModalOpen(false);
    setUploadData({
      ...uploadData,
      title: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Security Briefing */}
      {isStudent ? (
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Protected Academic Materials Vault</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              Welcome to Your Secure Study Room, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              All documents below are provided under Sriyam’s Read-Only Academic Policy. Content is rendered live on an encrypted canvas; downloading, printing, and screenshot capture are disabled, and your student identification is embedded into the document stream.
            </p>
          </div>
          <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none hidden sm:block">
            <Fingerprint className="w-48 h-48 text-emerald-400" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Curriculum & Protected Document Vault</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {documents.length} Encrypted Assets
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Upload faculty notes, mock question banks, and curriculum files with enforced DRM and student watermarking.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Secure Curriculum</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search document title, subject, faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Subjects</option>
            <option value="Physics">Physics</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Chemistry">Chemistry</option>
          </select>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-5">
              {/* Type and Classification Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  doc.type === 'QUESTION_BANK' ? 'bg-purple-100 text-purple-800' :
                  doc.type === 'CURRICULUM_NOTES' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {doc.type.replace('_', ' ')}
                </span>
                
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
                  <Lock className="w-2.5 h-2.5 text-rose-500" />
                  <span>{doc.classification}</span>
                </span>
              </div>

              {/* Title & Subject */}
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition text-sm leading-snug mb-2">
                {doc.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span className="font-semibold text-slate-700">{doc.subject}</span>
                <span>•</span>
                <span>{doc.grade}</span>
              </div>

              {/* Meta details */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Author:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[160px]">{doc.uploadedBy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pages & Format:</span>
                  <span className="font-medium text-slate-700">{doc.totalPages} Pages (Canvas Stream)</span>
                </div>
                {!isStudent && (
                  <div className="flex items-center justify-between">
                    <span>Student Views:</span>
                    <span className="font-mono font-semibold text-emerald-700">{doc.viewsCount} Views</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">
                {isStudent ? 'Download: Disabled' : 'DRM Protected'}
              </span>

              <button
                onClick={() => onOpenViewer(doc)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isStudent ? 'Open Secure Reader' : 'Test Protected View'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Publish New Protected Material</span>
              </h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  placeholder="e.g. Grade 10 Mathematics Term Exam Revision Notes"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Subject
                  </label>
                  <select
                    value={uploadData.subject}
                    onChange={(e) => setUploadData({ ...uploadData, subject: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Target Grade
                  </label>
                  <select
                    value={uploadData.grade}
                    onChange={(e) => setUploadData({ ...uploadData, grade: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                    <option value="Grade 10 & 11">Grade 10 & 11</option>
                    <option value="All Grades">All Grades</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Document Type
                  </label>
                  <select
                    value={uploadData.type}
                    onChange={(e) => setUploadData({ ...uploadData, type: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="CURRICULUM_NOTES">Curriculum Notes</option>
                    <option value="QUESTION_BANK">Question Bank / Mock Paper</option>
                    <option value="LAB_MANUAL">Lab Manual</option>
                    <option value="SYLLABUS">Syllabus Breakdown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    DRM Classification
                  </label>
                  <select
                    value={uploadData.classification}
                    onChange={(e) => setUploadData({ ...uploadData, classification: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="CONFIDENTIAL">Confidential (Watermarked + Anti-Capture)</option>
                    <option value="STRICT_INTERNAL">Strict Internal Faculty Only</option>
                    <option value="READ_ONLY_STUDENT">Read-Only Student Access</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-xs">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Automatic DRM Pipeline</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Document pages are converted into rasterized vector canvas chunks. Raw PDF binaries are never exposed directly to student web browsers.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
                >
                  Publish to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

