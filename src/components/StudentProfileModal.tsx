import React, { useState } from 'react';
import { 
  X, 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Briefcase, 
  Award, 
  Calendar, 
  Layers, 
  TrendingUp, 
  PlusCircle, 
  Send,
  Loader2,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { Student, ScoringWeights, AIAnalysisResult, Intervention } from '../types/student';
import { generateStudentAIDiagnostic } from '../services/aiService';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  weights: ScoringWeights;
  onOpenInterventionModal: (student: Student) => void;
  onAddInterventionFromAI: (studentId: string, intervention: AIAnalysisResult['recommendedInterventions'][0]) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  weights,
  onOpenInterventionModal,
  onAddInterventionFromAI,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'attendance' | 'placement' | 'interventions' | 'ai-insights'>('overview');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  if (!student) return null;

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const result = await generateStudentAIDiagnostic(student, weights);
      setAiAnalysis(result);
      setActiveTab('ai-insights');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Compute exact contribution points
  const totalWeight = weights.academics + weights.attendance + weights.lms + weights.skills + weights.placement;
  const validTotal = totalWeight > 0 ? totalWeight : 100;
  const acadContrib = Math.round((student.academic_marks_pct * weights.academics) / validTotal);
  const attContrib = Math.round((student.attendance_pct * weights.attendance) / validTotal);
  const lmsContrib = Math.round((student.lms_completion_pct * weights.lms) / validTotal);
  const skillsContrib = Math.round((((student.skills_count * 15 + student.extracurricular_score) / 2) * weights.skills) / validTotal);
  const placeContrib = Math.round((student.placement_readiness_pct * weights.placement) / validTotal);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white">{student.name}</h2>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                  student.risk_level === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                  student.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {student.risk_level} Risk
                </span>
              </div>
              <div className="text-xs text-slate-300 font-mono mt-0.5">
                {student.student_id} · {student.department} · Year {student.year} (Sec {student.section})
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-2">
                <span>Faculty Mentor: <strong className="text-slate-200">{student.mentor}</strong></span>
                <span>·</span>
                <span>Email: <strong className="text-slate-200">{student.email}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center">
            <button
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating AI Diagnostic...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                  <span>Generate AI Action Plan</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 space-x-2 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Score Factors
          </button>
          <button
            onClick={() => setActiveTab('academics')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'academics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Assessments & Tests
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Attendance & LMS Trends
          </button>
          <button
            onClick={() => setActiveTab('placement')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'placement' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Placement & Skills ({student.skills_count})
          </button>
          <button
            onClick={() => setActiveTab('interventions')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'interventions' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interventions ({student.interventions.length})
          </button>
          <button
            onClick={() => setActiveTab('ai-insights')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center space-x-1 ${
              activeTab === 'ai-insights' ? 'bg-indigo-600 text-white' : 'text-indigo-400 hover:text-indigo-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Action Diagnostics</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Plain English Summary for Everyone */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/90 to-indigo-950/90 border border-blue-500/40 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold text-blue-300 uppercase tracking-wider">
                    Simple Explanation for Everyone (Faculty, Student & Parents)
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white mt-0.5 leading-snug">
                    {student.risk_level === 'High' 
                      ? `${student.name} needs urgent support: attendance is at ${student.attendance_pct}% and internal marks average ${student.academic_marks_pct}%. Immediate mentor check-in and extra subject tutoring are strongly advised.`
                      : student.academic_marks_pct >= 75 && student.placement_readiness_pct < 55
                      ? `${student.name} is academically brilliant (${student.academic_marks_pct}% marks), but needs practical interview practice and mock speaking sessions to succeed in job interviews.`
                      : student.attendance_pct < 75
                      ? `${student.name} is passing tests, but attendance (${student.attendance_pct}%) is close to the minimum requirement. Needs to attend upcoming classes.`
                      : `${student.name} is performing solidly with good attendance (${student.attendance_pct}%) and steady progress across all subjects.`}
                  </div>
                </div>
              </div>
              {/* Score Highlight Banner */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                <div className="md:col-span-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between items-center text-center">
                  <div className="text-xs uppercase font-bold text-slate-400">Calculated Success Score</div>
                  <div className="my-3">
                    <div className={`text-6xl font-black ${
                      student.success_score >= 75 ? 'text-emerald-400' :
                      student.success_score >= 55 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {student.success_score}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">out of 100 points</div>
                  </div>
                  <div className="w-full text-[11px] py-1.5 rounded-xl bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    Cohort: {student.segment}
                  </div>
                </div>

                {/* Why This Score Breakdown */}
                <div className="md:col-span-8 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-xs uppercase font-extrabold text-blue-400 flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4" />
                      <span>Explainable AI: "Why This Score?" Factor Breakdown</span>
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">Normalized & Weighted</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Academics ({student.academic_marks_pct}% marks @ {weights.academics}% wt)</span>
                        <span className="font-bold text-blue-400">{acadContrib} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${student.academic_marks_pct}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Attendance ({student.attendance_pct}% @ {weights.attendance}% wt)</span>
                        <span className="font-bold text-cyan-400">{attContrib} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${student.attendance_pct}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>LMS Completion ({student.lms_completion_pct}% @ {weights.lms}% wt)</span>
                        <span className="font-bold text-indigo-400">{lmsContrib} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${student.lms_completion_pct}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Placement Readiness ({student.placement_readiness_pct}% @ {weights.placement}% wt)</span>
                        <span className="font-bold text-emerald-400">{placeContrib} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${student.placement_readiness_pct}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Skills & Extracurriculars ({student.skills_count} certs @ {weights.skills}% wt)</span>
                        <span className="font-bold text-purple-400">{skillsContrib} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, student.skills_count * 20)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contributing Risk Factors & Explanation */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs uppercase font-extrabold text-slate-300">Algorithmic Risk Assessment</h4>
                <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  {student.risk_explanation}
                </p>

                {student.risk_factors.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 mb-1.5">Flagged Risk Drivers:</div>
                    <div className="flex flex-wrap gap-2">
                      {student.risk_factors.map((factor, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-red-950/50 border border-red-800/40 text-red-300 font-medium"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMICS & ASSESSMENTS */}
          {activeTab === 'academics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                  <div className="text-xs text-slate-400">Cumulative GPA</div>
                  <div className="text-2xl font-black text-white">{student.cgpa} / 10.0</div>
                </div>
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                  <div className="text-xs text-slate-400">Internal Assessment Avg</div>
                  <div className="text-2xl font-black text-blue-400">{student.academic_marks_pct}%</div>
                </div>
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                  <div className="text-xs text-slate-400">Coding Rating</div>
                  <div className="text-2xl font-black text-emerald-400">{student.coding_rating} / 100</div>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Semester Course Assessments Breakdown</h4>
                </div>
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-[10px] uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Subject Name</th>
                      <th className="py-2.5 px-4">Code</th>
                      <th className="py-2.5 px-4">Internal 1 (50)</th>
                      <th className="py-2.5 px-4">Internal 2 (50)</th>
                      <th className="py-2.5 px-4">Final / Proj (100)</th>
                      <th className="py-2.5 px-4">Total Score</th>
                      <th className="py-2.5 px-4">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {student.assessments.map((a, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 font-semibold text-white">{a.subject}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{a.code}</td>
                        <td className="py-3 px-4">{a.internal1} / 50</td>
                        <td className="py-3 px-4">{a.internal2} / 50</td>
                        <td className="py-3 px-4">{a.finalExam} / 100</td>
                        <td className="py-3 px-4 font-bold text-white">{a.totalMarks}%</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ['O', 'A+', 'A'].includes(a.grade) ? 'bg-emerald-500/20 text-emerald-300' :
                            ['B+', 'B', 'C'].includes(a.grade) ? 'bg-blue-500/20 text-blue-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {a.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE & LMS TRENDS */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                  <div className="text-xs text-slate-400">Current Biometric Attendance</div>
                  <div className={`text-3xl font-black mt-1 ${
                    student.attendance_pct < 65 ? 'text-red-400' : student.attendance_pct < 75 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {student.attendance_pct}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {student.attendance_pct < 75 ? '⚠️ Below mandatory 75% threshold' : '✅ Compliant with semester exam guidelines'}
                  </div>
                </div>

                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                  <div className="text-xs text-slate-400">LMS Asynchronous Activity</div>
                  <div className="text-3xl font-black text-indigo-400 mt-1">
                    {student.lms_hours_per_week} hrs/week
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {student.lms_completion_pct}% of online laboratory & reading modules completed
                  </div>
                </div>
              </div>

              {/* Monthly Trend Chart */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Semester Progression Trend: Attendance vs Marks vs LMS
                </h4>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={student.historical_trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" domain={[0, 100]} fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px', color: '#fff' }} />
                      <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="marks" name="Marks %" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="lms" name="LMS %" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLACEMENT & SKILLS */}
          {activeTab === 'placement' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
                  <div className="text-[11px] text-slate-400">Placement Readiness</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">{student.placement_readiness_pct} / 100</div>
                </div>
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
                  <div className="text-[11px] text-slate-400">Mock Interview</div>
                  <div className="text-2xl font-black text-blue-400 mt-1">{student.mock_interview_score} / 100</div>
                </div>
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
                  <div className="text-[11px] text-slate-400">Coding Aptitude</div>
                  <div className="text-2xl font-black text-purple-400 mt-1">{student.coding_rating} / 100</div>
                </div>
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
                  <div className="text-[11px] text-slate-400">Soft Skills & GD</div>
                  <div className="text-2xl font-black text-indigo-400 mt-1">{student.soft_skills_rating} / 100</div>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Verified Industry Certifications</h4>
                {student.certifications.length === 0 ? (
                  <p className="text-xs text-slate-400">No industry certifications logged yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {student.certifications.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 font-semibold flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5 text-blue-400" />
                        <span>{c}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: INTERVENTIONS HISTORY */}
          {activeTab === 'interventions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Active & Completed Support Action Plans ({student.interventions.length})
                </h4>
                <button
                  onClick={() => onOpenInterventionModal(student)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Assign New Action</span>
                </button>
              </div>

              {student.interventions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl">
                  No active interventions logged for this student. Use "Generate AI Action Plan" or "Assign New Action".
                </div>
              ) : (
                <div className="space-y-3">
                  {student.interventions.map((int) => (
                    <div
                      key={int.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          int.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                          int.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        }`}>
                          {int.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Due: {int.due_date}</span>
                      </div>

                      <div className="text-sm font-bold text-white">{int.title}</div>
                      <div className="text-xs text-blue-300">{int.category} · Priority: {int.priority}</div>
                      <p className="text-xs text-slate-300">{int.notes}</p>
                      {int.outcome_notes && (
                        <div className="text-xs text-emerald-300 bg-emerald-950/40 p-2 rounded-xl border border-emerald-800/40">
                          <strong>Resolution Note:</strong> {int.outcome_notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AI ACTION DIAGNOSTICS */}
          {activeTab === 'ai-insights' && (
            <div className="space-y-6">
              {!aiAnalysis ? (
                <div className="p-12 text-center bg-slate-950/70 border border-slate-800 rounded-2xl space-y-4">
                  <Sparkles className="w-8 h-8 text-blue-400 mx-auto animate-pulse" />
                  <h3 className="text-base font-bold text-white">Generate Gemini-Powered Strategic Diagnostic</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Synthesizes academic history, attendance curves, and placement gaps into a 3-phase pedagogical remediation roadmap.
                  </p>
                  <button
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all inline-flex items-center space-x-2"
                  >
                    {isGeneratingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Run AI Diagnostic Now</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Diagnostic Summary */}
                  <div className="p-5 bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-500/30 rounded-2xl">
                    <div className="text-xs uppercase font-extrabold text-blue-300 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>Executive Diagnostic Summary</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      {aiAnalysis.diagnosticSummary}
                    </p>
                  </div>

                  {/* Strengths and Critical Gaps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl space-y-2">
                      <div className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Key Identified Strengths</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {aiAnalysis.keyStrengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-red-950/30 border border-red-800/40 rounded-2xl space-y-2">
                      <div className="text-xs uppercase font-bold text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Critical Performance Gaps</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {aiAnalysis.criticalGaps.map((gap, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-red-400 font-bold">•</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 3-Phase Action Plan */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs uppercase font-extrabold text-white">Recommended 3-Phase Pedagogical Action Plan</h4>
                    <div className="space-y-3">
                      {aiAnalysis.actionPlan.map((step, idx) => (
                        <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <div className="text-xs font-bold text-blue-400">{step.phase}</div>
                          <div className="text-xs text-white">{step.action}</div>
                          <div className="text-[11px] text-emerald-400">Verifiable Milestone: <strong>{step.metric}</strong></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Faculty Discussion Prompts */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-2.5">
                    <h4 className="text-xs uppercase font-extrabold text-purple-300">Suggested 1-on-1 Faculty Mentor Talking Prompts</h4>
                    <div className="space-y-2">
                      {aiAnalysis.mentorDiscussionPrompts.map((prompt, idx) => (
                        <div key={idx} className="text-xs text-slate-300 italic bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          {prompt}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add recommended interventions directly */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs uppercase font-extrabold text-white">Suggested Interventions to Deploy</h4>
                    <div className="space-y-2.5">
                      {aiAnalysis.recommendedInterventions.map((rec, idx) => (
                        <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-white">{rec.title}</div>
                            <div className="text-[10px] text-slate-400">{rec.category} · Priority: {rec.priority}</div>
                            <div className="text-[11px] text-emerald-300 mt-0.5">Target: {rec.expectedOutcome}</div>
                          </div>
                          <button
                            onClick={() => onAddInterventionFromAI(student.student_id, rec)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shrink-0 transition-colors"
                          >
                            Add to Plan
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
