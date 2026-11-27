import React, { useState } from 'react';
import { 
  Shield, 
  ChevronDown, 
  LogOut,
  UserPlus,
  BookOpen,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserSession, TabType } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface NavbarProps {
  currentUser: UserSession;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onSwitchUser: (user: UserSession) => void;
  onLogout?: () => void;
  activeLeadsCount?: number;
  coursesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onSwitchUser,
  onLogout,
  activeLeadsCount = 6,
  coursesCount = 4
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const isStudent = currentUser.role === 'STUDENT';
  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden ring-1 ring-emerald-500/20">
            <img 
              src="/sriyam-logo.jpg" 
              alt="Sriyam Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base leading-none">
                SRIYAM
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                Safe
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Course Material Safe & Admissions
            </p>
          </div>
        </div>

        {/* Center: Main Navigation Tabs (Clean, Intuitive Pills) */}
        <nav className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          {!isStudent && (
            <button
              onClick={() => onSelectTab('admissions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'admissions'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admissions</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                currentTab === 'admissions' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {activeLeadsCount}
              </span>
            </button>
          )}

          <button
            onClick={() => onSelectTab('courses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'courses'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isStudent ? 'My Courses' : 'Courses & Safe'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              currentTab === 'courses' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
            }`}>
              {coursesCount}
            </span>
          </button>
        </nav>

        {/* Right: Role Switcher & User Menu */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition"
              title="Switch demo account (Admin vs Student)"
            >
              <span className="text-slate-400">Role:</span>
              <span className={`font-semibold ${
                currentUser.role === 'ADMIN' ? 'text-purple-700' :
                currentUser.role === 'TEACHER' ? 'text-blue-700' : 'text-emerald-700'
              }`}>
                {currentUser.role === 'ADMIN' ? 'Admin' : currentUser.role === 'TEACHER' ? 'Teacher' : 'Student'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setShowRoleDropdown(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Test User
                  </span>
                </div>

                <div className="py-1">
                  {INITIAL_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 transition ${
                        currentUser.id === user.id ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={user.avatarUrl} 
                          alt={user.name} 
                          className="w-7 h-7 rounded-full object-cover border border-slate-200" 
                        />
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {user.role === 'STUDENT' ? user.studentDetails?.grade : user.role}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'TEACHER' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile & Logout */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500">
                {isStudent ? currentUser.studentDetails?.rollNo : currentUser.role}
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition ml-1"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
