"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedLogo from "@/components/AnimatedLogo";
import ResponsiveNav from "@/components/ResponsiveNav";

const rotatingTexts = [
  "Welcome to EL BARAA",
  "Empowering students and teachers.",
  "Knowledge starts here.",
];

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    // Show content after logo animation completes (0.5s delay + 1.2s duration + buffer)
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showContent) return;

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [showContent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 relative overflow-hidden">
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/30 to-pink-600/20 animate-pulse"></div>
      
      {/* Floating orbs for depth - responsive sizes */}
      <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-80 sm:h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '500ms' }}></div>

      <ResponsiveNav
        brandName="EL BARAA"
        variant="glass"
        links={[
          { href: "/", label: "Home", active: true },
          { href: "/student", label: "Student" },
          { href: "/teacher", label: "Teacher" },
          { href: "/subjects", label: "Subjects" },
        ]}
      />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 sm:mb-12"
        >
          <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto">
            <AnimatedLogo />
          </div>
        </motion.div>

        {/* Rotating Welcome Text and Buttons */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8 sm:space-y-12 w-full max-w-4xl"
          >
            {/* Rotating Text */}
            <div className="h-16 sm:h-24 md:h-32 flex items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-2xl break-words"
                >
                  {rotatingTexts[currentTextIndex]}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Glass-style Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/student"
                  className="group relative block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl font-semibold text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/15 hover:border-white/30 overflow-hidden"
                >
                  {/* Glassmorphism effect with gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">🎓</span>
                    <span className="whitespace-nowrap">I&apos;m a Student</span>
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/teacher"
                  className="group relative block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl font-semibold text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/15 hover:border-white/30 overflow-hidden"
                >
                  {/* Glassmorphism effect with gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">👨‍🏫</span>
                    <span className="whitespace-nowrap">I&apos;m a Teacher</span>
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/admin"
                  className="group relative block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl font-semibold text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/15 hover:border-white/30 overflow-hidden"
                >
                  {/* Glassmorphism effect with gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">⚙️</span>
                    <span className="whitespace-nowrap">Admin</span>
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
