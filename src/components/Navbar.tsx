import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Bell, 
  ChevronDown, 
  UserCheck, 
  Sparkles,
  LogOut,
  Lock,
  Layers
} from 'lucide-react';
import { UserSession } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface NavbarProps {
  currentUser: UserSession;
  onSwitchUser: (user: UserSession) => void;
  onLogout?: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  onLogout,
  unreadCount = 2
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const isStudent = currentUser.role === 'STUDENT';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Crest */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden ring-2 ring-emerald-500/20">
            <img 
              src="/sriyam-logo.jpg" 
              alt="Sriyam Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-none">
                SRIYAM
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60 uppercase tracking-wider">
                Admissions & Course Safe
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              School & Junior College Safe Repository
            </p>
          </div>
        </div>

        {/* Center: Security Badge if Student */}
        {isStudent ? (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium animate-pulse">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Strict Read-Only Mode • Download & Screenshot Protection Active</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Staff Administrative Console • Full Access</span>
          </div>
        )}

        {/* Right Section: Role Switcher & Profile */}
        <div className="flex items-center space-x-4">
          
          {/* Quick Role Switcher (Crucial for testing/demoing student read-only view vs admin) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-xs font-medium text-slate-700 transition"
              title="Switch demo account to test student vs admin permissions"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Role:</span>
              <span className={`font-semibold ${
                currentUser.role === 'ADMIN' ? 'text-purple-700' :
                currentUser.role === 'TEACHER' ? 'text-blue-700' : 'text-emerald-700'
              }`}>
                {currentUser.role === 'ADMIN' ? 'Admin' : currentUser.role === 'TEACHER' ? 'Teacher' : 'Student'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setShowRoleDropdown(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Test Persona
                  </p>
                  <p className="text-xs text-slate-500">
                    Test how permissions change between Admin and Read-Only Student
                  </p>
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
                        currentUser.id === user.id ? 'bg-emerald-50/60 font-semibold text-emerald-900' : 'text-slate-700'
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
                          <div className="text-[11px] text-slate-400">
                            {user.role === 'STUDENT' ? `${user.studentDetails?.grade} (${user.studentDetails?.rollNo})` : user.email}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
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

          {/* Current User Pill */}
          <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500">
                {isStudent ? currentUser.studentDetails?.rollNo : currentUser.role}
              </div>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 ml-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Sign Out"
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

