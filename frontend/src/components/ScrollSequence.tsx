import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FRAME_COUNT = 40;
const SCROLL_HEIGHT_VH = 500; // how tall the scrollable container is (in vh)

// Generate frame paths
function getFramePath(index: number): string {
  const num = String(index + 1).padStart(3, "0");
  return `/ezgif-frame-${num}.png`;
}

// Preload all images and report progress
function usePreloadFrames() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) {
          setImages(imgs);
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
      };
      imgs.push(img);
    }
  }, []);

  return { images, progress, loaded };
}

// ─── Loading Screen ───────────────────────────────────────────────
function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="scroll-sequence-loader">
      <div className="loader-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="loader-brand"
        >
          <span className="loader-logo">B</span>
          <span className="loader-text">UYZO</span>
        </motion.div>
        <div className="loader-bar-track">
          <motion.div
            className="loader-bar-fill"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <motion.p
          className="loader-percentage"
          key={progress}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
        >
          Loading experience — {progress}%
        </motion.p>
      </div>
    </div>
  );
}

// ─── Overlay Text Section ──────────────────────────────────────────
interface OverlaySection {
  title: string;
  subtitle?: string;
  cta?: boolean;
  align?: "center" | "left" | "right";
}

const overlaySections: OverlaySection[] = [
  {
    title: "BUYZO",
    subtitle: "Premium Shopping. Reimagined.",
    align: "center",
  },
  {
    title: "Everything You Want",
    subtitle: "Curated by intelligence. Delivered with style.",
    align: "center",
  },
  {
    title: "One AI.\nInfinite Products.",
    subtitle: "Phones. Laptops. Audio. Wearables. And beyond.",
    align: "center",
  },
  {
    title: "Shop the Future",
    subtitle: "Let AI find your perfect match.",
    cta: true,
    align: "center",
  },
];

// ─── Main Component ────────────────────────────────────────────────
export default function ScrollSequence() {
  const { images, progress, loaded } = usePreloadFrames();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track current scroll progress for overlay text
  const [scrollProg, setScrollProg] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollProg(v);
  });

  // Draw frame on canvas
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !images.length) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = images[frameIndex];
      if (!img || !img.complete) return;

      // Set canvas to device pixel ratio for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Clear
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw image covering the canvas (object-fit: cover logic)
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = rect.width / rect.height;

      let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

      if (imgAspect > canvasAspect) {
        // Image wider — fit height, crop width
        drawHeight = rect.height;
        drawWidth = rect.height * imgAspect;
        offsetX = (rect.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Image taller — fit width, crop height
        drawWidth = rect.width;
        drawHeight = rect.width / imgAspect;
        offsetX = 0;
        offsetY = (rect.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    },
    [images]
  );

  // Scroll → frame rendering loop
  useEffect(() => {
    if (!loaded) return;

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(progress * FRAME_COUNT)
      );

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    });

    // Draw first frame immediately
    drawFrame(0);

    return () => {
      unsubscribe();
      cancelAnimationFrame(rafRef.current);
    };
  }, [loaded, scrollYProgress, drawFrame]);

  // Handle resize
  useEffect(() => {
    if (!loaded) return;

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loaded, drawFrame]);

  // Compute overlay opacities based on scroll progress
  // Each section gets a 25% range with fade-in and fade-out
  function getSectionOpacity(index: number, progress: number): number {
    const sectionCount = overlaySections.length;
    const sectionDuration = 1 / sectionCount;
    const fadeRange = sectionDuration * 0.3; // 30% of section is fade

    const sectionStart = index * sectionDuration;
    const sectionEnd = sectionStart + sectionDuration;

    if (progress < sectionStart || progress > sectionEnd) return 0;

    // Fade in
    if (progress < sectionStart + fadeRange) {
      return (progress - sectionStart) / fadeRange;
    }
    // Fade out
    if (progress > sectionEnd - fadeRange) {
      return (sectionEnd - progress) / fadeRange;
    }
    // Fully visible
    return 1;
  }

  function getSectionY(index: number, progress: number): number {
    const opacity = getSectionOpacity(index, progress);
    // Map opacity to Y offset: fully invisible = 40px down, fully visible = 0
    if (opacity <= 0) return 40;
    if (opacity >= 1) return 0;
    return (1 - opacity) * 40;
  }

  if (!loaded) {
    return (
      <div style={{ height: "100vh" }}>
        <LoadingScreen progress={progress} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="scroll-sequence-container"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
    >
      {/* Sticky viewport */}
      <div className="scroll-sequence-sticky">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="scroll-sequence-canvas"
        />

        {/* Dark gradient overlays for text readability */}
        <div className="scroll-sequence-vignette" />

        {/* Text overlay sections */}
        {overlaySections.map((section, i) => {
          const opacity = getSectionOpacity(i, scrollProg);
          const y = getSectionY(i, scrollProg);

          return (
            <div
              key={i}
              className="scroll-overlay-section"
              style={{
                opacity: opacity,
                transform: `translateY(${y}px)`,
                pointerEvents: opacity > 0.5 ? "auto" : "none",
              }}
            >
              <div className={`scroll-overlay-content scroll-overlay-${section.align || "center"}`}>
                {/* Decorative top line */}
                {i === 0 && (
                  <div className="scroll-overlay-badge">
                    <span className="scroll-overlay-badge-dot" />
                    <span>Scroll to explore</span>
                  </div>
                )}

                <h2
                  className="scroll-overlay-title"
                  style={{
                    fontSize: i === 0 ? "clamp(3rem, 8vw, 7rem)" : "clamp(2rem, 5vw, 4.5rem)",
                    letterSpacing: i === 0 ? "0.15em" : "-0.02em",
                    fontWeight: i === 0 ? 800 : 700,
                  }}
                >
                  {section.title.split("\n").map((line, j) => (
                    <span key={j}>
                      {j > 0 && <br />}
                      {j === section.title.split("\n").length - 1 && i !== 0 ? (
                        <span className="gradient-text">{line}</span>
                      ) : (
                        line
                      )}
                    </span>
                  ))}
                </h2>

                {section.subtitle && (
                  <p className="scroll-overlay-subtitle">
                    {section.subtitle}
                  </p>
                )}

                {section.cta && (
                  <Link
                    to="/chat"
                    className="scroll-overlay-cta group"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Start Shopping with AI
                    <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        {/* Scroll progress indicator */}
        <div className="scroll-progress-track">
          <motion.div
            className="scroll-progress-fill"
            style={{ scaleY: scrollYProgress }}
          />
        </div>
      </div>
    </div>
  );
}