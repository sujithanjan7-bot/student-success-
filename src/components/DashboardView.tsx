import React, { useMemo } from 'react';
import { 
  Users, 
  Award, 
  AlertTriangle, 
  Clock, 
  Briefcase, 
  ClipboardCheck, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  BrainCircuit,
  Eye,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Student, UserRole } from '../types/student';

interface DashboardViewProps {
  students: Student[];
  userRole: UserRole;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedRisk: string;
  setSelectedRisk: (risk: string) => void;
  onSelectStudent: (student: Student) => void;
  onOpenInterventionModal: (student?: Student) => void;
  onNavigateToRisk: () => void;
  onNavigateToSegmentation: () => void;
  simpleMode?: boolean;
}

export function getSimpleStudentSummary(student: Student): string {
  if (student.risk_level === 'High') {
    if (student.attendance_pct < 65) {
      return `⚠️ Needs Urgent Help: Missing too many classes (${student.attendance_pct}%) and exam marks are low (${student.academic_marks_pct}%). Needs mentor meeting.`;
    }
    return `⚠️ Needs Academic Help: Exam marks (${student.academic_marks_pct}%) are falling. Needs remedial tutoring.`;
  }
  if (student.academic_marks_pct >= 75 && student.placement_readiness_pct < 55) {
    return `💡 Book Smart, Needs Interview Practice: Scoring ${student.academic_marks_pct}% in tests, but needs job interview practice.`;
  }
  if (student.attendance_pct < 75) {
    return `🟡 Watch Attendance: Currently at ${student.attendance_pct}%. Needs to attend more classes to be exam eligible.`;
  }
  if (student.placement_readiness_pct >= 80) {
    return `🌟 Top Performer: Excellent marks (${student.academic_marks_pct}%) and ready for company placements!`;
  }
  return `✅ On Track: Consistent attendance (${student.attendance_pct}%) and passing exam scores.`;
}

