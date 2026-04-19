import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatMessage, type Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { searchProducts, type Product } from "@/data/products";
import BlurIn from "@/components/BlurIn";

function extractProductsFromResponse(userMessage: string, aiResponse: string): Product[] {
  const msg = userMessage.toLowerCase();
  const filters: { category?: string; maxPrice?: number; query?: string } = {};

  if (msg.includes("phone") || msg.includes("mobile") || msg.includes("smartphone")) filters.category = "phone";
  else if (msg.includes("laptop") || msg.includes("notebook")) filters.category = "laptop";
  else if (msg.includes("headphone") || msg.includes("earphone") || msg.includes("airpod") || msg.includes("earbuds")) filters.category = "headphones";
  else if (msg.includes("watch") || msg.includes("smartwatch")) filters.category = "smartwatch";
  else if (msg.includes("tablet") || msg.includes("ipad")) filters.category = "tablet";

  const priceMatch = msg.match(/(?:under|below|within|budget|less than|max|upto|up to)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
  if (priceMatch) {
    filters.maxPrice = parseInt(priceMatch[1].replace(/,/g, ""));
  }
  const priceMatch2 = msg.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i);
  if (!filters.maxPrice && priceMatch2) {
    filters.maxPrice = parseInt(priceMatch2[1].replace(/,/g, ""));
  }

  if (filters.category || filters.maxPrice) {
    return searchProducts(filters).slice(0, 4);
  }

  const allProducts = searchProducts({});
  const mentioned = allProducts.filter(p =>
    aiResponse.toLowerCase().includes(p.name.toLowerCase()) ||
    aiResponse.toLowerCase().includes(p.brand.toLowerCase())
  );
  return mentioned.slice(0, 4);
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (input: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const allMessages = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shopping-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: allMessages }),
        }
      );

      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.id === assistantId) {
                  return prev.map((m) => m.id === assistantId ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { id: assistantId, role: "assistant", content: assistantContent }];
              });
            }
          } catch {}
        }
      }

      const products = extractProductsFromResponse(input, assistantContent);
      if (products.length > 0) {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, products } : m)
        );
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: assistantContent || "Sorry, I encountered an error. Please try again!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#070612] relative overflow-hidden">
      {/* Floating glow accents */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] z-0 animate-pulse-glow" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full bg-secondary/10 blur-[80px] z-0 animate-pulse-glow" style={{ animationDelay: "1s" }} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <Link to="/" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-sm text-white">ShopAI Assistant</h1>
            <p className="text-[10px] text-white/50">Powered by AI • Always online</p>
          </div>
        </div>
        {isLoading && <Loader2 className="w-4 h-4 text-primary animate-spin ml-auto" />}
      </motion.header>

      {/* Messages */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 space-y-4"
            >
              <BlurIn>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
              </BlurIn>
              <BlurIn delay={0.2}>
                <h2 className="text-xl font-bold text-white">
                  Hey! I'm your <span className="text-primary">Shopping Assistant</span>
                </h2>
              </BlurIn>
              <BlurIn delay={0.4}>
                <p className="text-sm text-white/60 max-w-md mx-auto">
                  Tell me what you're looking for — budget, features, brand preferences — and I'll find the perfect products for you.
                </p>
              </BlurIn>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-secondary" />
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-2xl rounded-tl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-10 px-4 pb-4 pt-2"
      >
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </motion.div>
    </div>
  );
}
