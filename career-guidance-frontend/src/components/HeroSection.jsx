import { useState, useEffect, useRef } from "react";

const PHRASES = [
  "with AI resume scoring.",
  "with mock interviews.",
  "with a personal roadmap.",
  "with skill gap analysis.",
];

function useTyping() {
  const [text, setText] = useState("");
  const pi = useRef(0), ci = useRef(0), del = useRef(false);
  useEffect(() => {
    const tick = () => {
      const ph = PHRASES[pi.current];
      if (!del.current) {
        setText(ph.slice(0, ci.current + 1));
        ci.current++;
        if (ci.current === ph.length) { del.current = true; return setTimeout(tick, 1800); }
      } else {
        setText(ph.slice(0, ci.current - 1));
        ci.current--;
        if (ci.current === 0) { del.current = false; pi.current = (pi.current + 1) % PHRASES.length; }
      }
      setTimeout(tick, del.current ? 28 : 55);
    };
    const t = setTimeout(tick, 400);
    return () => clearTimeout(t);
  }, []);
  return text;
}

function useScore(target = 72) {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let s = 0;
      const iv = setInterval(() => { s += 2; setScore(s); if (s >= target) clearInterval(iv); }, 22);
      return () => clearInterval(iv);
    }, 300);
    return () => clearTimeout(t);
  }, []);
  return score;
}

function ChatTyper() {
  const [text, setText] = useState("");
  const MSG = "Your Spring Boot skills are strong, but system design is only 42% — that's your biggest gap for senior roles. I've added 3 focused resources to your roadmap for this week.";
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => { setText(MSG.slice(0, i + 1)); i++; if (i >= MSG.length) clearInterval(iv); }, 18);
      return () => clearInterval(iv);
    }, 700);
    return () => clearTimeout(t);
  }, []);
  return <p className="text-[12px] text-[#7c6fa0] leading-relaxed">{text}</p>;
}

