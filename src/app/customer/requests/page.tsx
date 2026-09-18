"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { ServiceRequestResponse } from "@/types/service-request";
import { ServiceRequestCard } from "@/components/service-requests/ServiceRequestCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlusCircle, Wrench } from "lucide-react";

export default function CustomerRequestsPage() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<ServiceRequestResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await serviceRequestApi.getMyRequests(0, 50);
      setRequests(Array.isArray(res) ? res : (res?.content || []));
    } catch {
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === "ALL") return true;
    return r.status === statusFilter;
  });

  const tabs: { key: string; label: string }[] = [
    { key: "ALL", label: "ទាំងអស់" },
    { key: "OPEN", label: t("status_OPEN") },
    { key: "ACCEPTED", label: t("status_ACCEPTED") },
    { key: "IN_PROGRESS", label: t("status_IN_PROGRESS") },
    { key: "COMPLETED", label: t("status_COMPLETED") },
    { key: "CANCELLED", label: t("status_CANCELLED") },
  ];

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER", "PROVIDER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t("myRequests")}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                គ្រប់គ្រង និងតាមដានរាល់សំណើសេវាកម្មដែលអ្នកបានបង្ហោះ
              </p>
            </div>

            <Link
              href="/customer/requests/create"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t("postProblem")}</span>
            </Link>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  statusFilter === tab.key
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Requests Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <CardSkeleton key={n} />
              ))}
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRequests.map((req) => (
                <ServiceRequestCard key={req.id} request={req} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("noRequests")}
              subtitle={
                statusFilter === "ALL"
                  ? t("noRequestsSubtitle")
                  : "មិនមានសំណើសេវាកម្មស្ថិតក្នុងស្ថានភាពនេះទេ។"
              }
              icon={Wrench}
              actionLabel={t("postProblem")}
              actionHref="/customer/requests/create"
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
