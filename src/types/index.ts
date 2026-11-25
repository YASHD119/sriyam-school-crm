export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface StudentProfile {
  rollNo: string;
  grade: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  attendancePercent: number;
  feeStatus: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  ipAddress: string;
  enrolledDate: string;
  emergencyContact: string;
  bloodGroup: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  studentDetails?: StudentProfile;
}

export interface Lead {
  id: string;
  studentName: string;
  guardianName: string;
  email: string;
  phone: string;
  gradeApplying: string;
  status: 'NEW_INQUIRY' | 'CAMPUS_TOUR' | 'TEST_SCHEDULED' | 'OFFER_MADE' | 'ENROLLED' | 'CLOSED';
  source: 'WEBSITE' | 'WALK_IN' | 'REFERRAL' | 'EDUCATION_FAIR';
  createdAt: string;
  lastContacted: string;
  notes: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  grade: string;
  section: string;
  guardianName: string;
  phone: string;
  email: string;
  attendance: number;
  gpa: string;
  feeStatus: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  avatar: string;
  active: boolean;
}

export interface DocumentPage {
  pageNumber: number;
  header: string;
  sections: {
    title: string;
    body: string[];
    callout?: string;
    formulaOrDiagram?: string[];
  }[];
}

export interface ProtectedDocument {
  id: string;
  title: string;
  subject: string;
  grade: string;
  uploadedBy: string;
  uploadedAt: string;
  type: 'CURRICULUM_NOTES' | 'QUESTION_BANK' | 'EXAM_PAPER' | 'LAB_MANUAL' | 'SYLLABUS';
  classification: 'CONFIDENTIAL' | 'STRICT_INTERNAL' | 'READ_ONLY_STUDENT';
  totalPages: number;
  viewsCount: number;
  fileSize: string;
  pages: DocumentPage[];
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  grade: string;
  term: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  receiptNo?: string;
  paidOn?: string;
  paymentMethod?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'EXAM' | 'CIRCULAR' | 'EVENT' | 'HOLIDAY';
  targetAudience: 'ALL' | 'STUDENTS' | 'PARENTS' | 'STAFF';
  publishedDate: string;
  publishedBy: string;
  content: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: 'DOCUMENT_VIEWED' | 'SCREEN_CAPTURE_BLOCKED' | 'PRINT_ATTEMPT_BLOCKED' | 'COPY_ATTEMPT_BLOCKED' | 'STUDENT_LOGIN' | 'TAB_SWITCH_BLUR';
  documentTitle?: string;
  ipAddress: string;
  status: 'BLOCKED' | 'LOGGED' | 'FLAGGED';
  details: string;
}

// --- LMS Alignment Types (matching admin-lms.edulateral.com) ---

export interface Course {
  id: string;
  title: string;
  code: string;
  department: string;
  semester: string;
  instructor: string;
  enrolledCount: number;
  modulesCount: number;
  status: 'ACTIVE' | 'UPCOMING' | 'ARCHIVED';
  description: string;
}

export interface Question {
  id: string;
  subject: string;
  department: string;
  type: 'MCQ' | 'ESSAY' | 'CODING';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  text: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  totalMarks: number;
  submissionsCount: number;
  totalStudents: number;
  status: 'ACTIVE' | 'EVALUATED' | 'CLOSED';
  description: string;
}

export interface LiveClass {
  id: string;
  title: string;
  course: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  meetUrl: string;
  status: 'LIVE' | 'SCHEDULED' | 'COMPLETED';
}

export interface AttendanceSession {
  id: string;
  date: string;
  course: string;
  section: string;
  faculty: string;
  presentCount: number;
  totalCount: number;
  status: 'SUBMITTED' | 'PENDING';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'EXAM' | 'LECTURE' | 'DEADLINE' | 'HOLIDAY';
  timing: string;
  tag: string;
}
