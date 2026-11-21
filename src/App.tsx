import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { LeadPipelineView } from './components/LeadPipelineView';
import { StudentDirectoryView } from './components/StudentDirectoryView';
import { DocumentVaultView } from './components/DocumentVaultView';
import { FeeManagementView } from './components/FeeManagementView';
import { NoticesView } from './components/NoticesView';
import { AuditLogView } from './components/AuditLogView';
import { ScheduleView } from './components/ScheduleView';
import { StudentPortalDashboard } from './components/StudentPortalDashboard';
import { AdminDashboardOverview } from './components/AdminDashboardOverview';
import { SecureDocumentViewer } from './components/SecureDocumentViewer';
import { 
  INITIAL_USERS, 
  MOCK_LEADS, 
  MOCK_STUDENTS, 
  MOCK_PROTECTED_DOCUMENTS, 
  MOCK_FEES, 
  MOCK_NOTICES, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { UserSession, Lead, StudentRecord, ProtectedDocument, FeeInvoice, Notice, SecurityAuditLog } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null); // Unauthenticated by default
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  
  // App State
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [students, setStudents] = useState<StudentRecord[]>(MOCK_STUDENTS);
  const [documents, setDocuments] = useState<ProtectedDocument[]>(MOCK_PROTECTED_DOCUMENTS);
  const [fees, setFees] = useState<FeeInvoice[]>(MOCK_FEES);
  const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Active secure viewer modal
  const [activeProtectedDoc, setActiveProtectedDoc] = useState<ProtectedDocument | null>(null);

  const isStudent = currentUser?.role === 'STUDENT';

  // Handle successful login
  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    setCurrentTab('overview');
    logSecurityEvent({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: `${user.name} (${user.studentDetails?.rollNo || user.role})`,
      actorRole: user.role,
      action: 'STUDENT_LOGIN',
      ipAddress: user.studentDetails?.ipAddress?.split(' ')[0] || '127.0.0.1',
      status: 'LOGGED',
      details: `${user.role} logged in via authentication page. Session started.`
    });
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveProtectedDoc(null);
    setCurrentTab('overview');
  };

  // Handle switching users (e.g. from Admin to Student to verify read-only behavior)
  const handleSwitchUser = (newUser: UserSession) => {
    setCurrentUser(newUser);
    setCurrentTab('overview');
    logSecurityEvent({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: newUser.name,
      actorRole: newUser.role,
      action: 'STUDENT_LOGIN',
      ipAddress: newUser.studentDetails?.ipAddress?.split(' ')[0] || '127.0.0.1',
      status: 'LOGGED',
      details: `${newUser.role} session switched. Read-only permissions enforced.`
    });
  };

  // Add new lead
  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
  };

  // Delete lead / client
  const handleDeleteLead = (leadId: string) => {
    const targetLead = leads.find(l => l.id === leadId);
    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (targetLead) {
      logSecurityEvent({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actorName: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Administrator',
        actorRole: currentUser ? currentUser.role : 'ADMIN',
        action: 'DOCUMENT_VIEWED',
        ipAddress: '127.0.0.1',
        status: 'LOGGED',
        details: `Client / admission inquiry record for "${targetLead.studentName}" deleted from pipeline.`
      });
    }
  };

  // Update lead status
  const handleUpdateLeadStatus = (leadId: string, nextStatus: Lead['status']) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        // If converting to enrolled, also create a student record!
        if (nextStatus === 'ENROLLED' && l.status !== 'ENROLLED') {
          const newStudent: StudentRecord = {
            id: `stu-${Date.now()}`,
            rollNo: `SRI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            name: l.studentName,
            grade: l.gradeApplying.split(' ')[0] + ' ' + l.gradeApplying.split(' ')[1],
            section: 'A',
            guardianName: l.guardianName,
            phone: l.phone,
            email: l.email,
            attendance: 100,
            gpa: '10.0 / 10',
            feeStatus: 'PENDING',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
            active: true
          };
          setStudents(s => [newStudent, ...s]);
        }
        return { ...l, status: nextStatus, lastContacted: 'Today' };
      }
      return l;
    }));
  };

  // Add new student
  const handleAddStudent = (newStudentData: Omit<StudentRecord, 'id'>) => {
    const student: StudentRecord = {
      ...newStudentData,
      id: `stu-${Date.now()}`
    };
    setStudents(prev => [student, ...prev]);
  };

  // Add new document
  const handleAddDocument = (newDocData: Omit<ProtectedDocument, 'id' | 'uploadedAt' | 'viewsCount'>) => {
    const newDoc: ProtectedDocument = {
      ...newDocData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      viewsCount: 0
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  // Add new notice
  const handleAddNotice = (newNoticeData: Omit<Notice, 'id' | 'publishedDate'>) => {
    const newNotice: Notice = {
      ...newNoticeData,
      id: `not-${Date.now()}`,
      publishedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  // Log security event
  const logSecurityEvent = (eventData: Omit<SecurityAuditLog, 'id'>) => {
    const newLog: SecurityAuditLog = {
      ...eventData,
      id: `log-${Date.now()}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Open secure viewer and increment view count
  const handleOpenDoc = (doc: ProtectedDocument) => {
    if (!currentUser) return;
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, viewsCount: d.viewsCount + 1 } : d));
    setActiveProtectedDoc(doc);
    // Log view event
    logSecurityEvent({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: `${currentUser.name} (${currentUser.studentDetails?.rollNo || 'STAFF'})`,
      actorRole: currentUser.role,
      action: 'DOCUMENT_VIEWED',
      documentTitle: doc.title,
      ipAddress: currentUser.studentDetails?.ipAddress?.split(' ')[0] || '115.112.44.82',
      status: 'LOGGED',
      details: 'Decrypted canvas frame presented with personalized forensic watermark.'
    });
  };

  // If user is not authenticated, render the LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navigation Bar with Sriyam Crest, Live Switcher & Sign Out */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex">
        
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userRole={currentUser.role}
          documentsCount={documents.length}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {currentTab === 'overview' && (
            isStudent ? (
              <StudentPortalDashboard
                currentUser={currentUser}
                documents={documents}
                notices={notices}
                onOpenDoc={handleOpenDoc}
                onNavigateTab={setCurrentTab}
              />
            ) : (
              <AdminDashboardOverview
                leads={leads}
                students={students}
                documents={documents}
                fees={fees}
                logs={auditLogs}
                onNavigateTab={setCurrentTab}
                onOpenDoc={handleOpenDoc}
              />
            )
          )}

          {currentTab === 'leads' && !isStudent && (
            <LeadPipelineView
              leads={leads}
              onAddLead={handleAddLead}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onDeleteLead={handleDeleteLead}
            />
          )}

          {currentTab === 'students' && !isStudent && (
            <StudentDirectoryView
              students={students}
              onAddStudent={handleAddStudent}
            />
          )}

          {currentTab === 'vault' && (
            <DocumentVaultView
              documents={documents}
              currentUser={currentUser}
              onOpenViewer={handleOpenDoc}
              onAddDocument={handleAddDocument}
            />
          )}

          {currentTab === 'fees' && (
            <FeeManagementView
              fees={fees}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'notices' && (
            <NoticesView
              notices={notices}
              currentUser={currentUser}
              onAddNotice={handleAddNotice}
            />
          )}

          {currentTab === 'audit' && !isStudent && (
            <AuditLogView
              logs={auditLogs}
            />
          )}

          {currentTab === 'schedule' && (
            <ScheduleView
              currentUser={currentUser}
            />
          )}
        </main>
      </div>

      {/* Secure Canvas Document Viewer (Anti-Download & Anti-Screenshot) */}
      {activeProtectedDoc && (
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

