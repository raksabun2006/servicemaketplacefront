import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  slugToLocation,
  generateSeoMetadata,
  generateBreadcrumbsJsonLd,
  SERVICE_CATEGORIES_SEO,
  LOCATIONS_SEO,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { MapPin, Wrench, ShieldCheck, ChevronRight, Users, PlusCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loc = slugToLocation(slug);

  if (!loc) {
    return generateSeoMetadata({
      title: "រកមិនឃើញទីតាំង",
      noIndex: true,
    });
  }

  return generateSeoMetadata({
    title: loc.metaTitle,
    description: loc.metaDescription,
    path: `/locations/${loc.slug}`,
    keywords: loc.keywords,
  });
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const loc = slugToLocation(slug);

  if (!loc) {
    notFound();
  }

  const breadcrumbs = [
    { name: "តំបន់សេវាកម្ម", url: "/locations/phnom-penh" },
    { name: loc.nameKm, url: `/locations/${loc.slug}` },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {/* Hero Section */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs mb-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#104ccb] mb-4">
              <MapPin className="w-3.5 h-3.5" />
              <span>{loc.nameEn}</span>
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#104ccb] tracking-tight leading-tight">
              {loc.h1}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              {loc.intro}
            </p>

            <div className="pt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/services?city=${encodeURIComponent(loc.nameEn)}`}
                className="px-6 py-3 rounded-xl bg-[#104ccb] hover:bg-[#0a3ca8] text-white font-bold text-xs sm:text-sm shadow-md transition"
              >
                មើលសំណើការងារនៅ {loc.nameKm}
              </Link>
              <Link
                href="/customer/requests/create"
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <span>+ បង្ហោះបញ្ហារបស់អ្នក</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Districts Section (if available) */}
        {loc.districts && loc.districts.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
              ខណ្ឌ និងតំបន់ក្នុង {loc.nameKm}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {loc.districts.map((d) => (
                <Link
                  key={d.slug}
                  href={`/services?city=${encodeURIComponent(loc.nameEn)}&district=${encodeURIComponent(d.nameEn)}`}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-300 transition text-left group"
                >
                  <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {d.nameKm}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{d.nameEn}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Service Categories Available */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                សេវាកម្មពេញនិយមនៅ {loc.nameKm}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                ជ្រើសរើសប្រភេទសេវាកម្មដើម្បីស្វែងរកជាងជំនាញដែលនៅជិតអ្នក
              </p>
            </div>
            <Link
              href="/services"
              className="text-xs font-bold text-[#104ccb] hover:underline flex items-center gap-1"
            >
              <span>សេវាកម្មទាំងអស់</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.values(SERVICE_CATEGORIES_SEO).map((cat) => (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition group flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-[#104ccb] group-hover:text-white transition-colors">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#104ccb] transition-colors leading-snug">
                    {cat.khmerTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {cat.englishTitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Other Provinces Hubs */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
            ស្វែងរកជាងនៅខេត្តដទៃទៀត
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.values(LOCATIONS_SEO)
              .filter((l) => l.slug !== loc.slug)
              .map((otherLoc) => (
                <Link
                  key={otherLoc.slug}
                  href={`/locations/${otherLoc.slug}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 transition"
                >
                  {otherLoc.nameKm} ({otherLoc.nameEn})
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
