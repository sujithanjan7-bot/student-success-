import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  BookOpen, 
  Users, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { AuthUser, UserRole } from '../types/student';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  onBrowseGuest: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBrowseGuest }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('faculty@campus.edu.in');
  const [signInPassword, setSignInPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('Faculty');
  const [signUpDept, setSignUpDept] = useState('Computer Science');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signInEmail || !signInPassword) {
      setErrorMessage('Please enter both your mail ID and password.');
      return;
    }

    // Determine role based on email or default to Faculty/Admin
    let role: UserRole = 'Faculty';
    let name = 'Prof. Faculty Advisor';

    const lower = signInEmail.toLowerCase();
    if (lower.includes('admin') || lower.includes('dean')) {
      role = 'Administrator';
      name = 'Dr. Aris Thorne (Dean)';
    } else if (lower.includes('placement')) {
      role = 'Placement Officer';
      name = 'Sunita Rao (Placement Cell)';
    } else if (lower.includes('student') || lower.includes('priya') || lower.includes('stu-')) {
      role = 'Student';
      name = 'Priya Sharma (Student)';
    }

    onLogin({
      name,
      email: signInEmail,
      role,
      department: 'Academic Division',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      setErrorMessage('Please fill in all required fields to create your account.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage('Password should be at least 6 characters long.');
      return;
    }

    setSuccessMessage('Account created successfully! Logging you in...');
    setTimeout(() => {
      onLogin({
        name: signUpName,
        email: signUpEmail,
        role: signUpRole,
        department: signUpDept,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      });
    }, 800);
  };

  // Quick 1-click demo logins
  const handleQuickDemo = (role: UserRole, name: string, email: string) => {
    onLogin({
      name,
      email,
      role,
      department: 'Campus Faculty & Administration',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });
  };

  return (
    <div className="min-h-screen bg-[#070e24] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background campus photo with deep modern overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/university_campus_login_1791654414335.jpg"
          alt="University Smart Campus"
          className="w-full h-full object-cover opacity-25 filter brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070e24] via-[#070e24]/85 to-[#0b1736]/90 backdrop-blur-[2px]"></div>
      </div>

      {/* Top Banner Header */}
      <header className="relative z-10 px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 p-0.5 shadow-xl shadow-blue-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tight text-white">Student Success</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 uppercase tracking-wider">
                Smart Campus
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              AI-Powered Analytics & Early Intervention Platform
            </p>
          </div>
        </div>

        <button
          onClick={onBrowseGuest}
          className="text-xs text-blue-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700/80 transition-colors flex items-center space-x-1.5 backdrop-blur-md"
        >
          <span>Explore Platform as Guest</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </header>

      {/* Main Login / Register Card Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-700/90 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          {/* Logo & Subtitle */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Campus Decision Intelligence</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Student Success Portal</h1>
            <p className="text-xs text-slate-300">
              Sign in with your Mail ID and Password to monitor student attendance, marks, and early interventions.
            </p>
          </div>

          {/* Tab Selector: Sign In vs Sign Up */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'signin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'signup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account (Sign Up)
            </button>
          </div>

          {/* Error & Success Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mail ID (Institutional Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@campus.edu.in"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered institutional email.')}
                    className="text-[11px] text-blue-400 hover:text-blue-300"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Remember my login</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">SSL Encrypted</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Sign In to Student Success</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* SIGN UP FORM (CREATE AN ACCOUNT) */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Prof. Ramesh Kumar / Ananya Rao"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mail ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="user@campus.edu.in"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Role</label>
                  <select
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Faculty">Faculty / Teacher</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Placement Officer">Placement Officer</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={signUpDept}
                    onChange={(e) => setSignUpDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics & Comm.">Electronics & Comm.</option>
                    <option value="Information Tech.">Information Tech.</option>
                    <option value="Mechanical Eng.">Mechanical Eng.</option>
                    <option value="MBA & Mgmt">MBA & Mgmt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Create Account & Sign In</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick 1-Click Access for Hackathon Demo */}
          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              Quick 1-Click Demo Personas
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('Faculty', 'Prof. Rajesh K.', 'faculty@campus.edu.in')}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/70 text-left flex items-center space-x-2 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                  FAC
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">Faculty</div>
                  <div className="text-[10px] text-slate-400">Prof. Rajesh</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('Administrator', 'Dr. Aris Thorne (Dean)', 'dean@campus.edu.in')}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/70 text-left flex items-center space-x-2 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                  ADM
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">College Admin</div>
                  <div className="text-[10px] text-slate-400">Dr. Thorne (Dean)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('Placement Officer', 'Sunita Rao', 'placement@campus.edu.in')}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/70 text-left flex items-center space-x-2 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                  TPO
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">Placement Cell</div>
                  <div className="text-[10px] text-slate-400">Sunita Rao</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('Student', 'Priya Sharma (STU-1002)', 'priya.sharma@campus.edu.in')}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/70 text-left flex items-center space-x-2 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                  STU
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">Student View</div>
                  <div className="text-[10px] text-slate-400">Priya Sharma</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs text-slate-500 border-t border-slate-800/60">
        Student Success &bull; Smart Campus Decision Intelligence &bull; Secured with Role-Based Access Controls
      </footer>
    </div>
  );
};
