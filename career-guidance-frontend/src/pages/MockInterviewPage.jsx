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
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const INTERVIEW_TYPES = [
  { id: "technical",  icon: "ti-code",       label: "Technical",  desc: "DSA, system design, tech concepts" },
  { id: "behavioral", icon: "ti-users",       label: "Behavioral", desc: "Soft skills, situational, STAR format" },
  { id: "mixed",      icon: "ti-layout-grid", label: "Mixed",      desc: "Blend of both types" },
];
const QUESTION_COUNT_OPTIONS = [3, 5, 7, 10];
const STEP_LABELS = ["Setup", "Live interview", "Final report"];

// Parses "1. Question text\n2. Question text" into ["Question text", ...]
function parseQuestions(text) {
  if (!text) return [];
  return text
    .split(/\n?\d+\.\s+/)
    .map((q) => q.trim())
    .filter(Boolean);
}

function StepPill({ index, label, active, done }) {
  return (
    <div className={`flex items-center gap-1.5 text-[12.5px] px-4 py-2 rounded-[9px] border transition-all
      ${done  ? "bg-[#10b981]/8 border-[#10b981]/25 text-[#10b981]"
      : active ? "bg-[#7c3aed]/10 border-[#7c3aed]/30 text-[#a78bfa]"
      :          "bg-white/3 border-white/6 text-[#3d375a]"}`}>
      <span className={`w-[16px] h-[16px] rounded-full flex items-center justify-center text-[9.5px] flex-shrink-0
        ${done  ? "bg-[#10b981] text-white"
        : active ? "bg-[#7c3aed] text-white"
        :          "bg-white/6 text-[#3d375a]"}`}>
        {done ? <i className="ti ti-check" /> : index}
      </span>
      {label}
    </div>
  );
}

