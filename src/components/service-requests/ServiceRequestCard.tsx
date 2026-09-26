"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ServiceRequestResponse, ServiceRequestSummaryResponse } from "@/types/service-request";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import { fileApi } from "@/lib/api/file.api";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { StatusBadge } from "@/components/ui/Badge";
import { PhotoLightbox } from "@/components/ui/PhotoLightbox";
import {
  MapPin,
  DollarSign,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Image as ImageIcon,
  Camera,
  Eye,
  ExternalLink,
} from "lucide-react";

interface ServiceRequestCardProps {
  request: ServiceRequestResponse | ServiceRequestSummaryResponse;
  href?: string;
}

export const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({ request, href }) => {
  const { t } = useLanguage();
  const { isProvider } = useAuth();

  const [images, setImages] = useState<string[]>(() => {
    const raw = (
      ("imageUrls" in request && Array.isArray(request.imageUrls) && request.imageUrls.length > 0)
        ? request.imageUrls
        : ("imageFileIds" in request && Array.isArray(request.imageFileIds) && request.imageFileIds.length > 0)
        ? request.imageFileIds
        : ("imageUrl" in request && typeof request.imageUrl === "string" && request.imageUrl)
        ? [request.imageUrl]
        : []
    ).filter(Boolean);
    return raw;
  });

  const [imgError, setImgError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // If request summary doesn't include images directly, fetch details from API to load real attached photos
  useEffect(() => {
    if (images.length > 0) return;

    let isMounted = true;
    serviceRequestApi
      .getById(request.id)
      .then((details) => {
        if (!isMounted) return;
        const raw = (
          (details.imageUrls && details.imageUrls.length > 0)
            ? details.imageUrls
            : ((details as unknown as { imageFileIds?: string[] }).imageFileIds || [])
        ).filter(Boolean);

        if (raw.length > 0) {
          setImages(raw);
        }
      })
      .catch(() => {
        // Silently ignore if unauthorized or no images in API
      });

    return () => {
      isMounted = false;
    };
  }, [request.id, images.length]);

  const defaultLink = isProvider
    ? `/provider/requests/${request.id}`
    : `/customer/requests/${request.id}`;
  const detailLink = href || defaultLink;

  const categoryKey = `cat_${request.category}` as keyof typeof translations.km;
  const categoryLabel = t(categoryKey) || request.category;

  const budgetDisplay =
    request.budgetMin !== undefined && request.budgetMax !== undefined
      ? `$${request.budgetMin} - $${request.budgetMax}`
      : request.budgetMin !== undefined
      ? `ចាប់ពី $${request.budgetMin}`
      : request.budgetMax !== undefined
      ? `រហូតដល់ $${request.budgetMax}`
      : "ចរចា";

  // Real photos from API only
  const realImageUrls = images.map((img) => fileApi.getFileUrl(img)).filter(Boolean);
  const hasRealPhoto = realImageUrls.length > 0 && !imgError;
  const firstImageUrl = hasRealPhoto ? realImageUrls[0] : null;

  const handleOpenPhoto = (e: React.MouseEvent, index = 0) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePhotoIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group">
        <div>
          {/* Photo Banner - Only shown when REAL photos exist in API */}
          {hasRealPhoto && (
            <div
              onClick={(e) => handleOpenPhoto(e, 0)}
              className="relative w-full h-44 sm:h-48 bg-slate-100 overflow-hidden cursor-pointer group/photo"
              title="ចុចដើម្បីមើលរូបភាពជាក់ស្តែង (Click to view full photo)"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={firstImageUrl!}
                alt={request.title}
                className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300 select-none"
                onError={() => setImgError(true)}
                loading="lazy"
              />

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-xs shadow-md">
                  <Eye className="w-3.5 h-3.5" />
                  <span>មើលរូបភាព ({realImageUrls.length})</span>
                </span>
              </div>

              {/* Top Badges (Category & Status) */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/95 text-blue-700 shadow-xs backdrop-blur-xs">
                  {categoryLabel}
                </span>
                <div className="shadow-xs">
                  <StatusBadge status={request.status} />
                </div>
              </div>

              {/* Bottom Real Photo Indicator & Count */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-semibold backdrop-blur-xs shadow-xs">
                  <Camera className="w-3 h-3" />
                  <span>រូបថតជាក់ស្តែង</span>
                </div>

                {realImageUrls.length > 1 && (
                  <div className="px-2 py-0.5 rounded-md bg-slate-950/75 text-white text-[10px] font-medium flex items-center gap-1 backdrop-blur-xs shadow-xs">
                    <ImageIcon className="w-3 h-3" />
                    <span>{realImageUrls.length} រូប</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Card Body */}
          <div className="p-4 sm:p-5">
            {/* If No Photo, render Category & Status badges here */}
            {!hasRealPhoto && (
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700">
                  {categoryLabel}
                </span>
                <StatusBadge status={request.status} />
              </div>
            )}

            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1 mb-2">
              <Link href={detailLink} className="hover:underline">
                {request.title}
              </Link>
            </h3>

            {"description" in request && request.description && (
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                {request.description}
              </p>
            )}

            <div className="space-y-1.5 text-xs text-slate-600 mb-2">
              <div className="flex items-center space-x-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {request.district ? `${request.district}, ` : ""}{request.city || "ភ្នំពេញ"}
                  {request.distanceKm !== undefined && request.distanceKm !== null && (
                    <span className="ml-1 text-slate-400 font-medium">
                      ({request.distanceKm.toFixed(1)} km)
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ថវិកា {budgetDisplay}</span>
              </div>

              {(request.preferredDate || request.preferredTime) && (
                <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {request.preferredDate || ""}{request.preferredDate && request.preferredTime ? " · " : ""}{request.preferredTime || ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            {request.urgent ? (
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                <span>{t("urgent")}</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {t("normal")}
              </span>
            )}

            {/* Click to open photo lightbox button if real photos exist */}
            {hasRealPhoto && (
              <button
                type="button"
                onClick={(e) => handleOpenPhoto(e, 0)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded-md transition"
                title="មើលរូបភាពជាក់ស្តែង (View Real Photo)"
              >
                <Eye className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
                <span>រូបភាព ({realImageUrls.length})</span>
              </button>
            )}

            {request.offerCount !== undefined && request.offerCount > 0 && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                <MessageSquare className="w-3 h-3 text-blue-600" />
                <span>{request.offerCount} សំណើ</span>
              </span>
            )}
          </div>

          <Link
            href={detailLink}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
          >
            {isProvider ? "មើលការងារ" : t("details")}
          </Link>
        </div>
      </div>

      {/* Photo Lightbox Modal - Only displays real photos from API */}
      {hasRealPhoto && (
        <PhotoLightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={realImageUrls}
          initialIndex={activePhotoIndex}
          title={request.title}
          subtitle={`${request.district ? request.district + ", " : ""}${request.city || "ភ្នំពេញ"} · ថវិកា ${budgetDisplay}`}
          badge={categoryLabel}
          isRealPhoto={true}
          actionButton={
            <Link
              href={detailLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <span>{isProvider ? "ដាក់សំណើតម្លៃ" : t("details")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          }
        />
      )}
    </>
  );
};
