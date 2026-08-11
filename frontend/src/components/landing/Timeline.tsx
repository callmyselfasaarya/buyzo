import { motion } from "framer-motion";

export function Timeline() {
  const steps = [
    { title: "Ask", desc: "Tell Buyzo what you need." },
    { title: "Understand", desc: "AI analyzes intent & budget." },
    { title: "Find", desc: "Searches the best matches." },
    { title: "Compare", desc: "Reviews pros & cons." },
    { title: "Buy", desc: "Purchase confidently." },
  ];

  return (
    <section className="py-24 px-6 relative z-10 bg-black/40 border-y border-white/5">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-h2 text-white mb-16">How it works</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-white/10 -translate-y-1/2" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center mb-12 md:mb-0"
            >
              <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-4 shadow-glow-sm">
                <span className="text-white font-bold">{i + 1}</span>
              </div>
              <h4 className="text-white font-semibold mb-1">{step.title}</h4>
              <p className="text-xs text-muted-foreground max-w-[120px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
