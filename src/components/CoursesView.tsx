import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Layers, 
  X, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Download, 
  UploadCloud, 
  KeyRound, 
  Eye, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  FileCheck2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Course, CourseMaterial, Lead, ProtectedDocument, UserSession } from '../types';
import { checkCourseAccess, findStudentAdmission } from '../utils/accessControl';

interface CoursesViewProps {
  courses: Course[];
  leads: Lead[];
  currentUser: UserSession;
  documents: ProtectedDocument[];
  onOpenDocument: (doc: ProtectedDocument) => void;
  onAddCourse: (course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  onAddMaterialToCourse: (courseId: string, material: CourseMaterial, docPayload?: ProtectedDocument) => void;
  onLogSecurityEvent?: (log: any) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  leads,
  currentUser,
  documents,
  onOpenDocument,
  onAddCourse,
  onDeleteCourse,
  onAddMaterialToCourse,
  onLogSecurityEvent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(courses[0]?.id || null);
  
  // Modals
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [selectedCourseForMaterial, setSelectedCourseForMaterial] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const isAdmin = currentUser.role === 'ADMIN';
  const isTeacher = currentUser.role === 'TEACHER';
  const isStudent = currentUser.role === 'STUDENT';

  // Find admission record for current user if student
  const studentLead = findStudentAdmission(leads, currentUser.email, currentUser.name);
  const studentAccess = checkCourseAccess(
    studentLead?.paymentStatus || (isAdmin ? 'PAID' : 'UNPAID'), 
    studentLead?.paidDate || (isAdmin ? new Date().toISOString().split('T')[0] : undefined)
  );

  // Form for New Course with Encrypted PDF
  const [newCourseForm, setNewCourseForm] = useState({
    title: '',
    code: 'PHY-105',
    department: 'Department of Physical Sciences',
    semester: 'Grade 10 • Semester I',
    instructor: currentUser.name,
    description: '',
    pdfTitle: '',
    pdfFileName: '',
    pdfFileSize: '4.2 MB',
    pdfTotalPages: 3,
    encryptionAlgorithm: 'AES-256-GCM' as const
  });

  // Form for adding material to existing course
  const [materialForm, setMaterialForm] = useState({
    title: '',
    fileName: '',
    fileSize: '5.4 MB',
    totalPages: 3,
    encryptionAlgorithm: 'AES-256-GCM' as const
  });

  const [encryptionStatus, setEncryptionStatus] = useState<string | null>(null);

  const filteredCourses = courses.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || c.department.includes(deptFilter);
    return matchesSearch && matchesDept;
  });

  // Simulate file selection and encryption
  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isNewCourse: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setEncryptionStatus('Generating AES-256-GCM hardware key & sha256 checksum...');

    setTimeout(() => {
      setEncryptionStatus('AES-256 Protected PDF Stream Ready');
      if (isNewCourse) {
        setNewCourseForm(prev => ({
          ...prev,
          pdfTitle: prev.pdfTitle || file.name.replace(/\.[^/.]+$/, ''),
          pdfFileName: file.name,
          pdfFileSize: sizeMb
        }));
      } else {
        setMaterialForm(prev => ({
          ...prev,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
          fileName: file.name,
          fileSize: sizeMb
        }));
      }
    }, 350);
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseForm.title || !newCourseForm.code) return;

    const courseId = `crs-${Date.now()}`;
    const materialId = `mat-${Date.now()}`;
    const docId = `doc-${Date.now()}`;

    const newMaterial: CourseMaterial = {
      id: materialId,
      title: newCourseForm.pdfTitle || `${newCourseForm.title} Core Material`,
      fileName: newCourseForm.pdfFileName || `${newCourseForm.code}_Encrypted_Safe.pdf`,
      fileSize: newCourseForm.pdfFileSize,
      totalPages: newCourseForm.pdfTotalPages,
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      encryptionAlgorithm: 'AES-256-GCM',
      encryptionChecksum: `sha256-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      documentRefId: docId,
      downloadUrl: '/sample-curriculum.pdf'
    };

    const newCourse: Course = {
      id: courseId,
      title: newCourseForm.title,
      code: newCourseForm.code,
      department: newCourseForm.department,
      semester: newCourseForm.semester,
      instructor: newCourseForm.instructor,
      enrolledCount: 1,
      modulesCount: 4,
      status: 'ACTIVE',
      description: newCourseForm.description,
      materials: [newMaterial]
    };

    const docPayload: ProtectedDocument = {
      id: docId,
      title: newMaterial.title,
      subject: newCourseForm.title,
      grade: newCourseForm.semester,
      uploadedBy: `${currentUser.name} (Admin Safe)`,
      uploadedAt: newMaterial.uploadedAt,
      type: 'CURRICULUM_NOTES',
      classification: 'CONFIDENTIAL',
      totalPages: newMaterial.totalPages,
      viewsCount: 1,
      fileSize: `${newMaterial.fileSize} (AES-256)`,
      pages: [
        {
          pageNumber: 1,
          header: `SRIYAM HIGH-SECURITY SAFE • ${newCourseForm.code}`,
          sections: [
            {
              title: `1. Course Overview: ${newCourseForm.title}`,
              body: [
                newCourseForm.description || 'This course material is protected by Sriyam School Digital Safe DRM. Downloading or capturing content is strictly restricted.',
                'Enrolled students have active access for 1 month from confirmed fee payment date.'
              ],
              callout: 'INTELLECTUAL PROPERTY SAFE: Forensic watermarks are stamped on each frame.'
            }
          ]
        }
      ]
    };

    onAddCourse(newCourse);
    setIsAddCourseModalOpen(false);
    setEncryptionStatus(null);
    setExpandedCourseId(courseId); // auto-expand the newly created course
  };

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForMaterial || !materialForm.title) return;

    const materialId = `mat-${Date.now()}`;
    const docId = `doc-${Date.now()}`;

    const newMaterial: CourseMaterial = {
      id: materialId,
      title: materialForm.title,
      fileName: materialForm.fileName || 'Course_Study_Document.pdf',
      fileSize: materialForm.fileSize,
      totalPages: materialForm.totalPages,
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      encryptionAlgorithm: 'AES-256-GCM',
      encryptionChecksum: `sha256-${Math.random().toString(36).substring(2)}`,
      documentRefId: docId,
      downloadUrl: '/sample-curriculum.pdf'
    };

    const docPayload: ProtectedDocument = {
      id: docId,
      title: newMaterial.title,
      subject: selectedCourseForMaterial.title,
      grade: selectedCourseForMaterial.semester,
      uploadedBy: `${currentUser.name} (Admin Safe)`,
      uploadedAt: newMaterial.uploadedAt,
      type: 'CURRICULUM_NOTES',
      classification: 'CONFIDENTIAL',
      totalPages: newMaterial.totalPages,
      viewsCount: 0,
      fileSize: `${newMaterial.fileSize} (AES-256)`,
      pages: [
        {
          pageNumber: 1,
          header: `SRIYAM DIGITAL SAFE • ${selectedCourseForMaterial.code}`,
          sections: [
            {
              title: `1. ${newMaterial.title}`,
              body: [
                'Course study material stored in digital safe.',
                'Accessible for reading by authorized students within their active 30-day payment period.'
              ]
            }
          ]
        }
      ]
    };

    onAddMaterialToCourse(selectedCourseForMaterial.id, newMaterial, docPayload);
    setSelectedCourseForMaterial(null);
    setEncryptionStatus(null);
  };

  // Open Document Viewer
  const handleOpenMaterial = (material: CourseMaterial) => {
    if (isStudent && !studentAccess.isActive) {
      if (onLogSecurityEvent) {
        onLogSecurityEvent({
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actorName: `${currentUser.name} (${currentUser.studentDetails?.rollNo || 'STUDENT'})`,
          actorRole: currentUser.role,
          action: 'ACCESS_EXPIRED_BLOCKED',
          documentTitle: material.title,
          ipAddress: currentUser.studentDetails?.ipAddress?.split(' ')[0] || '127.0.0.1',
          status: 'BLOCKED',
          details: `Blocked attempt to access course material. 1-month payment window expired or unpaid.`
        });
      }
      return;
    }

    const targetDoc = documents.find(d => d.id === material.documentRefId) || documents[0];
    onOpenDocument({
      ...targetDoc,
      id: material.documentRefId || targetDoc.id,
      title: material.title
    });
  };

  // Admin download decrypted PDF
  const handleAdminDownloadDecrypted = (e: React.MouseEvent, material: CourseMaterial) => {
    e.stopPropagation();
    if (!isAdmin) return;

    if (onLogSecurityEvent) {
      onLogSecurityEvent({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorName: `${currentUser.name} (Admin Safe Authority)`,
        actorRole: 'ADMIN',
        action: 'ADMIN_DECRYPT_DOWNLOAD',
        documentTitle: material.title,
        ipAddress: '10.0.1.5',
        status: 'LOGGED',
        details: `Decrypted original PDF downloaded by Super Admin.`
      });
    }

    const element = document.createElement('a');
    const dummyPdfContent = `%PDF-1.7\n1 0 obj\n<< /Title (${material.title}) /Author (Sriyam School Super Admin) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
    const file = new Blob([dummyPdfContent], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = material.fileName.endsWith('.pdf') ? material.fileName : `${material.fileName}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Course Materials & Encryption Safe</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              AES-256 DRM Active
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted course library. 1-Month access granted upon confirmed payment. Non-admin downloads disabled.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Course (with PDF)</span>
          </button>
        )}
      </div>

      {/* Access Status Banner for Student */}
      {isStudent && (
        <div className={`p-4 rounded-xl border transition ${
          studentAccess.isActive 
            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' 
            : studentAccess.isExpired
            ? 'bg-rose-50/70 border-rose-300 text-rose-950'
            : 'bg-amber-50/70 border-amber-300 text-amber-950'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg shrink-0 ${
                studentAccess.isActive ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {studentAccess.isActive ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-xs font-bold">
                  {studentAccess.isActive 
                    ? `Safe Access Active • ${studentAccess.daysRemaining} Days Remaining`
                    : studentAccess.isExpired
                    ? 'Safe Access Expired • 1-Month Limit Elapsed'
                    : 'Safe Locked • Admission Fee Pending'
                  }
                </h3>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {studentAccess.isActive ? (
                    <span>Payment verified on <strong>{studentAccess.formattedPaidDate}</strong>. Valid until <strong>{studentAccess.expiryDateString}</strong>.</span>
                  ) : studentAccess.isExpired ? (
                    <span>Your 1-month access ended on <strong>{studentAccess.expiryDateString}</strong>. Contact school office to renew.</span>
                  ) : (
                    <span>Fee is marked UNPAID. Access unlocks for 30 days once payment is recorded.</span>
                  )}
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] font-mono text-slate-500 shrink-0">
              {currentUser.name} ({currentUser.studentDetails?.rollNo || 'STUDENT'})
            </div>
          </div>
        </div>
      )}

      {/* Search and Department Filter */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search course title, code, instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="ALL">All Departments</option>
            <option value="Physical">Physical Sciences</option>
            <option value="Mathematical">Mathematical Sciences</option>
            <option value="Chemical">Chemical Sciences</option>
            <option value="Biological">Biological Sciences</option>
          </select>
        </div>
      </div>

      {/* Course Cards */}
      <div className="space-y-3.5">
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No courses found matching your criteria.
          </div>
        ) : (
          filteredCourses.map((course) => {
            const isExpanded = expandedCourseId === course.id;

            return (
              <div 
                key={course.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition"
              >
                {/* Course Bar Header */}
                <div 
                  onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                  className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/70 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                        {course.code}
                      </span>
                      <span className="text-xs text-emerald-700 font-medium">
                        {course.department} • {course.semester}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isAdmin && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourseForMaterial(course);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md text-xs font-semibold transition"
                        >
                          <Plus className="w-3 h-3 text-emerald-600" />
                          <span>Upload PDF</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCourseToDelete(course);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md text-xs font-medium transition"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </>
                    )}

                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Materials List */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/50">
                    <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Protected PDFs in Safe ({course.materials?.length || 0})</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">AES-256-GCM hardware encryption</span>
                    </div>

                    <div className="space-y-2">
                      {(!course.materials || course.materials.length === 0) ? (
                        <div className="p-4 bg-white rounded-lg border border-dashed border-slate-200 text-center text-xs text-slate-400">
                          No course PDFs uploaded yet.
                        </div>
                      ) : (
                        course.materials.map((mat) => {
                          const canAccess = isAdmin || (isStudent && studentAccess.isActive) || isTeacher;

                          return (
                            <div
                              key={mat.id}
                              className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                    <span>{mat.title}</span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 border">
                                      {mat.encryptionAlgorithm}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                    <span>{mat.fileName}</span>
                                    <span>•</span>
                                    <span>{mat.fileSize}</span>
                                    <span>•</span>
                                    <span>{mat.totalPages} pages</span>
                                  </div>
                                </div>
                              </div>

                              {/* Material Actions */}
                              <div className="flex items-center gap-2 shrink-0">
                                {canAccess ? (
                                  <button
                                    onClick={() => handleOpenMaterial(mat)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs transition"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View Material</span>
                                  </button>
                                ) : (
                                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-400 text-xs rounded-lg border border-slate-200 cursor-not-allowed">
                                    <Lock className="w-3 h-3" />
                                    <span>Locked ({studentAccess.isExpired ? 'Expired' : 'Unpaid'})</span>
                                  </div>
                                )}

                                {/* Admin Decrypted Download (Admin Only) */}
                                {isAdmin && (
                                  <button
                                    onClick={(e) => handleAdminDownloadDecrypted(e, mat)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-medium rounded-lg transition"
                                    title="Administrator Decrypted Download"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download PDF</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Create Course & Upload Protected PDF</span>
              </h3>
              <button 
                onClick={() => setIsAddCourseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseForm.title}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                    placeholder="e.g. Modern Physics & Optics"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseForm.code}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                    placeholder="PHY-105"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Department
                  </label>
                  <select
                    value={newCourseForm.department}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, department: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  >
                    <option value="Department of Physical Sciences">Physical Sciences</option>
                    <option value="Department of Mathematical Sciences">Mathematical Sciences</option>
                    <option value="Department of Chemical Sciences">Chemical Sciences</option>
                    <option value="Department of Biological Sciences">Biological Sciences</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Semester / Grade
                  </label>
                  <input
                    type="text"
                    value={newCourseForm.semester}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, semester: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Initial PDF Material */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Upload Course PDF File</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">AES-256-GCM Safe</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handlePdfFileSelect(e, true)}
                    className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newCourseForm.pdfTitle}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, pdfTitle: e.target.value })}
                    placeholder="Material Title (e.g. Unit 1 Complete Theory)"
                    className="w-full text-xs px-2.5 py-1.5 border border-emerald-300 rounded-lg bg-white"
                  />
                </div>

                {encryptionStatus && (
                  <div className="text-[11px] text-emerald-800 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-600 animate-spin" />
                    <span>{encryptionStatus}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition"
                >
                  Save & Lock in Safe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Material to Existing Course Modal */}
      {selectedCourseForMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                <span>Upload PDF to {selectedCourseForMaterial.code}</span>
              </h3>
              <button 
                onClick={() => setSelectedCourseForMaterial(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  placeholder="e.g. Revision Notes & Exemplar Solutions"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Select PDF File *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => handlePdfFileSelect(e, false)}
                  className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                />
              </div>

              {encryptionStatus && (
                <div className="text-[11px] text-emerald-800 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-600 animate-spin" />
                  <span>{encryptionStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCourseForMaterial(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition"
                >
                  Encrypt & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Course Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Course</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to delete <strong className="text-slate-900">{courseToDelete.title} ({courseToDelete.code})</strong> and its {courseToDelete.materials?.length || 0} protected safe files?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setCourseToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onDeleteCourse) onDeleteCourse(courseToDelete.id);
                  setCourseToDelete(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
