import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Bot, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#050505" }}>
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse, rgba(124, 58, 237, 0.5) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center z-10 px-6"
      >
        {/* 404 large */}
        <p className="text-[120px] font-black leading-none gradient-text mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          404
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-white/40 max-w-sm mx-auto mb-10 text-sm leading-relaxed">
          Looks like this page went on a shopping trip and never came back. Let's get you back on track.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full btn-gradient text-white font-semibold text-sm shadow-glow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
