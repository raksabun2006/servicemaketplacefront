"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const isKm = language === "km";

  useEffect(() => {
    // Log the error to console
    console.error("App Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 relative overflow-hidden bg-radial from-slate-100/80 via-slate-50 to-white">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-300/40 p-6 sm:p-9 text-center">
          {/* Status Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs mb-5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{isKm ? "មានបញ្ហាបច្ចេកទេស" : "System Error"}</span>
          </div>

          {/* Glowing Illustration */}
          <div className="relative mx-auto mb-4 w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-amber-500/15 border border-amber-200/80 flex items-center justify-center shadow-inner">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-8 h-8 text-amber-600 animate-pulse" />
            </div>
          </div>

          {/* Headline & Description */}
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
            {isKm ? "មានបញ្ហាក្នុងការដំណើរការទំព័រនេះ" : "Something Went Wrong"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
            {isKm
              ? "សូមអភ័យទោស ប្រព័ន្ធបានជួបប្រទះបញ្ហាមិនរំពឹងទុក។ សូមព្យាយាមផ្ទុកទំព័រនេះឡើងវិញ។"
              : "An unexpected error occurred while rendering this page. You can try refreshing or returning home."}
          </p>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isKm ? "ព្យាយាមម្តងទៀត (Reload)" : "Try Again"}</span>
            </button>

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
                href="/"
                className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-2xl border border-slate-200 shadow-2xs transition active:scale-[0.98]"
              >
                <Home className="w-4 h-4 text-slate-500" />
                <span>{t("home")}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
