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
  FileCheck,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Lead } from '../types';

interface LeadPipelineViewProps {
  leads: Lead[];
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onUpdateLeadStatus: (leadId: string, nextStatus: Lead['status']) => void;
  onDeleteLead?: (leadId: string) => void;
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
  onAddLead,
  onUpdateLeadStatus,
  onDeleteLead
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // New lead form state
  const [formData, setFormData] = useState({
    studentName: '',
    guardianName: '',
    email: '',
    phone: '',
    gradeApplying: 'Grade 11 (Science)',
    status: 'NEW_INQUIRY' as Lead['status'],
    source: 'WEBSITE' as Lead['source'],
    lastContacted: 'Today',
    notes: '',
    priority: 'HIGH' as Lead['priority']
  });

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm);
    const matchesGrade = selectedGrade === 'ALL' || l.gradeApplying.includes(selectedGrade);
    return matchesSearch && matchesGrade;
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
      gradeApplying: 'Grade 11 (Science)',
      status: 'NEW_INQUIRY',
      source: 'WEBSITE',
      lastContacted: 'Today',
      notes: '',
      priority: 'HIGH'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Admissions & Lead Management CRM</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {leads.length} Active Applicants
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track inquiries, parent campus tours, evaluation tests, and conversion into enrolled students.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Admission Inquiry</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student, parent, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Filter Grade:</span>
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

      {/* Kanban Pipeline Board */}
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
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition cursor-pointer group"
                    >
                      {/* Priority Tag, Grade & Quick Delete */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
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

                        {/* Top corner quick delete */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLeadToDelete(lead);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Client"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Student & Guardian */}
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {lead.studentName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mb-2">
                        Guardian: {lead.guardianName}
                      </p>

                      {/* Contact Badges */}
                      <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                      </div>

                      {/* Actions Footer: Delete & Move Stage */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLeadToDelete(lead);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition shadow-xs"
                          title="Delete Client / Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete</span>
                        </button>

                        {lead.status !== 'ENROLLED' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIndex = STAGES.findIndex(s => s.id === lead.status);
                              if (currentIndex < STAGES.length - 1) {
                                onUpdateLeadStatus(lead.id, STAGES[currentIndex + 1].id);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition"
                          >
                            <span>Move Stage</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Register New Admission Inquiry</span>
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
                    placeholder="parent@example.com"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

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
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11 (Science-PCM)">Grade 11 (Science-PCM)</option>
                    <option value="Grade 11 (Science-PCB)">Grade 11 (Science-PCB)</option>
                    <option value="Grade 11 (Commerce)">Grade 11 (Commerce)</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Lead Source
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="WEBSITE">Website Form</option>
                    <option value="WALK_IN">Direct Campus Walk-In</option>
                    <option value="REFERRAL">Parent / Alumni Referral</option>
                    <option value="EDUCATION_FAIR">Education Expo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Counselor Notes & Inquiries
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes from first counseling call, previous school, syllabus queries..."
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
                  Save Lead
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
                  <span className="text-slate-400">Current Pipeline Stage:</span>
                  <span className="font-bold text-emerald-700">{selectedLead.status}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Counselor Discussion Notes</h4>
                <p className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-slate-700 leading-relaxed">
                  {selectedLead.notes || 'No counseling notes recorded yet.'}
                </p>
              </div>

              {/* Action Buttons: Delete and Admission Conversion */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLeadToDelete(selectedLead);
                    setSelectedLead(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl font-bold text-xs border border-rose-300 transition shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Delete Client</span>
                </button>

                {selectedLead.status !== 'ENROLLED' && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateLeadStatus(selectedLead.id, 'ENROLLED');
                      setSelectedLead(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md transition ml-auto"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Admission & Create Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {leadToDelete && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-lead-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 id="delete-lead-title" className="text-base font-bold text-slate-900">
                  Delete Client Record?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to delete the admission lead for <strong className="text-slate-800">{leadToDelete.studentName}</strong> (Guardian: {leadToDelete.guardianName})?
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-xs mb-5 space-y-1">
              <div><strong>Grade Applying:</strong> {leadToDelete.gradeApplying}</div>
              <div><strong>Contact:</strong> {leadToDelete.phone} • {leadToDelete.email}</div>
              <div><strong>Current Stage:</strong> {leadToDelete.status.replace('_', ' ')}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                autoFocus
                onClick={() => setLeadToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteLead) {
                    onDeleteLead(leadToDelete.id);
                  }
                  setLeadToDelete(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-700/20 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Client</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

