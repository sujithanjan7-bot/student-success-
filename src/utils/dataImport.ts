import { Student, ScoringWeights } from '../types/student';
import { calculateSuccessScore, DEFAULT_WEIGHTS } from './scoringEngine';

export interface ValidationError {
  row: number;
  field: string;
  value: string;
  message: string;
}

export interface ImportResult {
  validStudents: Student[];
  errors: ValidationError[];
  totalRowsProcessed: number;
  successCount: number;
  failureCount: number;
}

export function parseAndValidateCSV(
  csvText: string,
  existingStudents: Student[],
  weights: ScoringWeights = DEFAULT_WEIGHTS
): ImportResult {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length < 2) {
    return {
      validStudents: [],
      errors: [{ row: 1, field: 'file', value: '', message: 'CSV file is empty or missing data rows.' }],
      totalRowsProcessed: 0,
      successCount: 0,
      failureCount: 0,
    };
  }

  const rawHeaders = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
  const headerMap: Record<string, number> = {};
  rawHeaders.forEach((h, idx) => {
    headerMap[h] = idx;
  });

  const getCol = (names: string[]): number => {
    for (const name of names) {
      if (headerMap[name] !== undefined) return headerMap[name];
    }
    return -1;
  };

  const idCol = getCol(['student_id', 'studentid', 'id', 'roll_no', 'rollno']);
  const nameCol = getCol(['name', 'student_name', 'full_name']);
  const deptCol = getCol(['department', 'dept', 'branch']);
  const yearCol = getCol(['year', 'academic_year', 'batch']);
  const attCol = getCol(['attendance', 'attendance_pct', 'attendance_percentage', 'att']);
  const marksCol = getCol(['academic_marks_pct', 'marks', 'academic_marks', 'marks_pct', 'score']);
  const lmsCol = getCol(['lms_completion_pct', 'lms_completion', 'lms', 'lms_activity']);
  const placeCol = getCol(['placement_readiness_pct', 'placement_readiness', 'placement', 'placement_score']);

  const errors: ValidationError[] = [];
  const validStudents: Student[] = [];
  const seenIdsInBatch = new Set<string>();
  const existingIds = new Set(existingStudents.map((s) => s.student_id));

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));

    const student_id = idCol !== -1 && cols[idCol] ? cols[idCol] : '';
    const name = nameCol !== -1 && cols[nameCol] ? cols[nameCol] : '';

    if (!student_id) {
      errors.push({ row: rowNum, field: 'student_id', value: '', message: 'Missing mandatory Student ID.' });
      continue;
    }

    if (seenIdsInBatch.has(student_id)) {
      errors.push({ row: rowNum, field: 'student_id', value: student_id, message: 'Duplicate Student ID in uploaded batch.' });
      continue;
    }
    seenIdsInBatch.add(student_id);

    if (existingIds.has(student_id)) {
      errors.push({ row: rowNum, field: 'student_id', value: student_id, message: `Student ID "${student_id}" already exists in the system database.` });
      continue;
    }

    if (!name) {
      errors.push({ row: rowNum, field: 'name', value: '', message: 'Missing student name.' });
      continue;
    }

    // Attendance validation
    const attRaw = attCol !== -1 ? cols[attCol] : '75';
    const attendance_pct = parseFloat(attRaw);
    if (isNaN(attendance_pct) || attendance_pct < 0 || attendance_pct > 100) {
      errors.push({ row: rowNum, field: 'attendance', value: attRaw, message: 'Attendance must be a percentage between 0 and 100.' });
      continue;
    }

    // Marks validation
    const marksRaw = marksCol !== -1 ? cols[marksCol] : '70';
    const academic_marks_pct = parseFloat(marksRaw);
    if (isNaN(academic_marks_pct) || academic_marks_pct < 0 || academic_marks_pct > 100) {
      errors.push({ row: rowNum, field: 'academic_marks', value: marksRaw, message: 'Academic marks must be between 0 and 100.' });
      continue;
    }

    // LMS validation
    const lmsRaw = lmsCol !== -1 ? cols[lmsCol] : '60';
    const lms_completion_pct = parseFloat(lmsRaw);
    if (isNaN(lms_completion_pct) || lms_completion_pct < 0 || lms_completion_pct > 100) {
      errors.push({ row: rowNum, field: 'lms_completion', value: lmsRaw, message: 'LMS completion must be between 0 and 100.' });
      continue;
    }

    // Placement validation
    const placeRaw = placeCol !== -1 ? cols[placeCol] : '50';
    const placement_readiness_pct = parseFloat(placeRaw);
    if (isNaN(placement_readiness_pct) || placement_readiness_pct < 0 || placement_readiness_pct > 100) {
      errors.push({ row: rowNum, field: 'placement_readiness', value: placeRaw, message: 'Placement readiness must be between 0 and 100.' });
      continue;
    }

    // Department normalization
    const deptRaw = deptCol !== -1 && cols[deptCol] ? cols[deptCol].toLowerCase() : 'computer science';
    let department: Student['department'] = 'Computer Science';
    if (deptRaw.includes('elect') || deptRaw.includes('ece')) department = 'Electronics & Comm.';
    else if (deptRaw.includes('info') || deptRaw.includes('it')) department = 'Information Tech.';
    else if (deptRaw.includes('mech') || deptRaw.includes('me')) department = 'Mechanical Eng.';
    else if (deptRaw.includes('mba') || deptRaw.includes('mgmt')) department = 'MBA & Mgmt';

    const yearRaw = yearCol !== -1 && cols[yearCol] ? parseInt(cols[yearCol], 10) : 3;
    const year = ([1, 2, 3, 4].includes(yearRaw) ? yearRaw : 3) as 1 | 2 | 3 | 4;

    const baseStudent: Omit<Student, 'success_score' | 'risk_level' | 'risk_factors' | 'risk_explanation' | 'segment'> = {
      student_id,
      name,
      email: `${student_id.toLowerCase()}@campus.edu.in`,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      department,
      year,
      section: 'A',
      cgpa: Math.round((academic_marks_pct / 10) * 10) / 10,
      attendance_pct,
      academic_marks_pct,
      lms_hours_per_week: Math.round(lms_completion_pct / 8),
      lms_completion_pct,
      skills_count: Math.max(1, Math.round(placement_readiness_pct / 20)),
      certifications: ['Academic Foundations'],
      extracurricular_score: Math.round((attendance_pct + academic_marks_pct) / 2),
      placement_readiness_pct,
      mock_interview_score: placement_readiness_pct,
      coding_rating: Math.round(academic_marks_pct * 0.9),
      soft_skills_rating: Math.round(attendance_pct * 0.9),
      mentor: 'Faculty Advisory Cell',
      created_at: new Date().toISOString().split('T')[0],
      assessments: [
        { subject: 'Core Assessment 1', code: 'MOD-101', internal1: 38, internal2: 40, finalExam: 75, totalMarks: academic_marks_pct, grade: academic_marks_pct > 75 ? 'A' : 'B' },
      ],
      historical_trends: [
        { month: 'Jun', attendance: Math.max(40, attendance_pct - 4), marks: Math.max(40, academic_marks_pct - 3), lms: lms_completion_pct },
        { month: 'Jul', attendance: attendance_pct, marks: academic_marks_pct, lms: lms_completion_pct },
        { month: 'Aug', attendance: attendance_pct, marks: academic_marks_pct, lms: lms_completion_pct },
        { month: 'Sep', attendance: attendance_pct, marks: academic_marks_pct, lms: lms_completion_pct },
        { month: 'Oct', attendance: attendance_pct, marks: academic_marks_pct, lms: lms_completion_pct },
      ],
      interventions: [],
    };

    const evaluated = calculateSuccessScore(baseStudent, weights);
    validStudents.push({
      ...baseStudent,
      success_score: evaluated.score,
      risk_level: evaluated.riskLevel,
      risk_factors: evaluated.riskFactors,
      risk_explanation: evaluated.explanation,
      segment: evaluated.segment,
    });
  }

  return {
    validStudents,
    errors,
    totalRowsProcessed: lines.length - 1,
    successCount: validStudents.length,
    failureCount: errors.length,
  };
}

