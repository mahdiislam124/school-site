"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  href: string;
  label: string;
  active?: boolean;
}

interface ResponsiveNavProps {
  brandName?: string;
  links: NavLink[];
  showLogout?: boolean;
  onLogout?: () => void;
  variant?: "glass" | "solid";
}

export default function ResponsiveNav({
  brandName = "EL BARAA",
  links,
  showLogout = false,
  onLogout,
  variant = "glass",
}: ResponsiveNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navClasses =
    variant === "glass"
      ? "bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg"
      : "bg-white shadow-md";

  const linkClasses =
    variant === "glass"
      ? "text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors backdrop-blur-sm bg-white/10 hover:bg-white/20"
      : "text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors";

  const activeLinkClasses =
    variant === "glass"
      ? "text-white px-3 py-2 rounded-md text-sm font-medium bg-white/20"
      : "text-indigo-600 px-3 py-2 rounded-md text-sm font-medium bg-indigo-50";

  const brandClasses =
    variant === "glass" ? "text-2xl font-bold text-white" : "text-2xl font-bold text-indigo-600";

  return (
    <nav className={`relative z-10 ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className={brandClasses}>
              {brandName}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={link.active ? activeLinkClasses : linkClasses}
              >
                {link.label}
              </Link>
            ))}
            {showLogout && onLogout && (
              <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={
                  variant === "glass"
                    ? "text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors backdrop-blur-sm bg-red-500/20 hover:bg-red-500/30 border border-red-400/30"
                    : "text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                }
              >
                Logout
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={
                variant === "glass"
                  ? "text-white p-2 rounded-md hover:bg-white/10"
                  : "text-gray-700 p-2 rounded-md hover:bg-gray-100"
              }
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/20 bg-white/10 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block ${link.active ? activeLinkClasses : linkClasses}`}
                >
                  {link.label}
                </Link>
              ))}
              {showLogout && onLogout && (
                <motion.button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={
                    variant === "glass"
                      ? "block w-full text-left text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors backdrop-blur-sm bg-red-500/20 hover:bg-red-500/30 border border-red-400/30"
                      : "block w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  }
                >
                  Logout
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

