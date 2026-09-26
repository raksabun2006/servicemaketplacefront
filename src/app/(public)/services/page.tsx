"use client";

import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { categoryApi } from "@/lib/api/category.api";
import { fileApi } from "@/lib/api/file.api";
import {
  ServiceCategory,
  ServiceRequestResponse,
  ServiceRequestSummaryResponse,
} from "@/types/service-request";
import { CategoryResponse } from "@/types/category";
import { PhotoLightbox } from "@/components/ui/PhotoLightbox";
import { offerApi } from "@/lib/api/offer.api";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  AlertTriangle,
  Wrench,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Eye,
  X,
  Clock,
  Send,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";


const toKhmerDigits = (num: number | string): string => {
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return String(num).replace(/[0-9]/g, (d) => khmerDigits[parseInt(d, 10)]);
};

const formatKhmerDate = (dateStr?: string): { km: string; en: string } => {
  if (!dateStr) return { km: "ថ្មីៗនេះ", en: "Recent" };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { km: "ថ្មីៗនេះ", en: "Recent" };

    const day = d.getDate();
    const dayPadded = day < 10 ? `0${day}` : `${day}`;
    const month = d.getMonth();
    const year = d.getFullYear();

    const khmerMonths = [
      "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
      "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
    ];
    const enMonths = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const km = `${toKhmerDigits(dayPadded)} ${khmerMonths[month]} ${toKhmerDigits(year)}`;
    const en = `${dayPadded} ${enMonths[month]} ${year}`;
    return { km, en };
  } catch {
    return { km: "ថ្មីៗនេះ", en: "Recent" };
  }
};

const ALL_CATEGORIES: ServiceCategory[] = [
  "AC_REPAIR",
  "PLUMBING",
  "ELECTRICAL",
  "CLEANING",
  "APPLIANCE_REPAIR",
  "CARPENTRY",
  "PAINTING",
  "PEST_CONTROL",
  "OTHER",
];

