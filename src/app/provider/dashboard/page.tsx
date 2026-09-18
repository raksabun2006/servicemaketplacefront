"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { providerApi } from "@/lib/api/provider.api";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { ProviderDashboardResponse, AvailabilityStatus, ProviderProfileResponse } from "@/types/provider";
import { ServiceRequestSummaryResponse } from "@/types/service-request";
import { ServiceRequestCard } from "@/components/service-requests/ServiceRequestCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import {
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Briefcase,
  Star,
  MapPin,
  ArrowRight,
  SlidersHorizontal,
  CircleDot,
} from "lucide-react";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [metrics, setMetrics] = useState<ProviderDashboardResponse | null>(null);
  const [profile, setProfile] = useState<ProviderProfileResponse | null>(null);
  const [nearbyRequests, setNearbyRequests] = useState<ServiceRequestSummaryResponse[]>([]);
  const [currentStatus, setCurrentStatus] = useState<AvailabilityStatus>("AVAILABLE");
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    Promise.all([
      providerApi.getDashboard().catch(() => null),
      providerApi.getMyProfile().catch(() => null),
    ]).then(([dashData, profileData]) => {
      if (dashData) setMetrics(dashData);
      if (profileData) {
        setProfile(profileData);
        if (profileData.availabilityStatus) {
          setCurrentStatus(profileData.availabilityStatus);
        }
      }
      setLoading(false);
    });

    // Fetch open earning opportunities
    serviceRequestApi
      .browse({ status: "OPEN", size: 4 })
      .then((res) => {
        setNearbyRequests(res.content || []);
      })
      .catch(() => {
        setNearbyRequests([]);
      })
      .finally(() => {
        setRequestsLoading(false);
      });
  }, []);

  const handleStatusChange = async (newStatus: AvailabilityStatus) => {
    try {
      setUpdatingStatus(true);
      await providerApi.updateAvailability({ availabilityStatus: newStatus });
      setCurrentStatus(newStatus);
    } catch {
      // ignore
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusColors: Record<AvailabilityStatus, { bg: string; text: string; dot: string }> = {
    AVAILABLE: { bg: "bg-emerald-50 border-emerald-200 text-emerald-700", text: "text-emerald-700", dot: "bg-emerald-500" },
    BUSY: { bg: "bg-amber-50 border-amber-200 text-amber-700", text: "text-amber-700", dot: "bg-amber-500" },
    OFFLINE: { bg: "bg-slate-100 border-slate-200 text-slate-600", text: "text-slate-600", dot: "bg-slate-400" },
  };

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header & Availability Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                <span>ផ្ទាំងគ្រប់គ្រងអ្នកផ្តល់សេវា</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                សួស្តី, {profile?.businessName || user?.fullName || "ជាងជំនាញ"}!
              </h1>
              <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                ស្វែងរកការងារថ្មីៗ គ្រប់គ្រងសំណើតម្លៃ និងបង្កើនចំណូលរបស់អ្នកនៅទីនេះ។
              </p>
            </div>

            {/* Quick Availability Switcher */}
            <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2">
                <CircleDot className={`w-3.5 h-3.5 ${statusColors[currentStatus].text}`} />
                <span className="text-xs font-semibold text-slate-700">ស្ថានភាព៖</span>
              </div>
              <div className="flex items-center space-x-1">
                {(["AVAILABLE", "BUSY", "OFFLINE"] as AvailabilityStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    disabled={updatingStatus}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      currentStatus === st
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                    }`}
                  >
                    {t(`status_${st}` as keyof typeof t)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Metric Stats Cards — Focus on Earning Opportunities */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: New Nearby Jobs */}
            <Link
              href="/provider/requests"
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 group-hover:text-blue-700 transition">
                  ការងារថ្មីនៅជិតអ្នក
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">
                {loading ? "..." : (metrics?.newNearbyRequestsCount ?? nearbyRequests.length)}
              </p>
              <span className="text-[11px] font-semibold text-blue-600 inline-flex items-center gap-0.5">
                <span>រកការងារឥឡូវនេះ</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            {/* Card 2: Submitted Offers / Pending Quotes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">
                  សំណើតម្លៃបានដាក់
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">
                {loading ? "..." : metrics?.pendingOffersCount ?? 0}
              </p>
              <span className="text-[11px] text-slate-400">រង់ចាំអតិថិជនឆ្លើយតប</span>
            </div>

            {/* Card 3: Active Jobs / Today's Bookings */}
            <Link
              href="/provider/bookings"
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-5 shadow-xs transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 group-hover:text-emerald-700 transition">
                  ការងារកំពុងធ្វើ / ថ្ងៃនេះ
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">
                {loading ? "..." : (metrics?.todayBookingsCount ?? metrics?.acceptedServicesCount ?? 0)}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">ណាត់ជួបត្រូវចុះទៅធ្វើ</span>
            </Link>

            {/* Card 4: Rating & Completed Jobs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">
                  ការងារជោគជ័យ & ការវាយតម្លៃ
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-2xl font-bold text-slate-900">
                  {metrics?.averageRating ? metrics.averageRating.toFixed(1) : (profile?.averageRating ? profile.averageRating.toFixed(1) : "5.0")}
                </p>
                <span className="text-xs text-slate-400">
                  ({metrics?.totalReviews ?? profile?.totalReviews ?? 0} មតិ)
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">
                បានបញ្ចប់៖ {metrics?.completedServicesCount ?? profile?.completedServices ?? 0} ការងារ
              </span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/provider/requests"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs transition flex items-center space-x-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t("nearbyRequests")}</h4>
                <p className="text-[11px] text-slate-500">ស្វែងរកការងារ និងដាក់សំណើតម្លៃ</p>
              </div>
            </Link>

            <Link
              href="/provider/bookings"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs transition flex items-center space-x-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t("myJobs")}</h4>
                <p className="text-[11px] text-slate-500">ទទួលការងារ ចាប់ផ្តើម និងបញ្ចប់ការងារ</p>
              </div>
            </Link>

            <Link
              href="/provider/availability"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs transition flex items-center space-x-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t("availability")}</h4>
                <p className="text-[11px] text-slate-500">កំណត់ម៉ោងធ្វើការ និងកាំរង្វង់ចម្ងាយ</p>
              </div>
            </Link>
          </div>

          {/* Earning Opportunities Feed: Available Nearby Jobs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  ការងារថ្មីៗដែលកំពុងស្វែងរកជាងជំនាញ
                </h2>
                <p className="text-xs text-slate-500">
                  ដាក់សំណើតម្លៃឥឡូវនេះ ដើម្បីទទួលបានអតិថិជនថ្មី
                </p>
              </div>
              <Link
                href="/provider/requests"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>ស្វែងរកការងារទាំងអស់</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {requestsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <CardSkeleton key={n} />
                ))}
              </div>
            ) : nearbyRequests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {nearbyRequests.map((req) => (
                  <ServiceRequestCard key={req.id} request={req} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">មិនទាន់មានការងារថ្មីនៅឡើយទេ</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  សូមពិនិត្យមើលបញ្ជីការងារទូទាំងរាជធានីភ្នំពេញ និងខេត្តផ្សេងៗ
                </p>
                <Link
                  href="/provider/requests"
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>ស្វែងរកការងារទាំងអស់</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

