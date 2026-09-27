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
  const { language } = useLanguage();
  const isKm = language === "km";
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
          className={`text-[10px] tracking-tight leading-tight mt-0.5 max-w-[70px] truncate text-center transition-colors duration-150 ${
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
        {renderTab("/", Home, isKm ? "ទំព័រដើម" : "Home")}
        {renderTab("/services", Search, isKm ? "សេវាកម្ម" : "Services")}
        {renderTab("/providers", Users, isKm ? "ជាងជំនាញ" : "Providers")}
        {renderTab("/login", LogIn, isKm ? "ចូលប្រើ" : "Login")}
      </nav>
    );
  }

  // Customer Mobile Navigation
  if (isCustomer) {
    return (
      <nav
        aria-label="Customer Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-1 pt-2 pb-[max(0.85rem,calc(env(safe-area-inset-bottom)+0.35rem))] grid grid-cols-5 items-center"
      >
        {renderTab("/", Home, isKm ? "ទំព័រដើម" : "Home")}
        {renderTab("/customer/requests", Wrench, isKm ? "សំណើ" : "Requests")}
        {renderTab("/customer/messages", MessageSquare, isKm ? "សារ" : "Messages")}
        {renderTab("/customer/notifications", Bell, isKm ? "ជូនដំណឹង" : "Alerts")}
        {renderTab("/customer/profile", User, isKm ? "គណនី" : "Profile")}
      </nav>
    );
  }

  // Provider Mobile Navigation: Home, Dashboard, Jobs, Messages, Account
  if (isProvider) {
    return (
      <nav
        aria-label="Provider Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-1 pt-2 pb-[max(0.85rem,calc(env(safe-area-inset-bottom)+0.35rem))] grid grid-cols-5 items-center"
      >
        {renderTab("/", Home, isKm ? "ទំព័រដើម" : "Home")}
        {renderTab("/provider/dashboard", LayoutDashboard, isKm ? "ផ្ទាំងគ្រប់គ្រង" : "Dashboard", "text-emerald-600")}
        {renderTab("/provider/bookings", Wrench, isKm ? "ការងារ" : "Jobs", "text-emerald-600")}
        {renderTab("/provider/messages", MessageSquare, isKm ? "សារ" : "Messages", "text-emerald-600")}
        {renderTab("/provider/profile", User, isKm ? "គណនី" : "Profile", "text-emerald-600")}
      </nav>
    );
  }

  // Admin Mobile Navigation: Home, Dashboard, Providers Verification, Users, Profile
  if (isAdmin) {
    return (
      <nav
        aria-label="Admin Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-1 pt-2 pb-[max(0.85rem,calc(env(safe-area-inset-bottom)+0.35rem))] grid grid-cols-5 items-center"
      >
        {renderTab("/", Home, isKm ? "ទំព័រដើម" : "Home")}
        {renderTab("/admin/dashboard", LayoutDashboard, isKm ? "ផ្ទាំងគ្រប់គ្រង" : "Dashboard", "text-purple-600")}
        {renderTab("/admin/providers", ShieldCheck, isKm ? "ផ្ទៀងផ្ទាត់" : "Verify", "text-purple-600")}
        {renderTab("/admin/users", Users, isKm ? "អ្នកប្រើ" : "Users", "text-purple-600")}
        {renderTab("/admin/profile", User, isKm ? "គណនី" : "Profile", "text-purple-600")}
      </nav>
    );
  }

  return null;
};
