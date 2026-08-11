import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";



const STEPS = [
  "Extracted text from PDF",
  "Identified skills and experience",
  "Scoring against job market standards",
  "Generating improvement suggestions",
];

function ScoreRing({ score, size = 78 }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#7c3aed" strokeWidth="7"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[21px] font-semibold text-[#8b5cf6] tracking-[-0.5px]">{score}</span>
        <span className="text-[10px] text-[#3d375a] font-medium">/100</span>
      </div>
    </div>
  );
}


export default function ResumeAnalysisPage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  // stage: "upload" | "analyzing" | "result" | "error"
  const [stage, setStage] = useState("upload");
  const [fileName, setFileName] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ── Real backend call. Replace the body once POST /api/resume/analyze is ready. ──
  // Expected response shape (matches what the result UI below renders):
  // { score, atsScore, missingCount, percentile, verdict, verdictNote,
  //   sections: { experience, skills, summary, education },
  //   improvements: [{ color, text }],
  //   missingKeywords: [], presentKeywords: [],
  //   originalSummary, rewrittenSummary }
  const callResumeAnalysisAPI = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  };

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setStage("analyzing");
    setCurrentStep(0);
    setErrorMsg("");

    // cosmetic step progression while the real request is in flight
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= STEPS.length) clearInterval(interval);
    }, 700);

    try {
      const data = await callResumeAnalysisAPI(file);
      clearInterval(interval);
      setResult(data);
      setStage("result");
    } catch (err) {
      clearInterval(interval);
      setErrorMsg(err.message || "Something went wrong while analysing your resume.");
      setStage("error");
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="min-h-screen bg-[#0d0b1a] px-7 py-7" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>

      <div className="text-[12px] text-[#3d375a] mb-1">
        <span className="text-[#7c3aed] cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span> / Resume analysis
      </div>

      {/* ───────── STAGE 1: UPLOAD ───────── */}
      {stage === "upload" && (
        <>
          <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mt-1 mb-1.5">Resume analysis</h1>
          <p className="text-[13px] text-[#5b5475] leading-relaxed mb-8">
            Upload your resume and get an instant AI-powered score with detailed feedback
          </p>

          <div className="max-w-[560px] mx-auto mt-6">
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="border-[1.5px] border-dashed border-[#7c3aed]/30 rounded-2xl px-8 py-12 text-center bg-[#7c3aed]/3 cursor-pointer transition-all hover:border-[#7c3aed]/50 hover:bg-[#7c3aed]/5"
            >
              <input
                ref={fileRef} type="file" accept=".pdf,.docx" className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <div className="w-14 h-14 rounded-[14px] bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-[24px] text-[#a78bfa] mx-auto mb-[18px]">
                <i className="ti ti-cloud-upload" aria-hidden="true" />
              </div>
              <p className="text-[15px] font-medium text-[#ede9fe] mb-1.5">Drag and drop your resume here</p>
              <p className="text-[12.5px] text-[#5b5475] mb-5">or click to browse from your computer</p>
              <button className="text-[12.5px] text-white font-medium px-[22px] py-2.5 bg-[#7c3aed] rounded-[9px] border-none">
                Choose file
              </button>
              <p className="text-[11px] text-[#3d375a] mt-4">Supports PDF and DOCX · Max file size 5MB</p>
            </div>

            {/* ── Genuine empty state. Once /api/resume/history exists, fetch and render the
                 user's real past uploads here instead of this placeholder. ── */}
            <div className="mt-7">
              <p className="text-[11px] font-medium text-[#3d375a] tracking-[.05em] mb-2.5">PREVIOUS UPLOADS</p>
              <div className="flex flex-col items-center text-center px-5 py-7 bg-[#120f26] border border-dashed border-white/8 rounded-[11px]">
                <div className="w-9 h-9 rounded-lg bg-white/4 flex items-center justify-center text-[16px] text-[#3d375a] mb-3">
                  <i className="ti ti-file-off" aria-hidden="true" />
                </div>
                <p className="text-[12px] text-[#5b5475] mb-1">No resumes analysed yet</p>
                <p className="text-[11px] text-[#3d375a] leading-relaxed max-w-[280px]">
                  Once you upload and analyse a resume, it'll show up here so you can revisit past reports anytime.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ───────── STAGE 2: ANALYZING ───────── */}
      {stage === "analyzing" && (
        <>
          <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mt-1 mb-1.5">Analysing your resume</h1>
          <p className="text-[13px] text-[#5b5475] leading-relaxed mb-10">This usually takes about 20–30 seconds</p>

          <div className="max-w-[480px] mx-auto mt-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-[28px] mx-auto mb-[22px] relative">
              <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-[#7c3aed] animate-spin" />
              <i className="ti ti-sparkles text-[#a78bfa]" aria-hidden="true" />
            </div>
            <p className="text-[16px] font-medium text-[#ede9fe] mb-2">{fileName}</p>
            <p className="text-[13px] text-[#5b5475] leading-relaxed mb-6 max-w-[380px] mx-auto">
              Gemini AI is reading and evaluating your resume against thousands of job descriptions
            </p>

            <div className="inline-block text-left">
              {STEPS.map((label, i) => {
                const status = i < currentStep ? "done" : i === currentStep ? "active" : "wait";
                return (
                  <div key={label} className="flex items-center gap-2.5 py-1.5">
                    <div className={`w-[18px] h-[18px] rounded-[5px] flex items-center justify-center text-[10px] flex-shrink-0
                      ${status === "done" ? "bg-[#10b981]/12 text-[#10b981]" :
                        status === "active" ? "bg-[#7c3aed]/15 text-[#a78bfa]" : "bg-white/4 text-[#3d375a]"}`}>
                      {status === "done" ? <i className="ti ti-check" aria-hidden="true" /> :
                       status === "active" ? <i className="ti ti-loader-2 animate-spin" aria-hidden="true" /> : i + 1}
                    </div>
                    <span className={`text-[12.5px] ${
                      status === "done" ? "text-[#5b5475]" :
                      status === "active" ? "text-[#a78bfa]" : "text-[#3d375a]"}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ───────── STAGE: ERROR (shown until the real backend endpoint is wired) ───────── */}
      {stage === "error" && (
        <div className="max-w-[480px] mx-auto mt-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#f87171]/10 border border-[#f87171]/20 flex items-center justify-center text-[24px] text-[#f87171] mx-auto mb-5">
            <i className="ti ti-alert-triangle" aria-hidden="true" />
          </div>
          <p className="text-[15px] font-medium text-[#ede9fe] mb-2">Couldn't analyse this resume</p>
          <p className="text-[13px] text-[#5b5475] leading-relaxed mb-6">{errorMsg}</p>
          <button
            onClick={() => { setStage("upload"); setResult(null); }}
            className="text-[12.5px] text-white font-medium px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-[9px] transition-all"
          >
            Try again
          </button>
        </div>
      )}

      {/* ───────── STAGE 3: RESULT ───────── */}
      {stage === "result" && result && (
        <>
          <div className="flex items-center justify-between mb-5 mt-1">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11.5px] text-[#10b981] bg-[#10b981]/9 border border-[#10b981]/18 rounded-full px-3 py-1 mb-2.5">
                <i className="ti ti-check text-[11px]" aria-hidden="true" /> Analysis complete
              </div>
              <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mb-1">Your resume report</h1>
              <p className="text-[13px] text-[#5b5475]">{fileName} · analysed just now</p>
            </div>
            <button
              onClick={() => { setStage("upload"); setResult(null); }}
              className="text-[12px] text-white font-medium px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-[9px] transition-all"
            >
              Upload new resume
            </button>
          </div>

          <div className="flex items-center gap-4 bg-[#120f26] border border-white/6 rounded-2xl p-[19px] mb-[13px]">
            <ScoreRing score={result.score ?? 0} />
            <div>
              <p className="text-[13.5px] font-medium text-[#ede9fe] mb-1">Overall resume score</p>
              <p className="text-[11.5px] text-[#5b5475] leading-[1.5]">
                Based on AI analysis of your resume content and structure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[13px] mb-[13px]">
            <div className="bg-[#120f26] border border-white/6 rounded-2xl p-[19px]">
              <p className="text-[13px] font-medium text-[#10b981] mb-2.5">Strengths</p>
              <p className="text-[12.5px] text-[#9d8fc0] leading-[1.65] whitespace-pre-line">{result.strengths}</p>
            </div>
            <div className="bg-[#120f26] border border-white/6 rounded-2xl p-[19px]">
              <p className="text-[13px] font-medium text-[#f87171] mb-2.5">Weaknesses</p>
              <p className="text-[12.5px] text-[#9d8fc0] leading-[1.65] whitespace-pre-line">{result.weaknesses}</p>
            </div>
          </div>

          <div className="bg-[#120f26] border border-white/6 rounded-2xl p-[19px] mb-[13px]">
            <p className="text-[13px] font-medium text-[#a78bfa] mb-2.5">Suggestions</p>
            <p className="text-[12.5px] text-[#9d8fc0] leading-[1.65] whitespace-pre-line">{result.suggestions}</p>
          </div>

          <div className="flex gap-[11px]">
            {[
              { icon: "ti-chart-bar", title: "View skill gap",   sub: "See exactly what to learn next",    path: "/dashboard/skills" },
              { icon: "ti-map",       title: "Generate roadmap",  sub: "Get a personalised learning plan",  path: "/dashboard/roadmap" },
              { icon: "ti-briefcase", title: "Match to jobs",     sub: "Compare against real job listings", path: "/dashboard/jobs" },
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
