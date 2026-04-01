import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [saved, setSaved] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card p-4 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-xs font-heading font-semibold px-2 py-1 rounded-md">
            {discount}% OFF
          </span>
        )}
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${saved ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
          />
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{product.brand}</p>
        <h3 className="font-heading font-semibold text-foreground text-sm leading-tight">{product.name}</h3>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-primary/10 px-1.5 py-0.5 rounded">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-xs font-semibold text-primary">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-heading font-bold text-lg text-foreground">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {product.features.slice(0, 3).map((f) => (
            <span key={f} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
