"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertTriangle,
  Camera,
  CheckCircle2,
  Wrench,
  Send,
  Loader2,
  ShieldCheck,
  Clock,
  User,
  Share2,
  Check,
  FileText,
  Briefcase,
  Lock,
  ChevronRight,
  Maximize2,
  Sparkles,
} from "lucide-react";

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

interface ServiceDetailClientProps {
  id: string;
}

export function ServiceDetailClient({ id }: ServiceDetailClientProps) {
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
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await serviceRequestApi.getById(id);
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
  }, [id, language]);

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
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">
          {language === "km" ? "កំពុងទាញយកព័ត៌មាន..." : "Loading details..."}
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

  const rawImages = (
    request.imageUrls && request.imageUrls.length > 0
      ? request.imageUrls
      : ((request as unknown as { imageFileIds?: string[] })?.imageFileIds || [])
  ).filter(Boolean);

  const realImageUrls = rawImages.map((img) => fileApi.getFileUrl(img)).filter(Boolean);
  const hasRealPhoto = realImageUrls.length > 0 && !imgError;
  const currentPhoto = hasRealPhoto
    ? realImageUrls[activePhotoIdx] || realImageUrls[0]
    : null;

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

  const isOwner = user?.id === request.customerId;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 space-y-4">
        {/* Clean Inline Breadcrumb & Share Actions */}
        <div className="flex items-center justify-between gap-4 text-xs font-medium text-slate-500 pb-1">
          <div className="flex items-center space-x-1.5 overflow-hidden min-w-0">
            <Link
              href="/services"
              className="inline-flex items-center space-x-1 text-slate-600 hover:text-blue-600 font-semibold transition shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === "km" ? "សេវាកម្ម" : "Services"}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 shrink-0">{categoryLabel}</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-slate-800 font-semibold truncate hidden sm:inline">{request.title}</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-white bg-slate-100/80 text-slate-600 text-xs font-semibold transition cursor-pointer"
              title="Copy share link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{language === "km" ? "បានចម្លង!" : "Copied!"}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === "km" ? "ចែករំលែក" : "Share"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-1">
          {/* Left Column: Natural Header, Elegant Image Container & Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header: Title, Badges, Meta (Integrated naturally, not in a floating cage) */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold">
                  {categoryLabel}
                </span>

                {request.urgent && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{language === "km" ? "ការងារបន្ទាន់" : "Urgent"}</span>
                  </span>
                )}

                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {request.status === "OPEN"
                      ? language === "km"
                        ? "កំពុងបើកទទួលសំណើ"
                        : "Open for Offers"
                      : request.status}
                  </span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-snug tracking-tight">
                {request.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs sm:text-sm font-semibold text-slate-500 pt-1">
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{language === "km" ? formattedDate.km : formattedDate.en}</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>
                    {request.district ? `${request.district}, ` : ""}
                    {request.city || "Phnom Penh"}
                  </span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    {request.offerCount || 0} {language === "km" ? "សំណើបានទទួល" : "offers received"}
                  </span>
                </div>
              </div>
            </div>

            {bidSuccess && (
              <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3.5 shadow-sm animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
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

            {/* Media Gallery: Clean, Soft Canvas (No harsh black voids or awkward letterboxing) */}
            {hasRealPhoto && currentPhoto ? (
              <div className="space-y-3">
                <div
                  onClick={() => setLightboxOpen(true)}
                  className="relative h-[300px] sm:h-[380px] md:h-[440px] w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center group cursor-pointer overflow-hidden shadow-2xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentPhoto}
                    alt={request.title}
                    onError={() => {
                      setImgError(true);
                    }}
                    className="max-h-full max-w-full object-contain p-2 rounded-xl group-hover:scale-[1.01] transition-transform duration-300 drop-shadow-sm"
                  />

                  {/* Top Counter Badge */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-700 text-xs font-bold border border-slate-200/80 shadow-xs">
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {activePhotoIdx + 1} / {realImageUrls.length}
                    </span>
                  </div>

                  {/* Zoom Action Pill */}
                  <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/75 hover:bg-slate-900/90 text-white text-xs font-semibold backdrop-blur-md transition shadow-sm">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{language === "km" ? "ពង្រីកមើលរូបពេញ" : "View Fullscreen"}</span>
                  </div>
                </div>

                {/* Thumbnails row */}
                {realImageUrls.length > 1 && (
                  <div className="flex items-center space-x-2.5 overflow-x-auto pb-1">
                    {realImageUrls.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActivePhotoIdx(i)}
                        className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-slate-50 shrink-0 transition cursor-pointer p-0.5 ${
                          activePhotoIdx === i
                            ? "border-blue-600 ring-2 ring-blue-500/25 shadow-xs"
                            : "border-slate-200 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Problem Description Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 pb-3 border-b border-slate-100">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold">
                  {language === "km" ? "ព័ត៌មានលម្អិតអំពីបញ្ហា" : "Problem Description"}
                </h3>
              </div>

              <div className="text-slate-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base font-normal">
                {request.description ||
                  (language === "km"
                    ? "ត្រូវការជាងជំនាញមកពិនិត្យ និងជួសជុលបញ្ហាខាងលើឲ្យបានឆាប់រហ័ស។"
                    : "Requires a certified technician to inspect and resolve this problem.")}
              </div>
            </div>

            {/* Service Logistics & Specifics */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 pb-3 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-rose-500" />
                <h3 className="text-base font-bold">
                  {language === "km" ? "ទីតាំង និងកាលវិភាគការងារ" : "Location & Schedule"}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-xs font-semibold text-slate-400 block">
                    {language === "km" ? "ទីតាំងជាក់លាក់" : "Specific Location"}
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {request.address || (request.district ? `${request.district}, ${request.city}` : "រាជធានីភ្នំពេញ")}
                  </p>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-xs font-semibold text-slate-400 block">
                    {language === "km" ? "ពេលវេលាត្រូវការ" : "Preferred Schedule"}
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {request.preferredDate
                      ? `${request.preferredDate} ${request.preferredTime ? `(${request.preferredTime})` : ""}`
                      : language === "km"
                      ? "ឆាប់ៗតាមដែលអាច (Flexible)"
                      : "As soon as possible (Flexible)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Unified Sticky Booking Sidebar (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
              {/* Budget Display */}
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === "km" ? "ថវិការំពឹងទុក" : "Estimated Budget"}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {budgetText}
                </div>
                <p className="text-xs text-slate-500">
                  {hasMin || hasMax
                    ? language === "km"
                      ? "ថវិកាកំណត់ដោយអតិថិជន"
                      : "Customer specified budget range"
                    : language === "km"
                    ? "អាចចរចាតម្លៃផ្ទាល់ជាមួយអតិថិជន"
                    : "Open for direct negotiation"}
                </p>
              </div>

              {/* Action Buttons based on User Role */}
              {isOwner ? (
                <div className="space-y-3">
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-amber-900 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === "km" ? "នេះជាសំណើរបស់អ្នក" : "Your Request"}</span>
                    </p>
                    <p className="text-amber-800 leading-relaxed">
                      {language === "km"
                        ? "លោកអ្នកអាចពិនិត្យមើលសំណើតម្លៃដែលជាងបានដាក់មកក្នុងផ្ទាំងគ្រប់គ្រង។"
                        : "You can view and manage all quotes submitted by technicians."}
                    </p>
                  </div>
                  <Link
                    href="/customer/requests"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5 text-center"
                  >
                    <span>{language === "km" ? "គ្រប់គ្រងសំណើរបស់អ្នក" : "Manage Your Request"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : isAuthenticated && isProvider ? (
                <div className="space-y-3">
                  {!showBidForm ? (
                    <button
                      type="button"
                      onClick={() => setShowBidForm(true)}
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{language === "km" ? "ដាក់សំណើតម្លៃរបស់អ្នក" : "Submit Your Quote"}</span>
                    </button>
                  ) : (
                    <form
                      onSubmit={handleSubmitBid}
                      className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3 animate-in fade-in duration-150 text-xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
                        <div className="flex items-center space-x-1.5">
                          <Wrench className="w-3.5 h-3.5 text-blue-700" />
                          <h4 className="font-bold text-blue-950 uppercase tracking-wide">
                            {language === "km" ? "ទម្រង់ដាក់តម្លៃ" : "Technician Quote"}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowBidForm(false)}
                          className="font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          {language === "km" ? "បិទ" : "Close"}
                        </button>
                      </div>

                      {bidError && (
                        <div className="p-2.5 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium">
                          {bidError}
                        </div>
                      )}

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          {language === "km" ? "តម្លៃផ្តល់ជូន ($) *" : "Proposed Price ($) *"}
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2 text-slate-400 font-bold">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="1"
                            required
                            value={proposedPrice}
                            onChange={(e) => setProposedPrice(e.target.value)}
                            placeholder="25.00"
                            className="w-full pl-6 pr-3 py-1.5 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          {language === "km" ? "រយៈពេលរំពឹងទុក" : "Estimated Completion Time"}
                        </label>
                        <input
                          type="text"
                          value={estimatedTime}
                          onChange={(e) => setEstimatedTime(e.target.value)}
                          placeholder={language === "km" ? "ឧ. ២ ម៉ោង ឬ ១ ថ្ងៃ" : "e.g. 2 hours or 1 day"}
                          className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
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
                          className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowBidForm(false)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                        >
                          {language === "km" ? "បោះបង់" : "Cancel"}
                        </button>
                        <button
                          type="submit"
                          disabled={submittingBid}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          {submittingBid ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{language === "km" ? "កំពុងផ្ញើ..." : "Submitting..."}</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>{language === "km" ? "បញ្ជូន" : "Submit"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-2.5">
                  <Link
                    href={`/login?redirect=/services/${request.id}`}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 text-center"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{language === "km" ? "ចូលគណនីដើម្បីដាក់តម្លៃ" : "Login to Submit Quote"}</span>
                  </Link>
                  <p className="text-[11px] text-slate-400 text-center">
                    {language === "km"
                      ? "សម្រាប់ជាងជំនាញដែលចង់ទទួលការងារនេះ"
                      : "For certified technicians looking to take this job"}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-center space-y-0.5">
                  <p className="font-bold text-slate-800">
                    {language === "km" ? "គណនីអតិថិជន" : "Customer Account"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === "km"
                      ? "មានតែគណនីជាងជំនាញប៉ុណ្ណោះដែលអាចដាក់សំណើតម្លៃបាន។"
                      : "Only registered technician accounts can submit quotes."}
                  </p>
                </div>
              )}

              {/* Integrated Customer Info */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {language === "km" ? "ព័ត៌មានអតិថិជន" : "Posted By Customer"}
                </span>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {request.customerName ? request.customerName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {request.customerName || (language === "km" ? "អតិថិជន" : "Customer")}
                    </h4>
                    <div className="flex items-center space-x-1 text-emerald-600 text-[11px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{language === "km" ? "បានផ្ទៀងផ្ទាត់លេខទូរស័ព្ទ" : "Verified Customer"}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span>{language === "km" ? "ទីតាំង" : "Location"}:</span>
                    <span className="font-semibold text-slate-700">
                      {request.district ? `${request.district}, ` : ""}{request.city || "Phnom Penh"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === "km" ? "ការឆ្លើយតប" : "Response Rate"}:</span>
                    <span className="font-semibold text-emerald-600">
                      {language === "km" ? "លឿនរហ័ស (< ១ ម៉ោង)" : "Fast (< 1 hr)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Integrated Trust Guarantees */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">
                    {language === "km" ? "ការធានាសុវត្ថិភាព 100%" : "100% Platform Guarantee"}
                  </span>
                </div>
                <div className="flex items-start space-x-2 text-[11px] text-slate-500 leading-normal pl-6">
                  <span>
                    {language === "km"
                      ? "ជាងជំនាញត្រូវបានផ្ទៀងផ្ទាត់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ (National ID)។"
                      : "All technicians are verified with National ID."}
                  </span>
                </div>
                <div className="flex items-start space-x-2 text-[11px] text-slate-500 leading-normal pl-6">
                  <span>
                    {language === "km"
                      ? "តម្លៃមានតម្លាភាព គ្មានការបូកតម្លៃលាក់បាំង។"
                      : "Transparent pricing without hidden fees."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
