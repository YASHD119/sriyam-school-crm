import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  PieChart, 
  Percent, 
  Calendar,
  CreditCard
} from 'lucide-react';
import { Course, StudentRecord, FeeInvoice } from '../types';

interface AnalyticsViewProps {
  courses: Course[];
  students: StudentRecord[];
  fees: FeeInvoice[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  courses,
  students,
  fees
}) => {
  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + s.attendance, 0) / (students.length || 1)
  );
  const totalCollected = fees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);
  const totalBilled = fees.reduce((sum, f) => sum + f.amount, 0);
  const collectionRate = Math.round((totalCollected / (totalBilled || 1)) * 100);

  const departments = [
    { name: 'Physical Sciences', courses: 2, enrolled: 142, avgScore: '91.4%', completion: '88%' },
    { name: 'Mathematical Sciences', courses: 1, enrolled: 168, avgScore: '89.2%', completion: '92%' },
    { name: 'Chemical Sciences', courses: 1, enrolled: 118, avgScore: '86.7%', completion: '84%' },
    { name: 'Biological Sciences', courses: 1, enrolled: 94, avgScore: '93.1%', completion: '90%' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Institutional Analytics & Academic KPI Dashboard</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Real-time Telemetry
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Holistic metrics covering student academic attainment, attendance retention, course completion, and institutional fee recovery.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Attendance</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{avgAttendance}%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2.4% vs last term</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pass Attainment Rate</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">96.8%</h3>
          <p className="text-xs text-blue-600 font-medium mt-1">
            Board mock examinations
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Curriculum Offerings</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{courses.length} Active</h3>
          <p className="text-xs text-purple-600 font-medium mt-1">
            Across 4 departments
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fee Collection</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{collectionRate}%</h3>
          <p className="text-xs text-amber-600 font-medium mt-1">
            ₹{totalCollected.toLocaleString('en-IN')} reconciled
          </p>
        </div>
      </div>

      {/* Departmental Performance Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <span>Departmental Attainment & Completion Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Academic Department</th>
                <th className="py-3 px-4">Active Courses</th>
                <th className="py-3 px-4">Total Students</th>
                <th className="py-3 px-4">Average Score</th>
                <th className="py-3 px-4 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {dept.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {dept.courses} Courses
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {dept.enrolled}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">
                    {dept.avgScore}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {dept.completion}
                    </span>
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
