import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Star, TrendingDown, GitCompare, ExternalLink, ShieldCheck } from "lucide-react";
import { Product } from "./RecommendationCard";

interface ProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDrawer({ product, isOpen, onClose }: ProductDrawerProps) {
  if (!product) return null;

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-white/10 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <span className="text-primary">{product.brand}</span>
                <span className="text-white/30">/</span>
                <span>Details</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
              
              {/* Image Gallery Mock */}
              <div className="w-full bg-white/5 p-8 flex items-center justify-center relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full max-w-[200px] object-contain mix-blend-screen"
                />
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-destructive px-3 py-1 rounded-full text-xs font-bold text-white shadow-glow-sm">
                    {discount}% OFF
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white mb-3 leading-tight">{product.name}</h2>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-3xl font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through mb-1">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium bg-amber-500/10 px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 fill-current" />
                    {product.rating} <span className="text-white/50 font-normal">({product.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Authenticity
                  </div>
                </div>
              </div>

              {/* AI Explanation */}
              <div className="p-6 border-b border-white/10 bg-primary/5">
                <div className="flex items-center gap-2 mb-3 text-primary font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  Why Buyzo Recommends This
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Based on your requirements, the {product.name} offers the best balance of features within your budget. 
                  It excels in performance and build quality, making it a top choice compared to alternatives in this price range.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Top Rated", "Best Value", "Premium Build"].map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-medium text-white/70">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mock Specifications */}
              <div className="p-6 border-b border-white/10">
                <h3 className="text-base font-semibold text-white mb-4">Key Specifications</h3>
                <div className="space-y-3">
                  {[
                    { label: "Brand", value: product.brand },
                    { label: "Category", value: "Electronics" },
                    { label: "Availability", value: "In Stock" },
                    { label: "Warranty", value: "1 Year Manufacturer" }
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-sm text-muted-foreground">{spec.label}</span>
                      <span className="text-sm font-medium text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price History Mock */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-white">Price History</h3>
                  <span className="text-xs text-success flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> Dropped recently
                  </span>
                </div>
                <div className="h-32 w-full rounded-xl bg-white/5 border border-white/10 flex items-end justify-between p-4 px-6 relative">
                  {/* Mock graph bars */}
                  {[40, 50, 45, 60, 55, 30].map((h, i) => (
                    <div key={i} className="w-8 bg-primary/30 rounded-t-sm relative group" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{product.price + h*100}
                      </div>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-sm" />
                    </div>
                  ))}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-background/80 backdrop-blur-lg">
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold text-white transition-colors">
                  <GitCompare className="w-4 h-4" />
                  Compare
                </button>
                <a 
                  href={product.buy_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 rounded-xl btn-gradient text-sm font-semibold text-white shadow-glow-sm"
                >
                  Buy on Amazon
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
