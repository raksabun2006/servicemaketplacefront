"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-20 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center space-x-2.5 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="សេវាខ្មែរ Logo"
                className="w-10 h-10 object-contain bg-white rounded-xl p-0.5 shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                  សេវាខ្មែរ
                </span>
                <span className="text-[10px] uppercase font-semibold text-blue-400 tracking-wider">
                  {t("cambodiaServicesSubtitle")}
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t("footerTagline")}
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{t("phnomPenhCambodia")}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 tracking-wide">
              {t("popularCategories")}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services?category=AC_REPAIR" className="hover:text-blue-400 transition-colors">
                  {t("cat_AC_REPAIR")}
                </Link>
              </li>
              <li>
                <Link href="/services?category=CLEANING" className="hover:text-blue-400 transition-colors">
                  {t("cat_CLEANING")}
                </Link>
              </li>
              <li>
                <Link href="/services?category=PLUMBING" className="hover:text-blue-400 transition-colors">
                  {t("cat_PLUMBING")}
                </Link>
              </li>
              <li>
                <Link href="/services?category=ELECTRICAL" className="hover:text-blue-400 transition-colors">
                  {t("cat_ELECTRICAL")}
                </Link>
              </li>
              <li>
                <Link href="/services?category=APPLIANCE_REPAIR" className="hover:text-blue-400 transition-colors">
                  {t("cat_APPLIANCE_REPAIR")}
                </Link>
              </li>
              <li>
                <Link href="/services?category=CARPENTRY" className="hover:text-blue-400 transition-colors">
                  {t("cat_CARPENTRY")}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 tracking-wide">
              {t("forCustomers")}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/customer/requests/create" className="hover:text-blue-400 transition-colors">
                  {t("postProblem")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-400 transition-colors">
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link href="/providers" className="hover:text-blue-400 transition-colors">
                  {t("providers")}
                </Link>
              </li>
              <li>
                <Link href="/customer/requests" className="hover:text-blue-400 transition-colors">
                  {t("myRequests")}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Providers & Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 tracking-wide">
              {t("forProvidersAndHelp")}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/register?role=PROVIDER" className="hover:text-blue-400 transition-colors">
                  {t("registerAsProvider")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li className="flex items-center space-x-2 pt-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>+855 23 888 999</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>support@sevakhmer.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {currentYear} សេវាខ្មែរ (Khmer Services). {t("allRightsReserved")}</p>
          <p className="mt-2 sm:mt-0">{t("digitalPlatform")}</p>
        </div>
      </div>
    </footer>
  );
};
