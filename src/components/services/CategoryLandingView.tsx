"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ServiceCategorySeo, LOCATIONS_SEO, siteConfig, generateServiceJsonLd, generateFaqJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Wrench,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MapPin,
  PlusCircle,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";

interface CategoryLandingViewProps {
  seoData: ServiceCategorySeo;
}

export const CategoryLandingView: React.FC<CategoryLandingViewProps> = ({ seoData }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const breadcrumbs = [
    { name: "សេវាកម្មទាំងអស់", url: "/services" },
    { name: seoData.khmerTitle, url: `/services/${seoData.slug}` },
  ];

  const serviceJsonLd = generateServiceJsonLd({
    name: seoData.khmerTitle,
    description: seoData.metaDescription,
    url: `${siteConfig.url}/services/${seoData.slug}`,
    category: seoData.englishTitle,
  });

  const faqJsonLd = generateFaqJsonLd(seoData.faqs);

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      {/* Schemas */}
      <JsonLd data={serviceJsonLd} />
      {seoData.faqs.length > 0 && <JsonLd data={faqJsonLd} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {/* Hero Section */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs mb-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#104ccb] mb-4">
              <Wrench className="w-3.5 h-3.5" />
              <span>{seoData.englishTitle}</span>
            </span>

            {/* SEO H1 Tag */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#104ccb] tracking-tight leading-tight">
              {seoData.h1}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed font-normal">
              {seoData.intro}
            </p>

            <div className="pt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/customer/requests/create?category=${seoData.category}`}
                className="px-6 py-3 rounded-xl bg-[#104ccb] hover:bg-[#0a3ca8] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ បង្ហោះបញ្ហារបស់អ្នកឥឡូវនេះ</span>
              </Link>

              <Link
                href={`/services?category=${seoData.category}`}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition"
              >
                មើលសំណើការងារទាំងអស់ ({seoData.khmerTitle})
              </Link>
            </div>
          </div>
        </header>

        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">ជាងមានការផ្ទៀងផ្ទាត់</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ពិនិត្យអត្តសញ្ញាណប័ណ្ណ និងប្រវត្តិការងារច្បាស់លាស់
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">ឆ្លើយតបរហ័ស</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ទទួលការផ្តល់តម្លៃពីជាងក្នុងរយៈពេល ១០-១៥ នាទី
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">ធានាគុណភាព ១០០%</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                តម្លៃតម្លាភាព និងមានការធានាជួសជុលឡើងវិញ
              </p>
            </div>
          </div>
        </div>

        {/* Common Problems & Solutions Section */}
        {seoData.commonProblems.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              បញ្ហាដែលជួបប្រទះញឹកញាប់
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              ស្វែងយល់អំពីមូលហេតុ និងដំណោះស្រាយបច្ចេកទេសសម្រាប់ {seoData.khmerTitle}
            </p>

            <div className="space-y-4">
              {seoData.commonProblems.map((prob, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5"
                >
                  <div className="flex items-start gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{prob.issue}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                    {prob.remedy}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Informational Guidance: When to Call & How to Choose */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>តើពេលណាគួរហៅជាង?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {seoData.whenToCall}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>តើត្រូវជ្រើសរើសជាងយ៉ាងដូចម្តេច?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {seoData.howToChoose}
            </p>
          </div>
        </section>

        {/* Location Links for this Category */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
            ស្វែងរក {seoData.khmerTitle} តាមទីតាំង
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            ជ្រើសរើសរាជធានី ឬខេត្តរបស់អ្នក ដើម្បីទទួលបានជាងនៅជិតអ្នកបំផុត
          </p>

          <div className="flex flex-wrap gap-2.5">
            {Object.values(LOCATIONS_SEO).map((loc) => (
              <Link
                key={loc.slug}
                href={`/services?category=${seoData.category}&city=${encodeURIComponent(loc.nameEn)}`}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 text-xs font-medium text-slate-700 hover:text-blue-700 transition"
              >
                {seoData.khmerTitle} នៅ {loc.nameKm}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        {seoData.faqs.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              សំណួរដែលសួរញឹកញាប់អំពី {seoData.khmerTitle}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              ចម្លើយច្បាស់លាស់សម្រាប់សំណួរទូទៅទាក់ទងនឹងសេវាកម្មនេះ
            </p>

            <div className="space-y-3">
              {seoData.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition"
                    >
                      <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-blue-600 shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
