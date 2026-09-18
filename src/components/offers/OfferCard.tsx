"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ServiceRequestOfferResponse } from "@/types/offer";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { StatusBadge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { DollarSign, Clock, Check, X, Undo2, Loader2, Phone, MessageSquare } from "lucide-react";

interface OfferCardProps {
  offer: ServiceRequestOfferResponse;
  isOwner?: boolean; // Customer viewing the offer
  isMine?: boolean; // Provider viewing their own offer
  onAccept?: (offerId: string) => Promise<void>;
  onReject?: (offerId: string) => Promise<void>;
  onWithdraw?: (offerId: string) => Promise<void>;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  isOwner = false,
  isMine = false,
  onAccept,
  onReject,
  onWithdraw,
}) => {
  const { t } = useLanguage();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (action: "accept" | "reject" | "withdraw") => {
    try {
      setLoadingAction(action);
      if (action === "accept" && onAccept) await onAccept(offer.id);
      if (action === "reject" && onReject) await onReject(offer.id);
      if (action === "withdraw" && onWithdraw) await onWithdraw(offer.id);
    } finally {
      setLoadingAction(null);
    }
  };

  const isPending = offer.status === "PENDING";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header: Provider profile & Status */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            {offer.providerBusinessName || offer.providerFullName || "អ្នកផ្តល់សេវា"}
          </h4>
          {offer.providerAverageRating !== undefined && offer.providerAverageRating > 0 && (
            <div className="mt-1">
              <StarRating
                rating={offer.providerAverageRating}
                totalReviews={offer.providerTotalReviews}
                size="sm"
              />
            </div>
          )}
          {offer.providerPhone && (
            <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
              <Phone className="w-3 h-3" />
              <span>{offer.providerPhone}</span>
            </div>
          )}
        </div>
        <StatusBadge status={offer.status} />
      </div>

      {/* Offer Message */}
      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
        <p className="font-semibold text-[11px] text-slate-500 mb-1">សារទៅកាន់អតិថិជន៖</p>
        <p>{offer.message}</p>
      </div>

      {/* Meta: Proposed Price and Estimated Time */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
        <div className="flex items-center space-x-1.5 font-bold text-base text-emerald-600">
          <DollarSign className="w-4 h-4" />
          <span>
            ${Number.isInteger(offer.proposedPrice) ? offer.proposedPrice : offer.proposedPrice.toFixed(2)}
          </span>
        </div>

        {offer.estimatedCompletionTime && (
          <div className="flex items-center space-x-1 text-slate-500 text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>រយៈពេលប៉ាន់ស្មាន៖ {offer.estimatedCompletionTime}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isPending && isOwner && onAccept && onReject && (
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
          <Link
            href={`/customer/messages?providerId=${offer.providerId}`}
            className="inline-flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition shrink-0"
            title="ជជែកសួរព័ត៌មានជាមួយអ្នកផ្តល់សេវា"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ទាក់ទង</span>
          </Link>

          <button
            type="button"
            onClick={() => handleAction("accept")}
            disabled={!!loadingAction}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            {loadingAction === "accept" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>ជ្រើសរើសអ្នកផ្តល់សេវា</span>
          </button>


          <button
            type="button"
            onClick={() => handleAction("reject")}
            disabled={!!loadingAction}
            className="inline-flex items-center justify-center space-x-1 px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-medium rounded-xl transition shrink-0"
          >
            {loadingAction === "reject" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <X className="w-3.5 h-3.5" />
            )}
            <span>{t("reject")}</span>
          </button>
        </div>
      )}

      {isPending && isMine && onWithdraw && (
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleAction("withdraw")}
            disabled={!!loadingAction}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium rounded-xl transition"
          >
            {loadingAction === "withdraw" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Undo2 className="w-3.5 h-3.5" />
            )}
            <span>{t("withdraw")}</span>
          </button>
        </div>
      )}
    </div>
  );
};
