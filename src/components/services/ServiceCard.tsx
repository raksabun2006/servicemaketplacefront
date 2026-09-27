"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ServiceRequestSummaryResponse } from "@/types/service-request";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { fileApi } from "@/lib/api/file.api";
import { PhotoLightbox } from "@/components/ui/PhotoLightbox";
import {
  Calendar,
  MapPin,
  DollarSign,
  AlertTriangle,
  Camera,
  Image as ImageIcon,
  Eye,
  ArrowRight,
} from "lucide-react";

export const toKhmerDigits = (num: number | string): string => {
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return String(num).replace(/[0-9]/g, (d) => khmerDigits[parseInt(d, 10)]);
};

export const formatKhmerDate = (dateStr?: string): string => {
  if (!dateStr) return "ថ្មីៗនេះ";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "ថ្មីៗនេះ";

    const day = d.getDate();
    const dayPadded = day < 10 ? `0${day}` : `${day}`;
    const month = d.getMonth();
    const year = d.getFullYear();

    const khmerMonths = [
      "មករា",
      "កុម្ភៈ",
      "មីនា",
      "មេសា",
      "ឧសភា",
      "មិថុនា",
      "កក្កដា",
      "សីហា",
      "កញ្ញា",
      "តុលា",
      "វិច្ឆិកា",
      "ធ្នូ",
    ];

    return `${toKhmerDigits(dayPadded)} ${khmerMonths[month]} ${toKhmerDigits(year)}`;
  } catch {
    return "ថ្មីៗនេះ";
  }
};

interface ServiceCardProps {
  request: ServiceRequestSummaryResponse;
  categoryLabel: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  request,
  categoryLabel,
}) => {
  const [images, setImages] = useState<string[]>(() => {
    const raw = (
      "imageUrls" in request &&
      Array.isArray(request.imageUrls) &&
      request.imageUrls.length > 0
        ? request.imageUrls
        : "imageFileIds" in request &&
          Array.isArray(request.imageFileIds) &&
          request.imageFileIds.length > 0
        ? request.imageFileIds
        : "imageUrl" in request &&
          typeof request.imageUrl === "string" &&
          request.imageUrl
        ? [request.imageUrl]
        : []
    ).filter(Boolean);
    return raw;
  });

  const [imgError, setImgError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Fetch request details for attachments if needed
  useEffect(() => {
    let isMounted = true;
    serviceRequestApi
      .getById(request.id)
      .then((details) => {
        if (!isMounted) return;
        const raw = (
          details.imageUrls && details.imageUrls.length > 0
            ? details.imageUrls
            : ((details as unknown as { imageFileIds?: string[] })
                .imageFileIds || [])
        ).filter(Boolean);

        if (raw.length > 0) {
          setImages(raw);
          setImgError(false);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [request.id]);

  const realImageUrls = images
    .map((img) => fileApi.getFileUrl(img))
    .filter(Boolean);
  const hasRealPhoto = realImageUrls.length > 0 && !imgError;
  const firstImageUrl = hasRealPhoto ? realImageUrls[0] : null;

  const formattedDate = formatKhmerDate(request.createdAt);

  const hasMin = request.budgetMin != null && !isNaN(Number(request.budgetMin));
  const hasMax = request.budgetMax != null && !isNaN(Number(request.budgetMax));
  const budgetText =
    hasMin && hasMax
      ? `$${request.budgetMin} - $${request.budgetMax}`
      : hasMin
      ? `ចាប់ពី $${request.budgetMin}`
      : hasMax
      ? `រហូតដល់ $${request.budgetMax}`
      : "តម្លៃចរចា";

  const handleOpenPhoto = (e: React.MouseEvent, index = 0) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePhotoIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <Link
        href={`/services/${request.id}`}
        className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
        title="ចុចដើម្បីមើលព័ត៌មានលម្អិតនៃបញ្ហា"
      >
        {/* Edge-to-edge photo if exists */}
        {hasRealPhoto && firstImageUrl && (
          <div
            onClick={(e) => handleOpenPhoto(e, 0)}
            className="relative aspect-16/10 w-full overflow-hidden bg-slate-900 cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={firstImageUrl}
              alt={request.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-slate-900/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-semibold backdrop-blur-xs">
                <Eye className="w-3.5 h-3.5" />
                <span>មើលរូបភាព ({realImageUrls.length})</span>
              </span>
            </div>

            {/* Photo Indicator Badge */}
            <div className="absolute bottom-2.5 right-2 flex items-center space-x-1.5 pointer-events-none">
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold backdrop-blur-xs shadow-xs">
                <Camera className="w-3.5 h-3.5" />
                <span>រូបថតជាក់ស្តែង</span>
              </div>
              {realImageUrls.length > 1 && (
                <div className="px-1.5 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold flex items-center space-x-1 backdrop-blur-xs shadow-xs">
                  <ImageIcon className="w-3 h-3" />
                  <span>{realImageUrls.length} រូប</span>
                </div>
              )}
            </div>

            {/* Category tag pill */}
            <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-slate-900/75 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
              {categoryLabel}
            </div>

            {/* Urgent banner if applicable */}
            {request.urgent && (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-xs flex items-center space-x-1">
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>បន្ទាន់</span>
              </div>
            )}
          </div>
        )}

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 bg-white">
          <div>
            {!hasRealPhoto && (
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700">
                  {categoryLabel}
                </span>
                {request.urgent && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>បន្ទាន់</span>
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
              {request.title}
            </h3>

            {/* Location & Budget Info */}
            <div className="mt-2.5 space-y-1.5 text-xs text-slate-500">
              {(request.district || request.city) && (
                <div className="flex items-center space-x-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {request.district ? `${request.district}, ` : ""}
                    {request.city || "ភ្នំពេញ"}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-1.5 font-bold text-emerald-600 text-xs sm:text-sm">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{budgetText}</span>
              </div>
            </div>
          </div>

          {/* Date Footer & Offers */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            {request.offerCount !== undefined && request.offerCount > 0 && (
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {request.offerCount} សំណើ
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Lightbox Modal */}
      {hasRealPhoto && (
        <PhotoLightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={realImageUrls}
          initialIndex={activePhotoIndex}
          title={request.title}
          subtitle={
            request.district
              ? `${request.district}, ${request.city || "ភ្នំពេញ"}`
              : request.city
          }
          badge={categoryLabel}
          isRealPhoto={true}
        />
      )}
    </>
  );
};
