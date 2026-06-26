import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ArrowLeft, Loader2, Zap, Sparkles, ShoppingBag, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatMessage, type Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import ParticleBackground from "@/components/ParticleBackground";

// Safe UUID generation
const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).substring(2, 9);
};

// ── AI Thinking Loader ────────────────────────────────────────────────────────

function AIThinkingLoader() {
  const thoughts = [
    "Analyzing your request…",
    "Comparing options…",
    "Finding best value…",
    "Reasoning through picks…",
  ];
  const [thoughtIdx, setThoughtIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setThoughtIdx((i) => (i + 1) % thoughts.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 items-start"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center shadow-glow-sm">
        <Bot className="w-4 h-4 text-purple-400" />
      </div>
      <div className="space-y-2 flex-1 max-w-xs">
        <div className="h-3 rounded-full shimmer bg-white/8 w-3/4" />
        <div className="h-3 rounded-full shimmer bg-white/8 w-full" />
        <div className="h-3 rounded-full shimmer bg-white/8 w-1/2" />
        <div className="flex items-center gap-2 pt-1">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-purple-400/60"
                animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={thoughtIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] text-muted-foreground"
            >
              {thoughts[thoughtIdx]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  { icon: "📸", text: "Best camera phone under ₹30,000" },
  { icon: "🎮", text: "Gaming laptop under ₹90,000" },
  { icon: "⚖️", text: "Compare iPhone 17 Pro vs Pixel 10 Pro" },
  { icon: "💡", text: "Best value earphones under ₹25,000" },
  { icon: "🏷️", text: "I want something cheaper" },
  { icon: "🔋", text: "Phone with best battery life" },
];

interface EmptyStateProps {
  onSuggestion: (text: string) => void;
}

function EmptyState({ onSuggestion }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center h-full py-16 text-center px-4"
    >
      {/* Central orb */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-brand flex items-center justify-center shadow-glow-lg">
          <Brain className="w-9 h-9 text-white" />
        </div>
        <div className="absolute inset-0 rounded-3xl bg-gradient-brand opacity-30 blur-xl -z-10 scale-150 animate-pulse-glow" />
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-400/20 border border-purple-400/40 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50% 200%" }}
        >
          <Sparkles className="w-2.5 h-2.5 text-purple-300" />
        </motion.div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/8 border border-purple-500/20 text-purple-300 text-[10px] font-medium uppercase tracking-widest mb-5">
        <Zap className="w-3 h-3" />
        Shopping Brain Active
      </div>

      <h2
        className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        What should I find <span className="gradient-text">for you?</span>
      </h2>
      <p className="text-sm text-white/40 max-w-sm leading-relaxed mb-10">
        Describe what you need — I'll reason through the options, compare when asked, and explain
        exactly why I recommend what I do.
      </p>

      {/* Clickable suggestion chips */}
      <div className="flex flex-wrap gap-2 justify-center max-w-xl">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.text}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSuggestion(s.text)}
            className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:border-purple-500/30 hover:bg-purple-500/8 flex items-center gap-1.5 cursor-pointer transition-all duration-200"
          >
            <span>{s.icon}</span>
            {s.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ── Brain Context Banner ──────────────────────────────────────────────────────

function MemoryBanner({ count }: { count: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="flex items-center gap-2 px-4 py-2 bg-purple-500/6 border-b border-purple-500/15 overflow-hidden"
    >
      <Brain className="w-3 h-3 text-purple-400" />
      <span className="text-[10px] text-purple-400/70 tracking-wider">
        Shopping memory active — {count} turn{count !== 1 ? "s" : ""} of context
      </span>
    </motion.div>
  );
}

// ── Main Chat Page ────────────────────────────────────────────────────────────

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track last shown product IDs for multi-turn follow-up resolution
  const lastProductIds = useRef<string[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (input: string) => {
    const userMsg: Message = { id: generateId(), role: "user", content: input };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setIsLoading(true);

    const assistantId = generateId();
    const historyPayload = currentMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const resp = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: historyPayload,
          last_product_ids: lastProductIds.current,
        }),
      });

      if (!resp.ok) throw new Error("Request failed");

      const data = await resp.json();

      // Update last shown product IDs for next turn
      if (data.products?.length) {
        lastProductIds.current = data.products.map((p: { id: string }) => p.id);
      }

      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: data.reply,
        products: data.products ?? [],
        comparison: data.comparison ?? null,
        recommendationReason: data.recommendation_reason ?? null,
        bestProductId: data.best_product_id ?? null,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content:
            "Sorry, I couldn't connect to the backend. Please make sure the server is running.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const handleSuggestion = useCallback(
    (text: string) => {
      if (!isLoading) sendMessage(text);
    },
    [isLoading, sendMessage]
  );

  const turnCount = messages.filter((m) => m.role === "user").length;

  return (
    <div className="flex flex-col h-screen relative overflow-hidden" style={{ background: "#050505" }}>
      {/* Particle layer */}
      <ParticleBackground />

      {/* Background overlays */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" style={{ zIndex: 2 }} />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(124, 58, 237, 0.5) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 2,
        }}
      />

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center gap-4 px-4 md:px-6 py-4 border-b border-white/6 bg-black/60 backdrop-blur-2xl">
        <Link
          to="/"
          className="group p-2 rounded-xl hover:bg-white/6 border border-transparent hover:border-white/8 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
        </Link>

        <div className="w-px h-4 bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black" />
          </div>
          <div>
            <h1
              className="text-sm font-semibold text-white tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Buyzo Brain
            </h1>
            <p className="text-[10px] text-white/35 uppercase tracking-widest">
              Shopping Intelligence · v2.0
            </p>
          </div>
        </div>

        {/* Capabilities pills */}
        <div className="hidden lg:flex items-center gap-2 ml-4">
          {["Memory", "Compare", "Explains Why"].map((cap) => (
            <span
              key={cap}
              className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/30 uppercase tracking-wider"
            >
              {cap}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20"
            >
              <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
              <span className="text-[10px] text-purple-300 font-medium">Thinking…</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`hidden md:flex ${isLoading ? "" : "ml-auto"} items-center gap-2 text-white/20`}>
          <ShoppingBag className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Buyzo</span>
        </div>
      </header>

      {/* ── Memory banner (shows after first exchange) ────────────────────── */}
      <AnimatePresence>
        {turnCount > 1 && (
          <div className="relative z-10">
            <MemoryBanner count={turnCount} />
          </div>
        )}
      </AnimatePresence>

      {/* ── MESSAGES ──────────────────────────────────────────────────────── */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto no-scrollbar">
        {messages.length === 0 ? (
          <EmptyState onSuggestion={handleSuggestion} />
        ) : (
          <div className="max-w-3xl mx-auto w-full px-4 md:px-6 py-8 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <AIThinkingLoader />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── INPUT ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-white/6 bg-black/50 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto w-full px-4 md:px-6 py-4">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
          <p className="text-[10px] text-center mt-3 text-white/20 tracking-widest uppercase">
            Press{" "}
            <kbd className="font-mono px-1 py-0.5 rounded bg-white/8 border border-white/12 text-white/50">
              Enter
            </kbd>{" "}
            to send &nbsp;·&nbsp;{" "}
            <kbd className="font-mono px-1 py-0.5 rounded bg-white/8 border border-white/12 text-white/50">
              Shift+Enter
            </kbd>{" "}
            for new line
          </p>
        </div>
      </div>
    </div>
  );
}
