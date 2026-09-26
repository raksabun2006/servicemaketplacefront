"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { providerApi } from "@/lib/api/provider.api";
import { ServiceRequestSummaryResponse } from "@/types/service-request";
import { ProviderProfileResponse } from "@/types/provider";
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
  PlusCircle,
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
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isKm = language === "km";

  // Real backend data states
  const [requests, setRequests] = useState<ServiceRequestSummaryResponse[]>([]);
  const [providers, setProviders] = useState<ProviderProfileResponse[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Hero Carousel Slide (Screenshot 1 UI layout)
  const [currentSlide, setCurrentSlide] = useState(0);

  // Pillars Carousel / Slider (Screenshot 2 UI layout)
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

  // Hero Slides Data (Service Marketplace content in Screenshot 1 UI structure)
  const heroSlides = [
    {
      category: "ថ្នាលសេវាកម្មកម្ពុជា",
      title: "អ្នកត្រូវការសេវាកម្ម",
      description:
        "ជួបបញ្ហាខូចឧបករណ៍ប្រើប្រាស់ ម៉ាស៊ីនត្រជាក់មិនត្រជាក់ ឬលេចទុយោទឹក? បង្ហោះបញ្ហារបស់អ្នកភ្លាមៗ ទទួលការផ្តល់តម្លៃពីជាងជំនាញដែលបានផ្ទៀងផ្ទាត់ក្នុងរយៈពេល ១៥ នាទី។",
      buttonText: "ស្វែងយល់បន្ថែម",
      link: "/customer/requests/create",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    },
    {
      category: "សម្រាប់ជាងជំនាញ និងក្រុមហ៊ុនសេវាកម្ម",
      title: "អ្នកផ្តល់សេវាកម្ម",
      description:
        "អ្នកជាជាងជំនាញ ឬក្រុមហ៊ុនសេវាកម្មដែលមានគុណវុឌ្ឍិគ្រប់គ្រាន់? ចុះឈ្មោះចូលរួមថ្នាលសេវាខ្មែរ ដើម្បីទទួលបានការងាររាល់ថ្ងៃ រកចំណូលបន្ថែម និងពង្រីកមូលដ្ឋានអតិថិជន។",
      buttonText: "ស្វែងយល់បន្ថែម",
      link: "/register?role=PROVIDER",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    },
    {
      category: "សុវត្ថិភាពគេហដ្ឋាន និងតម្លាភាព",
      title: "ការធានាគុណភាព ១០០%",
      description:
        "ជាងជំនាញទាំងអស់ត្រូវបានផ្ទៀងផ្ទាត់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ (National ID) តម្លៃមានតម្លាភាព គ្មានការលួចដំឡើងថ្លៃ និងមានការធានាជួសជុលឡើងវិញដោយឥតគិតថ្លៃ។",
      buttonText: "ស្វែងយល់បន្ថែម",
      link: "/about",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // 4 Core Pillars Data (Service Marketplace content in Screenshot 2 UI structure)
  const pillarsData = [
    {
      id: "p1",
      category: "AC_REPAIR",
      title: "ម៉ាស៊ីនត្រជាក់ & ទូរទឹកកក",
      description:
        "លាងសម្អាត ជួសជុលម៉ាស៊ីនមិនត្រជាក់ បញ្ចូលហ្គាស ដោះដំឡើង និងថែទាំប្រព័ន្ធត្រជាក់គេហដ្ឋាន និងការិយាល័យ។",
      iconType: "ac",
      link: "/services?category=AC_REPAIR",
    },
    {
      id: "p2",
      category: "PLUMBING",
      title: "ប្រព័ន្ធទឹក & បំពង់ទុយោ",
      description:
        "ជួសជុលទុយោទឹកបែក លេចទឹក កកស្ទះលូ ដំឡើងម៉ូទ័រទឹក និងបរិក្ខារបន្ទប់ទឹកគ្រប់ប្រភេទយ៉ាងរហ័ស។",
      iconType: "plumbing",
      link: "/services?category=PLUMBING",
    },
    {
      id: "p3",
      category: "ELECTRICAL",
      title: "ប្រព័ន្ធអគ្គិសនី & ភ្លើង",
      description:
        "ជួសជុលឆ្លងភ្លើង ដាច់ភ្លើង រៀបចំបណ្តាញខ្សែភ្លើង ដំឡើងកង្ហារ អំពូល និងប្រអប់សុវត្ថិភាពស្តង់ដារ។",
      iconType: "electrical",
      link: "/services?category=ELECTRICAL",
    },
    {
      id: "p4",
      category: "CLEANING",
      title: "សម្អាតគេហដ្ឋាន & ការិយាល័យ",
      description:
        "សេវាសម្អាតទូទៅ បោកពូក សាឡុង កម្ចាត់ធូលី សម្អាតផ្ទះបាយ និងសម្អាតអគារមុនពេលចូលរស់នៅ។",
      iconType: "cleaning",
      link: "/services?category=CLEANING",
    },
    {
      id: "p5",
      category: "APPLIANCE_REPAIR",
      title: "កុំព្យូទ័រ & ឧបករណ៍អេឡិចត្រូនិក",
      description:
        "ជួសជុលកុំព្យូទ័រ ម៉ាស៊ីនបោកខោអាវ ទូរទស្សន៍ឆ្លាតវៃ និងឧបករណ៍ប្រើប្រាស់អគ្គិសនីគ្រប់ប្រភេទ។",
      iconType: "appliance",
      link: "/services?category=APPLIANCE_REPAIR",
    },
    {
      id: "p6",
      category: "CARPENTRY",
      title: "ជាងឈើ ទ្វារបង្អួច & សំណង់",
      description:
        "ដំឡើងគ្រឿងសង្ហារឹម តុ ទូ ជួសជុលសោទ្វារ បង្អួច ពិដាន និងការ៉ូបាក់បែកដោយជាងមានថ្វីដៃ។",
      iconType: "carpentry",
      link: "/services?category=CARPENTRY",
    },
  ];

  // Official FAQ Data (Service Marketplace content)
  const faqs = [
    {
      q: "តើខ្ញុំអាចបង្ហោះបញ្ហា និងស្វែងរកជាងជំនាញដោយរបៀបណា?",
      a: "លោកអ្នកគ្រាន់តែចុចលើប៊ូតុង «+ បង្ហោះបញ្ហារបស់អ្នក» រួចបញ្ជាក់ពីប្រភេទបញ្ហា ទីតាំង និងភ្ជាប់រូបភាព។ ជាងជំនាញនៅក្បែរអ្នកនឹងផ្តល់តម្លៃជូនក្នុងរយៈពេល ១០ ទៅ ១៥ នាទី។",
    },
    {
      q: "តើជាងជំនាញទាំងអស់ត្រូវបានផ្ទៀងផ្ទាត់ដោយរបៀបណា?",
      a: "ជាងជំនាញទាំងអស់នៅលើថ្នាល Khmer Service Marketplace ត្រូវឆ្លងកាត់ការផ្ទៀងផ្ទាត់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ (National ID) ពិនិត្យប្រវត្តិរូប និងទទួលបានការវាយតម្លៃពិតពីអតិថិជន។",
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
      {/* 1. HERO SECTION (Screenshot 1 UI Layout with Service Marketplace Content) */}
      <section className="relative overflow-hidden bg-white pt-8 sm:pt-12 pb-16 lg:pb-24 border-b border-slate-100">
        {/* Background Circuit Schematic Line Art (Screenshot 1) */}
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
            <circle cx="240" cy="140" r="4" fill="#94a3b8" />
            <circle cx="480" cy="360" r="4" fill="#94a3b8" />

            {/* Gear Outline */}
            <g transform="translate(320, 380) scale(0.6)" opacity="0.6">
              <circle cx="50" cy="50" r="30" stroke="#94a3b8" strokeWidth="3" fill="none" />
              <path
                d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50 M22 22 L29 29 M71 71 L78 78 M22 78 L29 71 M71 29 L78 22"
                stroke="#94a3b8"
                strokeWidth="4"
              />
            </g>

            {/* Chevrons */}
            <path d="M220 300 L230 305 L220 310 M235 300 L245 305 L235 310" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content (Screenshot 1 Layout: Category, Big Title, Description, Button) */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
              <span className="text-sm sm:text-base font-medium text-slate-700 block tracking-wide">
                {heroSlides[currentSlide].category}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#104ccb] tracking-tight leading-tight">
                {heroSlides[currentSlide].title}
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed font-normal max-w-xl">
                {heroSlides[currentSlide].description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={heroSlides[currentSlide].link}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-lg bg-[#104ccb] hover:bg-[#0a3ca8] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  {heroSlides[currentSlide].buttonText}
                </Link>

                <button
                  type="button"
                  onClick={() => setQuickPostModalOpen(true)}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#104ccb] font-bold text-xs sm:text-sm border border-blue-200 transition cursor-pointer gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>ស្វែងរកសេវាកម្មរហ័ស</span>
                </button>
              </div>
            </div>

            {/* Right Graphic Frame (Screenshot 1 Layout: Angled Blue polygon + photo + red accent) */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-[480px] aspect-[4/3] sm:aspect-[1.15/1]">
                {/* Royal Blue Angled Geometric Polygon Shape in background */}
                <div
                  className="absolute -top-6 -left-6 w-3/5 h-full bg-[#104ccb] rounded-2xl transform -skew-x-12 z-0"
                  style={{ borderRadius: "16px" }}
                ></div>

                {/* Circuit wire diagram background on photo frame */}
                <div className="absolute -top-4 -right-4 w-32 h-32 border-t-2 border-r-2 border-slate-300 z-0"></div>

                {/* Framed Photo with rounded border */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroSlides[currentSlide].image}
                    alt={heroSlides[currentSlide].title}
                    className="w-full h-full object-cover object-center transition-all duration-700"
                  />
                  {/* Small red triangle accent in bottom right (Screenshot 1) */}
                  <div
                    className="absolute bottom-0 right-0 w-12 h-12 bg-[#dc2626] z-20"
                    style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Pagination Dots (Screenshot 1) */}
          <div className="flex items-center justify-center space-x-2.5 mt-10">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? "w-3.5 h-3.5 bg-[#104ccb]"
                    : "w-2.5 h-2.5 bg-blue-300 hover:bg-blue-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. STRATEGIC BANNER (Screenshot 1 Bottom: Curved top blue container with 3 cards) */}
      <section className="bg-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Deep Royal Blue Card with Curved Top Border (rounded-t-[40px]) */}
          <div className="bg-[#104ccb] rounded-t-[32px] sm:rounded-t-[40px] rounded-b-2xl text-white p-8 sm:p-12 md:p-14 text-center shadow-xl relative overflow-hidden">
            {/* Subtle Circuit traces */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 300" fill="none">
                <path d="M0 150 L300 150 L400 50 L800 50 M200 150 L300 250 L600 250" stroke="#ffffff" strokeWidth="2" />
                <circle cx="300" cy="150" r="5" fill="#ffffff" />
                <circle cx="400" cy="50" r="5" fill="#ffffff" />
                <circle cx="300" cy="250" r="5" fill="#ffffff" />
              </svg>
            </div>

            <div className="relative max-w-4xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                អំពីថ្នាលសេវាកម្ម និងជាងជំនាញកម្ពុជា
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-blue-100 leading-relaxed font-normal max-w-3xl mx-auto">
                ថ្នាលសេវាកម្មកម្ពុជា (Khmer Service Marketplace) ត្រូវបានបង្កើតឡើងដើម្បីលើកកម្ពស់ស្តង់ដារសេវាកម្មជួសជុល និងថែទាំគេហដ្ឋាននៅកម្ពុជា តាមរយៈការតភ្ជាប់អតិថិជនជាមួយជាងជំនាញដែលមានទំនួលខុសត្រូវខ្ពស់ តម្លៃតម្លាភាព គ្មានការលួចដំឡើងថ្លៃ និងការធានាគុណភាព ១០០%។
              </p>
            </div>

            {/* 3 Strategic Service Standards Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
              {/* Card 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition">
                <div className="text-xs font-bold text-amber-300 uppercase mb-2">ស្តង់ដារទី១</div>
                <h4 className="text-sm font-bold text-white mb-2">ផ្ទៀងផ្ទាត់អត្តសញ្ញាណប័ណ្ណ ១០០%</h4>
                <p className="text-xs text-blue-100 italic leading-relaxed">
                  “ជាងជំនាញទាំងអស់ត្រូវបានត្រួតពិនិត្យឯកសារសម្គាល់ខ្លួនសញ្ជាតិខ្មែរ និងប្រវត្តិការងារមុនពេលអនុញ្ញាតឱ្យទទួលការងារ។”
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition">
                <div className="text-xs font-bold text-cyan-300 uppercase mb-2">ស្តង់ដារទី២</div>
                <h4 className="text-sm font-bold text-white mb-2">តម្លៃសមរម្យ និងតម្លាភាព ១០០%</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  “ទទួលបានការផ្តល់តម្លៃប្រកួតប្រជែងជាច្រើនជម្រើស គ្មានការលួចដំឡើងថ្លៃ និងទូទាត់ងាយស្រួលតាម Bakong KHQR។”
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition">
                <div className="text-xs font-bold text-emerald-300 uppercase mb-2">ស្តង់ដារទី៣</div>
                <h4 className="text-sm font-bold text-white mb-2">ការធានាសេវាកម្ម និងសុវត្ថិភាព</h4>
                <p className="text-xs text-blue-100 italic leading-relaxed">
                  “ធានាជួសជុលឡើងវិញដោយឥតគិតថ្លៃបើមិនពេញចិត្ត រួមជាមួយការគាំទ្រតាមទូរស័ព្ទ ២៤ ម៉ោងក្នុងមួយថ្ងៃ។”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ONE-STOP-SHOP: 4 PILLARS CAROUSEL (Screenshot 2 UI Layout with Service Marketplace Content) */}
      <section id="pillars-section" className="py-16 sm:py-24 bg-[#f8fafc] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header text matching Screenshot 2 format for Service Marketplace */}
          <div className="text-center max-w-4xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#104ccb] tracking-tight">
              ថ្នាលសេវាកម្ម និងជាងជំនាញកម្ពុជា
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              ថ្នាលសេវាកម្មកម្ពុជា គឺជាកន្លែងប្រមូលផ្តុំ (One-Stop-Shop) សេវាកម្មជួសជុល និង ថែទាំគេហដ្ឋាន ដែលអតិថិជនអាច<br className="hidden sm:inline" />
              ស្វែងរកជាងជំនាញផ្អែកទៅតាមប្រភេទបញ្ហា និង ទីតាំងជាក់ស្តែងនៅក្បែរអ្នកបំផុត<br className="hidden sm:inline" />
              តាមរយៈអនឡាញ។ តាមរយៈថ្នាលនេះ លោកអ្នក អាច
            </p>
          </div>

          {/* Cards Row with Navigation Arrows (Screenshot 2) */}
          <div className="relative">
            {/* Left Chevron Button */}
            <button
              type="button"
              onClick={() => setPillarPage((prev) => Math.max(0, prev - 1))}
              disabled={pillarPage === 0}
              className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 text-blue-600 items-center justify-center hover:bg-blue-50 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Chevron Button */}
            <button
              type="button"
              onClick={() => setPillarPage((prev) => Math.min(2, prev + 1))}
              disabled={pillarPage === 2}
              className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#104ccb] text-white shadow-lg items-center justify-center hover:bg-[#0a3ca8] transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* 4 Cards Grid (Screenshot 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillarsData.slice(pillarPage, pillarPage + 4).map((pillar) => (
                <div
                  key={pillar.id}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-[380px] group"
                >
                  {/* Top Text Content */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#104ccb] mb-3 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Bottom 3D-Style Icon / Illustration */}
                  <div className="flex justify-between items-end pt-4 pb-2 border-t border-slate-50">
                    <Link
                      href={pillar.link}
                      className="text-xs font-bold text-[#104ccb] hover:underline"
                    >
                      ស្វែងរកជាង →
                    </Link>

                    {pillar.iconType === "ac" && (
                      <svg viewBox="0 0 100 80" className="w-20 h-16 drop-shadow-sm">
                        <rect x="15" y="20" width="70" height="35" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                        <rect x="25" y="42" width="50" height="4" rx="2" fill="#0284c7" />
                        <path d="M30 48 Q 50 65 70 48" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <circle cx="75" cy="28" r="3" fill="#22c55e" />
                      </svg>
                    )}

                    {pillar.iconType === "plumbing" && (
                      <svg viewBox="0 0 100 80" className="w-20 h-16 drop-shadow-sm">
                        <path d="M20 20 L45 20 L45 55 L75 55" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" fill="none" />
                        <circle cx="45" cy="38" r="7" fill="#60a5fa" />
                        <path d="M75 45 L85 55 L75 65 Z" fill="#2563eb" />
                        <circle cx="75" cy="55" r="4" fill="#38bdf8" />
                      </svg>
                    )}

                    {pillar.iconType === "electrical" && (
                      <svg viewBox="0 0 100 80" className="w-20 h-16 drop-shadow-sm">
                        <circle cx="50" cy="40" r="28" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                        <path d="M52 22 L38 42 L48 42 L44 58 L62 38 L52 38 Z" fill="#f59e0b" />
                      </svg>
                    )}

                    {pillar.iconType === "cleaning" && (
                      <svg viewBox="0 0 100 80" className="w-20 h-16 drop-shadow-sm">
                        <rect x="25" y="25" width="50" height="35" rx="8" fill="#ccfbf1" stroke="#0d9488" strokeWidth="2" />
                        <circle cx="45" cy="38" r="4" fill="#0d9488" />
                        <circle cx="58" cy="46" r="3" fill="#0d9488" />
                        <path d="M60 20 L66 12 L72 20 Z" fill="#14b8a6" />
                      </svg>
                    )}

                    {pillar.iconType === "appliance" && (
                      <svg viewBox="0 0 100 80" className="w-20 h-16 drop-shadow-sm">
                        <rect x="20" y="15" width="60" height="42" rx="4" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
                        <rect x="35" y="60" width="30" height="4" rx="2" fill="#94a3b8" />
                        <circle cx="50" cy="36" r="10" fill="#818cf8" />
                      </svg>
                    )}

                    {pillar.iconType === "carpentry" && (
                      <svg viewBox="0 0 100 80" className="w-20 h-16 drop-shadow-sm">
                        <rect x="25" y="15" width="50" height="50" rx="4" fill="#ffedd5" stroke="#ea580c" strokeWidth="2" />
                        <path d="M35 15 L35 65 M25 40 L75 40" stroke="#ea580c" strokeWidth="2" />
                        <circle cx="60" cy="48" r="3" fill="#ea580c" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots (Screenshot 2) */}
          <div className="flex items-center justify-center space-x-2.5 mt-8">
            {[0, 1].map((dot) => (
              <button
                key={dot}
                type="button"
                onClick={() => setPillarPage(dot)}
                className={`transition-all rounded-full cursor-pointer ${
                  pillarPage === dot ? "w-3 h-3 bg-[#104ccb]" : "w-2.5 h-2.5 bg-blue-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. TECHNICIAN RECRUITMENT SECTION (Screenshot 4 UI Layout with Service Marketplace Content) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content (Screenshot 4 Layout) */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5 text-left">
              <span className="text-sm sm:text-base font-medium text-slate-700 block tracking-wide">
                ឱកាសការងារ & បង្កើនចំណូល
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#104ccb] tracking-tight leading-tight">
                ចុះឈ្មោះជាជាងជំនាញ
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed font-normal">
                ចុះឈ្មោះធ្វើជាអ្នកផ្តល់សេវា ឬជាងជំនាញ ដើម្បីទទួលបានការងាររាល់ថ្ងៃ បង្កើនចំណូលរហូតដល់ $500 - $1,500/ខែ និងពង្រីកកេរ្តិ៍ឈ្មោះវិជ្ជាជីវៈរបស់អ្នក។
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/register?role=PROVIDER"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#104ccb] hover:bg-[#0a3ca8] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  ចុះឈ្មោះឥឡូវនេះ
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition"
                >
                  ស្វែងយល់បន្ថែម
                </Link>
              </div>
            </div>

            {/* Right Graphic Frame (Screenshot 4 Layout: Royal Blue Block + Photo) */}
            <div className="lg:col-span-7 relative flex justify-center items-center">
              <div className="relative w-full max-w-[560px]">
                {/* Royal Blue Solid Backdrop Block (Screenshot 4) */}
                <div className="absolute -top-6 -right-4 sm:-right-8 w-4/5 h-[90%] bg-[#104ccb] rounded-3xl z-0"></div>

                {/* Professional Technicians Team Photo */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                    alt="Professional Skilled Technicians Team"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RECENT REAL SERVICE REQUESTS (Live Marketplace Jobs) */}
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
            ) : (
              /* Fallback Mock Request Cards if database is empty */
              [
                {
                  title: "លាងសម្អាតម៉ាស៊ីនត្រជាក់ ២ គ្រឿង និងបញ្ចូលហ្គាស",
                  category: "ម៉ាស៊ីនត្រជាក់",
                  budget: "$30",
                  location: "ខណ្ឌទួលគោក, រាជធានីភ្នំពេញ",
                },
                {
                  title: "ជួសជុលទុយោទឹកលិចនៅក្រោមឡាបូលាងចាន",
                  category: "ទឹក និងបំពង់",
                  budget: "$15",
                  location: "ខណ្ឌចំការមន, រាជធានីភ្នំពេញ",
                },
                {
                  title: "ឆ្លងភ្លើងដាច់ឌីសង់ទ័រ និងដំឡើងកង្ហារពិដានថ្មី",
                  category: "អគ្គិសនី",
                  budget: "$25",
                  location: "ខណ្ឌសែនសុខ, រាជធានីភ្នំពេញ",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {item.budget}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <Link
                    href="/services"
                    className="w-full text-center py-2.5 rounded-lg bg-[#104ccb] hover:bg-[#0a3ca8] text-white text-xs font-bold transition"
                  >
                    {isKm ? "មើលសេវាកម្មទាំងអស់" : "View All Services"}
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (សំណួរញឹកញាប់អំពីសេវាខ្មែរ) */}
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
