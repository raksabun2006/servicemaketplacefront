"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { offerApi } from "@/lib/api/offer.api";
import { fileApi } from "@/lib/api/file.api";
import { ServiceRequestResponse } from "@/types/service-request";
import { PhotoLightbox } from "@/components/ui/PhotoLightbox";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  AlertTriangle,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Wrench,
  Send,
  Loader2,
  ShieldCheck,
  Clock,
  User,
  Share2,
  Check,
  HelpCircle,
  Phone,
  MessageSquare,
  Sparkles,
} from "lucide-react";

// Fallback images if customer didn't attach any photos
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  AC_REPAIR: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
  PLUMBING: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80",
  ELECTRICAL: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
  CLEANING: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
  APPLIANCE_REPAIR: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
  CARPENTRY: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=1200&q=80",
  PAINTING: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80",
  PEST_CONTROL: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
  TUTORING: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
  BEAUTY: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
  OTHER: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
};

const toKhmerDigits = (num: number | string): string => {
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return String(num).replace(/[0-9]/g, (d) => khmerDigits[parseInt(d, 10)]);
};

const formatKhmerDate = (dateStr?: string): { km: string; en: string } => {
  if (!dateStr) return { km: "ថ្មីៗនេះ", en: "Recent" };
  try {
    const d = new Date(dateStr);
    const day = d.getDate();
    const year = d.getFullYear();
    const monthsKm = [
      "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
      "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
    ];
    const monthsEn = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const mIdx = d.getMonth();
    return {
      km: `${toKhmerDigits(day)} ${monthsKm[mIdx]} ${toKhmerDigits(year)}`,
      en: `${day} ${monthsEn[mIdx]} ${year}`,
    };
  } catch {
    return { km: "ថ្មីៗនេះ", en: "Recent" };
  }
};

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { isAuthenticated, isProvider, user } = useAuth();

  const [request, setRequest] = useState<ServiceRequestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery & Lightbox states
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Direct Bidding Form state for Providers
  const [showBidForm, setShowBidForm] = useState(false);
  const [proposedPrice, setProposedPrice] = useState("");
  const [message, setMessage] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);

  // Copy share link state
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!params?.id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await serviceRequestApi.getById(params.id);
      setRequest(data);
    } catch {
      setError(
        language === "km"
          ? "មិនអាចទាញយកព័ត៌មានសំណើសេវាកម្មបានទេ។ សូមព្យាយាមម្តងទៀត។"
          : "Failed to load service request details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [params?.id, language]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !proposedPrice || !message.trim()) return;

    try {
      setSubmittingBid(true);
      setBidError(null);
      await offerApi.submitOffer(request.id, {
        proposedPrice: parseFloat(proposedPrice),
        message: message.trim(),
        estimatedCompletionTime: estimatedTime.trim() || undefined,
      });

      setBidSuccess(true);
      setShowBidForm(false);
      setProposedPrice("");
      setMessage("");
      setEstimatedTime("");
      fetchDetail();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setBidError(
        apiErr?.message ||
          (language === "km"
            ? "មិនអាចផ្ញើសំណើតម្លៃបានទេ។ សូមពិនិត្យព័ត៌មានម្តងទៀត។"
            : "Failed to submit quote. Please check your input.")
      );
    } finally {
      setSubmittingBid(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">
          {language === "km" ? "កំពុងទាញយកព័ត៌មានលម្អិត..." : "Loading problem details..."}
        </p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {language === "km" ? "រកមិនឃើញសំណើសេវាកម្ម" : "Service Request Not Found"}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {error || (language === "km" ? "សំណើនេះប្រហែលជាត្រូវបានលុប ឬមិនមាននៅក្នុងប្រព័ន្ធ។" : "This request might have been removed.")}
          </p>
          <div className="pt-2">
            <Link
              href="/services"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === "km" ? "ត្រឡប់ទៅកាន់ទំព័រសេវាកម្ម" : "Back to Services"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Real photos attached by customer in API
  const rawImages = (
    request.imageUrls && request.imageUrls.length > 0
      ? request.imageUrls
      : ((request as unknown as { imageFileIds?: string[] })?.imageFileIds || [])
  ).filter(Boolean);

  const realImageUrls = rawImages.map((img) => fileApi.getFileUrl(img)).filter(Boolean);
  const hasRealPhoto = realImageUrls.length > 0 && !imgError;
  const currentPhoto = hasRealPhoto
    ? realImageUrls[activePhotoIdx] || realImageUrls[0]
    : CATEGORY_FALLBACK_IMAGES[request.category] || CATEGORY_FALLBACK_IMAGES.OTHER;

  const categoryKey = `cat_${request.category}` as keyof typeof translations.km;
  const categoryLabel = translations[language]?.[categoryKey] || request.category;

  const formattedDate = formatKhmerDate(request.createdAt);

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

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 sm:top-18 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-500 overflow-hidden">
            <Link
              href="/services"
              className="inline-flex items-center space-x-1.5 text-blue-600 hover:text-blue-800 font-bold transition shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === "km" ? "ត្រឡប់ទៅសេវាកម្ម" : "Back to Services"}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 truncate font-bold">{request.title}</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold shadow-2xs transition"
              title="Copy share link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{language === "km" ? "បានចម្លង!" : "Copied!"}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{language === "km" ? "ចែករំលែក" : "Share"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Problem Details & Photo Gallery */}
          <div className="lg:col-span-8 space-y-6">
            {/* Success notification if quote was submitted */}
            {bidSuccess && (
              <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-start space-x-3.5 shadow-sm animate-in fade-in duration-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-900">
                    {language === "km" ? "សំណើតម្លៃរបស់អ្នកត្រូវបានផ្ញើជោគជ័យ!" : "Quote Submitted Successfully!"}
                  </h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    {language === "km"
                      ? "អតិថិជននឹងទទួលបានការជូនដំណឹងពីតម្លៃ និងសាររបស់អ្នក។ លោកអ្នកអាចពិនិត្យតាមដានការឆ្លើយតបបានគ្រប់ពេល។"
                      : "The customer has received your quote and message. You will be notified once they respond."}
                  </p>
                </div>
              </div>
            )}

            {/* Photo Gallery Card (Clean & Modern) */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              {/* Main Large Display Photo */}
              <div
                onClick={() => hasRealPhoto && setLightboxOpen(true)}
                className={`relative aspect-16/10 sm:aspect-16/9 w-full bg-slate-950 group ${
                  hasRealPhoto ? "cursor-pointer" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPhoto}
                  alt={request.title}
                  onError={() => {
                    if (hasRealPhoto) setImgError(true);
                  }}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-blue-700 text-white text-xs font-bold shadow-md">
                    {categoryLabel}
                  </span>
                  {request.urgent && (
                    <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-md flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{language === "km" ? "បន្ទាន់" : "Urgent"}</span>
                    </span>
                  )}
                </div>

                {/* Real Photo indicator */}
                {hasRealPhoto && (
                  <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 text-white text-xs font-bold backdrop-blur-xs shadow-md">
                    <Camera className="w-4 h-4" />
                    <span>
                      {language === "km"
                        ? `រូបថតជាក់ស្តែងពីអតិថិជន (${realImageUrls.length} រូប)`
                        : `Real Customer Photos (${realImageUrls.length})`}
                    </span>
                  </div>
                )}

                {/* Click to expand hint */}
                {hasRealPhoto && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/70 text-white text-xs font-semibold backdrop-blur-xs flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{language === "km" ? "ចុចពង្រីក" : "Click to view"}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails row if multiple photos exist */}
              {hasRealPhoto && realImageUrls.length > 1 && (
                <div className="flex items-center space-x-3 p-4 bg-slate-50 border-t border-slate-100 overflow-x-auto">
                  {realImageUrls.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActivePhotoIdx(i)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        activePhotoIdx === i
                          ? "border-blue-600 ring-2 ring-blue-500/20 shadow-xs"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Problem Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              {/* Title & Metadata Header */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {request.title}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm font-semibold text-slate-500">
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{language === "km" ? formattedDate.km : formattedDate.en}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {request.district ? `${request.district}, ` : ""}
                      {request.city || "Phnom Penh"}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-600">
                    <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{budgetText}</span>
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {language === "km" ? "ការពិពណ៌នាអំពីបញ្ហា" : "Problem Description"}
                </h3>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {request.description ||
                      (language === "km"
                        ? "ត្រូវការជាងជំនាញមកពិនិត្យ និងជួសជុលបញ្ហាខាងលើឲ្យបានឆាប់រហ័ស។"
                        : "Requires a certified technician to inspect and resolve this problem.")}
                  </p>
                </div>
              </div>

              {/* Status and Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    {language === "km" ? "ស្ថានភាពការងារ" : "Job Status"}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-blue-950">
                    {request.status === "OPEN"
                      ? language === "km"
                        ? "កំពុងបើកទទួលជាង"
                        : "Open for Offers"
                      : request.status}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {language === "km" ? "ការដាក់តម្លៃទទួលបាន" : "Offers Received"}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {request.offerCount || 0} {language === "km" ? "សំណើ" : "offers"}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">
                    {language === "km" ? "ការធានាគុណភាព" : "Quality Guarantee"}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-emerald-800 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% Verified</span>
                  </p>
                </div>
              </div>

              {/* Direct Quote / Bid Form for Providers (right on this page!) */}
              {isAuthenticated && isProvider ? (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  {!showBidForm ? (
                    <button
                      type="button"
                      onClick={() => setShowBidForm(true)}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{language === "km" ? "ដាក់សំណើតម្លៃរបស់អ្នក (Submit Quote)" : "Submit Your Quote"}</span>
                    </button>
                  ) : (
                    <form
                      onSubmit={handleSubmitBid}
                      className="p-5 sm:p-6 bg-blue-50/70 border border-blue-200 rounded-3xl space-y-4 animate-in fade-in duration-150"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-blue-200/60">
                        <div className="flex items-center space-x-2">
                          <Wrench className="w-4 h-4 text-blue-700" />
                          <h4 className="text-sm font-bold text-blue-950 uppercase tracking-wide">
                            {language === "km" ? "ទម្រង់ដាក់សំណើតម្លៃ" : "Technician Quote Form"}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowBidForm(false)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                        >
                          {language === "km" ? "បិទ" : "Close"}
                        </button>
                      </div>

                      {bidError && (
                        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
                          {bidError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            {language === "km" ? "តម្លៃផ្តល់ជូន ($) *" : "Proposed Price ($) *"}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-sm text-slate-400 font-bold">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="1"
                              required
                              value={proposedPrice}
                              onChange={(e) => setProposedPrice(e.target.value)}
                              placeholder="25.00"
                              className="w-full pl-8 pr-3.5 py-2.5 text-sm bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            {language === "km" ? "រយៈពេលរំពឹងទុក" : "Estimated Completion Time"}
                          </label>
                          <input
                            type="text"
                            value={estimatedTime}
                            onChange={(e) => setEstimatedTime(e.target.value)}
                            placeholder={language === "km" ? "ឧ. ២ ម៉ោង ឬ ១ ថ្ងៃ" : "e.g. 2 hours or 1 day"}
                            className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {language === "km" ? "សារជូនអតិថិជន *" : "Message to Customer *"}
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={
                            language === "km"
                              ? "ជម្រាបសួរ! ខ្ញុំជាជាងជំនាញ... ខ្ញុំអាចមកពិនិត្យ និងដោះស្រាយបញ្ហានេះបានយ៉ាងរហ័ស..."
                              : "Hello! I am an experienced technician and can resolve this issue quickly..."
                          }
                          className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowBidForm(false)}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                        >
                          {language === "km" ? "បោះបង់" : "Cancel"}
                        </button>
                        <button
                          type="submit"
                          disabled={submittingBid}
                          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition flex items-center space-x-2 disabled:opacity-50"
                        >
                          {submittingBid ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>{language === "km" ? "កំពុងផ្ញើ..." : "Submitting..."}</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>{language === "km" ? "បញ្ជូនសំណើតម្លៃឥឡូវនេះ" : "Submit Quote Now"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : !isAuthenticated ? (
                <div className="pt-4 border-t border-slate-100">
                  <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-blue-950">
                        {language === "km" ? "តើអ្នកជាជាងជំនាញមែនទេ?" : "Are you a skilled technician?"}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {language === "km"
                          ? "ចូលគណនី ឬចុះឈ្មោះដើម្បីផ្តល់តម្លៃ និងទទួលការងារនេះភ្លាមៗ។"
                          : "Log in or register as a provider to submit your quote and get hired."}
                      </p>
                    </div>
                    <Link
                      href={`/login?redirect=/services/${request.id}`}
                      className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition whitespace-nowrap"
                    >
                      {language === "km" ? "ចូលគណនីដើម្បីដាក់តម្លៃ" : "Login to Submit Offer"}
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Column: Customer info, Platform Guarantees & Support */}
          <div className="lg:col-span-4 space-y-6">
            {/* Platform Guarantee Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === "km" ? "ការធានាសុវត្ថិភាព ១០០%" : "100% Platform Guarantee"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === "km" ? "ថ្នាលសេវាកម្មកម្ពុជា" : "Khmer Service Marketplace"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {language === "km"
                      ? "ជាងជំនាញទាំងអស់ត្រូវបានផ្ទៀងផ្ទាត់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ (National ID)។"
                      : "All technicians are verified with National ID and skill assessments."}
                  </span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {language === "km"
                      ? "តម្លៃមានតម្លាភាព គ្មានការបូកតម្លៃលាក់បាំង។"
                      : "Transparent pricing without hidden or unexpected fees."}
                  </span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {language === "km"
                      ? "មានការធានាជួសជុលឡើងវិញដោយឥតគិតថ្លៃប្រសិនបើមិនពេញចិត្ត។"
                      : "Warranty re-service available if the work does not meet quality standards."}
                  </span>
                </div>
              </div>
            </div>

            {/* How It Works Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                {language === "km" ? "របៀបដំណើរការ" : "How It Works"}
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-800 block mb-0.5">
                      {language === "km" ? "ពិនិត្យបញ្ហាជាក់ស្តែង" : "Review Problem"}
                    </strong>
                    <span>
                      {language === "km"
                        ? "មើលរូបថត និងព័ត៌មានលម្អិតដែលអតិថិជនបានបង្ហោះ។"
                        : "Inspect photos and issue description provided by customer."}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-800 block mb-0.5">
                      {language === "km" ? "ដាក់សំណើតម្លៃ" : "Submit Quote"}
                    </strong>
                    <span>
                      {language === "km"
                        ? "ជាងជំនាញផ្ញើតម្លៃ និងពេលវេលាដែលខ្លួនអាចមកជួសជុលបាន។"
                        : "Providers submit proposed price and estimated arrival time."}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-800 block mb-0.5">
                      {language === "km" ? "អតិថិជនជ្រើសរើស" : "Customer Selects"}
                    </strong>
                    <span>
                      {language === "km"
                        ? "អតិថិជនជ្រើសរើសជាងដែលពេញចិត្ត និងចាប់ផ្តើមការងារ។"
                        : "Customer accepts the best offer to proceed with service."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support and Assistance Card */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-6 text-white space-y-3 shadow-md">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <h4 className="text-sm font-bold text-white">
                  {language === "km" ? "ត្រូវការជំនួយបន្ទាន់?" : "Need Immediate Help?"}
                </h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                {language === "km"
                  ? "ក្រុមការងារបច្ចេកទេសប្រចាំថ្នាលសេវាខ្មែរ រង់ចាំឆ្លើយតប និងជួយសម្របសម្រួលលោកអ្នក ២៤/៧។"
                  : "Our support team is available 24/7 to assist customers and technicians."}
              </p>
              <div className="pt-2 flex items-center space-x-2">
                <Link
                  href="/about"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition border border-white/20"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{language === "km" ? "ទាក់ទងមកយើង" : "Contact Us"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Lightbox Popup */}
      {hasRealPhoto && (
        <PhotoLightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={realImageUrls}
          initialIndex={activePhotoIdx}
          title={request.title}
          subtitle={request.district ? `${request.district}, ${request.city || "Phnom Penh"}` : request.city}
          badge={categoryLabel}
          isRealPhoto={true}
        />
      )}
    </div>
  );
}
