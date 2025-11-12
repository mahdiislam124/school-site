"use client";

import { motion } from "framer-motion";
import Logo from "./Logo";

export default function AnimatedLogo() {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Full logo (visible initially) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="absolute inset-0"
      >
        <Logo />
      </motion.div>

      {/* Left half - moves left */}
      <motion.div
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: -200, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{ 
          clipPath: "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)",
          overflow: "hidden"
        }}
      >
        <Logo />
      </motion.div>

      {/* Right half - moves right */}
      <motion.div
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: 200, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{ 
          clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)",
          overflow: "hidden"
        }}
      >
        <Logo />
      </motion.div>
    </div>
  );
}
