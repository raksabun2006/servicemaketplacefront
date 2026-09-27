"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProviderProfileResponse, NearbyProviderResponse } from "@/types/provider";
import { fileApi } from "@/lib/api/file.api";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  MapPin,
  CheckCircle2,
  Star,
  Briefcase,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Navigation,
} from "lucide-react";

interface ProviderCardProps {
  provider: ProviderProfileResponse | NearbyProviderResponse;
  categoryLabel?: string;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  categoryLabel,
}) => {
  const { language } = useLanguage();
  const isKm = language === "km";
  const [imgError, setImgError] = useState(false);

  const businessName = provider.businessName;
  const fullName = "fullName" in provider ? provider.fullName : "";
  const displayName = businessName || fullName || (isKm ? "អ្នកផ្តល់សេវា" : "Service Provider");

  const isVerified =
    provider.isVerified ||
    ("verificationStatus" in provider &&
      provider.verificationStatus === "VERIFIED");

  const completedCount =
    "completedServices" in provider ? provider.completedServices : undefined;
  const experienceYears =
    "experienceYears" in provider ? provider.experienceYears : undefined;
  const hourlyRate =
    "hourlyRate" in provider ? provider.hourlyRate : undefined;
  const distanceKm =
    "distanceKm" in provider ? provider.distanceKm : undefined;
  const bio = "bio" in provider ? provider.bio : undefined;

  const rating = provider.averageRating || 0;
  const totalReviews = provider.totalReviews || 0;

  // Status mapping
  const isAvailable =
    provider.availabilityStatus === "AVAILABLE" ||
    ("isAvailable" in provider && provider.isAvailable === true);
  const isBusy = provider.availabilityStatus === "BUSY";

  const avatarUrl = provider.avatarUrl
    ? fileApi.getFileUrl(provider.avatarUrl)
    : null;

  // Location string
  const locationText = [
    provider.district ? `ខណ្ឌ${provider.district.replace(/^ខណ្ឌ\s*/, "")}` : "",
    provider.city || provider.serviceArea || "ភ្នំពេញ",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-lg hover:border-blue-400 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header: Photo + Name + Verification + Availability */}
        <div className="flex items-start gap-3.5 mb-3">
          {/* Profile Photo */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 text-blue-700 font-bold text-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-100 shadow-2xs relative">
            {avatarUrl && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            ) : (
              <span className="text-xl font-bold select-none text-blue-600">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}

            {/* Online / Available dot indicator */}
            <span
              className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
                isAvailable
                  ? "bg-emerald-500"
                  : isBusy
                  ? "bg-amber-500"
                  : "bg-slate-300"
              }`}
              title={
                isAvailable
                  ? isKm ? "មានទំនេរឥឡូវនេះ" : "Available Now"
                  : isBusy
                  ? isKm ? "រវល់ការងារ" : "Busy"
                  : isKm ? "មិនទាន់ទំនេរ" : "Unavailable"
              }
            />
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1">
              <Link
                href={`/providers/${provider.id}`}
                className="text-base sm:text-[17px] font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug truncate"
              >
                {displayName}
              </Link>
            </div>

            {/* Verification Badge */}
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {isVerified ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{isKm ? "បានផ្ទៀងផ្ទាត់" : "Verified"}</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{isKm ? "ជាងជំនាញ" : "Technician"}</span>
                </span>
              )}

              {/* Category tag */}
              {categoryLabel && (
                <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-[#104ccb] text-[11px] font-semibold truncate max-w-[140px]">
                  {categoryLabel}
                </span>
              )}
            </div>

            {/* Star Rating & Reviews */}
            <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-slate-600">
              <div className="flex items-center space-x-0.5 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800">
                  {rating > 0 ? rating.toFixed(1) : (isKm ? "ថ្មី" : "New")}
                </span>
              </div>
              <span className="text-slate-300">·</span>
              <span className="text-[11px] text-slate-500">
                {totalReviews > 0
                  ? isKm ? `${totalReviews} ការវាយតម្លៃ` : `${totalReviews} reviews`
                  : isKm ? "មិនទាន់មានការវាយតម្លៃ" : "No reviews yet"}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Experience, Location, Distance & Starting Price */}
        <div className="space-y-1.5 text-xs text-slate-600 py-2 border-t border-slate-100/90">
          {/* Experience */}
          {experienceYears !== undefined && experienceYears > 0 && (
            <div className="flex items-center space-x-1.5 text-slate-600">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {isKm ? (
                  <>មានបទពិសោធន៍ <strong className="text-slate-800">{experienceYears} ឆ្នាំ</strong></>
                ) : (
                  <><strong className="text-slate-800">{experienceYears} years</strong> experience</>
                )}
              </span>
            </div>
          )}

          {/* Location & Service Area */}
          <div className="flex items-center space-x-1.5 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {isKm ? (
                <>មានជំនាញនៅ <strong className="text-slate-800">{locationText}</strong></>
              ) : (
                <>Service area in <strong className="text-slate-800">{locationText}</strong></>
              )}
            </span>
          </div>

          {/* Distance from user if available */}
          {distanceKm !== undefined && (
            <div className="flex items-center space-x-1.5 text-blue-600 font-semibold text-[11px]">
              <Navigation className="w-3 h-3 text-blue-600 shrink-0" />
              <span>
                {isKm
                  ? `ចម្ងាយ ${distanceKm.toFixed(1)} km ពីទីតាំងរបស់អ្នក`
                  : `${distanceKm.toFixed(1)} km from your location`}
              </span>
            </div>
          )}

          {/* Jobs completed trust metric if provided by API */}
          {completedCount !== undefined && completedCount > 0 && (
            <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {isKm ? `បានបញ្ចប់ការងារ ${completedCount}+` : `${completedCount}+ jobs completed`}
              </span>
            </div>
          )}

          {/* Starting Price */}
          {hourlyRate !== undefined && hourlyRate > 0 && (
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {isKm ? "តម្លៃចាប់ពី" : "Starting from"}
              </span>
              <span className="font-extrabold text-sm text-emerald-600">
                ${hourlyRate}{" "}
                <span className="text-[11px] font-normal text-slate-400">
                  {isKm ? "/ម៉ោង" : "/hr"}
                </span>
              </span>
            </div>
          )}

          {/* Short Bio description if available */}
          {bio && (
            <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 font-normal leading-relaxed">
              {bio}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2 mt-2">
        <Link
          href={`/customer/requests/create?providerId=${provider.id}`}
          className="flex-1 py-2 px-3 rounded-xl border border-[#104ccb] text-[#104ccb] hover:bg-blue-50 active:bg-blue-100 text-xs font-bold text-center transition flex items-center justify-center space-x-1"
        >
          <Send className="w-3 h-3 text-[#104ccb]" />
          <span>{isKm ? "ស្នើសុំសេវា" : "Request Service"}</span>
        </Link>

        <Link
          href={`/providers/${provider.id}`}
          className="flex-1 py-2 px-3 rounded-xl bg-[#104ccb] hover:bg-[#0a3ca8] active:bg-blue-900 text-white text-xs font-bold text-center shadow-2xs transition flex items-center justify-center space-x-1"
        >
          <span>{isKm ? "មើលព័ត៌មាន" : "View Profile"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
