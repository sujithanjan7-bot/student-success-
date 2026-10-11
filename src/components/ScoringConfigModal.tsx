import React, { useState } from 'react';
import { X, Sliders, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { ScoringWeights } from '../types/student';
import { DEFAULT_WEIGHTS } from '../utils/scoringEngine';

interface ScoringConfigModalProps {
  weights: ScoringWeights;
  onSave: (newWeights: ScoringWeights) => void;
  onClose: () => void;
}

export const ScoringConfigModal: React.FC<ScoringConfigModalProps> = ({
  weights,
  onSave,
  onClose,
}) => {
  const [localWeights, setLocalWeights] = useState<ScoringWeights>({ ...weights });

  const total =
    localWeights.academics +
    localWeights.attendance +
    localWeights.lms +
    localWeights.skills +
    localWeights.placement;

  const handleSliderChange = (key: keyof ScoringWeights, value: number) => {
    setLocalWeights((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetToDefault = () => {
    setLocalWeights({ ...DEFAULT_WEIGHTS });
  };

  const applyPreset = (preset: ScoringWeights) => {
    setLocalWeights({ ...preset });
  };

  const presets = [
    { name: 'KPMG Standard (35/25/15/10/15)', w: DEFAULT_WEIGHTS },
    { name: 'Academic Intensive (50/30/10/5/5)', w: { academics: 50, attendance: 30, lms: 10, skills: 5, placement: 5 } },
    { name: 'Final Year Placement Sprint (20/15/10/15/40)', w: { academics: 20, attendance: 15, lms: 10, skills: 15, placement: 40 } },
    { name: 'First Year Foundation (40/35/15/10/0)', w: { academics: 40, attendance: 35, lms: 15, skills: 10, placement: 0 } },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Scoring Engine Configuration</h3>
              <p className="text-xs text-slate-400">Institutional weighting for Student Success Score (0–100)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Weight Indicator */}
        <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
          total === 100
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
            : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
        }`}>
          <span>Total Indicator Weight:</span>
          <span>{total}% {total !== 100 && '(Normalizes proportionally to 100%)'}</span>
        </div>

        {/* Preset Selector */}
        <div>
          <div className="text-[11px] uppercase font-bold text-slate-400 mb-2">Institutional Presets:</div>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p.w)}
                className="text-left p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-200">Academic Marks (Internals & Exams)</span>
              <span className="text-blue-400 font-bold">{localWeights.academics}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={localWeights.academics}
              onChange={(e) => handleSliderChange('academics', parseInt(e.target.value, 10))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-200">Biometric Attendance</span>
              <span className="text-cyan-400 font-bold">{localWeights.attendance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={localWeights.attendance}
              onChange={(e) => handleSliderChange('attendance', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-200">LMS Asynchronous Activity</span>
              <span className="text-indigo-400 font-bold">{localWeights.lms}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={localWeights.lms}
              onChange={(e) => handleSliderChange('lms', parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-200">Placement & Mock Interviews</span>
              <span className="text-emerald-400 font-bold">{localWeights.placement}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={localWeights.placement}
              onChange={(e) => handleSliderChange('placement', parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-200">Skills & Extracurriculars</span>
              <span className="text-purple-400 font-bold">{localWeights.skills}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={localWeights.skills}
              onChange={(e) => handleSliderChange('skills', parseInt(e.target.value, 10))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>

        {/* Footer controls */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleResetToDefault}
            className="px-3 py-2 text-xs text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to KPMG Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(localWeights);
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Recalculate Roster</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
