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
  Eye,
  EyeOff,
  ShieldCheck,
  Star,
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
  const [showCustomerLocation, setShowCustomerLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const passwordsMatch = !confirmPassword || password === confirmPassword;

  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!fullName.trim()) {
        setError("សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក");
        return false;
      }
      if (!phone.trim()) {
        setError("សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នក");
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

      const isProvider = role === "PROVIDER";
      const hasCustomerLocation = !isProvider && showCustomerLocation && Boolean(location.address?.trim());

      const res = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        role,
        businessName: isProvider ? businessName.trim() || fullName.trim() : undefined,
        bio: isProvider ? bio.trim() : undefined,
        experienceYears: isProvider ? Number(experienceYears) : undefined,
        serviceArea: isProvider ? serviceArea.trim() || location.district || "Phnom Penh" : undefined,
        address: isProvider ? location.address : (hasCustomerLocation ? location.address : undefined),
        city: isProvider ? location.city : (hasCustomerLocation ? location.city : undefined),
        district: isProvider ? location.district : (hasCustomerLocation ? location.district : undefined),
        latitude: isProvider ? location.latitude : (hasCustomerLocation ? location.latitude : undefined),
        longitude: isProvider ? location.longitude : (hasCustomerLocation ? location.longitude : undefined),
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

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 text-slate-900 py-2 sm:py-3 px-3 sm:px-6">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-3xl mx-auto py-1 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-slate-600 hover:text-indigo-600 font-semibold text-xs transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{language === "km" ? "ត្រឡប់ទៅទំព័រដើម" : "Back"}</span>
        </Link>

        {/* Language Switcher */}
        <LanguageSelector variant="pill" />
      </header>

      {/* Main Container - 2-Column Split Matching Login */}
      <div className="flex-1 flex items-center justify-center py-2">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md shadow-indigo-950/5 border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          {/* Left Hero Column (Matching Login) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-7 flex-col justify-between relative overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center space-x-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="សេវាខ្មែរ Logo"
                  className="w-9 h-9 object-contain bg-white rounded-xl p-0.5"
                />
                <div>
                  <h2 className="font-bold text-base leading-tight">សេវាខ្មែរ</h2>
                  <p className="text-[9px] text-indigo-200 tracking-wider uppercase font-semibold">
                    Khmer Marketplace
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-xl font-black leading-snug">
                  ស្វាគមន៍មកកាន់ <br />
                  ទីផ្សារសេវាកម្មកម្ពុជា
                </h3>
                <p className="text-[11px] text-indigo-100/90 leading-relaxed font-normal">
                  ភ្ជាប់ជាមួយជាងជំនាញរាប់ពាន់នាក់នៅទូទាំងប្រទេសកម្ពុជាដោយទំនុកចិត្ត។
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center space-x-2 text-[11px] text-indigo-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>ជាងជំនាញមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-indigo-100">
                  <Star className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>ការវាយតម្លៃពិតប្រាកដពីអតិថិជន</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-indigo-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                  <span>ដោះស្រាយបញ្ហារហ័សទាន់ចិត្ត</span>
                </div>
              </div>
            </div>

            {/* Bottom Proof Pill */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center space-x-2.5">
              <div className="text-[11px] text-indigo-100">
                <span className="font-bold">500+</span> ជាងជំនាញកំពុងប្រតិបត្តិការ
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-center">
            <div className="max-w-sm w-full mx-auto space-y-3.5">
              {/* Mobile Brand */}
              <div className="lg:hidden flex items-center space-x-2.5 mb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="សេវាខ្មែរ Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="font-bold text-sm text-slate-900">សេវាខ្មែរ</span>
              </div>

              {/* Top Mode Switcher: Login / Register */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                <Link
                  href="/login"
                  className="py-1.5 px-3 text-center text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition"
                >
                  {t("login") || "ចូលគណនី"}
                </Link>
                <div className="py-1.5 px-3 text-center text-xs font-bold rounded-lg bg-white text-indigo-600 shadow-2xs">
                  {t("register") || "បង្កើតគណនី"}
                </div>
              </div>

              {/* Role Switcher Pills */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-50 border border-slate-200/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setRole("CUSTOMER");
                    setError(null);
                  }}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all ${
                    role === "CUSTOMER"
                      ? "bg-white text-indigo-600 shadow-2xs border border-indigo-100"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  សម្រាប់អតិថិជន
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole("PROVIDER");
                    setError(null);
                  }}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all ${
                    role === "PROVIDER"
                      ? "bg-white text-indigo-600 shadow-2xs border border-indigo-100"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  សម្រាប់អ្នកផ្តល់សេវា
                </button>
              </div>

              {/* Provider Wizard Step Indicator */}
              {role === "PROVIDER" && (
                <div className="flex items-center justify-between px-1 py-1">
                  <span className="text-[11px] font-bold text-slate-700">
                    ជំហានទី {providerStep}/៣៖{" "}
                    {providerStep === 1
                      ? "គណនី"
                      : providerStep === 2
                      ? "អាជីវកម្ម"
                      : "ទីតាំង"}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 rounded-full transition-all ${
                          s === providerStep
                            ? "w-5 bg-indigo-600"
                            : s < providerStep
                            ? "w-2 bg-emerald-500"
                            : "w-2 bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="flex items-start space-x-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs leading-tight">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* ================= CUSTOMER REGISTRATION ================= */}
                {role === "CUSTOMER" && (
                  <>
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        ឈ្មោះពេញ <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="បញ្ចូលឈ្មោះពេញ"
                          className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        អ៊ីមែល <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="បញ្ចូលអ៊ីមែល"
                          className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Phone (Optional) */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        លេខទូរស័ព្ទ <span className="text-slate-400 font-normal">(ស្រេចចិត្ត)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="បញ្ចូលលេខទូរស័ព្ទ"
                          className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          ពាក្យសម្ងាត់ <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur("password")}
                            placeholder="ពាក្យសម្ងាត់"
                            className="w-full h-10 pl-8 pr-7 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                          />
                          <Lock className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          បញ្ជាក់ <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => handleBlur("confirmPassword")}
                            placeholder="បញ្ជាក់"
                            className="w-full h-10 pl-8 pr-7 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                          />
                          <Lock className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Optional Location Toggle */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowCustomerLocation(!showCustomerLocation)}
                        className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{showCustomerLocation ? "លាក់ទីតាំង" : "+ បន្ថែមទីតាំង (ស្រេចចិត្ត)"}</span>
                      </button>

                      {showCustomerLocation && (
                        <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-48 overflow-y-auto">
                          <LocationPicker
                            value={location}
                            onChange={(loc) => setLocation(loc)}
                            theme="blue"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ================= PROVIDER REGISTRATION WIZARD ================= */}
                {role === "PROVIDER" && (
                  <>
                    {/* Step 1: Account Credentials */}
                    {providerStep === 1 && (
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            ឈ្មោះពេញ <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="បញ្ចូលឈ្មោះពេញ"
                              className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                            />
                            <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            លេខទូរស័ព្ទ <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="បញ្ចូលលេខទូរស័ព្ទ"
                              className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                            />
                            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            អ៊ីមែល <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="បញ្ចូលអ៊ីមែល"
                              className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                            />
                            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              ពាក្យសម្ងាត់ <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="ពាក្យសម្ងាត់"
                              className="w-full h-10 px-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              បញ្ជាក់ <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="password"
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="បញ្ជាក់"
                              className="w-full h-10 px-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Business Profile */}
                    {providerStep === 2 && (
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            ឈ្មោះអាជីវកម្ម / យីហោ <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={businessName}
                              onChange={(e) => setBusinessName(e.target.value)}
                              placeholder="ឧ. ជាងជួសជុលម៉ាស៊ីនត្រជាក់ រក្សា"
                              className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                            />
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            បទពិសោធន៍ (ឆ្នាំ) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            required
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(Number(e.target.value))}
                            className="w-full h-10 px-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            អំពីសេវាកម្មរបស់អ្នក (Bio)
                          </label>
                          <textarea
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="រៀបរាប់សង្ខេបអំពីជំនាញ និងសេវាកម្ម..."
                            className="w-full p-2.5 text-xs bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Operating Location */}
                    {providerStep === 3 && (
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-700">
                          ទីតាំងប្រតិបត្តិការ <span className="text-rose-500">*</span>
                        </label>
                        <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-56 overflow-y-auto">
                          <LocationPicker
                            value={location}
                            onChange={(loc) => setLocation(loc)}
                            theme="blue"
                          />
                        </div>
                      </div>
                    )}

                    {/* Provider Step Actions */}
                    <div className="flex gap-2 pt-1">
                      {providerStep > 1 && (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="h-10 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>ថយ</span>
                        </button>
                      )}

                      {providerStep < 3 ? (
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1"
                        >
                          <span>បន្តទៅមុខ</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1 disabled:opacity-60"
                        >
                          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{isLoading ? "កំពុងបង្កើត..." : "បង្កើតគណនីអ្នកផ្តល់សេវា"}</span>
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* Customer Submit Button */}
                {role === "CUSTOMER" && (
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition duration-150 flex items-center justify-center space-x-1.5 disabled:opacity-60 cursor-pointer"
                    >
                      {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{isLoading ? "កំពុងបង្កើតគណនី..." : "បង្កើតគណនី"}</span>
                    </button>
                  </div>
                )}
              </form>

              {/* Bottom Login Link */}
              <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                <span>មានគណនីរួចហើយ? </span>
                <Link
                  href="/login"
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  ចូលគណនី
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Copyright Footer */}
      <footer className="w-full max-w-3xl mx-auto py-1 text-center text-[10px] text-slate-400">
        © 2026 ខ្មែរ សេវា. រក្សាសិទ្ធិគ្រប់យ៉ាង។
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
