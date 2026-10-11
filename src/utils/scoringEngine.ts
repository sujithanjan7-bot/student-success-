import { Student, ScoringWeights, RiskLevel } from '../types/student';

export const DEFAULT_WEIGHTS: ScoringWeights = {
  academics: 35,
  attendance: 25,
  lms: 15,
  skills: 10,
  placement: 15,
};

export function calculateSuccessScore(
  student: Omit<Student, 'success_score' | 'risk_level' | 'risk_factors' | 'risk_explanation' | 'segment' | 'interventions'> & { interventions?: Student['interventions'] },
  weights: ScoringWeights = DEFAULT_WEIGHTS
): {
  score: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
  explanation: string;
  segment: string;
  components: {
    academicsWeighted: number;
    attendanceWeighted: number;
    lmsWeighted: number;
    skillsWeighted: number;
    placementWeighted: number;
  };
} {
  const totalWeight =
    weights.academics +
    weights.attendance +
    weights.lms +
    weights.skills +
    weights.placement;

  const validTotalWeight = totalWeight > 0 ? totalWeight : 100;

  // Normalized indicators (0-100)
  const acadScore = Math.min(100, Math.max(0, student.academic_marks_pct));
  const attScore = Math.min(100, Math.max(0, student.attendance_pct));
  const lmsScore = Math.min(100, Math.max(0, student.lms_completion_pct));
  const skillsScore = Math.min(100, Math.max(0, (student.skills_count * 15 + student.extracurricular_score) / 2));
  const placeScore = Math.min(100, Math.max(0, student.placement_readiness_pct));

  const weightedSum =
    acadScore * weights.academics +
    attScore * weights.attendance +
    lmsScore * weights.lms +
    skillsScore * weights.skills +
    placeScore * weights.placement;

  const finalScore = Math.round(weightedSum / validTotalWeight);

  // Risk Factors Extraction
  const riskFactors: string[] = [];
  if (attScore < 65) riskFactors.push(`Critical Attendance: ${attScore}% (< 65% minimum)`);
  else if (attScore < 75) riskFactors.push(`Low Attendance: ${attScore}% (borderline 75%)`);

  if (acadScore < 50) riskFactors.push(`Severe Academic Deficit: ${acadScore}% internal average`);
  else if (acadScore < 60) riskFactors.push(`Academic Performance Concern: ${acadScore}% marks`);

  if (lmsScore < 50) riskFactors.push(`Low LMS Engagement: ${lmsScore}% module completion`);
  if (placeScore < 45) riskFactors.push(`Weak Placement Readiness: ${placeScore}/100 rating`);
  if (student.mock_interview_score < 50) riskFactors.push(`Mock Interview Score: ${student.mock_interview_score}/100`);

  // Risk Level Determination
  let riskLevel: RiskLevel = 'Low';
  if (finalScore < 55 || attScore < 65 || (acadScore < 50 && placeScore < 50)) {
    riskLevel = 'High';
  } else if (finalScore < 72 || attScore < 75 || placeScore < 60 || acadScore < 60) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'Low';
  }

  // Explanation Formulation
  let explanation = '';
  if (riskLevel === 'High') {
    explanation = `High academic/retention risk flagged. Score of ${finalScore}/100 is depressed primarily by ${
      riskFactors.length > 0 ? riskFactors.join(', ') : 'composite indicator shortfall'
    }. Immediate proactive intervention recommended.`;
  } else if (riskLevel === 'Medium') {
    explanation = `Moderate vulnerability detected (${finalScore}/100). Student demonstrates acceptable baseline performance but needs targeted support in ${
      placeScore < 60 ? 'placement readiness' : attScore < 75 ? 'attendance consistency' : 'assessment mastery'
    }.`;
  } else {
    explanation = `Strong holistic progress (${finalScore}/100). Demonstrates stable attendance (${attScore}%), consistent academic marks (${acadScore}%), and robust readiness indicators.`;
  }

  // Segmentation Classification
  let segment = 'Balanced Achiever';
  if (acadScore >= 75 && placeScore < 55) {
    segment = 'High Academic, Low Placement Readiness';
  } else if (acadScore < 60 && attScore < 70) {
    segment = 'Low Academic, Low Attendance';
  } else if (acadScore >= 75 && lmsScore < 55) {
    segment = 'High Academic, Low LMS Engagement';
  } else if (acadScore >= 80 && placeScore >= 80 && attScore >= 85) {
    segment = 'Placement-Ready Champions';
  } else if (acadScore >= 60 && acadScore < 75 && attScore >= 75) {
    segment = 'Consistent Improvers';
  } else if (acadScore < 60) {
    segment = 'Students Requiring Academic Mentoring';
  }

  return {
    score: finalScore,
    riskLevel,
    riskFactors,
    explanation,
    segment,
    components: {
      academicsWeighted: Math.round((acadScore * weights.academics) / validTotalWeight),
      attendanceWeighted: Math.round((attScore * weights.attendance) / validTotalWeight),
      lmsWeighted: Math.round((lmsScore * weights.lms) / validTotalWeight),
      skillsWeighted: Math.round((skillsScore * weights.skills) / validTotalWeight),
      placementWeighted: Math.round((placeScore * weights.placement) / validTotalWeight),
    },
  };
}

export function recomputeStudentWithWeights(student: Student, weights: ScoringWeights): Student {
  const result = calculateSuccessScore(student, weights);
  return {
    ...student,
    success_score: result.score,
    risk_level: result.riskLevel,
    risk_factors: result.riskFactors,
    risk_explanation: result.explanation,
    segment: result.segment,
  };
}
