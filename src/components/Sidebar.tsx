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

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description: string;
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
        label: 'Admissions',
        icon: UserPlus,
        badge: `${activeLeadsCount} Applicants`,
        description: 'Payment status & 1-month safe timers'
      }
    ]),
    {
      id: 'courses' as TabType,
      label: isStudent ? 'My Course Materials' : 'Courses & Safe',
      icon: BookOpen,
      badge: 'AES-256 Safe',
      description: 'Proprietary PDF safe & access DRM'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Safe status indicator */}
        <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Hardware Safe Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Digital course repository. Download restricted exclusively to Super Admin.
          </p>
        </div>

        {/* Core Navigation Items (Strictly Admissions & Courses) */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Main Management
          </div>

          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-700/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs leading-none">{item.label}</div>
                      <div className={`text-[10px] mt-1 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-emerald-700 text-emerald-100' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sriyam Safe DRM</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">v2.5</span>
        </div>
      </div>
    </aside>
  );
};
