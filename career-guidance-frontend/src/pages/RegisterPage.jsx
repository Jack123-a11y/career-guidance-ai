import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api"
export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]    = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError]  = useState("");
  const [loading, setLoad] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirm)
      return "Please fill in all fields.";
    if (form.password.length < 8)
      return "Password must be at least 8 characters.";
    if (form.password !== form.confirm)
      return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setLoad(true);
    try {
       await api.post("/auth/register", {
      name: form.name,
      email: form.email,
      password: form.password,
       role: "USER",  // your entity has a role field with no default, so send one explicitly
    });
      setTimeout(() => { setLoad(false); navigate("/login"); }, 800);
    } catch (err) {
      setLoad(false);
    if (err?.response?.status === 409) {
      setError("This email is already registered. Try logging in instead.");
    } else {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    }
  }
  };

  return (
    <div className="min-h-screen bg-[#0d0b1a] flex relative overflow-hidden">

      {/* glow blobs */}
      <div className="absolute w-[420px] h-[420px] rounded-full -top-20 -left-20 pointer-events-none"
        style={{ background: "rgba(109,40,217,0.09)", filter: "blur(80px)" }} />
      <div className="absolute w-[320px] h-[320px] rounded-full bottom-0 right-0 pointer-events-none"
        style={{ background: "rgba(91,33,182,0.07)", filter: "blur(70px)" }} />

      {/* ── LEFT — form ── */}
      <div className="relative z-10 w-full max-w-[480px] flex flex-col justify-center px-12 py-10 border-r border-white/[0.05]">

        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-[#7c3aed] rounded-lg flex items-center justify-center text-white text-[12px]">✦</div>
          <span className="text-[15px] font-medium text-[#ede9fe]">CareerAI</span>
        </div>

        <h1 className="text-[24px] font-semibold text-[#ede9fe] mb-1.5">Create your account</h1>
        <p className="text-[13px] text-[#5b5475] mb-7">Free forever — no credit card needed</p>

        {/* google */}
        <button className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white/[0.04] border border-white/9 rounded-xl text-[#7c6fa0] text-[13px] hover:bg-white/[0.07] hover:text-[#c4b8f0] transition-all mb-5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[11px] text-[#3d375a]">or use email</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* error */}
        {error && (
          <div className="mb-4 px-3 py-2.5 bg-[#f87171]/8 border border-[#f87171]/20 rounded-xl text-[12px] text-[#f87171]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* name + email row */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[11px] text-[#5b5475] block mb-1.5">
                Full name <span className="text-[#ef4444]">*</span>
              </label>
              <input
                name="name" value={form.name} onChange={handleChange}
                placeholder="Rahul Sharma"
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/9 rounded-xl text-[#94a3b8] text-[13px] outline-none focus:border-[#7c3aed]/50 focus:text-[#e2e8f0] transition-all placeholder-[#3d375a]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#5b5475] block mb-1.5">
                Email <span className="text-[#ef4444]">*</span>
              </label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="rahul@gmail.com"
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/9 rounded-xl text-[#94a3b8] text-[13px] outline-none focus:border-[#7c3aed]/50 focus:text-[#e2e8f0] transition-all placeholder-[#3d375a]"
              />
            </div>
          </div>

          {/* password row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="text-[11px] text-[#5b5475] block mb-1.5">
                Password <span className="text-[#ef4444]">*</span>
              </label>
              <input
                name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="Min 8 characters"
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/9 rounded-xl text-[#94a3b8] text-[13px] outline-none focus:border-[#7c3aed]/50 focus:text-[#e2e8f0] transition-all placeholder-[#3d375a]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#5b5475] block mb-1.5">Confirm password</label>
              <input
                name="confirm" type="password" value={form.confirm} onChange={handleChange}
                placeholder="Repeat it"
                className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/9 rounded-xl text-[#94a3b8] text-[13px] outline-none focus:border-[#7c3aed]/50 focus:text-[#e2e8f0] transition-all placeholder-[#3d375a]"
              />
            </div>
          </div>

          {/* terms */}
          <div className="flex gap-2.5 items-start mb-5">
            <input type="checkbox" className="mt-0.5 flex-shrink-0 accent-[#7c3aed]" required />
            <p className="text-[11px] text-[#3d375a] leading-relaxed">
              I agree to the{" "}
              <span className="text-[#7c3aed] cursor-pointer hover:text-[#a78bfa] transition-colors">Terms of Service</span>
              {" "}and{" "}
              <span className="text-[#7c3aed] cursor-pointer hover:text-[#a78bfa] transition-colors">Privacy Policy</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
            ) : "Create my free account →"}
          </button>
        </form>

        <p className="text-[12px] text-[#3d375a] text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors">
            Log in instead
          </Link>
        </p>

        <p className="text-center text-[11px] text-[#3d375a] mt-4">
          <Link to="/" className="hover:text-[#5b5475] transition-colors">← Back to home</Link>
        </p>
      </div>

      {/* ── RIGHT — benefits ── */}
      <div className="flex-1 flex flex-col justify-center px-14 py-10 relative z-10">
        <div className="inline-flex items-center gap-1.5 text-[11px] text-[#a78bfa] bg-[#7c3aed]/10 border border-[#7c3aed]/22 rounded-full px-3 py-1 mb-6 w-fit">
          <span className="w-[5px] h-[5px] bg-[#7c3aed] rounded-full animate-pulse" />
          Everything included · Free
        </div>

        <h2 className="text-[22px] font-semibold text-[#ede9fe] mb-2 leading-snug">
          Your AI career coach,<br />available 24/7
        </h2>
        <p className="text-[13px] text-[#5b5475] mb-8 leading-relaxed max-w-[320px]">
          Upload your resume once and get everything you need to land your next role.
        </p>

        <div className="flex flex-col gap-5">
          {[
            { icon: "📄", title: "AI resume scoring",        desc: "Instant score, keyword gaps, and a rewritten summary section." },
            { icon: "🗺️", title: "Personalised roadmap",     desc: "Week-by-week learning plan built around your target role." },
            { icon: "🎤", title: "AI mock interviews",        desc: "Real questions, live scoring, detailed feedback per answer." },
            { icon: "🤖", title: "Career chatbot",           desc: "Knows your resume and goals — ask anything, anytime." },
            { icon: "💼", title: "Job match %",              desc: "See how your resume matches open job descriptions." },
          ].map(b => (
            <div key={b.title} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/18 flex items-center justify-center flex-shrink-0 text-[15px]">{b.icon}</div>
              <div>
                <p className="text-[13px] font-medium text-[#c4b8f0] mb-0.5">{b.title}</p>
                <p className="text-[12px] text-[#3d375a] leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
