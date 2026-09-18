"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Home,
  Wrench,
  MessageSquare,
  Bell,
  User,
  LayoutDashboard,
  Search,
  Calendar,
  ShieldAlert,
} from "lucide-react";

export const MobileNavigation: React.FC = () => {
  const { isAuthenticated, isCustomer, isProvider } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  // If not authenticated, show basic public bottom navigation
  if (!isAuthenticated) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 py-2 px-3 flex justify-around items-center">
        <Link
          href="/"
          className={`flex flex-col items-center text-[10px] font-medium transition ${
            pathname === "/" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>{t("home")}</span>
        </Link>
        <Link
          href="/services"
          className={`flex flex-col items-center text-[10px] font-medium transition ${
            pathname.startsWith("/services") ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>{t("services")}</span>
        </Link>
        <Link
          href="/providers"
          className={`flex flex-col items-center text-[10px] font-medium transition ${
            pathname.startsWith("/providers") ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>{t("providers")}</span>
        </Link>
        <Link
          href="/login"
          className={`flex flex-col items-center text-[10px] font-medium transition ${
            pathname === "/login" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>{t("login")}</span>
        </Link>
      </div>
    );
  }

  // Customer Mobile Navigation (Section 17): ទំព័រដើម, រកអ្នកជួយ, ការងារ, សារ, គណនី
  if (isCustomer) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 py-2 px-1 flex justify-around items-center">
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            pathname === "/" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>ទំព័រដើម</span>
        </Link>
        <Link
          href="/providers"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            pathname.startsWith("/providers") ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>រកអ្នកជួយ</span>
        </Link>
        <Link
          href="/customer/requests"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            pathname.startsWith("/customer/requests") ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Wrench className="w-5 h-5 mb-0.5" />
          <span>ការងារ</span>
        </Link>
        <Link
          href="/customer/messages"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            pathname.startsWith("/customer/messages") ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>សារ</span>
        </Link>
        <Link
          href="/customer/profile"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            pathname.startsWith("/customer/profile") ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>គណនី</span>
        </Link>
      </div>
    );
  }

  // Provider Mobile Navigation (Section 17): ទំព័រដើម, រកការងារ, ការងារ, សារ, គណនី
  if (isProvider) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 py-2 px-1 flex justify-around items-center">
        <Link
          href="/provider/dashboard"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            pathname === "/provider/dashboard" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>ទំព័រដើម</span>
        </Link>
        <Link
          href="/provider/requests"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            pathname.startsWith("/provider/requests") ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>រកការងារ</span>
        </Link>
        <Link
          href="/provider/bookings"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            pathname.startsWith("/provider/bookings") ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Wrench className="w-5 h-5 mb-0.5" />
          <span>ការងារ</span>
        </Link>
        <Link
          href="/provider/messages"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            pathname.startsWith("/provider/messages") ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>សារ</span>
        </Link>
        <Link
          href="/provider/profile"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition ${
            pathname.startsWith("/provider/profile") ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>គណនី</span>
        </Link>
      </div>
    );
  }


  // Admin Mobile Navigation
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 py-2 px-2 flex justify-around items-center">
      <Link
        href="/admin/dashboard"
        className={`flex flex-col items-center text-[10px] font-medium transition ${
          pathname === "/admin/dashboard" ? "text-purple-600" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>{t("dashboard")}</span>
      </Link>
      <Link
        href="/admin/providers"
        className={`flex flex-col items-center text-[10px] font-medium transition ${
          pathname.startsWith("/admin/providers") ? "text-purple-600" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <ShieldAlert className="w-5 h-5 mb-0.5" />
        <span>{t("providers")}</span>
      </Link>
      <Link
        href="/admin/users"
        className={`flex flex-col items-center text-[10px] font-medium transition ${
          pathname.startsWith("/admin/users") ? "text-purple-600" : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span>{t("users")}</span>
      </Link>
    </div>
  );
};
