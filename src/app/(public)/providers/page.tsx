"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { providerApi } from "@/lib/api/provider.api";
import { ProviderProfileResponse } from "@/types/provider";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users, Search } from "lucide-react";

export default function ProvidersPage() {
  const { t } = useLanguage();
  const [providers, setProviders] = useState<ProviderProfileResponse[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    providerApi
      .list({ page: 0, size: 24 })
      .then((res) => setProviders(res.content || []))
      .catch(() => setProviders([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProviders = providers.filter((p) => {
    const q = search.toLowerCase();
    const name = (p.businessName || p.fullName || "").toLowerCase();
    const area = (p.serviceArea || p.city || p.district || "").toLowerCase();
    return name.includes(q) || area.includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            រកឃើញអ្នកអាចជួយដោះស្រាយបញ្ហារបស់អ្នក
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ស្វែងរក និងជ្រើសរើសអ្នកជំនាញដែលស័ក្តិសមជាមួយបញ្ហារបស់អ្នក
          </p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="មានបញ្ហាអ្វី? សរសេរនៅទីនេះ..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
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
          subtitle="មិនមានអ្នកផ្តល់សេវាត្រូវនឹងពាក្យស្វែងរករបស់អ្នកនៅឡើយទេ។"
          icon={Users}
        />
      )}
    </div>
  );
}
