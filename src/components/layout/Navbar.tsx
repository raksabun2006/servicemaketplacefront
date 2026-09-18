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
} from "lucide-react";
import { fileApi } from "@/lib/api/file.api";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isCustomer, isProvider, isAdmin, logout, refreshUserProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="សេវាខ្មែរ Logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 leading-tight">
                  សេវាខ្មែរ
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600">
                  Khmer Services
                </span>
              </div>
            </Link>

            {/* Desktop Primary Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === "/" ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t("home")}
              </Link>
              <Link
                href="/services"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname.startsWith("/services") ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t("services")}
              </Link>
              <Link
                href="/providers"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname.startsWith("/providers") ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t("providers")}
              </Link>
              <Link
                href="/about"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === "/about" ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t("about")}
              </Link>
            </nav>
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher with Flags */}
            <LanguageSelector />

            {isAuthenticated ? (
              <>
                {/* Customer Post Job CTA */}
                {isCustomer && (
                  <Link
                    href="/customer/requests/create"
                    className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t("postProblem")}</span>
                  </Link>
                )}

                {/* Provider Find Jobs CTA */}
                {isProvider && (
                  <Link
                    href="/provider/requests"
                    className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                  >
                    <Search className="w-4 h-4" />
                    <span>{t("findJobs")}</span>
                  </Link>
                )}


                {/* Notifications Bell */}
                <Link
                  href={
                    isCustomer
                      ? "/customer/notifications"
                      : isProvider
                      ? "/provider/messages"
                      : "/admin/dashboard"
                  }
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* Messages Icon */}
                <Link
                  href={isCustomer ? "/customer/messages" : isProvider ? "/provider/messages" : "/admin/dashboard"}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm overflow-hidden shrink-0 border border-slate-200">
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
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-900 max-w-[120px] truncate">
                        {user?.fullName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {user?.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="flex items-center space-x-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t("login")}</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-1 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  <span>{t("register")}</span>
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t("home")}
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t("services")}
            </Link>
            <Link
              href="/providers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t("providers")}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t("about")}
            </Link>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold text-slate-500">ភាសា / Language:</span>
              <LanguageSelector variant="pill" />
            </div>
          </nav>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              {isCustomer && (
                <Link
                  href="/customer/requests/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
                >
                  {t("postProblem")}
                </Link>
              )}
              {isProvider && (
                <Link
                  href="/provider/requests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
                >
                  {t("nearbyRequests")}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-xs font-semibold text-red-600 bg-red-50 rounded-xl"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center text-xs font-semibold text-white bg-indigo-600 rounded-xl"
              >
                {t("register")}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
