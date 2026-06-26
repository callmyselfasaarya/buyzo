import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

interface RecommendationBadgeProps {
  reason: string;
  productName?: string;
}

export function RecommendationBadge({ reason, productName }: RecommendationBadgeProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full rounded-2xl overflow-hidden border border-purple-500/25 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent"
      style={{
        boxShadow: "0 0 30px rgba(124, 58, 237, 0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Subtle glow layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(124,58,237,0.15) 0%, transparent 60%)",
        }}
      />

      <button
        onClick={() => setExpanded((v) => !v)}
        className="relative w-full flex items-center gap-3 px-4 py-3 text-left group"
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shadow-inner">
          <Sparkles className="w-4 h-4 text-purple-300" />
        </div>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] text-purple-400/80 uppercase tracking-[0.2em] font-bold">
              AI Recommended
            </span>
            <span className="w-1 h-1 rounded-full bg-purple-500/50" />
            <span className="text-[9px] text-purple-400/60 uppercase tracking-widest">
              Best Pick
            </span>
          </div>
          {productName && (
            <p className="text-sm font-semibold text-white truncate">{productName}</p>
          )}
        </div>

        {/* Expand toggle */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-white/30 group-hover:text-white/60 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Expandable reason */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="reason"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-purple-500/15">
              <p className="text-sm text-white/70 leading-relaxed pt-3">
                {reason}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
