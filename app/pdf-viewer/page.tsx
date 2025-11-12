"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PDFViewerContent() {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("file") || "";
  const fileName = searchParams.get("name") || "document.pdf";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#9333EA]">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                School Site
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/subjects"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ← Back to Subjects
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">{fileName}</h1>
            <p className="text-white/70">PDF Document Viewer</p>
          </div>

          {/* PDF Viewer */}
          {fileUrl ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <div className="bg-white/10 p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{fileName}</h2>
                  <p className="text-white/70 text-sm">PDF Document</p>
                </div>
                <a
                  href={fileUrl}
                  download={fileName}
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white font-semibold transition-all hover:scale-105 transform shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </a>
              </div>
              <div className="bg-gray-900 p-4">
                <iframe
                  src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-[calc(100vh-300px)] min-h-[600px] rounded-lg"
                  title={fileName}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 min-h-[600px] flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-6">📄</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  No PDF Selected
                </h2>
                <p className="text-white/70 mb-6 max-w-md">
                  Please select a PDF file from the subjects page to view it here.
                </p>
                <Link
                  href="/subjects"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg px-6 py-3 text-white font-semibold transition-all hover:scale-105 transform shadow-lg hover:shadow-xl"
                >
                  ← Back to Subjects
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PDFViewerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#9333EA] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <PDFViewerContent />
    </Suspense>
  );
}

