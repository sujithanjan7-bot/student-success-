import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  FileJson, 
  FileSpreadsheet,
  HardDrive
} from 'lucide-react';
import { Student, ScoringWeights } from '../types/student';
import { exportStudentsToCSV } from '../utils/dataImport';
import { INITIAL_STUDENTS } from '../data/mockStudents';

interface BackupDataModalProps {
  students: Student[];
  weights: ScoringWeights;
  onRestoreBackup: (restoredStudents: Student[], restoredWeights?: ScoringWeights) => void;
  onResetToDefault: () => void;
  onClose: () => void;
}

export const BackupDataModal: React.FC<BackupDataModalProps> = ({
  students,
  weights,
  onRestoreBackup,
  onResetToDefault,
  onClose,
}) => {
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [restoreJsonText, setRestoreJsonText] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Generate complete JSON snapshot
  const generateBackupData = () => {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      institution: 'KPMG Student Success Platform',
      metadata: {
        totalStudents: students.length,
        highRiskCount: students.filter((s) => s.risk_level === 'High').length,
        scoringWeights: weights,
      },
      students: students,
    };
  };

  // Download JSON backup file
  const handleDownloadJson = () => {
    const backupObj = generateBackupData();
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student_success_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedbackMessage({ text: 'Database backup downloaded successfully as JSON!', type: 'success' });
  };

  // Download CSV export
  const handleDownloadCsv = () => {
    const csvStr = exportStudentsToCSV(students);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student_success_records_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedbackMessage({ text: 'Student records exported as CSV successfully!', type: 'success' });
  };

  // File upload restore
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.students && Array.isArray(parsed.students)) {
          onRestoreBackup(parsed.students, parsed.metadata?.scoringWeights);
          setFeedbackMessage({ text: `Successfully restored ${parsed.students.length} student records from backup file!`, type: 'success' });
        } else if (Array.isArray(parsed)) {
          onRestoreBackup(parsed);
          setFeedbackMessage({ text: `Successfully restored ${parsed.length} student records!`, type: 'success' });
        } else {
          setFeedbackMessage({ text: 'Invalid backup structure. File must contain student records.', type: 'error' });
        }
      } catch (err) {
        setFeedbackMessage({ text: 'Failed to parse JSON backup file.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  // Paste text restore
  const handlePasteRestore = () => {
    try {
      const parsed = JSON.parse(restoreJsonText);
      const studentArray = parsed.students || parsed;
      if (Array.isArray(studentArray) && studentArray.length > 0) {
        onRestoreBackup(studentArray, parsed.metadata?.scoringWeights);
        setFeedbackMessage({ text: `Restored ${studentArray.length} student records from pasted JSON!`, type: 'success' });
        setRestoreJsonText('');
      } else {
        setFeedbackMessage({ text: 'Could not find a valid student array in pasted text.', type: 'error' });
      }
    } catch {
      setFeedbackMessage({ text: 'Invalid JSON text format.', type: 'error' });
    }
  };

  // Save to browser LocalStorage
  const handleSaveToLocalStorage = () => {
    try {
      const backupObj = generateBackupData();
      localStorage.setItem('student_success_db_backup', JSON.stringify(backupObj));
      setFeedbackMessage({ text: 'Current database snapshot saved to browser storage!', type: 'success' });
    } catch {
      setFeedbackMessage({ text: 'Failed to write to browser local storage.', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Database Backup & Recovery Hub</h3>
              <p className="text-xs text-slate-400">Export complete snapshots, restore records, or reset campus data</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message banner */}
        {feedbackMessage && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            feedbackMessage.type === 'success' 
              ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300' 
              : 'bg-red-950/60 border border-red-800/60 text-red-300'
          }`}>
            {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Active Database Stats Card */}
        <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 text-center">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Stored Students</div>
            <div className="text-xl font-black text-white mt-0.5">{students.length} Records</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">At-Risk Profiles</div>
            <div className="text-xl font-black text-red-400 mt-0.5">
              {students.filter((s) => s.risk_level === 'High').length}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Active Action Plans</div>
            <div className="text-xl font-black text-blue-400 mt-0.5">
              {students.reduce((acc, s) => acc + s.interventions.length, 0)}
            </div>
          </div>
        </div>

        {/* Action 1: Export Backup Files */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-white uppercase tracking-wider">1. Create & Download Backup</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadJson}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-left transition-colors flex items-center space-x-3 group"
            >
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Full JSON Database Backup</div>
                <div className="text-[10px] text-slate-400">Complete records, trends & weights</div>
              </div>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-left transition-colors flex items-center space-x-3 group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Export CSV Spreadsheet</div>
                <div className="text-[10px] text-slate-400">For Excel, Sheets or reporting</div>
              </div>
            </button>
          </div>
        </div>

        {/* Action 2: Restore from Backup */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-white uppercase tracking-wider">2. Restore Database from Backup</div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-colors flex items-center space-x-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Select Backup JSON File</span>
              <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
            </label>

            <button
              onClick={handleSaveToLocalStorage}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5 text-cyan-400" />
              <span>Save Local Browser Snapshot</span>
            </button>
          </div>

          <div className="mt-2">
            <textarea
              rows={2}
              placeholder="Or paste JSON backup content here..."
              value={restoreJsonText}
              onChange={(e) => setRestoreJsonText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
            {restoreJsonText.trim() && (
              <div className="flex justify-end mt-1.5">
                <button
                  onClick={handlePasteRestore}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Apply Pasted Backup
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action 3: Reset to Clean Default Dataset */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Reset student database to the clean initial benchmark dataset?')) {
                onResetToDefault();
                setFeedbackMessage({ text: 'Database reset to clean initial benchmark dataset.', type: 'success' });
              }
            }}
            className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/30 border border-red-900/40 rounded-xl flex items-center space-x-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Clean Initial Dataset</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
