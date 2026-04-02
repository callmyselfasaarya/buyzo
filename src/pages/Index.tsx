import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BlurIn from "@/components/BlurIn";
import SplitText from "@/components/SplitText";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#070612]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full object-cover ml-[200px] scale-[1.2] origin-left z-0"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
          type="video/mp4"
        />
      </video>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#070612] to-transparent z-10" />

      {/* Left-side gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070612] via-[#070612]/80 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col gap-6 max-w-2xl">
            {/* Badge */}
            <BlurIn duration={0.6}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-1.5">
                <Sparkles className="h-3 w-3 text-white/80" />
                <span className="text-sm font-medium text-white/80">AI Shopping Assistant</span>
              </div>
            </BlurIn>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight lg:leading-[1.2]">
              <SplitText>Find the Perfect Product</SplitText>
              <br />
              <SplitText stagger={0.08}>with</SplitText>{" "}
              <motion.span
                className="italic font-serif"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                AI Assistance.
              </motion.span>
            </h1>

            {/* Subtitle */}
            <BlurIn delay={0.4} duration={0.6}>
              <p className="text-lg font-normal leading-relaxed text-white/80 max-w-xl">
                Chat with AI, compare products instantly, and discover the best choices based on your needs and budget — all in seconds.
              </p>
            </BlurIn>

            {/* CTA Buttons */}
            <BlurIn delay={0.6} duration={0.6}>
              <div className="flex gap-4 flex-wrap mt-6">
                <button
                  onClick={() => navigate("/chat")}
                  className="group inline-flex items-center gap-2 rounded-full bg-white text-[#070612] px-5 py-3 text-sm font-semibold transition-all hover:bg-white/90"
                >
                  Start Searching
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button className="rounded-full bg-white/20 backdrop-blur-sm text-white px-8 py-3 text-sm font-medium transition-all hover:bg-white/30">
                  Explore the Arena
                </button>
              </div>
            </BlurIn>
          </div>
        </div>
      </div>

      {/* Floating glow accents */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] z-0 animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-secondary/10 blur-[80px] z-0 animate-pulse-glow" style={{ animationDelay: "1s" }} />
    </div>
  );
}
