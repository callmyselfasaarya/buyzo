import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-primary/20" : "bg-secondary/20"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary" />
        ) : (
          <Bot className="w-4 h-4 text-secondary" />
        )}
      </div>

      <div className={`flex-1 max-w-[85%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-primary/15 text-foreground rounded-tr-md"
              : "bg-muted/50 text-foreground rounded-tl-md"
          }`}
        >
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {message.products && message.products.length > 0 && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {message.products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
