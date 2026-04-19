import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ArrowLeft, Loader2, Zap, Sparkles, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatMessage, type Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { searchProducts, type Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import ParticleBackground from "@/components/ParticleBackground";

// Safe UUID generation fallback
const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 9);
};

function extractProductsFromResponse(userMessage: string, aiResponse: string): Product[] {
  const msg = userMessage.toLowerCase();
  const filters: { category?: string; maxPrice?: number; query?: string } = {};

  if (msg.includes("phone") || msg.includes("mobile") || msg.includes("smartphone")) filters.category = "phone";
  else if (msg.includes("laptop") || msg.includes("notebook")) filters.category = "laptop";
  else if (msg.includes("headphone") || msg.includes("earphone") || msg.includes("airpod") || msg.includes("earbuds")) filters.category = "headphones";
  else if (msg.includes("watch") || msg.includes("smartwatch")) filters.category = "smartwatch";
  else if (msg.includes("tablet") || msg.includes("ipad")) filters.category = "tablet";

  const priceMatch = msg.match(/(?:under|below|within|budget|less than|max|upto|up to)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
  if (priceMatch) filters.maxPrice = parseInt(priceMatch[1].replace(/,/g, ""));

  const priceMatch2 = msg.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i);
  if (!filters.maxPrice && priceMatch2) filters.maxPrice = parseInt(priceMatch2[1].replace(/,/g, ""));

  if (filters.category || filters.maxPrice) return searchProducts(filters).slice(0, 4);

  const allProducts = searchProducts({});
  const mentioned = allProducts.filter(p =>
    aiResponse.toLowerCase().includes(p.name.toLowerCase()) ||
    aiResponse.toLowerCase().includes(p.brand.toLowerCase())
  );
  return mentioned.slice(0, 4);
}

// AI thinking shimmer animation
function AIThinkingLoader() {
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
        {/* Shimmer bars */}
        <div className="h-3 rounded-full shimmer bg-white/8 w-3/4" />
        <div className="h-3 rounded-full shimmer bg-white/8 w-full" />
        <div className="h-3 rounded-full shimmer bg-white/8 w-1/2" />
        <div className="flex items-center gap-2 pt-1">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-purple-400/60"
                animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">AI is thinking...</span>
        </div>
      </div>
    </motion.div>
  );
}

// Empty state greeting
function EmptyState() {
  const suggestions = [
    "Best phone under ₹20,000 with good camera",
    "Gaming laptop under ₹80,000",
    "Compare AirPods Pro vs Sony XM6",
    "Budget tablet for students",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center h-full py-20 text-center px-4"
    >
      {/* Central glow orb */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-brand flex items-center justify-center shadow-glow-lg">
          <Bot className="w-9 h-9 text-white" />
        </div>
        <div className="absolute inset-0 rounded-3xl bg-gradient-brand opacity-30 blur-xl -z-10 scale-150 animate-pulse-glow" />
        {/* Orbiting sparkle */}
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-400/20 border border-purple-400/40 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50% 200%" }}
        >
          <Sparkles className="w-2.5 h-2.5 text-purple-300" />
        </motion.div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/8 border border-purple-500/20 text-purple-300 text-[10px] font-medium uppercase tracking-widest mb-6">
        <Zap className="w-3 h-3" />
        AI Shopping Intelligence Active
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        How can I <span className="gradient-text">help you</span> shop today?
      </h2>
      <p className="text-sm text-white/40 max-w-sm leading-relaxed mb-10">
        Describe your requirements — budget, brand, features — and I'll curate the perfect list.
      </p>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 justify-center max-w-xl">
        {suggestions.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
          >
            <div className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-white/40 flex items-center gap-1.5 cursor-default">
              <Sparkles className="w-3 h-3 text-purple-400/60" />
              {s}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (input: string) => {
    const userMsg: Message = { id: generateId(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const allMessages = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    let assistantContent = "";
    const assistantId = generateId();

    try {
      const resp = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: allMessages }),
      });

      if (!resp.ok) throw new Error("Request failed");

      const data = await resp.json();
      assistantContent = data.reply;

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: assistantContent,
          products: data.products,
        },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: assistantContent || "Sorry, I couldn't connect to the backend. Please try again!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen relative overflow-hidden" style={{ background: "#050505" }}>
      {/* Three.js interactive particle layer */}
      <ParticleBackground />

      {/* Background layers above particles */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" style={{ zIndex: 2 }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(124, 58, 237, 0.5) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 2 }}
      />

      {/* ===== HEADER ===== */}
      <header className="relative z-10 flex items-center gap-4 px-4 md:px-6 py-4 border-b border-white/6 bg-black/60 backdrop-blur-2xl">
        <Link
          to="/"
          className="group p-2 rounded-xl hover:bg-white/6 border border-transparent hover:border-white/8 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
        </Link>

        <div className="w-px h-4 bg-white/10" />

        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Buyzo AI
            </h1>
            <p className="text-[10px] text-white/35 uppercase tracking-widest">Shopping Console · v1.0</p>
          </div>
        </div>

        {/* Loading indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20"
            >
              <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
              <span className="text-[10px] text-purple-300 font-medium">Processing</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Branding */}
        <div className="hidden md:flex ml-auto items-center gap-2 text-white/20">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Buyzo</span>
        </div>
      </header>

      {/* ===== MESSAGES ===== */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto no-scrollbar"
      >
        {messages.length === 0 ? (
          <EmptyState />
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

      {/* ===== INPUT ===== */}
      <div className="relative z-10 border-t border-white/6 bg-black/50 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto w-full px-4 md:px-6 py-4">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
          <p className="text-[10px] text-center mt-3 text-white/20 tracking-widest uppercase">
            Press <kbd className="font-mono px-1 py-0.5 rounded bg-white/8 border border-white/12 text-white/50">Enter</kbd> to send
            &nbsp;·&nbsp;
            <kbd className="font-mono px-1 py-0.5 rounded bg-white/8 border border-white/12 text-white/50">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
