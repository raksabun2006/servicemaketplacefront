"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProviderProfileResponse, NearbyProviderResponse } from "@/types/provider";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { favoriteApi } from "@/lib/api/favorite.api";
import { StarRating } from "@/components/ui/StarRating";
import { StatusBadge } from "@/components/ui/Badge";
import { fileApi } from "@/lib/api/file.api";
import { MapPin, CheckCircle2, Heart, Briefcase, Clock } from "lucide-react";

interface ProviderCardProps {
  provider: ProviderProfileResponse | NearbyProviderResponse;
  initialFavorited?: boolean;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, initialFavorited = false }) => {
  const { t } = useLanguage();
  const { isAuthenticated, isCustomer } = useAuth();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isTogglingFav, setIsTogglingFav] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !isCustomer || isTogglingFav) return;

    try {
      setIsTogglingFav(true);
      if (isFavorited) {
        await favoriteApi.unfavorite(provider.id);
        setIsFavorited(false);
      } else {
        await favoriteApi.favorite(provider.id);
        setIsFavorited(true);
      }
    } catch {
      // ignore
    } finally {
      setIsTogglingFav(false);
    }
  };

  const displayName = provider.businessName || ("fullName" in provider ? provider.fullName : "អ្នកផ្តល់សេវា");
  const isVerified = provider.isVerified || ("verificationStatus" in provider && provider.verificationStatus === "VERIFIED");
  const completedCount = "completedServices" in provider ? provider.completedServices : undefined;
  const experience = "experienceYears" in provider ? provider.experienceYears : undefined;
  const hourlyRate = "hourlyRate" in provider ? provider.hourlyRate : undefined;
  const fullName = "fullName" in provider ? provider.fullName : "";
  const businessName = provider.businessName;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:shadow-sm hover:border-blue-300 transition flex flex-col justify-between group relative">
      {/* Heart favorite button for customer */}
      {isAuthenticated && isCustomer && (
        <button
          onClick={handleToggleFavorite}
          disabled={isTogglingFav}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition shadow-2xs z-10"
          title={isFavorited ? "ដកចេញពីចំណូលចិត្ត" : "ដាក់ចូលចំណូលចិត្ត"}
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorited ? "fill-rose-500 text-rose-500" : "text-slate-400"
            }`}
          />
        </button>
      )}

      <div>
        {/* Header: Avatar + Names */}
        <div className="flex items-start space-x-3 mb-3 pr-8">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-bold text-base flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            {provider.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fileApi.getFileUrl(provider.avatarUrl)}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                  const fb = e.currentTarget.parentElement?.querySelector(".avatar-fallback");
                  if (fb) (fb as HTMLElement).style.display = "flex";
                }}
              />
            ) : null}
            <span
              className={`avatar-fallback ${provider.avatarUrl ? "hidden" : "flex"} w-full h-full items-center justify-center`}
            >
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
              {businessName || fullName || "អ្នកផ្តល់សេវា"}
            </h3>
            {businessName && fullName && (
              <p className="text-xs text-slate-500 truncate">ជាង៖ {fullName}</p>
            )}
            {isVerified ? (
              <div className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>បានផ្ទៀងផ្ទាត់អត្តសញ្ញាណ (Verified)</span>
              </div>
            ) : (
              <div className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-0.5 border border-amber-200">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>រង់ចាំការផ្ទៀងផ្ទាត់ (Pending)</span>
              </div>
            )}
          </div>
        </div>

        {/* Rating & Completed services */}
        <div className="flex items-center space-x-2 mb-3 text-xs">
          <StarRating
            rating={provider.averageRating || 0}
            totalReviews={provider.totalReviews}
            size="sm"
          />
          {completedCount !== undefined && completedCount > 0 && (
            <span className="text-[11px] text-slate-500 font-medium">
              · {completedCount} ការងារបានបញ្ចប់
            </span>
          )}
        </div>

        {/* Details: Experience, Location, Rate */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-4">
          <div className="flex items-center space-x-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {provider.district ? `${provider.district}, ` : ""}{provider.city || provider.serviceArea || "ភ្នំពេញ"}
              {"distanceKm" in provider && provider.distanceKm !== undefined && (
                <span className="ml-1 text-slate-400 font-medium">
                  ({provider.distanceKm.toFixed(1)} km)
                </span>
              )}
            </span>
          </div>

          {experience !== undefined && experience > 0 && (
            <div className="flex items-center space-x-1.5 text-slate-500">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>បទពិសោធន៍ {experience} ឆ្នាំ</span>
            </div>
          )}

          {hourlyRate !== undefined && hourlyRate > 0 && (
            <div className="text-xs font-bold text-slate-800">
              <span>តម្លៃចាប់ពី៖ </span>
              <span className="text-emerald-600">${hourlyRate}/ម៉ោង</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          {provider.availabilityStatus ? (
            <StatusBadge status={provider.availabilityStatus} />
          ) : (
            <span className="text-xs text-slate-400">អ្នកផ្តល់សេវា</span>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          <Link
            href={isAuthenticated ? `/customer/messages?providerId=${provider.id}` : `/login`}
            className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold rounded-xl transition"
            title="ទាក់ទងអ្នកជំនាញ"
          >
            ទាក់ទង
          </Link>

          <Link
            href={`/providers/${provider.id}`}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            មើលព័ត៌មាន
          </Link>
        </div>
      </div>
    </div>
  );
};

