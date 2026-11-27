import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LeadPipelineView } from './components/LeadPipelineView';
import { CoursesView } from './components/CoursesView';
import { SecureDocumentViewer } from './components/SecureDocumentViewer';
import { 
  INITIAL_USERS, 
  MOCK_LEADS, 
  MOCK_COURSES, 
  MOCK_PROTECTED_DOCUMENTS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { 
  UserSession, 
  Lead, 
  Course, 
  CourseMaterial, 
  ProtectedDocument, 
  PaymentStatus, 
  SecurityAuditLog,
  TabType
} from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null); // Unauthenticated by default
  const [currentTab, setCurrentTab] = useState<TabType>('admissions');
  
  // App State: Strictly Admissions & Courses Safe
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [documents, setDocuments] = useState<ProtectedDocument[]>(MOCK_PROTECTED_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Active secure viewer modal
  const [activeProtectedDoc, setActiveProtectedDoc] = useState<ProtectedDocument | null>(null);

  const isStudent = currentUser?.role === 'STUDENT';

  // Handle successful login
  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    // Students only have access to Course Materials Safe
    setCurrentTab(user.role === 'STUDENT' ? 'courses' : 'admissions');
    logSecurityEvent({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: `${user.name} (${user.studentDetails?.rollNo || user.role})`,
      actorRole: user.role,
      action: 'STUDENT_LOGIN',
      ipAddress: user.studentDetails?.ipAddress?.split(' ')[0] || '127.0.0.1',
      status: 'LOGGED',
      details: `${user.role} logged in. Course safe access control active.`
    });
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveProtectedDoc(null);
    setCurrentTab('admissions');
  };

  // Handle switching users (e.g. from Admin to Student to verify safe lockdown & watermark behavior)
  const handleSwitchUser = (newUser: UserSession) => {
    setCurrentUser(newUser);
    if (newUser.role === 'STUDENT') {
      setCurrentTab('courses');
    }
    logSecurityEvent({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: newUser.name,
      actorRole: newUser.role,
      action: 'STUDENT_LOGIN',
      ipAddress: newUser.studentDetails?.ipAddress?.split(' ')[0] || '127.0.0.1',
      status: 'LOGGED',
      details: `Switched session to ${newUser.role} (${newUser.name}). Read-only rules applied.`
    });
  };

  // Log security event
  const logSecurityEvent = (eventData: Omit<SecurityAuditLog, 'id'>) => {
    const newLog: SecurityAuditLog = {
      ...eventData,
      id: `log-${Date.now()}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add new lead / admission
  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
  };

  // Update lead stage
  const handleUpdateLeadStatus = (leadId: string, nextStatus: Lead['status']) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, status: nextStatus, lastContacted: 'Today' };
      }
      return l;
    }));
  };

  // Update lead payment status (PAID / UNPAID) and paidDate
  const handleUpdateLeadPayment = (
    leadId: string, 
    paymentStatus: PaymentStatus, 
    paidDate?: string, 
    assignedCourseId?: string
  ) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          paymentStatus,
          paidDate: paymentStatus === 'PAID' ? (paidDate || new Date().toISOString().split('T')[0]) : undefined,
          assignedCourseId: assignedCourseId || l.assignedCourseId
        };
      }
      return l;
    }));

    logSecurityEvent({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: `${currentUser?.name || 'Admin'}`,
      actorRole: currentUser?.role || 'ADMIN',
      action: 'DOCUMENT_VIEWED',
      ipAddress: '10.0.1.5',
      status: 'LOGGED',
      details: `Updated admission payment status to ${paymentStatus} for candidate ID ${leadId}. 1-Month window ${paymentStatus === 'PAID' ? 'initiated' : 'revoked'}.`
    });
  };

  // Add new course (with initial encrypted PDF)
  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
  };

  // Delete course
  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    logSecurityEvent({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: currentUser?.name || 'Admin',
      actorRole: currentUser?.role || 'ADMIN',
      action: 'DOCUMENT_VIEWED',
      ipAddress: '10.0.1.5',
      status: 'LOGGED',
      details: `Course ${courseId} and associated materials deleted by Administrator.`
    });
  };

  // Add encrypted material to course
  const handleAddMaterialToCourse = (courseId: string, material: CourseMaterial, docPayload?: ProtectedDocument) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          materials: [...(c.materials || []), material]
        };
      }
      return c;
    }));

    if (docPayload) {
      setDocuments(prev => [docPayload, ...prev]);
    }
  };

  // Open secure viewer
  const handleOpenDoc = (doc: ProtectedDocument) => {
    if (!currentUser) return;
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, viewsCount: d.viewsCount + 1 } : d));
    setActiveProtectedDoc(doc);
    
    logSecurityEvent({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: `${currentUser.name} (${currentUser.studentDetails?.rollNo || currentUser.role})`,
      actorRole: currentUser.role,
      action: 'DOCUMENT_VIEWED',
      documentTitle: doc.title,
      ipAddress: currentUser.studentDetails?.ipAddress?.split(' ')[0] || '115.112.44.82',
      status: 'LOGGED',
      details: `Streaming encrypted document in read-only hardware canvas safe with forensic watermark.`
    });
  };

  // If user is not authenticated, render LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navigation Bar with Sriyam Logo, Live Switcher & Sign Out */}
      <Navbar
        currentUser={currentUser}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        activeLeadsCount={leads.length}
        coursesCount={courses.length}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex">
        
        {/* Navigation Sidebar (Only Admissions & Courses) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userRole={currentUser.role}
          activeLeadsCount={leads.length}
          coursesCount={courses.length}
        />

        {/* Dynamic Content Viewport: Strictly Admissions and Courses */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {currentTab === 'admissions' && !isStudent && (
            <LeadPipelineView
              leads={leads}
              courses={courses}
              onAddLead={handleAddLead}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onUpdateLeadPayment={handleUpdateLeadPayment}
            />
          )}

          {currentTab === 'courses' && (
            <CoursesView
              courses={courses}
              leads={leads}
              currentUser={currentUser}
              documents={documents}
              onOpenDocument={handleOpenDoc}
              onAddCourse={handleAddCourse}
              onDeleteCourse={handleDeleteCourse}
              onAddMaterialToCourse={handleAddMaterialToCourse}
              onLogSecurityEvent={logSecurityEvent}
            />
          )}
        </main>
      </div>

      {/* Full-Screen Anti-Leak Secure DRM Document Viewer Modal */}
      {activeProtectedDoc && currentUser && (
        <SecureDocumentViewer
          document={activeProtectedDoc}
          currentUser={currentUser}
          onClose={() => setActiveProtectedDoc(null)}
          onLogSecurityEvent={logSecurityEvent}
        />
      )}
    </div>
  );
}
export default App;
