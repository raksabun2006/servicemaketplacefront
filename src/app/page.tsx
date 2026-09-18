"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { providerApi } from "@/lib/api/provider.api";
import { ServiceRequestSummaryResponse } from "@/types/service-request";
import { ProviderProfileResponse } from "@/types/provider";
import { ServiceRequestCard } from "@/components/service-requests/ServiceRequestCard";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  PlusCircle,
  Search,
  Sparkles,
  Wrench,
  Zap,
  Droplets,
  Paintbrush,
  Wind,
  ShieldCheck,
  Star,
  Users,
  Smartphone,
  Laptop,
  Car,
  Bike,
  Hammer,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { categoryApi } from "@/lib/api/category.api";
import { CategoryResponse } from "@/types/category";

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [requests, setRequests] = useState<ServiceRequestSummaryResponse[]>([]);
  const [providers, setProviders] = useState<ProviderProfileResponse[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedCategories, setFetchedCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    serviceRequestApi
      .browse({ page: 0, size: 4, status: "OPEN" })
      .then((res) => setRequests(Array.isArray(res) ? res : (res?.content || [])))
      .catch(() => setRequests([]))
      .finally(() => setLoadingRequests(false));

    providerApi
      .list({ page: 0, size: 4 })
      .then((res) => setProviders(res.content || []))
      .catch(() => setProviders([]))
      .finally(() => setLoadingProviders(false));

    categoryApi
      .getActive()
      .then((data) => {
        if (data && data.length > 0) {
          setFetchedCategories(data.slice(0, 10));
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customer/requests/create?problem=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/customer/requests/create");
    }
  };

  // Section 3 & 6: Common Problems
  const commonProblems = [
    { label: "ម៉ាស៊ីនត្រជាក់មិនត្រជាក់", problem: "ម៉ាស៊ីនត្រជាក់មិនត្រជាក់", category: "AC_REPAIR", sub: "រកជាងជួយពិនិត្យ និងជួសជុល", icon: Wind, color: "bg-sky-50 text-sky-600 group-hover:bg-sky-600" },
    { label: "ទឹកលេច / បំពង់ទឹកខូច", problem: "ទឹកលេច ឬបំពង់ទឹកខូច", category: "PLUMBING", sub: "រកជាងទឹកនៅជិតអ្នក", icon: Droplets, color: "bg-blue-50 text-blue-600 group-hover:bg-blue-600" },
    { label: "ភ្លើងមានបញ្ហា", problem: "ភ្លើងមានបញ្ហា ឆ្លង ឬដាច់", category: "ELECTRICAL", sub: "រកជាងអគ្គិសនី", icon: Zap, color: "bg-amber-50 text-amber-600 group-hover:bg-amber-600" },
    { label: "ផ្ទះត្រូវការជួសជុល", problem: "ផ្ទះត្រូវការជួសជុល ទ្វារ បង្អួច", category: "CARPENTRY", sub: "ស្វែងរកអ្នកជំនាញ", icon: Hammer, color: "bg-orange-50 text-orange-600 group-hover:bg-orange-600" },
    { label: "ម៉ូតូមានបញ្ហា", problem: "ម៉ូតូខូច ឬពិបាកបញ្ឆេះ", category: "OTHER", sub: "រកជាងម៉ូតូ", icon: Bike, color: "bg-teal-50 text-teal-600 group-hover:bg-teal-600" },
    { label: "ត្រូវការសម្អាតផ្ទះ", problem: "ត្រូវការសម្អាតផ្ទះ ឬបន្ទប់", category: "CLEANING", sub: "រកអ្នកសម្អាត", icon: Sparkles, color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600" },
    { label: "ទូរស័ព្ទខូច", problem: "ទូរស័ព្ទបែកអេក្រង់ ឬសាកមិនចូល", category: "APPLIANCE_REPAIR", sub: "រកជាងទូរស័ព្ទ", icon: Smartphone, color: "bg-rose-50 text-rose-600 group-hover:bg-rose-600" },
    { label: "កុំព្យូទ័រខូច", problem: "កុំព្យូទ័រខូច ឬដើរយឺត", category: "APPLIANCE_REPAIR", sub: "រកជាងកុំព្យូទ័រ", icon: Laptop, color: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600" },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Problem-Solving Hero Section */}
      <section className="bg-white border-b border-slate-200/80 pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-800">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>មានបញ្ហា? ប្រាប់យើង ហើយយើងជួយស្វែងរកអ្នកដោះស្រាយ។</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {t("heroTitle")}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* TWO MAIN OBVIOUS ACTIONS ONLY */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-lg mx-auto">
            <Link
              href="/customer/requests/create"
              className="w-full sm:flex-1 inline-flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-base font-bold rounded-2xl shadow-md shadow-blue-500/20 transition group"
            >
              <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{t("iNeedService")}</span>
            </Link>

            <Link
              href="/register?role=PROVIDER"
              className="w-full sm:flex-1 inline-flex items-center justify-center space-x-2 px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 text-base font-bold rounded-2xl border-2 border-slate-200 transition shadow-2xs group"
            >
              <Wrench className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>{t("iWantToProvideService")}</span>
            </Link>
          </div>

          {/* Problem-Based Input Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl border-2 border-slate-200 focus-within:border-blue-600 shadow-sm p-1.5 flex items-center gap-2 transition hover:shadow-md"
            >
              <div className="flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="មានបញ្ហាអ្វី? សរសេរនៅទីនេះ... (ឧ. ម៉ាស៊ីនត្រជាក់មិនត្រជាក់)"
                  className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition shrink-0"
              >
                បន្ត
              </button>
            </form>

            {/* Quick Common Problem Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-400">បញ្ហាជួបញឹកញាប់៖</span>
              {commonProblems.slice(0, 5).map((prob) => {
                const IconComponent = prob.icon;
                return (
                  <button
                    key={prob.problem}
                    type="button"
                    onClick={() => router.push(`/customer/requests/create?problem=${encodeURIComponent(prob.problem)}&category=${prob.category}`)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 text-[11px] font-medium rounded-xl border border-slate-200 transition"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{prob.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 max-w-2xl mx-auto text-xs text-slate-600">
            <div className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{t("verifiedIdentity")}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <Star className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-semibold">{t("realCustomerReviews")}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold">{t("directFreeContact")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: បញ្ហាដែលមនុស្សតែងតែត្រូវការជំនួយ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              បញ្ហាដែលមនុស្សតែងតែត្រូវការជំនួយ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ជ្រើសរើសបញ្ហាដែលអ្នកកំពុងជួប ដើម្បីស្វែងរកអ្នកជំនាញមកជួយដោះស្រាយ
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>មើលបញ្ហាទាំងអស់</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {commonProblems.map((prob) => {
            const Icon = prob.icon;
            return (
              <Link
                key={prob.problem}
                href={`/customer/requests/create?problem=${encodeURIComponent(prob.problem)}&category=${prob.category}`}
                className="group flex items-center space-x-3.5 p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50/10 transition shadow-2xs"
              >
                <div className={`w-12 h-12 rounded-2xl ${prob.color} group-hover:text-white flex items-center justify-center transition shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                    {prob.problem}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {prob.sub}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Open Requests */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {t("popularServices")}
            </h2>
            <p className="text-xs text-slate-500">
              សំណើសេវាកម្មថ្មីៗដែលកំពុងស្វែងរកអ្នកជំនាញនៅជិតអ្នក
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>មើលទាំងអស់</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingRequests ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : requests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {requests.map((req) => (
              <ServiceRequestCard key={req.id} request={req} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="មិនទាន់មានការងារនៅឡើយទេ"
            subtitle="បង្កើតសំណើសេវាកម្មថ្មី ដើម្បីចាប់ផ្តើមស្វែងរកអ្នកផ្តល់សេវា។"
            actionLabel={t("postProblem")}
            actionHref="/customer/requests/create"
          />
        )}
      </section>

      {/* Verified Providers Near You */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {t("nearbyProvidersTitle")}
            </h2>
            <p className="text-xs text-slate-500">
              អ្នកផ្តល់សេវាជំនាញដែលមានការផ្ទៀងផ្ទាត់ និងការវាយតម្លៃល្អ
            </p>
          </div>
          <Link
            href="/providers"
            className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>មើលទាំងអស់</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingProviders ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {providers.map((prov) => (
              <ProviderCard key={prov.id} provider={prov} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="មិនទាន់មានអ្នកផ្តល់សេវាចុះឈ្មោះនៅឡើយទេ"
            subtitle="តើអ្នកជាជាង ឬ អ្នកជំនាញសេវាកម្មមែនទេ? ចុះឈ្មោះជាអ្នកផ្តល់សេវាឥឡូវនេះ!"
            actionLabel="ចុះឈ្មោះជាអ្នកផ្តល់សេវា"
            actionHref="/register?role=PROVIDER"
          />
        )}
      </section>

      {/* How It Works - Clean Cambodian 4 Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-2xs">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t("howItWorks")}
            </h2>
            <p className="text-xs text-slate-500">
              ដំណោះស្រាយងាយៗ ៤ ជំហានដើម្បីដោះស្រាយបញ្ហាក្នុងគេហដ្ឋានរបស់អ្នក
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">{t("step1Title")}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t("step1Desc")}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">{t("step2Title")}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t("step2Desc")}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">{t("step3Title")}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t("step3Desc")}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                4
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">{t("step4Title")}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t("step4Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Onboarding Banner - Professional & Trustworthy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold">
              តើអ្នកជាអ្នកជំនាញ ឬ ជាងសេវាកម្មមែនទេ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              បង្កើនចំណូលរបស់អ្នកដោយទទួលការងារពីអតិថិជននៅជិតអ្នក។ ចុះឈ្មោះជាអ្នកផ្តល់សេវាដោយឥតគិតថ្លៃ!
            </p>
          </div>
          <Link
            href="/register?role=PROVIDER"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs rounded-xl transition shrink-0"
          >
            ចុះឈ្មោះជាអ្នកផ្តល់សេវា
          </Link>
        </div>
      </section>
    </div>
  );
}

