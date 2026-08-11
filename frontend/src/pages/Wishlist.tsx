import { AppLayout } from "@/components/layout/AppLayout";
import { Heart, Sparkles } from "lucide-react";

export default function Wishlist() {
  return (
    <AppLayout>
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-6 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-h2 font-bold text-white mb-2">Your Wishlist</h1>
            <p className="text-muted-foreground text-sm">
              Items you've saved. Buyzo monitors these for price drops.
            </p>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Monitoring Active
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-20">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No items yet</h3>
          <p className="text-muted-foreground max-w-sm mb-8">
            When you find a product you like in the chat, click the heart icon to save it here.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
