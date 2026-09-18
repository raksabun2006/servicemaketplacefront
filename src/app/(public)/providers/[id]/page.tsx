"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { providerApi } from "@/lib/api/provider.api";
import { reviewApi } from "@/lib/api/review.api";
import { chatApi } from "@/lib/api/chat.api";
import { favoriteApi } from "@/lib/api/favorite.api";
import { fileApi } from "@/lib/api/file.api";
import { ProviderProfileResponse } from "@/types/provider";
import { ReviewResponse } from "@/types/review";
import { StarRating } from "@/components/ui/StarRating";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MapPin,
  CheckCircle2,
  Briefcase,
  MessageSquare,
  Heart,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  Phone,
} from "lucide-react";

export default function ProviderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();
  const { isAuthenticated, isCustomer } = useAuth();

  const [provider, setProvider] = useState<ProviderProfileResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    providerApi
      .getById(params.id)
      .then((data) => {
        setProvider(data);
      })
      .catch(() => setProvider(null))
      .finally(() => setIsLoading(false));

    reviewApi
      .getProviderReviews(params.id)
      .then((res) => setReviews(res.content || []))
      .catch(() => setReviews([]));

    if (isAuthenticated && isCustomer) {
      favoriteApi
        .isFavorite(params.id)
        .then((res) => setIsFavorited(res.favorited))
        .catch(() => {});
    }
  }, [params.id, isAuthenticated, isCustomer]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !isCustomer || !provider) {
      router.push("/login");
      return;
    }

    try {
      if (isFavorited) {
        await favoriteApi.unfavorite(provider.id);
        setIsFavorited(false);
      } else {
        await favoriteApi.favorite(provider.id);
        setIsFavorited(true);
      }
    } catch {
      // ignore
    }
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!provider) return;

    try {
      setIsStartingChat(true);
      let conv: { id?: string } | null = null;
      try {
        conv = await chatApi.createOrGetConversation({
          providerId: provider.id,
        });
      } catch (err1) {
        if (provider.userId && provider.userId !== provider.id) {
          conv = await chatApi.createOrGetConversation({
            providerId: provider.userId,
          });
        } else {
          throw err1;
        }
      }

      if (conv?.id) {
        router.push(`/customer/messages?conversationId=${conv.id}`);
      } else {
        router.push(`/customer/messages?providerId=${provider.id}&userId=${provider.userId}`);
      }
    } catch {
      router.push(`/customer/messages?providerId=${provider.id}&userId=${provider.userId}`);
    } finally {
      setIsStartingChat(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500">{t("loading")}</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          title="រកមិនឃើញព័ត៌មានអ្នកផ្តល់សេវាទេ"
          subtitle="អ្នកផ្តល់សេវានេះប្រហែលជាត្រូវបានលុប ឬ មិនមាននៅក្នុងប្រព័ន្ធ។"
          actionLabel="ត្រឡប់ទៅបញ្ជីអ្នកផ្តល់សេវា"
          actionHref="/providers"
        />
      </div>
    );
  }

  const displayName = provider.businessName || provider.fullName;
  const isVerified = provider.isVerified || provider.verificationStatus === "VERIFIED";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white font-bold text-3xl flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
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

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{displayName}</h1>
                {isVerified && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>បានផ្ទៀងផ្ទាត់</span>
                  </span>
                )}
              </div>

              {provider.fullName && provider.businessName && (
                <p className="text-xs text-slate-500">តំណាងដោយ៖ {provider.fullName}</p>
              )}

              <div className="flex items-center space-x-3 pt-1 text-xs">
                <StarRating
                  rating={provider.averageRating || 0}
                  totalReviews={provider.totalReviews}
                  size="md"
                />
                {provider.completedServices !== undefined && provider.completedServices > 0 && (
                  <span className="text-slate-500 font-medium">
                    • {provider.completedServices} {t("totalCompleted")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {provider.phone && (
              <a
                href={`tel:${provider.phone}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-xs transition active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" />
                <span>ហៅទូរស័ព្ទ {provider.phone}</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleStartChat}
              disabled={isStartingChat}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-xs transition active:scale-[0.98]"
            >
              {isStartingChat ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              <span>ផ្ញើសារ</span>
            </button>

            {isCustomer && (
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`p-2.5 rounded-2xl border transition ${
                  isFavorited
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
                title="Favorite"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? "fill-rose-500" : ""}`} />
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        {provider.bio && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 mb-1.5">អំពីសេវាកម្ម</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{provider.bio}</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          {provider.experienceYears !== undefined && (
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px]">បទពិសោធន៍</span>
              <p className="font-bold text-slate-800 flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                <span>{provider.experienceYears} ឆ្នាំ</span>
              </p>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-slate-400 text-[11px]">តំបន់ផ្តល់សេវា</span>
            <p className="font-bold text-slate-800 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span className="truncate">{provider.serviceArea || provider.city || "រាជធានីភ្នំពេញ"}</span>
            </p>
          </div>

          {provider.hourlyRate !== undefined && provider.hourlyRate > 0 && (
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px]">តម្លៃចាប់ផ្តើម</span>
              <p className="font-bold text-emerald-600 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>${provider.hourlyRate.toFixed(2)}/ម៉ោង</span>
              </p>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-slate-400 text-[11px]">{t("status")}</span>
            <div>
              {provider.availabilityStatus ? (
                <StatusBadge status={provider.availabilityStatus} />
              ) : (
                <span className="text-xs text-slate-500">ធម្មតា</span>
              )}
            </div>
          </div>
        </div>

        {/* Working hours & Days */}
        {(provider.workingHoursStart || provider.workingDays) && (
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            {provider.workingHoursStart && provider.workingHoursEnd && (
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  ម៉ោងធ្វើការ៖ {provider.workingHoursStart} - {provider.workingHoursEnd}
                </span>
              </div>
            )}
            {provider.workingDays && (
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>ថ្ងៃធ្វើការ៖ {provider.workingDays}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verified Customer Reviews */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            ការវាយតម្លៃពីអតិថិជន ({reviews.length})
          </h2>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      {rev.customerName?.charAt(0) || "C"}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.customerName || "អតិថិជន"}</h4>
                      <p className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString("km-KH")}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} size="sm" />
                </div>
                {rev.comment && <p className="text-xs text-slate-600 pl-10">{rev.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            មិនទាន់មានការវាយតម្លៃសម្រាប់អ្នកផ្តល់សេវានេះនៅឡើយទេ។
          </div>
        )}
      </div>
    </div>
  );
}
