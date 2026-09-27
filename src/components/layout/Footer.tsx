"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, ChevronUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  FOOTER_SERVICES_LINKS,
  FOOTER_CUSTOMER_LINKS,
  FOOTER_PROVIDER_LINKS,
  FOOTER_CONTACT_INFO,
  FOOTER_POPULAR_LINKS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_LEGAL_LINKS,
  SocialLink,
} from "@/lib/footer-links";

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
  switch (platform) {
    case "facebook":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "telegram":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .36z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.99v7.92c0 .88-.13 1.77-.45 2.6-.57 1.5-1.66 2.77-3.08 3.51-1.42.74-3.07.94-4.66.6-1.58-.33-3.04-1.25-4.04-2.52-1-1.27-1.47-2.91-1.33-4.52.14-1.61.9-3.13 2.11-4.23 1.21-1.1 2.82-1.72 4.45-1.73.55 0 1.1.06 1.64.19v4.11c-.43-.16-.89-.25-1.35-.25-.97 0-1.92.42-2.55 1.17-.63.75-.84 1.77-.57 2.71.27.94 1.05 1.67 2.01 1.88.96.21 1.98-.12 2.64-.84.45-.49.69-1.14.7-1.81V.02z" />
        </svg>
      );
  }
}

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const isKm = language === "km";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-slate-950 text-slate-300 border-t border-slate-850 pt-12 pb-8 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main 4-Column Grid on Desktop / Responsive Stack on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1 — Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Khmer Service Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-wide group-hover:text-blue-400 transition-colors">
                  ខ្មែរ សេវា
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Khmer Service</span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {isKm
                ? "ស្វែងរកជាង និងអ្នកផ្តល់សេវាកម្មដែលអ្នកត្រូវការនៅកម្ពុជា។"
                : "Find the technicians and service providers you need in Cambodia."}
            </p>

            {/* Subtle Social Media Links */}
            <div className="pt-2">
              <nav aria-label={isKm ? "បណ្តាញសង្គម" : "Social media"} className="flex items-center space-x-2.5">
                {FOOTER_SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.ariaLabel}
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <SocialIcon platform={item.platform} />
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Column 2 — សេវាកម្ម (Services) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {isKm ? "សេវាកម្ម" : "Services"}
            </h3>
            <nav aria-label={isKm ? "តំណភ្ជាប់សេវាកម្ម" : "Service links"}>
              <ul className="space-y-2">
                {FOOTER_SERVICES_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-xs text-slate-400 hover:text-white transition-colors block py-0.5 focus:outline-none focus:text-white focus:underline"
                    >
                      {isKm ? item.name : item.nameEn || item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3 — សម្រាប់អ្នកប្រើប្រាស់ (For Customers) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {isKm ? "សម្រាប់អ្នកប្រើប្រាស់" : "For Customers"}
            </h3>
            <nav aria-label={isKm ? "តំណភ្ជាប់សម្រាប់អ្នកប្រើប្រាស់" : "Customer links"}>
              <ul className="space-y-2">
                {FOOTER_CUSTOMER_LINKS.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-xs text-slate-400 hover:text-white transition-colors block py-0.5 focus:outline-none focus:text-white focus:underline"
                    >
                      {isKm ? item.name : item.nameEn || item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 4 — សម្រាប់អ្នកផ្តល់សេវា (For Service Providers) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {isKm ? "សម្រាប់អ្នកផ្តល់សេវា" : "For Providers"}
            </h3>
            <nav aria-label={isKm ? "តំណភ្ជាប់សម្រាប់អ្នកផ្តល់សេវា" : "Provider links"}>
              <ul className="space-y-2">
                {FOOTER_PROVIDER_LINKS.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-xs text-slate-400 hover:text-white transition-colors block py-0.5 focus:outline-none focus:text-white focus:underline"
                    >
                      {isKm ? item.name : item.nameEn || item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Contact & SEO Footer Content Area */}
        <div className="pt-6 border-t border-slate-850/80 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 text-xs">
          {/* Contact Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {isKm ? "ទំនាក់ទំនង" : "Contact Us"}
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                <span>
                  {isKm ? "ទីតាំង៖ " : "Location: "}
                  <span className="text-slate-300">
                    {isKm ? FOOTER_CONTACT_INFO.location : FOOTER_CONTACT_INFO.locationEn || "Phnom Penh, Cambodia"}
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                <span>
                  {isKm ? "អ៊ីមែល៖ " : "Email: "}
                  <a
                    href={`mailto:${FOOTER_CONTACT_INFO.email}`}
                    className="text-slate-300 hover:text-white hover:underline focus:outline-none focus:underline"
                  >
                    {FOOTER_CONTACT_INFO.email}
                  </a>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                <span>
                  {isKm ? "ទូរស័ព្ទ៖ " : "Phone: "}
                  <a
                    href={`tel:${FOOTER_CONTACT_INFO.phone.replace(/\s+/g, "")}`}
                    className="text-slate-300 hover:text-white hover:underline focus:outline-none focus:underline"
                  >
                    {FOOTER_CONTACT_INFO.phone}
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* SEO Footer Content: សេវាកម្មពេញនិយម */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {isKm ? "សេវាកម្មពេញនិយម" : "Popular Services"}
            </h4>
            <nav aria-label={isKm ? "សេវាកម្មពេញនិយម" : "Popular services"}>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {FOOTER_POPULAR_LINKS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-block px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {isKm ? item.name : item.nameEn || item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="pt-6 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            {isKm ? "© 2026 ខ្មែរ សេវា. រក្សាសិទ្ធិគ្រប់យ៉ាង។" : "© 2026 Khmer Service. All rights reserved."}
          </p>

          <nav aria-label={isKm ? "លក្ខខណ្ឌច្បាប់" : "Legal links"}>
            <ul className="flex items-center space-x-4">
              {FOOTER_LEGAL_LINKS.map((item, index) => (
                <React.Fragment key={item.href}>
                  {index > 0 && <span className="text-slate-700">|</span>}
                  <li>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors focus:outline-none focus:underline"
                    >
                      {isKm ? item.name : item.nameEn || item.name}
                    </Link>
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label={isKm ? "ត្រឡប់ទៅលើវិញ" : "Back to top"}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-white shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 border border-slate-750 backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={isKm ? "ត្រឡប់ទៅលើវិញ" : "Back to top"}
      >
        <ChevronUp className="w-5 h-5" aria-hidden="true" />
      </button>
    </footer>
  );
};
