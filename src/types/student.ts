export type RiskLevel = 'Low' | 'Medium' | 'High';

export type UserRole = 'Administrator' | 'Faculty' | 'Placement Officer' | 'Student';

export type ThemeMode = 'ocean' | 'dark' | 'clean-light';

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  studentId?: string;
}

export interface ScoringWeights {
  academics: number;      // default: 35
  attendance: number;     // default: 25
  lms: number;            // default: 15
  skills: number;         // default: 10
  placement: number;      // default: 15
}

export interface SubjectAssessment {
  subject: string;
  code: string;
  internal1: number;
  internal2: number;
  finalExam: number;
  totalMarks: number;
  grade: string;
}

export interface HistoricalTrend {
  month: string;
  attendance: number;
  marks: number;
  lms: number;
}

export interface Intervention {
  id: string;
  student_id: string;
  student_name: string;
  title: string;
  category: 
    | 'Academic Tutoring' 
    | 'Attendance Warning' 
    | 'LMS Engagement' 
    | 'Placement & Interview Prep' 
    | 'Faculty Mentoring' 
    | 'Skill Bootcamp'
    | 'Wellness Check';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  assigned_by: string;
  assigned_to_mentor: string;
  due_date: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes: string;
  outcome_notes?: string;
  created_at: string;
}

export interface Student {
  student_id: string;
  name: string;
  email: string;
  avatar: string;
  department: 'Computer Science' | 'Electronics & Comm.' | 'Information Tech.' | 'Mechanical Eng.' | 'MBA & Mgmt';
  year: 1 | 2 | 3 | 4;
  section: string;
  cgpa: number;
  attendance_pct: number;
  academic_marks_pct: number;
  lms_hours_per_week: number;
  lms_completion_pct: number;
  skills_count: number;
  certifications: string[];
  extracurricular_score: number;
  placement_readiness_pct: number;
  mock_interview_score: number;
  coding_rating: number;
  soft_skills_rating: number;
  mentor: string;
  success_score: number;
  risk_level: RiskLevel;
  risk_factors: string[];
  risk_explanation: string;
  segment: string;
  assessments: SubjectAssessment[];
  historical_trends: HistoricalTrend[];
  interventions: Intervention[];
  created_at: string;
}

export interface AIAnalysisResult {
  diagnosticSummary: string;
  keyStrengths: string[];
  criticalGaps: string[];
  actionPlan: {
    phase: string;
    action: string;
    metric: string;
  }[];
  mentorDiscussionPrompts: string[];
  recommendedInterventions: {
    category: Intervention['category'];
    title: string;
    priority: Intervention['priority'];
    expectedOutcome: string;
  }[];
}

export interface SegmentInfo {
  id: string;
  title: string;
  description: string;
  badgeColor: string;
  iconName: string;
  criteria: string;
  recommendedAction: string;
}
