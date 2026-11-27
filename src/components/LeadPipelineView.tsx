import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  X,
  CreditCard,
  Lock,
  Unlock,
  AlertCircle,
  ShieldCheck,
  Layers,
  BookOpen,
  Info,
  HelpCircle
} from 'lucide-react';
import { Lead, PaymentStatus, Course } from '../types';
import { checkCourseAccess } from '../utils/accessControl';

interface LeadPipelineViewProps {
  leads: Lead[];
  courses: Course[];
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onUpdateLeadStatus: (leadId: string, nextStatus: Lead['status']) => void;
  onUpdateLeadPayment: (leadId: string, paymentStatus: PaymentStatus, paidDate?: string, assignedCourseId?: string) => void;
}

const STAGES: { id: Lead['status']; title: string; color: string }[] = [
  { id: 'NEW_INQUIRY', title: '1. New Inquiries', color: 'border-blue-500 bg-blue-50 text-blue-900' },
  { id: 'CAMPUS_TOUR', title: '2. Campus Tours', color: 'border-amber-500 bg-amber-50 text-amber-900' },
  { id: 'TEST_SCHEDULED', title: '3. Admission Test', color: 'border-purple-500 bg-purple-50 text-purple-900' },
  { id: 'OFFER_MADE', title: '4. Offer Letter', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
  { id: 'ENROLLED', title: '5. Admitted / Enrolled', color: 'border-teal-600 bg-teal-50 text-teal-950' }
];

export const LeadPipelineView: React.FC<LeadPipelineViewProps> = ({
  leads,
  courses,
  onAddLead,
  onUpdateLeadStatus,
  onUpdateLeadPayment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<'ALL' | 'PAID_ACTIVE' | 'PAID_EXPIRED' | 'UNPAID'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // New lead form state with accessible defaults
  const [formData, setFormData] = useState({
    studentName: '',
    guardianName: '',
    email: '',
    phone: '',
    gradeApplying: 'Grade 10 (Science & Math)',
    status: 'NEW_INQUIRY' as Lead['status'],
    source: 'WEBSITE' as Lead['source'],
    lastContacted: 'Today',
    notes: '',
    priority: 'HIGH' as Lead['priority'],
    paymentStatus: 'PAID' as PaymentStatus,
    paidDate: todayStr,
    assignedCourseId: courses[0]?.id || 'crs-1',
    amount: 38500
  });

  // Calculate summary counts
  const summary = leads.reduce(
    (acc, lead) => {
      acc.total++;
      const access = checkCourseAccess(lead.paymentStatus, lead.paidDate);
      if (lead.paymentStatus === 'PAID') {
        if (access.isActive) acc.paidActive++;
        else acc.paidExpired++;
      } else {
        acc.unpaid++;
      }
      return acc;
    },
    { total: 0, paidActive: 0, paidExpired: 0, unpaid: 0 }
  );

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm);
    const matchesGrade = selectedGrade === 'ALL' || l.gradeApplying.includes(selectedGrade);
    
    const access = checkCourseAccess(l.paymentStatus, l.paidDate);
    let matchesPayment = true;
    if (selectedPaymentFilter === 'PAID_ACTIVE') {
      matchesPayment = l.paymentStatus === 'PAID' && access.isActive;
    } else if (selectedPaymentFilter === 'PAID_EXPIRED') {
      matchesPayment = l.paymentStatus === 'PAID' && access.isExpired;
    } else if (selectedPaymentFilter === 'UNPAID') {
      matchesPayment = l.paymentStatus === 'UNPAID';
    }

    return matchesSearch && matchesGrade && matchesPayment;
  });

  const handleSubmitNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.phone) return;
    onAddLead(formData);
    setIsAddModalOpen(false);
    setFormData({
      studentName: '',
      guardianName: '',
      email: '',
      phone: '',
      gradeApplying: 'Grade 10 (Science & Math)',
      status: 'NEW_INQUIRY',
      source: 'WEBSITE',
      lastContacted: 'Today',
      notes: '',
      priority: 'HIGH',
      paymentStatus: 'PAID',
      paidDate: todayStr,
      assignedCourseId: courses[0]?.id || 'crs-1',
      amount: 38500
    });
  };

  const handleInlinePaymentChange = (leadId: string, newStatus: PaymentStatus, currentPaidDate?: string) => {
    const updatedDate = newStatus === 'PAID' 
      ? (currentPaidDate || todayStr)
      : undefined;
    onUpdateLeadPayment(leadId, newStatus, updatedDate);
  };

  const handleInlineDateChange = (leadId: string, newDate: string, currentStatus: PaymentStatus) => {
    onUpdateLeadPayment(leadId, currentStatus, newDate);
  };

  return (
    <div className="space-y-6">
      
      {/* Friendly Senior Explanatory Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-300 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-800 shrink-0">
                <UserPlus className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Student Admissions & Payment Safe
                </h1>
                <p className="text-sm text-slate-600 font-semibold mt-0.5">
                  Check who is admitted, mark them <strong>PAID</strong> or <strong>UNPAID</strong>, and view their 1-month course safe window.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border-2 border-slate-300">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-md border border-slate-300' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                📋 List / Table View
              </button>
              <button
                onClick={() => setViewMode('pipeline')}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                  viewMode === 'pipeline' ? 'bg-white text-slate-900 shadow-md border border-slate-300' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                📊 Stage Cards
              </button>
            </div>

            {/* Add New Admission button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-900/20 transition cursor-pointer border-2 border-emerald-800"
              aria-label="Add New Admission"
            >
              <Plus className="w-5 h-5" />
              <span>+ Add New Admission</span>
            </button>
          </div>
        </div>

        {/* Big Plain-English Instruction Box */}
        <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-start gap-3">
          <Info className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-sm text-emerald-950 font-medium leading-relaxed">
            <strong>How the 1-Month Safe Timer works:</strong> When you set an applicant's payment status to <span className="bg-emerald-200 px-2 py-0.5 rounded font-bold">PAID</span>, the system automatically opens their access to Course Materials for exactly <strong>30 days</strong>. After 30 days, their access automatically locks again until renewed.
          </div>
        </div>
      </div>

      {/* Large Senior-Friendly Summary Filter Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="Status Filters">
        <button 
          onClick={() => setSelectedPaymentFilter('ALL')}
          className={`p-5 rounded-3xl border-3 text-left transition cursor-pointer ${
            selectedPaymentFilter === 'ALL' 
              ? 'bg-white border-emerald-600 ring-4 ring-emerald-500/20 shadow-lg' 
              : 'bg-white border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-sm text-slate-600 font-bold mb-1">
            <span>All Applicants</span>
            <Layers className="w-5 h-5 text-slate-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{summary.total}</div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Show all registered students</p>
        </button>

        <button 
          onClick={() => setSelectedPaymentFilter('PAID_ACTIVE')}
          className={`p-5 rounded-3xl border-3 text-left transition cursor-pointer ${
            selectedPaymentFilter === 'PAID_ACTIVE' 
              ? 'bg-emerald-50 border-emerald-600 ring-4 ring-emerald-500/20 shadow-lg' 
              : 'bg-white border-slate-300 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between text-sm text-emerald-900 font-extrabold mb-1">
            <span>✓ Paid & Active</span>
            <Unlock className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="text-3xl font-black text-emerald-800">{summary.paidActive}</div>
          <p className="text-xs text-emerald-700 font-bold mt-1">Safe Open (&lt; 30 Days Left)</p>
        </button>

        <button 
          onClick={() => setSelectedPaymentFilter('PAID_EXPIRED')}
          className={`p-5 rounded-3xl border-3 text-left transition cursor-pointer ${
            selectedPaymentFilter === 'PAID_EXPIRED' 
              ? 'bg-rose-50 border-rose-600 ring-4 ring-rose-500/20 shadow-lg' 
              : 'bg-white border-slate-300 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between text-sm text-rose-900 font-extrabold mb-1">
            <span>⏰ Time Expired</span>
            <Lock className="w-5 h-5 text-rose-700" />
          </div>
          <div className="text-3xl font-black text-rose-800">{summary.paidExpired}</div>
          <p className="text-xs text-rose-700 font-bold mt-1">&gt; 30 Days Elapsed Since Paid</p>
        </button>

        <button 
          onClick={() => setSelectedPaymentFilter('UNPAID')}
          className={`p-5 rounded-3xl border-3 text-left transition cursor-pointer ${
            selectedPaymentFilter === 'UNPAID' 
              ? 'bg-amber-50 border-amber-600 ring-4 ring-amber-500/20 shadow-lg' 
              : 'bg-white border-slate-300 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between text-sm text-amber-900 font-extrabold mb-1">
            <span>🔒 Unpaid / Locked</span>
            <AlertCircle className="w-5 h-5 text-amber-700" />
          </div>
          <div className="text-3xl font-black text-amber-900">{summary.unpaid}</div>
          <p className="text-xs text-amber-800 font-bold mt-1">Safe Locked Until Paid</p>
        </button>
      </div>

      {/* Senior-Accessible Search and Filter Controls */}
      <div className="bg-white p-4 rounded-3xl border-2 border-slate-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student by name, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            aria-label="Search applicants"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 font-bold">Filter by Access:</span>
            <select
              value={selectedPaymentFilter}
              onChange={(e) => setSelectedPaymentFilter(e.target.value as any)}
              className="bg-slate-50 border-2 border-slate-300 text-slate-800 text-sm font-bold rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              aria-label="Filter by Access Status"
            >
              <option value="ALL">Show All (Total {leads.length})</option>
              <option value="PAID_ACTIVE">Paid & Active Safe (&lt; 30 Days)</option>
              <option value="PAID_EXPIRED">Paid & Expired Safe (&gt; 30 Days)</option>
              <option value="UNPAID">Unpaid (Safe Locked)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 font-bold">Grade:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-slate-50 border-2 border-slate-300 text-slate-800 text-sm font-bold rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              aria-label="Filter by Grade"
            >
              <option value="ALL">All Grades</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: High-Readability Table View or Card View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-sm overflow-hidden">
          <div className="p-5 border-b-2 border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
              <h2 className="text-base font-black text-slate-900">
                Admissions Roster & 1-Month Safe Timer
              </h2>
            </div>
            <span className="text-sm font-bold text-slate-600">
              Showing {filteredLeads.length} of {leads.length} applicants
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800" aria-label="Admissions Roster Table">
              <thead className="bg-slate-100 border-b-2 border-slate-300 text-xs font-black uppercase tracking-wider text-slate-700">
                <tr>
                  <th className="py-4 px-5">Student & Guardian</th>
                  <th className="py-4 px-5">Assigned Course</th>
                  <th className="py-4 px-5">Admission Stage</th>
                  <th className="py-4 px-5">1. Payment Status</th>
                  <th className="py-4 px-5">2. Payment Date</th>
                  <th className="py-4 px-5">3. Course Safe Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500 text-base font-semibold">
                      No student records found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const access = checkCourseAccess(lead.paymentStatus, lead.paidDate);
                    const assignedCourse = courses.find(c => c.id === lead.assignedCourseId) || courses[0];

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                        {/* Student Name & Contact */}
                        <td className="py-4 px-5">
                          <div className="font-black text-slate-900 text-base">{lead.studentName}</div>
                          <div className="text-xs text-slate-600 font-semibold mt-0.5">
                            Guardian: <strong className="text-slate-800">{lead.guardianName}</strong>
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.phone}</span>
                          </div>
                        </td>

                        {/* Grade & Assigned Course */}
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-900 text-sm">{lead.gradeApplying}</div>
                          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-900 font-bold bg-emerald-100 px-2.5 py-1 rounded-lg mt-1 border border-emerald-300">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{assignedCourse?.title || 'General Course Safe'}</span>
                          </div>
                        </td>

                        {/* Pipeline Stage */}
                        <td className="py-4 px-5">
                          <span className={`inline-block text-xs font-black px-3 py-1 rounded-full border-2 ${
                            lead.status === 'ENROLLED' ? 'bg-teal-100 text-teal-950 border-teal-400' :
                            lead.status === 'OFFER_MADE' ? 'bg-emerald-100 text-emerald-950 border-emerald-400' :
                            lead.status === 'TEST_SCHEDULED' ? 'bg-purple-100 text-purple-950 border-purple-400' :
                            'bg-blue-100 text-blue-950 border-blue-400'
                          }`}>
                            {lead.status.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Payment Status Dropdown (Clear and Large for Elderly Users) */}
                        <td className="py-4 px-5">
                          <select
                            value={lead.paymentStatus}
                            onChange={(e) => handleInlinePaymentChange(lead.id, e.target.value as PaymentStatus, lead.paidDate)}
                            aria-label={`Payment status for ${lead.studentName}`}
                            className={`text-sm font-black rounded-xl px-3 py-2 border-2 transition cursor-pointer focus:outline-none focus:ring-4 ${
                              lead.paymentStatus === 'PAID'
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-500 focus:ring-emerald-500/20'
                                : 'bg-rose-100 text-rose-950 border-rose-500 focus:ring-rose-500/20'
                            }`}
                          >
                            <option value="PAID">✓ PAID (Safe Open)</option>
                            <option value="UNPAID">✕ UNPAID (Locked)</option>
                          </select>
                          {lead.amount && (
                            <div className="text-xs font-extrabold text-slate-600 mt-1">
                              ₹{lead.amount.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        {/* Paid Date Selector */}
                        <td className="py-4 px-5">
                          {lead.paymentStatus === 'PAID' ? (
                            <input
                              type="date"
                              value={lead.paidDate || todayStr}
                              onChange={(e) => handleInlineDateChange(lead.id, e.target.value, lead.paymentStatus)}
                              aria-label={`Payment date for ${lead.studentName}`}
                              className="text-xs font-bold bg-white border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 font-mono focus:ring-4 focus:ring-emerald-500/20 focus:outline-none"
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-400 italic">Fee Not Received</span>
                          )}
                        </td>

                        {/* 1-Month Access Countdown (Large Senior Friendly Badges) */}
                        <td className="py-4 px-5">
                          {lead.paymentStatus === 'PAID' ? (
                            access.isActive ? (
                              <div className="space-y-1">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-950 border-2 border-emerald-400">
                                  <Unlock className="w-4 h-4 text-emerald-700" />
                                  <span>SAFE OPEN: {access.daysRemaining} Days Left</span>
                                </div>
                                <div className="text-xs text-slate-600 font-semibold">
                                  Valid until: <strong className="text-slate-900">{access.expiryDateString}</strong>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-100 text-rose-950 border-2 border-rose-400">
                                  <Lock className="w-4 h-4 text-rose-700" />
                                  <span>1-MONTH ELAPSED</span>
                                </div>
                                <div className="text-xs text-rose-700 font-bold">
                                  Ended on: {access.expiryDateString}
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 text-slate-700 border-2 border-slate-300">
                              <Lock className="w-4 h-4 text-slate-500" />
                              <span>Safe Locked (Unpaid)</span>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="px-3.5 py-2 text-xs font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition border-2 border-emerald-300 cursor-pointer"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Pipeline Board */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter(l => l.status === stage.id);

            return (
              <div key={stage.id} className="flex flex-col bg-slate-100 rounded-3xl p-4 border-2 border-slate-300 min-h-[520px]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-slate-300 mb-3 px-1">
                  <span className="text-sm font-black text-slate-800">
                    {stage.title}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white text-slate-800 shadow-sm border border-slate-300">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards list */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {stageLeads.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-bold">
                      No candidates in this stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const access = checkCourseAccess(lead.paymentStatus, lead.paidDate);

                      return (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="bg-white rounded-2xl p-4 border-2 border-slate-300 hover:border-emerald-500 shadow-sm hover:shadow-md transition cursor-pointer group space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800 border">
                              {lead.gradeApplying}
                            </span>
                            <span className="text-xs font-bold text-slate-500">
                              {lead.priority}
                            </span>
                          </div>

                          <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition">
                            {lead.studentName}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium">
                            Guardian: {lead.guardianName}
                          </p>

                          {/* Large inline payment dropdown */}
                          <div className="pt-2 border-t-2 border-slate-100" onClick={(e) => e.stopPropagation()}>
                            <label className="block text-xs font-black text-slate-700 mb-1">
                              Payment:
                            </label>
                            <select
                              value={lead.paymentStatus}
                              onChange={(e) => handleInlinePaymentChange(lead.id, e.target.value as PaymentStatus, lead.paidDate)}
                              className={`w-full text-xs font-black rounded-xl px-2.5 py-2 border-2 ${
                                lead.paymentStatus === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                                  : 'bg-rose-100 text-rose-950 border-rose-400'
                              }`}
                            >
                              <option value="PAID">✓ PAID (30d Access)</option>
                              <option value="UNPAID">✕ UNPAID (Locked)</option>
                            </select>
                          </div>

                          {/* 1 Month Safe Access Countdown Pill */}
                          <div>
                            {lead.paymentStatus === 'PAID' ? (
                              access.isActive ? (
                                <div className="text-xs font-extrabold text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-400 flex items-center gap-1.5">
                                  <Unlock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                  <span>Safe Open ({access.daysRemaining}d left)</span>
                                </div>
                              ) : (
                                <div className="text-xs font-extrabold text-rose-950 bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-400 flex items-center gap-1.5">
                                  <Lock className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                                  <span>Expired (&gt;30d)</span>
                                </div>
                              )
                            ) : (
                              <div className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl border flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Locked</span>
                              </div>
                            )}
                          </div>

                          {/* Move to next stage button */}
                          {lead.status !== 'ENROLLED' && (
                            <div className="pt-2 border-t border-slate-100 flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentIndex = STAGES.findIndex(s => s.id === lead.status);
                                  if (currentIndex < STAGES.length - 1) {
                                    onUpdateLeadStatus(lead.id, STAGES[currentIndex + 1].id);
                                  }
                                }}
                                className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-800 hover:underline"
                              >
                                <span>Move to Next Stage</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Senior-Friendly New Admission Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-3 border-slate-300 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Register New Student Admission
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Fill in the details below. Mark as Paid to unlock 30 days of safe access.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl"
                aria-label="Close form"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                    1. Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Advait Nair"
                    className="w-full text-sm px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                    2. Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="e.g. Suresh Nair"
                    className="w-full text-sm px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                    3. Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full text-sm px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                    4. Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@sriyamschool.edu.in"
                    className="w-full text-sm px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                    5. Grade Applying
                  </label>
                  <select
                    value={formData.gradeApplying}
                    onChange={(e) => setFormData({ ...formData, gradeApplying: e.target.value })}
                    className="w-full text-sm font-bold px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10 (Science & Math)">Grade 10 (Science & Math)</option>
                    <option value="Grade 11 (Science-PCM)">Grade 11 (Science-PCM)</option>
                    <option value="Grade 11 (Science-PCB)">Grade 11 (Science-PCB)</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                    6. Assign Course Safe
                  </label>
                  <select
                    value={formData.assignedCourseId}
                    onChange={(e) => setFormData({ ...formData, assignedCourseId: e.target.value })}
                    className="w-full text-sm font-bold px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Big, Clear Payment Box */}
              <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-400 space-y-3">
                <div className="flex items-center gap-2 text-sm font-black text-emerald-950">
                  <CreditCard className="w-5 h-5 text-emerald-700" />
                  <span>7. Payment Receipt (Enforces 30-Day Safe Access)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Payment Status *
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                      className="w-full text-sm font-black px-4 py-3 bg-white border-2 border-emerald-500 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:outline-none"
                    >
                      <option value="PAID">✓ PAID (Unlock 1-Month Safe Access)</option>
                      <option value="UNPAID">✕ UNPAID (Keep Safe Locked)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      disabled={formData.paymentStatus !== 'PAID'}
                      value={formData.paidDate}
                      onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                      className="w-full text-sm font-bold px-4 py-3 bg-white border-2 border-emerald-500 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 font-mono"
                    />
                  </div>
                </div>

                <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
                  ℹ️ If marked <strong>PAID</strong>, the student can view course materials for exactly <strong>30 days</strong> from the payment date.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  8. Discussion / Counselor Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes from admission counseling or fee receipts..."
                  className="w-full text-sm px-4 py-3 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-2xl transition border-2 border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-black bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-lg transition border-2 border-emerald-800 cursor-pointer"
                >
                  Save & Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-3 border-slate-300 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200 mb-4">
              <div>
                <span className="text-xs font-black uppercase px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {selectedLead.gradeApplying}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {selectedLead.studentName}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl"
                aria-label="Close details"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Guardian Name:</span>
                  <span className="font-extrabold text-slate-900">{selectedLead.guardianName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Phone Number:</span>
                  <span className="font-extrabold text-slate-900">{selectedLead.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Email:</span>
                  <span className="font-extrabold text-slate-900">{selectedLead.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Current Stage:</span>
                  <span className="font-black text-emerald-800">{selectedLead.status}</span>
                </div>
              </div>

              {/* Payment & Safe Controls */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-950 text-sm">Payment Status:</span>
                  <select
                    value={selectedLead.paymentStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value as PaymentStatus;
                      handleInlinePaymentChange(selectedLead.id, newStatus, selectedLead.paidDate);
                      setSelectedLead({ ...selectedLead, paymentStatus: newStatus, paidDate: newStatus === 'PAID' ? (selectedLead.paidDate || todayStr) : undefined });
                    }}
                    className="text-sm font-black rounded-xl px-3 py-1.5 bg-white border-2 border-emerald-500"
                  >
                    <option value="PAID">✓ PAID</option>
                    <option value="UNPAID">✕ UNPAID</option>
                  </select>
                </div>

                {selectedLead.paymentStatus === 'PAID' ? (
                  <div className="space-y-2 pt-2 border-t-2 border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-bold text-xs">Payment Received On:</span>
                      <input
                        type="date"
                        value={selectedLead.paidDate || todayStr}
                        onChange={(e) => {
                          handleInlineDateChange(selectedLead.id, e.target.value, selectedLead.paymentStatus);
                          setSelectedLead({ ...selectedLead, paidDate: e.target.value });
                        }}
                        className="text-xs font-bold px-2.5 py-1 border-2 border-emerald-400 rounded-xl font-mono bg-white"
                      />
                    </div>
                    {(() => {
                      const acc = checkCourseAccess(selectedLead.paymentStatus, selectedLead.paidDate);
                      return acc.isActive ? (
                        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-950 font-black text-xs flex items-center gap-2 border border-emerald-300">
                          <Unlock className="w-4 h-4 text-emerald-800 shrink-0" />
                          <span>Course Safe Open: {acc.daysRemaining} days remaining (Expires on {acc.expiryDateString})</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-rose-100 rounded-xl text-rose-950 font-black text-xs flex items-center gap-2 border border-rose-300">
                          <Lock className="w-4 h-4 text-rose-800 shrink-0" />
                          <span>Access Expired: 1-month period ended on {acc.expiryDateString}</span>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-800 text-xs font-bold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Safe Locked. Change to PAID above to unlock 1 month of study materials.</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-black text-slate-900 mb-1">Counselor Discussion Notes:</h4>
                <p className="p-3 bg-amber-50 border-2 border-amber-200 rounded-2xl text-slate-800 leading-relaxed text-xs font-medium">
                  {selectedLead.notes || 'No counseling notes recorded yet.'}
                </p>
              </div>

              {/* Confirm Admission button */}
              {selectedLead.status !== 'ENROLLED' && (
                <div className="pt-4 border-t-2 border-slate-200 flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold">
                    Admit to School?
                  </span>
                  <button
                    onClick={() => {
                      onUpdateLeadStatus(selectedLead.id, 'ENROLLED');
                      setSelectedLead(null);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl text-xs shadow-md transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Enrollment</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
