"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import ResponsiveNav from "@/components/ResponsiveNav";
import { supabase } from "@/lib/supabaseClient";

const subjects = {
  "10th": ["Math", "Physics", "Science", "Arabic", "French", "English", "Technology", "History & Geography", "Islamic Education"],
  "11th": ["Math", "Physics", "Science", "Arabic", "French", "English", "History & Geography", "Islamic Education"],
  "12th": ["Math", "Physics", "Science", "Arabic", "French", "English", "Philosophy", "History & Geography", "Islamic Education"],
};

const CORRECT_PASSWORD = "teacher19/";

type Grade = "10th" | "11th" | "12th";
type FileType = "pdf" | "image";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: Grade;
  subject: string;
  onUploadSuccess: () => void;
}

function UploadModal({ isOpen, onClose, grade, subject, onUploadSuccess }: UploadModalProps) {
  const [fileType, setFileType] = useState<FileType>("pdf");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (fileType === "pdf" && file.type !== "application/pdf") {
      setUploadError("Please select a PDF file");
      return;
    }
    if (fileType === "image" && !file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setUploadError("");

    // Create preview for images
    if (fileType === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      // Create file path: grade/subject/filename
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${grade}/${subject}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("materials")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("materials")
        .getPublicUrl(filePath);

      // Insert metadata into database
      const { error: dbError } = await supabase.from("materials").insert({
        grade,
        subject,
        file_name: selectedFile.name,
        file_url: urlData.publicUrl,
        file_type: fileType,
        uploaded_by: "teacher", // TODO: Replace with actual user ID when auth is implemented
      });

      if (dbError) throw dbError;

      setUploadSuccess(true);
      setTimeout(() => {
        onUploadSuccess();
        onClose();
        // Reset state
        setSelectedFile(null);
        setPreview(null);
        setUploadSuccess(false);
        setFileType("pdf");
      }, 2000);
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setPreview(null);
      setUploadError("");
      setUploadSuccess(false);
      setFileType("pdf");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white break-words">
                  Upload Material - {subject} ({grade})
                </h2>
                <button
                  onClick={handleClose}
                  disabled={uploading}
                  className="text-white/70 hover:text-white transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {uploadSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-2xl font-bold text-white mb-2">Upload Successful!</p>
                  <p className="text-white/70">File has been uploaded and is now available to students.</p>
                </motion.div>
              ) : (
                <>
                  {/* File Type Selection */}
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-white/90 mb-2 sm:mb-3 font-semibold text-sm sm:text-base">File Type</label>
                    <div className="flex gap-2 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setFileType("pdf");
                          setSelectedFile(null);
                          setPreview(null);
                          setUploadError("");
                        }}
                        className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 transition-all text-sm sm:text-base ${
                          fileType === "pdf"
                            ? "bg-white/20 border-white/50 text-white"
                            : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        📄 PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFileType("image");
                          setSelectedFile(null);
                          setPreview(null);
                          setUploadError("");
                        }}
                        className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 transition-all text-sm sm:text-base ${
                          fileType === "image"
                            ? "bg-white/20 border-white/50 text-white"
                            : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        🖼️ Image
                      </button>
                    </div>
                  </div>

                  {/* File Input */}
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-white/90 mb-2 sm:mb-3 font-semibold text-sm sm:text-base">Select File</label>
                    <div className="border-2 border-dashed border-white/30 rounded-xl p-4 sm:p-6 lg:p-8 text-center hover:border-white/50 transition-colors">
                      <input
                        type="file"
                        accept={fileType === "pdf" ? "application/pdf" : "image/*"}
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer block"
                      >
                        {selectedFile ? (
                          <div>
                            <div className="text-3xl sm:text-4xl mb-2">📎</div>
                            <p className="text-white font-medium text-sm sm:text-base break-words">{selectedFile.name}</p>
                            <p className="text-white/70 text-xs sm:text-sm mt-1">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="text-3xl sm:text-4xl mb-2">📁</div>
                            <p className="text-white font-medium text-sm sm:text-base">Click to choose file</p>
                            <p className="text-white/70 text-xs sm:text-sm mt-1">
                              or drag and drop
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Preview */}
                  {preview && (
                    <div className="mb-4 sm:mb-6">
                      <label className="block text-white/90 mb-2 sm:mb-3 font-semibold text-sm sm:text-base">Preview</label>
                      <div className="border border-white/20 rounded-xl overflow-hidden">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-48 sm:h-64 object-contain bg-white/5"
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadError && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <p className="text-red-200 text-sm">{uploadError}</p>
                    </div>
                  )}

                  {/* Upload Button */}
                  <motion.button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    whileHover={{ scale: !selectedFile || uploading ? 1 : 1.02 }}
                    whileTap={{ scale: !selectedFile || uploading ? 1 : 0.98 }}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload File
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function TeacherPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean;
    grade: Grade;
    subject: string;
  } | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setError("");
  };

  // Password Entry Screen
  if (!isAuthenticated) {
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
            { href: "/teacher", label: "Teacher", active: true },
            { href: "/subjects", label: "Subjects" },
          ]}
        />

        <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Logo */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="scale-50 sm:scale-75 lg:scale-100 origin-center">
                <Logo />
              </div>
            </div>

            {/* Password Form */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 sm:mb-6">
                Teacher Portal Access
              </h1>
              <p className="text-white/80 text-center mb-6 sm:mb-8 text-sm sm:text-base">
                Please enter your password to continue
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-sm sm:text-base"
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-red-300 text-sm"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Enter Portal
                </motion.button>
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Dashboard Screen
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
          { href: "/student", label: "Student" },
          { href: "/teacher", label: "Teacher", active: true },
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

        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12 drop-shadow-lg px-4"
        >
          Teacher Dashboard
        </motion.h1>

        {/* Grade Sections */}
        <div className="space-y-8 sm:space-y-12">
          {(["10th", "11th", "12th"] as const).map((grade, gradeIndex) => (
            <motion.div
              key={grade}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: gradeIndex * 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl">🎓</span>
                {grade} Grade
              </h2>

              {/* Subjects Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {subjects[grade].map((subject) => (
                  <motion.div
                    key={subject}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 hover:border-white/30"
                  >
                    {/* Glassmorphism effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-white break-words">{subject}</h3>
                        <span className="text-2xl sm:text-3xl flex-shrink-0 ml-2">📖</span>
                      </div>
                      
                      {/* Upload File Button */}
                      <button
                        onClick={() => {
                          setUploadModal({ isOpen: true, grade, subject });
                        }}
                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all hover:scale-105 transform shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
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
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="whitespace-nowrap">Upload Material</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Upload Modal */}
      {uploadModal && (
        <UploadModal
          isOpen={uploadModal.isOpen}
          onClose={() => setUploadModal(null)}
          grade={uploadModal.grade}
          subject={uploadModal.subject}
          onUploadSuccess={() => {
            // Optionally refresh data or show notification
            console.log("Upload successful!");
          }}
        />
      )}
    </div>
  );
}

