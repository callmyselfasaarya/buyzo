import { motion } from "framer-motion";
import { Bot, ShoppingBag, Sparkles, Zap, MessageCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: Bot, title: "AI-Powered", desc: "Smart recommendations using advanced AI" },
  { icon: TrendingUp, title: "Price Tracking", desc: "Compare prices across brands instantly" },
  { icon: Zap, title: "Instant Results", desc: "Get product suggestions in seconds" },
  { icon: ShoppingBag, title: "Wide Catalog", desc: "Phones, laptops, headphones & more" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-primary" />
          </div>
          <span className="font-heading font-bold text-foreground">ShopAI</span>
        </div>
        <Link
          to="/chat"
          className="text-sm font-heading font-medium px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          Open Chat
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl space-y-6"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center glow-primary"
          >
            <Sparkles className="w-10 h-10 text-primary" />
          </motion.div>

          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
            Your AI{" "}
            <span className="gradient-text">Shopping</span>
            <br />
            Assistant
          </h1>

          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            Tell me what you need — budget, features, brand — and I'll find the perfect products for you in seconds.
          </p>

          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-lg glow-primary hover:opacity-90 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Start Shopping
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl w-full"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass-card p-5 text-center space-y-3 hover:border-primary/30 transition-colors"
            >
              <f.icon className="w-6 h-6 text-primary mx-auto" />
              <h3 className="font-heading font-semibold text-sm text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border/30">
        Built with AI • ShopAI 2026
      </footer>
    </div>
  );
}
