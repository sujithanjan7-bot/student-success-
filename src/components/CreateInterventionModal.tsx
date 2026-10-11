import React, { useState } from 'react';
import { X, PlusCircle, Calendar, User, ClipboardList, Check } from 'lucide-react';
import { Student, Intervention } from '../types/student';

interface CreateInterventionModalProps {
  students: Student[];
  preSelectedStudent?: Student;
  onSave: (intervention: Intervention) => void;
  onClose: () => void;
}

export const CreateInterventionModal: React.FC<CreateInterventionModalProps> = ({
  students,
  preSelectedStudent,
  onSave,
  onClose,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    preSelectedStudent?.student_id || students[0]?.student_id || ''
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Intervention['category']>('Faculty Mentoring');
  const [priority, setPriority] = useState<Intervention['priority']>('High');
  const [assignedMentor, setAssignedMentor] = useState(preSelectedStudent?.mentor || 'Dr. Aris Thorne');
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [notes, setNotes] = useState('');

  const targetStudent = students.find((s) => s.student_id === selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedStudentId) return;

    const newIntervention: Intervention = {
      id: `int-${Date.now()}`,
      student_id: selectedStudentId,
      student_name: targetStudent?.name || 'Student',
      title,
      category,
      priority,
      assigned_by: 'Authorized Faculty / Administrator',
      assigned_to_mentor: assignedMentor,
      due_date: dueDate,
      status: 'Pending',
      notes,
      created_at: new Date().toISOString().split('T')[0],
    };

    onSave(newIntervention);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Assign Student Intervention</h3>
              <p className="text-xs text-slate-400">Deploy proactive faculty action plan</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                const s = students.find((stu) => stu.student_id === e.target.value);
                if (s) setAssignedMentor(s.mentor);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {students.map((s) => (
                <option key={s.student_id} value={s.student_id}>
                  {s.name} ({s.student_id}) &mdash; {s.department} [{s.risk_level} Risk]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Intervention Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Remedial Numerical Methods Coaching & Peer Study Group"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Intervention['category'])}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Academic Tutoring">Academic Tutoring</option>
                <option value="Attendance Warning">Attendance Warning</option>
                <option value="Faculty Mentoring">Faculty Mentoring</option>
                <option value="LMS Engagement">LMS Engagement</option>
                <option value="Placement & Interview Prep">Placement & Interview Prep</option>
                <option value="Skill Bootcamp">Skill Bootcamp</option>
                <option value="Wellness Check">Wellness Check</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Intervention['priority'])}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Faculty Mentor</label>
              <input
                type="text"
                required
                value={assignedMentor}
                onChange={(e) => setAssignedMentor(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Action Notes & Expectations</label>
            <textarea
              rows={3}
              placeholder="Specific milestones, scheduling details, or parent communication..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Deploy Action Plan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