interface ServiceCardProps {
  request: ServiceRequestSummaryResponse;
  categoryLabel: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ request, categoryLabel }) => {
  const { language } = useLanguage();
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

  // Fetch real request details to load real attached photos from backend API
  useEffect(() => {
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
          setImgError(false);
        }
      })
      .catch(() => {
        // Silently ignore if unauthenticated
      });

    return () => {
      isMounted = false;
    };
  }, [request.id]);

  const realImageUrls = images.map((img) => fileApi.getFileUrl(img)).filter(Boolean);
  const hasRealPhoto = realImageUrls.length > 0 && !imgError;
  const firstImageUrl = hasRealPhoto ? realImageUrls[0] : null;

  const formattedDate = formatKhmerDate(request.createdAt);

  // Accurate budget formatting preventing $null - $null
  const hasMin = request.budgetMin != null && !isNaN(Number(request.budgetMin));
  const hasMax = request.budgetMax != null && !isNaN(Number(request.budgetMax));
  const budgetText =
    hasMin && hasMax
      ? `$${request.budgetMin} - $${request.budgetMax}`
      : hasMin
      ? (language === "km" ? `ចាប់ពី $${request.budgetMin}` : `From $${request.budgetMin}`)
      : hasMax
      ? (language === "km" ? `រហូតដល់ $${request.budgetMax}` : `Up to $${request.budgetMax}`)
      : (language === "km" ? "តម្លៃចរចា" : "Negotiable");

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
        className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
        title="ចុចដើម្បីមើលព័ត៌មានលម្អិតនៃបញ្ហា (Click to view problem details)"
      >
        {/* Card Photo (Clean, modern, edge-to-edge) - ONLY for real photos */}
        {hasRealPhoto && firstImageUrl && (
          <div
            onClick={(e) => handleOpenPhoto(e, 0)}
            className="relative aspect-16/10 w-full overflow-hidden bg-slate-900 cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={firstImageUrl}
              alt={request.title}
              onError={() => {
                setImgError(true);
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />

            {/* Hover overlay hint when real photo exists */}
            <div className="absolute inset-0 bg-slate-900/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-semibold backdrop-blur-xs">
                <Eye className="w-3.5 h-3.5" />
                <span>{language === "km" ? `មើលរូបភាព (${realImageUrls.length})` : `View Photos (${realImageUrls.length})`}</span>
              </span>
            </div>

            {/* Real Photo Indicator Badge */}
            <div className="absolute bottom-2.5 right-2 flex items-center space-x-1.5 pointer-events-none">
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold backdrop-blur-xs shadow-xs">
                <Camera className="w-3.5 h-3.5" />
                <span>{language === "km" ? "រូបថតជាក់ស្តែង" : "Real Photo"}</span>
              </div>
              {realImageUrls.length > 1 && (
                <div className="px-1.5 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold flex items-center space-x-1 backdrop-blur-xs shadow-xs">
                  <ImageIcon className="w-3 h-3" />
                  <span>{realImageUrls.length} រូប</span>
                </div>
              )}
            </div>

            {/* Brand Logo Badge in bottom-left corner */}
            <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-white/95 p-0.5 shadow-md flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Category tag pill top-right */}
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/75 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
              {categoryLabel}
            </div>

            {/* Urgent banner if applicable */}
            {request.urgent && (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-xs flex items-center space-x-1">
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>{language === "km" ? "បន្ទាន់" : "Urgent"}</span>
              </div>
            )}
          </div>
        )}

        {/* Card Body with Real Request Information */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
          <div>
            {/* Header badges when no photo is attached */}
            {!hasRealPhoto && (
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-slate-100 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700">
                    {categoryLabel}
                  </span>
                </div>
                {request.urgent && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>{language === "km" ? "បន្ទាន់" : "Urgent"}</span>
                  </span>
                )}
              </div>
            )}

            {/* Real Title from API */}
            <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
              {request.title}
            </h3>

            {/* Real Location & Budget Info */}
            <div className="mt-2.5 space-y-1.5 text-[11px] text-slate-500">
              {(request.district || request.city) && (
                <div className="flex items-center space-x-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {request.district ? `${request.district}, ` : ""}
                    {request.city || "Phnom Penh"}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-1.5 font-bold text-emerald-600">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{budgetText}</span>
              </div>
            </div>
          </div>

          {/* Date Footer with Calendar Icon */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{language === "km" ? formattedDate.km : formattedDate.en}</span>
            </div>
            {request.offerCount !== undefined && request.offerCount > 0 && (
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {request.offerCount} {language === "km" ? "សំណើ" : "offers"}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Real Photo Lightbox Modal */}
      {hasRealPhoto && (
        <PhotoLightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={realImageUrls}
          initialIndex={activePhotoIndex}
          title={request.title}
          subtitle={request.district ? `${request.district}, ${request.city || "Phnom Penh"}` : request.city}
          badge={categoryLabel}
          isRealPhoto={true}
        />
      )}
    </>
  );
};

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();

  const [category, setCategory] = useState<ServiceCategory | "">(
    (searchParams.get("category") as ServiceCategory) || ""
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);

  const [requests, setRequests] = useState<ServiceRequestSummaryResponse[]>([]);
  const [fetchedCategories, setFetchedCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  // Pagination states from real API
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch real data from Spring Boot API: /api/v1/service-requests
  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await serviceRequestApi.browse({
        category: category || undefined,
        search: search.trim() || undefined,
        urgent: urgentOnly ? true : undefined,
        page: currentPage - 1,
        size: 8,
      });

      if (res && res.content) {
        setRequests(res.content);
        if (res.page) {
          setTotalPages(res.page.totalPages || 1);
          setTotalElements(res.page.totalElements || 0);
        }
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Failed to fetch real service requests:", err);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, search, urgentOnly, currentPage]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Fetch real categories from API
  useEffect(() => {
    categoryApi
      .getActive()
      .then((data) => {
        if (data && data.length > 0) {
          setFetchedCategories(data);
        }
      })
      .catch(() => {});
  }, []);

  // Filter requests locally if month filter is selected
  const displayRequests = useMemo(() => {
    if (!selectedMonth) return requests;
    return requests.filter((req) => {
      if (!req.createdAt) return true;
      return req.createdAt.startsWith(selectedMonth);
    });
  }, [requests, selectedMonth]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 220, behavior: "smooth" });
    }
  };

  const getCategoryTitle = (cat: string): string => {
    const key = `cat_${cat}` as keyof typeof translations.km;
    return t(key) || cat;
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* 1. Header Banner with Circuit Pattern (Screenshot 2 UI) */}
      <div className="relative bg-gradient-to-r from-[#0a2540] via-[#104ccb] to-[#0a2540] text-white py-14 sm:py-16 overflow-hidden shadow-md">
        {/* SVG Circuit Lines & Nodes */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="w-full h-full" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
            <path d="M0 40H300L340 80H700L730 50H1100L1140 90H1440" stroke="#60A5FA" strokeWidth="1.5" />
            <path d="M0 160H400L440 120H900L930 150H1440" stroke="#93C5FD" strokeWidth="1.5" />
            <path d="M200 0V40L230 70H500" stroke="#3B82F6" strokeWidth="1.5" />
            <path d="M1200 200V160L1170 130H950" stroke="#3B82F6" strokeWidth="1.5" />
            <circle cx="340" cy="80" r="4" fill="#FFFFFF" />
            <circle cx="730" cy="50" r="4" fill="#FFFFFF" />
            <circle cx="1140" cy="90" r="4" fill="#FFFFFF" />
            <circle cx="440" cy="120" r="4" fill="#FFFFFF" />
            <circle cx="930" cy="150" r="4" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Diagonal Tech Graphic Accents (Matches Screenshot 2) */}
        <div className="absolute left-6 top-8 hidden md:flex items-center space-x-1.5 opacity-40">
          <div className="w-2 h-8 bg-blue-300 transform -skew-x-25 rounded-xs" />
          <div className="w-2 h-8 bg-blue-400 transform -skew-x-25 rounded-xs" />
          <div className="w-2 h-8 bg-blue-200 transform -skew-x-25 rounded-xs" />
        </div>
        <div className="absolute right-6 top-8 hidden md:flex items-center space-x-1.5 opacity-40">
          <div className="w-2 h-8 bg-blue-200 transform -skew-x-25 rounded-xs" />
          <div className="w-2 h-8 bg-blue-400 transform -skew-x-25 rounded-xs" />
          <div className="w-2 h-8 bg-blue-300 transform -skew-x-25 rounded-xs" />
        </div>

        {/* Center Banner Title (Screenshot 2: ដំណឹងផ្សព្វផ្សាយ) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-sm">
            {language === "km" ? "ដំណឹងផ្សព្វផ្សាយ" : "Service Requests & Announcements"}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto font-medium opacity-90">
            {language === "km"
              ? "សំណើសេវាកម្មពិតជាក់ស្ដែងដែលកំពុងបើកទទួលជាងជំនាញ និងព័ត៌មានបច្ចេកវិទ្យា"
              : "Live service requests open for verified providers across Cambodia"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-7">
        {/* 2. Search & Filter Bar (Screenshot 2 exact layout) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            {/* Search Input (Icon inside on the RIGHT as in screenshot 2) */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={language === "km" ? "ស្វែងរក..." : "Search..."}
                className="w-full pl-4 pr-11 py-3 text-xs sm:text-sm text-slate-800 rounded-xl border border-blue-500/60 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 outline-none transition placeholder:text-slate-400 bg-white"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                <Search className="w-5 h-5" />
              </div>
            </div>

            {/* Month Filter Selector (Icon inside on the RIGHT as in screenshot 2) */}
            <div className="relative w-full sm:w-72">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-4 pr-11 py-3 text-xs sm:text-sm text-slate-800 rounded-xl border border-blue-500/60 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 outline-none transition bg-white appearance-none cursor-pointer"
              >
                <option value="">{language === "km" ? "ជ្រើសរើសខែ (ទាំងអស់)" : "Select Month (All)"}</option>
                <option value="2026-09">{language === "km" ? "កញ្ញា ២០២៦" : "September 2026"}</option>
                <option value="2026-08">{language === "km" ? "សីហា ២០២៦" : "August 2026"}</option>
                <option value="2026-07">{language === "km" ? "កក្កដា ២០២៦" : "July 2026"}</option>
                <option value="2026-06">{language === "km" ? "មិថុនា ២០២៦" : "June 2026"}</option>
                <option value="2026-05">{language === "km" ? "ឧសភា ២០២៦" : "May 2026"}</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pt-3 mt-3 border-t border-slate-100 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              {language === "km" ? "ប្រភេទ:" : "Category:"}
            </span>
            <button
              type="button"
              onClick={() => {
                setCategory("");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                category === ""
                  ? "bg-[#104ccb] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {language === "km" ? "ទាំងអស់" : "All"}
            </button>
            {(fetchedCategories.length > 0
              ? fetchedCategories.map((c) => ({ code: c.code, label: c.name }))
              : ALL_CATEGORIES.map((c) => ({ code: c, label: getCategoryTitle(c) }))
            ).map((cat) => (
              <button
                key={cat.code}
                type="button"
                onClick={() => {
                  setCategory(cat.code as ServiceCategory);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  category === cat.code
                    ? "bg-[#104ccb] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {cat.label}
              </button>
            ))}

            {/* Urgent Checkbox Toggle */}
            <label className="ml-auto flex items-center space-x-1.5 px-3 py-1 rounded-full border border-rose-200 bg-rose-50/50 text-rose-700 text-xs font-semibold cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={(e) => {
                  setUrgentOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>{language === "km" ? "បន្ទាន់" : "Urgent"}</span>
            </label>
          </div>
        </div>

        {/* 3. 4-Column Card Grid (Screenshot 1 & Screenshot 2 UI) with Real API Data */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse flex flex-col"
              >
                <div className="p-2.5 bg-slate-200">
                  <div className="aspect-16/10 bg-slate-300 rounded-lg" />
                </div>
                <div className="p-4 space-y-3 flex-1">
                  <div className="h-4 bg-slate-200 rounded-sm w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-sm w-1/2" />
                  <div className="h-3 bg-slate-100 rounded-sm w-2/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : displayRequests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {displayRequests.map((req) => (
              <ServiceCard
                key={req.id}
                request={req}
                categoryLabel={getCategoryTitle(req.category)}
              />
            ))}
          </div>
        ) : (
          /* Real Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {language === "km" ? "មិនទាន់មានសំណើសេវាកម្មក្នុងលក្ខខណ្ឌនេះទេ" : "No Service Requests Found"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === "km"
                ? "សូមសាកល្បងជ្រើសរើសប្រភេទសេវាកម្មផ្សេង ឬបង្ហោះបញ្ហាថ្មីដើម្បីស្វែងរកជាងជំនាញ"
                : "Try selecting another category or post a new service request."}
            </p>
            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("");
                  setSelectedMonth("");
                  setUrgentOnly(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
              >
                {language === "km" ? "សម្អាតការស្វែងរក" : "Clear Filters"}
              </button>
              <Link
                href="/customer/requests/create"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
              >
                {language === "km" ? "បង្ហោះបញ្ហាឥឡូវនេះ" : "Post a Request"}
              </Link>
            </div>
          </div>
        )}

        {/* 4. Numbered Pagination Bar (Matches Screenshot 1 exact style) with Real Total Pages */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 pt-8 pb-4">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dynamically render page buttons based on real totalPages */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-bold flex items-center justify-center transition ${
                  currentPage === pageNum
                    ? "bg-[#104ccb] text-white shadow-md shadow-blue-600/30"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-blue-500"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {totalPages > 5 && (
              <>
                <span className="text-slate-400 text-xs px-1 select-none">...</span>
                <button
                  type="button"
                  onClick={() => handlePageChange(totalPages)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-bold flex items-center justify-center transition ${
                    currentPage === totalPages
                      ? "bg-[#104ccb] text-white shadow-md shadow-blue-600/30"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-blue-500"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 5. Quick Links to Service Actions */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{language === "km" ? "ថ្នាលសេវាកម្មកម្ពុជា" : "Cambodia Service Hub"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {language === "km" ? "ត្រូវការជាងជំនាញ ឬចង់ផ្ដល់សេវាកម្ម?" : "Need a Technician or Want to Provide Services?"}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl">
              {language === "km"
                ? "ផ្ញើសំណើការងារជួសជុលគេហដ្ឋានរបស់អ្នក ឬចុះឈ្មោះជាជាងជំនាញដើម្បីទទួលបានការងារជារៀងរាល់ថ្ងៃ។"
                : "Post your home maintenance requests or join our verified artisan network to get daily bookings."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/customer/requests/create"
              className="px-5 py-2.5 rounded-full bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold shadow-md transition"
            >
              {language === "km" ? "បង្ហោះបញ្ហាត្រូវការជាង" : "Post a Service Request"}
            </Link>
            <Link
              href="/register?role=provider"
              className="px-5 py-2.5 rounded-full bg-blue-600/60 hover:bg-blue-600 text-white border border-white/30 text-xs font-bold transition"
            >
              {language === "km" ? "ចុះឈ្មោះជាជាងជំនាញ" : "Register as Technician"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center text-xs text-slate-400">
          កំពុងផ្ទុក...
        </div>
      }
    >
      <ServicesPageContent />
    </Suspense>
  );
}