const RISK_COLORS = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  userRole,
  searchQuery,
  setSearchQuery,
  selectedDept,
  setSelectedDept,
  selectedYear,
  setSelectedYear,
  selectedRisk,
  setSelectedRisk,
  onSelectStudent,
  onOpenInterventionModal,
  onNavigateToRisk,
  onNavigateToSegmentation,
  simpleMode = false,
}) => {
  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = selectedDept === 'All' || s.department === selectedDept;
      const matchYear = selectedYear === 'All' || s.year.toString() === selectedYear;
      const matchRisk = selectedRisk === 'All' || s.risk_level === selectedRisk;

      return matchSearch && matchDept && matchYear && matchRisk;
    });
  }, [students, searchQuery, selectedDept, selectedYear, selectedRisk]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    if (students.length === 0) {
      return { total: 0, avgScore: 0, highRisk: 0, medRisk: 0, lowRisk: 0, avgAttendance: 0, placementReady: 0, activeInterventions: 0 };
    }
    const total = students.length;
    const avgScore = Math.round(students.reduce((acc, s) => acc + s.success_score, 0) / total);
    const highRisk = students.filter((s) => s.risk_level === 'High').length;
    const medRisk = students.filter((s) => s.risk_level === 'Medium').length;
    const lowRisk = students.filter((s) => s.risk_level === 'Low').length;
    const avgAttendance = Math.round(students.reduce((acc, s) => acc + s.attendance_pct, 0) / total);
    const placementReadyCount = students.filter((s) => s.placement_readiness_pct >= 70).length;
    const placementReady = Math.round((placementReadyCount / total) * 100);
    const activeInterventions = students.reduce((acc, s) => acc + s.interventions.filter((i) => i.status !== 'Completed').length, 0);

    return { total, avgScore, highRisk, medRisk, lowRisk, avgAttendance, placementReady, activeInterventions };
  }, [students]);

  // Risk Distribution Data for Pie Chart
  const riskChartData = useMemo(() => {
    return [
      { name: 'High Risk', value: metrics.highRisk, color: RISK_COLORS.High },
      { name: 'Medium Risk', value: metrics.medRisk, color: RISK_COLORS.Medium },
      { name: 'Low Risk', value: metrics.lowRisk, color: RISK_COLORS.Low },
    ];
  }, [metrics]);

  // Departmental breakdown
  const departmentData = useMemo(() => {
    const depts = ['Computer Science', 'Electronics & Comm.', 'Information Tech.', 'Mechanical Eng.', 'MBA & Mgmt'];
    return depts.map((d) => {
      const inDept = students.filter((s) => s.department === d);
      const count = inDept.length;
      const avgScore = count > 0 ? Math.round(inDept.reduce((acc, s) => acc + s.success_score, 0) / count) : 0;
      const avgPlacement = count > 0 ? Math.round(inDept.reduce((acc, s) => acc + s.placement_readiness_pct, 0) / count) : 0;
      const avgAtt = count > 0 ? Math.round(inDept.reduce((acc, s) => acc + s.attendance_pct, 0) / count) : 0;
      return {
        name: d.replace(' & Comm.', '').replace(' & Mgmt', '').replace('Computer Science', 'CSE').replace('Information Tech.', 'IT').replace('Mechanical Eng.', 'Mech'),
        fullName: d,
        avgScore,
        avgPlacement,
        avgAtt,
        count,
      };
    });
  }, [students]);

  // Aggregate monthly trend data
  const monthlyTrendData = [
    { month: 'Jun', attendance: 82, marks: 74, lms: 68 },
    { month: 'Jul', attendance: 80, marks: 76, lms: 71 },
    { month: 'Aug', attendance: 79, marks: 75, lms: 73 },
    { month: 'Sep', attendance: 81, marks: 78, lms: 77 },
    { month: 'Oct (Current)', attendance: metrics.avgAttendance, marks: metrics.avgScore, lms: 75 },
  ];

  const highRiskStudents = useMemo(() => {
    return students.filter((s) => s.risk_level === 'High');
  }, [students]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Easy Understanding for Everyone: Plain English Campus Summary */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-300">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Simple Campus Analysis: Easy for Everyone to Understand</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
              How is the student body performing in simple terms?
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-300 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
              {metrics.total} Students Analyzed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3.5">
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                Safe & On Track
              </span>
              <span className="text-base font-black text-emerald-400">{metrics.lowRisk} Students</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Attending regularly (&gt;75%), passing examinations, and on track for graduation. No urgent intervention required.
            </p>
          </div>

          <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                Watch Closely
              </span>
              <span className="text-base font-black text-amber-400">{metrics.medRisk} Students</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Passing course requirements, but have borderline attendance or need mock interview practice before final placements.
            </p>
          </div>

          <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                Need Urgent Help
              </span>
              <span className="text-base font-black text-red-400">{metrics.highRisk} Students</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Severe attendance shortage (&lt;65%) or failing internal marks. Require immediate faculty mentor counseling and remedial tutoring.
            </p>
          </div>
        </div>
      </div>

      {/* Top Banner Alert for High Risk Students */}
      {metrics.highRisk > 0 && (
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900/90 to-amber-950/80 border border-red-500/30 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Critical Early-Warning Alert:</span>
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-black">
                  {metrics.highRisk} Students At-Risk
                </span>
              </h3>
              <p className="text-xs text-red-200/90 mt-0.5">
                Students flagged with compound low attendance (&lt;65%) or failing internal assessment trends requiring proactive intervention.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <button
              onClick={onNavigateToRisk}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center space-x-1.5"
            >
              <span>Review Risk Roster</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenInterventionModal()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>New Intervention</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Students */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Students</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{metrics.total}</div>
          <div className="text-[11px] text-emerald-400 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Active across 5 branches</span>
          </div>
        </div>

        {/* Average Success Score */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg Success Score</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white flex items-baseline">
            <span>{metrics.avgScore}</span>
            <span className="text-xs text-slate-400 font-normal ml-1">/100</span>
          </div>
          <div className="text-[11px] text-blue-300 flex items-center mt-1">
            <span>Configurable weights</span>
          </div>
        </div>

        {/* High-Risk Students */}
        <div 
          onClick={onNavigateToRisk}
          className="bg-slate-900/80 border border-red-500/20 rounded-2xl p-4 shadow-lg backdrop-blur-md relative overflow-hidden cursor-pointer hover:border-red-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-red-300 uppercase tracking-wider">High Risk</span>
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-400">{metrics.highRisk}</div>
          <div className="text-[11px] text-red-300 flex items-center mt-1">
            <span>{Math.round((metrics.highRisk / (metrics.total || 1)) * 100)}% of student body</span>
          </div>
        </div>

        {/* Average Attendance */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg Attendance</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{metrics.avgAttendance}%</div>
          <div className="text-[11px] text-slate-400 flex items-center mt-1">
            <span>75% statutory min.</span>
          </div>
        </div>

        {/* Placement Readiness */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Placement Ready</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">{metrics.placementReady}%</div>
          <div className="text-[11px] text-slate-400 flex items-center mt-1">
            <span>Tier-1 & 2 corporate</span>
          </div>
        </div>

        {/* Active Interventions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Action Plans</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-400">{metrics.activeInterventions}</div>
          <div className="text-[11px] text-slate-400 flex items-center mt-1">
            <span>In progress or pending</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart: Attendance & Performance Timeline */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Holistic Campus Trend Evolution</span>
                <span className="text-[10px] text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
                  Semester 5 (Jun - Oct)
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparison of Academic Performance %, Biometric Attendance %, and LMS Digital Engagement
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={[40, 100]} fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendance)" />
                <Area type="monotone" dataKey="marks" name="Academic Score %" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMarks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Risk Distribution Donut */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">Student Risk Classification</h3>
            <span className="text-[10px] text-slate-400">Total: {metrics.total}</span>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
            <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="text-xs font-bold text-red-400">{metrics.highRisk}</div>
              <div className="text-[10px] text-slate-400">High Risk</div>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-xs font-bold text-amber-400">{metrics.medRisk}</div>
              <div className="text-[10px] text-slate-400">Medium</div>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xs font-bold text-emerald-400">{metrics.lowRisk}</div>
              <div className="text-[10px] text-slate-400">Low Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row Visualizations: Departmental Comparison & Cohort Segmentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Placement vs Academics Bar Chart */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Departmental Placement vs Academic Score</h3>
              <p className="text-xs text-slate-400 mt-0.5">Comparison across CSE, ECE, IT, Mechanical & MBA</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={[0, 100]} fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="avgScore" name="Avg Success Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgPlacement" name="Placement Readiness %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Cohort Segmentation Card */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span>AI Student Segmentation Matrix</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated behavioral & placement clustering</p>
            </div>
            <button
              onClick={onNavigateToSegmentation}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center"
            >
              <span>Explore All</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            <div 
              onClick={onNavigateToSegmentation}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white">High Academic, Low Placement Readiness</div>
                <div className="text-[10px] text-slate-400">Strong CGPA but low mock interview / soft skills</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
                {students.filter((s) => s.segment.includes('Low Placement')).length} Students
              </span>
            </div>

            <div 
              onClick={onNavigateToSegmentation}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white">Low Academic, Low Attendance</div>
                <div className="text-[10px] text-red-300">Compound failure and semester detention threat</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold">
                {students.filter((s) => s.segment.includes('Low Attendance')).length} Students
              </span>
            </div>

            <div 
              onClick={onNavigateToSegmentation}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white">High Academic, Low LMS Engagement</div>
                <div className="text-[10px] text-slate-400">Autonomous off-platform study pattern</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                {students.filter((s) => s.segment.includes('Low LMS')).length} Students
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Dynamic grouping based on multi-indicator thresholds</span>
            <span className="text-emerald-400 font-semibold">100% Auditable</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Student Roster */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Campus Student Records Directory</span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                {filteredStudents.length} / {students.length} Shown
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any student row to view the explainable "Why This Score?" panel and generate AI action plans.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, ID, branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Department Dropdown */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics & Comm.">Electronics & Comm.</option>
              <option value="Information Tech.">Information Tech.</option>
              <option value="Mechanical Eng.">Mechanical Eng.</option>
              <option value="MBA & Mgmt">MBA & Mgmt</option>
            </select>

            {/* Academic Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>

            {/* Risk Dropdown */}
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk Only</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Department & Year</th>
                <th className="py-3 px-3">Success Score</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Marks</th>
                <th className="py-3 px-3">Placement</th>
                <th className="py-3 px-3">Cohort Segment</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No student records match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.slice(0, 8).map((student) => (
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
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{student.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{student.student_id}</div>
                        {simpleMode && (
                          <div className="text-[10px] text-amber-200 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 mt-1 max-w-sm">
                            {getSimpleStudentSummary(student)}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-slate-200">{student.department}</div>
                      <div className="text-[10px] text-slate-400">Year {student.year} · Sec {student.section}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1.5">
                        <span className={`font-black text-sm ${
                          student.success_score >= 75 ? 'text-emerald-400' :
                          student.success_score >= 55 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {student.success_score}
                        </span>
                        <span className="text-[10px] text-slate-500">/100</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        student.risk_level === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                        student.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {student.risk_level} Risk
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className={`font-semibold ${student.attendance_pct < 65 ? 'text-red-400' : student.attendance_pct < 75 ? 'text-amber-400' : 'text-slate-200'}`}>
                        {student.attendance_pct}%
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className={`font-semibold ${student.academic_marks_pct < 50 ? 'text-red-400' : 'text-slate-200'}`}>
                        {student.academic_marks_pct}%
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className={`font-semibold ${student.placement_readiness_pct < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {student.placement_readiness_pct}%
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 inline-block max-w-[170px] truncate">
                        {student.segment}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectStudent(student)}
                          title="Open Full Profile & Explainable AI"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenInterventionModal(student)}
                          title="Assign Targeted Intervention"
                          className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 transition-colors"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
