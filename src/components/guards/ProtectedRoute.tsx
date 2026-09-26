"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { UserRole } from "@/types/auth";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  ShieldAlert,
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  Home,
  Lock,
  Compass,
  CheckCircle2,
  Shield,
  User as UserIcon,
} from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, role, user, logout } = useAuth();
  const router = useRouter();
  const { language, t } = useLanguage();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <div className="absolute w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide">
          {t("loading")}
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    const isKm = language === "km";

    const getRoleBadge = (targetRole: UserRole) => {
      switch (targetRole) {
        case "ADMIN":
          return {
            label: isKm ? "អ្នកគ្រប់គ្រង (Admin)" : "System Administrator",
            color: "bg-purple-100/90 text-purple-700 border-purple-200",
            dotColor: "bg-purple-500",
            icon: Shield,
            dashboardHref: "/admin/dashboard",
            dashboardLabel: isKm ? "ផ្ទាំងគ្រប់គ្រង Admin" : "Admin Dashboard",
            btnColor: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
          };
        case "PROVIDER":
          return {
            label: isKm ? "អ្នកផ្តល់សេវា (Provider)" : "Service Provider",
            color: "bg-emerald-100/90 text-emerald-700 border-emerald-200",
            dotColor: "bg-emerald-500",
            icon: CheckCircle2,
            dashboardHref: "/provider/dashboard",
            dashboardLabel: isKm ? "ផ្ទាំងគ្រប់គ្រងអ្នកផ្តល់សេវា" : "Provider Dashboard",
            btnColor: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
          };
        case "CUSTOMER":
        default:
          return {
            label: isKm ? "អតិថិជន (Customer)" : "Customer",
            color: "bg-blue-100/90 text-blue-700 border-blue-200",
            dotColor: "bg-blue-500",
            icon: UserIcon,
            dashboardHref: "/customer/dashboard",
            dashboardLabel: isKm ? "ផ្ទាំងគ្រប់គ្រងអតិថិជន" : "Customer Dashboard",
            btnColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
          };
      }
    };

    const currentRoleMeta = getRoleBadge(role);

    const handleSwitchAccount = () => {
      logout();
      router.push("/login");
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 relative overflow-hidden bg-radial from-slate-100/80 via-slate-50 to-white">
        {/* Ambient subtle background decorative blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-200/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg relative z-10">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-300/40 p-6 sm:p-9 text-center">
            {/* Status Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs mb-5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{isKm ? "៤០៣ · កម្រិតសិទ្ធិចូលប្រើប្រាស់" : "403 · Access Restricted"}</span>
            </div>

            {/* Glowing Icon */}
            <div className="relative mx-auto mb-4 w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500/15 via-amber-500/10 to-rose-500/15 border border-rose-200/80 flex items-center justify-center shadow-inner">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xs">
                <ShieldAlert className="w-8 h-8 text-rose-600 animate-pulse" />
              </div>
            </div>

            {/* Title & Description */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
              {isKm ? "អ្នកមិនមានសិទ្ធិចូលទំព័រនេះទេ" : "You Don't Have Access to This Page"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
              {isKm
                ? "ទំព័រនេះត្រូវបានការពារ និងតម្រូវឱ្យមានសិទ្ធិ ឬតួនាទីជាក់លាក់។ គណនីបច្ចុប្បន្នរបស់អ្នកមិនមានការអនុញ្ញាតសម្រាប់ផ្នែកនេះទេ។"
                : "This section is restricted to specific user roles. Your current account doesn't have the permissions required to access this resource."}
            </p>

            {/* Current User & Role Identity Box */}
            <div className="bg-slate-50/90 rounded-2xl border border-slate-200/80 p-4 mb-6 text-left space-y-3">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/60">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-medium">
                      {isKm ? "គណនីបច្ចុប្បន្ន" : "Signed in as"}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {user?.fullName || user?.email || "User"}
                    </p>
                    {user?.fullName && user?.email && (
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    )}
                  </div>
                </div>

                {/* Current Role Tag */}
                <div
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border shrink-0 ${currentRoleMeta.color}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${currentRoleMeta.dotColor}`} />
                  <span>{currentRoleMeta.label}</span>
                </div>
              </div>

              {/* Required Roles Info */}
              <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-0.5">
                <span className="text-slate-500 font-medium">
                  {isKm ? "សិទ្ធិដែលអនុញ្ញាត៖" : "Permitted roles:"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {allowedRoles.map((r) => {
                    const meta = getRoleBadge(r);
                    return (
                      <span
                        key={r}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white text-slate-700 border border-slate-200"
                      >
                        {r}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => router.push(currentRoleMeta.dashboardHref)}
                className={`w-full inline-flex items-center justify-center space-x-2 px-5 py-3 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition active:scale-[0.98] ${currentRoleMeta.btnColor}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{currentRoleMeta.dashboardLabel}</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-semibold rounded-2xl border border-slate-200 shadow-2xs transition active:scale-[0.98]"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                  <span>{isKm ? "ត្រឡប់ក្រោយ" : "Go Back"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-rose-50/70 text-slate-700 hover:text-rose-700 text-xs font-semibold rounded-2xl border border-slate-200 hover:border-rose-200 shadow-2xs transition active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  <span>{isKm ? "ប្តូរគណនី" : "Switch Account"}</span>
                </button>
              </div>
            </div>

            {/* Quick Helper Links */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center space-x-4 text-xs text-slate-500">
              <Link
                href="/"
                className="inline-flex items-center space-x-1 hover:text-blue-600 transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{t("home")}</span>
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/services"
                className="inline-flex items-center space-x-1 hover:text-blue-600 transition"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{t("services")}</span>
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/about"
                className="inline-flex items-center space-x-1 hover:text-blue-600 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isKm ? "ជំនួយ" : "Help"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
