import { motion } from "framer-motion";

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
}

const ShinyText = ({ text, className = "", speed = 3 }: ShinyTextProps) => {
  return (
    <motion.span
      className={className}
      style={{
        backgroundImage:
          "linear-gradient(100deg, #64CEFB 0%, #64CEFB 40%, #ffffff 50%, #64CEFB 60%, #64CEFB 100%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
      }}
      animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      {text}
    </motion.span>
  );
};

export default ShinyText;
