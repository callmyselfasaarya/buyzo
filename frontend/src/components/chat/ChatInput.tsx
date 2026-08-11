import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, ArrowUp, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSend: (msg: string) => void;
  isLoading: boolean;
  onStop?: () => void;
}

export function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-6 px-4">
      <motion.div 
        className={`relative glass-card rounded-3xl p-2 transition-all duration-300 ${
          isFocused ? "shadow-glow-sm border-primary/50 bg-black/60" : "hover:border-white/20 bg-black/40"
        }`}
        animate={isFocused ? { y: -2 } : { y: 0 }}
      >
        <div className="flex items-end gap-2">
          {/* Attachment Button */}
          <button className="p-3 text-muted-foreground hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0 mb-0.5">
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask Buyzo about any product..."
            className="flex-1 bg-transparent border-none outline-none resize-none py-3.5 text-[15px] text-white placeholder:text-muted-foreground min-h-[44px] max-h-[150px] overflow-y-auto no-scrollbar"
            rows={1}
          />

          {/* Actions (Voice / Send / Stop) */}
          <div className="flex items-center gap-2 pr-1 shrink-0 mb-1">
            <AnimatePresence mode="wait">
              {input.trim() === "" && !isLoading ? (
                <motion.button
                  key="mic"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-2.5 text-muted-foreground hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <Mic className="w-5 h-5" />
                </motion.button>
              ) : isLoading ? (
                <motion.button
                  key="stop"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={onStop}
                  className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <Square className="w-4 h-4 fill-white" />
                </motion.button>
              ) : (
                <motion.button
                  key="send"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSubmit}
                  className="p-2.5 rounded-full btn-gradient text-white shadow-glow-sm"
                >
                  <ArrowUp className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      <div className="text-center mt-3 text-xs text-muted-foreground">
        Buyzo can make mistakes. Consider verifying important information.
      </div>
    </div>
  );
}
