import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ComparisonTable } from "./ComparisonTable";
import { RecommendationBadge } from "./RecommendationBadge";
import type { Product } from "@/data/products";
import type { ComparisonData } from "./ComparisonTable";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  comparison?: ComparisonData | null;
  recommendationReason?: string | null;
  bestProductId?: string | null;
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  const bestProduct = message.bestProductId
    ? message.products?.find((p) => p.id === message.bestProductId)
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 items-start ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
          isUser
            ? "bg-gradient-to-br from-purple-600/20 to-blue-600/10 border-purple-500/25"
            : "bg-white/5 border-white/10"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-purple-300" />
        ) : (
          <Bot className="w-4 h-4 text-white/50" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] space-y-4 ${isUser ? "items-end flex flex-col" : ""}`}>
        {/* Message bubble */}
        <div
          className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed border transition-all ${
            isUser
              ? "bg-gradient-to-br from-purple-600/20 to-blue-600/10 border-purple-500/20 text-white rounded-tr-sm"
              : "bg-white/4 border-white/8 text-white/85 rounded-tl-sm"
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-p:text-white/80 prose-strong:text-white prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:rounded prose-code:px-1">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* ── Comparison table ──────────────────────────────────────────────── */}
        {!isUser && message.comparison && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="w-full overflow-x-auto"
          >
            <ComparisonTable
              comparison={message.comparison}
              bestProductId={message.bestProductId}
            />
          </motion.div>
        )}

        {/* ── Recommendation badge ──────────────────────────────────────────── */}
        {!isUser && message.recommendationReason && !message.comparison && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="w-full"
          >
            <RecommendationBadge
              reason={message.recommendationReason}
              productName={bestProduct?.name}
            />
          </motion.div>
        )}

        {/* ── Product cards ─────────────────────────────────────────────────── */}
        {message.products && message.products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
          >
            {message.products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                isBestPick={product.id === message.bestProductId}
              />
            ))}
          </motion.div>
        )}

        {/* ── Verdict below comparison (if applicable) ──────────────────────── */}
        {!isUser && message.comparison && message.recommendationReason && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="w-full"
          >
            <RecommendationBadge
              reason={message.recommendationReason}
              productName={bestProduct?.name}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
