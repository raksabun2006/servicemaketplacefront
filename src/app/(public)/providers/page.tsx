"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { providerApi } from "@/lib/api/provider.api";
import { ProviderProfileResponse } from "@/types/provider";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users, Search, RefreshCw, CheckCircle2, Clock, Filter } from "lucide-react";

export default function ProvidersPage() {
  const { t } = useLanguage();
  const [providers, setProviders] = useState<ProviderProfileResponse[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VERIFIED" | "PENDING">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProviders = useCallback(async () => {
    try {
      // Fetch all providers from API (up to 100 per page to load all active data)
      const res = await providerApi.list({ page: 0, size: 100 });
      setProviders(res.content || []);
    } catch {
      setProviders([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProviders();
  };

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const isVerified = p.isVerified || p.verificationStatus === "VERIFIED";

      // Status filter
      if (statusFilter === "VERIFIED" && !isVerified) return false;
      if (statusFilter === "PENDING" && isVerified) return false;

      // Search query filter
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const name = (p.businessName || p.fullName || "").toLowerCase();
      const area = (p.serviceArea || p.city || p.district || "").toLowerCase();
      const bio = (p.bio || "").toLowerCase();
      return name.includes(q) || area.includes(q) || bio.includes(q);
    });
  }, [providers, search, statusFilter]);

  const verifiedCount = providers.filter((p) => p.isVerified || p.verificationStatus === "VERIFIED").length;
  const pendingCount = providers.filter((p) => !p.isVerified && p.verificationStatus !== "VERIFIED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
            <span>បញ្ជីអ្នកផ្តល់សេវាទាំងអស់ (All Providers from API)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            រកឃើញអ្នកអាចជួយដោះស្រាយបញ្ហារបស់អ្នក
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ស្វែងរក និងជ្រើសរើសអ្នកជំនាញដែលស័ក្តិសមជាមួយបញ្ហារបស់អ្នក (សរុប {providers.length} នាក់)
          </p>
        </div>

        {/* Search input & Refresh */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ស្វែងរកឈ្មោះ ជំនាញ ឬទីតាំង..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition shadow-2xs"
            title="ទាញយកទិន្នន័យថ្មីពី API (Fetch Data)"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200/80">
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
              statusFilter === "ALL"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <span>ទាំងអស់ (All)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {providers.length}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("VERIFIED")}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
              statusFilter === "VERIFIED"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>បានផ្ទៀងផ្ទាត់ (Verified)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === "VERIFIED" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {verifiedCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("PENDING")}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
              statusFilter === "PENDING"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>រង់ចាំការអនុម័ត (Pending Approval)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === "PENDING" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
              }`}
            >
              {pendingCount}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium px-2">
          បង្ហាញ៖ <span className="font-bold text-slate-800">{filteredProviders.length}</span> / {providers.length}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <CardSkeleton key={n} />
          ))}
        </div>
      ) : filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProviders.map((prov) => (
            <ProviderCard key={prov.id} provider={prov} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="រកមិនឃើញអ្នកផ្តល់សេវាទេ"
          subtitle="មិនមានអ្នកផ្តល់សេវាត្រូវនឹងលក្ខខណ្ឌស្វែងរករបស់អ្នកនៅឡើយទេ។"
          icon={Users}
        />
      )}
    </div>
  );
}
