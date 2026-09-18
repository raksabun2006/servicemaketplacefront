"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">៤០៤ - រកមិនឃើញទំព័រទេ</h1>
      <p className="text-xs text-slate-500 max-w-sm">
        ទំព័រដែលអ្នកកំពុងស្វែងរកប្រហែលជាត្រូវបានផ្លាស់ប្តូរទីតាំង ឬ មិនមានក្នុងប្រព័ន្ធ។
      </p>
      <Link
        href="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
      >
        <Home className="w-4 h-4" />
        <span>{t("home")}</span>
      </Link>
    </div>
  );
}
