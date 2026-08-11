import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoad]  = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoad(true);
    try {
      
      const response = await api.post("/auth/login", form);

       const { token } = response.data;
      if (!token) {
        setError("Something went wrong. Please try again.");
        setLoad(false);
        return;
    }
      localStorage.setItem("token", token);

      setLoad(false);

      navigate("/dashboard");

    } catch (err) {
      setLoad(false);
      setError(err?.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0b1a] flex items-center justify-center relative overflow-hidden px-4">

      {/* glow blobs */}
      <div className="absolute w-[400px] h-[400px] rounded-full -top-20 -left-20 pointer-events-none"
        style={{ background: "rgba(109,40,217,0.09)", filter: "blur(80px)" }} />
      <div className="absolute w-[300px] h-[300px] rounded-full bottom-0 right-0 pointer-events-none"
        style={{ background: "rgba(91,33,182,0.07)", filter: "blur(70px)" }} />

      <div className="relative z-10 w-full max-w-[420px]">

        {/* logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#7c3aed] rounded-xl flex items-center justify-center text-white text-[14px]">✦</div>
          <span className="text-[16px] font-medium text-[#ede9fe]">CareerAI</span>
        </div>

        {/* card */}
        <div className="bg-[#120f26] border border-[#7c3aed]/18 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{ background: "linear-gradient(90deg,transparent,#7c3aed,#a78bfa,transparent)" }} />

          <h1 className="text-[22px] font-semibold text-[#ede9fe] mb-1">Welcome back</h1>
          <p className="text-[13px] text-[#5b5475] mb-7">Log in to your CareerAI account</p>

          {/* google button */}
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
            <span className="text-[11px] text-[#3d375a]">or sign in with email</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* error */}
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-[#f87171]/8 border border-[#f87171]/20 rounded-xl text-[12px] text-[#f87171]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-[11px] text-[#5b5475] block mb-1.5">Email address</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="rahul@gmail.com"
                className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/9 rounded-xl text-[#94a3b8] text-[13px] outline-none focus:border-[#7c3aed]/50 focus:text-[#e2e8f0] transition-all placeholder-[#3d375a]"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] text-[#5b5475]">Password</label>
                <span className="text-[11px] text-[#7c3aed] cursor-pointer hover:text-[#a78bfa] transition-colors">Forgot password?</span>
              </div>
              <input
                name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="Your password"
                className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/9 rounded-xl text-[#94a3b8] text-[13px] outline-none focus:border-[#7c3aed]/50 focus:text-[#e2e8f0] transition-all placeholder-[#3d375a]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Logging in...</>
              ) : "Log in to my account →"}
            </button>
          </form>

          <p className="text-[12px] text-[#3d375a] text-center mt-5">
            New here?{" "}
            <Link to="/register" className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors">
              Create a free account
            </Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-[#3d375a] mt-6">
          <Link to="/" className="hover:text-[#5b5475] transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
