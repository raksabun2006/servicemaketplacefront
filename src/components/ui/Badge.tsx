"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";

interface BadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, className = "" }) => {
  const { t } = useLanguage();

  const key = `status_${status}` as keyof typeof translations.km;
  const label = t(key) || status;

  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";

  switch (status) {
    case "OPEN":
    case "AVAILABLE":
    case "CONFIRMED":
      colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "ACCEPTED":
    case "IN_PROGRESS":
      colorClasses = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case "COMPLETED":
    case "VERIFIED":
      colorClasses = "bg-indigo-50 text-indigo-700 border-indigo-200";
      break;
    case "PENDING":
    case "BUSY":
      colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "CANCELLED":
    case "REJECTED":
    case "NO_SHOW":
    case "OFFLINE":
      colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
      break;
    case "EXPIRED":
      colorClasses = "bg-slate-100 text-slate-600 border-slate-200";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
};
