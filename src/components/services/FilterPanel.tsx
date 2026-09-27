"use client";

import React from "react";
import {
  MapPin,
  Tag,
  DollarSign,
  Star,
  Clock,
  RotateCcw,
  Check,
  Navigation,
} from "lucide-react";
import { CAMBODIA_LOCATIONS } from "@/components/ui/LocationPicker";

export interface FilterState {
  city: string;
  district: string;
  distanceKm?: number | "";
  category: string;
  minPrice: string;
  maxPrice: string;
  minRating: number | "";
  status: "ALL" | "AVAILABLE" | "ACTIVE";
}

export const INITIAL_FILTERS: FilterState = {
  city: "",
  district: "",
  distanceKm: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  minRating: "",
  status: "ALL",
};

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  onApply?: () => void;
  totalResults?: number;
  isMobileModal?: boolean;
  categoryOptions?: { value: string; label: string }[];
  isLoadingCategories?: boolean;
}

const PROVINCES = [
  { key: "", label: "គ្រប់ខេត្ត/ក្រុងទាំងអស់" },
  { key: "Phnom Penh", label: "ភ្នំពេញ (Phnom Penh)" },
  { key: "Kandal", label: "កណ្ដាល (Kandal)" },
  { key: "Siem Reap", label: "សៀមរាប (Siem Reap)" },
  { key: "Battambang", label: "បាត់ដំបង (Battambang)" },
  { key: "Preah Sihanouk", label: "ព្រះសីហនុ (Preah Sihanouk)" },
  { key: "Kampot", label: "កំពត (Kampot)" },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  onApply,
  totalResults,
  isMobileModal = false,
  categoryOptions = [{ value: "", label: "ទាំងអស់ (All)" }],
  isLoadingCategories = false,
}) => {
  const effectiveCategories = categoryOptions;
  // Available districts for chosen city
  const districtList =
    filters.city && CAMBODIA_LOCATIONS[filters.city]
      ? Object.entries(CAMBODIA_LOCATIONS[filters.city].districts).map(
          ([key, detail]) => ({
            key,
            label: detail.khmer,
          })
        )
      : [];

  const handleCityChange = (city: string) => {
    onChange({
      ...filters,
      city,
      district: "", // reset district when province changes
    });
  };

  const handleDistrictChange = (district: string) => {
    onChange({
      ...filters,
      district,
    });
  };

  const handleCategoryChange = (category: string) => {
    onChange({
      ...filters,
      category,
    });
  };

  return (
    <div
      className={`space-y-6 ${
        isMobileModal
          ? "p-4"
          : "bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs"
      }`}
    >
      {/* Header if desktop */}
      {!isMobileModal && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-base text-slate-900">តម្រង</span>
            {totalResults !== undefined && (
              <span className="text-xs text-slate-500 font-medium">
                ({totalResults})
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>លុបតម្រង</span>
          </button>
        </div>
      )}

      {/* 1. ទីតាំង (Location) */}
      <div className="space-y-3">
        <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>ទីតាំង (Location)</span>
        </label>

        {/* Province / City */}
        <div>
          <span className="block text-[11px] font-medium text-slate-500 mb-1">
            រាជធានី/ខេត្ត
          </span>
          <select
            value={filters.city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none cursor-pointer"
          >
            {PROVINCES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* District (if available) */}
        {districtList.length > 0 && (
          <div>
            <span className="block text-[11px] font-medium text-slate-500 mb-1">
              ខណ្ឌ/ស្រុក
            </span>
            <select
              value={filters.district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none cursor-pointer"
            >
              <option value="">គ្រប់ខណ្ឌ/ស្រុកទាំងអស់</option>
              {districtList.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Distance from my location */}
        <div>
          <span className="block text-[11px] font-medium text-slate-500 mb-1.5">
            ចម្ងាយពីទីតាំងរបស់ខ្ញុំ
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { val: "", label: "ទាំងអស់" },
              { val: 5, label: "5 km" },
              { val: 10, label: "10 km" },
              { val: 20, label: "20 km" },
            ].map((dist) => (
              <button
                key={String(dist.val)}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    distanceKm: dist.val as number | "",
                  })
                }
                className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border text-center transition cursor-pointer ${
                  filters.distanceKm === dist.val
                    ? "bg-blue-50 border-blue-600 text-blue-700 font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {dist.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 2. ប្រភេទសេវា (Category) */}
      <div className="space-y-3">
        <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5 text-blue-600" />
          <span>ប្រភេទសេវា (Category)</span>
        </label>
        {isLoadingCategories ? (
          <div className="space-y-2 py-1">
            <div className="h-4 bg-slate-100 rounded-md animate-pulse w-3/4" />
            <div className="h-4 bg-slate-100 rounded-md animate-pulse w-1/2" />
            <div className="h-4 bg-slate-100 rounded-md animate-pulse w-2/3" />
          </div>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {effectiveCategories.map((cat) => (
              <label
                key={cat.value}
                className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
              >
                <input
                  type="radio"
                  name={`categoryFilter-${isMobileModal ? "mobile" : "desktop"}`}
                  checked={filters.category === cat.value}
                  onChange={() => handleCategoryChange(cat.value)}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span
                  className={
                    filters.category === cat.value
                      ? "font-bold text-blue-700"
                      : "font-normal"
                  }
                >
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <hr className="border-slate-100" />

      {/* 3. តម្លៃ (Price Range) */}
      <div className="space-y-3">
        <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>ជួរតម្លៃ ($)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="block text-[11px] font-medium text-slate-500 mb-1">
              តម្លៃចាប់ពី
            </span>
            <input
              type="number"
              placeholder="$0"
              value={filters.minPrice}
              onChange={(e) =>
                onChange({
                  ...filters,
                  minPrice: e.target.value,
                })
              }
              className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <span className="block text-[11px] font-medium text-slate-500 mb-1">
              ដល់
            </span>
            <input
              type="number"
              placeholder="$100+"
              value={filters.maxPrice}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxPrice: e.target.value,
                })
              }
              className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 4. ការវាយតម្លៃ (Rating) */}
      <div className="space-y-3">
        <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span>ការវាយតម្លៃ</span>
        </label>
        <div className="space-y-1.5">
          {[
            { val: "", label: "ទាំងអស់" },
            { val: 4.5, label: "4.5+ ផ្កាយ" },
            { val: 4.0, label: "4.0+ ផ្កាយ" },
          ].map((r) => (
            <label
              key={String(r.val)}
              className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
            >
              <input
                type="radio"
                name="ratingFilter"
                checked={filters.minRating === r.val}
                onChange={() =>
                  onChange({
                    ...filters,
                    minRating: r.val as number | "",
                  })
                }
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span
                className={
                  filters.minRating === r.val
                    ? "font-bold text-blue-700"
                    : "font-normal"
                }
              >
                {r.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 5. ស្ថានភាព (Availability Status) */}
      <div className="space-y-3">
        <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>ស្ថានភាព</span>
        </label>
        <div className="space-y-1.5">
          {[
            { val: "ALL", label: "ទាំងអស់" },
            { val: "AVAILABLE", label: "មានទំនេរឥឡូវនេះ" },
            { val: "ACTIVE", label: "អាចទទួលការងារ" },
          ].map((st) => (
            <label
              key={st.val}
              className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
            >
              <input
                type="radio"
                name="statusFilter"
                checked={filters.status === st.val}
                onChange={() =>
                  onChange({
                    ...filters,
                    status: st.val as "ALL" | "AVAILABLE" | "ACTIVE",
                  })
                }
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span
                className={
                  filters.status === st.val
                    ? "font-bold text-blue-700"
                    : "font-normal"
                }
              >
                {st.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply / Reset in Desktop or Modal */}
      {isMobileModal && (
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            លុបតម្រង
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition cursor-pointer"
          >
            អនុវត្តតម្រង
          </button>
        </div>
      )}
    </div>
  );
};
