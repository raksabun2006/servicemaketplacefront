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
  User,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Tag,
  LogIn,
  Users,
  Bell,
  Clock,
} from "lucide-react";

export const MobileNavigation: React.FC = () => {
  const { isAuthenticated, isCustomer, isProvider, isAdmin } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  // Helper for active link checking
  const checkIsActive = (href: string) => {
    if (
      href === "/" ||
      href === "/customer/dashboard" ||
      href === "/provider/dashboard" ||
      href === "/admin/dashboard"
    ) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const renderTab = (
    href: string,
    Icon: React.ComponentType<{ className?: string }>,
    label: string,
    activeColorClass = "text-blue-600"
  ) => {
    const isActive = checkIsActive(href);
    return (
      <Link
        key={href}
        href={href}
        className="flex flex-col items-center justify-center py-1 transition-all group active:scale-95 select-none"
      >
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-150 ${
            isActive
              ? `${activeColorClass} bg-blue-50/90 font-bold`
              : "text-slate-400 group-hover:text-slate-600"
          }`}
        >
          <Icon className="w-5 h-5 shrink-0" />
        </div>
        <span
          className={`text-[10px] tracking-tight leading-tight mt-0.5 max-w-[64px] truncate text-center transition-colors duration-150 ${
            isActive
              ? `${activeColorClass} font-bold`
              : "text-slate-500 font-normal"
          }`}
        >
          {label}
        </span>
      </Link>
    );
  };

  // If not authenticated, show public mobile bottom navigation
  if (!isAuthenticated) {
    return (
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-2 pb-[max(0.85rem,calc(env(safe-area-inset-bottom)+0.35rem))] grid grid-cols-4 items-center"
      >
        {renderTab("/", Home, t("home"))}
        {renderTab("/services", Search, t("services"))}
        {renderTab("/providers", Users, t("providers"))}
        {renderTab("/login", LogIn, t("login"))}
      </nav>
    );
  }

  // Customer Mobile Navigation (Section 16: ទំព័រដើម, សំណើ, សារ, ជូនដំណឹង, គណនី)
  if (isCustomer) {
    return (
      <nav
        aria-label="Customer Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-1 pt-2 pb-[max(0.85rem,calc(env(safe-area-inset-bottom)+0.35rem))] grid grid-cols-5 items-center"
      >
        {renderTab("/", Home, t("home"))}
        {renderTab("/customer/requests", Wrench, t("myRequests"))}
        {renderTab("/customer/messages", MessageSquare, t("messages"))}
        {renderTab("/customer/notifications", Bell, t("notifications"))}
        {renderTab("/customer/profile", User, t("account"))}
      </nav>
    );
  }

  // Provider Mobile Navigation (Section 16: ទំព័រដើម, ការងារ, ការផ្តល់តម្លៃ, សារ, គណនី)
  if (isProvider) {
    return (
      <nav
        aria-label="Provider Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-1 pt-2 pb-[max(0.85rem,calc(env(safe-area-inset-bottom)+0.35rem))] grid grid-cols-5 items-center"
      >
        {renderTab("/provider/dashboard", Home, t("home"))}
        {renderTab("/provider/bookings", Wrench, t("jobs"))}
        {renderTab("/provider/offers", Clock, t("offers"))}
        {renderTab("/provider/messages", MessageSquare, t("messages"))}
        {renderTab("/provider/profile", User, t("account"))}
      </nav>
    );
  }

  // Admin Mobile Navigation (5 equal tabs)
  if (isAdmin) {
    return (
      <nav
        aria-label="Admin Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-1 pt-2 pb-[max(0.85rem,calc(env(safe-area-inset-bottom)+0.35rem))] grid grid-cols-5 items-center"
      >
        {renderTab("/admin/dashboard", LayoutDashboard, t("dashboard"), "text-purple-600")}
        {renderTab("/admin/providers", ShieldCheck, t("providers"), "text-purple-600")}
        {renderTab("/admin/users", Users, t("users"), "text-purple-600")}
        {renderTab("/admin/categories", Tag, t("categories"), "text-purple-600")}
        {renderTab("/admin/profile", User, t("profile"), "text-purple-600")}
      </nav>
    );
  }

  return null;
};
