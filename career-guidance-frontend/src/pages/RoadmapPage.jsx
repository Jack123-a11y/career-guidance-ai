import { useState } from "react";
import { useNavigate } from "react-router-dom";

const POPULAR_FIELDS = [
  { icon: "☕", title: "Java Full Stack",  weeks: 12 },
  { icon: "📊", title: "Data Scientist",   weeks: 16 },
  { icon: "🎨", title: "UI/UX Designer",   weeks: 10 },
  { icon: "⚙️", title: "DevOps Engineer",  weeks: 14 },
  { icon: "🐍", title: "Python Developer", weeks: 10 },
  { icon: "🤖", title: "Android Developer",weeks: 12 },
  { icon: "☁️", title: "Cloud Engineer",   weeks: 14 },
  { icon: "🔒", title: "Cybersecurity",    weeks: 16 },
];

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

function FieldCard({ icon, title, weeks, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#120f26] border rounded-2xl px-5 py-7 text-center cursor-pointer transition-all
        ${selected
          ? "border-[#7c3aed] ring-1 ring-[#7c3aed]/40"
          : "border-white/6 hover:border-[#7c3aed]/25 hover:bg-[#15122c]"}`}
    >
      <div className="w-12 h-12 rounded-[12px] bg-[#7c3aed]/12 flex items-center justify-center text-[22px] mx-auto mb-4">
        {icon}
      </div>
      <p className="text-[14px] font-semibold text-[#ede9fe] mb-1.5 leading-snug">{title}</p>
      <p className="text-[11.5px] text-[#3d375a]">{weeks} week plan</p>
    </div>
  );
}

export default function RoadmapPage() {
  const navigate = useNavigate();

  const [selectedField, setSelectedField] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  // Clicking a popular field card selects it and fills the search bar —
  // it does NOT navigate to another page/step on its own.
  const handlePickField = (field) => {
    setSelectedField(field.title);
    setSearchValue(field.title);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    // typing manually clears the "selected card" highlight unless it matches a card exactly
    const match = POPULAR_FIELDS.find(f => f.title.toLowerCase() === e.target.value.toLowerCase());
    setSelectedField(match ? match.title : null);
  };

  const handleContinue = () => {
    if (!searchValue.trim()) return;
    // ── TODO: move to step 2 ("Set your details") once that step is built,
    // passing the chosen field along (route state, query param, or local context) ──
    navigate("/dashboard/roadmap/details", { state: { field: searchValue } });
  };

  return (
    <div className="min-h-screen bg-[#0d0b1a] px-7 py-7" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>

      {/* step indicator */}
      <div className="flex items-center gap-2.5 mb-7">
        {STEP_LABELS.map((label, i) => (
          <StepPill key={label} index={i + 1} label={label} active={i === 0} />
        ))}
      </div>

      <div className="text-[12px] text-[#3d375a] mb-1">
        <span className="text-[#7c3aed] cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span> / My roadmap
      </div>

      <h1 className="text-[24px] font-semibold text-[#ede9fe] tracking-[-0.3px] mt-1 mb-1.5">What do you want to learn?</h1>
      <p className="text-[13px] text-[#5b5475] leading-relaxed mb-8">
        Pick any career field — AI builds a personalised week-by-week plan
      </p>

      {/* search bar — populated when a card is clicked, editable directly too */}
      <div className="max-w-[900px]">
        <div className="flex items-center gap-3 bg-[#120f26] border border-[#7c3aed]/25 rounded-2xl px-5 py-4 mb-9">
          <i className="ti ti-search text-[18px] text-[#5b5475] flex-shrink-0" aria-hidden="true" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
            placeholder="Search any field — Data Scientist, UI Designer, DevOps..."
            className="flex-1 bg-white text-[#0d0b1a] text-[15px] px-4 py-2.5 rounded-[10px] outline-none placeholder:text-[#9d9ab0]"
          />
          <button
            onClick={handleContinue}
            disabled={!searchValue.trim()}
            className="flex-shrink-0 text-[13px] text-white font-medium px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed rounded-[10px] transition-all"
          >
            Continue
          </button>
        </div>

        <p className="text-[11px] font-semibold text-[#3d375a] tracking-[.07em] mb-4">POPULAR FIELDS</p>

        <div className="grid grid-cols-4 gap-[14px]">
          {POPULAR_FIELDS.map((field) => (
            <FieldCard
              key={field.title}
              icon={field.icon}
              title={field.title}
              weeks={field.weeks}
              selected={selectedField === field.title}
              onClick={() => handlePickField(field)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
