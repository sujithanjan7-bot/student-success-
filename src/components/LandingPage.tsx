import React from 'react';
import { 
  ArrowRight, 
  BrainCircuit, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  PieChart, 
  Database, 
  BookOpen, 
  Briefcase, 
  Award,
  Layers,
  BarChart3
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onExploreAtRisk: () => void;
  onOpenImport: () => void;
  onOpenSupabase: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onExploreAtRisk,
  onOpenImport,
  onOpenSupabase,
}) => {
  return (
    <div className="relative text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brief & Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Student Success &bull; Smart Campus Decision Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Student Success Platform <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Predict, Optimize & Improve Student Success
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Colleges generate vast data across attendance, internal exams, LMS modules, and placement participation, 
              yet records remain locked in disconnected silos. The Student Success Platform unifies student signals, calculates an explainable 
              <strong className="text-white font-semibold"> Student Success Score</strong>, flags at-risk students proactively, 
              and empowers faculty with targeted, AI-driven intervention plans before dropouts or placement failures occur.
            </p>

            {/* Benchmark Showcase Card (from prompt brief) */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-700/80 p-4 sm:p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-blue-400" />
                  Live Heuristic Evaluation Example
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-semibold">
                  High Risk Flagged
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3">
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">Attendance</div>
                  <div className="text-sm font-bold text-red-400">62%</div>
                </div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">Internal Marks</div>
                  <div className="text-sm font-bold text-amber-400">48%</div>
                </div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">LMS Activity</div>
                  <div className="text-sm font-bold text-slate-300">Low (38%)</div>
                </div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">Placement Ready</div>
                  <div className="text-sm font-bold text-red-400">35 / 100</div>
                </div>
              </div>
              <div className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">AI Diagnostic Outcome: </span>
                  Success Score: <span className="text-amber-400 font-bold">42/100</span>. Root cause: Compound deficit in attendance & core math. 
                  Recommended Action: <span className="text-blue-300 font-medium">Faculty mentoring, attendance monitoring & remedial calculus</span>.
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onEnterDashboard}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreAtRisk}
                className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 backdrop-blur-md flex items-center space-x-2 transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>View At-Risk Students</span>
              </button>

              <button
                onClick={onOpenImport}
                className="px-4 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-700/60 flex items-center space-x-2 transition-all"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Import CSV Data</span>
              </button>
            </div>

            {/* Metrics highlight */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-xs text-slate-400">Explainable Scoring</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400">5-in-1</div>
                <div className="text-xs text-slate-400">Unified Data Streams</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-400">Early</div>
                <div className="text-xs text-slate-400">Risk Intervention Trigger</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/70 shadow-2xl shadow-blue-900/30 group">
              <img
                src="/src/assets/images/campus_hero_students_1791654402180.jpg"
                alt="Students collaborating with modern campus analytics"
                className="w-full h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              {/* Overlay Badge */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold text-white">Institution-Wide Predictive Engine</span>
                  </div>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded border border-blue-500/30">
                    Real-time
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Continuous tracking of internal assessments, daily biometric attendance, asynchronous LMS participation, and placement mock interviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Functional Pillars */}
      <section className="py-16 bg-slate-950/60 border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-400 mb-2">Architectural Blueprint</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Converting Disconnected Student Records into Actionable Decision Intelligence
            </h3>
            <p className="text-sm text-slate-400 mt-3">
              Faculty cannot manually inspect hundreds of marks sheets, attendance registers, and LMS logs. 
              Our five core modules handle data normalization, machine scoring, and structured intervention delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {/* Pillar 1 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">1. Unified Integration</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aggregates CSV and API feeds for Attendance, Exams, LMS, Skills, and Placement Readiness keyed on unique Student ID.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">2. Transparent Scoring</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates a 0–100 Success Score using configurable institutional weightings (35% Academics, 25% Attendance, 15% LMS, 15% Placement, 10% Skills).
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-red-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">3. At-Risk Detection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-factor risk rules identify students with dipping attendance, falling internal marks, or dormant online participation before final exams.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">4. Cohort Segmentation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Auto-clusters students into actionable personas such as "High Academics, Low Placement Readiness" or "Consistent Improvers".
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">5. AI Interventions</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates personalized pedagogical action plans, mentor talking points, and tracks intervention lifecycle to measured completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explainable AI: "Why This Score?" Deep Dive Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-indigo-950/60 rounded-3xl border border-slate-800 p-8 lg:p-12 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
                <BrainCircuit className="w-3.5 h-3.5 text-blue-400" />
                <span>Explainable AI & Trust</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                No Black Boxes: Complete Transparency in Every Prediction
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                In academic environments, algorithms must never act as arbitrary gatekeepers. CampusAI 
                provides an auditable <span className="text-white font-semibold">"Why This Score?"</span> breakdown 
                for every individual student, showing exactly how attendance, test scores, LMS hours, and skills contributed 
                to their rating.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Configurable weights editable by College Academic Council</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Actionable root causes pinpointed (e.g. "Attendance shortfall: 58%")</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Evidence-backed faculty mentoring scripts generated in seconds</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={onOpenSupabase}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 flex items-center space-x-1"
                >
                  <Database className="w-3.5 h-3.5 mr-1" />
                  <span>View Database Architecture & PostgreSQL Schema</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              {/* Interactive Visual Breakdown Simulation */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-xs text-slate-400">Student Profile Analysis</div>
                    <div className="text-sm font-bold text-white">Priya Sharma (STU-1002) - ECE Dept</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Computed Score:</span>
                    <span className="ml-1 text-sm font-black text-amber-400">42 / 100</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Academic Marks (Weight: 35%)</span>
                      <span className="font-semibold text-amber-400">48% Score (Contrib: 17 pts)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Attendance Rate (Weight: 25%)</span>
                      <span className="font-semibold text-red-400">62% Rate (Contrib: 16 pts)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">LMS Asynchronous Hours (Weight: 15%)</span>
                      <span className="font-semibold text-amber-400">38% Completion (Contrib: 6 pts)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: '38%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Placement Readiness (Weight: 15%)</span>
                      <span className="font-semibold text-red-400">35% Ready (Contrib: 5 pts)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-red-200">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-red-300">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    Triggered Warning Criteria
                  </div>
                  Attendance dropped below statutory 75% requirement. Internal Marks trending down across 2 midterms. Immediate remedial mentoring assigned.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready for Hackathon Showcase Section */}
      <section className="py-12 text-center max-w-4xl mx-auto px-4">
        <h3 className="text-xl font-bold text-white mb-2">Ready to explore real campus analytics?</h3>
        <p className="text-xs text-slate-400 mb-6">
          Switch personas (Administrator, Faculty, Placement Officer, Student), test CSV data uploads, 
          recalibrate weighting parameters, and track live student interventions.
        </p>
        <button
          onClick={onEnterDashboard}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all inline-flex items-center space-x-2"
        >
          <span>Launch Administrator Analytics Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">CampusAI</span>
            <span>– KPMG in India Student Success Hackathon Platform</span>
          </div>
          <div>Smart Campus Analytics: Predict, Optimize & Improve Student Success</div>
          <div className="text-slate-400">Connected with PostgreSQL / Supabase Architecture</div>
        </div>
      </footer>
    </div>
  );
};
