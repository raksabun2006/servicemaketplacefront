"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { adminApi } from "@/lib/api/admin.api";
import { BookingResponse } from "@/types/booking";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Calendar, MapPin, DollarSign, User } from "lucide-react";

export default function AdminBookingsPage() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getBookings(0, 50)
      .then((res) => setBookings(res.content || []))
      .catch(() => setBookings([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ការកក់សេវាកម្មទាំងអស់</h1>
            <p className="text-xs text-slate-500 mt-1">
              ត្រួតពិនិត្យរាល់ប្រតិបត្តិការ និងស្ថានភាពការងារទូទាំងប្រព័ន្ធ
            </p>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">កំពុងផ្ទុក...</div>
          ) : bookings.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {bookings.map((b) => (
                <div key={b.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {b.serviceCategory || "សេវាកម្មទូទៅ"}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {b.serviceTitle || "ការកក់សេវាកម្ម"}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>អតិថិជន៖ {b.customerName || "អតិថិជន"}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>អ្នកផ្តល់សេវា៖ {b.providerBusinessName || b.providerFullName}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.city || b.address}</span>
                      </span>
                      {b.price !== undefined && (
                        <span className="flex items-center space-x-0.5 font-bold text-emerald-600">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>${b.price.toFixed(2)}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("noBookings")}
              subtitle="មិនទាន់មានការកក់សេវាកម្មណាមួយនៅក្នុងប្រព័ន្ធនៅឡើយទេ។"
              icon={Calendar}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
