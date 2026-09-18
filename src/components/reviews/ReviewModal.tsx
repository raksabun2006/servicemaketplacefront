"use client";

import React, { useState } from "react";
import { BookingResponse } from "@/types/booking";
import { reviewApi } from "@/lib/api/review.api";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { StarRating } from "@/components/ui/StarRating";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ReviewModalProps {
  booking: BookingResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("សូមជ្រើសរើសពិន្ទុពី ១ ដល់ ៥ ផ្កាយ។");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await reviewApi.submitReview(booking.id, {
        rating,
        comment: comment.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || t("genericError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t("reviewSuccess")}</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t("reviewTitle")}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {booking.providerBusinessName || booking.providerFullName || "អ្នកផ្តល់សេវា"} -{" "}
                {booking.serviceTitle}
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="text-center py-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <p className="text-xs font-semibold text-slate-700">{t("reviewSubtitle")}</p>
              <div className="flex justify-center">
                <StarRating
                  rating={rating}
                  editable
                  onChange={setRating}
                  size="lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t("reviewCommentLabel")}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="ចែករំលែកបទពិសោធន៍របស់អ្នកអំពីសេវាកម្មនេះ..."
                rows={4}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{t("submit")}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded-xl transition"
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
