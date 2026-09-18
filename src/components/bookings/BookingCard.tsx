"use client";

import React, { useState } from "react";
import { BookingResponse } from "@/types/booking";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { StatusBadge } from "@/components/ui/Badge";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface BookingCardProps {
  booking: BookingResponse;
  isProvider?: boolean;
  onAccept?: (id: string) => Promise<void>;
  onReject?: (id: string, reason: string) => Promise<void>;
  onStart?: (id: string) => Promise<void>;
  onComplete?: (id: string) => Promise<void>;
  onCancel?: (id: string, reason: string) => Promise<void>;
  onOpenReview?: (booking: BookingResponse) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isProvider = false,
  onAccept,
  onReject,
  onStart,
  onComplete,
  onCancel,
  onOpenReview,
}) => {
  const { t } = useLanguage();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleAction = async (action: string, fn?: () => Promise<void>) => {
    if (!fn) return;
    try {
      setLoadingAction(action);
      await fn();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) return;
    if (onReject) {
      await handleAction("reject", () => onReject(booking.id, rejectReason));
      setShowRejectModal(false);
      setRejectReason("");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition">
      {/* Header: Title & Status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {booking.serviceCategory || "សេវាកម្មទូទៅ"}
          </span>
          <h3 className="text-sm font-bold text-slate-900 mt-1">
            {booking.serviceTitle || "ការកក់សេវាកម្ម"}
          </h3>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Counterpart Info (Customer sees Provider; Provider sees Customer) */}
      <div className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <User className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-600">
          {isProvider ? "អតិថិជន៖" : "អ្នកផ្តល់សេវា៖"}
        </span>
        <span className="font-bold text-slate-900 truncate">
          {isProvider
            ? booking.customerName || "អតិថិជន"
            : booking.providerBusinessName || booking.providerFullName || "អ្នកផ្តល់សេវា"}
        </span>
        {(isProvider ? booking.customerPhone : booking.providerPhone) && (
          <span className="text-slate-500 font-medium">
            ({isProvider ? booking.customerPhone : booking.providerPhone})
          </span>
        )}
      </div>

      {/* Meta: Location, Date, Time, Price */}
      <div className="space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {booking.address} {booking.city ? `, ${booking.city}` : ""}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
          {(booking.scheduledDate || booking.scheduledAt) && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {booking.scheduledDate ||
                  new Date(booking.scheduledAt!).toLocaleDateString("km-KH")}
              </span>
            </div>
          )}

          {(booking.scheduledStartTime || booking.scheduledEndTime) && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {booking.scheduledStartTime} {booking.scheduledEndTime ? `- ${booking.scheduledEndTime}` : ""}
              </span>
            </div>
          )}

          {booking.price !== undefined && booking.price > 0 && (
            <div className="flex items-center space-x-1 font-bold text-emerald-600">
              <DollarSign className="w-3.5 h-3.5" />
              <span>${booking.price.toFixed(2)}</span>
            </div>
          )}
        </div>

        {booking.notes && (
          <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
            កំណត់សម្គាល់៖ {booking.notes}
          </p>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
          <div className="flex items-center space-x-1.5 text-rose-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>មូលហេតុនៃការបដិសេធ៖</span>
          </div>
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="បញ្ចូលមូលហេតុ..."
            className="w-full px-3 py-1.5 text-xs bg-white border border-rose-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim() || !!loadingAction}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg"
            >
              បញ្ជាក់បដិសេធ
            </button>
            <button
              onClick={() => setShowRejectModal(false)}
              className="px-3 py-1 bg-white text-slate-700 text-xs rounded-lg border border-slate-200"
            >
              បោះបង់
            </button>
          </div>
        </div>
      )}

      {/* Action Triggers */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* Provider actions for PENDING */}
        {isProvider && booking.status === "PENDING" && (
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onAccept && handleAction("accept", () => onAccept(booking.id))}
              disabled={!!loadingAction}
              className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              {loadingAction === "accept" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>{t("accept")}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRejectModal(true)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium rounded-xl transition"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{t("reject")}</span>
            </button>
          </div>
        )}

        {/* Provider action for ACCEPTED -> Start Job */}
        {isProvider && booking.status === "ACCEPTED" && onStart && (
          <button
            type="button"
            onClick={() => handleAction("start", () => onStart(booking.id))}
            disabled={!!loadingAction}
            className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            {loadingAction === "start" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <PlayCircle className="w-3.5 h-3.5" />
            )}
            <span>{t("start")}</span>
          </button>
        )}

        {/* Provider action for IN_PROGRESS -> Complete Job */}
        {isProvider && booking.status === "IN_PROGRESS" && onComplete && (
          <button
            type="button"
            onClick={() => handleAction("complete", () => onComplete(booking.id))}
            disabled={!!loadingAction}
            className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            {loadingAction === "complete" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>{t("complete")}</span>
          </button>
        )}

        {/* Customer action for COMPLETED -> Review */}
        {!isProvider && booking.status === "COMPLETED" && onOpenReview && (
          <button
            type="button"
            onClick={() => onOpenReview(booking)}
            className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>{t("reviewTitle")}</span>
          </button>
        )}

        {/* Cancel button if PENDING or ACCEPTED */}
        {(booking.status === "PENDING" || booking.status === "ACCEPTED") && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(booking.id, "អតិថិជនបានបោះបង់")}
            disabled={!!loadingAction}
            className="text-xs text-slate-500 hover:text-rose-600 transition font-medium"
          >
            {t("cancel")}
          </button>
        )}
      </div>
    </div>
  );
};
