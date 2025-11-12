"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import ResponsiveNav from "@/components/ResponsiveNav";
import { supabase } from "@/lib/supabaseClient";

interface CalendarEvent {
  id: string;
  grade: string;
  event_title: string;
  event_date: string;
  created_at: string;
}

export default function CalendarPage() {
  const [selectedGrade, setSelectedGrade] = useState<"10th" | "11th" | "12th">("10th");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarImage, setCalendarImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true);
      try {
        // Fetch events for selected grade
        const { data: eventsData, error: eventsError } = await supabase
          .from("calendar_events")
          .select("*")
          .eq("grade", selectedGrade)
          .order("event_date", { ascending: true });

        if (eventsError) throw eventsError;
        setEvents(eventsData || []);

        // Try to fetch calendar image for the grade
        try {
          const { data: imageData } = await supabase.storage
            .from("calendar_images")
            .list(selectedGrade, {
              limit: 1,
              sortBy: { column: "created_at", order: "desc" },
            });

          if (imageData && imageData.length > 0) {
            const { data: urlData } = supabase.storage
              .from("calendar_images")
              .getPublicUrl(`${selectedGrade}/${imageData[0].name}`);
            setCalendarImage(urlData.publicUrl);
          } else {
            setCalendarImage(null);
          }
        } catch (imageError) {
          // If bucket doesn't exist or no image, that's okay
          setCalendarImage(null);
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [selectedGrade]);

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
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-6 sm:mb-8 drop-shadow-lg px-4"
        >
          Calendar
        </motion.h1>

        {/* Grade Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-6 sm:mb-8 px-4"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1.5 sm:p-2 flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            {(["10th", "11th", "12th"] as const).map((grade) => (
              <motion.button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                  selectedGrade === grade
                    ? "bg-white/30 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {grade} Grade
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Calendar Image */}
        {calendarImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 sm:p-4 shadow-2xl"
          >
            <img
              src={calendarImage}
              alt="Calendar"
              className="w-full h-auto rounded-xl"
            />
          </motion.div>
        )}

        {/* Events List */}
        {loading ? (
          <div className="text-center text-white/80 text-base sm:text-lg py-8">Loading calendar events...</div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/80 text-base sm:text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8"
          >
            No calendar events available for {selectedGrade} grade at this time.
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[600px] overflow-y-auto"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 px-2">
              Upcoming Events - {selectedGrade} Grade
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2 break-words">
                        {event.event_title}
                      </h3>
                      <p className="text-white/80 text-sm sm:text-base">
                        {new Date(event.event_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="ml-2 text-2xl sm:text-3xl flex-shrink-0">📅</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

