import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { Timeline } from "@/components/landing/Timeline";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

export default function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden selection:bg-primary/30 text-foreground">
      <ParticleBackground />
      <Navbar />
      
      <main className="relative z-10 flex flex-col">
        <HeroSection />
        
        {/* The user requested a product carousel showcase, but since the mock data might not be ready, we'll keep it simple or implement a static one if needed. */}
        <Timeline />
        <FeatureCards />
        
        {/* Testimonials or Final CTA */}
        <section className="py-32 px-6 relative flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent blur-[100px] pointer-events-none" />
          
          <h2 className="text-h2 font-bold text-white mb-6">Ready to shop smarter?</h2>
          <p className="text-secondary max-w-md mx-auto mb-10">
            Join thousands of users who have upgraded their shopping experience with Buyzo AI.
          </p>
          
          <Link
            to="/chat"
            className="btn-gradient px-10 py-5 rounded-full font-semibold text-lg text-white flex items-center gap-3 shadow-glow-md hover:shadow-glow-lg transition-all"
          >
            <MessageCircle className="w-6 h-6" />
            Start Chatting
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-muted-foreground text-sm relative z-10">
        <p>© 2026 Buyzo AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
