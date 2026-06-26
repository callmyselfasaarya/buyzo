import { motion } from "framer-motion";
import { Star, Heart, ExternalLink, Crown, ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";
import { useState } from "react";
import { PriceTrendBadge } from "./PriceTrendBadge";

interface ProductCardProps {
  product: Product;
  index?: number;
  isBestPick?: boolean;
}

export function ProductCard({ product, index = 0, isBestPick = false }: ProductCardProps) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isAmazon = product.source === "amazon";

  const handleView = () => {
    if (product.buy_url) {
      window.open(product.buy_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-500 ${
        isBestPick ? "border-purple-500/40 bg-purple-500/5" : "border-white/8 bg-white/3"
      }`}
      style={{
        boxShadow: isBestPick
          ? "0 8px 40px rgba(124,58,237,0.2), 0 0 0 1px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.06)"
          : hovered
          ? "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(124, 58, 237, 0.12), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Gradient border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)",
        }}
      />

      {/* Product image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white/4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700"
            loading="lazy"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <ShoppingCart className="w-10 h-10 text-white/20" />
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />

        {/* Best pick badge */}
        {isBestPick && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-glow-sm">
              <Crown className="w-2.5 h-2.5" />
              Best Pick
            </span>
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && !isBestPick && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-brand text-white text-[10px] font-bold uppercase tracking-wider shadow-glow-sm">
              -{discount}%
            </span>
          </div>
        )}

        {/* Source badge (Amazon indicator) */}
        {isAmazon && (
          <div className="absolute top-3 right-10 z-10">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[9px] font-bold uppercase tracking-wider">
              Amazon
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <motion.button
          onClick={() => setSaved(!saved)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/12 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-red-400/30"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-all ${saved ? "fill-red-400 text-red-400" : "text-white/70"}`}
          />
        </motion.button>

        {/* Rating overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-white">{product.rating}</span>
            {product.reviewCount > 0 && (
              <span className="text-[9px] text-white/40 ml-0.5">
                ({product.reviewCount.toLocaleString("en-IN")})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <p className="text-[10px] text-purple-400/70 uppercase tracking-[0.2em] font-semibold">
          {product.brand}
        </p>

        {/* Product name */}
        <h3 className="font-semibold text-white text-sm leading-snug tracking-tight line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Price drop badge */}
        {product.price_drop && product.price_drop > 0 && (
          <PriceTrendBadge
            dropAmount={product.price_drop}
            daysAgo={product.price_drop_days ?? 7}
          />
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base text-white">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-white/30 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <motion.button
            onClick={handleView}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${
              isAmazon
                ? "bg-orange-500/12 border border-orange-500/25 text-orange-300 hover:bg-orange-500/20 hover:border-orange-500/40"
                : "bg-purple-500/12 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40"
            }`}
          >
            <ExternalLink className="w-3 h-3" />
            {isAmazon ? "Amazon" : "View"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
