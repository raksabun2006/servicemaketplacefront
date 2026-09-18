"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { offerApi } from "@/lib/api/offer.api";
import { fileApi } from "@/lib/api/file.api";
import { ServiceRequestResponse } from "@/types/service-request";
import { ServiceRequestOfferResponse } from "@/types/offer";
import { StatusBadge } from "@/components/ui/Badge";
import { OfferCard } from "@/components/offers/OfferCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  AlertTriangle,
  MessageSquare,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Eye,
  ExternalLink,
} from "lucide-react";

export default function CustomerRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isProvider } = useAuth();
  const { t } = useLanguage();

  const [request, setRequest] = useState<ServiceRequestResponse | null>(null);
  const [offers, setOffers] = useState<ServiceRequestOfferResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!params.id) return;
    try {
      setIsLoading(true);
      const [reqData, offersData] = await Promise.all([
        serviceRequestApi.getById(params.id),
        offerApi.getRequestOffers(params.id, 0, 50).catch(() => ({ content: [] })),
      ]);
      setRequest(reqData);
      setOffers(offersData.content || []);
    } catch {
      setError("មិនអាចទាញយកព័ត៌មានសំណើសេវាកម្មបានទេ។");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // If logged in as provider and this request was posted by a customer, route to provider view to submit an offer
  useEffect(() => {
    if (request && isProvider && request.customerId !== user?.id) {
      router.replace(`/provider/requests/${params.id}`);
    }
  }, [request, isProvider, user?.id, params.id, router]);

  const handleAcceptOffer = async (offerId: string) => {
    if (!request) return;
    try {
      await offerApi.acceptOffer(request.id, offerId);
      setSuccessMsg("បានទទួលយកសំណើតម្លៃដោយជោគជ័យ! ការកក់សេវាកម្មត្រូវបានបង្កើត។");
      fetchData();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "មិនអាចទទួលយកសំណើតម្លៃបានទេ។");
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    if (!request) return;
    try {
      await offerApi.rejectOffer(request.id, offerId);
      setSuccessMsg("បានបដិសេធសំណើតម្លៃ។");
      fetchData();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "មិនអាចបដិសេធសំណើតម្លៃបានទេ។");
    }
  };

  const handleConfirmCancel = async () => {
    if (!request || !cancelReason.trim()) return;
    try {
      await serviceRequestApi.cancel(request.id, cancelReason);
      setShowCancelDialog(false);
      setSuccessMsg("សំណើសេវាកម្មត្រូវបានបោះបង់។");
      fetchData();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "មិនអាចបោះបង់សំណើបានទេ។");
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["CUSTOMER", "PROVIDER"]}>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500">{t("loading")}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!request) {
    return (
      <ProtectedRoute allowedRoles={["CUSTOMER", "PROVIDER"]}>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 max-w-4xl mx-auto px-4 py-12">
            <EmptyState
              title="រកមិនឃើញសំណើសេវាកម្មទេ"
              subtitle="សំណើសេវាកម្មនេះប្រហែលជាត្រូវបានលុប ឬ មិនមានក្នុងគណនីរបស់អ្នក។"
              actionLabel="ត្រឡប់ទៅសំណើរបស់ខ្ញុំ"
              actionHref="/customer/requests"
            />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const categoryKey = `cat_${request.category}` as keyof typeof translations.km;
  const categoryLabel = t(categoryKey) || request.category;
  const canCancel = request.status === "OPEN" || request.status === "ACCEPTED";

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER", "PROVIDER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Notifications / Alerts */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Request Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                    {categoryLabel}
                  </span>
                  <StatusBadge status={request.status} />
                  {request.urgent && (
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t("urgent")}</span>
                    </span>
                  )}
                </div>
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">បញ្ហារបស់អ្នក</span>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                    {request.title}
                  </h1>
                </div>
                <p className="text-[11px] text-slate-400">
                  បានបង្ហោះនៅ៖ {new Date(request.createdAt).toLocaleString("km-KH")}
                </p>
              </div>

              {canCancel && (
                <button
                  type="button"
                  onClick={() => setShowCancelDialog(true)}
                  className="inline-flex items-center space-x-1 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition self-start"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{t("cancel")} សំណើ</span>
                </button>
              )}
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold text-slate-700">ពិពណ៌នាបញ្ហា</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {request.description}
              </p>
            </div>

            {/* Photos */}
            {(() => {
              const rawPhotos = (
                request.imageUrls && request.imageUrls.length > 0
                  ? request.imageUrls
                  : ((request as unknown as { imageFileIds?: string[] }).imageFileIds || [])
              ).filter(Boolean);

              if (rawPhotos.length === 0) return null;

              return (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700">
                      រូបភាពភ្ជាប់មកជាមួយ ({rawPhotos.length})
                    </h3>
                    <span className="text-[11px] text-slate-400">ចុចលើរូបដើម្បីពង្រីក</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {rawPhotos.map((item, idx) => {
                      const imgUrl = fileApi.getFileUrl(item);
                      return (
                        <div
                          key={idx}
                          onClick={() => setPreviewImage(imgUrl)}
                          className="group relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden shadow-xs cursor-pointer bg-slate-100 hover:ring-2 hover:ring-indigo-500 transition"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt="Request attachment"
                            className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = "none";
                              const fallback = e.currentTarget.parentElement?.querySelector(".img-fallback");
                              if (fallback) (fallback as HTMLElement).style.display = "flex";
                            }}
                          />
                          <div className="img-fallback hidden w-full h-full flex-col items-center justify-center bg-slate-50 text-slate-400 text-[10px] text-center p-1">
                            <span className="font-semibold">រូបភាព</span>
                          </div>
                          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                            <Eye className="w-5 h-5 drop-shadow-sm" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">{t("budget")}</span>
                <p className="font-bold text-emerald-600 flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>
                    {request.budgetMin && request.budgetMax
                      ? `$${request.budgetMin} - $${request.budgetMax}`
                      : request.budgetMin
                      ? `ចាប់ពី $${request.budgetMin}`
                      : request.budgetMax
                      ? `រហូតដល់ $${request.budgetMax}`
                      : "ចរចា"}
                  </span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">{t("address")}</span>
                <p className="font-bold text-slate-800 flex items-center space-x-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {request.address || request.district || request.city}
                  </span>
                </p>
              </div>

              {request.preferredDate && (
                <div className="space-y-1">
                  <span className="text-slate-400 text-[11px]">{t("date")}</span>
                  <p className="font-bold text-slate-800 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{request.preferredDate}</span>
                  </p>
                </div>
              )}

              {request.preferredTime && (
                <div className="space-y-1">
                  <span className="text-slate-400 text-[11px]">{t("time")}</span>
                  <p className="font-bold text-slate-800 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{request.preferredTime}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cancel Request Dialog */}
          {showCancelDialog && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-rose-800">
                តើអ្នកប្រាកដជាចង់បោះបង់សំណើសេវាកម្មនេះមែនទេ?
              </h4>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="សូមបញ្ជាក់មូលហេតុនៃការបោះបង់..."
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleConfirmCancel}
                  disabled={!cancelReason.trim()}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg"
                >
                  បោះបង់សំណើ
                </button>
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="px-4 py-1.5 bg-white text-slate-700 text-xs rounded-lg border border-slate-200"
                >
                  ទុកនៅដដែល
                </button>
              </div>
            </div>
          )}

          {/* Offers List Section (Section 13) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  អ្នកជំនាញដែលអាចជួយបាន ({offers.length})
                </h2>
                <p className="text-xs text-slate-500">
                  ប្រៀបធៀបតម្លៃ និងជ្រើសរើសអ្នកជំនាញដែលស័ក្តិសមបំផុតសម្រាប់អ្នក
                </p>
              </div>
            </div>

            {offers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((off) => (
                  <OfferCard
                    key={off.id}
                    offer={off}
                    isOwner={true}
                    onAccept={handleAcceptOffer}
                    onReject={handleRejectOffer}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">មិនទាន់មានសំណើតម្លៃនៅឡើយទេ</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  សំណើរបស់អ្នកកំពុងត្រូវបានផ្សព្វផ្សាយដល់ជាងនៅជិតអ្នក។ សូមរង់ចាំការឆ្លើយតប។
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-3 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 px-1 text-white/80">
              <span className="text-xs font-medium">រូបភាពភ្ជាប់មកជាមួយសំណើ</span>
              <div className="flex items-center space-x-2">
                <a
                  href={previewImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 transition inline-flex items-center space-x-1 text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>បើកទំហំពេញ</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="p-1 hover:bg-white/20 rounded-lg text-white/90 transition"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative max-h-[80vh] flex items-center justify-center overflow-auto rounded-xl bg-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="Enlarged preview"
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
