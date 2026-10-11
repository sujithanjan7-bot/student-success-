import React, { useState } from 'react';
import { 
  ClipboardList, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  User, 
  Filter, 
  Check, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Intervention, Student } from '../types/student';

interface InterventionsManagerViewProps {
  students: Student[];
  onOpenInterventionModal: () => void;
  onUpdateInterventionStatus: (interventionId: string, newStatus: Intervention['status'], outcomeNote?: string) => void;
  onSelectStudent: (student: Student) => void;
}

export const InterventionsManagerView: React.FC<InterventionsManagerViewProps> = ({
  students,
  onOpenInterventionModal,
  onUpdateInterventionStatus,
  onSelectStudent,
}) => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Collect all interventions across all students
  const allInterventions = students.flatMap((s) => s.interventions);

  const filteredInterventions = allInterventions.filter((i) => {
    const matchCat = categoryFilter === 'All' || i.category === categoryFilter;
    const matchPri = priorityFilter === 'All' || i.priority === priorityFilter;
    return matchCat && matchPri;
  });

  const pendingList = filteredInterventions.filter((i) => i.status === 'Pending');
  const inProgressList = filteredInterventions.filter((i) => i.status === 'In Progress');
  const completedList = filteredInterventions.filter((i) => i.status === 'Completed');

  const completedCount = allInterventions.filter((i) => i.status === 'Completed').length;
  const inProgressCount = allInterventions.filter((i) => i.status === 'In Progress').length;
  const pendingCount = allInterventions.filter((i) => i.status === 'Pending').length;

  const renderCard = (int: Intervention) => {
    const student = students.find((s) => s.student_id === int.student_id);

    return (
      <div
        key={int.id}
        className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-md space-y-3 hover:border-blue-500/40 transition-all"
      >
        <div className="flex items-start justify-between">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            int.priority === 'Critical' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
            int.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
            'bg-blue-500/20 text-blue-300 border-blue-500/40'
          }`}>
            {int.priority} Priority
          </span>

          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            Due: {int.due_date}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white leading-snug">{int.title}</h4>
          <div className="text-[10px] text-blue-300 mt-0.5">{int.category}</div>
        </div>

        {/* Student tag */}
        <div
          onClick={() => student && onSelectStudent(student)}
          className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center space-x-2">
            {student?.avatar && (
              <img
                src={student.avatar}
                alt={int.student_name}
                className="w-5 h-5 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            <div>
              <div className="text-[11px] font-bold text-white">{int.student_name}</div>
              <div className="text-[9px] text-slate-400 font-mono">{int.student_id}</div>
            </div>
          </div>
          <span className="text-[10px] text-blue-400 font-semibold">Inspect &rarr;</span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-800/30 p-2 rounded-lg border border-slate-800/60">
          {int.notes}
        </p>

        {int.outcome_notes && (
          <div className="text-[10px] text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40 flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
            <span><strong>Impact Outcome:</strong> {int.outcome_notes}</span>
          </div>
        )}

        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
          <span>Assigned to: <strong className="text-slate-300">{int.assigned_to_mentor}</strong></span>
        </div>

        {/* Action Status Controls */}
        <div className="pt-2 flex items-center justify-between gap-1.5 border-t border-slate-800/60">
          {int.status !== 'Pending' && (
            <button
              onClick={() => onUpdateInterventionStatus(int.id, 'Pending')}
              className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              &larr; Revert Pending
            </button>
          )}

          {int.status === 'Pending' && (
            <button
              onClick={() => onUpdateInterventionStatus(int.id, 'In Progress')}
              className="w-full py-1.5 text-xs bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 rounded-xl font-bold transition-colors flex items-center justify-center space-x-1"
            >
              <span>Begin Intervention</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {int.status === 'In Progress' && (
            <button
              onClick={() => {
                const note = prompt('Enter intervention completion outcome note (e.g. Student attended 3 remedial sessions, marks recovered):');
                onUpdateInterventionStatus(int.id, 'Completed', note || 'Intervention successfully concluded.');
              }}
              className="w-full py-1.5 text-xs bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold transition-colors flex items-center justify-center space-x-1"
            >
              <Check className="w-3 h-3" />
              <span>Mark as Completed</span>
            </button>
          )}

          {int.status === 'Completed' && (
            <div className="w-full text-center py-1 text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolved & Logged</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2 border border-blue-500/30">
            <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
            <span>Actionable Intervention Management</span>
          </div>
          <h2 className="text-2xl font-black text-white">Faculty & Mentor Action Kanban</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Track and document remedial classes, mock interviews, attendance summons, and psychological advising from assignment to resolution.
          </p>
        </div>

        <button
          onClick={onOpenInterventionModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Faculty Intervention</span>
        </button>
      </div>

      {/* Progress & Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Pending Intake</div>
            <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
            <div className="text-[11px] text-slate-400">Awaiting faculty advisor scheduling</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">In Active Flight</div>
            <div className="text-2xl font-black text-blue-400">{inProgressCount}</div>
            <div className="text-[11px] text-slate-400">Remedial or counseling underway</div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Successfully Concluded</div>
            <div className="text-2xl font-black text-emerald-400">{completedCount}</div>
            <div className="text-[11px] text-emerald-300">Measured positive recovery logged</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Column */}
        <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">Pending Assignment</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-slate-300">
              {pendingList.length}
            </span>
          </div>

          <div className="space-y-3">
            {pendingList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No pending actions in queue.
              </div>
            ) : (
              pendingList.map(renderCard)
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">In Active Progress</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-slate-300">
              {inProgressList.length}
            </span>
          </div>

          <div className="space-y-3">
            {inProgressList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No interventions in progress.
              </div>
            ) : (
              inProgressList.map(renderCard)
            )}
          </div>
        </div>

        {/* Completed Column */}
        <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">Completed & Verified</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-slate-300">
              {completedList.length}
            </span>
          </div>

          <div className="space-y-3">
            {completedList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No completed interventions yet.
              </div>
            ) : (
              completedList.map(renderCard)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
