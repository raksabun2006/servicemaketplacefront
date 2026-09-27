"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { adminApi } from "@/lib/api/admin.api";
import { UserResponse } from "@/types/auth";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users, Mail, Phone } from "lucide-react";

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getUsers(0, 50)
      .then((res) => setUsers(res.content || []))
      .catch(() => setUsers([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex w-full min-w-0">
        <Sidebar />

        <div className="flex-1 w-full min-w-0 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t("users")}</h1>
            <p className="text-xs text-slate-500 mt-1">
              បញ្ជីអ្នកប្រើប្រាស់ទាំងអស់នៅក្នុងប្រព័ន្ធសេវាខ្មែរ
            </p>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">កំពុងផ្ទុក...</div>
          ) : users.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {users.map((u) => {
                let roleBadgeColor = "bg-slate-100 text-slate-700";
                if (u.role === "ADMIN") roleBadgeColor = "bg-purple-50 text-purple-700 border-purple-200";
                if (u.role === "PROVIDER") roleBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                if (u.role === "CUSTOMER") roleBadgeColor = "bg-indigo-50 text-indigo-700 border-indigo-200";

                return (
                  <div key={u.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 min-w-0">
                    <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                        {u.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{u.fullName}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 text-[11px] text-slate-500 mt-0.5 min-w-0">
                          <span className="flex items-center space-x-1 min-w-0 truncate">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </span>
                          {u.phone && (
                            <span className="flex items-center space-x-1 shrink-0">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{u.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border shrink-0 ${roleBadgeColor}`}
                    >
                      {u.role}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="មិនទាន់មានអ្នកប្រើប្រាស់ទេ"
              subtitle="អ្នកប្រើប្រាស់ដែលចុះឈ្មោះនឹងបង្ហាញនៅទីនេះ។"
              icon={Users}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
