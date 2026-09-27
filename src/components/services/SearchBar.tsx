"use client";

import React from "react";
import { Search, MapPin, Navigation, Loader2 } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onSearchSubmit: () => void;
  onNearMeClick?: () => void;
  isLocating?: boolean;
}

const SEARCH_EXAMPLES = [
  "ជួសជុលម៉ាស៊ីនត្រជាក់",
  "ជាងទឹក",
  "ជាងអគ្គិសនី",
  "ជួសជុលកុំព្យូទ័រ",
  "សម្អាតផ្ទះ",
];

const CITIES = [
  { value: "", label: "គ្រប់ទីតាំងទាំងអស់ (All Locations)" },
  { value: "Phnom Penh", label: "រាជធានីភ្នំពេញ (Phnom Penh)" },
  { value: "Kandal", label: "ខេត្តកណ្ដាល (Kandal)" },
  { value: "Siem Reap", label: "ខេត្តសៀមរាប (Siem Reap)" },
  { value: "Battambang", label: "ខេត្តបាត់ដំបង (Battambang)" },
  { value: "Preah Sihanouk", label: "ខេត្តព្រះសីហនុ (Preah Sihanouk)" },
  { value: "Kampot", label: "ខេត្តកំពត (Kampot)" },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  onSearchSubmit,
  onNearMeClick,
  isLocating = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="w-full">
      {/* Search Input Box - Clean, light & minimal */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-1.5 sm:p-2 border border-slate-200 shadow-sm shadow-slate-200/60 flex flex-col md:flex-row items-stretch gap-1.5 sm:gap-2 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15"
      >
        {/* Row 1 on Mobile, Left on Desktop: Keyword Search Field */}
        <div className="relative flex-1 flex items-center h-11 sm:h-12 px-3 bg-slate-50/80 md:bg-transparent rounded-xl md:rounded-none">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 mr-2 select-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="តើអ្នកកំពុងស្វែងរកសេវាអ្វី?"
            aria-label="ស្វែងរកសេវាកម្ម"
            className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
          />
        </div>

        {/* Divider on desktop */}
        <div className="hidden md:block w-px bg-slate-200 my-1" />

        {/* Row 2 on Mobile (side-by-side location & submit button), Inline on Desktop */}
        <div className="flex items-center gap-1.5 md:contents">
          {/* Location Selector */}
          <div className="relative flex-1 md:flex-initial md:w-60 flex items-center h-11 sm:h-12 px-2.5 sm:px-3 bg-slate-50/80 md:bg-transparent rounded-xl md:rounded-none border border-slate-200/80 md:border-0 min-w-0">
            <MapPin className="w-4 h-4 text-[#104ccb] shrink-0 mr-1.5 select-none" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              aria-label="ទីតាំងរបស់អ្នក"
              className="w-full text-xs text-slate-700 bg-transparent outline-none cursor-pointer pr-4 truncate font-medium"
            >
              {CITIES.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>
          </div>

          {/* Optional GPS Locate button on desktop */}
          {onNearMeClick && (
            <button
              type="button"
              onClick={onNearMeClick}
              disabled={isLocating}
              title="ស្វែងរកជាងនៅជិតទីតាំងរបស់ខ្ញុំ"
              className="hidden lg:flex items-center space-x-1.5 px-3 h-12 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 text-xs font-semibold transition shrink-0 cursor-pointer"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-[#104ccb]" />
              )}
              <span>ជិតខ្ញុំ</span>
            </button>
          )}

          {/* Search Submit Button */}
          <button
            type="submit"
            className="h-11 sm:h-12 px-5 sm:px-7 bg-[#104ccb] hover:bg-[#0a3ca8] active:bg-blue-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-blue-600/20 transition flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span>ស្វែងរក</span>
          </button>
        </div>
      </form>

      {/* Suggested Quick Searches - Mobile Horizontal Scroll Chip list */}
      <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 -mx-1 px-1">
        <span className="text-slate-400 text-[11px] font-medium shrink-0 mr-0.5">
          ឧទាហរណ៍៖
        </span>
        {SEARCH_EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              onSearchChange(example);
              onSearchSubmit();
            }}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 active:bg-blue-100 text-slate-600 hover:text-[#104ccb] text-[11px] sm:text-xs whitespace-nowrap transition border border-slate-200/80 cursor-pointer shrink-0 font-normal"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};
