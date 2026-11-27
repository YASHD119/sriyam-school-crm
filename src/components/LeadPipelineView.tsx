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
  Building2,
  X,
  CreditCard,
  Lock,
  Unlock,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Lead, PaymentStatus, Course } from '../types';
import { checkCourseAccess, ONE_MONTH_DAYS } from '../utils/accessControl';

interface LeadPipelineViewProps {
  leads: Lead[];
  courses: Course[];
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onUpdateLeadStatus: (leadId: string, nextStatus: Lead['status']) => void;
  onUpdateLeadPayment: (leadId: string, paymentStatus: PaymentStatus, paidDate?: string, assignedCourseId?: string) => void;
}

const STAGES: { id: Lead['status']; title: string; color: string }[] = [
  { id: 'NEW_INQUIRY', title: 'New Inquiries', color: 'border-blue-400 bg-blue-50/50 text-blue-800' },
  { id: 'CAMPUS_TOUR', title: 'Campus Tours', color: 'border-amber-400 bg-amber-50/50 text-amber-800' },
  { id: 'TEST_SCHEDULED', title: 'Admission Test', color: 'border-purple-400 bg-purple-50/50 text-purple-800' },
  { id: 'OFFER_MADE', title: 'Offer Letter', color: 'border-emerald-400 bg-emerald-50/50 text-emerald-800' },
  { id: 'ENROLLED', title: 'Admitted / Enrolled', color: 'border-teal-500 bg-teal-50/50 text-teal-900' }
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
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // New lead form state
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Admissions & Course Access Control</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {leads.length} Total Applicants
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage applicant admissions, verify payment receipt, and enforce strict 1-month course material safe access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Roster & Safe View
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'pipeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pipeline Board
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Admission</span>
          </button>
        </div>
      </div>

      {/* KPI Stats / Safe Access Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setSelectedPaymentFilter('ALL')}
          className={`cursor-pointer p-4 rounded-2xl border transition ${
            selectedPaymentFilter === 'ALL' ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Total Admissions</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary.total}</div>
          <p className="text-[11px] text-slate-500 mt-1">Across all pipeline stages</p>
        </div>

        <div 
          onClick={() => setSelectedPaymentFilter('PAID_ACTIVE')}
          className={`cursor-pointer p-4 rounded-2xl border transition ${
            selectedPaymentFilter === 'PAID_ACTIVE' ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
            <span>Paid (Safe Active)</span>
            <Unlock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{summary.paidActive}</div>
          <p className="text-[11px] text-emerald-600 mt-1">Active within 1-Month window</p>
        </div>

        <div 
          onClick={() => setSelectedPaymentFilter('PAID_EXPIRED')}
          className={`cursor-pointer p-4 rounded-2xl border transition ${
            selectedPaymentFilter === 'PAID_EXPIRED' ? 'bg-rose-50/60 border-rose-500 ring-2 ring-rose-500/20 shadow-md' : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-semibold mb-1">
            <span>Access Expired</span>
            <Lock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700">{summary.paidExpired}</div>
          <p className="text-[11px] text-rose-600 mt-1">&gt; 30 days elapsed since payment</p>
        </div>

        <div 
          onClick={() => setSelectedPaymentFilter('UNPAID')}
          className={`cursor-pointer p-4 rounded-2xl border transition ${
            selectedPaymentFilter === 'UNPAID' ? 'bg-amber-50/60 border-amber-500 ring-2 ring-amber-500/20 shadow-md' : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
            <span>Unpaid / Locked</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800">{summary.unpaid}</div>
          <p className="text-[11px] text-amber-600 mt-1">Course safe locked until paid</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search applicant name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Payment Access Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Safe Access:</span>
            <select
              value={selectedPaymentFilter}
              onChange={(e) => setSelectedPaymentFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Applicants</option>
              <option value="PAID_ACTIVE">Paid & Active (&lt; 30 Days)</option>
              <option value="PAID_EXPIRED">Paid & Expired (&gt; 30 Days)</option>
              <option value="UNPAID">Unpaid (Locked)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

      {/* Main Content: Table View or Pipeline View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Admissions Access Roster & 1-Month Safe Timer
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Showing {filteredLeads.length} of {leads.length} candidates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Applicant & Contact</th>
                  <th className="py-3 px-4">Grade & Course</th>
                  <th className="py-3 px-4">Admission Stage</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Paid Date</th>
                  <th className="py-3 px-4">Course Safe Access Window</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No applicant records found matching the current search & filters.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const access = checkCourseAccess(lead.paymentStatus, lead.paidDate);
                    const assignedCourse = courses.find(c => c.id === lead.assignedCourseId) || courses[0];

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{lead.studentName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>Guardian: {lead.guardianName}</span>
                            <span>•</span>
                            <span>{lead.phone}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{lead.email}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{lead.gradeApplying}</div>
                          <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 border border-emerald-200/50">
                            <BookOpen className="w-3 h-3" />
                            <span>{assignedCourse?.code || 'Course Assigned'}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            lead.status === 'ENROLLED' ? 'bg-teal-50 text-teal-800 border-teal-300' :
                            lead.status === 'OFFER_MADE' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            lead.status === 'TEST_SCHEDULED' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                            'bg-blue-50 text-blue-800 border-blue-300'
                          }`}>
                            {lead.status.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Payment Status Dropdown (Core User Request) */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <select
                              value={lead.paymentStatus}
                              onChange={(e) => handleInlinePaymentChange(lead.id, e.target.value as PaymentStatus, lead.paidDate)}
                              className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border transition cursor-pointer focus:outline-none focus:ring-2 ${
                                lead.paymentStatus === 'PAID'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-400'
                                  : 'bg-rose-50 text-rose-800 border-rose-300 focus:ring-rose-400'
                              }`}
                            >
                              <option value="PAID">✓ PAID</option>
                              <option value="UNPAID">✕ UNPAID</option>
                            </select>
                          </div>
                          {lead.amount && (
                            <div className="text-[11px] text-slate-400 mt-1 font-mono">
                              ₹{lead.amount.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        {/* Paid Date Selector */}
                        <td className="py-3.5 px-4">
                          {lead.paymentStatus === 'PAID' ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="date"
                                value={lead.paidDate || todayStr}
                                onChange={(e) => handleInlineDateChange(lead.id, e.target.value, lead.paymentStatus)}
                                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                              />
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">N/A (Awaiting Fee)</span>
                          )}
                        </td>

                        {/* 1-Month Access Status & Expiry Countdown */}
                        <td className="py-3.5 px-4">
                          {lead.paymentStatus === 'PAID' ? (
                            access.isActive ? (
                              <div className="space-y-1">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <Unlock className="w-3 h-3 text-emerald-700" />
                                  <span>Active Safe Access ({access.daysRemaining} days left)</span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium">
                                  Expires: <strong className="text-slate-700">{access.expiryDateString}</strong>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  <Lock className="w-3 h-3 text-rose-700" />
                                  <span>Access Expired (&gt; 1 Month)</span>
                                </div>
                                <div className="text-[11px] text-rose-600">
                                  Elapsed on: {access.expiryDateString}
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>Course Safe Locked</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition border border-emerald-200"
                          >
                            Details
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
              <div key={stage.id} className="flex flex-col bg-slate-100/70 rounded-2xl p-3 border border-slate-200 min-h-[520px]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 px-1">
                  <span className="text-xs font-bold text-slate-800">
                    {stage.title}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-sm border border-slate-200">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards list */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {stageLeads.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[11px]">
                      No candidates
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const access = checkCourseAccess(lead.paymentStatus, lead.paidDate);

                      return (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition cursor-pointer group"
                        >
                          {/* Priority Tag & Grade */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              lead.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' :
                              lead.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {lead.priority}
                            </span>
                            <span className="text-[10px] font-medium text-slate-500">
                              {lead.gradeApplying}
                            </span>
                          </div>

                          {/* Student & Guardian */}
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                            {lead.studentName}
                          </h4>
                          <p className="text-[11px] text-slate-500 mb-2">
                            Guardian: {lead.guardianName}
                          </p>

                          {/* Payment status dropdown on card */}
                          <div className="my-2 pt-2 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[10px] font-semibold text-slate-400">Payment:</span>
                            <select
                              value={lead.paymentStatus}
                              onChange={(e) => handleInlinePaymentChange(lead.id, e.target.value as PaymentStatus, lead.paidDate)}
                              className={`text-[10px] font-bold rounded px-1.5 py-0.5 border ${
                                lead.paymentStatus === 'PAID'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-rose-50 text-rose-800 border-rose-300'
                              }`}
                            >
                              <option value="PAID">PAID</option>
                              <option value="UNPAID">UNPAID</option>
                            </select>
                          </div>

                          {/* 1 Month Safe Access Countdown Pill */}
                          <div className="mb-2">
                            {lead.paymentStatus === 'PAID' ? (
                              access.isActive ? (
                                <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                                  <Unlock className="w-2.5 h-2.5" />
                                  <span>Safe: {access.daysRemaining}d left</span>
                                </div>
                              ) : (
                                <div className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200 flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Expired (&gt;30d)</span>
                                </div>
                              )
                            ) : (
                              <div className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5 text-slate-400" />
                                <span>Locked</span>
                              </div>
                            )}
                          </div>

                          {/* Move to next stage quick button */}
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
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                              >
                                <span>Move Stage</span>
                                <ChevronRight className="w-3 h-3" />
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

      {/* New Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Register New Admission & Setup Safe Access</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Advait Nair"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="e.g. Suresh Nair"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@sriyamschool.edu.in"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Course & Grade Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Applying Grade
                  </label>
                  <select
                    value={formData.gradeApplying}
                    onChange={(e) => setFormData({ ...formData, gradeApplying: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10 (Science & Math)">Grade 10 (Science & Math)</option>
                    <option value="Grade 11 (Science-PCM)">Grade 11 (Science-PCM)</option>
                    <option value="Grade 11 (Science-PCB)">Grade 11 (Science-PCB)</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Assign Course Material Safe
                  </label>
                  <select
                    value={formData.assignedCourseId}
                    onChange={(e) => setFormData({ ...formData, assignedCourseId: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Section (Dropdown for Paid/Unpaid + 1-Month Window) */}
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Payment Receipt & Safe Access Duration (1 Month)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Payment Status *
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="PAID">PAID (Grant 1-Month Safe Access)</option>
                      <option value="UNPAID">UNPAID (Keep Safe Locked)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      disabled={formData.paymentStatus !== 'PAID'}
                      value={formData.paidDate}
                      onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 font-mono"
                    />
                  </div>
                </div>

                {formData.paymentStatus === 'PAID' && (
                  <p className="text-[11px] text-emerald-700 leading-tight">
                    ℹ️ Safe access will remain active for exactly <strong>30 days</strong> from the payment date.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Counselor Notes & Inquiries
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes from counseling, fee payment reference, previous school..."
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
                  Save & Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {selectedLead.gradeApplying}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedLead.studentName}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Guardian Name:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.guardianName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Source:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pipeline Stage:</span>
                  <span className="font-bold text-emerald-700">{selectedLead.status}</span>
                </div>
              </div>

              {/* Payment & Safe Controls */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950">Payment & Course Safe Access:</span>
                  <select
                    value={selectedLead.paymentStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value as PaymentStatus;
                      handleInlinePaymentChange(selectedLead.id, newStatus, selectedLead.paidDate);
                      setSelectedLead({ ...selectedLead, paymentStatus: newStatus, paidDate: newStatus === 'PAID' ? (selectedLead.paidDate || todayStr) : undefined });
                    }}
                    className="text-xs font-bold rounded-lg px-2.5 py-1 bg-white border border-emerald-300"
                  >
                    <option value="PAID">PAID</option>
                    <option value="UNPAID">UNPAID</option>
                  </select>
                </div>

                {selectedLead.paymentStatus === 'PAID' ? (
                  <div className="space-y-2 pt-2 border-t border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Payment Received On:</span>
                      <input
                        type="date"
                        value={selectedLead.paidDate || todayStr}
                        onChange={(e) => {
                          handleInlineDateChange(selectedLead.id, e.target.value, selectedLead.paymentStatus);
                          setSelectedLead({ ...selectedLead, paidDate: e.target.value });
                        }}
                        className="text-xs px-2 py-0.5 border border-emerald-300 rounded font-mono bg-white"
                      />
                    </div>
                    {(() => {
                      const acc = checkCourseAccess(selectedLead.paymentStatus, selectedLead.paidDate);
                      return acc.isActive ? (
                        <div className="p-2 bg-emerald-100 rounded text-emerald-900 font-semibold text-[11px] flex items-center gap-1.5">
                          <Unlock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>Course Material Safe Active: {acc.daysRemaining} days remaining (Expires on {acc.expiryDateString})</span>
                        </div>
                      ) : (
                        <div className="p-2 bg-rose-100 rounded text-rose-900 font-semibold text-[11px] flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                          <span>Access Expired: 1-month timeframe elapsed on {acc.expiryDateString}</span>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="p-2 bg-slate-100 rounded text-slate-700 text-[11px] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Safe Locked. Mark as PAID to grant 1 month of course material access.</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Counselor Discussion Notes</h4>
                <p className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-slate-700 leading-relaxed">
                  {selectedLead.notes || 'No counseling notes recorded yet.'}
                </p>
              </div>

              {/* Convert to enrolled student button */}
              {selectedLead.status !== 'ENROLLED' && (
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">
                    Ready to confirm enrollment?
                  </span>
                  <button
                    onClick={() => {
                      onUpdateLeadStatus(selectedLead.id, 'ENROLLED');
                      setSelectedLead(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Admission</span>
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
