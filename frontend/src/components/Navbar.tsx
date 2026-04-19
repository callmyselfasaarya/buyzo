import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ShoppingBag, ArrowRight, X, Menu, Sparkles, Zap, Bot } from "lucide-react";

// ─── NAV LINKS DATA ────────────────────────────────────────────────────────────
const NAV_LINKS = [
  {
    label: "Features",
    href: "#features",
    description: "AI-powered shopping intelligence",
  },
  {
    label: "How It Works",
    href: "#how-it-works",
    description: "Three simple steps to smarter shopping",
  },
  {
    label: "Pricing",
    href: "#pricing",
    description: "Free to start, no credit card needed",
  },
  {
    label: "Blog",
    href: "#blog",
    description: "Insights on AI & shopping trends",
  },
];

// ─── MAGNETIC BUTTON HOOK ──────────────────────────────────────────────────────
function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    },
    [x, y, strength]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove as EventListener);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove as EventListener);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return { ref, springX, springY };
}

// ─── NAV LINK ITEM ─────────────────────────────────────────────────────────────
function NavLinkItem({ label, href, active }: { label: string; href: string; active?: boolean }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Smooth scroll to section if hash link
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-center gap-0.5 group"
    >
      <span
        className={`text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-200 ${
          active ? "text-white" : "text-white/50 group-hover:text-white"
        }`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </span>

      {/* Animated underline — grows left → right on hover, persists when active */}
      <span className="relative h-px w-full overflow-hidden">
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, #7C3AED, #3B82F6)",
          }}
          initial={{ scaleX: active ? 1 : 0, originX: 0 }}
          animate={{ scaleX: active || hovered ? 1 : 0, originX: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>

      {/* Active dot */}
      {active && (
        <motion.span
          layoutId="activeNavDot"
          className="absolute -bottom-3.5 w-1 h-1 rounded-full bg-purple-400"
          style={{ boxShadow: "0 0 6px 2px rgba(124, 58, 237, 0.8)" }}
        />
      )}
    </a>
  );
}

// ─── MOBILE MENU ───────────────────────────────────────────────────────────────
function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.25, delay: 0.15 } },
  };

  const panelVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i: number) => ({
      opacity: 1, x: 0,
      transition: { delay: 0.1 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  const handleLinkClick = (href: string) => {
    onClose();
    if (href.startsWith("#")) {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 350);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-in panel */}
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-[100] w-[min(320px,90vw)] flex flex-col"
            style={{
              background: "linear-gradient(180deg, rgba(10, 6, 18, 0.98) 0%, rgba(5, 3, 10, 0.99) 100%)",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.8), -2px 0 0 rgba(124, 58, 237, 0.08)",
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.5)]">
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-sm text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Buyzo
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl border border-white/8 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 flex flex-col justify-center px-6 gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.label} custom={i} variants={linkVariants} initial="hidden" animate="visible" exit="exit">
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="w-full text-left group flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/8 transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-purple-400/70 group-hover:text-purple-300 transition-colors" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white/80 group-hover:text-white transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {link.label}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">{link.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 ml-auto -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                </motion.div>
              ))}
            </nav>

            {/* Bottom CTA */}
            <div className="px-6 pb-8 pt-4 border-t border-white/6">
              <motion.div custom={NAV_LINKS.length} variants={linkVariants} initial="hidden" animate="visible">
                <Link
                  to="/chat"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
                    boxShadow: "0 0 20px rgba(124, 58, 237, 0.35), 0 4px 15px rgba(0,0,0,0.4)",
                  }}
                >
                  <Bot className="w-4 h-4" />
                  Open Chat
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <p className="text-center text-[11px] text-white/25 mt-3">Free to use · No sign-up required</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── MAIN NAVBAR ───────────────────────────────────────────────────────────────
export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Active section tracking
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Magnetic CTA
  const { ref: ctaRef, springX: ctaX, springY: ctaY } = useMagnetic(0.25);

  // ── Scroll: blur + hide/show ──────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;

      setScrolled(current > 30);

      // Hide on scroll down (past 80px), reveal on scroll up
      if (current > 80) {
        setHidden(delta > 0 && current > 120);
      } else {
        setHidden(false);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Active section highlight via IntersectionObserver ────────────────────
  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href.replace("#", ""))
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [location.pathname]);

  // ── Close mobile menu on route change ─────────────────────────────────────
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHomePage = location.pathname === "/";

  return (
    <>
      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: hidden ? -100 : 0,
          transition: {
            opacity: { duration: 0.5, ease: "easeOut" },
            y: { duration: 0.4, ease: hidden ? [0.55, 0, 1, 0.45] : [0.22, 1, 0.36, 1] },
          },
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      >
        {/* Inner container with blur glass */}
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? "border-b border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_0_0.5px_rgba(255,255,255,0.04)]"
              : "border-b border-transparent"
          }`}
          style={{
            background: scrolled
              ? "rgba(5, 3, 10, 0.75)"
              : "transparent",
            backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          }}
        >
          <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">

            {/* ── LOGO ──────────────────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              {/* Icon */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
                    boxShadow: "0 0 12px rgba(124, 58, 237, 0.45), 0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  <ShoppingBag className="w-4 h-4 text-white" strokeWidth={2.2} />
                </motion.div>
                {/* Glow pulse ring */}
                <span
                  className="absolute inset-0 rounded-[10px] animate-pulse-glow pointer-events-none"
                  style={{
                    background: "transparent",
                    boxShadow: "0 0 0 0 rgba(124, 58, 237, 0.5)",
                    animation: "logoGlow 3s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Wordmark */}
              <span
                className="font-bold text-[17px] tracking-tight leading-none"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: "linear-gradient(135deg, #ffffff 30%, rgba(167, 139, 250, 0.9) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Buyzo
              </span>
            </Link>

            {/* ── CENTER LINKS (desktop) ────────────────────────────── */}
            {isHomePage && (
              <nav className="hidden md:flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <NavLinkItem
                    key={link.label}
                    label={link.label}
                    href={link.href}
                    active={activeSection === link.href}
                  />
                ))}
              </nav>
            )}

            {/* ── RIGHT ACTIONS ─────────────────────────────────────── */}
            <div className="flex items-center gap-3">
              {/* Subtle badge: free */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/8 border border-emerald-500/15">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium text-emerald-400/80 tracking-wide">Free</span>
              </div>

              {/* CTA Button — magnetic */}
              <motion.div style={{ x: ctaX, y: ctaY }} className="relative">
                <Link
                  ref={ctaRef as React.RefObject<HTMLAnchorElement>}
                  to="/chat"
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white overflow-hidden transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
                    boxShadow: "0 0 16px rgba(124, 58, 237, 0.3), 0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Shimmer overlay */}
                  <motion.span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                      backgroundSize: "200% 100%",
                    }}
                    animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
                  />

                  <span className="relative flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" />
                    Open Chat
                    <ArrowRight className="w-3.5 h-3.5 -translate-x-0.5 opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all duration-300" />
                  </span>
                </Link>

                {/* Glow under button */}
                <div
                  className="absolute inset-0 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}
                />
              </motion.div>

              {/* Mobile hamburger */}
              <motion.button
                onClick={() => setMobileOpen(true)}
                whileTap={{ scale: 0.92 }}
                className="md:hidden p-2 rounded-xl border border-white/8 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-4.5 h-4.5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── MOBILE OVERLAY ─────────────────────────────────────────────────── */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* ── CSS for logo glow keyframe (can't do this in tailwind inline) ─── */}
      <style>{`
        @keyframes logoGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
          50%       { box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.12); }
        }
      `}</style>
    </>
  );
}
