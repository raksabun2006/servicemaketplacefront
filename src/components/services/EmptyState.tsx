"use client";

import React from "react";
import { Wrench, RotateCcw, LayoutGrid } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface EmptyStateProps {
  onClearFilters: () => void;
  onViewAllServices: () => void;
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onClearFilters,
  onViewAllServices,
  title,
  description,
}) => {
  const { language } = useLanguage();
  const isKm = language === "km";

  const defaultTitle = isKm
    ? "មិនទាន់មានជាងសម្រាប់ការស្វែងរកនេះ"
    : "No Service Providers Found";
  const defaultDesc = isKm
    ? "សាកល្បងប្តូរប្រភេទសេវា ឬទីតាំងរបស់អ្នក"
    : "Try changing your service category or search location";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#104ccb] flex items-center justify-center mx-auto shadow-2xs">
        <Wrench className="w-7 h-7 text-[#104ccb]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
          {title || defaultTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-normal leading-relaxed">
          {description || defaultDesc}
        </p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>{isKm ? "លុបតម្រង" : "Reset Filters"}</span>
        </button>

        <button
          type="button"
          onClick={onViewAllServices}
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#104ccb] hover:bg-[#0a3ca8] text-white text-xs font-bold shadow-sm shadow-blue-600/20 transition cursor-pointer"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-white" />
          <span>{isKm ? "មើលសេវាកម្មទាំងអស់" : "View All Services"}</span>
        </button>
      </div>
    </div>
  );
};
