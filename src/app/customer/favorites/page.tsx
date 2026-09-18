"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { favoriteApi } from "@/lib/api/favorite.api";
import { fileApi } from "@/lib/api/file.api";
import { FavoriteProviderResponse } from "@/types/customer";
import { StarRating } from "@/components/ui/StarRating";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heart, MapPin, Trash2, ArrowRight } from "lucide-react";

export default function CustomerFavoritesPage() {
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<FavoriteProviderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await favoriteApi.getMyFavorites(0, 50);
      setFavorites(res.content || []);
    } catch {
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleUnfavorite = async (providerId: string) => {
    try {
      await favoriteApi.unfavorite(providerId);
      setFavorites((prev) => prev.filter((f) => f.providerId !== providerId));
    } catch {
      // ignore
    }
  };

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("favorites")}</h1>
            <p className="text-xs text-slate-500 mt-1">
              បញ្ជីអ្នកផ្តល់សេវាដែលអ្នកទុកចិត្ត និងបានរក្សាទុក
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <CardSkeleton key={n} />
              ))}
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favorites.map((fav, index) => {
                const name = fav.providerBusinessName || fav.providerFullName || "អ្នកផ្តល់សេវា";
                return (
                  <div
                    key={fav.id || fav.providerId || `favorite-provider-${index}`}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-base overflow-hidden">
                            {fav.providerAvatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={fileApi.getFileUrl(fav.providerAvatarUrl)}
                                alt={name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                  const fb = e.currentTarget.parentElement?.querySelector(".avatar-fallback");
                                  if (fb) (fb as HTMLElement).style.display = "flex";
                                }}
                              />
                            ) : null}
                            <span
                              className={`avatar-fallback ${fav.providerAvatarUrl ? "hidden" : "flex"} w-full h-full items-center justify-center`}
                            >
                              {name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{name}</h3>
                            <p className="text-xs text-slate-500 line-clamp-1">{fav.providerFullName}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUnfavorite(fav.providerId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="ដកចេញពីចំណូលចិត្ត"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        {fav.providerAverageRating !== undefined && (
                          <StarRating
                            rating={fav.providerAverageRating}
                            totalReviews={fav.providerTotalReviews}
                            size="sm"
                          />
                        )}

                        <div className="flex items-center space-x-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {fav.providerServiceArea || fav.providerCity || "រាជធានីភ្នំពេញ"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                      <Link
                        href={`/providers/${fav.providerId}`}
                        className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition"
                      >
                        <span>{t("viewDetails")}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title={t("noFavorites")}
              subtitle="ស្វែងរកអ្នកផ្តល់សេវាដែលមានការវាយតម្លៃល្អ និងចុចរូបបេះដូងដើម្បីរក្សាទុក។"
              icon={Heart}
              actionLabel="ស្វែងរកអ្នកផ្តល់សេវា"
              actionHref="/providers"
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
