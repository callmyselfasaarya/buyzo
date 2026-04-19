import { motion, useMotionValue, useSpring } from "framer-motion";
import { Bot, ShoppingBag, Sparkles, Zap, MessageCircle, TrendingUp, ArrowRight, Star, Shield, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";

const features = [
  {
    icon: Cpu,
    title: "AI-Powered",
    desc: "Advanced language models understand your needs and find the perfect match instantly.",
    glow: "rgba(124, 58, 237, 0.4)",
  },
  {
    icon: TrendingUp,
    title: "Price Intelligence",
    desc: "Real-time price comparison across hundreds of brands and retailers.",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Sub-second product recommendations curated to your exact specifications.",
    glow: "rgba(124, 58, 237, 0.4)",
  },
  {
    icon: Shield,
    title: "Trusted Catalog",
    desc: "Verified products across phones, laptops, audio gear, wearables and more.",
    glow: "rgba(59, 130, 246, 0.4)",
  },
];

const chatPreviewMessages = [
  { role: "user", text: "Best phone under ₹30k with great camera?" },
  { role: "ai", text: "I found 4 perfect matches for you! Top pick: Pixel 8a — 50MP camera, 7 years of updates, ₹29,999." },
];

// Cursor glow hook
function useCursorGlow() {
  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);
  const springX = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [cursorX, cursorY]);

  return { springX, springY };
}

// Floating blob component
function FloatingBlob({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <motion.div
      animate={{
        borderRadius: [
          "60% 40% 30% 70% / 60% 30% 70% 40%",
          "30% 60% 70% 40% / 50% 60% 30% 60%",
          "60% 40% 30% 70% / 60% 30% 70% 40%",
        ],
        scale: [1, 1.05, 1],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className={className}
      style={style}
    />
  );
}

// Typing dot animation
function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-purple-400"
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// Animated chat preview
function ChatPreview() {
  const [aiVisible, setAiVisible] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setTyping(true), 1200);
    const t2 = setTimeout(() => { setTyping(false); setAiVisible(true); }, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative max-w-md w-full mx-auto mt-16"
    >
      {/* Glow behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/10 blur-3xl -z-10 rounded-3xl scale-110" />

      <div className="glass-card p-6 space-y-4 neon-focus border border-white/10 rounded-2xl shadow-card">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/8">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white tracking-wide">Buyzo AI</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] text-muted-foreground">Active</p>
            </div>
          </div>
          <div className="ml-auto flex gap-1">
            {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/10" />)}
          </div>
        </div>

        {/* User message */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-end"
        >
          <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/20 border border-purple-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
            <p className="text-sm text-white/90">{chatPreviewMessages[0].text}</p>
          </div>
        </motion.div>

        {/* AI typing indicator */}
        {typing && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-2.5">
              <TypingDots />
            </div>
          </motion.div>
        )}

        {/* AI response */}
        {aiVisible && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="bg-white/4 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-sm text-white/85 leading-relaxed">{chatPreviewMessages[1].text}</p>
            </div>
          </motion.div>
        )}

        {/* Input bar preview */}
        <div className="pt-1">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span className="text-xs text-muted-foreground flex-1">Ask anything about products...</span>
            <div className="w-6 h-6 rounded-lg bg-gradient-brand flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Index() {
  const { springX, springY } = useCursorGlow();

  const handleExploreFeatures = () => {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#050505" }}>
      {/* Three.js particle layer — z-index 1, 23% opacity */}
      <ParticleBackground />

      {/* Cursor glow */}
      <motion.div
        className="cursor-glow hidden lg:block"
        style={{ x: springX, y: springY, zIndex: 2 }}
      />

      {/* Background layers */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" style={{ zIndex: 2 }} />

      {/* Hero glow blobs — sit just above particles */}
      <FloatingBlob
        className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124, 58, 237, 0.6) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 2 }}
      />
      <FloatingBlob
        className="absolute top-[5%] right-[10%] w-[400px] h-[400px] opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 2 }}
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(124, 58, 237, 0.4) 0%, transparent 70%)", filter: "blur(40px)", zIndex: 2 }}
      />

      {/* ===== NAVBAR ===== */}
      <div style={{ position: "relative", zIndex: 50 }}>
        <Navbar />
      </div>

      {/* ===== HERO ===== */}
      <main className="relative flex-1 flex flex-col items-center pt-32 pb-20 px-6" style={{ zIndex: 10 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto w-full"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/25 bg-purple-500/8 text-purple-300 text-xs font-medium mb-8 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <Sparkles className="w-3 h-3" />
            <span>Meet your AI Shopping Assistant</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.04] tracking-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Shop Smarter{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">with AI</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
          >
            Find the perfect products instantly using conversational AI
            <br className="hidden md:block" />
            tailored to your needs and budget.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Link
              to="/chat"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base text-white btn-gradient shadow-glow-md"
            >
              <MessageCircle className="w-5 h-5" />
              Start Shopping
              <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <button
              onClick={handleExploreFeatures}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base text-white bg-white/6 border border-white/12 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              Explore Features
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-1.5 text-xs text-white/30"
          >
            <div className="flex -space-x-1.5">
              {["#a78bfa", "#818cf8", "#60a5fa", "#34d399", "#f472b6"].map((c, i) => (
                <div key={i} className="w-5 h-5 rounded-full border border-black/80" style={{ background: c }} />
              ))}
            </div>
            <span className="ml-1.5">Join <span className="text-white/60 font-medium">2,400+</span> shoppers using AI</span>
            <div className="flex gap-0.5 ml-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </motion.div>

          {/* Chat preview */}
          <ChatPreview />
        </motion.div>

        {/* ===== FEATURES ===== */}
        <motion.div
          id="features"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl w-full mt-40 mb-10 scroll-mt-20"
        >
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-purple-400 uppercase tracking-[0.2em] mb-3">Why Buyzo</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Built for the{" "}
              <span className="gradient-text">modern shopper</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="glass-card p-7 space-y-4 group cursor-default"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${f.glow.replace("0.4", "0.15")}, transparent)`,
                  }}
                >
                  <f.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-white tracking-tight">{f.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ===== CTA BANNER ===== */}
        <motion.div
          id="pricing"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full mt-20 relative scroll-mt-20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-2xl rounded-3xl scale-105" />
          <div className="relative glass-card p-12 text-center rounded-3xl border border-white/10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-6">
              <Zap className="w-3 h-3" />
              Try it free — no sign up required
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Ready to shop smarter?
            </h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">Just describe what you're looking for and our AI will surface the best options instantly.</p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base text-white btn-gradient shadow-glow-md"
            >
              <MessageCircle className="w-5 h-5" />
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/6 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-white/70">Buyzo</span>
          </div>
          <div className="text-xs">© 2026 Buyzo Inc. — AI-native shopping intelligence.</div>
          <div className="flex gap-6 text-xs">
            {["Twitter", "GitHub", "Discord"].map((s) => (
              <a key={s} href="#" className="hover:text-white/70 transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
