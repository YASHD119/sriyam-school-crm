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
  BookOpen,
  Award,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { UserSession } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface LoginPageProps {
  onLoginSuccess: (user: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  // Empty inputs by default - no prefilled or displayed passwords
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setErrorMessage('Invalid username or password. Please verify your credentials and try again.');
    }, 450);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-slate-50">
      
      {/* Left Column: Full-Height Institutional Showcase */}
      <div className="lg:w-1/2 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 p-8 sm:p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden">
        
        {/* Subtle geometric pattern & ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header / School Crest */}
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-xl shadow-emerald-950/40 ring-4 ring-emerald-400/20 flex items-center justify-center overflow-hidden">
              <img 
                src="/sriyam-logo.jpg" 
                alt="Sriyam School Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-white tracking-wider text-xl leading-none block">
                SRIYAM
              </span>
              <span className="text-xs text-emerald-300 font-semibold tracking-widest uppercase">
                School & Junior College
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/40 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authorized Institutional Portal</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Excellence in Education,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100">
              Integrity in Character.
            </span>
          </h2>

          <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
            Welcome to the centralized management system of Sriyam School. Access student records, admissions pipeline, fee reconciliation, and confidential curriculum materials under enforced DRM security.
          </p>
        </div>

        {/* Key Features List */}
        <div className="relative z-10 my-8 space-y-4 max-w-md">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Protected Curriculum Vault</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Proprietary study materials rendered live with dynamic forensic student watermarks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Complete School CRM & SIS</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                From initial admission inquiry and student enrollment to fee invoices and attendance.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-6 border-t border-emerald-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Est. 2004 • CBSE & State Board Affiliated</span>
          <span>Security Protocol: TLS 1.3</span>
        </div>
      </div>

      {/* Right Column: Full-Height Clean Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <img 
                  src="/sriyam-logo.jpg" 
                  alt="Sriyam Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-none block">
                  SRIYAM SCHOOL
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Academic Portal & CRM
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Sriyam Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Enter your institutional credentials below to access your account.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div 
              role="alert"
              aria-live="polite"
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Username or Roll Number
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
                  placeholder="Enter your username or roll number"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Password
              </label>
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
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
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

            {/* Remember Me & Help */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 border-slate-300"
                />
                <span>Keep me signed in</span>
              </label>

              <span className="text-slate-400 text-[11px]">
                Protected Session
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-base shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-2 transition disabled:opacity-60 border-2 border-emerald-800 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Senior-Friendly Quick 1-Click Login Assist */}
          <div className="pt-4 border-t-2 border-slate-200">
            <div className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2.5">
              Quick 1-Click Login (Easy Testing):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onLoginSuccess(INITIAL_USERS[0])}
                className="p-3.5 bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 text-purple-950 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                title="Log in directly as Dr. V. R. Sharma (Admin)"
              >
                <span>🔑 Log in as Admin</span>
              </button>
              <button
                type="button"
                onClick={() => onLoginSuccess(INITIAL_USERS[2])}
                className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                title="Log in directly as Aarav Sharma (Student)"
              >
                <span>🎓 Log in as Student</span>
              </button>
            </div>
          </div>

          {/* Security & Access Advisory */}
          <div className="pt-4 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Security Notice</span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                Access is restricted to authorized Sriyam School personnel and enrolled students with active 1-month payment authorization.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
