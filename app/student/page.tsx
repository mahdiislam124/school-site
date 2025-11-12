"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import ResponsiveNav from "@/components/ResponsiveNav";

export default function StudentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#9333EA] relative overflow-hidden">
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
          { href: "/", label: "Home" },
          { href: "/student", label: "Student", active: true },
          { href: "/teacher", label: "Teacher" },
          { href: "/subjects", label: "Subjects" },
        ]}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Logo at top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div className="scale-50 sm:scale-75 lg:scale-100 origin-center">
            <Logo />
          </div>
        </motion.div>

        {/* Facebook Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8 sm:mb-12 px-4"
        >
          <a
            href="https://www.facebook.com/share/1HFBjeyYiv/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 transform hover:from-blue-700 hover:to-blue-800"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
            <span className="whitespace-nowrap">Visit Our Facebook Page</span>
          </a>
        </motion.div>

        {/* Three Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Subjects Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/subjects">
              <div className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📚</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Subjects</h2>
                  <p className="text-emerald-50 text-base sm:text-lg">
                    View all your enrolled subjects and access course materials.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Announcements Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/student/announcements">
              <div className="group relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📢</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Announcements</h2>
                  <p className="text-amber-50 text-base sm:text-lg">
                    View all school announcements and important updates.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Calendar Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <Link href="/student/calendar">
              <div className="group relative bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📅</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Calendar</h2>
                  <p className="text-purple-50 text-base sm:text-lg">
                    View important dates, events, and academic schedule.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
