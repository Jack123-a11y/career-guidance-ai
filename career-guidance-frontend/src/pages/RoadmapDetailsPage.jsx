import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

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

export default function RoadmapDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const targetRole = location.state?.field;
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Nobody should land here without picking a field first
  if (!targetRole) {
    navigate("/dashboard/roadmap", { replace: true });
    return null;
  }

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/roadmap/generate", { targetRole });
      navigate("/dashboard/roadmap/result", { state: { targetRole, roadmap: res.data.roadmap } });
    } catch (err) {
      setLoading(false);
      setErrorMsg(err?.response?.data?.message || "Couldn't generate your roadmap. Make sure you've uploaded a resume first.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0b1a] px-7 py-7" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>

      <div className="flex items-center gap-2.5 mb-7">
        {STEP_LABELS.map((label, i) => (
          <StepPill key={label} index={i + 1} label={label} active={i === 1} />
        ))}
      </div>

      <div className="text-[12px] text-[#3d375a] mb-1">
        <span className="text-[#7c3aed] cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span> / My roadmap / Details
      </div>

      <h1 className="text-[24px] font-semibold text-[#ede9fe] tracking-[-0.3px] mt-1 mb-1.5">Ready to build your roadmap</h1>
      <p className="text-[13px] text-[#5b5475] leading-relaxed mb-8">
        AI will use your latest uploaded resume to personalize this plan
      </p>

      <div className="max-w-[560px] bg-[#120f26] border border-[#7c3aed]/20 rounded-2xl px-7 py-7">

        <p className="text-[12.5px] text-[#5b5475] mb-2">Target field</p>
        <div className="flex items-center gap-3 bg-[#7c3aed]/6 border border-[#7c3aed]/20 rounded-[12px] px-4 py-3.5 mb-6">
          <div className="w-9 h-9 rounded-[9px] bg-[#7c3aed]/15 flex items-center justify-center text-[16px] text-[#a78bfa] flex-shrink-0">
            <i className="ti ti-target-arrow" aria-hidden="true" />
          </div>
          <p className="text-[14px] font-medium text-[#ede9fe]">{targetRole}</p>
        </div>

        {errorMsg && (
          <div className="mb-5 px-3 py-2.5 bg-[#f87171]/8 border border-[#f87171]/20 rounded-xl text-[12px] text-[#f87171]">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full text-[13.5px] text-white font-medium px-5 py-3.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-60 disabled:cursor-not-allowed rounded-[10px] transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating your 12-week plan...</>
          ) : "Generate my roadmap →"}
        </button>

        <button
          onClick={() => navigate("/dashboard/roadmap")}
          className="w-full text-[12.5px] text-[#5b5475] hover:text-[#9d8fc0] font-medium px-5 py-2.5 mt-2 transition-all"
        >
          ← Choose a different field
        </button>
      </div>
    </div>
  );
}