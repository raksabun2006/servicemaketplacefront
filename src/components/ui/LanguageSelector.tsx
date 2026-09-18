"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CambodiaFlag, EnglishFlag } from "./FlagIcons";
import { Check, ChevronDown } from "lucide-react";

interface LanguageSelectorProps {
  variant?: "dropdown" | "button" | "pill";
  className?: string;
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = "dropdown",
  className = "",
  showLabel = true,
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleLanguage = () => {
    setLanguage(language === "km" ? "en" : "km");
  };

  // If variant is a simple direct toggle button
  if (variant === "button") {
    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition group ${className}`}
        title={language === "km" ? "Switch to English" : "ប្តូរទៅភាសាខ្មែរ"}
        aria-label="Toggle language"
      >
        {language === "km" ? (
          <>
            <CambodiaFlag className="w-4 h-3 rounded-xs shadow-2xs group-hover:scale-105 transition-transform" />
            <span>ខ្មែរ</span>
          </>
        ) : (
          <>
            <EnglishFlag className="w-4 h-3 rounded-xs shadow-2xs group-hover:scale-105 transition-transform" />
            <span>EN</span>
          </>
        )}
      </button>
    );
  }

  // If variant is a pill segmented switch
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
          <CambodiaFlag className="w-3.5 h-2.5" />
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
          <EnglishFlag className="w-3.5 h-2.5" />
          <span>EN</span>
        </button>
      </div>
    );
  }

  // Default: Interactive Dropdown with Flag and Options
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition group focus:outline-none focus:ring-1 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="ជ្រើសរើសភាសា / Select Language"
      >
        {language === "km" ? (
          <CambodiaFlag className="w-4 h-3 rounded-xs group-hover:scale-105 transition-transform" />
        ) : (
          <EnglishFlag className="w-4 h-3 rounded-xs group-hover:scale-105 transition-transform" />
        )}

        {showLabel && (
          <span className="font-medium">
            {language === "km" ? "ភាសាខ្មែរ" : "English"}
          </span>
        )}

        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            ភាសា / Language
          </div>

          <button
            type="button"
            onClick={() => {
              setLanguage("km");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs transition ${
              language === "km"
                ? "bg-blue-50/70 text-blue-700 font-bold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <CambodiaFlag className="w-4 h-3 shadow-2xs" />
              <span>ភាសាខ្មែរ (Khmer)</span>
            </div>
            {language === "km" && <Check className="w-3.5 h-3.5 text-blue-600" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setLanguage("en");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs transition ${
              language === "en"
                ? "bg-blue-50/70 text-blue-700 font-bold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <EnglishFlag className="w-4 h-3 shadow-2xs" />
              <span>English (UK/US)</span>
            </div>
            {language === "en" && <Check className="w-3.5 h-3.5 text-blue-600" />}
          </button>
        </div>
      )}
    </div>
  );
};
