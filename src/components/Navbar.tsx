import React from 'react';
import { 
  GraduationCap, 
  Sliders, 
  Upload, 
  Database, 
  FileSpreadsheet, 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  Layers, 
  ClipboardList, 
  ChevronDown,
  UserCheck,
  HardDrive,
  Sparkles,
  LogOut,
  Palette,
  HelpCircle
} from 'lucide-react';
import { UserRole, AuthUser, ThemeMode } from '../types/student';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: AuthUser | null;
  onSignOut: () => void;
  onOpenScoringModal: () => void;
  onOpenImportModal: () => void;
  onOpenSupabaseModal: () => void;
  onOpenBackupModal: () => void;
  atRiskCount: number;
  simpleMode: boolean;
  setSimpleMode: (val: boolean) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  userRole,
  setUserRole,
  currentUser,
  onSignOut,
  onOpenScoringModal,
  onOpenImportModal,
  onOpenSupabaseModal,
  onOpenBackupModal,
  atRiskCount,
  simpleMode,
  setSimpleMode,
  themeMode,
  setThemeMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top institution ribbon */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-4 py-1.5 text-xs text-blue-200 border-b border-blue-800/40 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="bg-blue-600/70 text-blue-100 font-extrabold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
            Student Success
          </span>
          <span className="hidden sm:inline text-slate-300">
            Smart Campus Analytics: Predict, Optimize & Improve
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          {/* Simple Mode Toggle */}
          <button
            onClick={() => setSimpleMode(!simpleMode)}
            className={`px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1.5 transition-all ${
              simpleMode 
                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-400/50' 
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Toggle Simple English Mode to explain all student indicators in 1 clear sentence"
          >
            <Sparkles className="w-3 h-3 text-current" />
            <span>{simpleMode ? 'Simple Mode: ON' : 'Simple Mode'}</span>
          </button>

          {/* Theme background switcher */}
          <div className="flex items-center space-x-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => setThemeMode('ocean')}
              className={`px-1.5 py-0.5 rounded font-medium ${themeMode === 'ocean' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Ocean Slate Theme"
            >
              Ocean
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`px-1.5 py-0.5 rounded font-medium ${themeMode === 'dark' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Midnight Dark Theme"
            >
              Dark
            </button>
            <button
              onClick={() => setThemeMode('clean-light')}
              className={`px-1.5 py-0.5 rounded font-medium ${themeMode === 'clean-light' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Crisp Clean Contrast Theme"
            >
              Clean
            </button>
          </div>

          <span className="text-emerald-400 hidden lg:inline-flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1"></span>
            Live
          </span>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand: Student Success */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-base tracking-tight text-white">Student Success</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Easy Analytics & Early Action</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentView('at-risk')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all relative ${
                currentView === 'at-risk'
                  ? 'bg-red-600/90 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Risk Alerts</span>
              {atRiskCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-red-500 text-white rounded-full">
                  {atRiskCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('students')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                currentView === 'students'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Students</span>
            </button>

            <button
              onClick={() => setCurrentView('segmentation')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                currentView === 'segmentation'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Segments</span>
            </button>

            <button
              onClick={() => setCurrentView('interventions')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                currentView === 'interventions'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Interventions</span>
            </button>

            <button
              onClick={() => setCurrentView('reports')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                currentView === 'reports'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Reports</span>
            </button>
          </nav>

          {/* Action buttons & User profile */}
          <div className="flex items-center space-x-2">
            {/* Backup Data Button */}
            <button
              onClick={onOpenBackupModal}
              title="Backup Data (Download JSON, CSV, Restore)"
              className="px-2.5 py-1.5 text-xs bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 rounded-xl border border-emerald-700/60 flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold hidden xl:inline">Backup Data</span>
            </button>

            {/* Quick action buttons */}
            <button
              onClick={onOpenScoringModal}
              title="Configure Scoring Engine Weights"
              className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden lg:inline">Scoring</span>
            </button>

            <button
              onClick={onOpenImportModal}
              title="Upload Student CSV/Excel Data"
              className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Import</span>
            </button>

            <button
              onClick={onOpenSupabaseModal}
              title="Supabase PostgreSQL Architecture"
              className="p-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            {/* Logged in User & Role Switcher */}
            <div className="relative group">
              <div className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-800/60 rounded-xl px-2.5 py-1.5 text-xs text-blue-200 cursor-pointer">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-4 h-4 rounded-full object-cover border border-blue-400"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span className="font-bold hidden sm:inline max-w-[100px] truncate">
                  {currentUser?.name || userRole}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>

              <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-1.5 hidden group-hover:block group-focus-within:block z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                  Switch Active Role
                </div>
                {(['Administrator', 'Faculty', 'Placement Officer', 'Student'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRole(role)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      userRole === role ? 'text-blue-400 font-bold bg-blue-950/40' : 'text-slate-300'
                    }`}
                  >
                    <span>{role}</span>
                    {userRole === role && <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>}
                  </button>
                ))}

                <div className="border-t border-slate-800 mt-1 pt-1 px-1">
                  <button
                    onClick={onSignOut}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-950/50 rounded-lg flex items-center space-x-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Sign Out to Login</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="md:hidden flex overflow-x-auto px-3 py-2 bg-slate-950/90 border-t border-slate-800/80 space-x-1.5 text-xs scrollbar-none">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentView('at-risk')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'at-risk' ? 'bg-red-600 text-white font-bold' : 'text-slate-400'}`}
        >
          At-Risk ({atRiskCount})
        </button>
        <button
          onClick={() => setCurrentView('students')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'students' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Students
        </button>
        <button
          onClick={() => setCurrentView('segmentation')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'segmentation' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Segmentation
        </button>
        <button
          onClick={() => setCurrentView('interventions')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'interventions' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
        >
          Interventions
        </button>
        <button
          onClick={onOpenBackupModal}
          className="px-2.5 py-1 rounded whitespace-nowrap bg-emerald-950 text-emerald-300 font-bold border border-emerald-800"
        >
          Backup Data
        </button>
      </div>
    </header>
  );
};
