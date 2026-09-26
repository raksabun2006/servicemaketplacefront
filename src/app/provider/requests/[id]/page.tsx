"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { offerApi } from "@/lib/api/offer.api";
import { fileApi } from "@/lib/api/file.api";
import { ServiceRequestResponse } from "@/types/service-request";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  AlertTriangle,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Check,
  Eye,
  ExternalLink,
  XCircle,
} from "lucide-react";

export default function ProviderRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const { t } = useLanguage();

  const [request, setRequest] = useState<ServiceRequestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Offer form fields
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [proposedPrice, setProposedPrice] = useState("");
  const [message, setMessage] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);

  const fetchRequest = useCallback(async () => {
    if (!params.id) return;
    try {
      setIsLoading(true);
      const data = await serviceRequestApi.getById(params.id);
      setRequest(data);
    } catch {
      setError("មិនអាចទាញយកព័ត៌មានសំណើសេវាកម្មបានទេ។");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !proposedPrice || !message.trim()) return;

    try {
      setSubmittingOffer(true);
      setError(null);
      await offerApi.submitOffer(request.id, {
        proposedPrice: parseFloat(proposedPrice),
        message: message.trim(),
        estimatedCompletionTime: estimatedTime.trim() || undefined,
      });

      setSuccessMsg("សំណើតម្លៃរបស់អ្នកត្រូវបានផ្ញើជូនអតិថិជនរួចរាល់!");
      setShowOfferModal(false);
      setProposedPrice("");
      setMessage("");
      setEstimatedTime("");
      fetchRequest();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "មិនអាចផ្ញើសំណើតម្លៃបានទេ។");
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleStartRequest = async () => {
    if (!request) return;
    try {
      await serviceRequestApi.start(request.id);
      setSuccessMsg("ការងារត្រូវបានចាប់ផ្តើម!");
      fetchRequest();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "មិនអាចចាប់ផ្តើមការងារបានទេ។");
    }
  };

  const handleCompleteRequest = async () => {
    if (!request) return;
    try {
      await serviceRequestApi.complete(request.id);
      setSuccessMsg("ការងារត្រូវបានបញ្ចប់ដោយជោគជ័យ!");
      fetchRequest();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "មិនអាចបញ្ចប់ការងារបានទេ។");
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["PROVIDER", "ADMIN"]}>
        <div className="flex w-full min-w-0">
          <Sidebar />
          <div className="flex-1 min-w-0 min-h-[60vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500">{t("loading")}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!request) {
    return (
      <ProtectedRoute allowedRoles={["PROVIDER", "ADMIN"]}>
        <div className="flex w-full min-w-0">
          <Sidebar />
          <div className="flex-1 min-w-0 max-w-4xl mx-auto px-4 py-12">
            <EmptyState
              title="រកមិនឃើញសំណើសេវាកម្មទេ"
              subtitle="សំណើសេវាកម្មនេះប្រហែលជាត្រូវបានលុប ឬ បិទបញ្ចប់រួចហើយ។"
              actionLabel="ត្រឡប់ទៅការងារនៅជិតខ្ញុំ"
              actionHref="/provider/requests"
            />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const categoryKey = `cat_${request.category}` as keyof typeof translations.km;
  const categoryLabel = t(categoryKey) || request.category;
  const isOpen = request.status === "OPEN";

  return (
    <ProtectedRoute allowedRoles={["PROVIDER", "ADMIN"]}>
      <div className="flex w-full min-w-0">
        <Sidebar />

        <div className="flex-1 min-w-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
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

          {/* Main Request Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700">
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

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {request.title}
                </h1>
                <p className="text-[11px] text-slate-400">
                  បានបង្ហោះនៅ៖ {new Date(request.createdAt).toLocaleString("km-KH")}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {isOpen && (
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(true)}
                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>ខ្ញុំអាចជួយការងារនេះ</span>
                  </button>
                )}

                {request.status === "ACCEPTED" && (
                  <button
                    type="button"
                    onClick={handleStartRequest}
                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{t("start")}</span>
                  </button>
                )}

                {request.status === "IN_PROGRESS" && (
                  <button
                    type="button"
                    onClick={handleCompleteRequest}
                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t("complete")}</span>
                  </button>
                )}
              </div>
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
                      រូបភាពបញ្ហា ({rawPhotos.length})
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
                            alt="Problem photo"
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

            {/* Meta Grid */}
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
                    {request.district || request.city || "រាជធានីភ្នំពេញ"}
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

          {/* Submit Offer Modal */}
          {showOfferModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">ខ្ញុំអាចជួយការងារនេះ</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ផ្ញើតម្លៃដែលអ្នកអាចធ្វើ និងសារបញ្ជាក់ទៅកាន់អតិថិជន
                  </p>
                </div>

                <form onSubmit={handleSubmitOffer} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      តម្លៃដែលស្នើ ($) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min="0.01"
                        required
                        value={proposedPrice}
                        onChange={(e) => setProposedPrice(e.target.value)}
                        placeholder="ឧ. 35"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                      />
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ពេលវេលាប៉ាន់ស្មាន (ស្រេចចិត្ត)
                    </label>
                    <input
                      type="text"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      placeholder="ឧ. 2 ម៉ោង ឬ ថ្ងៃស្អែកព្រឹក"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      សារទៅកាន់អតិថិជន *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="ជម្រាបសួរ ខ្ញុំអាចជួយដោះស្រាយបញ្ហានេះបានយ៉ាងឆាប់រហ័ស..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      type="submit"
                      disabled={submittingOffer}
                      className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                    >
                      {submittingOffer && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{t("send")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOfferModal(false)}
                      disabled={submittingOffer}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
              <span className="text-xs font-medium">រូបភាពបញ្ហា</span>
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
