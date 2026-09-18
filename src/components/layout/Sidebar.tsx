"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  LayoutDashboard,
  Wrench,
  Calendar,
  Heart,
  MessageSquare,
  Bell,
  User,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Users,
  Tag,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { isCustomer, isProvider, isAdmin } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  if (isCustomer) {
    const customerLinks = [
      { href: "/customer/dashboard", label: t("dashboard"), icon: LayoutDashboard },
      { href: "/customer/requests", label: t("myRequests"), icon: Wrench },
      { href: "/customer/requests/create", label: t("postJob"), icon: PlusCircle },
      { href: "/customer/bookings", label: t("myBookings"), icon: Calendar },
      { href: "/customer/favorites", label: t("favorites"), icon: Heart },
      { href: "/customer/messages", label: t("messages"), icon: MessageSquare },
      { href: "/customer/notifications", label: t("notifications"), icon: Bell },
      { href: "/customer/profile", label: t("profile"), icon: User },
    ];

    return (
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 p-4 space-y-1">
        <div className="px-3 py-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            {t("account")} - អតិថិជន
          </span>
        </div>
        {customerLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || (link.href !== "/customer/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </aside>
    );
  }

  if (isProvider) {
    const providerLinks = [
      { href: "/provider/dashboard", label: t("dashboard"), icon: LayoutDashboard },
      { href: "/provider/requests", label: t("findJobs"), icon: Search },
      { href: "/provider/bookings", label: t("myJobs"), icon: Calendar },
      { href: "/provider/offers", label: t("offers"), icon: Clock },
      { href: "/provider/availability", label: t("availability"), icon: CheckCircle2 },
      { href: "/provider/messages", label: t("messages"), icon: MessageSquare },
      { href: "/provider/profile", label: t("account"), icon: User },
    ];

    return (
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 p-4 space-y-1">
        <div className="px-3 py-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            {t("account")} - អ្នកផ្តល់សេវា
          </span>
        </div>
        {providerLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || (link.href !== "/provider/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-emerald-600" : "text-slate-400"}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </aside>
    );
  }

  if (isAdmin) {
    const adminLinks = [
      { href: "/admin/dashboard", label: t("adminDashboard"), icon: LayoutDashboard },
      { href: "/admin/providers", label: t("providerVerification"), icon: ShieldCheck },
      { href: "/admin/users", label: t("users"), icon: Users },
      { href: "/admin/categories", label: t("categories"), icon: Tag },
      { href: "/admin/bookings", label: t("myBookings"), icon: Calendar },
      { href: "/admin/profile", label: t("profile"), icon: User },
    ];

    return (
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 p-4 space-y-1">
        <div className="px-3 py-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
            Admin Panel
          </span>
        </div>
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-purple-50 text-purple-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-purple-600" : "text-slate-400"}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </aside>
    );
  }

  return null;
};
