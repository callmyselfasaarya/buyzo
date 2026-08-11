import { useState } from "react";
import { Heart, GitCompare, ExternalLink, Star, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  features: string[];
  description: string;
  buy_url: string;
  price_drop?: number;
  price_drop_days?: number;
  source: string;
}

export function RecommendationCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Mock an AI match score based on rating
  const matchScore = Math.min(99, Math.max(85, Math.round(product.rating * 18 + 5)));

  return (
    <motion.div 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-card overflow-hidden group relative flex flex-col h-full cursor-default"
    >
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-semibold text-white">{matchScore}% Match</span>
        </div>
        {discount > 0 && (
          <div className="bg-destructive/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-destructive/50 flex items-center gap-1 text-[11px] font-bold text-white">
            <TrendingDown className="w-3 h-3" />
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`p-2 rounded-full backdrop-blur-md border transition-all ${
            isWishlisted ? "bg-red-500/20 border-red-500/50 text-red-500" : "bg-black/40 border-white/10 text-white/70 hover:text-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-white/5 p-6 flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-white/5 rounded-xl animate-pulse" />
        )}
        
        {/* Glow behind image on hover */}
        <div className={`absolute inset-0 bg-primary/20 blur-[60px] rounded-full mix-blend-screen transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`} />
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col relative z-10 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">{product.brand}</div>
        <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded text-xs font-medium">
            <Star className="w-3 h-3 fill-current" />
            {product.rating}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors">
              <GitCompare className="w-3.5 h-3.5" />
              Compare
            </button>
            <a 
              href={product.buy_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl btn-gradient text-xs font-semibold text-white shadow-glow-sm"
            >
              Buy Now
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
