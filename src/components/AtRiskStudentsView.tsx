import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Briefcase, 
  PlusCircle, 
  CheckCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { Student } from '../types/student';

interface AtRiskStudentsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenInterventionModal: (student: Student) => void;
}

export const AtRiskStudentsView: React.FC<AtRiskStudentsViewProps> = ({
  students,
  onSelectStudent,
  onOpenInterventionModal,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'High' | 'Medium'>('All');

  const atRiskList = students.filter((s) => {
    if (filterSeverity === 'High') return s.risk_level === 'High';
    if (filterSeverity === 'Medium') return s.risk_level === 'Medium';
    return s.risk_level === 'High' || s.risk_level === 'Medium';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/70 border border-red-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold mb-2 border border-red-500/30">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Proactive Early Warning System</span>
            </div>
            <h2 className="text-2xl font-black text-white">At-Risk Student Diagnostic Hub</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Identifies students experiencing attendance slippage (&lt;75%), falling assessment trajectories, or placement readiness deficits. 
              Review the underlying factors and deploy structured interventions.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterSeverity('All')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterSeverity === 'All' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Flagged ({students.filter((s) => s.risk_level !== 'Low').length})
            </button>
            <button
              onClick={() => setFilterSeverity('High')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterSeverity === 'High' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Critical / High ({students.filter((s) => s.risk_level === 'High').length})
            </button>
            <button
              onClick={() => setFilterSeverity('Medium')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterSeverity === 'Medium' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Moderate ({students.filter((s) => s.risk_level === 'Medium').length})
            </button>
          </div>
        </div>
      </div>

      {/* Flagged Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {atRiskList.map((student) => {
          const activeInterventions = student.interventions.filter((i) => i.status !== 'Completed');
          const isHigh = student.risk_level === 'High';

          return (
            <div
              key={student.student_id}
              className={`bg-slate-900/90 border rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all hover:scale-[1.01] ${
                isHigh ? 'border-red-500/40 hover:border-red-500' : 'border-amber-500/30 hover:border-amber-500'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        <span>{student.name}</span>
                      </h3>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {student.student_id} · {student.department} (Yr {student.year})
                      </div>
                      <div className="text-[10px] text-slate-500">Mentor: {student.mentor}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                      isHigh ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {student.risk_level} Risk
                    </span>
                    <div className="text-xs font-black text-white mt-1">
                      Score: <span className={isHigh ? 'text-red-400' : 'text-amber-400'}>{student.success_score}</span>/100
                    </div>
                  </div>
                </div>

                {/* Quantitative Metric Bars */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center mb-3">
                  <div>
                    <div className="text-[10px] text-slate-400">Attendance</div>
                    <div className={`text-xs font-bold ${student.attendance_pct < 65 ? 'text-red-400' : student.attendance_pct < 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {student.attendance_pct}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Academics</div>
                    <div className={`text-xs font-bold ${student.academic_marks_pct < 50 ? 'text-red-400' : 'text-amber-400'}`}>
                      {student.academic_marks_pct}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Placement</div>
                    <div className={`text-xs font-bold ${student.placement_readiness_pct < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {student.placement_readiness_pct}%
                    </div>
                  </div>
                </div>

                {/* Root Cause Badges */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Identified Root Causes:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {student.risk_factors.map((factor, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-red-950/60 border border-red-800/40 text-red-300 font-medium"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explanation text */}
                <div className="text-[11px] text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50 mb-3">
                  {student.risk_explanation}
                </div>

                {/* Current Interventions Status */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between mb-4">
                  <span>Assigned Action Plans:</span>
                  {activeInterventions.length > 0 ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeInterventions.length} In Progress
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Needs Action Assignment
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => onSelectStudent(student)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Explain Score</span>
                </button>
                <button
                  onClick={() => onOpenInterventionModal(student)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition-colors flex items-center justify-center space-x-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Assign Action</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
