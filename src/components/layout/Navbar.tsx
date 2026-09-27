"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { notificationApi } from "@/lib/api/notification.api";
import {
  Bell,
  Globe,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  PlusCircle,
  Search,
  User,
  X,
  Wrench,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  Heart,
  ShieldCheck,
  Briefcase,
  Tag,
  Home,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";
import { fileApi } from "@/lib/api/file.api";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { CambodiaFlag, EnglishFlag } from "@/components/ui/FlagIcons";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isCustomer, isProvider, isAdmin, logout, refreshUserProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Close menus on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (isAuthenticated) {
      notificationApi
        .getUnreadCount()
        .then(setUnreadNotifications)
        .catch(() => {});

      if (!user?.avatarUrl) {
        refreshUserProfile();
      }
    }
  }, [isAuthenticated, pathname, user?.avatarUrl, refreshUserProfile]);

  const toggleLanguage = () => {
    setLanguage(language === "km" ? "en" : "km");
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 lg:space-x-5 xl:space-x-7 shrink-0">
            <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 relative flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Khmer Service Logo"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow-xs"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm lg:text-[15px] xl:text-base text-slate-900 leading-tight whitespace-nowrap group-hover:text-blue-700 transition">
                  {language === "km" ? "ថ្នាលសេវាកម្មកម្ពុជា" : "Khmer Service"}
                </span>
                <span className="text-[10px] text-blue-700 font-bold tracking-wider uppercase hidden xl:block whitespace-nowrap">
                  {language === "km" ? "សេវាកម្ម និងជាងជំនាញ" : "Service Marketplace"}
                </span>
              </div>
            </Link>

            {/* Desktop Primary Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 lg:space-x-1.5 xl:space-x-3 2xl:space-x-4 text-xs lg:text-[13px] xl:text-sm font-bold text-slate-800 shrink-0">
              <Link
                href="/services"
                className="px-2.5 py-1.5 rounded-lg hover:text-blue-700 hover:bg-blue-50/60 transition whitespace-nowrap shrink-0"
              >
                {language === "km" ? "ប្រភេទសេវាកម្ម" : "Services"}
              </Link>
              <div className="relative group cursor-pointer shrink-0">
                <button
                  type="button"
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg hover:text-blue-700 hover:bg-blue-50/60 transition whitespace-nowrap shrink-0"
                >
                  <span>{language === "km" ? "ជាងជំនាញ" : "Technicians"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block z-50">
                  <Link href="/providers?category=AC_REPAIR" className="block px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium">
                    {language === "km" ? "ជាងម៉ាស៊ីនត្រជាក់ & ទូរទឹកកក" : "AC & Refrigeration"}
                  </Link>
                  <Link href="/providers?category=PLUMBING" className="block px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium">
                    {language === "km" ? "ជាងទឹក និងបំពង់ទុយោ" : "Plumbing & Pipes"}
                  </Link>
                  <Link href="/providers?category=ELECTRICAL" className="block px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium">
                    {language === "km" ? "ជាងអគ្គិសនី និងខ្សែភ្លើង" : "Electrical & Wiring"}
                  </Link>
                  <Link href="/providers?category=CLEANING" className="block px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium">
                    {language === "km" ? "សេវាសម្អាតគេហដ្ឋាន" : "Cleaning Services"}
                  </Link>
                  <Link href="/providers" className="block px-4 py-2 text-xs text-blue-700 bg-blue-50/50 hover:bg-blue-100 font-bold border-t border-slate-100 mt-1">
                    {language === "km" ? "មើលជាងជំនាញទាំងអស់ →" : "All Technicians →"}
                  </Link>
                </div>
              </div>
              <Link
                href="/about"
                className="px-2.5 py-1.5 rounded-lg hover:text-blue-700 hover:bg-blue-50/60 transition whitespace-nowrap shrink-0"
              >
                {language === "km" ? "អំពីយើង" : "About Us"}
              </Link>
            </nav>
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
            {/* Help Button (Shown on 2xl to preserve horizontal space) */}
            <Link
              href="/about"
              className="hidden 2xl:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold transition shadow-2xs whitespace-nowrap shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === "km" ? "ជំនួយបន្ថែម" : "Support"}</span>
            </Link>

            {/* Login Button (Shown on sm+ to prevent header cramping on mobile screens, where bottom nav already has Login) */}
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#1254d8] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5 text-white" />
                <span>{language === "km" ? "ចូលប្រើប្រាស់" : "Login"}</span>
              </Link>
            ) : null}

            {/* 1-Click Language Switcher (Real Official Cambodia & UK Flags) */}
            <button
              type="button"
              onClick={toggleLanguage}
              title={
                language === "km"
                  ? "ប្តូរទៅភាសាអង់គ្លេស / Switch to English"
                  : "Switch to Khmer / ប្តូរទៅភាសាខ្មែរ"
              }
              aria-label="Toggle language"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-slate-200/90 shadow-xs hover:border-blue-600 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center p-0 bg-white group shrink-0"
            >
              {language === "km" ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/flags/kh-1x1.svg"
                  alt="ភាសាខ្មែរ"
                  className="w-full h-full object-cover select-none pointer-events-none group-hover:brightness-105 transition"
                  loading="eager"
                  draggable={false}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/flags/gb-1x1.svg"
                  alt="English"
                  className="w-full h-full object-cover select-none pointer-events-none group-hover:brightness-105 transition"
                  loading="eager"
                  draggable={false}
                />
              )}
            </button>

            {/* If Authenticated: User Avatar Dropdown */}
            {isAuthenticated && (
              <div className="flex items-center pl-1.5 sm:pl-2 border-l border-slate-200">
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-1 sm:space-x-2 p-1 rounded-xl hover:bg-slate-100 transition relative"
                    aria-label="User profile and menu"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm overflow-hidden shrink-0 border border-slate-200 relative">
                      {user?.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={fileApi.getFileUrl(user.avatarUrl)}
                          alt={user?.fullName || "User"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                            const fb = e.currentTarget.parentElement?.querySelector(".nav-avatar-fb");
                            if (fb) (fb as HTMLElement).style.display = "flex";
                          }}
                        />
                      ) : null}
                      <span className={`nav-avatar-fb ${user?.avatarUrl ? "hidden" : "flex"} w-full h-full items-center justify-center`}>
                        {user?.fullName?.charAt(0) || "U"}
                      </span>
                    </div>
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0.5 left-6 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    )}
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-900 max-w-[120px] truncate">
                        {user?.fullName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {user?.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm overflow-hidden shrink-0 border border-slate-200">
                          {user?.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={fileApi.getFileUrl(user.avatarUrl)}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                                const fb = e.currentTarget.parentElement?.querySelector(".dd-avatar-fb");
                                if (fb) (fb as HTMLElement).style.display = "flex";
                              }}
                            />
                          ) : null}
                          <span className={`dd-avatar-fb ${user?.avatarUrl ? "hidden" : "flex"} w-full h-full items-center justify-center`}>
                            {user?.fullName?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        </div>
                      </div>

                      {/* Marketplace Home Link */}
                      <Link
                        href="/"
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50/50 hover:bg-blue-100 transition border-b border-slate-100"
                      >
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span>{language === "km" ? "ទំព័រដើមផ្សារ (Marketplace)" : "Marketplace Home"}</span>
                      </Link>

                      {isCustomer && (
                        <>
                          <Link
                            href="/customer/dashboard"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                            <span>{t("dashboard")}</span>
                          </Link>
                          <Link
                            href="/customer/requests"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Wrench className="w-4 h-4 text-indigo-500" />
                            <span>{t("myRequests")}</span>
                          </Link>
                          <Link
                            href="/customer/bookings"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            <span>{t("myBookings")}</span>
                          </Link>
                          <Link
                            href="/customer/favorites"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span>{t("favorites")}</span>
                          </Link>
                          <Link
                            href="/customer/notifications"
                            className="flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <div className="flex items-center space-x-2.5">
                              <Bell className="w-4 h-4 text-indigo-500" />
                              <span>{t("notifications")}</span>
                            </div>
                            {unreadNotifications > 0 && (
                              <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold rounded-full">
                                {unreadNotifications}
                              </span>
                            )}
                          </Link>
                          <Link
                            href="/customer/profile"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <User className="w-4 h-4 text-indigo-500" />
                            <span>{t("profile")}</span>
                          </Link>
                        </>
                      )}

                      {isProvider && (
                        <>
                          <Link
                            href="/provider/dashboard"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                            <span>{t("dashboard")}</span>
                          </Link>
                          <Link
                            href="/provider/requests"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Search className="w-4 h-4 text-emerald-500" />
                            <span>{t("nearbyRequests")}</span>
                          </Link>
                          <Link
                            href="/provider/bookings"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            <span>{t("myJobs")}</span>
                          </Link>
                          <Link
                            href="/provider/offers"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Wrench className="w-4 h-4 text-emerald-500" />
                            <span>{t("offers")}</span>
                          </Link>
                          <Link
                            href="/provider/profile"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <User className="w-4 h-4 text-emerald-500" />
                            <span>{t("profile")}</span>
                          </Link>
                          <Link
                            href="/customer/requests/create"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 border-t border-slate-100"
                          >
                            <PlusCircle className="w-4 h-4 text-indigo-500" />
                            <span>{t("postProblem")}</span>
                          </Link>
                          <Link
                            href="/customer/requests"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Wrench className="w-4 h-4 text-indigo-500" />
                            <span>{t("myRequests")}</span>
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <>
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-purple-500" />
                            <span>{t("adminDashboard")}</span>
                          </Link>
                          <Link
                            href="/admin/providers"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-500" />
                            <span>{t("providerVerification")}</span>
                          </Link>
                          <Link
                            href="/admin/profile"
                            className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <User className="w-4 h-4 text-purple-500" />
                            <span>{t("profile")}</span>
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 my-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t("logout")}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Slide-Over Drawer matching exact style from user screenshot */}
    {mobileMenuOpen && (
      <div className="fixed inset-0 z-50 md:hidden">
        {/* Dark Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-out Sidebar Panel */}
        <aside
          aria-label="Mobile Drawer Navigation"
          className="fixed inset-y-0 right-0 w-[285px] sm:w-[320px] h-full max-h-screen bg-white shadow-2xl flex flex-col justify-between p-4 z-50 animate-in slide-in-from-right duration-250 ease-out overflow-y-auto"
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
                          : isAuthenticated
                          ? "text-blue-600"
                          : "text-slate-500"
                      }`}
                    >
                      {isAdmin
                        ? "ADMIN PANEL"
                        : isProvider
                        ? "PROVIDER PANEL"
                        : isAuthenticated
                        ? "CUSTOMER PORTAL"
                        : "SERVICE MARKETPLACE"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
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
                  {isAdmin ? (
                    <>
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
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
                  ) : isProvider ? (
                    <>
                      <Link
                        href="/provider/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
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
                        href="/provider/messages"
                        onClick={() => setMobileMenuOpen(false)}
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
                  ) : isCustomer ? (
                    <>
                      <Link
                        href="/customer/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/customer/requests") && pathname !== "/customer/requests/create"
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Wrench className="w-4 h-4 text-indigo-600" />
                        <span>{language === "km" ? "សំណើរបស់ខ្ញុំ" : "My Requests"}</span>
                      </Link>
                      <Link
                        href="/customer/requests/create"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 transition"
                      >
                        <PlusCircle className="w-4 h-4 text-indigo-600" />
                        <span>{language === "km" ? "ស្នើសុំការជួសជុល" : "Post a Problem"}</span>
                      </Link>
                      <Link
                        href="/customer/bookings"
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/customer/favorites")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>{language === "km" ? "ជាងក្នុងចំណូលចិត្ត" : "Saved Providers"}</span>
                      </Link>
                      <Link
                        href="/customer/notifications"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/customer/notifications")
                            ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Bell className="w-4 h-4 text-slate-400" />
                          <span>{language === "km" ? "ការជូនដំណឹង" : "Notifications"}</span>
                        </div>
                        {unreadNotifications > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-2xs">
                            {unreadNotifications}
                          </span>
                        )}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname === "/" ? "bg-slate-100 text-slate-900 font-bold shadow-2xs" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Home className="w-4 h-4 text-slate-400" />
                        <span>{t("home")}</span>
                      </Link>
                      <Link
                        href="/services"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/services") ? "bg-slate-100 text-slate-900 font-bold shadow-2xs" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Search className="w-4 h-4 text-slate-400" />
                        <span>{t("services")}</span>
                      </Link>
                      <Link
                        href="/providers"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/providers") ? "bg-slate-100 text-slate-900 font-bold shadow-2xs" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{t("providers")}</span>
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                          pathname.startsWith("/about") ? "bg-slate-100 text-slate-900 font-bold shadow-2xs" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-slate-400" />
                        <span>{t("about")}</span>
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
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3.5 py-2 rounded-2xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                  >
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>{language === "km" ? "គេហទំព័រផ្សារ" : "Online store"}</span>
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3.5 py-2 rounded-2xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                  >
                    <Search className="w-4 h-4 text-slate-400" />
                    <span>{language === "km" ? "រកមើលសេវាកម្ម" : "Browse Services"}</span>
                  </Link>
                  <Link
                    href="/providers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3.5 py-2 rounded-2xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                  >
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>{language === "km" ? "បញ្ជីជាងជំនាញ" : "Point of sale"}</span>
                  </Link>
                </nav>
              </div>

              {/* Language Switcher pill in Drawer */}
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  {language === "km" ? "ប្តូរភាសា" : "Language"}
                </span>
                <LanguageSelector variant="pill" />
              </div>
            </div>

            {/* Bottom Pinned Profile & Sign Out (Matching Screenshot) */}
            <div className="pt-4 border-t border-slate-100 space-y-1 mt-6">
              {isAuthenticated ? (
                <>
                  <Link
                    href={isAdmin ? "/admin/profile" : isProvider ? "/provider/profile" : "/customer/profile"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{language === "km" ? "ព័ត៌មានគណនី" : "Profile & Account"}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>{language === "km" ? "ចាកចេញពីគណនី" : "Sign Out"}</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block py-2.5 text-center text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl transition"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block py-2.5 text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs"
                  >
                    {t("register")}
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
