import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, SearchX } from "lucide-react";
import BlurIn from "@/components/BlurIn";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070612] relative overflow-hidden">
      {/* Floating glow accents */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] z-0 animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-secondary/10 blur-[80px] z-0 animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 text-center space-y-6">
        <BlurIn>
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <SearchX className="w-10 h-10 text-primary" />
          </div>
        </BlurIn>

        <BlurIn delay={0.2}>
          <motion.h1
            className="text-7xl md:text-9xl font-medium text-white tracking-tighter leading-[0.85]"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            404
          </motion.h1>
        </BlurIn>

        <BlurIn delay={0.4}>
          <p className="text-lg text-white/60 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </BlurIn>

        <BlurIn delay={0.6}>
          <a
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-white text-[#070612] px-6 py-3 text-sm font-semibold transition-all hover:bg-white/90"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </a>
        </BlurIn>
      </div>
    </div>
  );
};

export default NotFound;
