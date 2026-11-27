import React from 'react';
import { 
  UserPlus, 
  BookOpen, 
  ShieldCheck, 
  Lock,
  Sparkles
} from 'lucide-react';
import { UserRole, TabType } from '../types';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userRole: UserRole;
  activeLeadsCount?: number;
  coursesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  activeLeadsCount = 6,
  coursesCount = 4
}) => {
  const isStudent = userRole === 'STUDENT';

  return (
    <aside className="w-56 bg-white border-r border-slate-200 shrink-0 select-none p-3 hidden md:flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        
        {/* Navigation list */}
        <div className="space-y-1">
          {!isStudent && (
            <button
              onClick={() => onSelectTab('admissions')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'admissions'
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserPlus className={`w-4 h-4 ${currentTab === 'admissions' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Admissions</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                currentTab === 'admissions' ? 'bg-emerald-200/60 text-emerald-900' : 'bg-slate-100 text-slate-500'
              }`}>
                {activeLeadsCount}
              </span>
            </button>
          )}

          <button
            onClick={() => onSelectTab('courses')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              currentTab === 'courses'
                ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className={`w-4 h-4 ${currentTab === 'courses' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isStudent ? 'My Courses' : 'Courses & Safe'}</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
              currentTab === 'courses' ? 'bg-emerald-200/60 text-emerald-900' : 'bg-slate-100 text-slate-500'
            }`}>
              {coursesCount}
            </span>
          </button>
        </div>

        {/* Safe Info Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Safe Rule</span>
          </div>
          <p className="leading-snug text-slate-500">
            Admissions marked as <strong>PAID</strong> receive exactly <strong>1 month</strong> of course access. Downloads restricted to Admin only.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between font-mono">
        <span>SRIYAM SAFE</span>
        <span>v2.5</span>
      </div>
    </aside>
  );
};
