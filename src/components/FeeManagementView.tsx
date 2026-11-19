import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Plus, 
  Download,
  IndianRupee,
  Check
} from 'lucide-react';
import { FeeInvoice, UserSession } from '../types';

interface FeeManagementViewProps {
  fees: FeeInvoice[];
  currentUser: UserSession;
  onRecordPayment?: (invoiceId: string) => void;
}

export const FeeManagementView: React.FC<FeeManagementViewProps> = ({
  fees,
  currentUser,
  onRecordPayment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const isStudent = currentUser.role === 'STUDENT';
  const studentRoll = currentUser.studentDetails?.rollNo;

  const visibleFees = fees.filter(f => {
    if (isStudent && studentRoll) {
      if (f.rollNo !== studentRoll) return false;
    }
    const matchesSearch = 
      f.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.receiptNo && f.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = fees.filter(f => f.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = fees.filter(f => f.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOverdue = fees.filter(f => f.status === 'OVERDUE').reduce((acc, curr) => acc + curr.amount, 0);

  const handleDownloadReceipt = (receiptNo?: string) => {
    if (!receiptNo) return;
    setDownloadSuccess(receiptNo);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{isStudent ? 'My Fee Invoices & Payment Receipts' : 'Fee Collection & Invoicing'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isStudent 
              ? 'View term tuition fee dues, payment history, and download official fee receipts.' 
              : 'Monitor fee collection, pending dues by grade, and issue payment reconciliations.'}
          </p>
        </div>
      </div>

      {/* Financial Summary Cards for Admin */}
      {!isStudent && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Collected</p>
              <h3 className="text-xl font-extrabold text-emerald-700 mt-1">
                ₹{totalCollected.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Dues</p>
              <h3 className="text-xl font-extrabold text-amber-700 mt-1">
                ₹{totalPending.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Overdue Defaulters</p>
              <h3 className="text-xl font-extrabold text-rose-700 mt-1">
                ₹{totalOverdue.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student, roll number, receipt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Invoices</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Student & Roll No</th>
                <th className="py-3.5 px-4">Term & Grade</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleFees.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{inv.studentName}</div>
                    <div className="text-[11px] font-mono text-slate-400">{inv.rollNo}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{inv.term}</div>
                    <div className="text-[11px] text-slate-400">{inv.grade}</div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    ₹{inv.amount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {inv.dueDate}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {inv.status === 'PAID' && inv.receiptNo ? (
                      <button
                        onClick={() => handleDownloadReceipt(inv.receiptNo)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[11px] font-semibold transition shadow-sm"
                      >
                        {downloadSuccess === inv.receiptNo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{downloadSuccess === inv.receiptNo ? 'Receipt Generated' : inv.receiptNo}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">
                        Payment Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