function RoadStep({ status, label, note }) {
  const s = {
    done: { box: "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20", label: "text-[#3d375a]" },
    curr: { box: "bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/25", label: "text-[#a78bfa]" },
    todo: { box: "bg-white/4 text-[#3d375a] border border-white/7",           label: "text-[#3d375a]" },
  }[status];
  const icon = { done: "✓", curr: "→", todo: "·" }[status];
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-5 h-5 rounded-[6px] flex items-center justify-center text-[9px] font-semibold flex-shrink-0 ${s.box}`}>{icon}</div>
      <span className={`text-[12px] font-medium flex-1 ${s.label}`}>{label}</span>
      <span className={`text-[10px] ${status === "curr" ? "text-[#a78bfa]" : "text-[#3d375a]"}`}>{note}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  HERO SECTION
//  Props:
//    onLogin    — called when "Log in" navbar button clicked
//    onSignup   — called when "Get started" or "Analyse my resume" clicked
// ─────────────────────────────────────────────────────────
export default function HeroSection({ onLogin, onSignup }) {
  const typed = useTyping();
  const score = useScore();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div className="bg-[#0d0b1a] min-h-screen relative overflow-hidden">

      {/* glow blobs */}
      <div className="absolute w-[480px] h-[480px] rounded-full -top-28 -left-20 pointer-events-none"
        style={{ background: "rgba(109,40,217,0.09)", filter: "blur(90px)" }} />
      <div className="absolute w-[360px] h-[360px] rounded-full -bottom-16 right-40 pointer-events-none"
        style={{ background: "rgba(91,33,182,0.07)", filter: "blur(70px)" }} />

      {/* ── NAVBAR ── */}
      <nav className="flex items-center justify-between px-12 py-5 border-b border-white/[0.05] relative z-10">
        <div className="flex items-center gap-2 text-[15px] font-medium text-[#ede9fe]">
          <div className="w-7 h-7 bg-[#7c3aed] rounded-lg flex items-center justify-center text-white text-[12px]">✦</div>
          CareerAI
        </div>

        <div className="flex gap-7">
          {["Features", "How it works", "Tech stack", "GitHub"].map(l => (
            <span key={l} className="text-[13px] text-[#5b5475] cursor-pointer hover:text-[#9d8fc0] transition-colors">{l}</span>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          {/* ← clicking this navigates to /login via onLogin prop */}
          <button
            onClick={onLogin}
            className="text-[13px] text-[#7c6fa0] px-[18px] py-[7px] border border-white/9 rounded-lg hover:bg-white/4 hover:text-[#c4b8f0] transition-all"
          >
            Log in
          </button>

          {/* ← clicking this navigates to /register via onSignup prop */}
          <button
            onClick={onSignup}
            className="text-[13px] text-white font-medium px-[18px] py-[7px] bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg transition-all"
          >
            Get started →
          </button>
        </div>
      </nav>

      {/* ── HERO GRID ── */}
      <div className="grid grid-cols-2 relative z-10">

        {/* LEFT */}
        <div className="px-12 pt-14 pb-14 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-[#a78bfa] bg-[#7c3aed]/10 border border-[#7c3aed]/22 rounded-full px-3 py-1 mb-6 w-fit">
            <span className="w-[5px] h-[5px] bg-[#7c3aed] rounded-full animate-pulse" />
            Built with Spring Boot · React · Gemini AI
          </div>

          <h1 className="text-[44px] font-semibold text-[#ede9fe] leading-[1.12] tracking-[-0.8px] mb-0.5">
            Land your dream job
          </h1>
          <div className="text-[44px] font-semibold text-[#8b5cf6] leading-[1.12] tracking-[-0.8px] mb-5 min-h-[54px]">
            {typed}
            <span
              className="inline-block w-[2.5px] h-9 bg-[#7c3aed] align-middle ml-0.5"
              style={{ animation: "blink 0.75s step-end infinite" }}
            />
          </div>

          <p className="text-[14px] text-[#5b5475] leading-[1.8] mb-8 max-w-[400px]">
            Upload your resume and get an AI-powered score, skill gap analysis,
            personalised roadmap, and mock interview practice — all in one place.
          </p>

          <div className="flex gap-2.5 items-center mb-9">
            {/* ← also navigates to /register */}
            <button
              onClick={onSignup}
              className="flex items-center gap-2 px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[13px] font-medium rounded-xl transition-all hover:-translate-y-px"
            >
              ↑ Analyse my resume
            </button>

            <button className="flex items-center gap-2 px-5 py-3 border border-white/9 text-[#5b5475] hover:text-[#9d8fc0] hover:border-white/15 hover:bg-white/[0.03] text-[13px] rounded-xl transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              View on GitHub
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-[#3d375a] mr-1">Built with</span>
            {["Spring Boot", "React", "MySQL", "Gemini AI", "Docker"].map(t => (
              <span key={t} className="text-[11px] px-2.5 py-[3px] rounded-full bg-white/[0.04] border border-white/[0.07] text-[#5b5475]">{t}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — demo cards */}
        <div className="px-4 pr-12 pt-12 pb-12 flex flex-col gap-2.5 justify-center">

          {/* resume score card */}
          <div className="bg-[#120f26] border border-[#7c3aed]/18 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1.5px]"
              style={{ background: "linear-gradient(90deg,transparent,#7c3aed,#a78bfa,transparent)" }} />
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] text-[#4a4468] font-medium">📄 Resume analysis</span>
              <span className="text-[10px] text-[#10b981] bg-[#10b981]/9 border border-[#10b981]/18 rounded-full px-2 py-0.5 flex items-center gap-1">
                <span className="w-1 h-1 bg-[#10b981] rounded-full animate-pulse" /> AI running
              </span>
            </div>
            <div className="flex items-end gap-2.5 mb-3">
              <span className="text-[48px] font-semibold text-[#8b5cf6] leading-none tracking-[-1px]">{score}</span>
              <span className="text-[14px] text-[#3d375a] mb-1.5">/100</span>
            </div>
            <div className="bg-white/5 rounded h-[3.5px] overflow-hidden mb-3">
              <div className="h-full bg-[#7c3aed] rounded transition-all duration-[1300ms] ease-out"
                style={{ width: ready ? `${score}%` : "0%" }} />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { t: "Docker missing", c: "text-[#f87171] bg-[#f87171]/7 border-[#f87171]/16" },
                { t: "CI/CD missing",  c: "text-[#f87171] bg-[#f87171]/7 border-[#f87171]/16" },
                { t: "Spring Boot ✓",  c: "text-[#34d399] bg-[#34d399]/7 border-[#34d399]/16" },
                { t: "MySQL ✓",        c: "text-[#34d399] bg-[#34d399]/7 border-[#34d399]/16" },
              ].map(k => (
                <span key={k.t} className={`text-[10px] px-2 py-0.5 rounded-full border ${k.c}`}>{k.t}</span>
              ))}
            </div>
          </div>

          {/* roadmap card */}
          <div className="bg-[#120f26] border border-white/7 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-[#4a4468] font-medium">🗺️ Learning roadmap</span>
              <span className="text-[11px] text-[#8b5cf6] font-medium">Week 3 of 12</span>
            </div>
            <div className="bg-white/5 rounded h-[3px] overflow-hidden mb-4">
              <div className="h-full bg-[#7c3aed] rounded transition-all duration-[1500ms] ease-out"
                style={{ width: ready ? "28%" : "0%" }} />
            </div>
            <div className="flex flex-col gap-2">
              <RoadStep status="done" label="Java Core + OOP"       note="Done" />
              <RoadStep status="done" label="Spring Boot REST APIs" note="Done" />
              <RoadStep status="curr" label="Spring Security + JWT" note="In progress" />
              <RoadStep status="todo" label="JPA + Database Design" note="Next" />
            </div>
          </div>

          {/* AI chat card */}
          <div className="bg-[#120f26] border border-[#7c3aed]/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-[26px] h-[26px] rounded-lg bg-[#3b0764] flex items-center justify-center text-[10px] font-semibold text-[#a78bfa]">AI</div>
              <span className="text-[12px] font-medium text-[#8b5cf6]">AI Career Coach</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-[5px] h-[5px] bg-[#10b981] rounded-full" />
                <span className="text-[10px] text-[#3d375a]">Online</span>
              </div>
            </div>
            <div className="px-3 py-2.5 bg-[#7c3aed]/6 border border-[#7c3aed]/12 rounded-xl mb-2.5 min-h-[56px]">
              <ChatTyper />
            </div>
            <div className="flex gap-1.5">
              <input
                className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/7 rounded-lg text-[11px] text-[#5b5475] outline-none placeholder-[#3d375a]"
                placeholder="Ask anything about your career..."
              />
              <button className="w-[30px] h-[30px] bg-[#7c3aed] hover:bg-[#6d28d9] border-none rounded-lg text-white text-sm flex items-center justify-center flex-shrink-0 transition-all cursor-pointer">
                →
              </button>
            </div>
          </div>

        </div>
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}
