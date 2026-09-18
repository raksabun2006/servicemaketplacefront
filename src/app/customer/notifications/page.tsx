"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { notificationApi } from "@/lib/api/notification.api";
import { NotificationResponse } from "@/types/notification";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bell, CheckCheck, Check, Clock } from "lucide-react";

export default function CustomerNotificationsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [filterUnread, setFilterUnread] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await notificationApi.list(0, 50);
      setNotifications(res.content || []);
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // ignore
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  };

  const displayedList = filterUnread
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER", "PROVIDER", "ADMIN"]}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t("notifications")}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                ការជូនដំណឹងអំពីសំណើតម្លៃ ការកក់ និងសារថ្មីៗ
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setFilterUnread(!filterUnread)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  filterUnread
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {filterUnread ? "បង្ហាញទាំងអស់" : "មិនទាន់អាន"}
              </button>

              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{t("markAllAsRead")}</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">កំពុងផ្ទុកការជូនដំណឹង...</div>
          ) : displayedList.length > 0 ? (
            <div className="space-y-3">
              {displayedList.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                    notif.read
                      ? "bg-white border-slate-200"
                      : "bg-indigo-50/40 border-indigo-200/80 shadow-xs"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        notif.read ? "bg-slate-100 text-slate-500" : "bg-indigo-600 text-white"
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400 pt-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(notif.createdAt).toLocaleString("km-KH")}</span>
                      </div>
                    </div>
                  </div>

                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="សម្គាល់ថាបានអាន"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("noNotifications")}
              subtitle="អ្នកមិនទាន់មានការជូនដំណឹងថ្មីណាមួយនៅឡើយទេ។"
              icon={Bell}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
