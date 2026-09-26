"use client";

import React from "react";
import Link from "next/link";
import { ChevronUp } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#104ccb] text-white pt-10 pb-6 overflow-hidden select-none">
      {/* High-tech circuit background decoration (Matching Screenshot 3) */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none">
          <path
            d="M-50 160 L 200 160 L 260 100 L 450 100 L 510 160 L 700 160 M 350 100 L 350 40 L 450 40 M 800 160 L 900 60 L 1100 60 L 1160 120 L 1400 120 M 1050 60 L 1050 20 L 1200 20"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx="260" cy="100" r="4" fill="#ffffff" />
          <circle cx="510" cy="160" r="4" fill="#ffffff" />
          <circle cx="900" cy="60" r="4" fill="#ffffff" />
          <circle cx="1160" cy="120" r="4" fill="#ffffff" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-blue-400/30">
          {/* Column 1: រៀបចំដោយ */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide">រៀបចំ និងគ្រប់គ្រងដោយ</h4>
            <div className="flex items-center space-x-3">
              {/* Official Service Marketplace Logo */}
              <div className="w-14 h-14 rounded-full bg-white p-1.5 flex items-center justify-center shadow-md shadow-blue-900/30 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Khmer Service Logo" className="w-full h-full object-contain" />
              </div>

              {/* Ministry of Economy and Finance circular logo */}
              <div className="w-14 h-14 rounded-full bg-white p-1 flex items-center justify-center shadow-md shadow-blue-900/30 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="46" fill="#045a27" stroke="#d4af37" strokeWidth="3" />
                  <circle cx="50" cy="50" r="38" fill="#ffffff" />
                  <path d="M50 24 L56 38 L44 38 Z M40 40 L60 40 L50 64 Z" fill="#d4af37" />
                  <circle cx="50" cy="68" r="4" fill="#045a27" />
                  <text x="50" y="80" textAnchor="middle" fill="#045a27" fontSize="7" fontWeight="bold">MEF</text>
                </svg>
              </div>

              {/* Techo Startup Center circular logo */}
              <div className="w-14 h-14 rounded-full bg-[#002f6c] p-1 flex items-center justify-center shadow-md shadow-blue-900/30 shrink-0 border-2 border-cyan-400">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="#002f6c" />
                  <path d="M50 18 C35 30 35 60 50 78 C65 60 65 30 50 18 Z" fill="#00e5ff" opacity="0.9" />
                  <circle cx="50" cy="45" r="7" fill="#ffffff" />
                </svg>
              </div>
            </div>
          </div>

          {/* Column 2: គាំទ្រថវិកាដោយ */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide">គាំទ្រថវិកាដោយ</h4>
            <div className="w-14 h-14 rounded-full bg-white p-1 flex items-center justify-center shadow-md shadow-blue-900/30 shrink-0">
              {/* Skills Development Fund (SDF) circular emblem */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="46" fill="#0072bc" stroke="#ffffff" strokeWidth="2" />
                <path d="M50 22 L55 35 L45 35 Z M50 36 C42 42 42 58 50 72 C58 58 58 42 50 36 Z" fill="#ffffff" />
                <circle cx="50" cy="30" r="5" fill="#fdb913" />
                <text x="50" y="86" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">SDF</text>
              </svg>
            </div>
          </div>

          {/* Column 3: អាសយដ្ឋាន (Address) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#facc15] tracking-wide">អាសយដ្ឋាន</h4>
            <p className="text-xs text-white leading-relaxed">
              អគារមជ្ឈមណ្ឌលអភិវឌ្ឍធុរកិច្ច (BDC), ជាន់ទី ១១, មហាវិថី OCIC, សង្កាត់ជ្រោយចង្វារ, ខណ្ឌជ្រោយចង្វារ, រាជធានីភ្នំពេញ, ព្រះរាជាណាចក្រកម្ពុជា
            </p>
          </div>

          {/* Column 4: ទំនាក់ទំនង (Contact) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#facc15] tracking-wide">ទំនាក់ទំនង</h4>
            <div className="text-xs text-white space-y-1.5">
              <a href="tel:+85587955888" className="block hover:underline font-medium">
                +៨៥៥ ៨៧ ៩៥៥ ៨៨៨
              </a>
              <a href="mailto:info@techostartup.center" className="block hover:underline">
                info@techostartup.center
              </a>
            </div>
          </div>

          {/* Column 5: បណ្តាញសង្គម (Social Media) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#facc15] tracking-wide">បណ្តាញសង្គម</h4>
            <div className="flex items-center space-x-3 pt-1">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white text-[#104ccb] flex items-center justify-center font-bold hover:scale-110 transition shadow-sm text-sm"
              >
                f
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white text-[#104ccb] flex items-center justify-center font-bold hover:scale-110 transition shadow-sm text-xs"
              >
                ▶
              </a>
              {/* Telegram */}
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white text-[#104ccb] flex items-center justify-center font-bold hover:scale-110 transition shadow-sm text-xs"
              >
                ✈
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Screenshot 3) */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-100 gap-3">
          <p>រក្សាសិទ្ធិគ្រប់យ៉ាង © ២០២៣-២០២៦ ដោយ បរិវត្តកម្មឌីជីថលសហគ្រាស</p>
          <div className="flex items-center space-x-4">
            <Link href="/about" className="hover:underline">
              គោលការណ៍ឯកជនភាព
            </Link>
            <span>|</span>
            <Link href="/about" className="hover:underline">
              លក្ខខណ្ឌនៃការប្រើប្រាស់
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button (Matching Screenshot 2 & 3) */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#0a3ca8] hover:bg-[#072d82] text-white shadow-xl flex items-center justify-center cursor-pointer transition hover:scale-105 active:scale-95 border-2 border-white/20"
        title="Scroll to Top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </footer>
  );
};
