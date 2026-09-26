"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { UserRole } from "@/types/auth";
import { LocationPicker, LocationData } from "@/components/ui/LocationPicker";
import {
  Wrench,
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Globe,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Info,
  Star,
  Eye,
  EyeOff,
  Clock,
} from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const initialRole = (searchParams.get("role") === "PROVIDER" ? "PROVIDER" : "CUSTOMER") as UserRole;
  const initialEmail = searchParams.get("email") || "";

  const [role, setRole] = useState<UserRole>(initialRole);

  // Provider Multi-Step Wizard State (Steps 1 to 3)
  const [providerStep, setProviderStep] = useState<number>(1);

  // Account Credentials
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Provider Business & Skill Profile
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(1);
  const [serviceArea, setServiceArea] = useState("");

  // Location Data
  const [location, setLocation] = useState<Partial<LocationData>>({
    address: "",
    city: "Phnom Penh",
    district: "Meanchey",
    latitude: 11.5435,
    longitude: 104.8997,
  });

  // Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation before advancing provider steps
  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!fullName.trim()) {
        setError("សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក");
        return false;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("សូមបញ្ចូលអ៊ីមែលឲ្យបានត្រឹមត្រូវ");
        return false;
      }
      if (!password || password.length < 6) {
        setError("ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ");
        return false;
      }
      if (password !== confirmPassword) {
        setError("ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ");
        return false;
      }
    } else if (step === 2) {
      if (!businessName.trim()) {
        setError("សូមបញ្ចូលឈ្មោះអាជីវកម្ម ឬ យីហោរបស់អ្នក");
        return false;
      }
      if (experienceYears < 0) {
        setError("ចំនួនឆ្នាំនៃបទពិសោធន៍មិនត្រឹមត្រូវទេ");
        return false;
      }
    } else if (step === 3) {
      if (!location.address?.trim()) {
        setError("សូមបញ្ចូលអាសយដ្ឋានលម្អិតរបស់អ្នក");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(providerStep)) {
      setProviderStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setError(null);
    setProviderStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "PROVIDER" && providerStep < 3) {
      handleNextStep();
      return;
    }

    if (role === "CUSTOMER") {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setError(t("validationError"));
        return;
      }
      if (password !== confirmPassword) {
        setError("ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ");
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        role,
        businessName: role === "PROVIDER" ? businessName.trim() || fullName.trim() : undefined,
        bio: role === "PROVIDER" ? bio.trim() : undefined,
        experienceYears: role === "PROVIDER" ? Number(experienceYears) : undefined,
        serviceArea: role === "PROVIDER" ? serviceArea.trim() || location.district || "Phnom Penh" : undefined,
        address: location.address,
        city: location.city,
        district: location.district,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      if (res.user?.role === "PROVIDER") {
        router.push("/provider/dashboard?status=pending_approval");
      } else {
        router.push("/customer/dashboard");
      }
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "ការចុះឈ្មោះបានបរាជ័យ។ សូមពិនិត្យព័ត៌មានម្តងទៀត។");
    } finally {
      setIsLoading(false);
    }
  };

  const providerSteps = [
    { num: 1, title: "គណនី", icon: User },
    { num: 2, title: "អាជីវកម្ម", icon: Briefcase },
    { num: 3, title: "ទីតាំង", icon: MapPin },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 text-slate-900 py-1.5 sm:py-2.5 px-3 sm:px-6">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-3xl lg:max-w-4xl mx-auto py-1 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-slate-600 hover:text-indigo-600 font-semibold text-xs transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{language === "km" ? "ត្រឡប់ទៅទំព័រដើម" : "Back"}</span>
        </Link>

        <div className="flex items-center space-x-2.5">
          <Link
            href={email ? `/login?email=${encodeURIComponent(email)}` : "/login"}
            className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            {t("login")}
          </Link>

          {/* Language Switcher with Flags */}
          <LanguageSelector variant="pill" />
        </div>
      </header>

      {/* Main Registration Container (Split Layout harmonized with Login) */}
      <div className="flex-1 flex items-center justify-center py-1">
        <div className="w-full max-w-3xl lg:max-w-4xl bg-white rounded-2xl shadow-md shadow-indigo-950/5 border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Hero Column (Visible on Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-5 flex-col justify-between relative overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center space-x-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="សេវាខ្មែរ Logo"
                  className="w-8 h-8 object-contain bg-white rounded-xl p-0.5"
                />
                <div>
                  <h2 className="font-bold text-sm leading-tight">សេវាខ្មែរ</h2>
                  <p className="text-[8px] text-indigo-200 tracking-wider uppercase font-semibold">
                    Khmer Marketplace
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <h3 className="text-lg font-bold leading-snug">
                  ចូលរួមជាមួយយើង <br />
                  បង្កើតគណនីថ្មី
                </h3>
                <p className="text-[10.5px] text-indigo-100/90 leading-relaxed font-normal">
                  {role === "PROVIDER"
                    ? "ពង្រីកអាជីវកម្មរបស់អ្នក ទទួលបានការងារជាប្រចាំ និងបង្កើនចំណូលជាមួយអតិថិជនរាប់ពាន់នាក់។"
                    : "ស្វែងរក និងកក់ជាងជំនាញរាប់ពាន់នាក់នៅទូទាំងប្រទេសកម្ពុជាដោយទំនុកចិត្ត និងសុវត្ថិភាព។"}
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center space-x-2 text-[10.5px] text-indigo-100">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{role === "PROVIDER" ? "ការផ្ទៀងផ្ទាត់អាជីវកម្មស្របច្បាប់" : "ជាងជំនាញមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ"}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10.5px] text-indigo-100">
                  <Star className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>{role === "PROVIDER" ? "កសាងកេរ្តិ៍ឈ្មោះតាមរយៈការវាយតម្លៃពិត" : "ការវាយតម្លៃពិតប្រាកដពីអតិថិជន"}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10.5px] text-indigo-100">
                  <CheckCircle2 className="w-3 h-3 text-cyan-300 shrink-0" />
                  <span>{role === "PROVIDER" ? "គ្រប់គ្រងការងារ និងប្រាក់ចំណូលងាយស្រួល" : "ដោះស្រាយបញ្ហារហ័សទាន់ចិត្ត"}</span>
                </div>
              </div>
            </div>

            {/* Bottom Proof Pill */}
            <div className="relative z-10 pt-2 border-t border-white/10 flex items-center space-x-2">
              <div className="text-[10px] text-indigo-100">
                <span className="font-bold">500+</span> ជាងជំនាញ & អតិថិជនរាប់ពាន់នាក់
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between">
            <div className="w-full mx-auto space-y-2.5">
              
              {/* Header on Mobile/Tablet */}
              <div className="space-y-1.5">
                <div className="lg:hidden flex items-center space-x-2 mb-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="សេវាខ្មែរ Logo"
                    className="w-7 h-7 object-contain"
                  />
                  <span className="font-bold text-sm text-slate-900">សេវាខ្មែរ</span>
                </div>

                {/* Unified Auth Mode Switcher (Relating Login and Register) */}
                <div className="grid grid-cols-2 p-0.5 bg-slate-100 rounded-lg mb-2">
                  <Link
                    href={email ? `/login?email=${encodeURIComponent(email)}` : "/login"}
                    className="py-1 px-2.5 text-center text-xs font-bold rounded-md text-slate-600 hover:text-slate-900 transition flex items-center justify-center space-x-1"
                  >
                    <span>{t("login")}</span>
                  </Link>
                  <div className="py-1 px-2.5 text-center text-xs font-bold rounded-md bg-white text-indigo-600 shadow-2xs">
                    {t("register")}
                  </div>
                </div>

                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {t("register")}
                </h1>
                <p className="text-[11px] text-slate-500">
                  {role === "CUSTOMER"
                    ? (language === "km" ? "បង្កើតគណនីអតិថិជន ដើម្បីស្វែងរក និងកក់សេវាកម្ម" : "Create a customer account to find and book services")
                    : (language === "km" ? "ចុះឈ្មោះជាអ្នកផ្តល់សេវា ដើម្បីចាប់ផ្តើមទទួលការងារ" : "Register as a provider to start receiving jobs")}
                </p>
              </div>

              {/* Role Selection Question & Buttons */}
              <div className="space-y-1.5 pt-0.5">
                <p className="text-[11px] font-bold text-slate-600 text-center">តើអ្នកចង់ធ្វើអ្វី?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setRole("CUSTOMER");
                      setError(null);
                    }}
                    className={`py-1.5 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 border ${
                      role === "CUSTOMER"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>ខ្ញុំត្រូវការអ្នកជំនាញ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole("PROVIDER");
                      setError(null);
                    }}
                    className={`py-1.5 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 border ${
                      role === "PROVIDER"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>ខ្ញុំជាអ្នកជំនាញ និងចង់រកការងារ</span>
                  </button>
                </div>
              </div>

              {/* Provider Multi-Step Progress Header */}
              {role === "PROVIDER" && (
                <div className="pt-1.5 border-t border-slate-200/60">
                  <div className="grid grid-cols-3 gap-1 text-center">
                    {providerSteps.map((s) => {
                      const StepIcon = s.icon;
                      const isCompleted = providerStep > s.num;
                      const isCurrent = providerStep === s.num;

                      return (
                        <div
                          key={s.num}
                          onClick={() => {
                            if (providerStep > s.num) setProviderStep(s.num);
                          }}
                          className={`flex flex-col items-center space-y-1 transition ${
                            isCompleted ? "cursor-pointer" : ""
                          }`}
                        >
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                              isCompleted
                                ? "bg-emerald-600 text-white shadow-2xs"
                                : isCurrent
                                ? "bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-100"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-3.5 h-3.5" />}
                          </div>
                          <p className={`text-[10px] sm:text-xs font-bold ${isCurrent ? "text-indigo-600" : isCompleted ? "text-slate-700" : "text-slate-400"}`}>
                            {s.title}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${(providerStep / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-start space-x-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs animate-shake">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* ============================================================
                    ROLE: CUSTOMER REGISTRATION FORM (Compact & Balanced)
                    ============================================================ */}
                {role === "CUSTOMER" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                          ឈ្មោះពេញ (Full Name) *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="ឧ. សុខ សប្បាយ"
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                          លេខទូរស័ព្ទ (Phone) <span className="text-slate-400 font-normal">(មិនទាមទារ)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="012 345 678"
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                          />
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        អ៊ីមែល (Email) *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                          ពាក្យសម្ងាត់ (Password) *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="យ៉ាងតិច ៦ តួអក្សរ"
                            className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                          />
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 transition p-0.5 rounded"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                          ផ្ទៀងផ្ទាត់ (Confirm Password) *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="បញ្ចូលម្តងទៀត"
                            className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                          />
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-2 sm:top-2.5 text-slate-400 hover:text-slate-600 transition p-0.5 rounded"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1">
                      <LocationPicker
                        value={location}
                        onChange={(loc) => setLocation(loc)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full inline-flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-60 mt-2"
                    >
                      {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>បង្កើតគណនីអតិថិជន</span>
                    </button>
                  </div>
                )}

                {/* ============================================================
                    ROLE: PROVIDER MULTI-STEP WIZARD (Compact)
                    ============================================================ */}
                {role === "PROVIDER" && (
                  <div className="space-y-3">
                    
                    {/* STEP 1: Account & Credentials */}
                    {providerStep === 1 && (
                      <div className="space-y-2.5 animate-fadeIn">
                        <div className="flex items-start space-x-2.5 p-2 bg-indigo-50/80 border border-indigo-100 rounded-xl text-indigo-900 text-xs leading-snug">
                          <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-[11px]">ជំហានទី ១៖ ព័ត៌មានគណនី</p>
                            <p className="text-indigo-800/80 text-[10px] sm:text-[11px]">
                              ព័ត៌មាននេះនឹងប្រើសម្រាប់ចូលប្រព័ន្ធ និងទទួលដំណឹងការងារពីអតិថិជន។
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              ឈ្មោះពេញរបស់អ្នក *
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="ឧ. ជាង វ៉ាន់ដា"
                                className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                              />
                              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 sm:top-2.5" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              លេខទូរស័ព្ទទំនាក់ទំនង *
                            </label>
                            <div className="relative">
                              <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="012 345 678"
                                className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                              />
                              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 sm:top-2.5" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            អ៊ីមែល (Email Address) *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="vanda.electric@example.com"
                              className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                            />
                            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 sm:top-2.5" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              ពាក្យសម្ងាត់ (Password) *
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="យ៉ាងតិច ៦ តួអក្សរ"
                                className="w-full pl-8 pr-9 py-1.5 sm:py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                              />
                              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 sm:top-2.5" />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2.5 top-2 sm:top-2.5 text-slate-400 hover:text-slate-600 transition p-0.5 rounded"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ *
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត"
                                className="w-full pl-8 pr-9 py-1.5 sm:py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                              />
                              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 sm:top-2.5" />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2.5 top-2 sm:top-2.5 text-slate-400 hover:text-slate-600 transition p-0.5 rounded"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Business & Skill Profile */}
                    {providerStep === 2 && (
                      <div className="space-y-2.5 animate-fadeIn">
                        <div className="flex items-start space-x-2.5 p-2 bg-emerald-50/80 border border-emerald-100 rounded-xl text-emerald-900 text-xs leading-snug">
                          <Briefcase className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-[11px]">ជំហានទី ២៖ ព័ត៌មានអាជីវកម្ម និងជំនាញ</p>
                            <p className="text-emerald-800/80 text-[10px] sm:text-[11px]">
                              ជួយឲ្យអតិថិជនស្គាល់ និងជឿជាក់លើជំនាញរបស់អ្នកកាន់តែច្បាស់។
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              ឈ្មោះអាជីវកម្ម ឬ យីហោ *
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                required
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="ឧ. ជាងជួសជុលអគ្គិសនី វ៉ាន់ដា"
                                className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                              />
                              <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 sm:top-2.5" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              បទពិសោធន៍ (ឆ្នាំ) *
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              required
                              value={experienceYears}
                              onChange={(e) => setExperienceYears(Number(e.target.value))}
                              className="w-full px-3 py-1.5 sm:py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            តំបន់ផ្តល់សេវា (Service Area)
                          </label>
                          <input
                            type="text"
                            value={serviceArea}
                            onChange={(e) => setServiceArea(e.target.value)}
                            placeholder="ឧ. ទូទាំងភ្នំពេញ, ខណ្ឌទួលគោក, ដូនពេញ..."
                            className="w-full px-3 py-1.5 sm:py-2 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            ការពិពណ៌នាអំពីជំនាញ (Bio)
                          </label>
                          <textarea
                            rows={2}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="រៀបរាប់សង្ខេបអំពីជំនាញ និងសេវាកម្មរបស់អ្នក..."
                            className="w-full px-3 py-1.5 text-xs bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Operating Location */}
                    {providerStep === 3 && (
                      <div className="space-y-2.5 animate-fadeIn">
                        <div className="flex items-start space-x-2.5 p-2 bg-purple-50/80 border border-purple-100 rounded-xl text-purple-900 text-xs leading-snug">
                          <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-[11px]">ជំហានទី ៣៖ ទីតាំងប្រតិបត្តិការ</p>
                            <p className="text-purple-800/80 text-[10px] sm:text-[11px]">
                              ទីតាំងត្រឹមត្រូវជួយឲ្យអ្នកទទួលបានការងារដែលនៅជិតអ្នកបំផុត (Nearby Jobs)។
                            </p>
                          </div>
                        </div>

                        <LocationPicker
                          value={location}
                          onChange={(loc) => setLocation(loc)}
                          compact={true}
                        />

                        {/* Status Note: Pending Admin Approval */}
                        <div className="flex items-start space-x-2.5 p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed mt-2">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-bold text-[11px] text-amber-900">
                              ស្ថានភាពដំបូងពេលចុះឈ្មោះ៖ រង់ចាំការអនុម័ត (PENDING)
                            </p>
                            <p className="text-amber-800/90 text-[10.5px]">
                              បន្ទាប់ពីចុះឈ្មោះរួច គណនីរបស់អ្នកនឹងមានស្ថានភាព <strong>PENDING</strong> រង់ចាំការត្រួតពិនិត្យ និងអនុម័តពី Admin មុនពេលបង្ហាញជាផ្លូវការនៅលើផ្សារសេវាកម្ម។
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Wizard Step Navigation Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      {providerStep > 1 ? (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>ថយក្រោយ</span>
                        </button>
                      ) : (
                        <div />
                      )}

                      {providerStep < 3 ? (
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="inline-flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-2xs"
                        >
                          <span>បន្ត</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs disabled:opacity-60"
                        >
                          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>ចុះឈ្មោះជាអ្នកផ្តល់សេវា</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </form>

              {/* Bottom Login Link */}
              <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-0.5">
                <p>
                  មានគណនីរួចហើយមែនទេ?{" "}
                  <Link
                    href={email ? `/login?email=${encodeURIComponent(email)}` : "/login"}
                    className="font-bold text-indigo-600 hover:text-indigo-700 transition underline underline-offset-2"
                  >
                    {t("login")}
                  </Link>
                </p>
                <p className="text-[10px] text-slate-400">
                  តាមរយៈការចុះឈ្មោះ អ្នកយល់ព្រមតាមលក្ខខណ្ឌប្រើប្រាស់របស់សេវាខ្មែរ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Copyright Footer */}
      <footer className="w-full text-center py-2 text-[11px] text-slate-400">
        © {new Date().getFullYear()} សេវាខ្មែរ (Khmer Service Marketplace). រក្សាសិទ្ធិគ្រប់យ៉ាង។
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
