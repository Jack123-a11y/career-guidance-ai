import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MatchRing({ pct, size = 78 }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const color = pct >= 70 ? "#10b981" : pct >= 45 ? "#fbbf24" : "#f87171";
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[19px] font-semibold tracking-[-0.5px]" style={{ color }}>{pct}%</span>
        <span className="text-[9px] text-[#3d375a] font-medium">match</span>
      </div>
    </div>
  );
}

function KeywordTag({ label, present }) {
  return present ? (
    <span className="text-[11px] font-medium px-[11px] py-[3px] rounded-full mr-1.5 mb-1.5 inline-block text-[#34d399] bg-[#34d399]/8 border border-[#34d399]/18">{label}</span>
  ) : (
    <span className="text-[11px] font-medium px-[11px] py-[3px] rounded-full mr-1.5 mb-1.5 inline-block text-[#f87171] bg-[#f87171]/8 border border-[#f87171]/18">{label}</span>
  );
}

export default function JobMatchPage() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // stage: "setup" | "analyzing" | "result" | "error"
  const [stage, setStage] = useState("setup");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [saved, setSaved] = useState(false);

  // ── TODO: replace with the real uploaded resume from backend/auth context,
  // same source as ResumeAnalysisPage / SkillAnalysisPage / MockInterviewPage ──
  const resume = null; // e.g. { name: "Resume_v2.pdf" }

  // ── Real backend call. Replace once POST /api/jobs/match is ready. ──
  // Expected response shape (matches what the result UI below renders):
  // { matchPct, verdict, verdictNote, presentKeywords: [], missingKeywords: [] }
  const callJobMatchAPI = async () => {
    // const res = await axios.post("/api/jobs/match", { resumeId: resume.id, jobTitle, company, jobDescription }, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return res.data;

    throw new Error("Backend not connected yet — job match API is still being built.");
  };

  const handleMatch = async () => {
    if (!resume || !jobDescription.trim()) return;
    setStage("analyzing");
    setErrorMsg("");
    setSaved(false);
    try {
      const data = await callJobMatchAPI();
      setResult(data);
      setStage("result");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong while matching this job.");
      setStage("error");
    }
  };

  // ── TODO: wire to POST /api/jobs/save once it exists — for now this is local-only state ──
  const handleSaveJob = () => setSaved(true);

  return (
    <div className="min-h-screen bg-[#0d0b1a] px-7 py-7" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>

      <div className="text-[12px] text-[#3d375a] mb-1">
        <span className="text-[#7c3aed] cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span> / Job match
      </div>

      {/* ───────── STAGE: SETUP ───────── */}
      {stage === "setup" && (
        <>
          <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mt-1 mb-1.5">Job match</h1>
          <p className="text-[13px] text-[#5b5475] leading-relaxed mb-8">
            Paste a job description and see how well your resume matches it
          </p>

          <div className="grid grid-cols-[1fr_0.85fr] gap-[14px] max-w-[1000px]">

            <div className="bg-[#120f26] border border-[#7c3aed]/20 rounded-2xl px-7 py-7">
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <p className="text-[12px] text-[#5b5475] mb-2">Job title</p>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Backend Engineer"
                    className="w-full bg-white text-[#0d0b1a] text-[13.5px] px-3.5 py-2.5 rounded-[9px] outline-none placeholder:text-[#9d9ab0]"
                  />
                </div>
                <div>
                  <p className="text-[12px] text-[#5b5475] mb-2">Company <span className="text-[#3d375a]">(optional)</span></p>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-white text-[#0d0b1a] text-[13.5px] px-3.5 py-2.5 rounded-[9px] outline-none placeholder:text-[#9d9ab0]"
                  />
                </div>
              </div>

              <p className="text-[12px] text-[#5b5475] mb-2">Job description</p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here — responsibilities, requirements, qualifications..."
                rows={9}
                className="w-full bg-white text-[#0d0b1a] text-[13px] leading-relaxed px-3.5 py-3 rounded-[9px] outline-none resize-none placeholder:text-[#9d9ab0] mb-6"
              />

              <p className="text-[12px] text-[#5b5475] mb-2">Resume</p>
              {resume ? (
                <div className="flex items-center gap-3 bg-[#7c3aed]/6 border border-[#7c3aed]/20 rounded-[12px] px-4 py-3.5 mb-6">
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
                  className="flex items-center gap-3 bg-white/3 border border-dashed border-white/10 rounded-[12px] px-4 py-3.5 mb-6 cursor-pointer hover:border-[#7c3aed]/30 transition-all"
                >
                  <div className="w-9 h-9 rounded-[9px] bg-white/5 flex items-center justify-center text-[16px] text-[#5b5475] flex-shrink-0">
                    <i className="ti ti-file-upload" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-medium text-[#9d8fc0]">No resume on file</p>
                    <p className="text-[11.5px] text-[#3d375a] mt-0.5">Upload your resume first — job matching reads from it directly</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleMatch}
                disabled={!resume || !jobDescription.trim()}
                className="w-full text-[13.5px] text-white font-medium px-5 py-3.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed rounded-[10px] transition-all"
              >
                {!resume ? "Upload a resume to continue" : !jobDescription.trim() ? "Paste a job description to continue" : "Check match"}
              </button>
            </div>

            {/* saved jobs — genuine empty state until /api/jobs/saved exists */}
            <div>
              <p className="text-[11px] font-medium text-[#3d375a] tracking-[.07em] mb-2.5">SAVED JOBS</p>
              <div className="flex flex-col items-center text-center px-5 py-9 bg-[#120f26] border border-dashed border-white/8 rounded-[11px]">
                <div className="w-9 h-9 rounded-lg bg-white/4 flex items-center justify-center text-[16px] text-[#3d375a] mb-3">
                  <i className="ti ti-bookmark" aria-hidden="true" />
                </div>
                <p className="text-[12px] text-[#5b5475] mb-1">No saved jobs yet</p>
                <p className="text-[11px] text-[#3d375a] leading-relaxed max-w-[220px]">
                  Bookmark a job after checking its match and it'll show up here.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ───────── STAGE: ANALYZING ───────── */}
      {stage === "analyzing" && (
        <>
          <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mt-1 mb-1.5">Checking your match</h1>
          <p className="text-[13px] text-[#5b5475] leading-relaxed mb-10">Comparing your resume against this job description</p>

          <div className="max-w-[480px] mx-auto mt-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center text-[28px] mx-auto mb-[22px] relative">
              <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-[#7c3aed] animate-spin" />
              <i className="ti ti-briefcase text-[#a78bfa]" aria-hidden="true" />
            </div>
            <p className="text-[13px] text-[#5b5475] leading-relaxed max-w-[360px] mx-auto">
              Gemini AI is comparing your resume's skills and experience against {jobTitle || "this role"}'s requirements
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
          <p className="text-[15px] font-medium text-[#ede9fe] mb-2">Couldn't check this match</p>
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
                <i className="ti ti-check text-[11px]" aria-hidden="true" /> Match complete
              </div>
              <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mb-1">
                {jobTitle || "This role"}{company && <span className="text-[#5b5475] font-normal"> · {company}</span>}
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveJob}
                disabled={saved}
                className="flex items-center text-[12px] text-[#5b5475] px-4 py-2 border border-white/8 rounded-[9px] hover:bg-white/4 hover:text-[#9d8fc0] disabled:opacity-50 transition-all"
              >
                <i className={`ti ${saved ? "ti-bookmark-filled text-[#a78bfa]" : "ti-bookmark"} text-[13px] mr-1.5`} aria-hidden="true" />
                {saved ? "Saved" : "Save job"}
              </button>
              <button
                onClick={() => { setStage("setup"); setResult(null); }}
                className="text-[12px] text-white font-medium px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-[9px] transition-all"
              >
                Check another job
              </button>
            </div>
          </div>

          <div className="bg-[#120f26] border border-white/6 rounded-2xl p-[19px] mb-[13px]">
            <div className="flex items-center gap-4">
              <MatchRing pct={result.matchPct} />
              <div>
                <p className="text-[13.5px] font-medium text-[#ede9fe] mb-1">{result.verdict}</p>
                <p className="text-[11.5px] text-[#5b5475] leading-[1.5]">{result.verdictNote}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#120f26] border border-white/6 rounded-2xl p-[19px]">
            <p className="text-[13px] font-medium text-[#9d8fc0] mb-3.5">Keywords</p>
            <p className="text-[10.5px] text-[#3d375a] font-medium tracking-[.04em] mb-2">PRESENT IN YOUR RESUME</p>
            <div className="mb-3.5">
              {result.presentKeywords.map((k) => <KeywordTag key={k} label={k} present />)}
            </div>
            <p className="text-[10.5px] text-[#3d375a] font-medium tracking-[.04em] mb-2">MISSING FROM YOUR RESUME</p>
            <div>
              {result.missingKeywords.map((k) => <KeywordTag key={k} label={k} present={false} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
