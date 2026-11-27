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
  Info,
  CheckCircle2
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
    setEncryptionStatus('Locking file in safe with AES-256 encryption...');

    setTimeout(() => {
      setEncryptionStatus('File safely encrypted and protected against downloads');
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
      title: newCourseForm.pdfTitle || `${newCourseForm.title} Core Study Book`,
      fileName: newCourseForm.pdfFileName || `${newCourseForm.code}_Safe_Notes.pdf`,
      fileSize: newCourseForm.pdfFileSize,
      totalPages: newCourseForm.pdfTotalPages,
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      encryptionAlgorithm: 'AES-256-GCM',
      encryptionChecksum: `sha256-${Math.random().toString(36).substring(2)}`,
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
      fileSize: `${newMaterial.fileSize} (Safe Protected)`,
      pages: [
        {
          pageNumber: 1,
          header: `SRIYAM HIGH-SECURITY SAFE • ${newCourseForm.code}`,
          sections: [
            {
              title: `1. Course Book: ${newCourseForm.title}`,
              body: [
                newCourseForm.description || 'This course material is safely stored in Sriyam Digital Safe. Downloading or copying is strictly disabled.',
                'Enrolled students have active reading access for 1 month from their verified admission fee payment.'
              ],
              callout: 'PROTECTED CONTENT: Large print readable canvas mode enabled for comfortable reading.'
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
      fileName: materialForm.fileName || 'Course_Study_Material.pdf',
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
      fileSize: `${newMaterial.fileSize} (Safe Protected)`,
      pages: [
        {
          pageNumber: 1,
          header: `SRIYAM DIGITAL SAFE • ${selectedCourseForMaterial.code}`,
          sections: [
            {
              title: `1. ${newMaterial.title}`,
              body: [
                'Official course study notes and lecture handbook stored securely in the digital safe.',
                'Accessible for reading on-screen by students within their active 30-day payment period.'
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
    <div className="space-y-6">
      
      {/* Friendly Senior Explanatory Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-300 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-800 shrink-0">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Courses & Protected Study Safe
                </h1>
                <p className="text-sm text-slate-600 font-semibold mt-0.5">
                  Read syllabus books and lecture notes safely on screen. Downloads are restricted to Administrator only.
                </p>
              </div>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsAddCourseModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-black rounded-2xl shadow-lg transition border-2 border-emerald-800 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>+ Add Course (with Encrypted PDF)</span>
            </button>
          )}
        </div>

        {/* Clear Plain-English Safe Rule */}
        <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-sm text-emerald-950 font-medium leading-relaxed">
            <strong>Security Rule:</strong> All files here are locked with hardware encryption. Students can read them on screen comfortably for <strong>1 month</strong> after paying their admission fee. Nobody except the Admin can download the files, keeping your curriculum 100% safe.
          </div>
        </div>
      </div>

      {/* Access Status Banner for Student or Non-Admin */}
      {isStudent && (
        <div className={`p-6 rounded-3xl border-3 shadow-md transition-all ${
          studentAccess.isActive 
            ? 'bg-emerald-50 border-emerald-500 text-emerald-950' 
            : studentAccess.isExpired
            ? 'bg-rose-50 border-rose-500 text-rose-950'
            : 'bg-amber-50 border-amber-500 text-amber-950'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl shrink-0 ${
                studentAccess.isActive ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'
              }`}>
                {studentAccess.isActive ? <Unlock className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
              </div>
              <div>
                <h3 className="text-lg font-black leading-snug">
                  {studentAccess.isActive 
                    ? `✓ SAFE ACCESS IS OPEN: You have ${studentAccess.daysRemaining} days left to read courses`
                    : studentAccess.isExpired
                    ? '⏰ ACCESS EXPIRED: Your 1-Month Safe Period Has Ended'
                    : '🔒 SAFE LOCKED: Admission Fee Payment Required'
                  }
                </h3>
                <p className="text-sm font-semibold opacity-90 mt-1 leading-relaxed">
                  {studentAccess.isActive ? (
                    <span>
                      Fee was confirmed on <strong>{studentAccess.formattedPaidDate}</strong>. Your safe access is valid until <strong>{studentAccess.expiryDateString}</strong> (30-day window). Click any course below to open your books.
                    </span>
                  ) : studentAccess.isExpired ? (
                    <span>
                      Your 1-month reading period ended on <strong>{studentAccess.expiryDateString}</strong>. Please contact the administrative office to renew your access.
                    </span>
                  ) : (
                    <span>
                      Your admission status is currently UNPAID. Once the school administration marks you as PAID, you will automatically get 1 month of access.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border-2 border-slate-300 shrink-0 text-left md:text-right">
              <div className="text-xs text-slate-500 font-bold uppercase">Logged in as Student:</div>
              <div className="text-base font-black text-slate-900">{currentUser.name}</div>
              <div className="text-xs font-mono font-bold text-slate-600">Roll No: {currentUser.studentDetails?.rollNo || 'SRI-2026'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Mode Explainer Banner */}
      {isAdmin && (
        <div className="p-4 bg-slate-900 text-white rounded-2xl border-2 border-slate-700 flex items-center justify-between gap-3 text-sm font-bold">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Administrator Console Active:</strong> You can view all study materials, upload new encrypted PDFs, and download original decrypted PDFs.
            </span>
          </div>
          <span className="hidden sm:inline px-3 py-1 rounded-xl text-xs font-black bg-emerald-500 text-slate-950 uppercase shrink-0">
            ADMIN PRIVILEGE
          </span>
        </div>
      )}

      {/* Senior-Accessible Search and Filter Controls */}
      <div className="bg-white p-4 rounded-3xl border-2 border-slate-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search course title, subject code or teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            aria-label="Search courses"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm text-slate-700 font-bold">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-50 border-2 border-slate-300 text-slate-800 text-sm font-bold rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
            aria-label="Filter by department"
          >
            <option value="ALL">All Departments</option>
            <option value="Physical">Physical Sciences</option>
            <option value="Mathematical">Mathematical Sciences</option>
            <option value="Chemical">Chemical Sciences</option>
            <option value="Biological">Biological Sciences</option>
          </select>
        </div>
      </div>

      {/* Course List with Big, Clear Accordion Items */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border-2 border-slate-300 text-slate-500 text-base font-semibold">
            No courses found matching your search.
          </div>
        ) : (
          filteredCourses.map((course) => {
            const isExpanded = expandedCourseId === course.id;

            return (
              <div 
                key={course.id}
                className="bg-white rounded-3xl border-2 border-slate-300 shadow-sm overflow-hidden hover:border-slate-400 transition"
              >
                {/* Course Header Bar (Large Clickable Area) */}
                <div 
                  onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-slate-50 to-emerald-50/20"
                  role="button"
                  aria-expanded={isExpanded}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded-md bg-slate-900 text-white">
                        {course.code}
                      </span>
                      <span className="text-xs text-emerald-800 font-black uppercase tracking-wider">
                        {course.department} • {course.semester}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {course.price && (
                      <div className="text-sm font-black text-slate-900 bg-emerald-50 px-3.5 py-2 rounded-2xl border-2 border-emerald-300">
                        Fee: ₹{course.price.toLocaleString('en-IN')}
                      </div>
                    )}

                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCourseForMaterial(course);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-2 border-emerald-400 rounded-2xl text-xs font-black transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-emerald-800" />
                        <span>Upload PDF</span>
                      </button>
                    )}

                    <div className="p-2 rounded-xl bg-slate-200 text-slate-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Safe Materials Section */}
                {isExpanded && (
                  <div className="p-6 pt-3 border-t-2 border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between py-2 mb-3">
                      <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                        <Lock className="w-5 h-5 text-emerald-700" />
                        <span>Protected Course Books & Study PDFs ({course.materials?.length || 0})</span>
                      </div>
                      <span className="text-xs text-slate-600 font-bold">
                        {isAdmin ? 'Admin: Decrypted Download Enabled' : 'Reading Mode Only'}
                      </span>
                    </div>

                    {/* Material Cards */}
                    <div className="space-y-3">
                      {(!course.materials || course.materials.length === 0) ? (
                        <div className="p-8 bg-white rounded-2xl border-2 border-dashed border-slate-300 text-center text-sm font-semibold text-slate-500">
                          No PDF books attached to this course safe yet.
                        </div>
                      ) : (
                        course.materials.map((mat) => {
                          const canAccess = isAdmin || (isStudent && studentAccess.isActive) || isTeacher;

                          return (
                            <div
                              key={mat.id}
                              className="p-5 bg-white rounded-2xl border-2 border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-emerald-500 transition"
                            >
                              <div className="flex items-start gap-4">
                                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl border-2 border-emerald-300 shrink-0 mt-0.5">
                                  <FileText className="w-7 h-7" />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-base font-black text-slate-900">
                                      {mat.title}
                                    </h4>
                                    <span className="px-2 py-0.5 rounded text-xs font-black bg-slate-100 text-slate-800 border">
                                      {mat.encryptionAlgorithm} Safe
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-semibold">
                                    <span>File: <strong className="text-slate-900">{mat.fileName}</strong></span>
                                    <span>•</span>
                                    <span>Size: {mat.fileSize}</span>
                                    <span>•</span>
                                    <span>Pages: {mat.totalPages}</span>
                                    <span>•</span>
                                    <span>Date: {mat.uploadedAt}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Material Action Buttons (Big and Easy to Click) */}
                              <div className="flex flex-wrap items-center gap-3 shrink-0">
                                {canAccess ? (
                                  <button
                                    onClick={() => handleOpenMaterial(mat)}
                                    className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-black rounded-2xl shadow-md transition cursor-pointer border-2 border-emerald-800"
                                    title="Click to open and read this document safely on screen"
                                  >
                                    <Eye className="w-5 h-5" />
                                    <span>Read Book on Screen</span>
                                  </button>
                                ) : (
                                  <div className="inline-flex items-center gap-2 px-4 py-3 bg-slate-200 text-slate-700 text-xs font-extrabold rounded-2xl border-2 border-slate-300 cursor-not-allowed">
                                    <Lock className="w-4 h-4 text-slate-500" />
                                    <span>Safe Locked ({studentAccess.isExpired ? '1-Month Elapsed' : 'Unpaid'})</span>
                                  </div>
                                )}

                                {/* Admin Decrypted Download Button */}
                                {isAdmin && (
                                  <button
                                    onClick={(e) => handleAdminDownloadDecrypted(e, mat)}
                                    className="inline-flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-emerald-300 text-xs font-black rounded-2xl border-2 border-slate-700 transition cursor-pointer shadow-sm"
                                    title="Administrator Only: Decrypt and download file"
                                  >
                                    <Download className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-3 border-slate-300 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200 mb-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-emerald-700" />
                <span>Create Course & Upload Initial PDF</span>
              </h3>
              <button 
                onClick={() => setIsAddCourseModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl"
                aria-label="Close form"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseForm.title}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                    placeholder="e.g. Modern Physics & Gravitation"
                    className="w-full text-sm px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseForm.code}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                    placeholder="PHY-105"
                    className="w-full text-sm px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={newCourseForm.department}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, department: e.target.value })}
                    className="w-full text-sm font-bold px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Department of Physical Sciences">Physical Sciences</option>
                    <option value="Department of Mathematical Sciences">Mathematical Sciences</option>
                    <option value="Department of Chemical Sciences">Chemical Sciences</option>
                    <option value="Department of Biological Sciences">Biological Sciences</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Semester / Grade
                  </label>
                  <input
                    type="text"
                    value={newCourseForm.semester}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, semester: e.target.value })}
                    className="w-full text-sm px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Upload PDF Box */}
              <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-400 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-black text-emerald-950">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <span>Upload Course PDF File</span>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                    AES-256 Safe
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Choose PDF File from Computer
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handlePdfFileSelect(e, true)}
                      className="w-full text-sm file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      value={newCourseForm.pdfTitle}
                      onChange={(e) => setNewCourseForm({ ...newCourseForm, pdfTitle: e.target.value })}
                      placeholder="e.g. Unit 1 Complete Theory Book"
                      className="w-full text-sm px-4 py-2.5 border-2 border-emerald-400 rounded-xl bg-white font-bold"
                    />
                  </div>
                </div>

                {encryptionStatus && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-400 text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>{encryptionStatus}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-2xl transition border-2 border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-black bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-lg transition border-2 border-emerald-800 cursor-pointer"
                >
                  Save Course & Store in Safe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Material to Existing Course Modal */}
      {selectedCourseForMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-3 border-slate-300 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-6 h-6 text-emerald-700" />
                <span>Upload PDF to {selectedCourseForMaterial.code}</span>
              </h3>
              <button 
                onClick={() => setSelectedCourseForMaterial(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  placeholder="e.g. Model Question Paper & Revision Notes"
                  className="w-full text-sm px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Choose PDF to Encrypt & Store in Safe *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => handlePdfFileSelect(e, false)}
                  className="w-full text-sm file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
              </div>

              {encryptionStatus && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-400 text-xs font-bold text-emerald-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700 animate-spin" />
                  <span>{encryptionStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedCourseForMaterial(null)}
                  className="px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-2xl transition border-2 border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-black bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-lg transition border-2 border-emerald-800 cursor-pointer"
                >
                  Encrypt & Save in Safe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
