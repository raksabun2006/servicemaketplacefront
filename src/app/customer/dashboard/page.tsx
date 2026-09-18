"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { customerApi } from "@/lib/api/customer.api";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { CustomerDashboardResponse } from "@/types/customer";
import { ServiceRequestResponse } from "@/types/service-request";
import { ServiceRequestCard } from "@/components/service-requests/ServiceRequestCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import {
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Heart,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [metrics, setMetrics] = useState<CustomerDashboardResponse | null>(null);
  const [recentRequests, setRecentRequests] = useState<ServiceRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      customerApi.getDashboard().catch(() => null),
      serviceRequestApi.getMyRequests(0, 3).catch(() => ({ content: [] })),
    ]).then(([dashData, reqData]) => {
      if (dashData) setMetrics(dashData);
      if (reqData) setRecentRequests(reqData.content || []);
      setLoading(false);
    });
  }, []);

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Simple, Warm Customer Greeting (Section 11) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                សួស្តី! តើមានបញ្ហាអ្វីដែលយើងអាចជួយបាន?
              </h1>
              <p className="text-sm font-medium text-slate-500">
                {user?.fullName ? `សូមស្វាគមន៍មកកាន់គណនីរបស់អ្នក, ${user.fullName}` : "ប្រាប់យើងពីបញ្ហារបស់អ្នក យើងនឹងជួយរកអ្នកដោះស្រាយ។"}
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              <Link
                href="/customer/requests/create"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-2xl shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ ប្រាប់ពីបញ្ហាថ្មី</span>
              </Link>
              <Link
                href="/providers"
                className="inline-flex items-center space-x-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-2xl border border-slate-200 transition"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>រកអ្នកជំនាញ</span>
              </Link>
            </div>
          </div>

          {/* Simple Status Summary (Section 11: បញ្ហារបស់ខ្ញុំ) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                បញ្ហារបស់ខ្ញុំ
              </h2>
              <Link
                href="/customer/requests"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                <span>មើលទាំងអស់</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* 1. កំពុងស្វែងរកអ្នកជួយ */}
              <Link
                href="/customer/requests"
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-4 shadow-2xs transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 block">
                    កំពុងស្វែងរកអ្នកជួយ
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900">
                  {loading ? "..." : metrics?.openRequestsCount ?? 0}
                </p>
                <p className="text-[11px] text-amber-700 font-medium mt-1">
                  {metrics?.pendingOffersCount ?? 0} សំណើតម្លៃពីជាង
                </p>
              </Link>

              {/* 2. កំពុងដោះស្រាយ */}
              <Link
                href="/customer/bookings"
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-4 shadow-2xs transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 block">
                    កំពុងដោះស្រាយ
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900">
                  {loading ? "..." : metrics?.upcomingBookingsCount ?? 0}
                </p>
                <p className="text-[11px] text-blue-600 font-medium mt-1">
                  ជាងកំពុងដំណើរការ
                </p>
              </Link>

              {/* 3. បានដោះស្រាយរួច */}
              <Link
                href="/customer/bookings"
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-4 shadow-2xs transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 block">
                    បានដោះស្រាយរួច
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900">
                  {loading ? "..." : metrics?.completedServicesCount ?? 0}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">
                  សេវាកម្មជោគជ័យ
                </p>
              </Link>

              {/* 4. បានបោះបង់ */}
              <Link
                href="/customer/requests"
                className="bg-white rounded-2xl border border-slate-200 hover:border-rose-400 p-4 shadow-2xs transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 block">
                    បានបោះបង់
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <XCircle className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900">
                  {loading ? "..." : 0}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  ការងារដែលបានលុប
                </p>
              </Link>
            </div>
          </div>

          {/* Quick Navigation Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/customer/requests/create"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs transition flex items-center space-x-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t("postJob")}</h4>
                <p className="text-[11px] text-slate-500">បង្ហោះបញ្ហាដើម្បីទទួលសំណើតម្លៃ</p>
              </div>
            </Link>

            <Link
              href="/services"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs transition flex items-center space-x-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t("services")}</h4>
                <p className="text-[11px] text-slate-500">ស្វែងរកសេវាកម្មក្នុងគេហដ្ឋាន</p>
              </div>
            </Link>

            <Link
              href="/customer/favorites"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs transition flex items-center space-x-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t("favorites")}</h4>
                <p className="text-[11px] text-slate-500">
                  {metrics?.favoriteProvidersCount ?? 0} ជាងជំនាញដែលបានរក្សាទុក
                </p>
              </div>
            </Link>
          </div>

          {/* Recent Requests Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  សំណើសេវាកម្មថ្មីៗរបស់ខ្ញុំ
                </h2>
                <p className="text-xs text-slate-500">
                  ស្ថានភាព និងការវិវត្តនៃបញ្ហាដែលបានបង្ហោះ
                </p>
              </div>
              <Link
                href="/customer/requests"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>មើលទាំងអស់</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <CardSkeleton key={n} />
                ))}
              </div>
            ) : recentRequests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentRequests.map((req) => (
                  <ServiceRequestCard key={req.id} request={req} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{t("noRequests")}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">{t("noRequestsSubtitle")}</p>
                <Link
                  href="/customer/requests/create"
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t("postJob")}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

