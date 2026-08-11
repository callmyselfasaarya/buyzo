import { AppLayout } from "@/components/layout/AppLayout";
import { BellRing, TrendingDown } from "lucide-react";

export default function PriceTracking() {
  return (
    <AppLayout>
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-6 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-h2 font-bold text-white mb-2">Price Alerts</h1>
            <p className="text-muted-foreground text-sm">
              Products you're watching for price drops.
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-20">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative">
            <BellRing className="w-8 h-8 text-white/30" />
            <div className="absolute -top-2 -right-2 bg-primary p-1 rounded-full shadow-glow-sm">
              <TrendingDown className="w-3 h-3 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No active alerts</h3>
          <p className="text-muted-foreground max-w-sm mb-8">
            Tell Buyzo to watch a product, and we'll notify you when the price drops below your target.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
