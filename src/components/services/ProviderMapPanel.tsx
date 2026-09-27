"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProviderProfileResponse, NearbyProviderResponse } from "@/types/provider";
import { MapPin, Navigation, Star, CheckCircle2, ExternalLink, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ProviderMapPanelProps {
  providers: (ProviderProfileResponse | NearbyProviderResponse)[];
  userLocation?: { lat: number; lng: number } | null;
  onSelectProvider?: (id: string) => void;
  className?: string;
}

export const ProviderMapPanel: React.FC<ProviderMapPanelProps> = ({
  providers,
  userLocation,
  className = "",
}) => {
  const { language } = useLanguage();
  const isKm = language === "km";

  const [selectedProvider, setSelectedProvider] = useState<
    ProviderProfileResponse | NearbyProviderResponse | null
  >(providers[0] || null);

  // Compute center
  const centerLat = userLocation?.lat || 11.5564;
  const centerLng = userLocation?.lng || 104.9282;

  return (
    <div
      className={`bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative min-h-[380px] sm:min-h-[440px] flex flex-col ${className}`}
    >
      {/* Map Header */}
      <div className="bg-white/95 backdrop-blur-xs px-4 py-2.5 border-b border-slate-200/90 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-[#104ccb]" />
          <span className="text-xs font-bold text-slate-800">
            {isKm ? `ផែនទីទីតាំងជាង (${providers.length} នាក់)` : `Technician Map (${providers.length} providers)`}
          </span>
        </div>
        {userLocation && (
          <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
            <Navigation className="w-3 h-3 text-emerald-600" />
            <span>{isKm ? "បានភ្ជាប់ GPS" : "GPS Connected"}</span>
          </span>
        )}
      </div>

      {/* Stylized Cambodia / Phnom Penh OpenStreetMap Embed or Interactive SVG Pin View */}
      <div className="relative flex-1 bg-[#e8ecef] overflow-hidden min-h-[300px]">
        {/* OpenStreetMap interactive iframe centered on Cambodia */}
        <iframe
          title="Cambodia Technician Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.12}%2C${centerLat - 0.08}%2C${centerLng + 0.12}%2C${centerLat + 0.08}&layer=mapnik&marker=${centerLat}%2C${centerLng}`}
          className="w-full h-full min-h-[320px] pointer-events-auto"
        />

        {/* Selected Provider Floating Quick Card */}
        {selectedProvider && (
          <div className="absolute bottom-3 inset-x-3 sm:inset-x-auto sm:left-3 sm:max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-20 animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {selectedProvider.businessName ||
                      ("fullName" in selectedProvider
                        ? selectedProvider.fullName
                        : isKm ? "ជាងជំនាញ" : "Technician")}
                  </h4>
                  {selectedProvider.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate">
                    {selectedProvider.district || selectedProvider.city || (isKm ? "ភ្នំពេញ" : "Phnom Penh")}
                  </span>
                  {"distanceKm" in selectedProvider &&
                    selectedProvider.distanceKm !== undefined && (
                      <span className="text-[#104ccb] font-bold">
                        · {selectedProvider.distanceKm.toFixed(1)} km
                      </span>
                    )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProvider(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs mt-2">
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800">
                  {selectedProvider.averageRating
                    ? selectedProvider.averageRating.toFixed(1)
                    : "5.0"}
                </span>
                <span className="text-slate-400 text-[10px]">
                  ({selectedProvider.totalReviews || 0})
                </span>
              </div>

              <Link
                href={`/providers/${selectedProvider.id}`}
                className="px-3 py-1 bg-[#104ccb] hover:bg-[#0a3ca8] text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-2xs"
              >
                <span>{isKm ? "មើលប្រវត្តិរូប" : "View Profile"}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Pin Selector Pill list */}
      <div className="bg-white/95 px-3 py-2 border-t border-slate-200 overflow-x-auto flex items-center space-x-2 scrollbar-none z-10">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          {isKm ? "ជាង៖" : "Techs:"}
        </span>
        {providers.slice(0, 8).map((p) => {
          const name =
            p.businessName ||
            ("fullName" in p ? p.fullName : isKm ? "ជាង" : "Tech");
          const isCurrent = selectedProvider?.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedProvider(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
                isCurrent
                  ? "bg-[#104ccb] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
