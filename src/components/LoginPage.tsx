import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Fingerprint,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { UserSession } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface LoginPageProps {
  onLoginSuccess: (user: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoleHint, setSelectedRoleHint] = useState<'ADMIN' | 'STUDENT'>('ADMIN');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = password.trim();

      // 1. Admin login: username "admin", password "admin123"
      if (trimmedUser === 'admin' && trimmedPass === 'admin123') {
        setIsLoading(false);
        onLoginSuccess(INITIAL_USERS[0]); // Dr. V. R. Sharma (Admin)
        return;
      }

      // 2. Teacher login: username "teacher", password "teacher123" or "admin123"
      if (trimmedUser === 'teacher' && (trimmedPass === 'teacher123' || trimmedPass === 'admin123')) {
        setIsLoading(false);
        onLoginSuccess(INITIAL_USERS[1]); // Prof. Sunita Nair (Teacher)
        return;
      }

      // 3. Student logins: username "student" or roll number "sri-2026-1042" or "aarav"
      if (
        (trimmedUser === 'student' || trimmedUser === 'sri-2026-1042' || trimmedUser === 'aarav') &&
        (trimmedPass === 'student123' || trimmedPass === 'admin123')
      ) {
        setIsLoading(false);
        onLoginSuccess(INITIAL_USERS[2]); // Aarav Sharma (Student)
        return;
      }

      // 4. Student 2: "riya" or "sri-2026-1208"
      if (
        (trimmedUser === 'riya' || trimmedUser === 'sri-2026-1208') &&
        (trimmedPass === 'student123' || trimmedPass === 'admin123')
      ) {
        setIsLoading(false);
        onLoginSuccess(INITIAL_USERS[3]); // Riya Patel (Student)
        return;
      }

      // Failed authentication
      setIsLoading(false);
      setErrorMessage('Invalid username or password. Please check your credentials.');
    }, 400);
  };

  const fillCredentials = (type: 'ADMIN' | 'STUDENT') => {
    setErrorMessage(null);
    setSelectedRoleHint(type);
    if (type === 'ADMIN') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('student');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Background Decorative Lighting & Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Card Header with Crest */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 p-7 text-center text-white relative">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shadow-xl mb-3 ring-4 ring-emerald-500/20">
            <GraduationCap className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-extrabold tracking-tight">
            SRIYAM SCHOOL & JUNIOR COLLEGE
          </h1>
          <p className="text-xs text-emerald-200/80 font-medium mt-1">
            Enterprise CRM & Secure Student Learning Portal
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-semibold text-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Document DRM Sentinel</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-7 space-y-5">
          
          {/* Quick Demo Switcher Pills */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Quick Demo Autofill:</span>
              <span className="text-[10px] text-emerald-700 font-semibold">1-Click to Test</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('ADMIN')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  selectedRoleHint === 'ADMIN'
                    ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin (admin / admin123)</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('STUDENT')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  selectedRoleHint === 'STUDENT'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Student (Read-Only)</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div 
              role="alert"
              aria-live="polite"
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label 
                htmlFor="username"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Username or Student Roll Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin or SRI-2026-1042"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-700"
                >
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Default: <code className="font-mono text-emerald-700 font-bold">admin123</code>
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Protection Notice */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span>Remember session</span>
              </label>

              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>SSL Encrypted</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Sriyam Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Student Policy Notice */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-left space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Fingerprint className="w-3.5 h-3.5 text-amber-600" />
                <span>Student Content Protection Notice</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Student logins have strict <strong>read-only</strong> access. All accessed study materials are dynamically watermarked with the student's name, roll number, and IP address.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Branding */}
      <div className="mt-6 text-center text-xs text-slate-400 space-y-1 z-10">
        <div>Sriyam School & Junior College • Academic Management System v2.4</div>
        <div className="text-[11px] text-slate-500">Authorized Personnel & Enrolled Students Only</div>
      </div>

    </div>
  );
};
