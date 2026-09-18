"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { UserRole } from "@/types/auth";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">{t("loading")}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-14 h-14 mx-auto mb-4 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{t("forbiddenError")}</h2>
        <p className="text-sm text-slate-600 mb-6">
          {role === "CUSTOMER"
            ? "គណនីរបស់អ្នកជាអតិថិជន។ សូមចូលទៅកាន់ផ្ទាំងគ្រប់គ្រងអតិថិជន។"
            : role === "PROVIDER"
            ? "គណនីរបស់អ្នកជាអ្នកផ្តល់សេវា។ សូមចូលទៅកាន់ផ្ទាំងគ្រប់គ្រងអ្នកផ្តល់សេវា។"
            : "អ្នកមិនមានសិទ្ធិចូលទំព័រនេះទេ។"}
        </p>
        <button
          onClick={() => {
            if (role === "CUSTOMER") router.push("/customer/dashboard");
            else if (role === "PROVIDER") router.push("/provider/dashboard");
            else if (role === "ADMIN") router.push("/admin/dashboard");
            else router.push("/");
          }}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
        >
          {t("dashboard")}
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
