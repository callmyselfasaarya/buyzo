import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AIConversationDemo } from "./AIConversationDemo";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Column: Text */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary-light text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Buyzo OS v2.0
          </div>
          
          <h1 className="text-hero font-bold text-white mb-6">
            Find the perfect product through <span className="gradient-text-brand">conversation.</span>
          </h1>
          
          <p className="text-body text-secondary max-w-lg mb-10">
            Instead of scrolling through hundreds of products, simply tell Buyzo what you're looking for.
          </p>

          <div className="flex flex-col gap-3 mb-10 w-full max-w-md">
            {[
              "I need a gaming laptop under ₹90,000.",
              "Find me a DSLR for wildlife photography.",
              "I want comfortable office chairs."
            ].map((example, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground text-sm flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                "{example}"
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/chat" className="btn-gradient px-8 py-4 rounded-full font-semibold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Start Shopping
            </Link>
            <button className="btn-glass px-8 py-4 rounded-full font-semibold text-white flex items-center gap-2">
              Watch Demo
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Right Column: Demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          <AIConversationDemo />
        </motion.div>
      </div>
    </section>
  );
}
