import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Bell, 
  UserPlus, 
  Users, 
  BookOpen, 
  FileText, 
  FileQuestion, 
  FileCheck, 
  Video, 
  UserCheck, 
  CreditCard, 
  BarChart3, 
  ShieldCheck, 
  Lock, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../types';

export type TabType = 
  | 'overview' 
  | 'calendar' 
  | 'leads' 
  | 'students' 
  | 'courses' 
  | 'vault' 
  | 'questions' 
  | 'assignments' 
  | 'liveclasses' 
  | 'attendance' 
  | 'fees' 
  | 'notices' 
  | 'audit' 
  | 'analytics' 
  | 'schedule';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userRole: UserRole;
  documentsCount: number;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
  highlight?: boolean;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  documentsCount
}) => {
  const isStudent = userRole === 'STUDENT';

  // Grouped Navigation matching admin-lms.edulateral.com
  const adminGroups: NavGroup[] = [
    {
      groupName: 'Overview',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
        { id: 'notices', label: 'Notifications', icon: Bell },
      ]
    },
    {
      groupName: 'Institutional Structure',
      items: [
        { id: 'leads', label: 'Admissions & CRM', icon: UserPlus, badge: '5 Active' },
        { id: 'students', label: 'User Directory & SIS', icon: Users },
      ]
    },
    {
      groupName: 'Academics',
      items: [
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'vault', label: 'Reference Materials', icon: FileText, count: documentsCount },
      ]
    },
    {
      groupName: 'Assessments',
      items: [
        { id: 'questions', label: 'Question Bank', icon: FileQuestion },
        { id: 'assignments', label: 'Assignments', icon: FileCheck },
      ]
    },
    {
      groupName: 'Engagement & Live',
      items: [
        { id: 'liveclasses', label: 'Live Classes', icon: Video, badge: 'Live' },
        { id: 'attendance', label: 'Attendance', icon: UserCheck },
      ]
    },
    {
      groupName: 'Finance & Analytics',
      items: [
        { id: 'fees', label: 'Fees & Invoicing', icon: CreditCard },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'audit', label: 'Security & DRM Audit', icon: ShieldCheck, highlight: true },
      ]
    }
  ];

  const studentGroups: NavGroup[] = [
    {
      groupName: 'My Academics',
      items: [
        { id: 'overview', label: 'My Dashboard', icon: LayoutDashboard },
        { id: 'courses', label: 'Enrolled Courses', icon: BookOpen },
        { 
          id: 'vault', 
          label: 'Protected Study Notes', 
          icon: FileText, 
          badge: 'DRM Shield',
          count: documentsCount 
        },
      ]
    },
    {
      groupName: 'Assessments',
      items: [
        { id: 'assignments', label: 'Course Assignments', icon: FileCheck },
        { id: 'questions', label: 'Practice Question Bank', icon: FileQuestion },
      ]
    },
    {
      groupName: 'Live & Schedule',
      items: [
        { id: 'liveclasses', label: 'Live Virtual Lectures', icon: Video, badge: 'Live' },
        { id: 'attendance', label: 'My Attendance', icon: UserCheck },
        { id: 'schedule', label: 'Timetable & Exams', icon: CalendarIcon },
        { id: 'calendar', label: 'Academic Calendar', icon: CalendarIcon },
      ]
    },
    {
      groupName: 'Finance & Notices',
      items: [
        { id: 'fees', label: 'My Fee Invoices', icon: CreditCard },
        { id: 'notices', label: 'School Circulars', icon: Bell },
      ]
    }
  ];

  const groups = isStudent ? studentGroups : adminGroups;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-3 select-none">
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)] pr-1">
        
        {/* Role Scope Notice */}
        <div className={`p-3 rounded-xl border text-xs ${
          isStudent 
            ? 'bg-amber-950/40 border-amber-500/30 text-amber-200' 
            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
        }`}>
          <div className="flex items-center gap-1.5 font-bold mb-0.5">
            {isStudent ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isStudent ? 'Student Read-Only Portal' : 'Edulateral-Aligned LMS'}</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {isStudent 
              ? 'Canvas vector rendering active. Document download and screenshots disabled.' 
              : 'Enterprise Multi-Tenant Learning Management & School CRM.'}
          </p>
        </div>

        {/* Grouped Navigation */}
        <div className="space-y-4">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {/* Group Header */}
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>{group.groupName}</span>
              </div>

              {/* Group Items */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                        active
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition ${
                          active 
                            ? 'text-white' 
                            : item.highlight 
                              ? 'text-emerald-400' 
                              : 'text-slate-400 group-hover:text-slate-200'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                            item.badge === 'Live'
                              ? 'bg-rose-500 text-white animate-pulse'
                              : active 
                                ? 'bg-white/20 text-white' 
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.count !== undefined && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            active ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.count}
                          </span>
                        )}
                        {active && <ChevronRight className="w-3 h-3 text-white/80" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info with Official Sriyam Logo */}
      <div className="pt-3 border-t border-slate-800 flex items-center gap-2.5 px-2">
        <img 
          src="/sriyam-logo.jpg" 
          alt="Sriyam Logo" 
          className="w-7 h-7 rounded-lg object-contain border border-slate-700 p-0.5 shrink-0 bg-white"
        />
        <div className="text-left">
          <div className="text-[11px] font-bold text-slate-200 leading-tight">
            Sriyam School LMS
          </div>
          <div className="text-[10px] text-slate-400">
            LMS Platform v2.4
          </div>
        </div>
      </div>
    </aside>
  );
};
