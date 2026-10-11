import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  Users, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Student } from '../types/student';
import { exportStudentsToCSV } from '../utils/dataImport';

interface ReportsViewProps {
  students: Student[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ students }) => {
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredStudents = selectedDept === 'All' 
    ? students 
    : students.filter((s) => s.department === selectedDept);

  const total = filteredStudents.length;
  const avgScore = total > 0 ? Math.round(filteredStudents.reduce((acc, s) => acc + s.success_score, 0) / total) : 0;
  const highRiskCount = filteredStudents.filter((s) => s.risk_level === 'High').length;
  const avgAttendance = total > 0 ? Math.round(filteredStudents.reduce((acc, s) => acc + s.attendance_pct, 0) / total) : 0;
  const avgMarks = total > 0 ? Math.round(filteredStudents.reduce((acc, s) => acc + s.academic_marks_pct, 0) / total) : 0;
  const avgPlacement = total > 0 ? Math.round(filteredStudents.reduce((acc, s) => acc + s.placement_readiness_pct, 0) / total) : 0;

  const handleExportCSV = () => {
    const csv = exportStudentsToCSV(filteredStudents);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kpmg_institutional_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Report Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2 border border-blue-500/30">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            <span>Institutional Quality & Accreditation Analytics</span>
          </div>
          <h2 className="text-2xl font-black text-white">Campus Executive Performance Report</h2>
          <p className="text-xs text-slate-300 mt-1">
            Standardized academic audit covering student success indicators, intervention closure rates, and risk indices.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Audit</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">Department Scope:</span>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Departments (Campus-Wide)</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electronics & Comm.">Electronics & Comm.</option>
          <option value="Information Tech.">Information Tech.</option>
          <option value="Mechanical Eng.">Mechanical Eng.</option>
          <option value="MBA & Mgmt">MBA & Mgmt</option>
        </select>
      </div>

      {/* Summary KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Students Audited</div>
          <div className="text-2xl font-black text-white mt-1">{total}</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Success Score</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{avgScore}/100</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">At-Risk Count</div>
          <div className="text-2xl font-black text-red-400 mt-1">{highRiskCount}</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Mean Attendance</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">{avgAttendance}%</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Mean Marks</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{avgMarks}%</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Placement Index</div>
          <div className="text-2xl font-black text-purple-400 mt-1">{avgPlacement}%</div>
        </div>
      </div>

      {/* Audit Detail Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3">Academic Roster Audit Detail</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Student ID</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Branch</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3">Internal Marks</th>
                <th className="py-2.5 px-3">Success Score</th>
                <th className="py-2.5 px-3">Risk Tier</th>
                <th className="py-2.5 px-3">Active Interventions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredStudents.map((s) => (
                <tr key={s.student_id}>
                  <td className="py-2.5 px-3 font-mono text-blue-400">{s.student_id}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{s.name}</td>
                  <td className="py-2.5 px-3">{s.department}</td>
                  <td className="py-2.5 px-3">{s.attendance_pct}%</td>
                  <td className="py-2.5 px-3">{s.academic_marks_pct}%</td>
                  <td className="py-2.5 px-3 font-bold text-white">{s.success_score}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.risk_level === 'High' ? 'bg-red-500/20 text-red-300' :
                      s.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {s.risk_level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {s.interventions.length} logged ({s.interventions.filter((i) => i.status === 'Completed').length} resolved)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
