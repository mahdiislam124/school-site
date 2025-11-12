"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import ResponsiveNav from "@/components/ResponsiveNav";
import { supabase } from "@/lib/supabaseClient";

interface Announcement {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAnnouncements(data || []);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

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

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Logo */}
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

        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12 drop-shadow-lg px-4"
        >
          Announcements
        </motion.h1>

        {/* Announcements List */}
        {loading ? (
          <div className="text-center text-white/80 text-base sm:text-lg py-8">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/80 text-base sm:text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8"
          >
            No announcements available at this time.
          </motion.div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white break-words">{announcement.title}</h2>
                  <span className="text-white/60 text-xs sm:text-sm whitespace-nowrap">
                    {new Date(announcement.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words">
                  {announcement.message}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

