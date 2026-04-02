import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const suggestions = [
  "Best phone under ₹20,000 with good camera",
  "Gaming laptop under ₹80,000",
  "Compare AirPods Pro vs Sony XM6",
  "Budget tablet for students",
];

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-3">
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => {
                onSend(s);
                setShowSuggestions(false);
              }}
              className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-primary/40 text-white/60 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              {s}
            </motion.button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 p-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask me anything about products..."
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-white placeholder:text-white/30 px-2 py-2"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-30 transition-all flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
