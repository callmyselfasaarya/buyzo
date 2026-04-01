import { useState, useRef, useEffect } from "react";
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
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                onSend(s);
                setShowSuggestions(false);
              }}
              className="text-xs px-3 py-2 glass-card hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-secondary" />
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="glass-card flex items-end gap-2 p-2">
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
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground px-2 py-2 font-body"
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
