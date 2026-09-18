"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { ServiceCategory, ServiceRequestSummaryResponse } from "@/types/service-request";
import { ServiceRequestCard } from "@/components/service-requests/ServiceRequestCard";
import { categoryApi } from "@/lib/api/category.api";
import { CategoryResponse } from "@/types/category";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, Filter, AlertTriangle } from "lucide-react";

function ServicesContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const [category, setCategory] = useState<ServiceCategory | "">(
    (searchParams.get("category") as ServiceCategory) || ""
  );
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [urgent, setUrgent] = useState(false);

  const [requests, setRequests] = useState<ServiceRequestSummaryResponse[]>([]);
  const [fetchedCategories, setFetchedCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await serviceRequestApi.browse({
        category: category || undefined,
        city: city || undefined,
        search: search.trim() || undefined,
        urgent: urgent ? true : undefined,
        page: 0,
        size: 20,
      });
      setRequests(Array.isArray(res) ? res : (res?.content || []));
    } catch {
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, city, search, urgent]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    categoryApi
      .getActive()
      .then((data) => {
        if (data && data.length > 0) {
          setFetchedCategories(data);
        }
      })
      .catch(() => {});
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("services")}</h1>
        <p className="text-xs text-slate-500 mt-1">
          ស្វែងរក និងមើលសំណើសេវាកម្មដែលកំពុងបើកទទួលអ្នកផ្តល់សេវា
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ស្វែងរកតាមចំណងជើង..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Category filter */}
          <div className="w-full md:w-56">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              <option value="">{t("all")} ប្រភេទសេវាកម្ម</option>
              {fetchedCategories.length > 0
                ? fetchedCategories.map((cat) => (
                    <option key={cat.id || cat.code} value={cat.code}>
                      {cat.name}
                    </option>
                  ))
                : categories.map((cat) => {
                    const key = `cat_${cat}` as keyof typeof translations.km;
                    return (
                      <option key={cat} value={cat}>
                        {t(key)}
                      </option>
                    );
                  })}
            </select>
          </div>

          {/* City filter */}
          <div className="w-full md:w-48">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="ទីក្រុង (ឧ. Phnom Penh)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* Urgent checkbox toggle */}
          <label className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>{t("urgent")}</span>
          </label>
        </div>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <CardSkeleton key={n} />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((req) => (
            <ServiceRequestCard key={req.id} request={req} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t("noRequests")}
          subtitle="មិនមានសំណើសេវាកម្មត្រូវនឹងលក្ខខណ្ឌស្វែងរករបស់អ្នកទេ។"
          icon={Filter}
          actionLabel={t("postProblem")}
          actionHref="/customer/requests/create"
        />
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-xs text-slate-400">កំពុងផ្ទុក...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
