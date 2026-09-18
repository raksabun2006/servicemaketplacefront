"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { ServiceCategory, ServiceRequestSummaryResponse } from "@/types/service-request";
import { ServiceRequestCard } from "@/components/service-requests/ServiceRequestCard";
import { LocationPicker, LocationData } from "@/components/ui/LocationPicker";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, AlertTriangle, Compass } from "lucide-react";

export default function ProviderRequestsPage() {
  const { t } = useLanguage();

  const [location, setLocation] = useState<Partial<LocationData>>({
    latitude: 11.5435,
    longitude: 104.8997,
    city: "Phnom Penh",
    district: "Meanchey",
  });
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [category, setCategory] = useState<ServiceCategory | "">("");
  const [urgentOnly, setUrgentOnly] = useState<boolean>(false);

  const [requests, setRequests] = useState<ServiceRequestSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNearbyRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      if (location.latitude && location.longitude) {
        const res = await serviceRequestApi.getNearby({
          latitude: location.latitude,
          longitude: location.longitude,
          radiusKm,
          category: category || undefined,
        });
        let list = res.content || [];
        if (urgentOnly) {
          list = list.filter((r) => r.urgent);
        }
        setRequests(list);
      } else {
        const res = await serviceRequestApi.browse({
          category: category || undefined,
          city: location.city || undefined,
          district: location.district || undefined,
          urgent: urgentOnly ? true : undefined,
          status: "OPEN",
          page: 0,
          size: 30,
        });
        setRequests(res.content || []);
      }
    } catch {
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [location, radiusKm, category, urgentOnly]);

  useEffect(() => {
    fetchNearbyRequests();
  }, [fetchNearbyRequests]);

  const radiusOptions = [1, 5, 10, 20, 50];

  const categories: ServiceCategory[] = [
    "AC_REPAIR",
    "CLEANING",
    "PLUMBING",
    "ELECTRICAL",
    "CARPENTRY",
    "PAINTING",
    "APPLIANCE_REPAIR",
    "PEST_CONTROL",
    "TUTORING",
    "BEAUTY",
    "OTHER",
  ];

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("nearbyRequests")}</h1>
            <p className="text-xs text-slate-500 mt-1">
              ស្វែងរកការងារ និងសំណើសេវាកម្មដែលអតិថិជនបានបង្ហោះនៅជិតទីតាំងរបស់អ្នក
            </p>
          </div>

          {/* Filter Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ប្រភេទសេវាកម្ម
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                >
                  <option value="">{t("all")} ប្រភេទសេវាកម្ម</option>
                  {categories.map((cat) => {
                    const key = `cat_${cat}` as keyof typeof translations.km;
                    return (
                      <option key={cat} value={cat}>
                        {t(key)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Radius filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t("radius")}
                </label>
                <div className="flex items-center space-x-1.5">
                  {radiusOptions.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRadiusKm(r)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                        radiusKm === r
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {r} km
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgent Filter & Mode */}
              <div className="flex flex-col justify-end space-y-2">
                <label className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={urgentOnly}
                    onChange={(e) => setUrgentOnly(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  <span>តែសេវាកម្មបន្ទាន់</span>
                </label>
              </div>
            </div>

            {/* Location selector toggle */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>
                  ទីតាំងស្វែងរក៖ {location.district || location.city || "រាជធានីភ្នំពេញ"}
                  {location.latitude && ` (${location.latitude.toFixed(2)}, ${location.longitude?.toFixed(2)})`}
                </span>
              </div>

              <div className="w-full sm:w-80">
                <LocationPicker value={location} onChange={setLocation} />
              </div>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <CardSkeleton key={n} />
              ))}
            </div>
          ) : requests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {requests.map((req) => (
                <ServiceRequestCard
                  key={req.id}
                  request={req}
                  href={`/provider/requests/${req.id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("noNearbyRequests")}
              subtitle={t("noNearbyRequestsSubtitle")}
              icon={Search}
              actionLabel="ពង្រីកកាំរង្វង់ចម្ងាយ (50 km)"
              onAction={() => setRadiusKm(50)}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
