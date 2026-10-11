import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { AtRiskStudentsView } from './components/AtRiskStudentsView';
import { StudentDirectoryView } from './components/StudentDirectoryView';
import { SegmentationView } from './components/SegmentationView';
import { InterventionsManagerView } from './components/InterventionsManagerView';
import { ReportsView } from './components/ReportsView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { ScoringConfigModal } from './components/ScoringConfigModal';
import { DataImportModal } from './components/DataImportModal';
import { SupabaseArchitectureModal } from './components/SupabaseArchitectureModal';
import { CreateInterventionModal } from './components/CreateInterventionModal';
import { BackupDataModal } from './components/BackupDataModal';

import { Student, ScoringWeights, UserRole, Intervention, AIAnalysisResult, AuthUser, ThemeMode } from './types/student';
import { INITIAL_STUDENTS } from './data/mockStudents';
import { DEFAULT_WEIGHTS, recomputeStudentWithWeights } from './utils/scoringEngine';

export default function App() {
  // Auth state: by default, show LoginPage unless user logged in or guest
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);

  // Core application state
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);
  const [userRole, setUserRole] = useState<UserRole>('Administrator');
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Theme & Usability toggles
  const [themeMode, setThemeMode] = useState<ThemeMode>('ocean');
  const [simpleMode, setSimpleMode] = useState<boolean>(true); // Easy understanding enabled by default

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [interventionTargetStudent, setInterventionTargetStudent] = useState<Student | undefined>(undefined);

  // Login handler
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
    setIsGuestMode(false);
    setCurrentView('dashboard');
  };

  // Sign out handler
  const handleSignOut = () => {
    setCurrentUser(null);
    setIsGuestMode(false);
  };

  // Recalibrate students whenever scoring weights change
  const handleUpdateWeights = (newWeights: ScoringWeights) => {
    setScoringWeights(newWeights);
    setStudents((prev) => prev.map((s) => recomputeStudentWithWeights(s, newWeights)));
    if (selectedStudent) {
      setSelectedStudent(recomputeStudentWithWeights(selectedStudent, newWeights));
    }
  };

  // Merge new students from CSV import
  const handleImportStudents = (newStudents: Student[]) => {
    setStudents((prev) => [...prev, ...newStudents]);
    setCurrentView('students');
  };

  // Restore database from backup
  const handleRestoreBackup = (restoredStudents: Student[], restoredWeights?: ScoringWeights) => {
    if (restoredWeights) {
      setScoringWeights(restoredWeights);
      const recomputed = restoredStudents.map((s) => recomputeStudentWithWeights(s, restoredWeights));
      setStudents(recomputed);
    } else {
      setStudents(restoredStudents);
    }
    setCurrentView('dashboard');
  };

  // Reset database to initial benchmark data
  const handleResetToDefault = () => {
    setScoringWeights(DEFAULT_WEIGHTS);
    setStudents(INITIAL_STUDENTS);
  };

  // Create new intervention
  const handleCreateIntervention = (newIntervention: Intervention) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.student_id === newIntervention.student_id) {
          const updatedInterventions = [newIntervention, ...s.interventions];
          return {
            ...s,
            interventions: updatedInterventions,
          };
        }
        return s;
      })
    );

    if (selectedStudent && selectedStudent.student_id === newIntervention.student_id) {
      setSelectedStudent((prev) =>
        prev
          ? {
              ...prev,
              interventions: [newIntervention, ...prev.interventions],
            }
          : null
      );
    }
  };

  // Update intervention status (e.g. In Progress, Completed)
  const handleUpdateInterventionStatus = (
    interventionId: string,
    newStatus: Intervention['status'],
    outcomeNote?: string
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        const hasIntervention = s.interventions.some((i) => i.id === interventionId);
        if (!hasIntervention) return s;

        const updatedList = s.interventions.map((i) => {
          if (i.id === interventionId) {
            return {
              ...i,
              status: newStatus,
              outcome_notes: outcomeNote !== undefined ? outcomeNote : i.outcome_notes,
            };
          }
          return i;
        });

        // If completed, provide slight realistic boost to student score/confidence
        let updatedStudent = { ...s, interventions: updatedList };
        if (newStatus === 'Completed' && s.risk_level === 'High') {
          updatedStudent = {
            ...updatedStudent,
            attendance_pct: Math.min(100, s.attendance_pct + 4),
            academic_marks_pct: Math.min(100, s.academic_marks_pct + 5),
          };
          updatedStudent = recomputeStudentWithWeights(updatedStudent, scoringWeights);
        }

        return updatedStudent;
      })
    );

    if (selectedStudent) {
      const updated = students.find((s) => s.student_id === selectedStudent.student_id);
      if (updated) setSelectedStudent(updated);
    }
  };

  // Direct addition of an intervention recommended by AI
  const handleAddInterventionFromAI = (
    studentId: string,
    rec: AIAnalysisResult['recommendedInterventions'][0]
  ) => {
    const student = students.find((s) => s.student_id === studentId);
    if (!student) return;

    const newIntervention: Intervention = {
      id: `int-ai-${Date.now()}`,
      student_id: studentId,
      student_name: student.name,
      title: rec.title,
      category: rec.category,
      priority: rec.priority,
      assigned_by: 'CampusAI Diagnostic Engine',
      assigned_to_mentor: student.mentor,
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
      notes: `AI Recommendation: Target outcome is "${rec.expectedOutcome}".`,
      created_at: new Date().toISOString().split('T')[0],
    };

    handleCreateIntervention(newIntervention);
  };

  const atRiskCount = useMemo(() => {
    return students.filter((s) => s.risk_level === 'High').length;
  }, [students]);

  // If user is not logged in and hasn't clicked guest mode, present the LoginPage in front
  if (!currentUser && !isGuestMode) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onBrowseGuest={() => setIsGuestMode(true)}
      />
    );
  }

  // Determine background styling based on selected theme
  const getThemeBackgroundClass = () => {
    if (themeMode === 'clean-light') {
      return 'bg-slate-100 text-slate-900';
    }
    if (themeMode === 'dark') {
      return 'bg-[#040814] text-slate-100';
    }
    return 'bg-[#091124] text-slate-100'; // Ocean Slate
  };

  return (
    <div className={`min-h-screen ${getThemeBackgroundClass()} relative font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300`}>
      {/* Background Subtle Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {themeMode !== 'clean-light' && (
          <img
            src="/src/assets/images/dashboard_bg_pattern_1791654387214.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-15 filter brightness-110"
            referrerPolicy="no-referrer"
          />
        )}
        <div className={`absolute inset-0 ${
          themeMode === 'clean-light' 
            ? 'bg-gradient-to-b from-slate-100/90 via-slate-100 to-slate-200/50' 
            : themeMode === 'dark' 
            ? 'bg-gradient-to-b from-[#040814]/90 via-[#040814]/95 to-[#040814]'
            : 'bg-gradient-to-b from-[#091124]/85 via-[#091124]/90 to-[#091124]'
        }`}></div>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          userRole={userRole}
          setUserRole={setUserRole}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onOpenScoringModal={() => setIsScoringModalOpen(true)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          onOpenBackupModal={() => setIsBackupModalOpen(true)}
          atRiskCount={atRiskCount}
          simpleMode={simpleMode}
          setSimpleMode={setSimpleMode}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
        />

        <main className="flex-1 pb-16">
          {currentView === 'landing' && (
            <LandingPage
              onEnterDashboard={() => setCurrentView('dashboard')}
              onExploreAtRisk={() => setCurrentView('at-risk')}
              onOpenImport={() => setIsImportModalOpen(true)}
              onOpenSupabase={() => setIsSupabaseModalOpen(true)}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              students={students}
              userRole={userRole}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDept={selectedDept}
              setSelectedDept={setSelectedDept}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedRisk={selectedRisk}
              setSelectedRisk={setSelectedRisk}
              onSelectStudent={(student) => setSelectedStudent(student)}
              onOpenInterventionModal={(student) => {
                setInterventionTargetStudent(student);
                setIsInterventionModalOpen(true);
              }}
              onNavigateToRisk={() => setCurrentView('at-risk')}
              onNavigateToSegmentation={() => setCurrentView('segmentation')}
              simpleMode={simpleMode}
            />
          )}

          {currentView === 'at-risk' && (
            <AtRiskStudentsView
              students={students}
              onSelectStudent={(student) => setSelectedStudent(student)}
              onOpenInterventionModal={(student) => {
                setInterventionTargetStudent(student);
                setIsInterventionModalOpen(true);
              }}
            />
          )}

          {currentView === 'students' && (
            <StudentDirectoryView
              students={students}
              onSelectStudent={(student) => setSelectedStudent(student)}
              onOpenInterventionModal={(student) => {
                setInterventionTargetStudent(student);
                setIsInterventionModalOpen(true);
              }}
            />
          )}

          {currentView === 'segmentation' && (
            <SegmentationView
              students={students}
              onSelectStudent={(student) => setSelectedStudent(student)}
              onOpenInterventionModal={(student) => {
                setInterventionTargetStudent(student);
                setIsInterventionModalOpen(true);
              }}
            />
          )}

          {currentView === 'interventions' && (
            <InterventionsManagerView
              students={students}
              onOpenInterventionModal={() => {
                setInterventionTargetStudent(undefined);
                setIsInterventionModalOpen(true);
              }}
              onUpdateInterventionStatus={handleUpdateInterventionStatus}
              onSelectStudent={(student) => setSelectedStudent(student)}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView students={students} />
          )}
        </main>
      </div>

      {/* MODALS */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          weights={scoringWeights}
          onClose={() => setSelectedStudent(null)}
          onOpenInterventionModal={(student) => {
            setInterventionTargetStudent(student);
            setIsInterventionModalOpen(true);
          }}
          onAddInterventionFromAI={handleAddInterventionFromAI}
        />
      )}

      {isScoringModalOpen && (
        <ScoringConfigModal
          weights={scoringWeights}
          onSave={handleUpdateWeights}
          onClose={() => setIsScoringModalOpen(false)}
        />
      )}

      {isImportModalOpen && (
        <DataImportModal
          existingStudents={students}
          weights={scoringWeights}
          onImportSuccess={handleImportStudents}
          onClose={() => setIsImportModalOpen(false)}
        />
      )}

      {isBackupModalOpen && (
        <BackupDataModal
          students={students}
          weights={scoringWeights}
          onRestoreBackup={handleRestoreBackup}
          onResetToDefault={handleResetToDefault}
          onClose={() => setIsBackupModalOpen(false)}
        />
      )}

      {isSupabaseModalOpen && (
        <SupabaseArchitectureModal
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      )}

      {isInterventionModalOpen && (
        <CreateInterventionModal
          students={students}
          preSelectedStudent={interventionTargetStudent}
          onSave={handleCreateIntervention}
          onClose={() => {
            setIsInterventionModalOpen(false);
            setInterventionTargetStudent(undefined);
          }}
        />
      )}
    </div>
  );
}
