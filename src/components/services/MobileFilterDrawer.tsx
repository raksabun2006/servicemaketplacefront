"use client";

import React, { useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { FilterPanel, FilterState } from "./FilterPanel";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults?: number;
  categoryOptions?: { value: string; label: string }[];
  isLoadingCategories?: boolean;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  totalResults,
  categoryOptions,
  isLoadingCategories = false,
}) => {
  const { language } = useLanguage();
  const isKm = language === "km";

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet / Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isKm ? "តម្រងស្វែងរក" : "Filter Search"}
        className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom duration-250 ease-out"
      >
        {/* Pull Indicator + Header */}
        <div className="pt-3 pb-2 px-5 border-b border-slate-100 flex flex-col items-center">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-3" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-[#104ccb]" />
              <h2 className="text-base font-bold text-slate-900">
                {isKm ? "តម្រងស្វែងរក" : "Filter Search"}
              </h2>
              {totalResults !== undefined && (
                <span className="text-xs text-slate-500 font-medium">
                  ({totalResults} {isKm ? "លទ្ធផល" : "results"})
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              aria-label={isKm ? "បិទ" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto pb-4">
          <FilterPanel
            filters={filters}
            onChange={onChange}
            onReset={onReset}
            onApply={onClose}
            totalResults={totalResults}
            isMobileModal={true}
            categoryOptions={categoryOptions}
            isLoadingCategories={isLoadingCategories}
          />
        </div>
      </div>
    </div>
  );
};
