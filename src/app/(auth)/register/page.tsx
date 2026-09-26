"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { UserRole } from "@/types/auth";
import { LocationPicker, LocationData } from "@/components/ui/LocationPicker";
import {
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const { language, t } = useLanguage();

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
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  // Password matching check
  const passwordsMatch = !confirmPassword || password === confirmPassword;

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
      if (!fullName.trim()) {
        setError("សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("សូមបញ្ចូលអ៊ីមែលឲ្យបានត្រឹមត្រូវ");
        return;
      }
      if (!password || password.length < 6) {
        setError("ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ");
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
    { num: 1, title: "ព័ត៌មានគណនី", subtitle: "Account", icon: User },
    { num: 2, title: "ព័ត៌មានអាជីវកម្ម", subtitle: "Business", icon: Briefcase },
    { num: 3, title: "ទីតាំងប្រតិបត្តិការ", subtitle: "Location", icon: MapPin },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#f8fafc] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,51,234,0.06),rgba(255,255,255,0))] text-slate-900 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header Bar */}
      <header className="w-full max-w-[960px] mx-auto flex items-center justify-between mb-4 sm:mb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-purple-700 font-medium text-xs sm:text-sm transition group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{language === "km" ? "ត្រឡប់ទៅទំព័រដើម" : "Back to Home"}</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href={email ? `/login?email=${encodeURIComponent(email)}` : "/login"}
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-purple-700 transition"
          >
            {t("login") || "ចូលគណនី"}
          </Link>
          <LanguageSelector variant="pill" />
        </div>
      </header>

      {/* Main Registration Card */}
      <main className="w-full max-w-[960px] mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-xs sm:shadow-sm p-6 sm:p-8 lg:p-10 transition-all">
        {/* Brand / Logo + Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center space-x-2.5 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="សេវាខ្មែរ Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-base text-slate-900 tracking-tight">សេវាខ្មែរ</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            បង្កើតគណនីថ្មី
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
            ចុះឈ្មោះដើម្បីប្រើប្រាស់សេវាកម្ម និងស្វែងរកជាងដែលសមរម្យសម្រាប់អ្នក
          </p>
        </div>

        {/* Polished Registration Type Selector */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/60 gap-1.5">
            {/* Option 1: Customer */}
            <button
              type="button"
              onClick={() => {
                setRole("CUSTOMER");
                setError(null);
              }}
              className={`py-3 px-3 sm:px-4 rounded-xl text-center transition-all duration-150 flex flex-col items-center justify-center ${
                role === "CUSTOMER"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/60"
              }`}
            >
              <span className="text-xs sm:text-sm font-bold leading-tight">
                អ្នកប្រើប្រាស់
              </span>
              <span
                className={`text-[11px] sm:text-xs mt-0.5 ${
                  role === "CUSTOMER" ? "text-purple-100" : "text-slate-500"
                }`}
              >
                សម្រាប់ស្នើសុំសេវាកម្ម
              </span>
            </button>

            {/* Option 2: Provider */}
            <button
              type="button"
              onClick={() => {
                setRole("PROVIDER");
                setError(null);
              }}
              className={`py-3 px-3 sm:px-4 rounded-xl text-center transition-all duration-150 flex flex-col items-center justify-center ${
                role === "PROVIDER"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/60"
              }`}
            >
              <span className="text-xs sm:text-sm font-bold leading-tight">
                អ្នកផ្តល់សេវា
              </span>
              <span
                className={`text-[11px] sm:text-xs mt-0.5 ${
                  role === "PROVIDER" ? "text-purple-100" : "text-slate-500"
                }`}
              >
                សម្រាប់ផ្តល់សេវាកម្ម
              </span>
            </button>
          </div>
        </div>

        {/* Provider Wizard Step Indicator */}
        {role === "PROVIDER" && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="grid grid-cols-3 gap-2">
              {providerSteps.map((s) => {
                const StepIcon = s.icon;
                const isCompleted = providerStep > s.num;
                const isCurrent = providerStep === s.num;

                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      if (providerStep > s.num) setProviderStep(s.num);
                    }}
                    disabled={!isCompleted && !isCurrent}
                    className={`flex items-center space-x-2.5 p-2 sm:p-3 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? "bg-purple-50/70 border-purple-300 ring-1 ring-purple-400/30 text-purple-900"
                        : isCompleted
                        ? "bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50/40 cursor-pointer"
                        : "bg-slate-50/60 border-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-purple-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate leading-tight">
                        {s.title}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 truncate hidden sm:block">
                        {s.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6 flex items-start space-x-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* ========================================================
              CUSTOMER REGISTRATION FORM
              Clean Two-Column Grid on Desktop
              ======================================================== */}
          {role === "CUSTOMER" && (
            <div className="space-y-6">
              {/* Account Credentials Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    ឈ្មោះពេញ <span className="text-slate-400 font-normal">(Full Name)</span> <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => handleBlur("fullName")}
                      placeholder="បញ្ចូលឈ្មោះពេញ"
                      className="w-full h-12 pl-10 pr-4 text-sm bg-white rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition hover:border-slate-300"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    លេខទូរស័ព្ទ <span className="text-slate-400 font-normal">(Phone)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="បញ្ចូលលេខទូរស័ព្ទ"
                      className="w-full h-12 pl-10 pr-4 text-sm bg-white rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition hover:border-slate-300"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Email Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    អ៊ីមែល <span className="text-slate-400 font-normal">(Email)</span> <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="បញ្ចូលអ៊ីមែល"
                      className="w-full h-12 pl-10 pr-4 text-sm bg-white rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition hover:border-slate-300"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    ពាក្យសម្ងាត់ <span className="text-slate-400 font-normal">(Password)</span> <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="បញ្ចូលពាក្យសម្ងាត់"
                      className={`w-full h-12 pl-10 pr-11 text-sm bg-white rounded-xl border text-slate-900 focus:outline-none transition ${
                        touchedFields.password && password && password.length < 6
                          ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 hover:border-slate-300"
                      }`}
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {touchedFields.password && password && password.length < 6 && (
                    <p className="text-xs text-rose-600 mt-1">ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    បញ្ជាក់ពាក្យសម្ងាត់ <span className="text-slate-400 font-normal">(Confirm Password)</span> <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
                      className={`w-full h-12 pl-10 pr-11 text-sm bg-white rounded-xl border text-slate-900 focus:outline-none transition ${
                        touchedFields.confirmPassword && !passwordsMatch
                          ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 hover:border-slate-300"
                      }`}
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {touchedFields.confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-rose-600 mt-1">ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ</p>
                  )}
                </div>
              </div>

              {/* Location Section */}
              <div className="pt-4 border-t border-slate-100">
                <div className="mb-4">
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    ទីតាំង
                  </h2>
                  <p className="text-xs text-slate-500">Location</p>
                </div>

                <LocationPicker
                  value={location}
                  onChange={(loc) => setLocation(loc)}
                  theme="purple"
                />
              </div>

              {/* Primary Register CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[52px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:from-purple-800 active:to-indigo-800 text-white font-semibold text-sm rounded-xl shadow-xs transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isLoading ? "កំពុងបង្កើតគណនី..." : "បង្កើតគណនី"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              PROVIDER REGISTRATION FORM (Multi-Step SaaS Flow)
              ======================================================== */}
          {role === "PROVIDER" && (
            <div className="space-y-6">
              {/* STEP 1: Account Credentials */}
              {providerStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        ឈ្មោះពេញ <span className="text-slate-400 font-normal">(Full Name)</span> <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          onBlur={() => handleBlur("fullName")}
                          placeholder="បញ្ចូលឈ្មោះពេញ"
                          className="w-full h-12 pl-10 pr-4 text-sm bg-white rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition hover:border-slate-300"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        លេខទូរស័ព្ទ <span className="text-slate-400 font-normal">(Phone)</span> <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="បញ្ចូលលេខទូរស័ព្ទ"
                          className="w-full h-12 pl-10 pr-4 text-sm bg-white rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition hover:border-slate-300"
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        អ៊ីមែល <span className="text-slate-400 font-normal">(Email)</span> <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => handleBlur("email")}
                          placeholder="បញ្ចូលអ៊ីមែល"
                          className="w-full h-12 pl-10 pr-4 text-sm bg-white rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition hover:border-slate-300"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        ពាក្យសម្ងាត់ <span className="text-slate-400 font-normal">(Password)</span> <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onBlur={() => handleBlur("password")}
                          placeholder="បញ្ចូលពាក្យសម្ងាត់"
                          className={`w-full h-12 pl-10 pr-11 text-sm bg-white rounded-xl border text-slate-900 focus:outline-none transition ${
                            touchedFields.password && password && password.length < 6
                              ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                              : "border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 hover:border-slate-300"
                          }`}
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {touchedFields.password && password && password.length < 6 && (
                        <p className="text-xs text-rose-600 mt-1">ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        បញ្ជាក់ពាក្យសម្ងាត់ <span className="text-slate-400 font-normal">(Confirm Password)</span> <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onBlur={() => handleBlur("confirmPassword")}
                          placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
                          className={`w-full h-12 pl-10 pr-11 text-sm bg-white rounded-xl border text-slate-900 focus:outline-none transition ${
                            touchedFields.confirmPassword && !passwordsMatch
                              ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                              : "border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 hover:border-slate-300"
                          }`}
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {touchedFields.confirmPassword && !passwordsMatch && (
                        <p className="text-xs text-rose-600 mt-1">ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Business & Skills Profile */}
              {providerStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Business Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        ឈ្មោះអាជីវកម្ម ឬ យីហោ <span className="text-slate-400 font-normal">(Business Name)</span> <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="ឧ. ជាងជួសជុលអគ្គិសនី វ៉ាន់ដា"
                          className="w-full h-12 pl-10 pr-4 text-sm bg-white rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition hover:border-slate-300"
                        />
                        <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Experience Years */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        បទពិសោធន៍ ឆ្នាំ <span className="text-slate-400 font-normal">(Experience Years)</span> <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        required
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full h-12 px-4 text-sm bg-white rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition hover:border-slate-300"
                      />
                    </div>

                    {/* Service Area */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        តំបន់ផ្តល់សេវា <span className="text-slate-400 font-normal">(Service Area)</span>
                      </label>
                      <input
                        type="text"
                        value={serviceArea}
                        onChange={(e) => setServiceArea(e.target.value)}
                        placeholder="ឧ. ទូទាំងភ្នំពេញ, ខណ្ឌទួលគោក, ដូនពេញ..."
                        className="w-full h-12 px-4 text-sm bg-white rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition hover:border-slate-300"
                      />
                    </div>

                    {/* Bio */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        ការពិពណ៌នាអំពីជំនាញ <span className="text-slate-400 font-normal">(Bio)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="រៀបរាប់សង្ខេបអំពីជំនាញ និងសេវាកម្មរបស់អ្នក..."
                        className="w-full p-3.5 text-sm bg-white rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition hover:border-slate-300 resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Operating Location */}
              {providerStep === 3 && (
                <div className="space-y-4">
                  <div className="pt-2">
                    <div className="mb-4">
                      <h2 className="text-base font-bold text-slate-900 leading-tight">
                        ទីតាំងប្រតិបត្តិការ
                      </h2>
                      <p className="text-xs text-slate-500">Operating Location</p>
                    </div>

                    <LocationPicker
                      value={location}
                      onChange={(loc) => setLocation(loc)}
                      theme="purple"
                    />
                  </div>

                  {/* Status Note: Pending Approval */}
                  <div className="flex items-start space-x-3 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-900 text-xs sm:text-sm leading-relaxed mt-4">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900">
                        ស្ថានភាពដំបូងពេលចុះឈ្មោះ៖ រង់ចាំការអនុម័ត (PENDING)
                      </p>
                      <p className="text-amber-800/90 text-xs mt-0.5">
                        បន្ទាប់ពីចុះឈ្មោះរួច គណនីរបស់អ្នកនឹងមានស្ថានភាព PENDING រង់ចាំការត្រួតពិនិត្យ និងអនុម័តពី Admin មុនពេលបង្ហាញជាផ្លូវការនៅលើផ្សារសេវាកម្ម។
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Provider Wizard Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                {providerStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center space-x-1.5 h-12 px-5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>ថយក្រោយ</span>
                  </button>
                ) : (
                  <div />
                )}

                {providerStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center space-x-2 h-12 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition shadow-xs cursor-pointer"
                  >
                    <span>បន្ត</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center space-x-2 h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold transition shadow-xs disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isLoading ? "កំពុងបង្កើតគណនី..." : "បង្កើតគណនី"}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Login Link Section */}
        <div className="pt-6 mt-8 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-600">
          <span>មានគណនីរួចហើយ? </span>
          <Link
            href={email ? `/login?email=${encodeURIComponent(email)}` : "/login"}
            className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition"
          >
            ចូលគណនី
          </Link>
        </div>
      </main>

      {/* Subtle Copyright Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-400">
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
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
