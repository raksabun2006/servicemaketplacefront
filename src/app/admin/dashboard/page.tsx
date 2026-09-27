"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { adminApi } from "@/lib/api/admin.api";
import { AdminDashboardResponse } from "@/types/admin";
import {
  Users,
  Briefcase,
  Wrench,
  Calendar,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  Globe,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<AdminDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then(setMetrics)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex w-full min-w-0">
        <Sidebar />

        <div className="flex-1 w-full min-w-0 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t("adminDashboard")}</h1>
              <p className="text-xs text-slate-500 mt-1">
                ស្ថិតិ និងទិន្នន័យរួមនៃវេទិកាសេវាខ្មែរ (Platform Summary & Analytics)
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 transition shadow-xs w-fit"
            >
              <Globe className="w-4 h-4 text-purple-600" />
              <span>មើលគេហទំព័រផ្សារ (Go to Marketplace) →</span>
            </Link>
          </div>

          {/* Cards Grid from Backend Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Customers */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">អតិថិជនសរុប</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {isLoading ? "..." : metrics?.totalCustomers ?? 0}
              </p>
              <span className="text-[10px] text-slate-400">
                អ្នកប្រើប្រាស់សរុប៖ {metrics?.totalUsers ?? 0}
              </span>
            </div>

            {/* Total Providers */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">អ្នកផ្តល់សេវាសរុប</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {isLoading ? "..." : metrics?.totalProviders ?? 0}
              </p>
              <span className="text-[10px] text-slate-400">ជាង និងក្រុមការងារ</span>
            </div>

            {/* Pending Provider Verifications */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">រង់ចាំការផ្ទៀងផ្ទាត់</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-amber-600">
                {isLoading ? "..." : metrics?.pendingProviderVerifications ?? 0}
              </p>
              <Link
                href="/admin/providers"
                className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-600 hover:underline"
              >
                <span>ត្រួតពិនិត្យឯកសារ</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Total Services / Requests */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">កាតាឡុកសេវាកម្ម</span>
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {isLoading ? "..." : metrics?.totalServices ?? 0}
              </p>
              <span className="text-[10px] text-slate-400">សេវាសកម្ម</span>
            </div>

            {/* Total Bookings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">ការកក់សរុប</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {isLoading ? "..." : metrics?.totalBookings ?? 0}
              </p>
              <span className="text-[10px] text-slate-400">ការកក់ទាំងអស់</span>
            </div>

            {/* Pending Bookings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">ការកក់រង់ចាំឆ្លើយតប</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {isLoading ? "..." : metrics?.pendingBookings ?? 0}
              </p>
              <span className="text-[10px] text-slate-400">រង់ចាំជាងទទួល</span>
            </div>

            {/* Completed Bookings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">ការងារបានបញ្ចប់</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {isLoading ? "..." : metrics?.completedBookings ?? 0}
              </p>
              <span className="text-[10px] text-slate-400">
                បោះបង់៖ {metrics?.cancelledBookings ?? 0}
              </span>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">ទំហំប្រតិបត្តិការ ($)</span>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                ${metrics?.totalRevenue ? metrics.totalRevenue.toFixed(2) : "0.00"}
              </p>
              <span className="text-[10px] text-slate-400">ចំណូលក្នុងប្រព័ន្ធ</span>
            </div>
          </div>

          {/* Admin Navigation Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/providers"
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-400 shadow-xs transition space-y-2"
            >
              <h3 className="text-sm font-bold text-slate-900">
                {t("providerVerification")}
              </h3>
              <p className="text-xs text-slate-500">
                ត្រួតពិនិត្យឯកសារអត្តសញ្ញាណប័ណ្ណ និងអនុម័តអ្នកផ្តល់សេវា
              </p>
            </Link>

            <Link
              href="/admin/users"
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-400 shadow-xs transition space-y-2"
            >
              <h3 className="text-sm font-bold text-slate-900">
                គ្រប់គ្រងអ្នកប្រើប្រាស់
              </h3>
              <p className="text-xs text-slate-500">
                ពិនិត្យមើលបញ្ជីឈ្មោះអតិថិជន និងតួនាទីគណនី
              </p>
            </Link>

            <Link
              href="/admin/bookings"
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-400 shadow-xs transition space-y-2"
            >
              <h3 className="text-sm font-bold text-slate-900">
                ការកក់សេវាកម្មទូទាំងប្រព័ន្ធ
              </h3>
              <p className="text-xs text-slate-500">
                តាមដានរាល់ប្រតិបត្តិការជួសជុល និងស្ថានភាពការងារ
              </p>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
