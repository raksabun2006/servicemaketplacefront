"use client";

import React, { useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { FilterPanel, FilterState } from "./FilterPanel";

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
        aria-label="តម្រងស្វែងរក"
        className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom duration-250 ease-out"
      >
        {/* Pull Indicator + Header */}
        <div className="pt-3 pb-2 px-5 border-b border-slate-100 flex flex-col items-center">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-3" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">តម្រងស្វែងរក</h2>
              {totalResults !== undefined && (
                <span className="text-xs text-slate-500 font-medium">
                  ({totalResults} លទ្ធផល)
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition"
              aria-label="បិទ"
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
