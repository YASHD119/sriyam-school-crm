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
  ArrowUpDown,
  MoreVertical
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
  { id: 'NEW_INQUIRY', title: 'New Inquiries', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'CAMPUS_TOUR', title: 'Campus Tours', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'TEST_SCHEDULED', title: 'Admission Test', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'OFFER_MADE', title: 'Offer Letter', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'ENROLLED', title: 'Enrolled', color: 'bg-teal-50 text-teal-800 border-teal-200' }
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
    <div className="space-y-5 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Admissions & Enrollment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage applicant admission records and 1-month course material safe access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Table / Kanban view toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'pipeline' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pipeline Board
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Admission</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div 
          onClick={() => setSelectedPaymentFilter('ALL')}
          className={`cursor-pointer p-4 rounded-xl border bg-white transition hover:shadow-xs ${
            selectedPaymentFilter === 'ALL' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Admissions</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary.total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">All registered applicants</div>
        </div>

        <div 
          onClick={() => setSelectedPaymentFilter('PAID_ACTIVE')}
          className={`cursor-pointer p-4 rounded-xl border bg-white transition hover:shadow-xs ${
            selectedPaymentFilter === 'PAID_ACTIVE' ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium mb-1">
            <span>Paid (Safe Active)</span>
            <Unlock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{summary.paidActive}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Active &lt; 30-day window</div>
        </div>

        <div 
          onClick={() => setSelectedPaymentFilter('PAID_EXPIRED')}
          className={`cursor-pointer p-4 rounded-xl border bg-white transition hover:shadow-xs ${
            selectedPaymentFilter === 'PAID_EXPIRED' ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-medium mb-1">
            <span>Timeframe Expired</span>
            <Lock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700">{summary.paidExpired}</div>
          <div className="text-[11px] text-rose-600/80 mt-0.5">&gt; 30 days since payment</div>
        </div>

        <div 
          onClick={() => setSelectedPaymentFilter('UNPAID')}
          className={`cursor-pointer p-4 rounded-xl border bg-white transition hover:shadow-xs ${
            selectedPaymentFilter === 'UNPAID' ? 'border-amber-500 ring-1 ring-amber-500 bg-amber-50/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-800 font-medium mb-1">
            <span>Unpaid / Locked</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800">{summary.unpaid}</div>
          <div className="text-[11px] text-amber-700/80 mt-0.5">Awaiting fee receipt</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student, guardian, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Status:</span>
            {(['ALL', 'PAID_ACTIVE', 'PAID_EXPIRED', 'UNPAID'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedPaymentFilter(filter)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  selectedPaymentFilter === filter
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter === 'ALL' ? 'All' : filter === 'PAID_ACTIVE' ? 'Active' : filter === 'PAID_EXPIRED' ? 'Expired' : 'Unpaid'}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="ALL">All Grades</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student & Contact</th>
                  <th className="py-3 px-4">Assigned Course</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">1-Month Safe Timer</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No admission records match your search filters.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const access = checkCourseAccess(lead.paymentStatus, lead.paidDate);
                    const assignedCourse = courses.find(c => c.id === lead.assignedCourseId) || courses[0];

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/60 transition">
                        {/* Student Name & Contact */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 text-xs">{lead.studentName}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Guardian: {lead.guardianName}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <span>{lead.phone}</span>
                            <span>•</span>
                            <span className="truncate max-w-[140px]">{lead.email}</span>
                          </div>
                        </td>

                        {/* Grade & Assigned Course */}
                        <td className="py-3 px-4">
                          <div className="text-slate-800 font-medium">{lead.gradeApplying}</div>
                          <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50 mt-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{assignedCourse?.title || 'Course Attached'}</span>
                          </div>
                        </td>

                        {/* Stage */}
                        <td className="py-3 px-4">
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            lead.status === 'ENROLLED' ? 'bg-teal-50 text-teal-800 border-teal-200' :
                            lead.status === 'OFFER_MADE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            lead.status === 'TEST_SCHEDULED' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                            'bg-blue-50 text-blue-800 border-blue-200'
                          }`}>
                            {lead.status.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Payment Status Dropdown (Core Feature) */}
                        <td className="py-3 px-4">
                          <select
                            value={lead.paymentStatus}
                            onChange={(e) => handleInlinePaymentChange(lead.id, e.target.value as PaymentStatus, lead.paidDate)}
                            className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition cursor-pointer focus:outline-none focus:ring-2 ${
                              lead.paymentStatus === 'PAID'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-400'
                                : 'bg-slate-50 text-slate-700 border-slate-300 focus:ring-slate-400'
                            }`}
                          >
                            <option value="PAID">✓ PAID</option>
                            <option value="UNPAID">✕ UNPAID</option>
                          </select>
                        </td>

                        {/* Payment Date */}
                        <td className="py-3 px-4">
                          {lead.paymentStatus === 'PAID' ? (
                            <input
                              type="date"
                              value={lead.paidDate || todayStr}
                              onChange={(e) => handleInlineDateChange(lead.id, e.target.value, lead.paymentStatus)}
                              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">—</span>
                          )}
                        </td>

                        {/* 1-Month Safe Timer Status */}
                        <td className="py-3 px-4">
                          {lead.paymentStatus === 'PAID' ? (
                            access.isActive ? (
                              <div className="space-y-0.5">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <Unlock className="w-3 h-3 text-emerald-600" />
                                  <span>{access.daysRemaining} days left</span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  Expires {access.expiryDateString}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                                  <Lock className="w-3 h-3 text-rose-600" />
                                  <span>Access Expired</span>
                                </div>
                                <div className="text-[10px] text-rose-500">
                                  Ended {access.expiryDateString}
                                </div>
                              </div>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] text-slate-500 bg-slate-100">
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>Safe Locked</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter(l => l.status === stage.id);

            return (
              <div key={stage.id} className="flex flex-col bg-slate-100/70 rounded-xl p-3 border border-slate-200 min-h-[500px]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-2.5 px-1">
                  <span className="text-xs font-bold text-slate-700">
                    {stage.title}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-2xs border border-slate-200">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards list */}
                <div className="flex-1 space-y-2.5 overflow-y-auto">
                  {stageLeads.length === 0 ? (
                    <div className="h-28 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                      No candidates
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const access = checkCourseAccess(lead.paymentStatus, lead.paidDate);

                      return (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="bg-white rounded-lg p-3 border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-xs transition cursor-pointer group"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[10px] font-semibold text-slate-500">
                              {lead.gradeApplying}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              lead.priority === 'HIGH' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {lead.priority}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                            {lead.studentName}
                          </h4>
                          <p className="text-[11px] text-slate-500 mb-2">
                            Guardian: {lead.guardianName}
                          </p>

                          {/* Payment dropdown on card */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[10px] text-slate-400">Payment:</span>
                            <select
                              value={lead.paymentStatus}
                              onChange={(e) => handleInlinePaymentChange(lead.id, e.target.value as PaymentStatus, lead.paidDate)}
                              className={`text-[10px] font-bold rounded px-1.5 py-0.5 border ${
                                lead.paymentStatus === 'PAID'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-slate-50 text-slate-700 border-slate-300'
                              }`}
                            >
                              <option value="PAID">PAID</option>
                              <option value="UNPAID">UNPAID</option>
                            </select>
                          </div>

                          {/* Access timer badge */}
                          <div className="mt-1.5">
                            {lead.paymentStatus === 'PAID' ? (
                              access.isActive ? (
                                <div className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                                  <Unlock className="w-2.5 h-2.5" />
                                  <span>Safe: {access.daysRemaining}d left</span>
                                </div>
                              ) : (
                                <div className="text-[10px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Expired</span>
                                </div>
                              )
                            ) : (
                              <div className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Locked</span>
                              </div>
                            )}
                          </div>
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

      {/* Add New Admission Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>New Admission Inquiry</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewLead} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Advait Nair"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="e.g. Suresh Nair"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Grade Applying
                  </label>
                  <select
                    value={formData.gradeApplying}
                    onChange={(e) => setFormData({ ...formData, gradeApplying: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10 (Science & Math)">Grade 10 (Science & Math)</option>
                    <option value="Grade 11 (Science-PCM)">Grade 11 (Science-PCM)</option>
                    <option value="Grade 11 (Science-PCB)">Grade 11 (Science-PCB)</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Attach Course Safe
                  </label>
                  <select
                    value={formData.assignedCourseId}
                    onChange={(e) => setFormData({ ...formData, assignedCourseId: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Section */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Admission Payment & 1-Month Safe Access</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Payment Status *
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                    >
                      <option value="PAID">PAID (Grant 1-Month Access)</option>
                      <option value="UNPAID">UNPAID (Keep Safe Locked)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      disabled={formData.paymentStatus !== 'PAID'}
                      value={formData.paidDate}
                      onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Counselor Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes from initial counseling, parent queries..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition"
                >
                  Save Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {selectedLead.gradeApplying}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
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

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
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
                  <span className="text-slate-400">Stage:</span>
                  <span className="font-bold text-emerald-700">{selectedLead.status}</span>
                </div>
              </div>

              {/* Payment details */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950">Payment Status:</span>
                  <select
                    value={selectedLead.paymentStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value as PaymentStatus;
                      handleInlinePaymentChange(selectedLead.id, newStatus, selectedLead.paidDate);
                      setSelectedLead({ ...selectedLead, paymentStatus: newStatus, paidDate: newStatus === 'PAID' ? (selectedLead.paidDate || todayStr) : undefined });
                    }}
                    className="text-xs font-bold rounded-lg px-2 py-1 bg-white border border-emerald-300"
                  >
                    <option value="PAID">PAID</option>
                    <option value="UNPAID">UNPAID</option>
                  </select>
                </div>

                {selectedLead.paymentStatus === 'PAID' ? (
                  <div className="space-y-1 pt-1.5 border-t border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Date Paid:</span>
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
                        <div className="p-2 bg-emerald-100 rounded text-emerald-900 font-medium text-[11px] flex items-center gap-1.5">
                          <Unlock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>Safe Access Active: {acc.daysRemaining} days left (Expires {acc.expiryDateString})</span>
                        </div>
                      ) : (
                        <div className="p-2 bg-rose-100 rounded text-rose-900 font-medium text-[11px] flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                          <span>Access Expired: Ended on {acc.expiryDateString}</span>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="p-2 bg-slate-100 rounded text-slate-700 text-[11px] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Safe Locked. Change to PAID above to unlock 1 month of study materials.</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Counselor Discussion Notes</h4>
                <p className="p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-xl text-slate-700 leading-relaxed text-xs">
                  {selectedLead.notes || 'No counseling notes recorded yet.'}
                </p>
              </div>

              {selectedLead.status !== 'ENROLLED' && (
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      onUpdateLeadStatus(selectedLead.id, 'ENROLLED');
                      setSelectedLead(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
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
