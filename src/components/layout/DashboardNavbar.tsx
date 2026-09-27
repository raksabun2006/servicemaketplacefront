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

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

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
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-2xs border-b border-slate-200 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Role Tag */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Brand Logo */}
            <Link href={dashboardHomeLink} className="flex items-center space-x-2.5 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 relative flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Khmer Service Logo"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow-xs"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight whitespace-nowrap group-hover:text-blue-700 transition">
                  {language === "km" ? "ថ្នាលសេវាកម្មកម្ពុជា" : "Khmer Service"}
                </span>
                <span className="text-[10px] text-blue-700 font-bold tracking-wider uppercase hidden sm:block">
                  {language === "km" ? "សេវាកម្ម និងជាងជំនាញ" : "Service Marketplace"}
                </span>
              </div>
            </Link>

            {/* Role Badge on Desktop */}
            <div className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
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

            {/* Language Switcher with Flags */}
            <LanguageSelector />

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-1 sm:space-x-1.5 p-1 rounded-xl hover:bg-slate-100 transition relative"
                aria-label="User profile menu"
              >
                <div className="relative">
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
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </div>
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
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t("profile")}</span>
                    </Link>

                    {/* Notifications inside Dropdown */}
                    <Link
                      href={isCustomer ? "/customer/notifications" : isProvider ? "/provider/dashboard" : "/admin/dashboard"}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Bell className="w-3.5 h-3.5 text-slate-400" />
                        <span>{language === "km" ? "ការជូនដំណឹង" : "Notifications"}</span>
                      </div>
                      {unreadNotifications > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shrink-0">
                          {unreadNotifications}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === "km" ? "គេហទំព័រដើម" : "Marketplace Home"}</span>
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
    </header>

    {/* Mobile Slide-Over Drawer matching exact style from user screenshot */}
    {mobileDrawerOpen && (
      <div className="fixed inset-0 z-50 md:hidden">
        {/* Dark Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setMobileDrawerOpen(false)}
        />

        {/* Slide-out Sidebar Panel */}
        <aside
          aria-label="Dashboard Mobile Drawer Navigation"
          className="fixed inset-y-0 left-0 w-[285px] sm:w-[320px] h-full max-h-screen bg-white shadow-2xl flex flex-col justify-between p-4 z-50 animate-in slide-in-from-left duration-250 ease-out overflow-y-auto"
        >
            <div className="space-y-6">
              {/* Header: Logo Card + Title + Panel Badge + Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center p-1.5 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Khmer Service" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-slate-900 truncate">
                      {language === "km" ? "ថ្នាលសេវាខ្មែរ" : "Khmer Service"}
                    </h2>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                        isAdmin
                          ? "text-purple-600"
                          : isProvider
                          ? "text-emerald-600"
                          : "text-blue-600"
                      }`}
                    >
                      {isAdmin
                        ? "ADMIN PANEL"
                        : isProvider
                        ? "PROVIDER PANEL"
                        : "CUSTOMER PORTAL"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Section 1: Main Menu */}
              <div>
                <div className="px-3 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === "km" ? "ម៉ឺនុយមេ" : "Main Menu"}
                  </span>
                </div>
                <nav className="space-y-1">
                  {isAdmin && (
                    <>
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname === "/admin/dashboard"
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-900" />
                        <span>{language === "km" ? "ផ្ទាំងគ្រប់គ្រង" : "Overview"}</span>
                      </Link>
                      <Link
                        href="/admin/providers"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/admin/providers")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>{language === "km" ? "ផ្ទៀងផ្ទាត់អ្នកផ្តល់សេវា" : "Provider Verification"}</span>
                      </Link>
                      <Link
                        href="/admin/users"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/admin/users")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{language === "km" ? "គ្រប់គ្រងអ្នកប្រើប្រាស់" : "Customers & Users"}</span>
                      </Link>
                      <Link
                        href="/admin/categories"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/admin/categories")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Tag className="w-4 h-4 text-slate-400" />
                        <span>{language === "km" ? "ប្រភេទសេវាកម្ម" : "Service Categories"}</span>
                      </Link>
                      <Link
                        href="/admin/bookings"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/admin/bookings")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{language === "km" ? "ការកក់ទូទាំងប្រព័ន្ធ" : "System Bookings"}</span>
                      </Link>
                    </>
                  )}

                  {isProvider && (
                    <>
                      <Link
                        href="/provider/dashboard"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname === "/provider/dashboard"
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-900" />
                        <span>{language === "km" ? "ផ្ទាំងគ្រប់គ្រង" : "Overview"}</span>
                      </Link>
                      <Link
                        href="/provider/bookings"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/provider/bookings")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>{language === "km" ? "ការងាររបស់ខ្ញុំ" : "Orders & Jobs"}</span>
                      </Link>
                      <Link
                        href="/provider/requests"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/provider/requests")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Search className="w-4 h-4 text-slate-400" />
                        <span>{language === "km" ? "សំណើសេវាជិតៗ" : "Nearby Requests"}</span>
                      </Link>
                      <Link
                        href="/provider/offers"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/provider/offers")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{language === "km" ? "ការផ្តល់តម្លៃ" : "My Offers"}</span>
                      </Link>
                      <Link
                        href="/provider/availability"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/provider/availability")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        <span>{language === "km" ? "ស្ថានភាពទំនេរ" : "Availability"}</span>
                      </Link>
                      <Link
                        href="/provider/messages"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/provider/messages")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>{language === "km" ? "សារឆ្លើយឆ្លង" : "Messages"}</span>
                      </Link>
                    </>
                  )}

                  {isCustomer && (
                    <>
                      <Link
                        href="/customer/dashboard"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname === "/customer/dashboard"
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-900" />
                        <span>{language === "km" ? "ផ្ទាំងគ្រប់គ្រង" : "Overview"}</span>
                      </Link>
                      <Link
                        href="/customer/requests"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/customer/requests") && pathname !== "/customer/requests/create"
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Wrench className="w-4 h-4 text-blue-600" />
                        <span>{language === "km" ? "សំណើរបស់ខ្ញុំ" : "My Requests"}</span>
                      </Link>
                      <Link
                        href="/customer/requests/create"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname === "/customer/requests/create"
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Plus className="w-4 h-4 text-slate-400" />
                        <span>{language === "km" ? "ស្នើសុំការជួសជុល" : "Post a Problem"}</span>
                      </Link>
                      <Link
                        href="/customer/bookings"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/customer/bookings")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{language === "km" ? "ការកក់របស់ខ្ញុំ" : "My Bookings"}</span>
                      </Link>
                      <Link
                        href="/customer/favorites"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/customer/favorites")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span>{language === "km" ? "ជាងក្នុងចំណូលចិត្ត" : "Saved Providers"}</span>
                      </Link>
                      <Link
                        href="/customer/messages"
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/customer/messages")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>{language === "km" ? "សារឆ្លើយឆ្លង" : "Messages"}</span>
                      </Link>
                    </>
                  )}
                </nav>
              </div>

              {/* Section 2: Sales Channel / Marketplace */}
              <div>
                <div className="px-3 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === "km" ? "ផ្សារសេវាកម្ម" : "Sales Channel"}
                  </span>
                </div>
                <nav className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>{language === "km" ? "គេហទំព័រផ្សារ" : "Online store"}</span>
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    <Search className="w-4 h-4 text-slate-400" />
                    <span>{language === "km" ? "រកមើលសេវាកម្ម" : "Browse Services"}</span>
                  </Link>
                  <Link
                    href="/providers"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{language === "km" ? "បញ្ជីជាងជំនាញ" : "Point of sale"}</span>
                  </Link>
                </nav>
              </div>

              {/* Language Selector in Drawer */}
              <div className="px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">ភាសា / Lang</span>
                <LanguageSelector variant="pill" />
              </div>
            </div>

            {/* Bottom Pinned Profile & Sign Out matching reference screenshot */}
            <div className="pt-4 border-t border-slate-100 space-y-1">
              <Link
                href={isCustomer ? "/customer/profile" : isProvider ? "/provider/profile" : "/admin/profile"}
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>{language === "km" ? "ព័ត៌មានគណនី" : "Profile & Account"}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-bold text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>{language === "km" ? "ចាកចេញពីគណនី" : "Sign Out"}</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
