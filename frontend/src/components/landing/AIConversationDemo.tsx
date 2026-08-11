import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Bot, User, CheckCircle2, ChevronRight } from "lucide-react";

export function AIConversationDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto glass-card p-6 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
      {/* User Message */}
      <motion.div 
        className="flex gap-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-secondary" />
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-sm text-white/90">I need a phone below ₹30k.</p>
        </div>
      </motion.div>

      {/* AI Processing / Extraction */}
      <AnimatePresence mode="wait">
        {step >= 1 && (
          <motion.div
            key="ai-thinking"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex gap-4 mb-6"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-primary mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Extracting Intent...
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Category", val: "Phone", show: step >= 1 },
                  { label: "Budget", val: "₹30,000 max", show: step >= 2 },
                  { label: "Purpose", val: "General Use", show: step >= 2 }
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: item.show ? 1 : 0, scale: item.show ? 1 : 0.9 }}
                    className="glass-panel px-3 py-2 rounded-lg text-xs"
                  >
                    <span className="text-muted-foreground block mb-0.5">{item.label}</span>
                    <span className="text-white font-medium flex items-center gap-1">
                      {item.show && <CheckCircle2 className="w-3 h-3 text-success" />}
                      {item.val}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Revelation */}
      <AnimatePresence>
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pl-12"
          >
            <div className="glass-panel rounded-xl p-3 border border-white/10 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/10" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Nothing Phone (2a)</div>
                  <div className="text-xs text-success font-medium">₹25,999 • 95% Match</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 10 }}
              className="glass-panel rounded-xl p-3 border border-white/10 mt-2 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/10" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Poco X6 Pro</div>
                  <div className="text-xs text-success font-medium">₹26,999 • 92% Match</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
