import { useState } from "react";
import { Search, Mic, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // In a real app, we'd navigate to search results or start a chat
      navigate("/chat", { state: { initialQuery: query } });
    }
  };

  return (
    <div className="relative w-full">
      <motion.form 
        onSubmit={handleSubmit}
        className={`relative flex items-center w-full glass-panel rounded-2xl transition-all duration-300 ${
          isFocused ? "shadow-glow-sm border-primary/50 bg-black/80" : "hover:bg-white/[0.08]"
        }`}
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
      >
        <div className="pl-4 pr-2 text-muted-foreground">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask Buyzo anything..."
          className="flex-1 bg-transparent border-none outline-none py-4 text-sm text-white placeholder:text-muted-foreground"
        />

        <div className="flex items-center gap-2 pr-3">
          <button 
            type="button"
            className="p-2 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/10"
            title="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>
          
          <AnimatePresence>
            {query.trim().length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="submit"
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors shadow-glow-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.form>

      {/* Autocomplete Dropdown - Shown when focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl p-2 border border-white/10 shadow-2xl overflow-hidden z-50"
          >
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Trending Searches
            </div>
            {[
              "Best gaming laptops under ₹90,000",
              "Noise cancelling headphones",
              "iPhone 15 Pro vs Samsung S24 Ultra",
              "Budget mechanical keyboards"
            ].map((term) => (
              <button
                key={term}
                onMouseDown={() => {
                  setQuery(term);
                  navigate("/chat", { state: { initialQuery: term } });
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                {term}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
