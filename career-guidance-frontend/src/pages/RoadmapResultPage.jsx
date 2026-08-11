import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const STEP_LABELS = ["Pick a field", "Set your details", "Your roadmap"];

function StepPill({ index, label, active }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[12.5px] px-4 py-2 rounded-[9px] border transition-all
        ${active
          ? "bg-[#7c3aed]/10 border-[#7c3aed]/30 text-[#a78bfa]"
          : "bg-white/3 border-white/6 text-[#3d375a]"}`}
    >
      <span className={`w-[16px] h-[16px] rounded-full flex items-center justify-center text-[9.5px] flex-shrink-0
        ${active ? "bg-[#7c3aed] text-white" : "bg-white/6 text-[#3d375a]"}`}>
        {index}
      </span>
      {label}
    </div>
  );
}

// Parses "WEEK 1: Title\n- topic\n- topic" into [{ week, title, topics: [] }]
function parseRoadmap(text) {
  if (!text) return [];
  const chunks = text.split(/WEEK\s+(\d+):/i).filter(Boolean);
  const weeks = [];
  for (let i = 0; i < chunks.length; i += 2) {
    const weekNum = chunks[i]?.trim();
    const body = chunks[i + 1]?.trim();
    if (!weekNum || !body) continue;

    const lines = body.split("\n").map(l => l.trim()).filter(Boolean);
    const title = lines[0]?.replace(/^-/, "").trim() || `Week ${weekNum}`;
    const topics = lines
      .slice(lines[0] && !lines[0].startsWith("-") ? 1 : 0)
      .map(l => l.replace(/^-+\s*/, ""))
      .filter(Boolean);

    weeks.push({ week: weekNum, title, topics });
  }
  return weeks;
}

function WeekAccordion({ week, title, topics, isOpen, onToggle }) {
  return (
    <div className={`bg-[#120f26] border rounded-2xl transition-all ${isOpen ? "border-[#7c3aed]/35" : "border-white/6"}`}>
      <div
        onClick={onToggle}
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-semibold flex-shrink-0
            ${isOpen ? "bg-[#7c3aed] text-white" : "bg-[#7c3aed]/12 text-[#a78bfa]"}`}>
            {week}
          </div>
          <div>
            <p className="text-[10px] text-[#3d375a] font-medium tracking-[.05em] mb-0.5">WEEK {week}</p>
            <p className="text-[13.5px] font-medium text-[#ede9fe]">{title}</p>
          </div>
        </div>
        <i className={`ti ti-chevron-down text-[16px] text-[#5b5475] transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </div>

      {isOpen && (
        <div className="px-5 pb-4 pl-[60px]">
          {topics.map((t, i) => (
            <div key={i} className="flex gap-2.5 items-start py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] flex-shrink-0 mt-1.5" />
              <p className="text-[12.5px] text-[#9d8fc0] leading-[1.55]">{t}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RoadmapResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const targetRole = location.state?.targetRole;
  const roadmapText = location.state?.roadmap;
  const weeks = parseRoadmap(roadmapText);

  const [openWeek, setOpenWeek] = useState(weeks[0]?.week ?? null);

  if (!roadmapText) {
    navigate("/dashboard/roadmap", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0d0b1a] px-7 py-7" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>

      <div className="flex items-center gap-2.5 mb-7">
        {STEP_LABELS.map((label, i) => (
          <StepPill key={label} index={i + 1} label={label} active={i === 2} />
        ))}
      </div>

      <div className="flex items-center justify-between mb-6 mt-1">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11.5px] text-[#10b981] bg-[#10b981]/9 border border-[#10b981]/18 rounded-full px-3 py-1 mb-2.5">
            <i className="ti ti-check text-[11px]" aria-hidden="true" /> Roadmap generated
          </div>
          <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mb-1">Your 12-week roadmap</h1>
          <p className="text-[13px] text-[#5b5475]">Target role: {targetRole} · {weeks.length} weeks planned</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/roadmap")}
          className="text-[12px] text-white font-medium px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-[9px] transition-all flex-shrink-0"
        >
          Generate new roadmap
        </button>
      </div>

      <div className="max-w-[720px] flex flex-col gap-2.5">
        {weeks.length > 0 ? weeks.map(w => (
          <WeekAccordion
            key={w.week}
            week={w.week}
            title={w.title}
            topics={w.topics}
            isOpen={openWeek === w.week}
            onToggle={() => setOpenWeek(openWeek === w.week ? null : w.week)}
          />
        )) : (
          <div className="bg-[#120f26] border border-white/6 rounded-2xl p-[19px]">
            <p className="text-[12.5px] text-[#9d8fc0] leading-[1.65] whitespace-pre-line">{roadmapText}</p>
          </div>
        )}
      </div>
    </div>
  );
}