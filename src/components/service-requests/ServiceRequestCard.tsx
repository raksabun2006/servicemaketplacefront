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
import {
  MapPin,
  DollarSign,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Image as ImageIcon,
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

  // If request doesn't include images directly (e.g. from summary endpoint), load details to check
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
        // Silently ignore if unauthorized or no images
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

  const firstImageUrl = images.length > 0 ? fileApi.getFileUrl(images[0]) : null;
  const hasImage = Boolean(firstImageUrl && !imgError);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm hover:border-blue-300 transition flex flex-col justify-between group">
      <div>
        {/* Photo Banner if Request has an image */}
        {hasImage && (
          <div className="relative w-full h-44 sm:h-48 bg-slate-100 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={firstImageUrl!}
              alt={request.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
              loading="lazy"
            />
            {/* Badges floating on image */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
              <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/95 text-blue-700 shadow-xs backdrop-blur-xs">
                {categoryLabel}
              </span>
              <div className="shadow-xs">
                <StatusBadge status={request.status} />
              </div>
            </div>

            {/* Multiple Photos Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/75 text-white text-[10px] font-medium flex items-center gap-1 backdrop-blur-xs shadow-xs">
                <ImageIcon className="w-3 h-3" />
                <span>{images.length}</span>
              </div>
            )}
          </div>
        )}

        <div className="p-4 sm:p-5">
          {/* If No Photo, render Category & Status badges here */}
          {!hasImage && (
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700">
                {categoryLabel}
              </span>
              <StatusBadge status={request.status} />
            </div>
          )}

          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1 mb-2">
            {request.title}
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
  );
};


