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
  const { t, language } = useLanguage();
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
    { key: "ALL", label: language === "km" ? "ទាំងអស់" : "All" },
    { key: "PENDING", label: t("status_PENDING") },
    { key: "ACCEPTED", label: t("status_ACCEPTED") },
    { key: "IN_PROGRESS", label: t("status_IN_PROGRESS") },
    { key: "COMPLETED", label: t("status_COMPLETED") },
    { key: "CANCELLED", label: t("status_CANCELLED") },
  ];

  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <div className="flex w-full min-w-0">
        <Sidebar />

        <div className="flex-1 min-w-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t("myJobs")}</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === "km"
                ? "គ្រប់គ្រងការងារដែលបានកក់ ណាត់ជួប និងការចុះបំពេញសេវាកម្ម"
                : "Manage your booked jobs, scheduled appointments, and services."}
            </p>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 scrollbar-none text-xs -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => {
              const isSelected = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition shrink-0 active:scale-95 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:bg-slate-50 shadow-2xs"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
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
              title={language === "km" ? "មិនទាន់មានការងារក្នុងបញ្ជីនេះទេ" : "No jobs found in this list"}
              subtitle={
                language === "km"
                  ? "ស្វែងរកការងារថ្មីៗនៅជិតអ្នក និងផ្ញើសំណើតម្លៃដើម្បីទទួលបានការកក់។"
                  : "Find new jobs near you and send proposals to receive bookings."
              }
              icon={Calendar}
              actionLabel={language === "km" ? "ស្វែងរកការងារនៅជិតអ្នក" : "Browse Jobs Near You"}
              actionHref="/provider/requests"
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
