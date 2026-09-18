"use client";

import React from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon: Icon = FolderOpen,
  actionLabel,
  actionHref,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 sm:my-4">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 leading-snug">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-5 leading-relaxed">
          {subtitle}
        </p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
