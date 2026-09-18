"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { offerApi } from "@/lib/api/offer.api";
import { ServiceRequestOfferResponse } from "@/types/offer";
import { OfferCard } from "@/components/offers/OfferCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Clock } from "lucide-react";

export default function ProviderOffersPage() {
  const { t } = useLanguage();
  const [offers, setOffers] = useState<ServiceRequestOfferResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyOffers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await offerApi.getMyOffers(0, 50);
      setOffers(res.content || []);
    } catch {
      setOffers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyOffers();
  }, [fetchMyOffers]);

  const handleWithdrawOffer = async (offerId: string) => {
    try {
      await offerApi.withdrawOffer(offerId);
      fetchMyOffers();
    } catch {
      // ignore
    }
  };

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("offers")}</h1>
            <p className="text-xs text-slate-500 mt-1">
              បញ្ជីសំណើតម្លៃដែលអ្នកបានផ្ញើទៅកាន់អតិថិជន
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <CardSkeleton key={n} />
              ))}
            </div>
          ) : offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  isMine={true}
                  onWithdraw={handleWithdrawOffer}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="មិនទាន់មានសំណើតម្លៃនៅឡើយទេ"
              subtitle="ស្វែងរកការងារនៅជិតអ្នក និងផ្ញើសំណើតម្លៃដំបូងរបស់អ្នក!"
              icon={Clock}
              actionLabel={t("nearbyRequests")}
              actionHref="/provider/requests"
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
