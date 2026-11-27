import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ChevronDown, 
  LogOut,
  Lock,
  Layers,
  Eye,
  Type,
  Sun
} from 'lucide-react';
import { UserSession } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { useAccessibility } from '../context/AccessibilityContext';

interface NavbarProps {
  currentUser: UserSession;
  onSwitchUser: (user: UserSession) => void;
  onLogout?: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  onLogout
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const isStudent = currentUser.role === 'STUDENT';
  const { textScale, setTextScale, highContrast, toggleHighContrast } = useAccessibility();

  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[4.75rem] py-2 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Crest */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-white p-1 border-2 border-slate-300 shadow-sm flex items-center justify-center overflow-hidden ring-2 ring-emerald-500/20 shrink-0">
            <img 
              src="/sriyam-logo.jpg" 
              alt="Sriyam Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-xl leading-none">
                SRIYAM
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase tracking-wider">
                Admissions & Course Safe
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              School & Junior College Safe Repository
            </p>
          </div>
        </div>

        {/* Accessibility Toolbar (Senior & Elder friendly controls) */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-300">
          <div className="flex items-center gap-1 px-2 text-xs font-bold text-slate-700">
            <Type className="w-4 h-4 text-emerald-700" />
            <span className="hidden md:inline">Text Size:</span>
          </div>

          <button
            onClick={() => setTextScale('normal')}
            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition ${
              textScale === 'normal' 
                ? 'bg-emerald-700 text-white shadow' 
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
            title="Regular text size"
            aria-label="Regular text size"
          >
            A
          </button>

          <button
            onClick={() => setTextScale('large')}
            className={`px-2.5 py-1 rounded-lg text-sm font-extrabold transition ${
              textScale === 'large' 
                ? 'bg-emerald-700 text-white shadow' 
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
            title="Large text size (Senior friendly)"
            aria-label="Large text size"
          >
            A+
          </button>

          <button
            onClick={() => setTextScale('huge')}
            className={`px-2.5 py-1 rounded-lg text-base font-extrabold transition ${
              textScale === 'huge' 
                ? 'bg-emerald-700 text-white shadow' 
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
            title="Extra large text size (Easiest to read)"
            aria-label="Extra large text size"
          >
            A++
          </button>

          <div className="h-5 w-px bg-slate-300 mx-1" />

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition border ${
              highContrast 
                ? 'bg-slate-900 text-yellow-300 border-yellow-400' 
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
            title="Toggle High Contrast for clearer viewing"
            aria-label="Toggle High Contrast mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{highContrast ? 'High Contrast ON' : 'High Contrast'}</span>
          </button>
        </div>

        {/* Right Section: Role Switcher & Profile & Logout */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50 text-xs font-bold text-slate-800 transition shadow-sm"
              title="Click here to switch demo account (Admin vs Student)"
            >
              <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Role:</span>
              <span className={`px-2 py-0.5 rounded-md font-extrabold ${
                currentUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-900' :
                currentUser.role === 'TEACHER' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
              }`}>
                {currentUser.role === 'ADMIN' ? 'Admin' : currentUser.role === 'TEACHER' ? 'Teacher' : 'Student'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {showRoleDropdown && (
              <div 
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border-2 border-slate-300 py-3 z-40 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setShowRoleDropdown(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Switch User Account
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Select a persona to test how permissions and safe access work:
                  </p>
                </div>

                <div className="py-1 px-2 space-y-1">
                  {INITIAL_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs hover:bg-emerald-50 transition border ${
                        currentUser.id === user.id ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950' : 'border-transparent text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatarUrl} 
                          alt={user.name} 
                          className="w-9 h-9 rounded-full object-cover border-2 border-slate-300" 
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm leading-snug">{user.name}</div>
                          <div className="text-xs text-slate-500">
                            {user.role === 'STUDENT' ? `${user.studentDetails?.grade} (${user.studentDetails?.rollNo})` : user.email}
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-900' :
                        user.role === 'TEACHER' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {user.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current User Pill */}
          <div className="flex items-center space-x-2.5 pl-2 border-l-2 border-slate-200">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
            />
            <div className="hidden lg:block text-left">
              <div className="text-sm font-extrabold text-slate-900 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-xs font-medium text-slate-500">
                {isStudent ? currentUser.studentDetails?.rollNo : currentUser.role}
              </div>
            </div>

            {/* Senior-friendly Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold transition shadow-sm"
                title="Click to sign out safely"
                aria-label="Sign out of the system"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
