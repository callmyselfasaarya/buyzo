import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import ShinyText from "@/components/ShinyText";

const navLinks = [
  "Home",
  "About Us",
  "Courses",
  "Instructors",
  "Testimonials",
  "Blog",
];

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-sans">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Nav */}
        <nav className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
                <div className="h-3 w-3 rounded-full bg-white" />
              </div>
              <span className="text-sm font-semibold text-white">
                DesignPro
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 rounded-full border border-gray-700 px-2 py-1.5 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="rounded-full px-3 py-1.5 text-sm text-white/80 transition-colors hover:text-white"
                >
                  {link}
                </a>
              ))}
              <a
                href="#"
                className="ml-1 flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-white/80 transition-colors hover:text-white"
              >
                Contact us
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              className="text-white lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-col gap-2 rounded-2xl border border-gray-700 bg-black/80 p-4 backdrop-blur-md lg:hidden"
            >
              {[...navLinks, "Contact us"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link}
                </a>
              ))}
            </motion.div>
          )}
        </nav>

        {/* Top description row */}
        <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <p className="max-w-md text-sm text-white/80 md:text-base">
              We deliver transformative programs that empower emerging product
              designers with cutting-edge expertise and vision to thrive
              globally.
            </p>
            <p className="text-sm text-white/80 md:text-base lg:text-right">
              8000+ Talented Designers Launched !
            </p>
          </div>
        </div>

        {/* Hero center */}
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <p className="mb-4 text-xs uppercase tracking-tight text-white/80 sm:text-sm">
            Seats for Next Program Opening Soon
          </p>

          <h1
            className="text-center text-5xl font-medium leading-[0.85] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
          >
            <span className="text-white">Become</span>
            <br />
            <ShinyText text="Product Leader." speed={3} />
          </h1>

          <a
            href="/chat"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-900 md:px-8 md:py-4 md:text-base"
          >
            Apply for Next Enrollment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
