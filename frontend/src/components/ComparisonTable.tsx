import { motion } from "framer-motion";
import { Trophy, Check, Minus } from "lucide-react";

export interface AttributeRow {
  attribute: string;
  values: string[];
  winner_index?: number | null;
}

export interface ComparisonData {
  products: Array<{ id: string; name: string; brand: string; price: number }>;
  attribute_rows: AttributeRow[];
  verdict: string;
}

interface ComparisonTableProps {
  comparison: ComparisonData;
  bestProductId?: string | null;
}

export function ComparisonTable({ comparison, bestProductId }: ComparisonTableProps) {
  const { products, attribute_rows, verdict } = comparison;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md"
    >
      {/* Header row */}
      <div
        className="grid"
        style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}
      >
        {/* Top-left corner */}
        <div className="px-4 py-3 border-b border-r border-white/8 flex items-center">
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
            Compare
          </span>
        </div>

        {/* Product name columns */}
        {products.map((product, i) => {
          const isBest = product.id === bestProductId;
          return (
            <div
              key={product.id}
              className={`px-4 py-3 border-b border-r last:border-r-0 border-white/8 relative ${
                isBest
                  ? "bg-purple-500/8"
                  : "bg-white/2"
              }`}
            >
              {isBest && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                  <Trophy className="w-2.5 h-2.5 text-purple-400" />
                  <span className="text-[9px] text-purple-300 font-semibold uppercase tracking-wider">
                    Best
                  </span>
                </div>
              )}
              <p className="text-[10px] text-purple-400/70 uppercase tracking-widest font-semibold mb-0.5">
                {product.brand}
              </p>
              <p className="text-sm font-semibold text-white leading-tight pr-10">
                {product.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Attribute rows */}
      {attribute_rows.map((row, rowIdx) => (
        <div
          key={row.attribute}
          className="grid"
          style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}
        >
          {/* Attribute label */}
          <div className={`px-4 py-3 border-b border-r border-white/8 flex items-center ${
            rowIdx % 2 === 0 ? "bg-white/1" : ""
          }`}>
            <span className="text-xs text-white/50 font-medium">{row.attribute}</span>
          </div>

          {/* Values */}
          {row.values.map((val, colIdx) => {
            const isWinner = row.winner_index === colIdx;
            return (
              <div
                key={colIdx}
                className={`px-4 py-3 border-b border-r last:border-r-0 border-white/8 flex items-center gap-2 ${
                  rowIdx % 2 === 0 ? "bg-white/1" : ""
                } ${isWinner ? "bg-emerald-500/6" : ""}`}
              >
                {isWinner ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-white/15 flex-shrink-0" />
                )}
                <span
                  className={`text-xs leading-snug ${
                    isWinner ? "text-emerald-300 font-semibold" : "text-white/55"
                  }`}
                >
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      ))}

      {/* Verdict banner */}
      <div className="px-5 py-4 border-t border-white/8 bg-gradient-to-r from-purple-500/10 via-blue-500/6 to-transparent flex items-start gap-3">
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mt-0.5">
          <Trophy className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <div>
          <p className="text-[10px] text-purple-400/80 uppercase tracking-widest font-semibold mb-1">
            AI Verdict
          </p>
          <p className="text-sm text-white/80 leading-relaxed">
            {verdict}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