export default function MockInterviewPage() {
  const navigate = useNavigate();

  // setup
  const [targetRole,    setTargetRole]    = useState(TARGET_ROLES[0]);
  const [difficulty,    setDifficulty]    = useState("Intermediate");
  const [interviewType, setInterviewType] = useState("technical");
  const [questionCount, setQuestionCount] = useState(5);

  // real resume status
  const [resume,        setResume]        = useState(null);
  const [resumeChecked, setResumeChecked]  = useState(false);

  // stage: "setup" | "interview" | "report"
  const [stage,         setStage]         = useState("setup");
  const [interviewId,   setInterviewId]   = useState(null);
  const [questions,     setQuestions]     = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers,       setAnswers]       = useState([]); // [{ question, answer }]
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [report,        setReport]        = useState(null);

  const [loading,  setLoading]  = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isLastQ = currentQIndex === questions.length - 1;

  useEffect(() => {
    api.get("/resume/status")
      .then((res) => {
        if (res.data.hasResume) {
          setResume({ name: res.data.fileName });
        }
      })
      .catch(() => setResume(null))
      .finally(() => setResumeChecked(true));
  }, []);

  const stepState = (i) => {
    if (stage === "setup")     return i === 0 ? "active" : "wait";
    if (stage === "interview") return i === 0 ? "done"   : i === 1 ? "active" : "wait";
    if (stage === "report")    return i < 2   ? "done"   : "active";
  };

  const handleStartInterview = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/interview/start", {
        role: targetRole,
        difficulty,
        interviewType,
        questionCount,
      });
      const parsed = parseQuestions(res.data.questions);
      setInterviewId(res.data.interviewId);
      setQuestions(parsed);
      setCurrentQIndex(0);
      setAnswers([]);
      setCurrentAnswer("");
      setStage("interview");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Couldn't start the interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) return;
    const updated = [...answers, { question: questions[currentQIndex], answer: currentAnswer }];
    setAnswers(updated);
    setCurrentAnswer("");
    setCurrentQIndex((i) => i + 1);
  };

  const handleFinish = async () => {
    if (!currentAnswer.trim()) return;
    const updated = [...answers, { question: questions[currentQIndex], answer: currentAnswer }];
    setAnswers(updated);
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/interview/submit", {
        interviewId,
        answers: updated.map((a, i) => ({
          questionNumber: i + 1,
          question: a.question,
          answer: a.answer,
        })),
      });
      setReport(res.data);
      setStage("report");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Couldn't generate your report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0b1a] px-7 py-7"
      style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>

      {/* step pills */}
      <div className="flex items-center gap-2.5 mb-7">
        {STEP_LABELS.map((label, i) => (
          <StepPill key={label} index={i + 1} label={label}
            active={stepState(i) === "active"} done={stepState(i) === "done"} />
        ))}
      </div>

      <div className="text-[12px] text-[#3d375a] mb-1">
        <span className="text-[#7c3aed] cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span> / Mock interview
      </div>

      {/* ══════════════════════════
          SETUP
      ══════════════════════════ */}
      {stage === "setup" && (
        <>
          <h1 className="text-[22px] font-semibold text-[#ede9fe] tracking-[-0.3px] mt-1 mb-1.5">Mock interview</h1>
          <p className="text-[13px] text-[#5b5475] leading-relaxed mb-8">
            AI asks role-specific questions based on your resume. Type your answers — no voice required.
          </p>

          <div className="max-w-[680px] bg-[#120f26] border border-[#7c3aed]/20 rounded-2xl px-7 py-7">

            <p className="text-[12px] text-[#5b5475] mb-2">Target role</p>
            <div className="relative mb-5">
              <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
                className="w-full appearance-none bg-white text-[#0d0b1a] text-[14.5px] px-4 py-3.5 rounded-[10px] outline-none cursor-pointer">
                {TARGET_ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
              <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-[#0d0b1a] pointer-events-none" />
            </div>

            <p className="text-[12px] text-[#5b5475] mb-2">Difficulty</p>
            <div className="relative mb-5">
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                className="w-full appearance-none bg-white text-[#0d0b1a] text-[14.5px] px-4 py-3.5 rounded-[10px] outline-none cursor-pointer">
                {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
              </select>
              <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-[#0d0b1a] pointer-events-none" />
            </div>

            <p className="text-[12px] text-[#5b5475] mb-2.5">Interview type</p>
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {INTERVIEW_TYPES.map((t) => (
                <div key={t.id} onClick={() => setInterviewType(t.id)}
                  className={`flex flex-col gap-1.5 px-4 py-3.5 rounded-[11px] border cursor-pointer transition-all
                    ${interviewType === t.id
                      ? "bg-[#7c3aed]/10 border-[#7c3aed]/40 text-[#a78bfa]"
                      : "bg-white/3 border-white/6 text-[#5b5475] hover:border-white/12 hover:bg-white/5"}`}>
                  <i className={`ti ${t.icon} text-[17px]`} />
                  <p className="text-[12.5px] font-medium">{t.label}</p>
                  <p className="text-[11px] text-[#3d375a] leading-snug">{t.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-[12px] text-[#5b5475] mb-2.5">Number of questions</p>
            <div className="flex gap-2.5 mb-6">
              {QUESTION_COUNT_OPTIONS.map((n) => (
                <button key={n} onClick={() => setQuestionCount(n)}
                  className={`flex-1 py-2.5 rounded-[10px] text-[13.5px] font-medium border transition-all
                    ${questionCount === n
                      ? "bg-[#7c3aed]/10 border-[#7c3aed]/40 text-[#a78bfa]"
                      : "bg-white/3 border-white/6 text-[#5b5475] hover:border-white/12"}`}>
                  {n}
                </button>
              ))}
            </div>

            <p className="text-[12px] text-[#5b5475] mb-2">Resume</p>

            {!resumeChecked ? (
              <div className="flex items-center gap-2 text-[12px] text-[#5b5475] mb-7 px-4 py-3.5">
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-[#7c3aed] rounded-full animate-spin" />
                Checking your resume...
              </div>
            ) : resume ? (
              <div className="flex items-center gap-3 bg-[#7c3aed]/6 border border-[#7c3aed]/20 rounded-[12px] px-4 py-3.5 mb-7">
                <div className="w-9 h-9 rounded-[9px] bg-[#7c3aed]/15 flex items-center justify-center text-[15px] text-[#a78bfa] flex-shrink-0">
                  <i className="ti ti-file-text" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#ede9fe] truncate">{resume.name}</p>
                  <p className="text-[11.5px] text-[#5b5475] mt-0.5">AI will personalize questions using this resume</p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => navigate("/dashboard/resume")}
                className="flex items-center gap-3 bg-[#f87171]/6 border border-dashed border-[#f87171]/25 rounded-[12px] px-4 py-4 mb-7 cursor-pointer hover:border-[#f87171]/40 hover:bg-[#f87171]/8 transition-all"
              >
                <div className="w-10 h-10 rounded-[10px] bg-[#f87171]/10 border border-[#f87171]/20 flex items-center justify-center text-[18px] text-[#f87171] flex-shrink-0">
                  <i className="ti ti-file-off" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#f87171]">No resume on file — upload one first</p>
                  <p className="text-[11.5px] text-[#3d375a] mt-0.5">Interview questions are generated from your latest resume · click to upload</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-5 px-3 py-2.5 bg-[#f87171]/8 border border-[#f87171]/20 rounded-xl text-[12px] text-[#f87171]">
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleStartInterview}
              disabled={loading || !resume}
              className="w-full text-[14px] text-white font-semibold px-5 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed rounded-[11px] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Preparing your interview...</>
              ) : !resume ? (
                "Upload a resume to continue"
              ) : (
                <><i className="ti ti-player-play text-[15px]" /> Start interview</>
              )}
            </button>
          </div>
        </>
      )}

      {/* ══════════════════════════
          LIVE INTERVIEW
      ══════════════════════════ */}
      {stage === "interview" && (
        <>
          <div className="flex items-center justify-between mt-1 mb-6">
            <div>
              <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mb-0.5">Live interview</h1>
              <p className="text-[12px] text-[#5b5475]">
                {targetRole} · {difficulty} · {INTERVIEW_TYPES.find(t => t.id === interviewType)?.label} · {questions.length} questions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {questions.map((_, i) => (
                  <div key={i} className={`rounded-full transition-all
                    ${i < currentQIndex  ? "w-2.5 h-2.5 bg-[#10b981]"
                    : i === currentQIndex ? "w-3 h-3 bg-[#7c3aed] ring-2 ring-[#7c3aed]/30"
                    :                       "w-2.5 h-2.5 bg-white/10"}`} />
                ))}
              </div>
              <span className="text-[12px] text-[#5b5475]">{currentQIndex + 1} / {questions.length}</span>
            </div>
          </div>

          <div className="max-w-[780px]">
            {/* previous answers collapsed */}
            {answers.length > 0 && (
              <div className="mb-4 space-y-2">
                {answers.map((a, i) => (
                  <details key={i} className="bg-[#0f0d22] border border-white/6 rounded-[11px] px-5 py-3 group">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center text-[9px]">
                          <i className="ti ti-check" />
                        </span>
                        <span className="text-[12px] text-[#5b5475]">
                          Q{i + 1} — {a.question.slice(0, 55)}{a.question.length > 55 ? "…" : ""}
                        </span>
                      </div>
                      <i className="ti ti-chevron-down text-[13px] text-[#3d375a] group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="mt-3 border-t border-white/5 pt-3">
                      <p className="text-[12px] text-[#7c6fa0] leading-relaxed">{a.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            )}

            {/* current question */}
            <div className="bg-[#120f26] border border-[#7c3aed]/20 rounded-2xl px-6 py-5 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-[9px] bg-[#7c3aed]/15 flex items-center justify-center text-[13px] text-[#a78bfa] flex-shrink-0 mt-0.5">
                  <i className="ti ti-sparkles" />
                </div>
                <div>
                  <p className="text-[10.5px] font-semibold text-[#5b5475] tracking-[.06em] mb-2">
                    QUESTION {currentQIndex + 1} OF {questions.length}
                  </p>
                  <p className="text-[15px] text-[#ede9fe] leading-relaxed">{questions[currentQIndex]}</p>
                </div>
              </div>
            </div>

            {/* answer */}
            <div className="bg-[#120f26] border border-white/8 rounded-2xl px-5 py-5 focus-within:border-[#7c3aed]/40 transition-all mb-4">
              <p className="text-[10.5px] font-semibold text-[#5b5475] tracking-[.06em] mb-3">YOUR ANSWER</p>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here…"
                rows={6}
                className="w-full bg-transparent text-[13.5px] text-[#ede9fe] placeholder:text-[#3d375a] outline-none resize-none leading-relaxed"
              />
            </div>

            {errorMsg && (
              <div className="mb-4 px-3 py-2.5 bg-[#f87171]/8 border border-[#f87171]/20 rounded-xl text-[12px] text-[#f87171]">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-[11px] text-[#3d375a]">
                {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </p>
              {isLastQ ? (
                <button onClick={handleFinish} disabled={!currentAnswer.trim() || loading}
                  className="flex items-center gap-2 text-[13.5px] text-white font-semibold px-6 py-3 bg-[#10b981] hover:bg-[#059669] disabled:opacity-40 disabled:cursor-not-allowed rounded-[10px] transition-all">
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Evaluating...</>
                  ) : (
                    <><i className="ti ti-flag-3 text-[15px]" /> Finish interview</>
                  )}
                </button>
              ) : (
                <button onClick={handleNext} disabled={!currentAnswer.trim()}
                  className="flex items-center gap-2 text-[13.5px] text-white font-semibold px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed rounded-[10px] transition-all">
                  <i className="ti ti-arrow-right text-[15px]" /> Next question
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════
          FINAL REPORT
      ══════════════════════════ */}
      {stage === "report" && report && (
        <>
          <div className="flex items-center justify-between mt-1 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11.5px] text-[#10b981] bg-[#10b981]/9 border border-[#10b981]/18 rounded-full px-3 py-1 mb-2.5">
                <i className="ti ti-check text-[11px]" /> Interview complete
              </div>
              <h1 className="text-[22px] font-semibold text-[#ede9fe] tracking-[-0.3px] mb-1">AI feedback report</h1>
              <p className="text-[12px] text-[#5b5475]">
                {targetRole} · {difficulty} · {answers.length} questions answered
              </p>
            </div>
            <button onClick={() => { setStage("setup"); setAnswers([]); setReport(null); }}
              className="text-[12.5px] text-white font-medium px-4 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-[9px] transition-all">
              Try another interview
            </button>
          </div>

          <div className="max-w-[780px] space-y-4">

            {/* overall score */}
            <div className="flex items-center gap-4 bg-[#120f26] border border-[#7c3aed]/20 rounded-2xl px-6 py-5">
              <div className="w-16 h-16 rounded-2xl bg-[#7c3aed]/12 flex items-center justify-center flex-shrink-0">
                <span className="text-[22px] font-semibold text-[#8b5cf6]">{report.overallScore}</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#ede9fe] mb-1">Overall score</p>
                <p className="text-[12.5px] text-[#5b5475]">out of 100</p>
              </div>
            </div>

            {/* strengths */}
            <div className="bg-[#120f26] border border-white/6 rounded-2xl px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-[8px] bg-[#10b981]/12 flex items-center justify-center text-[13px] text-[#10b981]">
                  <i className="ti ti-thumb-up" />
                </div>
                <p className="text-[12.5px] font-semibold text-[#ede9fe]">Strengths</p>
              </div>
              <p className="text-[12.5px] text-[#9d8fc0] leading-[1.65]">{report.strengths}</p>
            </div>

            {/* weaknesses */}
            <div className="bg-[#120f26] border border-white/6 rounded-2xl px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-[8px] bg-[#fbbf24]/12 flex items-center justify-center text-[13px] text-[#fbbf24]">
                  <i className="ti ti-bulb" />
                </div>
                <p className="text-[12.5px] font-semibold text-[#ede9fe]">Weaknesses</p>
              </div>
              <p className="text-[12.5px] text-[#9d8fc0] leading-[1.65]">{report.weaknesses}</p>
            </div>

            {/* improvement + recommended side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#120f26] border border-white/6 rounded-2xl px-6 py-5">
                <p className="text-[12.5px] font-semibold text-[#ede9fe] mb-2.5">Areas to improve</p>
                <p className="text-[12.5px] text-[#9d8fc0] leading-[1.65]">{report.improvementAreas}</p>
              </div>
              <div className="bg-[#120f26] border border-white/6 rounded-2xl px-6 py-5">
                <p className="text-[12.5px] font-semibold text-[#ede9fe] mb-2.5">Recommended topics</p>
                <p className="text-[12.5px] text-[#9d8fc0] leading-[1.65]">{report.recommendedTopics}</p>
              </div>
            </div>

            {/* detailed feedback */}
            <div className="bg-[#120f26] border border-white/6 rounded-2xl px-6 py-5">
              <p className="text-[12.5px] font-semibold text-[#ede9fe] mb-2.5">Detailed feedback</p>
              <p className="text-[13px] text-[#9d8fc0] leading-[1.75]">{report.detailedFeedback}</p>
            </div>

            {/* Q&A review */}
            <div className="bg-[#120f26] border border-white/6 rounded-2xl px-6 py-5">
              <p className="text-[12.5px] font-semibold text-[#ede9fe] mb-4">Your answers</p>
              <div className="space-y-4">
                {answers.map((a, i) => (
                  <div key={i} className={i > 0 ? "border-t border-white/5 pt-4" : ""}>
                    <p className="text-[10.5px] font-semibold text-[#5b5475] tracking-[.06em] mb-1.5">Q{i + 1}</p>
                    <p className="text-[13px] text-[#ede9fe] mb-2 leading-relaxed">{a.question}</p>
                    <p className="text-[12.5px] text-[#5b5475] leading-relaxed">{a.answer}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}