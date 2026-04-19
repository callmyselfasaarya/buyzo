import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const suggestions = [
  "Best phone under ₹20,000",
  "Gaming laptop under ₹80k",
  "AirPods Pro vs Sony XM6",
  "Budget tablet for students",
];

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
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

  const handleSuggestion = (s: string) => {
    onSend(s);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-3">
      {/* Suggestion chips */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {suggestions.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                onClick={() => handleSuggestion(s)}
                className="group text-[11px] font-medium px-3.5 py-1.5 bg-white/5 border border-white/8 hover:border-purple-500/40 hover:bg-purple-500/8 text-white/40 hover:text-white/80 transition-all duration-300 flex items-center gap-1.5 rounded-full"
              >
                <Sparkles className="w-2.5 h-2.5 text-purple-400 opacity-60 group-hover:opacity-100" />
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input container */}
      <div className="relative">
        {/* Neon glow border effect when focused */}
        <motion.div
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.98,
          }}
          transition={{ duration: 0.3 }}
          className="absolute -inset-[1px] rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(59, 130, 246, 0.3), transparent 60%)",
          }}
        />

        <div
          className={`relative flex items-end gap-2 p-2.5 rounded-2xl border transition-all duration-300 ${
            isFocused
              ? "bg-black/80 border-purple-500/30 shadow-[0_0_30px_rgba(124,58,237,0.12)]"
              : "bg-black/60 border-white/10"
          }`}
        >
          {/* AI icon */}
          <div className="flex-shrink-0 mb-1 ml-1">
            <div className="w-6 h-6 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-purple-400" />
            </div>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about products..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-[14px] text-white/90 placeholder:text-white/25 px-2 py-2.5 font-sans leading-relaxed"
          />

          {/* Right actions */}
          <div className="flex items-center gap-1.5 mb-1 flex-shrink-0">
            {/* Character hint */}
            {input.length > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-white/20 mr-1"
              >
                {input.length}
              </motion.span>
            )}

            {/* Send button */}
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-xl font-medium flex items-center justify-center transition-all duration-300 ${
                input.trim() && !isLoading
                  ? "bg-gradient-brand shadow-glow-sm text-white"
                  : "bg-white/8 text-white/25 border border-white/8"
              }`}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
