import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'KPMG CampusAI Analytics Engine',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Gemini AI Diagnostic Proxy
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY configured. Fallback engine activated.',
      });
    }

    const { student, weights } = req.body;
    if (!student) {
      return res.status(400).json({ error: 'Missing student data in payload' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a Senior Academic Advisor and Student Analytics Specialist at KPMG Higher Education Practice.
Analyze the following student profile rigorously based on institutional data:

STUDENT PROFILE:
- Name: ${student.name} (ID: ${student.student_id})
- Department: ${student.department}, Year: ${student.year}
- Attendance: ${student.attendance_pct}%
- Internal Assessment Marks: ${student.academic_marks_pct}%
- LMS Module Completion: ${student.lms_completion_pct}% (${student.lms_hours_per_week} hrs/week)
- Placement Readiness Score: ${student.placement_readiness_pct}/100
- Mock Interview Rating: ${student.mock_interview_score}/100
- Coding / Tech Rating: ${student.coding_rating}/100
- Soft Skills: ${student.soft_skills_rating}/100
- Computed Success Score: ${student.success_score}/100 (Risk: ${student.risk_level})
- Risk Factors: ${student.risk_factors?.join('; ') || 'None'}
- Current Scoring Weights Applied: Academics ${weights?.academics || 35}%, Attendance ${weights?.attendance || 25}%, LMS ${weights?.lms || 15}%, Skills ${weights?.skills || 10}%, Placement ${weights?.placement || 15}%

Return a strictly valid JSON response (NO markdown, no backticks, only pure JSON) conforming to this exact schema:
{
  "diagnosticSummary": "A concise, actionable 2-3 sentence root-cause assessment explaining why this score was assigned and what underlying factors contributed.",
  "keyStrengths": ["Strength 1", "Strength 2"],
  "criticalGaps": ["Critical gap 1", "Critical gap 2"],
  "actionPlan": [
    { "phase": "Phase 1: Immediate Stabilization (Days 1–10)", "action": "Specific concrete action", "metric": "Target verifiable metric" },
    { "phase": "Phase 2: Targeted Remediation (Weeks 2–4)", "action": "Specific concrete action", "metric": "Target verifiable metric" },
    { "phase": "Phase 3: Outcome Validation (Weeks 5–8)", "action": "Specific concrete action", "metric": "Target verifiable metric" }
  ],
  "mentorDiscussionPrompts": [
    "Discussion prompt 1 for faculty mentor",
    "Discussion prompt 2 for faculty mentor",
    "Discussion prompt 3 for faculty mentor"
  ],
  "recommendedInterventions": [
    {
      "category": "Faculty Mentoring",
      "title": "Clear action title",
      "priority": "High",
      "expectedOutcome": "Measurable expected outcome"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    return res.json({
      success: true,
      analysis: parsed,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(200).json({
      fallback: true,
      error: error.message || 'API error',
    });
  }
});

// Start Vite middleware and server
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 KPMG CampusAI server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