export function exportStudentsToCSV(students: Student[]): string {
  const headers = [
    'Student ID',
    'Name',
    'Department',
    'Year',
    'Success Score',
    'Risk Level',
    'Attendance %',
    'Academic Marks %',
    'LMS Completion %',
    'Placement Readiness %',
    'Segment',
    'Mentor',
  ];

  const rows = students.map((s) => [
    `"${s.student_id}"`,
    `"${s.name}"`,
    `"${s.department}"`,
    s.year,
    s.success_score,
    `"${s.risk_level}"`,
    s.attendance_pct,
    s.academic_marks_pct,
    s.lms_completion_pct,
    s.placement_readiness_pct,
    `"${s.segment}"`,
    `"${s.mentor}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export const SAMPLE_CSV_CONTENT = `student_id,name,department,year,attendance_pct,academic_marks_pct,lms_completion_pct,placement_readiness_pct
STU-2001,Aarav Mehrotra,Computer Science,3,61,46,32,38
STU-2002,Ishita Sengupta,Electronics & Comm.,4,94,89,92,44
STU-2003,Tanmay Kulkarni,Mechanical Eng.,2,55,42,28,30
STU-2004,Bhavna Rao,Information Tech.,4,96,92,95,94
STU-2005,Zoya Khan,MBA & Mgmt,1,88,85,80,82
STU-2006,Harsh Vardhan,Computer Science,2,72,68,64,65`;
