"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export const DashboardFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-white/50 text-slate-500 text-xs py-4 pb-20 md:pb-4 px-4 sm:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <p className="text-center sm:text-left text-slate-500">
          © {new Date().getFullYear()} <span className="font-semibold text-slate-700">សេវាខ្មែរ (Khmer Services)</span>. {t("allRightsReserved")}
        </p>

        <div className="flex items-center space-x-4 text-[11px] text-slate-500">
          <Link href="/about" className="hover:text-blue-600 transition">
            {t("about")}
          </Link>
          <span>·</span>
          <Link href="/services" className="hover:text-blue-600 transition">
            {t("services")}
          </Link>
          <span>·</span>
          <Link href="/" className="hover:text-blue-600 transition">
            {t("home")}
          </Link>
        </div>
      </div>
    </footer>
  );
};
