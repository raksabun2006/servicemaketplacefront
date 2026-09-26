"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { FileQuestion, Home, ArrowLeft, Search, Sparkles } from "lucide-react";

export default function NotFound() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const isKm = language === "km";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 relative overflow-hidden bg-radial from-slate-100/80 via-slate-50 to-white">
      {/* Decorative ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-300/40 p-6 sm:p-9 text-center">
          {/* Status Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs mb-5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isKm ? "៤០៤ · រកមិនឃើញទំព័រ" : "404 · Page Not Found"}</span>
          </div>

          {/* Glowing Illustration */}
          <div className="relative mx-auto mb-4 w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500/15 via-blue-500/10 to-indigo-500/15 border border-indigo-200/80 flex items-center justify-center shadow-inner">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xs">
              <FileQuestion className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
          </div>

          {/* Headline & Description */}
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
            {isKm ? "រកមិនឃើញទំព័រដែលអ្នកត្រូវការទេ" : "We Couldn't Find That Page"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
            {isKm
              ? "ទំព័រដែលអ្នកកំពុងស្វែងរកប្រហែលជាត្រូវបានផ្លាស់ប្តូរទីតាំង លុបចោល ឬអាសយដ្ឋាន URL មិនត្រឹមត្រូវ។"
              : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
          </p>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              <span>{isKm ? "ត្រឡប់ទៅទំព័រដើម" : "Return to Homepage"}</span>
            </Link>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-semibold rounded-2xl border border-slate-200 shadow-2xs transition active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>{isKm ? "ត្រឡប់ក្រោយ" : "Go Back"}</span>
              </button>

              <Link
                href="/services"
                className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 text-xs font-semibold rounded-2xl border border-slate-200 hover:border-indigo-200 shadow-2xs transition active:scale-[0.98]"
              >
                <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                <span>{t("services")}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
