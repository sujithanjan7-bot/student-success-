import { Student, AIAnalysisResult, ScoringWeights } from '../types/student';

export async function generateStudentAIDiagnostic(
  student: Student,
  weights: ScoringWeights
): Promise<AIAnalysisResult> {
  try {
    const res = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student, weights }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.analysis) {
        return data.analysis;
      }
    }
  } catch {
    // Graceful fallback to heuristic intelligent diagnostic engine
  }

  // Heuristic intelligent diagnostic engine based on institutional analytics rules
  return generateHeuristicAnalysis(student);
}

export function generateHeuristicAnalysis(student: Student): AIAnalysisResult {
  const isHighRisk = student.risk_level === 'High';
  const isPlacementDeficit = student.academic_marks_pct >= 75 && student.placement_readiness_pct < 60;
  const isAttendanceDeficit = student.attendance_pct < 65;
  const isLmsDeficit = student.lms_completion_pct < 50;

  let diagnosticSummary = '';
  if (isHighRisk) {
    diagnosticSummary = `${student.name} presents a compounded risk profile with ${student.attendance_pct}% attendance and ${student.academic_marks_pct}% academic performance. Data shows concurrent decline across LMS participation (${student.lms_completion_pct}%), suggesting potential disengagement or academic overwhelm requiring swift faculty intervention.`;
  } else if (isPlacementDeficit) {
    diagnosticSummary = `${student.name} exhibits remarkable core academic aptitude (${student.academic_marks_pct}% marks, CGPA ${student.cgpa}), but displays a sharp divergence in placement readiness (${student.placement_readiness_pct}%) and mock interview performance (${student.mock_interview_score}/100). The student requires targeted communication and practical interview drills rather than academic remediation.`;
  } else {
    diagnosticSummary = `${student.name} demonstrates a stable holistic trajectory with a Success Score of ${student.success_score}/100. Key metrics in attendance (${student.attendance_pct}%) and course deliverables indicate consistent study habits. Minor optimization in advanced industry certifications will accelerate tier-1 placement prospects.`;
  }

  const keyStrengths: string[] = [];
  if (student.cgpa >= 8.0) keyStrengths.push(`Strong academic foundation (CGPA ${student.cgpa})`);
  else if (student.attendance_pct >= 85) keyStrengths.push(`High attendance dedication (${student.attendance_pct}%)`);
  else keyStrengths.push(`Active participation in foundational assessments`);

  if (student.skills_count >= 4) keyStrengths.push(`Broad technical skill portfolio (${student.skills_count} verified competencies)`);
  else if (student.coding_rating >= 75) keyStrengths.push(`Solid technical problem-solving index (${student.coding_rating}/100)`);
  else keyStrengths.push(`Receptive to structured mentoring and assignments`);

  const criticalGaps: string[] = [];
  if (isAttendanceDeficit) criticalGaps.push(`Sub-threshold attendance (${student.attendance_pct}%) violating examination criteria`);
  if (student.academic_marks_pct < 55) criticalGaps.push(`Below benchmark internal midterm scores in foundational modules`);
  if (isLmsDeficit) criticalGaps.push(`Minimal LMS asynchronous coursework (${student.lms_hours_per_week}h/week vs 10h target)`);
  if (student.placement_readiness_pct < 50) criticalGaps.push(`Placement mock interview hesitation and resume readiness gap (${student.placement_readiness_pct}%)`);
  if (criticalGaps.length === 0) criticalGaps.push(`Niche advanced specialization certifications yet to be completed`);

  const actionPlan = [
    {
      phase: 'Phase 1: Immediate Stabilization (Days 1–10)',
      action: isAttendanceDeficit
        ? 'Schedule mandatory 1-on-1 advisor counseling session and send official attendance notification'
        : 'Conduct diagnostic skill audit and review syllabus milestones with course mentor',
      metric: isAttendanceDeficit ? 'Attendance target >= 75%' : 'Milestone completion 100%',
    },
    {
      phase: 'Phase 2: Targeted Remediation (Weeks 2–4)',
      action: isPlacementDeficit
        ? 'Enroll in peer mock interview clinic with placement mentors, focusing on behavioral and tech questions'
        : 'Assign peer study cohort for problem-solving in lowest scoring subjects and schedule 2 weekly lab reviews',
      metric: isPlacementDeficit ? 'Mock score >= 70/100' : 'Midterm reassessment score >= 65%',
    },
    {
      phase: 'Phase 3: Outcome Validation (Weeks 5–8)',
      action: 'Evaluate LMS module completion, check student sentiment survey, and confirm intervention milestone sign-off',
      metric: 'Success Score recovery to > 75/100',
    },
  ];

  const mentorDiscussionPrompts = [
    `"I noticed your attendance shifted from previous months—are there external schedule conflicts, health concerns, or commute difficulties we can accommodate?"`,
    `"You have strong analytical grasp in concepts, but your test/interview mock score was lower—how do you feel when presenting under time pressure?"`,
    `"What specific modules in your curriculum feel most difficult right now, and which peer study group or lab hours would support you best?"`,
  ];

  const recommendedInterventions: AIAnalysisResult['recommendedInterventions'] = [];
  if (isAttendanceDeficit) {
    recommendedInterventions.push({
      category: 'Attendance Warning',
      title: 'Formal Attendance Advisory & Parent Notification',
      priority: 'Critical',
      expectedOutcome: 'Restore weekly attendance rate above 80% threshold',
    });
  }
  if (student.academic_marks_pct < 60) {
    recommendedInterventions.push({
      category: 'Academic Tutoring',
      title: 'Remedial Subject Coaching & Problem Solving Lab',
      priority: 'High',
      expectedOutcome: 'Improve internal assessment marks by at least 15%',
    });
  }
  if (isPlacementDeficit) {
    recommendedInterventions.push({
      category: 'Placement & Interview Prep',
      title: 'Intensive Technical Mock Interview & GD Rehearsal',
      priority: 'High',
      expectedOutcome: 'Elevate placement readiness index from ' + student.placement_readiness_pct + '% to 75%+',
    });
  }
  if (isLmsDeficit) {
    recommendedInterventions.push({
      category: 'LMS Engagement',
      title: 'Digital Learning Assignment Recovery Track',
      priority: 'Medium',
      expectedOutcome: 'Achieve 100% submission on overdue asynchronous units',
    });
  }
  if (recommendedInterventions.length === 0) {
    recommendedInterventions.push({
      category: 'Faculty Mentoring',
      title: 'Honors Research / High-Impact Project Mentorship',
      priority: 'Low',
      expectedOutcome: 'Prepare for campus hackathons and tier-1 corporate interviews',
    });
  }

  return {
    diagnosticSummary,
    keyStrengths,
    criticalGaps,
    actionPlan,
    mentorDiscussionPrompts,
    recommendedInterventions,
  };
}
