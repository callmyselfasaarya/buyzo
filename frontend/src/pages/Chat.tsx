import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, MessageCircle } from "lucide-react";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { AppLayout } from "@/components/layout/AppLayout";
import { RecommendationCard, Product } from "@/components/product/RecommendationCard";
import { ProductDrawer } from "@/components/product/ProductDrawer";
import { useLocation } from "react-router-dom";

// Safe UUID generation
const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).substring(2, 9);
};

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

const SUGGESTIONS = [
  "Best gaming laptops under ₹90,000",
  "Noise cancelling headphones for travel",
  "Top smartphones with great cameras",
  "Budget mechanical keyboards",
  "Comfortable office chairs",
  "DSLR for wildlife photography"
];

function AIThinkingLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4 items-center py-2"
    >
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 shadow-glow-sm">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // If passed an initial query from the global SearchBar
  useEffect(() => {
    if (location.state?.initialQuery && messages.length === 0) {
      sendMessage(location.state.initialQuery);
    }
  }, [location.state]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (input: string) => {
    const userMsg: Message = { id: generateId(), role: "user", content: input };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setIsLoading(true);

    const assistantId = generateId();
    
    // Minimal mock response to keep it functional before backend is perfectly synced
    // The actual integration with `http://localhost:8000/api/chat` can be placed here.
    try {
      const resp = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: currentMessages.map(m => ({ role: m.role, content: m.content })),
          last_product_ids: []
        }),
      });

      if (!resp.ok) throw new Error("Request failed");
      const data = await resp.json();

      setMessages(prev => [...prev, {
        id: assistantId,
        role: "assistant",
        content: data.reply || "Here are some options.",
        products: data.products || []
      }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: assistantId,
        role: "assistant",
        content: "Sorry, I couldn't connect to the intelligence layer right now. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center mt-20">
      <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mb-6 shadow-glow-lg">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-h2 font-bold text-white mb-2">What are you looking for?</h2>
      <p className="text-muted-foreground mb-12 max-w-md">
        Describe your ideal product, budget, and features. I'll find the best matches.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => sendMessage(s)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left group"
          >
            <MessageCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm text-white/80 group-hover:text-white">{s}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="flex flex-col h-full w-full">
        
        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="max-w-3xl mx-auto w-full px-4 py-6">
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-6 pb-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-4">
                      <ChatBubble role={msg.role} content={msg.content} />
                      
                      {/* Render Product Cards if AI returned any */}
                      {msg.products && msg.products.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pl-12 grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          {msg.products.map(p => (
                            <div key={p.id} onClick={() => setSelectedProduct(p)}>
                              <RecommendationCard product={p} />
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </AnimatePresence>

                <AnimatePresence>
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <AIThinkingLoader />
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gradient-to-t from-background via-background to-transparent pt-6">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>

      <ProductDrawer 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </AppLayout>
  );
}
