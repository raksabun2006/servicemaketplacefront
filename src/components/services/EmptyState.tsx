"use client";

import React from "react";
import { Wrench, RotateCcw, LayoutGrid } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
  onViewAllServices: () => void;
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onClearFilters,
  onViewAllServices,
  title = "មិនទាន់មានជាងសម្រាប់ការស្វែងរកនេះ",
  description = "សាកល្បងប្តូរប្រភេទសេវា ឬទីតាំងរបស់អ្នក",
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
        <Wrench className="w-7 h-7 text-blue-600" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-normal leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>លុបតម្រង</span>
        </button>

        <button
          type="button"
          onClick={onViewAllServices}
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/25 transition cursor-pointer"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-white" />
          <span>មើលសេវាកម្មទាំងអស់</span>
        </button>
      </div>
    </div>
  );
};
