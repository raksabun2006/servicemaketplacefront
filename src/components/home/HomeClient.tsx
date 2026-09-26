"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { providerApi } from "@/lib/api/provider.api";
import { ServiceRequestSummaryResponse } from "@/types/service-request";
import { ProviderProfileResponse } from "@/types/provider";
import { SERVICE_CATEGORIES_SEO, LOCATIONS_SEO } from "@/lib/seo";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Wrench,
  Snowflake,
  Droplets,
  Zap,
  Sparkles,
  Laptop,
  CheckCircle2,
  MapPin,
  Clock,
  Star,
  Search,
  BadgeCheck,
  CreditCard,
  PhoneCall,
  X,
  ShieldCheck,
  DollarSign,
  Users,
  Compass,
  ArrowRight,
} from "lucide-react";

export default function HomeClient() {
  const router = useRouter();
  const { language } = useLanguage();
  const isKm = language === "km";

  // Real backend data states
  const [requests, setRequests] = useState<ServiceRequestSummaryResponse[]>([]);
  const [providers, setProviders] = useState<ProviderProfileResponse[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Hero Carousel Slide
  const [currentSlide, setCurrentSlide] = useState(0);

  // Pillars Carousel / Slider
  const [pillarPage, setPillarPage] = useState(0);

  // FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Post Request Quick Modal / State
  const [quickPostModalOpen, setQuickPostModalOpen] = useState(false);
  const [searchProblemInput, setSearchProblemInput] = useState("");

  // Auto-advance hero slide every 7s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real requests & providers from API
  useEffect(() => {
    serviceRequestApi
      .browse({ page: 0, size: 6, status: "OPEN" })
      .then((res) => setRequests(res.content || []))
      .catch(() => setRequests([]))
      .finally(() => setLoadingRequests(false));

    providerApi
      .list({ page: 0, size: 4 })
      .then((res) => setProviders(res.content || []))
      .catch(() => setProviders([]));
  }, []);

  // Hero Slides Data
  const heroSlides = [
    {
      category: "ថ្នាលសេវាកម្មកម្ពុជា",
      title: "ស្វែងរកជាង និងសេវាកម្មដែលអ្នកត្រូវការ",
      description:
        "ស្វែងរកអ្នកផ្តល់សេវាកម្មនៅជិតអ្នក និងទាក់ទងជាងដែលសាកសមនឹងតម្រូវការរបស់អ្នក។ ជួសជុលម៉ាស៊ីនត្រជាក់ កុំព្យូទ័រ អគ្គិសនី ទឹក សម្អាត និងសេវាកម្មជាច្រើនទៀត។",
      buttonText: "ស្វែងយល់បន្ថែម",
      link: "/services",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    },
    {
      category: "សម្រាប់ជាងជំនាញ និងក្រុមហ៊ុនសេវាកម្ម",
      title: "អ្នកផ្តល់សេវាកម្ម",
      description:
        "អ្នកជាជាងជំនាញ ឬក្រុមហ៊ុនសេវាកម្មដែលមានគុណវុឌ្ឍិគ្រប់គ្រាន់? ចុះឈ្មោះចូលរួមថ្នាលសេវាខ្មែរ ដើម្បីទទួលបានការងាររាល់ថ្ងៃ រកចំណូលបន្ថែម និងពង្រីកមូលដ្ឋានអតិថិជន។",
      buttonText: "ចុះឈ្មោះជាអ្នកផ្តល់សេវា",
      link: "/register?role=PROVIDER",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    },
    {
      category: "សុវត្ថិភាពគេហដ្ឋាន និងតម្លាភាព",
      title: "ការធានាគុណភាព ១០០%",
      description:
        "ជាងជំនាញទាំងអស់ត្រូវបានផ្ទៀងផ្ទាត់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ (National ID) តម្លៃមានតម្លាភាព គ្មានការលួចដំឡើងថ្លៃ និងមានការធានាជួសជុលឡើងវិញដោយឥតគិតថ្លៃ។",
      buttonText: "ស្វែងយល់អំពីយើង",
      link: "/about",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // 6 Core Pillars Data with links to SEO category pages
  const pillarsData = [
    {
      id: "p1",
      category: "AC_REPAIR",
      slug: "ac-repair",
      title: "ម៉ាស៊ីនត្រជាក់ & ទូរទឹកកក",
      description:
        "លាងសម្អាត ជួសជុលម៉ាស៊ីនមិនត្រជាក់ បញ្ចូលហ្គាស ដោះដំឡើង និងថែទាំប្រព័ន្ធត្រជាក់គេហដ្ឋាន និងការិយាល័យ។",
      iconType: "ac",
      link: "/services/ac-repair",
    },
    {
      id: "p2",
      category: "PLUMBING",
      slug: "plumbing",
      title: "ប្រព័ន្ធទឹក & បំពង់ទុយោ",
      description:
        "ជួសជុលទុយោទឹកបែក លេចទឹក កកស្ទះលូ ដំឡើងម៉ូទ័រទឹក និងបរិក្ខារបន្ទប់ទឹកគ្រប់ប្រភេទយ៉ាងរហ័ស។",
      iconType: "plumbing",
      link: "/services/plumbing",
    },
    {
      id: "p3",
      category: "ELECTRICAL",
      slug: "electrical",
      title: "ប្រព័ន្ធអគ្គិសនី & ភ្លើង",
      description:
        "ជួសជុលឆ្លងភ្លើង ដាច់ភ្លើង រៀបចំបណ្តាញខ្សែភ្លើង ដំឡើងកង្ហារ អំពូល និងប្រអប់សុវត្ថិភាពស្តង់ដារ។",
      iconType: "electrical",
      link: "/services/electrical",
    },
    {
      id: "p4",
      category: "CLEANING",
      slug: "cleaning",
      title: "សេវាសម្អាត & បោកពូក",
      description:
        "សម្អាតគេហដ្ឋាន ខុនដូ ការិយាល័យ បោកពូក សាឡុង និងសម្អាតកម្ចាត់មេរោគដោយក្រុមការងារជំនាញ។",
      iconType: "cleaning",
      link: "/services/cleaning",
    },
    {
      id: "p5",
      category: "APPLIANCE_REPAIR",
      slug: "appliance-repair",
      title: "ជួសជុលគ្រឿងអេឡិចត្រូនិក & កុំព្យូទ័រ",
      description:
        "ជួសជុលកុំព្យូទ័រ ម៉ាស៊ីនបោកខោអាវ ទូរទស្សន៍ឆ្លាតវៃ និងឧបករណ៍ប្រើប្រាស់អគ្គិសនីគ្រប់ប្រភេទ។",
      iconType: "appliance",
      link: "/services/appliance-repair",
    },
    {
      id: "p6",
      category: "CARPENTRY",
      slug: "carpentry",
      title: "ជាងឈើ ទ្វារបង្អួច & សំណង់",
      description:
        "ដំឡើងគ្រឿងសង្ហារឹម តុ ទូ ជួសជុលសោទ្វារ បង្អួច ពិដាន និងការ៉ូបាក់បែកដោយជាងមានថ្វីដៃ។",
      iconType: "carpentry",
      link: "/services/carpentry",
    },
  ];

  // Official FAQ Data
  const faqs = [
    {
      q: "តើខ្ញុំអាចស្វែងរកជាង និងសេវាកម្មនៅកម្ពុជាដោយរបៀបណា?",
      a: "លោកអ្នកគ្រាន់តែចុចលើប៊ូតុង «+ បង្ហោះបញ្ហារបស់អ្នក» ឬជ្រើសរើសប្រភេទសេវាកម្មដែលអ្នកត្រូវការ រួចបញ្ជាក់ពីទីតាំង និងភ្ជាប់រូបភាព។ ជាងជំនាញនៅក្បែរអ្នកនឹងផ្តល់តម្លៃជូនក្នុងរយៈពេល ១០ ទៅ ១៥ នាទី។",
    },
    {
      q: "តើជាងជំនាញទាំងអស់ត្រូវបានផ្ទៀងផ្ទាត់ដោយរបៀបណា?",
      a: "ជាងជំនាញទាំងអស់នៅលើថ្នាល Khmer Service (ខ្មែរ សេវា) ត្រូវឆ្លងកាត់ការផ្ទៀងផ្ទាត់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ (National ID) ពិនិត្យប្រវត្តិរូប និងទទួលបានការវាយតម្លៃពិតពីអតិថិជន។",
    },
    {
      q: "តើតម្លៃសេវាកម្មមានតម្លាភាពដែរឬទេ?",
      a: "តម្លៃទាំងអស់គឺមានតម្លាភាព ១០០%! អ្នកនឹងទទួលបានការផ្តល់តម្លៃប្រកួតប្រជែងជាច្រើនជម្រើសមុនពេលសម្រេចចិត្តជួល គ្មានការគិតថ្លៃលាក់កំបាំងឡើយ។",
    },
    {
      q: "តើមានការធានាលើការជួសជុលដែរឬទេ ប្រសិនបើមិនពេញចិត្ត?",
      a: "ថ្នាលសេវាខ្មែរមាន «គោលការណ៍ធានាគុណភាព»។ ប្រសិនបើបញ្ហាមិនទាន់ត្រូវបានដោះស្រាយបានល្អ ជាងជំនាញនឹងទទួលខុសត្រូវពិនិត្យជួសជុលឡើងវិញដោយឥតគិតថ្លៃ។",
    },
    {
      q: "តើការទូទាត់ប្រាក់ធ្វើឡើងតាមរបៀបណា?",
      a: "លោកអ្នកអាចទូទាត់ប្រាក់យ៉ាងងាយស្រួល និងមានសុវត្ថិភាពតាមរយៈ Bakong KHQR ឬសាច់ប្រាក់សុទ្ធ ក្រោយពេលជាងបានជួសជុលរួចរាល់ និងលោកអ្នកពេញចិត្ត។",
    },
  ];

  return (
    <div className="bg-white text-slate-800 font-sans">
      {/* 1. HERO SECTION WITH ACCESSIBLE H1 */}
      <section className="relative overflow-hidden bg-white pt-8 sm:pt-12 pb-16 lg:pb-24 border-b border-slate-100">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none">
            <path
              d="M-50 200 L 250 200 L 320 280 L 520 280 M 180 200 L 240 140 L 400 140 M 350 280 L 350 360 L 480 360"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <circle cx="250" cy="200" r="4" fill="#94a3b8" />
            <circle cx="320" cy="280" r="4" fill="#94a3b8" />
            <circle cx="520" cy="280" r="4" fill="#94a3b8" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
              <span className="text-sm sm:text-base font-semibold text-blue-600 block tracking-wide">
                {heroSlides[currentSlide].category}
              </span>

              {/* Primary SEO H1 Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#104ccb] tracking-tight leading-tight">
                {heroSlides[currentSlide].title}
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed font-normal max-w-xl">
                {heroSlides[currentSlide].description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={heroSlides[currentSlide].link}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-xl bg-[#104ccb] hover:bg-[#0a3ca8] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  {heroSlides[currentSlide].buttonText}
                </Link>

                <button
                  type="button"
                  onClick={() => setQuickPostModalOpen(true)}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#104ccb] font-bold text-xs sm:text-sm border border-blue-200 transition cursor-pointer gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>ស្វែងរកសេវាកម្មរហ័ស</span>
                </button>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-6">
              <div className="relative bg-white rounded-3xl p-3 sm:p-5 shadow-xl border border-slate-200">
                <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroSlides[currentSlide].image}
                    alt="ជាងជំនាញផ្តល់សេវាកម្មនៅកម្ពុជា"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-semibold text-blue-200">ខ្មែរ សេវា (Khmer Service)</p>
                    <p className="text-sm sm:text-base font-bold">ជាងជំនាញមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវទូទាំងប្រទេស</p>
                  </div>
                </div>

                {/* Hero Slide Controls */}
                <div className="flex items-center justify-between mt-4 px-2">
                  <div className="flex gap-2">
                    {heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentSlide === idx ? "w-8 bg-[#104ccb]" : "w-2 bg-slate-200"
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEO-FRIENDLY POPULAR CATEGORIES SECTION */}
      <section className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#104ccb] uppercase tracking-widest">
                ប្រភេទសេវាកម្មពេញនិយម
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#104ccb] mt-1">
                សេវាកម្មជួសជុល និងថែទាំគេហដ្ឋាន
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                ស្វែងរកជាងជំនាញ និងសេវាកម្មតាមតម្រូវការជាក់ស្តែងរបស់អ្នក
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[#104ccb] font-bold text-xs hover:bg-blue-50 transition shrink-0"
            >
              <span>មើលសេវាកម្មទាំងអស់</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillarsData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-[#104ccb] group-hover:text-white transition-colors">
                    {item.iconType === "ac" && <Snowflake className="w-6 h-6" />}
                    {item.iconType === "plumbing" && <Droplets className="w-6 h-6" />}
                    {item.iconType === "electrical" && <Zap className="w-6 h-6" />}
                    {item.iconType === "cleaning" && <Sparkles className="w-6 h-6" />}
                    {item.iconType === "appliance" && <Laptop className="w-6 h-6" />}
                    {item.iconType === "carpentry" && <Wrench className="w-6 h-6" />}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#104ccb] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">ស្វែងរកជាងជំនាញ</span>
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#104ccb] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>ស្វែងរក</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CAMBODIAN SERVICE LOCATIONS HUB */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#104ccb] uppercase tracking-widest">
                តំបន់គ្របដណ្តប់សេវាកម្ម
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#104ccb] mt-1">
                ស្វែងរកជាងជំនាញតាមរាជធានី និងខេត្ត
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                ស្វែងរកជាងជួសជុលដែលនៅជិតអ្នកបំផុតតាមបណ្តារាជធានី និងខេត្តនានាក្នុងប្រទេសកម្ពុជា
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.values(LOCATIONS_SEO).map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-300 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-2xs text-[#104ccb] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#104ccb] transition-colors leading-tight">
                  {loc.nameKm}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{loc.nameEn}</p>
              </Link>
            ))}
          </div>

          {/* Phnom Penh Districts Quick Links */}
          <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-3">
              ខណ្ឌពេញនិយមក្នុងរាជធានីភ្នំពេញ៖
            </p>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS_SEO["phnom-penh"].districts?.map((d) => (
                <Link
                  key={d.slug}
                  href={`/locations/phnom-penh?district=${encodeURIComponent(d.nameEn)}`}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 hover:text-blue-600 hover:border-blue-300 transition"
                >
                  {d.nameKm} ({d.nameEn})
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. RECENT REAL SERVICE REQUESTS (Live API) */}
      <section className="py-16 sm:py-20 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#104ccb] uppercase tracking-widest">
                សំណើការងារផ្ទាល់
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#104ccb] mt-1">
                សេវាកម្មដែលកំពុងត្រូវការជាងជំនាញ
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                អតិថិជនទើបតែបានបង្ហោះបញ្ហានៅថ្ងៃនេះ — ជាងជំនាញអាចផ្តល់តម្លៃ និងទទួលការងារបានភ្លាមៗ
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[#104ccb] font-bold text-xs hover:bg-blue-50 transition shrink-0"
            >
              <span>{isKm ? `មើលសំណើទាំងអស់ (${requests.length})` : `View All Requests (${requests.length})`}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.length > 0 ? (
              requests.slice(0, 6).map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {req.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {req.budgetMax ? `$${req.budgetMax}` : req.budgetMin ? `$${req.budgetMin}` : "ចរចាតម្លៃ"}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#104ccb] transition-colors mb-2 line-clamp-1">
                      {req.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {req.offerCount !== undefined ? `ទទួលបានការផ្តល់តម្លៃចំនួន ${req.offerCount} នាក់` : "កំពុងរង់ចាំការផ្តល់តម្លៃ"}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{req.district || req.city || "រាជធានីភ្នំពេញ"}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">កំពុងរង់ចាំការផ្តល់តម្លៃ</span>
                    <Link
                      href={`/services/${req.id}`}
                      className="px-4 py-2 rounded-lg bg-[#104ccb] hover:bg-[#0a3ca8] text-white text-xs font-bold transition shadow-xs"
                    >
                      {isKm ? "មើលបញ្ហាលម្អិត" : "See Problem Details"}
                    </Link>
                  </div>
                </div>
              ))
            ) : loadingRequests ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs animate-pulse space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-24 bg-slate-200 rounded-full" />
                    <div className="h-5 w-16 bg-slate-200 rounded-full" />
                  </div>
                  <div className="h-5 w-4/5 bg-slate-200 rounded" />
                  <div className="h-4 w-3/5 bg-slate-200 rounded" />
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-8 w-28 bg-slate-200 rounded-lg" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 px-6 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {isKm ? "មិនទាន់មានសំណើសេវាកម្មនៅឡើយទេ" : "No active service requests yet"}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
                  {isKm
                    ? "សំណើដែលអតិថិជនបង្ហោះនឹងបង្ហាញនៅទីនេះផ្ទាល់ពីប្រព័ន្ធ។ សូមបង្ហោះបញ្ហារបស់អ្នកឥឡូវនេះ!"
                    : "Requests posted by customers will appear here directly from the API. Post your problem now!"}
                </p>
                <Link
                  href="/customer/requests/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#104ccb] hover:bg-[#0a3ca8] text-white text-xs font-bold transition shadow-xs"
                >
                  <span>{isKm ? "+ បង្ហោះបញ្ហារបស់អ្នក" : "+ Post Your Problem"}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#104ccb]">
              តើលោកអ្នកមានចម្ងល់ទាក់ទងនឹងថ្នាលសេវាខ្មែរឬទេ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              សំណួរ និងចម្លើយផ្លូវការអំពីដំណើរការជួសជុល ការទូទាត់ និងការធានាសុវត្ថិភាព
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition"
                  >
                    <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-blue-600 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUICK POST MODAL */}
      {quickPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setQuickPostModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-[#104ccb] mb-1 block">ស្វែងរកសេវាកម្មរហ័ស</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">តើអ្នកមានបញ្ហាអ្វីត្រូវជួសជុល?</h3>
            <p className="text-xs text-slate-600 mb-4">
              វាយបញ្ចូលបញ្ហារបស់អ្នកដើម្បីស្វែងរកជាងជំនាញដែលនៅជិតអ្នកបំផុត
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setQuickPostModalOpen(false);
                router.push(`/customer/requests/create?problem=${encodeURIComponent(searchProblemInput)}`);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                required
                value={searchProblemInput}
                onChange={(e) => setSearchProblemInput(e.target.value)}
                placeholder="ឧ. ម៉ាស៊ីនត្រជាក់មិនត្រជាក់, លេចទុយោទឹក, ឆ្លងភ្លើង..."
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#104ccb] hover:bg-[#0a3ca8] text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                >
                  បន្តទៅមុខ →
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPostModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  បិទ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
