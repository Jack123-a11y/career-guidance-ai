import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ChatBubble({ role, text }) {
  const isUser = role === "USER";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-[9px] bg-[#7c3aed]/15 flex items-center justify-center text-[14px] text-[#a78bfa] flex-shrink-0 mr-2.5">
          <i className="ti ti-sparkles" aria-hidden="true" />
        </div>
      )}
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line
          ${isUser
            ? "bg-[#7c3aed] text-white rounded-br-[4px]"
            : "bg-[#120f26] border border-white/6 text-[#c4b8f0] rounded-bl-[4px]"}`}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-8 h-8 rounded-[9px] bg-[#7c3aed]/15 flex items-center justify-center text-[14px] text-[#a78bfa] flex-shrink-0 mr-2.5">
        <i className="ti ti-sparkles" aria-hidden="true" />
      </div>
      <div className="bg-[#120f26] border border-white/6 rounded-2xl rounded-bl-[4px] px-4 py-3.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-[#7c3aed]/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 bg-[#7c3aed]/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 bg-[#7c3aed]/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "Review my resume and suggest improvements",
  "What skills should I learn for a backend role?",
  "Give me a 3-month learning plan",
  "How do I prepare for a technical interview?",
];

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]); // [{ role: "USER" | "AI", text }]
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [resumeAvailable, setResumeAvailable] = useState(null); // null = unknown, true/false once checked
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get("/resume/status")
      .then(res => setResumeAvailable(!!res.data.hasResume))
      .catch(() => setResumeAvailable(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || sending) return;

    setMessages(prev => [...prev, { role: "USER", text }]);
    setInput("");
    setSending(true);

    try {
      const res = await api.post("/chat/send", { message: text });
      setMessages(prev => [...prev, { role: "AI", text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "AI",
        text: "Sorry, something went wrong sending that. Please try again."
      }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0b1a] flex flex-col px-7 py-7" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>

      <div className="text-[12px] text-[#3d375a] mb-1">
        <span className="text-[#7c3aed] cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span> / AI chat
      </div>

      <div className="flex items-center justify-between mt-1 mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-[#ede9fe] tracking-[-0.3px] mb-1">Career chatbot</h1>
          <p className="text-[13px] text-[#5b5475]">Ask anything about your career, resume, or interview prep</p>
        </div>
        {resumeAvailable === false && (
          <div
            onClick={() => navigate("/dashboard/resume")}
            className="flex items-center gap-2 text-[11.5px] text-[#f87171] bg-[#f87171]/8 border border-[#f87171]/20 rounded-full px-3.5 py-1.5 cursor-pointer hover:bg-[#f87171]/12 transition-all flex-shrink-0"
          >
            <i className="ti ti-file-off text-[12px]" aria-hidden="true" />
            No resume — replies won't be personalized
          </div>
        )}
      </div>

      <div className="flex-1 max-w-[820px] w-full mx-auto flex flex-col bg-[#120f26] border border-white/6 rounded-2xl overflow-hidden">

        {/* messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6" style={{ minHeight: "420px", maxHeight: "60vh" }}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-[#7c3aed]/12 border border-[#7c3aed]/20 flex items-center justify-center text-[22px] text-[#a78bfa] mb-4">
                <i className="ti ti-robot" aria-hidden="true" />
              </div>
              <p className="text-[14px] font-medium text-[#ede9fe] mb-1.5">Ask me anything</p>
              <p className="text-[12px] text-[#5b5475] mb-6 max-w-[320px] leading-relaxed">
                I can help with resume feedback, roadmaps, interview prep, and more — personalized to your resume when available.
              </p>
              <div className="flex flex-col gap-2 w-full max-w-[380px]">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-[12px] text-[#9d8fc0] text-left px-4 py-2.5 bg-white/3 border border-white/6 rounded-[10px] hover:border-[#7c3aed]/30 hover:bg-white/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role} text={m.text} />
              ))}
              {sending && <TypingIndicator />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* input */}
        <div className="border-t border-white/6 px-5 py-4 flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 bg-white/4 border border-white/8 rounded-[12px] px-4 py-3 text-[13px] text-[#ede9fe] placeholder:text-[#3d375a] outline-none focus:border-[#7c3aed]/40 transition-all resize-none max-h-[120px]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="flex-shrink-0 w-11 h-11 rounded-[12px] bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
          >
            <i className="ti ti-send text-[16px]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}