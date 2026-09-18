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
      <div className="flex">
        <Sidebar />

        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("users")}</h1>
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
                  <div key={u.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm">
                        {u.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{u.fullName}</h4>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{u.email}</span>
                          </span>
                          {u.phone && (
                            <span className="flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{u.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleBadgeColor}`}
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
