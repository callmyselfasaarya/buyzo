import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SplitTextProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  duration?: number;
}

const SplitText = ({ children, className = "", stagger = 0.08, duration = 0.6 }: SplitTextProps) => {
  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            delay: i * stagger,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export default SplitText;
