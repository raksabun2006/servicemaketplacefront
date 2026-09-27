"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { notificationApi } from "@/lib/api/notification.api";
import { adminApi } from "@/lib/api/admin.api";
import {
  LayoutGrid,
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
  Globe,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  Briefcase,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { isCustomer, isProvider, isAdmin, logout } = useAuth();
  const { language } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const isKm = language === "km";

  const [pendingCount, setPendingCount] = React.useState<number>(0);
  const [unreadCount, setUnreadCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (isAdmin) {
      adminApi
        .getApplications({ status: "PENDING", size: 1 })
        .then((res) => {
          if (res?.page?.totalElements) setPendingCount(res.page.totalElements);
        })
        .catch(() => {});
    }

    notificationApi
      .getUnreadCount()
      .then((count) => setUnreadCount(count))
      .catch(() => {});
  }, [isAdmin, pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Helper for checking active link
  const checkIsActive = (href: string) => {
    if (
      href === "/customer/dashboard" ||
      href === "/provider/dashboard" ||
      href === "/admin/dashboard"
    ) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const renderNavItem = (
    href: string,
    Icon: React.ComponentType<{ className?: string }>,
    label: string,
    badge?: number | string
  ) => {
    const active = checkIsActive(href);
    return (
      <Link
        key={href}
        href={href}
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] transition ${
          active
            ? "bg-slate-100/90 text-slate-900 font-bold shadow-2xs"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
        }`}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
            }`}
          />
          <span className="truncate">{label}</span>
        </div>
        {badge !== undefined && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff2d55] text-white shrink-0 shadow-2xs">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  // 1. ADMIN SIDEBAR
  if (isAdmin) {
    const mainLinks = [
      { href: "/admin/dashboard", label: isKm ? "ផ្ទាំងគ្រប់គ្រង" : "Overview", icon: LayoutGrid },
      { href: "/admin/providers", label: isKm ? "ផ្ទៀងផ្ទាត់អ្នកផ្តល់សេវា" : "Provider Verification", icon: ShieldCheck, badge: pendingCount > 0 ? pendingCount : undefined },
      { href: "/admin/users", label: isKm ? "គ្រប់គ្រងអ្នកប្រើប្រាស់" : "Customers & Users", icon: Users },
      { href: "/admin/categories", label: isKm ? "ប្រភេទសេវាកម្ម" : "Service Categories", icon: Tag },
      { href: "/admin/bookings", label: isKm ? "ការកក់ទូទាំងប្រព័ន្ធ" : "System Bookings", icon: Calendar },
    ];

    return (
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 p-4 justify-between">
        <div className="space-y-6">
          {/* Header Card (Styled exactly like the reference style) */}
          <div className="flex items-center space-x-3 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center p-1.5 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Khmer Service" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isKm ? "ថ្នាលសេវាខ្មែរ" : "Khmer Service"}
              </h2>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                ADMIN PANEL
              </span>
            </div>
          </div>

          {/* Section: Main Menu */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isKm ? "ម៉ឺនុយមេ" : "Main Menu"}
              </span>
            </div>
            <nav className="space-y-1">
              {mainLinks.map((item) => renderNavItem(item.href, item.icon, item.label, item.badge))}
            </nav>
          </div>

          {/* Section: Sales Channel / Marketplace */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isKm ? "ផ្សារសេវាកម្ម" : "Sales Channel"}
              </span>
            </div>
            <nav className="space-y-1">
              {renderNavItem("/", Globe, isKm ? "គេហទំព័រផ្សារ" : "Online store")}
              {renderNavItem("/services", ShoppingCart, isKm ? "ចំណុចលក់ / សេវា" : "Point of sale")}
              {renderNavItem("/providers", Briefcase, isKm ? "បញ្ជីជាងជំនាញ" : "All Technicians")}
            </nav>
          </div>
        </div>

        {/* Section: Bottom Pinned Profile & Sign Out */}
        <div className="pt-4 border-t border-slate-100 space-y-1">
          <Link
            href="/admin/profile"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <User className="w-4 h-4 text-slate-400" />
            <span>{isKm ? "ព័ត៌មានគណនី" : "Profile & Account"}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-bold text-[#ff2d55] hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4 text-[#ff2d55]" />
            <span>{isKm ? "ចាកចេញពីគណនី" : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    );
  }

  // 2. PROVIDER SIDEBAR
  if (isProvider) {
    const providerLinks = [
      { href: "/provider/dashboard", label: isKm ? "ផ្ទាំងគ្រប់គ្រង" : "Overview", icon: LayoutGrid },
      { href: "/provider/bookings", label: isKm ? "ការងាររបស់ខ្ញុំ" : "Orders & Jobs", icon: Calendar },
      { href: "/provider/requests", label: isKm ? "សំណើសេវាជិតៗ" : "Nearby Requests", icon: Search },
      { href: "/provider/offers", label: isKm ? "ការផ្តល់តម្លៃ" : "My Offers", icon: Clock },
      { href: "/provider/availability", label: isKm ? "ស្ថានភាពទំនេរ" : "Availability", icon: CheckCircle2 },
      { href: "/provider/messages", label: isKm ? "សារឆ្លើយឆ្លង" : "Messages", icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
    ];

    return (
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 p-4 justify-between">
        <div className="space-y-6">
          {/* Header Card */}
          <div className="flex items-center space-x-3 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center p-1.5 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Khmer Service" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isKm ? "ថ្នាលសេវាខ្មែរ" : "Khmer Service"}
              </h2>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                PROVIDER PANEL
              </span>
            </div>
          </div>

          {/* Section: Main Menu */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isKm ? "ម៉ឺនុយមេ" : "Main Menu"}
              </span>
            </div>
            <nav className="space-y-1">
              {providerLinks.map((item) => renderNavItem(item.href, item.icon, item.label, item.badge))}
            </nav>
          </div>

          {/* Section: Sales Channel */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isKm ? "ផ្សារសេវាកម្ម" : "Sales Channel"}
              </span>
            </div>
            <nav className="space-y-1">
              {renderNavItem("/", Globe, isKm ? "គេហទំព័រផ្សារ" : "Online store")}
              {renderNavItem("/services", ShoppingCart, isKm ? "កាតាឡុកសេវាកម្ម" : "Point of sale")}
            </nav>
          </div>
        </div>

        {/* Bottom Pinned Profile & Sign Out */}
        <div className="pt-4 border-t border-slate-100 space-y-1">
          <Link
            href="/provider/profile"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <User className="w-4 h-4 text-slate-400" />
            <span>{isKm ? "ព័ត៌មានគណនី" : "Profile & Account"}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-bold text-[#ff2d55] hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4 text-[#ff2d55]" />
            <span>{isKm ? "ចាកចេញពីគណនី" : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    );
  }

  // 3. CUSTOMER SIDEBAR
  if (isCustomer) {
    const customerLinks = [
      { href: "/customer/dashboard", label: isKm ? "ផ្ទាំងគ្រប់គ្រង" : "Overview", icon: LayoutGrid },
      { href: "/customer/requests", label: isKm ? "សំណើរបស់ខ្ញុំ" : "My Requests", icon: Wrench },
      { href: "/customer/requests/create", label: isKm ? "ស្នើសុំការជួសជុល" : "Post a Problem", icon: PlusCircle },
      { href: "/customer/bookings", label: isKm ? "ការកក់របស់ខ្ញុំ" : "My Bookings", icon: Calendar },
      { href: "/customer/favorites", label: isKm ? "ជាងក្នុងចំណូលចិត្ត" : "Saved Providers", icon: Heart },
      { href: "/customer/messages", label: isKm ? "សារឆ្លើយឆ្លង" : "Messages", icon: MessageSquare },
      { href: "/customer/notifications", label: isKm ? "ការជូនដំណឹង" : "Notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    ];

    return (
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 p-4 justify-between">
        <div className="space-y-6">
          {/* Header Card */}
          <div className="flex items-center space-x-3 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center p-1.5 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Khmer Service" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isKm ? "ថ្នាលសេវាខ្មែរ" : "Khmer Service"}
              </h2>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                CUSTOMER PORTAL
              </span>
            </div>
          </div>

          {/* Section: Main Menu */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isKm ? "ម៉ឺនុយមេ" : "Main Menu"}
              </span>
            </div>
            <nav className="space-y-1">
              {customerLinks.map((item) => renderNavItem(item.href, item.icon, item.label, item.badge))}
            </nav>
          </div>

          {/* Section: Marketplace */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isKm ? "ផ្សារសេវាកម្ម" : "Sales Channel"}
              </span>
            </div>
            <nav className="space-y-1">
              {renderNavItem("/", Globe, isKm ? "គេហទំព័រផ្សារ" : "Online store")}
              {renderNavItem("/services", ShoppingCart, isKm ? "ស្វែងរកសេវាកម្ម" : "Point of sale")}
              {renderNavItem("/providers", Users, isKm ? "ជាងជំនាញទាំងអស់" : "All Technicians")}
            </nav>
          </div>
        </div>

        {/* Bottom Pinned Profile & Sign Out */}
        <div className="pt-4 border-t border-slate-100 space-y-1">
          <Link
            href="/customer/profile"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <User className="w-4 h-4 text-slate-400" />
            <span>{isKm ? "ព័ត៌មានគណនី" : "Profile & Account"}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-bold text-[#ff2d55] hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4 text-[#ff2d55]" />
            <span>{isKm ? "ចាកចេញពីគណនី" : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    );
  }

  return null;
};
