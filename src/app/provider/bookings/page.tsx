"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { bookingApi } from "@/lib/api/booking.api";
import { BookingResponse, BookingStatus } from "@/types/booking";
import { BookingCard } from "@/components/bookings/BookingCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Calendar } from "lucide-react";

export default function ProviderBookingsPage() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await bookingApi.list({
        status: statusFilter !== "ALL" ? (statusFilter as BookingStatus) : undefined,
        page: 0,
        size: 50,
      });
      setBookings(res.content || []);
    } catch {
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAccept = async (id: string) => {
    try {
      await bookingApi.accept(id);
      fetchBookings();
    } catch {
      // ignore
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await bookingApi.reject(id, reason);
      fetchBookings();
    } catch {
      // ignore
    }
  };

  const handleStart = async (id: string) => {
    try {
      await bookingApi.start(id);
      fetchBookings();
    } catch {
      // ignore
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await bookingApi.complete(id);
      fetchBookings();
    } catch {
      // ignore
    }
  };

  const tabs = [
    { key: "ALL", label: "ទាំងអស់" },
    { key: "PENDING", label: t("status_PENDING") },
    { key: "ACCEPTED", label: t("status_ACCEPTED") },
    { key: "IN_PROGRESS", label: t("status_IN_PROGRESS") },
    { key: "COMPLETED", label: t("status_COMPLETED") },
    { key: "CANCELLED", label: t("status_CANCELLED") },
  ];

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("myJobs")}</h1>
            <p className="text-xs text-slate-500 mt-1">
              គ្រប់គ្រងការងារដែលបានកក់ ណាត់ជួប និងការចុះបំពេញសេវាកម្ម
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  statusFilter === tab.key
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <CardSkeleton key={n} />
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  isProvider={true}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onStart={handleStart}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="មិនទាន់មានការងារក្នុងបញ្ជីនេះទេ"
              subtitle="ស្វែងរកការងារថ្មីៗនៅជិតអ្នក និងផ្ញើសំណើតម្លៃដើម្បីទទួលបានការកក់។"
              icon={Calendar}
              actionLabel={t("nearbyRequests")}
              actionHref="/provider/requests"
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
