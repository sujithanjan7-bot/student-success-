import React, { useState } from 'react';
import { 
  Layers, 
  Users, 
  BrainCircuit, 
  Sparkles, 
  Award, 
  AlertTriangle, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Student } from '../types/student';

interface SegmentationViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenInterventionModal: (student?: Student) => void;
}

interface SegmentDef {
  id: string;
  name: string;
  criteria: string;
  badgeColor: string;
  borderColor: string;
  icon: React.ReactNode;
  recommendedIntervention: string;
  description: string;
}

const SEGMENT_DEFINITIONS: SegmentDef[] = [
  {
    id: 'high-acad-low-placement',
    name: 'High Academic, Low Placement Readiness',
    criteria: 'Marks ≥ 75% AND Placement Readiness < 55%',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderColor: 'border-amber-500/40 hover:border-amber-500',
    icon: <Briefcase className="w-5 h-5 text-amber-400" />,
    recommendedIntervention: 'Enroll in Mock Interview Clinics, Resume Reviews & Technical GD Workshops',
    description: 'Students excel at academic coursework and written tests but lack corporate communication, interview poise, or practical coding interview confidence.',
  },
  {
    id: 'low-acad-low-attendance',
    name: 'Low Academic, Low Attendance',
    criteria: 'Marks < 60% AND Attendance < 70%',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    borderColor: 'border-red-500/40 hover:border-red-500',
    icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
    recommendedIntervention: 'Formal Dean Attendance Warning, Parent Consultation & 1-on-1 Faculty Mentoring',
    description: 'Acute retention and detention risk. Chronic absenteeism compounds poor assessment outcomes. Requires immediate administrative contact.',
  },
  {
    id: 'high-acad-low-lms',
    name: 'High Academic, Low LMS Engagement',
    criteria: 'Marks ≥ 75% AND LMS Completion < 55%',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    borderColor: 'border-indigo-500/40 hover:border-indigo-500',
    icon: <Layers className="w-5 h-5 text-indigo-400" />,
    recommendedIntervention: 'Asynchronous Assignment Re-engagement & Learning Resource Assessment',
    description: 'High cognitive ability students who study independently from external resources or textbooks, ignoring institution LMS submissions.',
  },
  {
    id: 'placement-champions',
    name: 'Placement-Ready Champions',
    criteria: 'Marks ≥ 80% AND Placement ≥ 80% AND Attendance ≥ 85%',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-emerald-500/40 hover:border-emerald-500',
    icon: <Award className="w-5 h-5 text-emerald-400" />,
    recommendedIntervention: 'Fast-Track to Tier-1 Super-Dream Corporate Drives & Appoint as Peer Mentors',
    description: 'Top quartile campus ambassadors who maintain exemplary marks, verified industry certifications, and exceptional interview performance.',
  },
  {
    id: 'consistent-improvers',
    name: 'Consistent Improvers',
    criteria: 'Marks 60–75% with Upward Month-on-Month Slope',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    borderColor: 'border-blue-500/40 hover:border-blue-500',
    icon: <CheckCircle2 className="w-5 h-5 text-blue-400" />,
    recommendedIntervention: 'Positive Reinforcement Recognition & Advanced Skill Elective Access',
    description: 'Students demonstrating steady positive work ethic and rising assessment scores over the current semester.',
  },
  {
    id: 'academic-support',
    name: 'Students Requiring Academic Mentoring',
    criteria: 'Marks < 60% with Attendance ≥ 70%',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderColor: 'border-purple-500/40 hover:border-purple-500',
    icon: <BrainCircuit className="w-5 h-5 text-purple-400" />,
    recommendedIntervention: 'Remedial Problem Solving Classes & Teaching Assistant Office Hours',
    description: 'Students who attend class diligently but struggle to grasp foundational theoretical concepts in examinations.',
  },
];

