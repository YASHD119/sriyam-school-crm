import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  FileText, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  BookOpen, 
  Calendar,
  Lock,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';

export type TabType = 
  | 'overview' 
  | 'leads' 
  | 'students' 
  | 'vault' 
  | 'fees' 
  | 'notices' 
  | 'audit'
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

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  documentsCount
}) => {
  const isStudent = userRole === 'STUDENT';

  const adminNavItems: NavItem[] = [
    { id: 'overview' as TabType, label: 'CRM Dashboard', icon: LayoutDashboard },
    { id: 'leads' as TabType, label: 'Admissions & Leads', icon: UserPlus, badge: '5 Active' },
    { id: 'students' as TabType, label: 'Student Directory (SIS)', icon: Users },
    { id: 'vault' as TabType, label: 'Curriculum & Doc Vault', icon: FileText, count: documentsCount },
    { id: 'fees' as TabType, label: 'Fees & Invoicing', icon: CreditCard },
    { id: 'notices' as TabType, label: 'Circulars & Notices', icon: Bell },
    { id: 'audit' as TabType, label: 'Security & DRM Audit', icon: ShieldCheck, highlight: true },
  ];

  const studentNavItems: NavItem[] = [
    { id: 'overview' as TabType, label: 'My Academic Dashboard', icon: LayoutDashboard },
    { 
      id: 'vault' as TabType, 
      label: 'Protected Study Notes', 
      icon: BookOpen, 
      badge: 'Read-Only DRM',
      count: documentsCount 
    },
    { id: 'schedule' as TabType, label: 'Timetable & Exams', icon: Calendar },
    { id: 'fees' as TabType, label: 'My Fee Invoices', icon: CreditCard },
    { id: 'notices' as TabType, label: 'School Circulars', icon: Bell },
  ];

  const items = isStudent ? studentNavItems : adminNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div className="space-y-6">
        
        {/* Role Scope Notice */}
        <div className={`p-3 rounded-xl border text-xs ${
          isStudent 
            ? 'bg-amber-50/70 border-amber-200/80 text-amber-900' 
            : 'bg-emerald-50/50 border-emerald-200/70 text-emerald-950'
        }`}>
          <div className="flex items-center gap-1.5 font-bold mb-1">
            {isStudent ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />}
            <span>{isStudent ? 'Student Read-Only Portal' : 'Admin & Staff ERP'}</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            {isStudent 
              ? 'Documents are rendered on secure canvas. Saving, downloading, and printing are disabled.' 
              : 'Full school administration: manage leads, student records, fee collection, and content DRM.'}
          </p>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
            Navigation Menu
          </div>

          {items.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition ${
                    active ? 'text-white' : item.highlight ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      active ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      active ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.count}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3 h-3 text-white/80" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
        <img 
          src="/sriyam-logo.jpg" 
          alt="Sriyam Logo" 
          className="w-7 h-7 rounded-lg object-contain border border-slate-200 p-0.5 shrink-0 bg-white shadow-sm"
        />
        <div className="text-left">
          <div className="text-[11px] font-bold text-slate-700 leading-tight">
            Sriyam Educational Trust
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Academic Year 2026-27
          </div>
        </div>
      </div>
    </aside>
  );
};
