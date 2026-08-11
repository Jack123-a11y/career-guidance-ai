import { useNavigate } from "react-router-dom";
 import { useAuth } from "../context/AuthContext";
const SIDEBAR_TOOLS = [
  { icon: "ti-file-analytics", label: "Resume analysis", path: "/dashboard/resume" },
  { icon: "ti-chart-bar",      label: "Skill analysis",  path: "/dashboard/skills" },
  { icon: "ti-microphone",     label: "Mock interview",  path: "/dashboard/interview" },
  { icon: "ti-map",            label: "My roadmap",      path: "/dashboard/roadmap" },
  { icon: "ti-briefcase",      label: "Job match",       path: "/dashboard/jobs" },
  { icon: "ti-robot",          label: "AI chat",         path: "/dashboard/chat" },
];

const TOOL_CARDS = [
  {
    icon: "ti-file-analytics",
    title: "Resume analysis",
    desc: "Upload your resume and get an AI score with detailed feedback.",
    path: "/dashboard/resume",
    status: "Start here",
    statusType: "primary",
  },
  {
    icon: "ti-chart-bar",
    title: "Skill analysis",
    desc: "See your skill gaps compared to your target role.",
    path: "/dashboard/skills",
    status: "Needs resume",
    statusType: "muted",
  },
  {
    icon: "ti-microphone",
    title: "Mock interview",
    desc: "Practice with an AI interviewer and get instant feedback.",
    path: "/dashboard/interview",
    status: "Ready",
    statusType: "muted",
  },
  {
    icon: "ti-map",
    title: "My roadmap",
    desc: "Get a personalised week-by-week learning plan.",
    path: "/dashboard/roadmap",
    status: "Needs resume",
    statusType: "muted",
  },
  {
    icon: "ti-briefcase",
    title: "Job match",
    desc: "Compare your resume against any job description.",
    path: "/dashboard/jobs",
    status: "Needs resume",
    statusType: "muted",
  },
  {
    icon: "ti-robot",
    title: "AI chat",
    desc: "Ask anything about your career, anytime.",
    path: "/dashboard/chat",
    status: "Ready",
    statusType: "muted",
  },
];

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[12.5px] transition-all mb-px
        ${active ? "bg-[#7c3aed]/13 text-[#a78bfa]" : "text-[#5b5475] hover:bg-white/4 hover:text-[#9d8fc0]"}`}
    >
      <i className={`ti ${icon} text-[16px] flex-shrink-0`} aria-hidden="true" />
      {label}
    </div>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-[#120f26] border border-white/6 rounded-xl p-4">
      <div className="w-[30px] h-[30px] rounded-lg bg-[#7c3aed]/12 flex items-center justify-center text-[15px] mb-2.5">
        {icon}
      </div>
      <p className="text-[10.5px] text-[#3d375a] font-medium mb-1">{label}</p>
      <p className="text-[23px] font-semibold text-[#ede9fe] mb-0.5 tracking-[-0.5px]">{value}</p>
      <p className="text-[11px] text-[#3d375a]">{sub}</p>
    </div>
  );
}

function ToolCard({ icon, title, desc, status, statusType, onClick }) {
  const statusStyle =
    statusType === "primary"
      ? "bg-[#7c3aed]/10 text-[#a78bfa]"
      : "bg-white/4 text-[#3d375a]";
  return (
    <div
      onClick={onClick}
      className="bg-[#120f26] border border-white/6 rounded-2xl p-[18px] cursor-pointer transition-all hover:border-[#7c3aed]/30 hover:bg-[#15122c] hover:-translate-y-0.5 group"
    >
      <div className="w-[38px] h-[38px] rounded-[10px] bg-[#7c3aed]/12 flex items-center justify-center text-[18px] text-[#a78bfa] mb-3.5">
        <i className={`ti ${icon}`} aria-hidden="true" />
      </div>
      <p className="text-[13.5px] font-medium text-[#ede9fe] mb-1">{title}</p>
      <p className="text-[11.5px] text-[#5b5475] leading-relaxed mb-3">{desc}</p>
      <div className="flex items-center justify-between">
        <span className={`text-[10.5px] px-2 py-0.5 rounded-full ${statusStyle}`}>{status}</span>
        <i className="ti ti-arrow-right text-[13px] text-[#3d375a] group-hover:text-[#a78bfa] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };
// ── TODO: replace with real user data from your auth context / API once auth is wired ──
  

// inside the component:
const { user } = useAuth();
const hasResume = false; // still hardcoded — see note below

  return (
    <div className="min-h-screen bg-[#0d0b1a] flex">

      {/* ── SIDEBAR ── */}
      <aside className="w-[216px] flex-shrink-0 bg-[#100d20] border-r border-white/6 py-[18px] flex flex-col">
        <div className="flex items-center gap-2 text-[14px] font-medium text-[#ede9fe] px-4 pb-4 border-b border-white/6 mb-3.5">
          <div className="w-[25px] h-[25px] bg-[#7c3aed] rounded-[7px] flex items-center justify-center text-white text-[11px]">✦</div>
          CareerAI
        </div>

        <div className="px-[9px] mb-4">
          <p className="text-[9.5px] text-[#3d375a] tracking-[.07em] font-semibold px-2 mb-1.5">MAIN</p>
          <SidebarItem icon="ti-layout-dashboard" label="Dashboard" active onClick={() => navigate("/dashboard")} />
        </div>

        <div className="px-[9px] mb-4">
          <p className="text-[9.5px] text-[#3d375a] tracking-[.07em] font-semibold px-2 mb-1.5">AI TOOLS</p>
          {SIDEBAR_TOOLS.map(t => (
            <SidebarItem key={t.path} icon={t.icon} label={t.label} onClick={() => navigate(t.path)} />
          ))}
        </div>

        <div className="px-[9px] mb-4">
          <p className="text-[9.5px] text-[#3d375a] tracking-[.07em] font-semibold px-2 mb-1.5">ACCOUNT</p>
          <SidebarItem icon="ti-history"  label="History"  onClick={() => navigate("/dashboard/history")} />
          <SidebarItem icon="ti-settings" label="Settings" onClick={() => navigate("/dashboard/settings")} />
          <SidebarItem icon="ti-logout"   label="Logout"   onClick={handleLogout} />
        </div>

        {/* ── TODO: wire to real logged-in user (avatar initial, name, email) once auth context exists ── */}
        <div className="mt-auto px-[9px]">
          <div
            onClick={() => navigate("/dashboard/settings")}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-[9px] bg-white/3 border border-white/6 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0">
              <i className="ti ti-user" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#9d8fc0]">My account</p>
              <p className="text-[10px] text-[#3d375a] mt-0.5">View profile & settings</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col min-h-screen">

        {/* ── TODO: personalize this top bar with the real user's first name once auth context exists ── */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-white/6">
          <div>
            <p className="text-[16px] font-medium text-[#ede9fe]">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""} </p>
            <p className="text-[12px] text-[#3d375a] mt-0.5">Here's an overview of your career progress</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="w-[33px] h-[33px] rounded-[9px] bg-white/3 border border-white/7 flex items-center justify-center text-[15px] text-[#5b5475] hover:bg-white/6 hover:text-[#9d8fc0] transition-all relative">
              <i className="ti ti-bell" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#7c3aed] rounded-full border-[1.5px] border-[#0d0b1a]" />
            </button>
            <button
              onClick={() => navigate("/dashboard/settings")}
              className="w-[33px] h-[33px] rounded-[9px] bg-white/3 border border-white/7 flex items-center justify-center text-[15px] text-[#5b5475] hover:bg-white/6 hover:text-[#9d8fc0] transition-all"
            >
              <i className="ti ti-settings" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="px-7 py-[22px] flex-1 overflow-y-auto">

          {/* welcome / resume CTA row */}
          {!hasResume && (
            <div className="flex items-center justify-between mb-[22px]">
              <p className="text-[13px] text-[#5b5475] leading-relaxed">
                You haven't uploaded a resume yet. Upload one to unlock{" "}
                <span className="text-[#a78bfa]">AI score, skill gap, and roadmap</span>.
              </p>
              <button
                onClick={() => navigate("/dashboard/resume")}
                className="flex items-center gap-1.5 text-[12.5px] text-white font-medium px-[18px] py-[9px] bg-[#7c3aed] hover:bg-[#6d28d9] rounded-[9px] transition-all flex-shrink-0"
              >
                <i className="ti ti-upload text-[13px]" aria-hidden="true" /> Upload resume
              </button>
            </div>
          )}

          {/* stat cards */}
          <div className="grid grid-cols-4 gap-[11px] mb-5">
            <StatCard icon="📄" label="Resume score"   value={hasResume ? "72" : "—"} sub={hasResume ? "Updated today" : "Not analysed yet"} />
            <StatCard icon="📊" label="Skill readiness" value={hasResume ? "64%" : "—"} sub={hasResume ? "+12% this week" : "Upload resume first"} />
            <StatCard icon="🎤" label="Mock sessions"   value="0" sub="No sessions yet" />
            <StatCard icon="🗺️" label="Roadmap"         value={hasResume ? "28%" : "—"} sub={hasResume ? "Week 3 of 12" : "Not started"} />
          </div>

          {/* tool cards */}
          <p className="text-[11px] font-semibold text-[#3d375a] tracking-[.05em] mb-[11px] flex items-center gap-1.5">
            <i className="ti ti-sparkles text-[13px]" aria-hidden="true" /> AI tools
          </p>
          <div className="grid grid-cols-3 gap-[11px] mb-[22px]">
            {TOOL_CARDS.map(card => (
              <ToolCard key={card.path} {...card} onClick={() => navigate(card.path)} />
            ))}
          </div>

          {/* bottom panels */}
          <div className="grid grid-cols-[1.3fr_0.7fr] gap-[14px]">

            <div className="bg-[#120f26] border border-white/6 rounded-2xl p-[18px]">
              <p className="text-[12.5px] font-medium text-[#9d8fc0] mb-3.5">Recent activity</p>
              <div className="flex gap-2.5 items-start py-2">
                <div className="w-7 h-7 rounded-lg bg-white/4 flex items-center justify-center text-[13px] flex-shrink-0">📭</div>
                <div>
                  <p className="text-[12px] text-[#3d375a] leading-snug">No activity yet — start with resume analysis</p>
                  <p className="text-[10.5px] text-[#3d375a]">—</p>
                </div>
              </div>
            </div>

            <div className="bg-[#120f26] border border-white/6 rounded-2xl p-[18px]">
              <p className="text-[12.5px] font-medium text-[#9d8fc0] mb-3.5">Getting started</p>
              <div className="flex gap-2.5 items-start">
                <div className="w-8 h-8 rounded-[9px] bg-[#7c3aed]/12 border border-[#7c3aed]/20 flex items-center justify-center text-[15px] flex-shrink-0">💡</div>
                <div>
                  <p className="text-[12.5px] font-medium text-[#a78bfa] mb-1">Upload your resume first</p>
                  <p className="text-[11.5px] text-[#5b5475] leading-relaxed">
                    Most other tools — skill analysis, roadmap, job match — use your resume data to personalise results.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}