export const SegmentationView: React.FC<SegmentationViewProps> = ({
  students,
  onSelectStudent,
  onOpenInterventionModal,
}) => {
  const [activeSegmentId, setActiveSegmentId] = useState<string>('high-acad-low-placement');

  // Filter students based on selected segment
  const getStudentsForSegment = (segId: string): Student[] => {
    switch (segId) {
      case 'high-acad-low-placement':
        return students.filter((s) => s.academic_marks_pct >= 75 && s.placement_readiness_pct < 55);
      case 'low-acad-low-attendance':
        return students.filter((s) => s.academic_marks_pct < 60 && s.attendance_pct < 70);
      case 'high-acad-low-lms':
        return students.filter((s) => s.academic_marks_pct >= 75 && s.lms_completion_pct < 55);
      case 'placement-champions':
        return students.filter((s) => s.academic_marks_pct >= 80 && s.placement_readiness_pct >= 80 && s.attendance_pct >= 85);
      case 'consistent-improvers':
        return students.filter((s) => s.academic_marks_pct >= 60 && s.academic_marks_pct < 75 && s.attendance_pct >= 75);
      case 'academic-support':
        return students.filter((s) => s.academic_marks_pct < 60 && s.attendance_pct >= 70);
      default:
        return [];
    }
  };

  const activeSegmentDef = SEGMENT_DEFINITIONS.find((s) => s.id === activeSegmentId) || SEGMENT_DEFINITIONS[0];
  const activeStudents = getStudentsForSegment(activeSegmentId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2 border border-blue-500/30">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Multi-Dimensional Cohort Intelligence</span>
          </div>
          <h2 className="text-2xl font-black text-white">Student Segmentation Matrix</h2>
          <p className="text-xs text-slate-300 mt-1">
            Group students into actionable behavioral and career readiness clusters. Instead of applying one-size-fits-all policies, 
            administrators can trigger tailored cohort interventions like mock interview bootcamps or remedial labs.
          </p>
        </div>
      </div>

      {/* 6 Segment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEGMENT_DEFINITIONS.map((seg) => {
          const count = getStudentsForSegment(seg.id).length;
          const isSelected = activeSegmentId === seg.id;

          return (
            <div
              key={seg.id}
              onClick={() => setActiveSegmentId(seg.id)}
              className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg backdrop-blur-md cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-blue-500 bg-slate-850 ' + seg.borderColor : seg.borderColor
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                  {seg.icon}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${seg.badgeColor}`}>
                  {count} Students
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-white mb-1">{seg.name}</h3>
              <p className="text-[11px] text-slate-400 mb-3">{seg.description}</p>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[10px] space-y-1">
                <div className="text-slate-400 font-mono">Criteria: {seg.criteria}</div>
                <div className="text-blue-300 font-semibold">Action: {seg.recommendedIntervention}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Segment Detailed Student Roster */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${activeSegmentDef.badgeColor}`}>
                Active Cohort
              </span>
              <h3 className="text-lg font-black text-white">{activeSegmentDef.name}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {activeStudents.length} students matching criteria: <span className="text-slate-300 font-mono">{activeSegmentDef.criteria}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenInterventionModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Batch Assign Cohort Intervention</span>
            </button>
          </div>
        </div>

        {/* Table of students in segment */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Marks</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Placement</th>
                <th className="py-3 px-3">LMS Completion</th>
                <th className="py-3 px-3">Success Score</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {activeStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No students currently meet this segment's threshold.
                  </td>
                </tr>
              ) : (
                activeStudents.map((student) => (
                  <tr
                    key={student.student_id}
                    onClick={() => onSelectStudent(student)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 flex items-center space-x-2.5">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-white">{student.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{student.student_id}</div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div>{student.department}</div>
                      <div className="text-[10px] text-slate-400">Year {student.year}</div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-white">{student.academic_marks_pct}%</td>
                    <td className="py-3 px-3 font-semibold text-white">{student.attendance_pct}%</td>
                    <td className="py-3 px-3 font-semibold text-white">{student.placement_readiness_pct}%</td>
                    <td className="py-3 px-3 font-semibold text-white">{student.lms_completion_pct}%</td>

                    <td className="py-3 px-3">
                      <span className={`font-black ${student.success_score >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {student.success_score}
                      </span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </td>

                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg border border-slate-700 font-medium transition-colors"
                      >
                        Inspect Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
