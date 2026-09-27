"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CambodiaFlag, EnglishFlag } from "./FlagIcons";

interface LanguageSelectorProps {
  variant?: "dropdown" | "button" | "pill";
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = "button",
  className = "",
}) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "km" ? "en" : "km");
  };

  // If variant is a pill segmented switch (used on auth pages / mobile drawer)
  if (variant === "pill") {
    return (
      <div
        className={`inline-flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold ${className}`}
      >
        <button
          type="button"
          onClick={() => setLanguage("km")}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition ${
            language === "km"
              ? "bg-white text-slate-900 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <CambodiaFlag className="w-4 h-3" />
          <span>ខ្មែរ</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition ${
            language === "en"
              ? "bg-white text-slate-900 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <EnglishFlag className="w-4 h-3" />
          <span>EN</span>
        </button>
      </div>
    );
  }

  // Default (1-Click Toggle): Direct click to toggle language (flag + compact ខ្មែរ / EN label)
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center space-x-1 sm:space-x-1.5 px-1.5 sm:px-2 py-1 rounded-lg hover:bg-slate-100 transition duration-150 active:scale-95 cursor-pointer focus:outline-none shrink-0 ${className}`}
      title={
        language === "km"
          ? "ប្តូរទៅភាសាអង់គ្លេស / Switch to English"
          : "Switch to Khmer / ប្តូរទៅភាសាខ្មែរ"
      }
      aria-label="Toggle language"
    >
      {language === "km" ? (
        <CambodiaFlag className="w-5 h-3.5 rounded-xs shadow-xs overflow-hidden shrink-0" />
      ) : (
        <EnglishFlag className="w-5 h-3.5 rounded-xs shadow-xs overflow-hidden shrink-0" />
      )}

      <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
        {language === "km" ? "ខ្មែរ" : "EN"}
      </span>
    </button>
  );
};
