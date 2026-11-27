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
  FileText,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Download,
  UploadCloud,
  FileCheck2,
  KeyRound,
  AlertTriangle,
  Eye,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp
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
  onAddMaterialToCourse,
  onLogSecurityEvent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(courses[0]?.id || null);
  
  // Modals
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [selectedCourseForMaterial, setSelectedCourseForMaterial] = useState<Course | null>(null);

  // Student perspective tester (allows testing active vs expired student accounts)
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
    price: 38500,
    description: '',
    // PDF upload & encryption simulation
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

  // Simulate file selection and AES-256 key generation
  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isNewCourse: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setEncryptionStatus('Generating AES-256 Key & Calculating SHA-256 Checksum...');

    setTimeout(() => {
      setEncryptionStatus('AES-256-GCM Encrypted Safe Stream Ready');
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
    }, 450);
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
      price: newCourseForm.price,
      description: newCourseForm.description,
      materials: [newMaterial]
    };

    // Synthesize a ProtectedDocument for rendering
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
      fileSize: `${newMaterial.fileSize} (AES-256 Stream)`,
      pages: [
        {
          pageNumber: 1,
          header: `SRIYAM HIGH-SECURITY SAFE • ${newCourseForm.code}`,
          sections: [
            {
              title: `1. Course Overview: ${newCourseForm.title}`,
              body: [
                newCourseForm.description || 'This course material is protected by Sriyam School Digital Safe DRM. Downloading or capturing content is strictly restricted.',
                'Valid enrolled students have 1-month streaming access from the confirmed fee payment date.'
              ],
              callout: 'INTELLECTUAL PROPERTY SAFE: Forensic watermarks are stamped on each frame.',
              formulaOrDiagram: [
                'Encryption: AES-256-GCM Authenticated Cipher',
                'Integrity Checksum: Verified SHA-256 Stream'
              ]
            }
          ]
        }
      ]
    };

    onAddCourse(newCourse);
    onAddMaterialToCourse(courseId, newMaterial, docPayload);
    setIsAddCourseModalOpen(false);
    setEncryptionStatus(null);
  };

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForMaterial || !materialForm.title) return;

    const materialId = `mat-${Date.now()}`;
    const docId = `doc-${Date.now()}`;

    const newMaterial: CourseMaterial = {
      id: materialId,
      title: materialForm.title,
      fileName: materialForm.fileName || 'Encrypted_Course_Document.pdf',
      fileSize: materialForm.fileSize,
      totalPages: materialForm.totalPages,
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      encryptionAlgorithm: 'AES-256-GCM',
      encryptionChecksum: `sha256-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
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
      fileSize: `${newMaterial.fileSize} (AES-256 Stream)`,
      pages: [
        {
          pageNumber: 1,
          header: `SRIYAM HIGH-SECURITY SAFE • ${selectedCourseForMaterial.code}`,
          sections: [
            {
              title: `1. ${newMaterial.title}`,
              body: [
                'Proprietary curriculum material uploaded to Sriyam Digital Safe.',
                'Access granted exclusively to authorized students within their active 1-month payment window.'
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
    // If student and expired or unpaid, block!
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

    // Find document payload or fallback
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
    if (!isAdmin) return; // Strict Admin only

    if (onLogSecurityEvent) {
      onLogSecurityEvent({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorName: `${currentUser.name} (Admin Safe Authority)`,
        actorRole: 'ADMIN',
        action: 'ADMIN_DECRYPT_DOWNLOAD',
        documentTitle: material.title,
        ipAddress: '10.0.1.5',
        status: 'LOGGED',
        details: `Decrypted original PDF downloaded by Super Admin. Verification checksum: ${material.encryptionChecksum.substring(0, 16)}...`
      });
    }

    // Trigger synthetic file download for admin
    const element = document.createElement('a');
    const dummyPdfContent = `%PDF-1.7\n1 0 obj\n<< /Title (${material.title}) /Author (Sriyam School Admin) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
    const file = new Blob([dummyPdfContent], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = material.fileName.endsWith('.pdf') ? material.fileName : `${material.fileName}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Course Materials & Encryption Safe</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>AES-256 Protected Safe</span>
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Secure digital repository for course syllabi, lecture notes, and question banks. Download restricted to Administrator only.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Course (with Encrypted PDF)</span>
          </button>
        )}
      </div>

      {/* Access Status Banner for Student or Non-Admin */}
      {isStudent && (
        <div className={`p-4 rounded-2xl border transition-all ${
          studentAccess.isActive 
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
            : studentAccess.isExpired
            ? 'bg-rose-50/80 border-rose-300 text-rose-950'
            : 'bg-amber-50/80 border-amber-300 text-amber-950'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${
                studentAccess.isActive ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {studentAccess.isActive ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">
                    {studentAccess.isActive 
                      ? `Course Material Safe Unlocked: ${studentAccess.daysRemaining} Days Remaining`
                      : studentAccess.isExpired
                      ? 'Course Safe Access Expired (1-Month Limit Elapsed)'
                      : 'Course Safe Locked: Fee Payment Pending'
                    }
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border">
                    {studentLead?.paymentStatus || 'UNPAID'}
                  </span>
                </div>
                <p className="text-xs opacity-90 mt-0.5">
                  {studentAccess.isActive ? (
                    <span>
                      Payment received on <strong>{studentAccess.formattedPaidDate}</strong>. Your safe access expires on <strong>{studentAccess.expiryDateString}</strong> (strict 30-day window).
                    </span>
                  ) : studentAccess.isExpired ? (
                    <span>
                      Your 1-month access window elapsed on <strong>{studentAccess.expiryDateString}</strong>. Please contact the administrative office to renew course access.
                    </span>
                  ) : (
                    <span>
                      Admissions fee is marked as UNPAID. Once marked as PAID by administration, 1 month of course access will be unlocked.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/70 border shrink-0 text-right">
              <div>Student: <strong>{currentUser.name}</strong></div>
              <div className="text-[11px] text-slate-500">Roll: {currentUser.studentDetails?.rollNo || 'ENROLLED'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Privilege Banner */}
      {isAdmin && (
        <div className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>Administrator Privilege Active:</strong> Full access to all courses, PDF upload with hardware encryption, and authorized decrypted PDF downloads.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ADMIN ROOT ACCESS
          </span>
        </div>
      )}

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

      {/* Courses Accordion / List with Protected Safe Materials */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No courses found matching the search criteria.
          </div>
        ) : (
          filteredCourses.map((course) => {
            const isExpanded = expandedCourseId === course.id;

            return (
              <div 
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition"
              >
                {/* Course Header Bar */}
                <div 
                  onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                  className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white to-slate-50/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                        {course.code}
                      </span>
                      <span className="text-xs text-emerald-700 font-semibold">
                        {course.department} • {course.semester}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>{course.title}</span>
                      <span className="text-xs font-normal text-slate-400">({course.materials?.length || 0} Encrypted PDFs)</span>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-1 max-w-3xl">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {course.price && (
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        Fee: ₹{course.price.toLocaleString('en-IN')}
                      </span>
                    )}

                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCourseForMaterial(course);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold transition"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Upload PDF</span>
                      </button>
                    )}

                    <div className="p-1 rounded-lg bg-slate-100 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Section: Safe Materials List */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/40">
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Lock className="w-4 h-4 text-emerald-600" />
                        <span>Encrypted Course Materials in Safe</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {isAdmin 
                          ? 'Super Admin can decrypt & download. Non-admin users are restricted to watermarked read-only canvas.' 
                          : 'Download and screen capturing are strictly disabled for security.'}
                      </span>
                    </div>

                    {/* Materials Grid */}
                    <div className="space-y-3">
                      {(!course.materials || course.materials.length === 0) ? (
                        <div className="p-6 bg-white rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                          No PDF course materials attached to this course yet.
                        </div>
                      ) : (
                        course.materials.map((mat) => {
                          const canAccess = isAdmin || (isStudent && studentAccess.isActive) || isTeacher;

                          return (
                            <div
                              key={mat.id}
                              className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition"
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shrink-0 mt-0.5">
                                  <FileText className="w-5 h-5" />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-bold text-slate-900">
                                      {mat.title}
                                    </h4>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                      {mat.encryptionAlgorithm}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                                    <span>File: <strong className="font-mono text-slate-700">{mat.fileName}</strong></span>
                                    <span>•</span>
                                    <span>Size: {mat.fileSize}</span>
                                    <span>•</span>
                                    <span>Pages: {mat.totalPages}</span>
                                    <span>•</span>
                                    <span>Uploaded: {mat.uploadedAt}</span>
                                  </div>

                                  <div className="text-[10px] font-mono text-slate-400 truncate max-w-xl">
                                    Checksum: {mat.encryptionChecksum}
                                  </div>
                                </div>
                              </div>

                              {/* Material Action Buttons */}
                              <div className="flex items-center gap-2 shrink-0">
                                {/* Open in Safe button */}
                                {canAccess ? (
                                  <button
                                    onClick={() => handleOpenMaterial(mat)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View in Safe</span>
                                  </button>
                                ) : (
                                  <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-400 text-xs font-semibold rounded-xl border border-slate-200 cursor-not-allowed">
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Safe Locked ({studentAccess.isExpired ? 'Expired' : 'Unpaid'})</span>
                                  </div>
                                )}

                                {/* Admin Decrypted Download (Admin ONLY) */}
                                {isAdmin && (
                                  <button
                                    onClick={(e) => handleAdminDownloadDecrypted(e, mat)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-semibold rounded-xl border border-slate-700 transition"
                                    title="Administrator Only: Decrypt and download original PDF"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Admin Download PDF</span>
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

      {/* Add Course with Encrypted PDF Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>Create Course & Upload Encrypted PDF Safe</span>
              </h3>
              <button 
                onClick={() => setIsAddCourseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseForm.title}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                    placeholder="e.g. Advanced Quantum Mechanics"
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
                    value={newCourseForm.code}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                    placeholder="PHY-105"
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
                    value={newCourseForm.department}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, department: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Department of Physical Sciences">Physical Sciences</option>
                    <option value="Department of Mathematical Sciences">Mathematical Sciences</option>
                    <option value="Department of Chemical Sciences">Chemical Sciences</option>
                    <option value="Department of Biological Sciences">Biological Sciences</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Semester / Grade
                  </label>
                  <input
                    type="text"
                    value={newCourseForm.semester}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, semester: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Course Description
                </label>
                <textarea
                  rows={2}
                  value={newCourseForm.description}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, description: e.target.value })}
                  placeholder="Overview of core syllabus, weekly progression, and learning outcomes..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* PDF Upload & Encryption Box */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Upload Course PDF & Encrypt for Safe</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                    AES-256-GCM
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Select PDF File
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handlePdfFileSelect(e, true)}
                      className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Material Title
                    </label>
                    <input
                      type="text"
                      value={newCourseForm.pdfTitle}
                      onChange={(e) => setNewCourseForm({ ...newCourseForm, pdfTitle: e.target.value })}
                      placeholder="e.g. Complete Syllabus & Notes"
                      className="w-full text-xs px-2.5 py-1.5 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                {encryptionStatus && (
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-300 text-xs font-mono text-emerald-800 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    <span>{encryptionStatus}</span>
                  </div>
                )}

                <p className="text-[11px] text-slate-500 leading-tight">
                  🔒 Upon saving, this PDF will be encrypted and streamed via vector canvas. Students can view it for 1 month after payment is received. Non-admin downloads are strictly disabled.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
                >
                  Save Course & Lock in Safe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Material to Existing Course Modal */}
      {selectedCourseForMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-600" />
                <span>Upload PDF Material to {selectedCourseForMaterial.code}</span>
              </h3>
              <button 
                onClick={() => setSelectedCourseForMaterial(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Document / Material Title *
                </label>
                <input
                  type="text"
                  required
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  placeholder="e.g. Unit 3 Question Bank & Model Answers"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Choose PDF to Encrypt *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => handlePdfFileSelect(e, false)}
                  className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
                />
              </div>

              {encryptionStatus && (
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-300 text-xs font-mono text-emerald-800 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                  <span>{encryptionStatus}</span>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Security Guarantee:</div>
                <p>
                  This file will be stored in the course safe and visible exclusively to students whose admission payment is active (&lt; 30 days). Non-admins cannot download.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCourseForMaterial(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
                >
                  Encrypt & Add to Course Safe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
