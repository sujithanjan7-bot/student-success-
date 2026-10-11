import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  ArrowRight,
  Database,
  RefreshCw,
  Copy
} from 'lucide-react';
import { Student, ScoringWeights } from '../types/student';
import { parseAndValidateCSV, SAMPLE_CSV_CONTENT, ImportResult } from '../utils/dataImport';

interface DataImportModalProps {
  existingStudents: Student[];
  weights: ScoringWeights;
  onImportSuccess: (newStudents: Student[]) => void;
  onClose: () => void;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({
  existingStudents,
  weights,
  onImportSuccess,
  onClose,
}) => {
  const [csvContent, setCsvContent] = useState<string>('');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [activeStep, setActiveStep] = useState<'upload' | 'preview'>('upload');

  const handleValidate = () => {
    if (!csvContent.trim()) return;
    const result = parseAndValidateCSV(csvContent, existingStudents, weights);
    setImportResult(result);
    setActiveStep('preview');
  };

  const handleLoadSample = () => {
    setCsvContent(SAMPLE_CSV_CONTENT);
    const result = parseAndValidateCSV(SAMPLE_CSV_CONTENT, existingStudents, weights);
    setImportResult(result);
    setActiveStep('preview');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      const result = parseAndValidateCSV(text, existingStudents, weights);
      setImportResult(result);
      setActiveStep('preview');
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kpmg_student_data_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCommitImport = () => {
    if (importResult && importResult.validStudents.length > 0) {
      onImportSuccess(importResult.validStudents);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Import Student Records (CSV / Excel)</h3>
              <p className="text-xs text-slate-400">Strict validation for missing IDs, duplicates, and range boundaries</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {activeStep === 'upload' ? (
            <div className="space-y-5">
              {/* Dropzone & sample actions */}
              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center space-y-3 bg-slate-950/40 hover:border-blue-500/50 transition-colors">
                <FileSpreadsheet className="w-10 h-10 text-emerald-400 mx-auto" />
                <div>
                  <div className="text-sm font-bold text-white">Upload CSV File with Student Indicators</div>
                  <div className="text-xs text-slate-400 mt-1">Columns: student_id, name, department, year, attendance_pct, academic_marks_pct, lms_completion_pct, placement_readiness_pct</div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-colors">
                    Browse CSV File
                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <button
                    onClick={handleLoadSample}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                  >
                    Load 6 Fictional Benchmark Students
                  </button>
                  <button
                    onClick={handleDownloadSample}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV Template</span>
                  </button>
                </div>
              </div>

              {/* Paste Textarea */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Or Paste Raw CSV Data Directly:</span>
                </div>
                <textarea
                  rows={6}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="student_id,name,department,year,attendance_pct,academic_marks_pct,lms_completion_pct,placement_readiness_pct&#10;STU-3001,Kunal Shah,Computer Science,3,64,52,38,40"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleValidate}
                  disabled={!csvContent.trim()}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <span>Parse & Validate Records</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Validation Summary */}
              {importResult && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Rows Processed</div>
                    <div className="text-xl font-black text-white">{importResult.totalRowsProcessed}</div>
                  </div>
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Valid Students Ready to Merge</span>
                    </div>
                    <div className="text-xl font-black text-emerald-400">{importResult.successCount}</div>
                  </div>
                  <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Validation Errors</span>
                    </div>
                    <div className="text-xl font-black text-red-400">{importResult.failureCount}</div>
                  </div>
                </div>
              )}

              {/* Errors list if any */}
              {importResult && importResult.errors.length > 0 && (
                <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Errors Encountered During Parsing:</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1">
                    {importResult.errors.map((err, idx) => (
                      <div key={idx} className="text-xs text-red-200 font-mono">
                        Row {err.row}: [{err.field}] &mdash; {err.message} {err.value && `(Got: "${err.value}")`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Table of Valid Students */}
              {importResult && importResult.validStudents.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white">Preview of Valid Records:</div>
                  <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 sticky top-0 text-[10px] uppercase text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-2 px-3">ID</th>
                          <th className="py-2 px-3">Name</th>
                          <th className="py-2 px-3">Department</th>
                          <th className="py-2 px-3">Attendance</th>
                          <th className="py-2 px-3">Marks</th>
                          <th className="py-2 px-3">Score</th>
                          <th className="py-2 px-3">Calculated Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {importResult.validStudents.map((s) => (
                          <tr key={s.student_id}>
                            <td className="py-2 px-3 font-mono text-blue-400">{s.student_id}</td>
                            <td className="py-2 px-3 font-semibold text-white">{s.name}</td>
                            <td className="py-2 px-3">{s.department}</td>
                            <td className="py-2 px-3">{s.attendance_pct}%</td>
                            <td className="py-2 px-3">{s.academic_marks_pct}%</td>
                            <td className="py-2 px-3 font-bold text-white">{s.success_score}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                s.risk_level === 'High' ? 'bg-red-500/20 text-red-300' :
                                s.risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                                'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {s.risk_level}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveStep('upload')}
                  className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  &larr; Back to Upload
                </button>
                <button
                  onClick={handleCommitImport}
                  disabled={!importResult || importResult.validStudents.length === 0}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Import {importResult?.validStudents.length || 0} Students into Roster</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
