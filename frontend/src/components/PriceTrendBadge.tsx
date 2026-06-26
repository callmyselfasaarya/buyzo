import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";

interface PriceTrendBadgeProps {
  dropAmount: number;   // ₹ amount dropped
  daysAgo: number;      // days since the price was higher
}

export function PriceTrendBadge({ dropAmount, daysAgo }: PriceTrendBadgeProps) {
  const label =
    daysAgo <= 1
      ? "today"
      : daysAgo <= 7
      ? `${daysAgo} days ago`
      : "last week";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                 bg-emerald-500/12 border border-emerald-500/25 text-emerald-400 text-[10px] font-semibold"
    >
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      />
      <TrendingDown className="w-3 h-3 flex-shrink-0" />
      <span>
        🔥 ₹{dropAmount.toLocaleString("en-IN")} drop · {label}
      </span>
    </motion.div>
  );
}
