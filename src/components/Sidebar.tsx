import React from 'react';
import { 
  UserPlus, 
  BookOpen, 
  ShieldCheck, 
  Lock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { UserRole, TabType } from '../types';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userRole: UserRole;
  activeLeadsCount?: number;
  coursesCount?: number;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description: string;
  tip: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  activeLeadsCount = 6,
  coursesCount = 4
}) => {
  const isStudent = userRole === 'STUDENT';

  const navItems: NavItem[] = [
    ...(isStudent ? [] : [
      {
        id: 'admissions' as TabType,
        label: '1. Admissions & Payments',
        icon: UserPlus,
        badge: `${activeLeadsCount} Applicants`,
        description: 'Payment status & 1-month timers',
        tip: 'Click here to view applicants and mark Paid/Unpaid'
      }
    ]),
    {
      id: 'courses' as TabType,
      label: isStudent ? 'My Course Books & Safe' : '2. Courses & Material Safe',
      icon: BookOpen,
      badge: 'Protected Safe',
      description: 'Encrypted PDFs & Study Notes',
      tip: 'Click here to read or manage course materials'
    }
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r-2 border-slate-800 flex flex-col justify-between shrink-0 select-none min-h-[calc(100vh-4.75rem)] p-4 text-white">
      <div className="space-y-6">
        
        {/* Simple Senior-friendly Helper Banner */}
        <div className="p-4 bg-emerald-950/80 rounded-2xl border-2 border-emerald-500/50 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
              Digital Safe Active
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Course files are protected in the safe. Students get <strong className="text-white underline">1 month of access</strong> after fee is marked Paid.
          </p>
        </div>

        {/* Core Navigation Items */}
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-3">
            Select a Section:
          </div>

          <nav className="space-y-3" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title={item.tip}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-start gap-3.5 p-4 rounded-2xl text-left transition-all border-2 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 border-emerald-400 text-white font-bold shadow-xl shadow-emerald-950/50 ring-4 ring-emerald-500/30'
                      : 'bg-slate-800/90 border-slate-700/80 text-slate-200 hover:bg-slate-700/80 hover:border-slate-500'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isActive ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-emerald-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-sm font-extrabold leading-snug">{item.label}</div>
                      {item.badge && (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isActive 
                            ? 'bg-emerald-800 text-white' 
                            : 'bg-slate-900 text-emerald-300 border border-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className={`text-xs mt-1 leading-snug ${isActive ? 'text-emerald-100' : 'text-slate-400 font-medium'}`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Instructions for elderly users */}
        <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/70 text-xs text-slate-300 space-y-1.5">
          <div className="font-bold text-white flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Need Help?</span>
          </div>
          <p className="text-[12px] text-slate-400 leading-normal">
            Use the <strong>Text Size</strong> button at the top to make words bigger if needed.
          </p>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Sriyam School Safe</span>
        </span>
        <span className="font-mono text-xs text-slate-400 font-bold">2026</span>
      </div>
    </aside>
  );
};
