import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


const TARGET_ROLES = [
  "Java Backend Developer",
  "Frontend Developer (React)",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Android Developer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
];





export default function SkillAnalysisPage() {
  const navigate = useNavigate();

  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0]);

  // stage: "setup" | "analyzing" | "result" | "error"
  const [stage, setStage] = useState("setup");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [resume, setResume] = useState(null);

  useEffect(() => {
    api.get("/resume/status")
      .then(res => {
        if (res.data.hasResume) {
          setResume({ name: res.data.fileName, id: res.data.resumeId });
        }
      })
      .catch(() => setResume(null));
  }, []);

  // ── Real backend call. Replace once POST /api/skills/analyze is ready. ──
  // Expected response shape (matches what the result UI below renders):
  // { matched: [{ name, level, status }], gaps: [{ skill, trending }],
  //   readinessScore, readinessNote }
  const callSkillAnalysisAPI = async () => {
    const res = await api.post("/skills/analyze", { targetRole });
    return res.data; // { currentSkills, missingSkills, recommendations }
  };

  const handleAnalyze = async () => {
    if (!resume) return;
    setStage("analyzing");
    setErrorMsg("");
    try {
      const data = await callSkillAnalysisAPI();
      setResult(data);
      setStage("result");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong while analysing your skills.");
      setStage("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0b1a] px-7 py-7" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>

      <div className="text-[12px] text-[#3d375a] mb-1">
        <span className="text-[#7c3aed] cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span> / Skill analysis
      </div>

      {/* ───────── STAGE: SETUP ───────── */}
      {stage === "setup" && (
        <>
          <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mt-1 mb-1.5">Skill analysis</h1>
          <p className="text-[13px] text-[#5b5475] leading-relaxed mb-8">
            See your skill gap against any target role, based on your resume
          </p>

          <div className="max-w-[680px] bg-[#120f26] border border-[#7c3aed]/20 rounded-2xl px-7 py-7">

            <p className="text-[12.5px] text-[#5b5475] mb-2">Target role</p>
            <div className="relative mb-6">
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full appearance-none bg-white text-[#0d0b1a] text-[15px] px-4 py-3.5 rounded-[10px] outline-none cursor-pointer"
              >
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[16px] text-[#0d0b1a] pointer-events-none" aria-hidden="true" />
            </div>

            <p className="text-[12.5px] text-[#5b5475] mb-2">Resume</p>
            {resume ? (
              <div className="flex items-center gap-3 bg-[#7c3aed]/6 border border-[#7c3aed]/20 rounded-[12px] px-4 py-3.5 mb-7">
                <div className="w-9 h-9 rounded-[9px] bg-[#7c3aed]/15 flex items-center justify-center text-[16px] text-[#a78bfa] flex-shrink-0">
                  <i className="ti ti-file-text" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[13.5px] font-medium text-[#ede9fe]">{resume.name}</p>
                  <p className="text-[11.5px] text-[#5b5475] mt-0.5">Already on file — AI will use this</p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => navigate("/dashboard/resume")}
                className="flex items-center gap-3 bg-white/3 border border-dashed border-white/10 rounded-[12px] px-4 py-3.5 mb-7 cursor-pointer hover:border-[#7c3aed]/30 transition-all"
              >
                <div className="w-9 h-9 rounded-[9px] bg-white/5 flex items-center justify-center text-[16px] text-[#5b5475] flex-shrink-0">
                  <i className="ti ti-file-upload" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[13.5px] font-medium text-[#9d8fc0]">No resume on file</p>
                  <p className="text-[11.5px] text-[#3d375a] mt-0.5">Upload your resume first — skill analysis reads from it directly</p>
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!resume}
              className="w-full text-[13.5px] text-white font-medium px-5 py-3.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed rounded-[10px] transition-all"
            >
              {resume ? "Analyze my skills" : "Upload a resume to continue"}
            </button>
          </div>
        </>
      )}

      {/* ───────── STAGE: ANALYZING ───────── */}
      {stage === "analyzing" && (
        <>
          <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mt-1 mb-1.5">Analysing your skills</h1>
          <p className="text-[13px] text-[#5b5475] leading-relaxed mb-10">Comparing your resume against {targetRole}</p>

          <div className="max-w-[480px] mx-auto mt-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-[28px] mx-auto mb-[22px] relative">
              <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-[#7c3aed] animate-spin" />
              <i className="ti ti-chart-bar text-[#a78bfa]" aria-hidden="true" />
            </div>
            <p className="text-[13px] text-[#5b5475] leading-relaxed max-w-[360px] mx-auto">
              Gemini AI is mapping your skills against the {targetRole} taxonomy and current market trends
            </p>
          </div>
        </>
      )}

      {/* ───────── STAGE: ERROR ───────── */}
      {stage === "error" && (
        <div className="max-w-[480px] mx-auto mt-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#f87171]/10 border border-[#f87171]/20 flex items-center justify-center text-[24px] text-[#f87171] mx-auto mb-5">
            <i className="ti ti-alert-triangle" aria-hidden="true" />
          </div>
          <p className="text-[15px] font-medium text-[#ede9fe] mb-2">Couldn't analyse your skills</p>
          <p className="text-[13px] text-[#5b5475] leading-relaxed mb-6">{errorMsg}</p>
          <button
            onClick={() => setStage("setup")}
            className="text-[12.5px] text-white font-medium px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-[9px] transition-all"
          >
            Try again
          </button>
        </div>
      )}

      {/* ───────── STAGE: RESULT ───────── */}
      {stage === "result" && result && (
        <>
          <div className="flex items-center justify-between mb-5 mt-1">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11.5px] text-[#10b981] bg-[#10b981]/9 border border-[#10b981]/18 rounded-full px-3 py-1 mb-2.5">
                <i className="ti ti-check text-[11px]" aria-hidden="true" /> Analysis complete
              </div>
              <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mb-1">Skill gap report</h1>
              <p className="text-[13px] text-[#5b5475]">Target role: {targetRole}</p>
            </div>
            <button
              onClick={() => { setStage("setup"); setResult(null); }}
              className="text-[12px] text-white font-medium px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-[9px] transition-all"
            >
              Re-run analysis
            </button>
          </div>

          <div className="bg-[#120f26] border border-white/6 rounded-2xl p-[19px] mb-[13px]">
            <p className="text-[13px] font-medium text-[#10b981] mb-2.5">Current skills</p>
            <p className="text-[12.5px] text-[#9d8fc0] leading-[1.65] whitespace-pre-line">{result.currentSkills}</p>
          </div>

          <div className="bg-[#120f26] border border-white/6 rounded-2xl p-[19px] mb-[13px]">
            <p className="text-[13px] font-medium text-[#f87171] mb-2.5">Missing for this role</p>
            <p className="text-[12.5px] text-[#9d8fc0] leading-[1.65] whitespace-pre-line">{result.missingSkills}</p>
          </div>

          <div className="bg-[#120f26] border border-white/6 rounded-2xl p-[19px] mb-[13px]">
            <p className="text-[13px] font-medium text-[#a78bfa] mb-2.5">Recommendations</p>
            <p className="text-[12.5px] text-[#9d8fc0] leading-[1.65] whitespace-pre-line">{result.recommendations}</p>
          </div>

          <div className="flex gap-[11px]">
            {[
              { icon: "ti-map",       title: "Build a roadmap", sub: "Turn these gaps into a learning plan", path: "/dashboard/roadmap" },
              { icon: "ti-briefcase", title: "Match to jobs",   sub: "See how you stack up against real listings", path: "/dashboard/jobs" },
            ].map(c => (
              <div
                key={c.path}
                onClick={() => navigate(c.path)}
                className="flex-1 bg-[#120f26] border border-white/6 rounded-2xl p-4 cursor-pointer transition-all hover:border-[#7c3aed]/25 hover:bg-[#15122c]"
              >
                <div className="w-8 h-8 rounded-[9px] bg-[#7c3aed]/10 flex items-center justify-center text-[15px] text-[#a78bfa] mb-2.5">
                  <i className={`ti ${c.icon}`} aria-hidden="true" />
                </div>
                <p className="text-[12.5px] font-medium text-[#ede9fe] mb-1">{c.title}</p>
                <p className="text-[11px] text-[#5b5475] leading-[1.4]">{c.sub}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
