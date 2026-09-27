"use client";

import React, { useState } from "react";
import {
  Wind,
  Droplets,
  Zap,
  Laptop,
  Sparkles,
  Wrench,
  Snowflake,
  Layers,
  LucideIcon,
} from "lucide-react";
import { CategoryResponse } from "@/types/category";
import { fileApi } from "@/lib/api/file.api";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface CategoryItem {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconUrl?: string | null;
  accentColor?: string;
}

export const getIconForCategory = (code: string, name = ""): LucideIcon => {
  const c = (code + " " + name).toLowerCase();
  if (c.includes("ac") || c.includes("air") || c.includes("ត្រជាក់")) return Wind;
  if (c.includes("plumb") || c.includes("water") || c.includes("ទឹក")) return Droplets;
  if (c.includes("elec") || c.includes("ភ្លើង") || c.includes("អគ្គិសនី")) return Zap;
  if (c.includes("comp") || c.includes("it") || c.includes("កុំព្យូទ័រ")) return Laptop;
  if (c.includes("clean") || c.includes("សម្អាត")) return Sparkles;
  if (c.includes("fridge") || c.includes("refrig") || c.includes("ទូរទឹកកក")) return Snowflake;
  if (
    c.includes("motor") ||
    c.includes("bike") ||
    c.includes("ម៉ូតូ") ||
    c.includes("ឡាន") ||
    c.includes("pair") ||
    c.includes("appliance") ||
    c.includes("ឧបករណ៍")
  ) {
    return Wrench;
  }
  return Layers;
};

export const POPULAR_CATEGORIES: CategoryItem[] = [
  {
    id: "ac-repair",
    code: "AC_REPAIR",
    name: "ម៉ាស៊ីនត្រជាក់",
    description: "លាង និងជួសជុលម៉ាស៊ីនត្រជាក់",
    icon: Wind,
    accentColor: "blue",
  },
  {
    id: "plumbing",
    code: "PLUMBING",
    name: "ទឹក និងបំពង់",
    description: "តំឡើង និងជួសជុលបំពង់ទឹក",
    icon: Droplets,
    accentColor: "sky",
  },
  {
    id: "electrical",
    code: "ELECTRICAL",
    name: "អគ្គិសនី",
    description: "ដោះស្រាយបញ្ហាភ្លើង និងខ្សែ",
    icon: Zap,
    accentColor: "amber",
  },
  {
    id: "computer",
    code: "COMPUTER",
    name: "កុំព្យូទ័រ",
    description: "ជួសជុល Hardware & Software",
    icon: Laptop,
    accentColor: "indigo",
  },
  {
    id: "cleaning",
    code: "CLEANING",
    name: "សម្អាតផ្ទះ",
    description: "បោសសម្អាតគេហដ្ឋានទូទៅ",
    icon: Sparkles,
    accentColor: "emerald",
  },
  {
    id: "appliance",
    code: "APPLIANCE_REPAIR",
    name: "ជួសជុលឧបករណ៍",
    description: "ម៉ាស៊ីនបោក ម៉ាស៊ីនកម្តៅ",
    icon: Wrench,
    accentColor: "orange",
  },
  {
    id: "refrigerator",
    code: "REFRIGERATOR",
    name: "ជួសជុលទូរទឹកកក",
    description: "ទូរទឹកកក និងទូរក្លាសេ",
    icon: Snowflake,
    accentColor: "teal",
  },
  {
    id: "other",
    code: "OTHER",
    name: "សេវាផ្សេងៗ",
    description: "សេវាកម្មចម្រុះជាច្រើនទៀត",
    icon: Layers,
    accentColor: "slate",
  },
];

export const mapApiCategoryToItem = (apiCat: CategoryResponse): CategoryItem => {
  const icon = getIconForCategory(apiCat.code, apiCat.name);
  const iconUrl = apiCat.iconFile ? fileApi.getFileUrl(apiCat.iconFile.id || (apiCat.iconFile as unknown as { fileId?: string }).fileId || "") : null;

  return {
    id: apiCat.id,
    code: apiCat.code,
    name: apiCat.name,
    description: apiCat.description || "សេវាកម្មជំនាញពីជាងឯកទេស",
    icon,
    iconUrl,
    accentColor: "blue",
  };
};

interface CategoryCardProps {
  category: CategoryItem;
  isSelected?: boolean;
  count?: number;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  count,
  onClick,
}) => {
  const { language } = useLanguage();
  const isKm = language === "km";
  const [imgError, setImgError] = useState(false);
  const Icon = category.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative text-left p-3 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[96px] sm:min-h-[116px] min-w-[130px] sm:min-w-0 flex-shrink-0 select-none ${
        isSelected
          ? "bg-blue-50/90 border-[#104ccb] shadow-md shadow-blue-600/10 ring-2 ring-blue-600/20"
          : "bg-white border-slate-200/90 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      {/* Top: Icon + Count */}
      <div className="flex items-center justify-between w-full">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors overflow-hidden ${
            isSelected
              ? "bg-[#104ccb] text-white shadow-sm"
              : "bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-[#104ccb]"
          }`}
        >
          {category.iconUrl && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.iconUrl}
              alt={category.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon className="w-5 h-5 shrink-0" />
          )}
        </div>

        {count !== undefined && count > 0 && (
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isSelected
                ? "bg-blue-200/60 text-blue-800"
                : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
            }`}
          >
            {count} {isKm ? "ជាង" : "techs"}
          </span>
        )}
      </div>

      {/* Bottom: Title & Subtitle */}
      <div className="mt-2.5">
        <h3
          className={`text-sm sm:text-[15px] font-bold leading-snug transition-colors line-clamp-1 ${
            isSelected ? "text-blue-800" : "text-slate-900 group-hover:text-blue-700"
          }`}
        >
          {category.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
          {category.description}
        </p>
      </div>
    </button>
  );
};
