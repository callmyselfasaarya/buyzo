import { motion } from "framer-motion";
import { MessageSquare, Zap, Target, LineChart, Tag, RefreshCcw, Brain, CheckCircle2 } from "lucide-react";

const features = [
  { icon: MessageSquare, title: "Natural Language", desc: "Buyzo understands exactly what you mean." },
  { icon: Target, title: "Smart Recommendations", desc: "Curated lists of products that fit your exact needs." },
  { icon: Zap, title: "Budget Optimization", desc: "Finds the best value within your specified budget." },
  { icon: RefreshCcw, title: "Product Comparison", desc: "Side-by-side spec comparison to help you decide." },
  { icon: LineChart, title: "Price History", desc: "Tracks price fluctuations to ensure you buy at the right time." },
  { icon: Tag, title: "Drop Alerts", desc: "Get notified the moment a product goes on sale." },
  { icon: Brain, title: "Conversation Memory", desc: "Remembers your preferences across multiple sessions." },
  { icon: CheckCircle2, title: "Explained Choices", desc: "AI explains exactly why a product is recommended." },
];

export function FeatureCards() {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-h2 text-white mb-4">Intelligence built-in.</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Everything you need to make confident purchasing decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card p-6 group hover:border-primary/50 transition-all cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                <f.icon className="w-6 h-6 text-white/70 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
