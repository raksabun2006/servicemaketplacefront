"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { notificationApi } from "@/lib/api/notification.api";
import { fileApi } from "@/lib/api/file.api";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import {
  Wrench,
  Bell,
  MessageSquare,
  Globe,
  LogOut,
  User,
  ChevronDown,
  Plus,
  Search,
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  Heart,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Users,
  Tag,
  ExternalLink,
} from "lucide-react";

export const DashboardNavbar: React.FC = () => {
  const { user, isCustomer, isProvider, isAdmin, logout, refreshUserProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    notificationApi
      .getUnreadCount()
      .then(setUnreadNotifications)
      .catch(() => {});

    if (!user?.avatarUrl) {
      refreshUserProfile();
    }
  }, [pathname, user?.avatarUrl, refreshUserProfile]);

  // Close menus on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileDrawerOpen(false);
  }, [pathname]);

  const toggleLanguage = () => {
    setLanguage(language === "km" ? "en" : "km");
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    router.push("/login");
  };

  const userAvatarUrl = user?.avatarUrl ? fileApi.getFileUrl(user.avatarUrl) : null;
  const userInitials = (user?.fullName || "User")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const dashboardHomeLink = isCustomer
    ? "/customer/dashboard"
    : isProvider
    ? "/provider/dashboard"
    : isAdmin
    ? "/admin/dashboard"
    : "/";

  // Sidebar links for mobile drawer
  const customerLinks = [
    { href: "/customer/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/customer/requests", label: t("myRequests"), icon: Wrench },
    { href: "/customer/requests/create", label: t("postJob"), icon: Plus },
    { href: "/customer/bookings", label: t("myBookings"), icon: Calendar },
    { href: "/customer/favorites", label: t("favorites"), icon: Heart },
    { href: "/customer/messages", label: t("messages"), icon: MessageSquare },
    { href: "/customer/notifications", label: t("notifications"), icon: Bell },
    { href: "/customer/profile", label: t("profile"), icon: User },
  ];

  const providerLinks = [
    { href: "/provider/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/provider/requests", label: t("findJobs"), icon: Search },
    { href: "/provider/bookings", label: t("myJobs"), icon: Calendar },
    { href: "/provider/offers", label: t("offers"), icon: Clock },
    { href: "/provider/availability", label: t("availability"), icon: CheckCircle2 },
    { href: "/provider/messages", label: t("messages"), icon: MessageSquare },
    { href: "/provider/profile", label: t("profile"), icon: User },
  ];

  const adminLinks = [
    { href: "/admin/dashboard", label: t("adminDashboard"), icon: LayoutDashboard },
    { href: "/admin/providers", label: t("providerVerification"), icon: ShieldCheck },
    { href: "/admin/users", label: t("users"), icon: Users },
    { href: "/admin/categories", label: t("categories"), icon: Tag },
    { href: "/admin/bookings", label: t("myBookings"), icon: Calendar },
    { href: "/admin/profile", label: t("profile"), icon: User },
  ];

  const drawerLinks = isCustomer ? customerLinks : isProvider ? providerLinks : isAdmin ? adminLinks : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Role Tag */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Brand Logo */}
            <Link href={dashboardHomeLink} className="flex items-center space-x-2 group shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Khmer Service Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-base sm:text-lg text-slate-900 leading-tight whitespace-nowrap">
                Khmer Service
              </span>
            </Link>

            {/* Role Badge on Desktop */}
            <div className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
              {isCustomer ? "អតិថិជន" : isProvider ? "អ្នកផ្តល់សេវា" : "អ្នកគ្រប់គ្រង"}
            </div>

            {/* Quick Link to Public Site */}
            <Link
              href="/"
              className="hidden lg:inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-blue-600 transition ml-2"
              title="មើលទំព័រដើមសាធារណៈ"
            >
              <span>ទំព័រមុខ</span>
            </Link>
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Primary Action Button */}
            {isCustomer && (
              <Link
                href="/customer/requests/create"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("postJob")}</span>
              </Link>
            )}

            {isProvider && (
              <Link
                href="/provider/requests"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t("findJobs")}</span>
              </Link>
            )}

            {/* Messages Shortcut - Hidden on mobile because it's in bottom bar */}
            <Link
              href={isCustomer ? "/customer/messages" : isProvider ? "/provider/messages" : "/admin/dashboard"}
              className="hidden md:inline-flex p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition relative"
              title={t("messages")}
            >
              <MessageSquare className="w-4 h-4" />
            </Link>

            {/* Notifications Shortcut - Hidden on mobile because it's in drawer/nav */}
            <Link
              href={isCustomer ? "/customer/notifications" : "/provider/dashboard"}
              className="hidden md:inline-flex p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition relative"
              title={t("notifications")}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </Link>

            {/* Language Switcher with Flags */}
            <LanguageSelector />

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-1 sm:space-x-1.5 p-1 rounded-xl hover:bg-slate-100 transition"
              >
                {userAvatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={userAvatarUrl}
                    alt={user?.fullName || "User"}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {userInitials}
                  </div>
                )}
                <span className="hidden md:block text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                  {user?.fullName || "គណនី"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user?.fullName || "អ្នកប្រើប្រាស់"}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {user?.email || ""}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700">
                      {isCustomer ? "អតិថិជន" : isProvider ? "អ្នកផ្តល់សេវា" : "អ្នកគ្រប់គ្រង"}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href={isCustomer ? "/customer/profile" : isProvider ? "/provider/profile" : "/admin/profile"}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t("profile")}</span>
                    </Link>

                    <Link
                      href="/"
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t("home")}</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t("logout")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Drawer Hamburger */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileDrawerOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 animate-in fade-in slide-in-from-top-2">
          {drawerLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (link.href !== "/customer/dashboard" && link.href !== "/provider/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
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
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2 py-2">
            <span className="text-xs font-semibold text-slate-500">ភាសា / Language:</span>
            <LanguageSelector variant="pill" />
          </div>
          <div className="pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
