"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import ResponsiveNav from "@/components/ResponsiveNav";
import { supabase } from "@/lib/supabaseClient";

type Grade = "10th" | "11th" | "12th";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<"announcements" | "calendar" | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/admin");
  };

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
        showLogout
        onLogout={handleLogout}
        links={[
          { href: "/", label: "Home" },
        ]}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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

        {/* Dashboard Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12 drop-shadow-lg px-4"
        >
          Admin Dashboard
        </motion.h1>

        {/* Two Cards */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12">
          {/* Announcements Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(activeSection === "announcements" ? null : "announcements")}
            className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📢</div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Announcements</h2>
              <p className="text-white/80 text-base sm:text-lg">
                Create and manage school announcements.
              </p>
            </div>
          </motion.div>

          {/* Calendar Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(activeSection === "calendar" ? null : "calendar")}
            className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📅</div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Calendar</h2>
              <p className="text-white/80 text-base sm:text-lg">
                Manage calendar events and upload calendar images.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Announcements Form */}
        <AnimatePresence>
          {activeSection === "announcements" && (
            <AnnouncementsForm onClose={() => setActiveSection(null)} />
          )}
        </AnimatePresence>

        {/* Calendar Form */}
        <AnimatePresence>
          {activeSection === "calendar" && (
            <CalendarForm onClose={() => setActiveSection(null)} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AnnouncementsForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error: insertError } = await supabase
        .from("announcements")
        .insert({
          title,
          message,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setTitle("");
      setMessage("");
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl mb-6 sm:mb-8"
    >
      <div className="flex justify-between items-center mb-4 sm:mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white break-words">Create Announcement</h2>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-white/80 hover:text-white text-xl sm:text-2xl flex-shrink-0"
        >
          ×
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/90 mb-2 font-medium text-sm sm:text-base">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm sm:text-base"
            placeholder="Enter announcement title"
          />
        </div>
        <div>
          <label className="block text-white/90 mb-2 font-medium text-sm sm:text-base">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all resize-none text-sm sm:text-base"
            placeholder="Enter announcement message"
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-300 text-sm"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-300 text-sm"
          >
            Announcement created successfully!
          </motion.p>
        )}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? "Creating..." : "Create Announcement"}
        </motion.button>
      </form>
    </motion.div>
  );
}

function CalendarForm({ onClose }: { onClose: () => void }) {
  const [grade, setGrade] = useState<Grade>("10th");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [calendarImage, setCalendarImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Upload calendar image if provided
      let imageUrl = null;
      if (calendarImage) {
        const fileExt = calendarImage.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${grade}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("calendar_images")
          .upload(filePath, calendarImage, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("calendar_images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // Insert calendar event
      const { error: insertError } = await supabase
        .from("calendar_events")
        .insert({
          grade,
          event_title: eventTitle,
          event_date: eventDate,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setEventTitle("");
      setEventDate("");
      setCalendarImage(null);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create calendar event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl mb-6 sm:mb-8"
    >
      <div className="flex justify-between items-center mb-4 sm:mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white break-words">Create Calendar Event</h2>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-white/80 hover:text-white text-xl sm:text-2xl flex-shrink-0"
        >
          ×
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/90 mb-2 font-medium text-sm sm:text-base">Grade</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value as Grade)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm sm:text-base"
          >
            <option value="10th">10th Grade</option>
            <option value="11th">11th Grade</option>
            <option value="12th">12th Grade</option>
          </select>
        </div>
        <div>
          <label className="block text-white/90 mb-2 font-medium text-sm sm:text-base">Event Title</label>
          <input
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm sm:text-base"
            placeholder="Enter event title"
          />
        </div>
        <div>
          <label className="block text-white/90 mb-2 font-medium text-sm sm:text-base">Event Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block text-white/90 mb-2 font-medium text-sm sm:text-base">Calendar Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCalendarImage(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30 text-sm sm:text-base"
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-300 text-sm"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-300 text-sm"
          >
            Calendar event created successfully!
          </motion.p>
        )}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? "Creating..." : "Create Event"}
        </motion.button>
      </form>
    </motion.div>
  );
}

