"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import ResponsiveNav from "@/components/ResponsiveNav";
import { supabase } from "@/lib/supabaseClient";

type Grade = "10th" | "11th" | "12th" | null;

const subjects = {
  "10th": ["Math", "Physics", "Science", "Arabic", "French", "English", "Technology", "History & Geography", "Islamic Education"],
  "11th": ["Math", "Physics", "Science", "Arabic", "French", "English", "History & Geography", "Islamic Education"],
  "12th": ["Math", "Physics", "Science", "Arabic", "French", "English", "Philosophy", "History & Geography", "Islamic Education"],
};

interface Material {
  id: string;
  grade: string;
  subject: string;
  file_name: string;
  file_url: string;
  file_type: "pdf" | "image";
  uploaded_by: string;
  uploaded_at: string;
}

interface ImageViewerProps {
  isOpen: boolean;
  imageUrl: string;
  fileName: string;
  onClose: () => void;
}

function ImageViewer({ isOpen, imageUrl, fileName, onClose }: ImageViewerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-7xl max-h-[90vh] relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={imageUrl}
                alt={fileName}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white bg-black/50 px-4 py-2 rounded-lg inline-block">
                  {fileName}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const subjectColors: { [key: string]: string } = {
  Math: "from-blue-500 to-cyan-600",
  Physics: "from-red-500 to-rose-600",
  Science: "from-green-500 to-emerald-600",
  Arabic: "from-amber-500 to-orange-600",
  French: "from-indigo-500 to-purple-600",
  English: "from-purple-500 to-pink-600",
  Technology: "from-teal-500 to-cyan-600",
  "History & Geography": "from-amber-500 to-orange-600",
  "Islamic Education": "from-emerald-500 to-teal-600",
  Philosophy: "from-slate-500 to-gray-600",
};

export default function SubjectsPage() {
  const [selectedGrade, setSelectedGrade] = useState<Grade>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageViewer, setImageViewer] = useState<{
    isOpen: boolean;
    imageUrl: string;
    fileName: string;
  } | null>(null);

  const handleGradeClick = (grade: "10th" | "11th" | "12th") => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
  };

  const handleBackToGrades = () => {
    setSelectedGrade(null);
    setSelectedSubject(null);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
  };

  // Fetch materials when grade and subject are selected
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!selectedGrade || !selectedSubject) {
        setMaterials([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("materials")
          .select("*")
          .eq("grade", selectedGrade)
          .eq("subject", selectedSubject)
          .order("uploaded_at", { ascending: false });

        if (error) throw error;
        setMaterials(data || []);
      } catch (error) {
        console.error("Error fetching materials:", error);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [selectedGrade, selectedSubject]);

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
          { href: "/student", label: "Student" },
          { href: "/teacher", label: "Teacher" },
          { href: "/subjects", label: "Subjects", active: true },
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

        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12 drop-shadow-lg px-4 break-words"
        >
          {selectedSubject
            ? `${selectedSubject} - ${selectedGrade} Grade`
            : selectedGrade
            ? `${selectedGrade} Grade Subjects`
            : "Select Your Grade"}
        </motion.h1>

        {/* Breadcrumb Navigation */}
        {(selectedGrade || selectedSubject) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mb-6 sm:mb-8 px-4"
          >
            <nav className="flex items-center flex-wrap gap-2 text-white text-sm sm:text-base">
              <button
                onClick={handleBackToGrades}
                className="hover:text-indigo-200 transition-colors"
              >
                Grades
              </button>
              {selectedGrade && (
                <>
                  <span>/</span>
                  {selectedSubject ? (
                    <button
                      onClick={handleBackToSubjects}
                      className="hover:text-indigo-200 transition-colors"
                    >
                      {selectedGrade}
                    </button>
                  ) : (
                    <span className="text-indigo-200">{selectedGrade}</span>
                  )}
                </>
              )}
              {selectedSubject && (
                <>
                  <span>/</span>
                  <span className="text-indigo-200 break-words">{selectedSubject}</span>
                </>
              )}
            </nav>
          </motion.div>
        )}

        {/* Grade Selection */}
        {!selectedGrade && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {(["10th", "11th", "12th"] as const).map((grade, index) => (
              <motion.button
                key={grade}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGradeClick(grade)}
                className="group relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 sm:p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🎓</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">{grade} Grade</h2>
                  <p className="text-indigo-50 text-base sm:text-lg">
                    Click to view subjects
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Subject Selection */}
        {selectedGrade && !selectedSubject && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {subjects[selectedGrade].map((subject, index) => (
              <motion.a
                key={subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                href={`/subjects/${selectedGrade}/${encodeURIComponent(subject)}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubjectClick(subject);
                }}
                className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-white/15 hover:border-white/30 transform cursor-pointer overflow-hidden"
              >
                {/* Glassmorphism effect with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">📖</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 break-words">{subject}</h3>
                  <p className="text-white/70 text-xs sm:text-sm">View materials</p>
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: subjects[selectedGrade].length * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBackToGrades}
              className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-white/30 transform cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">←</div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Back</h3>
              </div>
            </motion.button>
          </div>
        )}

        {/* Subject Materials */}
        {selectedGrade && selectedSubject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white break-words">
                  {selectedSubject} Materials
                </h2>
                <button
                  onClick={handleBackToSubjects}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  ← Back to Subjects
                </button>
              </div>

              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
                    <p className="text-white/70 mt-4">Loading materials...</p>
                  </div>
                ) : materials.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-white/70 text-lg">No materials available yet.</p>
                    <p className="text-white/50 text-sm mt-2">Check back later or contact your teacher.</p>
                  </div>
                ) : (
                  <>
                    {/* PDF Materials */}
                    {materials.filter((m) => m.file_type === "pdf").length > 0 && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                          <span>📄</span> PDF Materials
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                          {materials
                            .filter((m) => m.file_type === "pdf")
                            .map((material) => (
                              <a
                                key={material.id}
                                href={`/pdf-viewer?file=${encodeURIComponent(material.file_url)}&name=${encodeURIComponent(material.file_name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 transition-all hover:scale-105 transform shadow-lg hover:shadow-xl"
                              >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                  <div className="text-2xl sm:text-3xl transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0">📕</div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-white font-medium text-sm sm:text-base truncate">{material.file_name}</p>
                                    <p className="text-white/70 text-xs sm:text-sm">
                                      {new Date(material.uploaded_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-white group-hover:text-indigo-200 transition-colors flex-shrink-0">
                                  <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </div>
                              </a>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Image Materials */}
                    {materials.filter((m) => m.file_type === "image").length > 0 && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                          <span>🖼️</span> Image Materials
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {materials
                            .filter((m) => m.file_type === "image")
                            .map((material) => (
                              <div
                                key={material.id}
                                onClick={() => {
                                  setImageViewer({
                                    isOpen: true,
                                    imageUrl: material.file_url,
                                    fileName: material.file_name,
                                  });
                                }}
                                className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 rounded-xl p-3 sm:p-4 cursor-pointer transition-all hover:scale-105 transform shadow-lg hover:shadow-xl"
                              >
                                <div className="mb-2 sm:mb-3 rounded-lg overflow-hidden bg-white/5">
                                  <img
                                    src={material.file_url}
                                    alt={material.file_name}
                                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm sm:text-base truncate">{material.file_name}</p>
                                    <p className="text-white/70 text-xs sm:text-sm">
                                      {new Date(material.uploaded_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-white group-hover:text-indigo-200 transition-colors ml-2 flex-shrink-0">
                                    <svg
                                      className="w-4 h-4 sm:w-5 sm:h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Image Viewer Modal */}
      {imageViewer && (
        <ImageViewer
          isOpen={imageViewer.isOpen}
          imageUrl={imageViewer.imageUrl}
          fileName={imageViewer.fileName}
          onClose={() => setImageViewer(null)}
        />
      )}
    </div>
  );
}

