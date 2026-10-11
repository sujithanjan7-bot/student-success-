import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Eye, 
  PlusCircle, 
  ArrowUpDown, 
  FileSpreadsheet, 
  Filter, 
  GraduationCap 
} from 'lucide-react';
import { Student } from '../types/student';
import { exportStudentsToCSV } from '../utils/dataImport';

interface StudentDirectoryViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenInterventionModal: (student: Student) => void;
}

export const StudentDirectoryView: React.FC<StudentDirectoryViewProps> = ({
  students,
  onSelectStudent,
  onOpenInterventionModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortField, setSortField] = useState<'success_score' | 'attendance_pct' | 'academic_marks_pct' | 'placement_readiness_pct'>('success_score');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredAndSorted = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.mentor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = deptFilter === 'All' || s.department === deptFilter;
        const matchesYear = yearFilter === 'All' || s.year.toString() === yearFilter;
        const matchesRisk = riskFilter === 'All' || s.risk_level === riskFilter;

        return matchesSearch && matchesDept && matchesYear && matchesRisk;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [students, searchTerm, deptFilter, yearFilter, riskFilter, sortField, sortAsc]);

  const handleExportCSV = () => {
    const csvData = exportStudentsToCSV(filteredAndSorted);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `campus_students_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <span>Unified Student Master Registry</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic cross-departmental records combining attendance, LMS, internal exams, and placement preparation.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Filtered to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name, ID or mentor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics & Comm.">Electronics & Comm.</option>
            <option value="Information Tech.">Information Tech.</option>
            <option value="Mechanical Eng.">Mechanical Eng.</option>
            <option value="MBA & Mgmt">MBA & Mgmt</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Student Profile</th>
                <th className="py-3 px-3">Department & Year</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('success_score')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Success Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Risk Category</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('attendance_pct')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Attendance %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('academic_marks_pct')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Marks %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('placement_readiness_pct')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Placement</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Faculty Advisor</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No students match the criteria.
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((student) => (
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
                      <div className="text-slate-200">{student.department}</div>
                      <div className="text-[10px] text-slate-400">Year {student.year} · Sec {student.section}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1">
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
                        {student.risk_level}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={student.attendance_pct < 65 ? 'text-red-400 font-bold' : student.attendance_pct < 75 ? 'text-amber-400 font-semibold' : 'text-slate-200'}>
                        {student.attendance_pct}%
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={student.academic_marks_pct < 50 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                        {student.academic_marks_pct}%
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={student.placement_readiness_pct < 50 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                        {student.placement_readiness_pct}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-400">
                      {student.mentor}
                    </td>

                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectStudent(student)}
                          title="View Profile & Explainable Score"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenInterventionModal(student)}
                          title="Assign Action Plan"
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

        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Showing {filteredAndSorted.length} of {students.length} students</span>
          <span className="text-[11px] text-slate-500">Click headers to sort ascending / descending</span>
        </div>
      </div>
    </div>
  );
};
