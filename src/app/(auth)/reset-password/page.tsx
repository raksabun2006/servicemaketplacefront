"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Lock,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { mapPasswordResetError } from "@/lib/auth/password-reset-errors";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const { language } = useLanguage();

  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTokenInvalid, setIsTokenInvalid] = useState(!token.trim());
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // If token is missing, set token invalid state immediately
  useEffect(() => {
    if (!token.trim()) {
      setIsTokenInvalid(true);
    }
  }, [token]);

  // Countdown timer on success before redirecting to login
  useEffect(() => {
    if (!isSuccess) return;

    setRedirectCountdown(4);
    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSuccess, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;

    if (!token.trim()) {
      setIsTokenInvalid(true);
      return;
    }

    if (!newPassword.trim()) {
      setError(
        language === "km"
          ? "ពាក្យសម្ងាត់មិនអាចទទេបានទេ"
          : "Password cannot be empty"
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        language === "km"
          ? "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ"
          : "Password must be at least 6 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        language === "km"
          ? "ពាក្យសម្ងាត់មិនត្រូវគ្នា"
          : "Passwords do not match"
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await resetPassword({
        token: token.trim(),
        newPassword,
        confirmPassword,
      });

      setIsSuccess(true);
    } catch (err: unknown) {
      const mapped = mapPasswordResetError(err, { isResetPassword: true });
      if (mapped.isTokenInvalidOrExpired) {
        setIsTokenInvalid(true);
      } else {
        setError(mapped.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 text-slate-900 py-2 sm:py-3 px-3 sm:px-6">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-3xl mx-auto py-1 flex items-center justify-between">
        <Link
          href="/login"
          className="inline-flex items-center space-x-1.5 text-slate-600 hover:text-indigo-600 font-semibold text-xs transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{language === "km" ? "ត្រឡប់ទៅចូលគណនី" : "Back to Login"}</span>
        </Link>

        {/* Language Switcher */}
        <LanguageSelector variant="pill" />
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center py-2">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md shadow-indigo-950/5 border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          
          {/* Left Hero Column (Visible on Desktop) */}
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
                  {language === "km" ? (
                    <>
                      បង្កើតពាក្យសម្ងាត់ថ្មី <br />
                      ប្រកបដោយសុវត្ថិភាព
                    </>
                  ) : (
                    <>
                      Create a Strong <br />
                      New Password
                    </>
                  )}
                </h3>
                <p className="text-[11px] text-indigo-100/90 leading-relaxed font-normal">
                  {language === "km"
                    ? "ជ្រើសរើសពាក្យសម្ងាត់ដែលមានយ៉ាងហោចណាស់ ៦ តួអក្សរ ដើម្បីធានាសុវត្ថិភាពគណនីរបស់អ្នក។"
                    : "Choose a secure password with at least 6 characters to safeguard your account."}
                </p>
              </div>

              {/* Security Tips */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center space-x-2 text-[11px] text-indigo-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {language === "km"
                      ? "យ៉ាងហោចណាស់ ៦ តួអក្សរ"
                      : "Minimum 6 characters"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-indigo-100">
                  <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>
                    {language === "km"
                      ? "បញ្ចូលពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់ឲ្យដូចគ្នា"
                      : "Confirm password must match"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-indigo-100">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                  <span>
                    {language === "km"
                      ? "កំណត់បានជោគជ័យភ្លាមៗ"
                      : "Instantly activated upon reset"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Proof Pill */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center space-x-2.5">
              <div className="text-[11px] text-indigo-100">
                <span className="font-bold">សេវាខ្មែរ</span>{" "}
                {language === "km" ? "ប្រព័ន្ធទីផ្សារសេវាកម្មទុកចិត្តបាន" : "Trusted Service Platform"}
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            <div className="max-w-sm w-full mx-auto space-y-4">
              
              {/* Header on Mobile */}
              <div className="space-y-2">
                <div className="lg:hidden flex items-center space-x-2.5 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="សេវាខ្មែរ Logo"
                    className="w-9 h-9 object-contain"
                  />
                  <span className="font-bold text-base text-slate-900">សេវាខ្មែរ</span>
                </div>

                {isTokenInvalid ? (
                  <>
                    <div className="inline-flex p-2 bg-rose-50 text-rose-600 rounded-xl mb-1">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      តំណមិនត្រឹមត្រូវ
                    </h1>
                  </>
                ) : isSuccess ? (
                  <>
                    <div className="inline-flex p-2 bg-emerald-50 text-emerald-600 rounded-xl mb-1">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                      កំណត់ពាក្យសម្ងាត់បានជោគជ័យ
                    </h1>
                  </>
                ) : (
                  <>
                    <div className="inline-flex p-2 bg-indigo-50 text-indigo-600 rounded-xl mb-1">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      កំណត់ពាក្យសម្ងាត់ថ្មី
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      បញ្ចូលពាក្យសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នក។
                    </p>
                  </>
                )}
              </div>

              {/* Error Message */}
              {error && !isTokenInvalid && !isSuccess && (
                <div className="flex items-start space-x-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Case 1: Invalid or Expired Token State */}
              {isTokenInvalid ? (
                <div className="space-y-4 pt-1">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-slate-700 text-xs sm:text-sm leading-relaxed space-y-2">
                    <p className="font-bold text-rose-700">
                      តំណកំណត់ពាក្យសម្ងាត់នេះមិនត្រឹមត្រូវ ឬបានផុតកំណត់។
                    </p>
                    <p className="text-slate-600 text-xs">
                      {language === "km"
                        ? "តំណកំណត់ពាក្យសម្ងាត់អាចប្រើប្រាស់បានតែម្តងគត់ និងមានសុពលភាពក្នុងរយៈពេលកំណត់។ សូមស្នើសុំតំណកំណត់ពាក្យសម្ងាត់ថ្មី។"
                        : "Password reset links are valid for one-time use only and expire quickly. Please request a new link."}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Link
                      href="/forgot-password"
                      className="w-full inline-flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>ស្នើសុំតំណថ្មី</span>
                    </Link>

                    <Link
                      href="/login"
                      className="w-full inline-flex items-center justify-center py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                    >
                      ត្រឡប់ទៅចូលគណនី
                    </Link>
                  </div>
                </div>
              ) : isSuccess ? (
                /* Case 2: Successful Password Reset State */
                <div className="space-y-4 pt-1">
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-slate-700 text-xs sm:text-sm leading-relaxed space-y-2">
                    <p className="font-semibold text-emerald-950">
                      ពាក្យសម្ងាត់របស់អ្នកត្រូវបានផ្លាស់ប្តូររួចរាល់។ ឥឡូវនេះអ្នកអាចចូលគណនីរបស់អ្នកបាន។
                    </p>
                    {redirectCountdown !== null && redirectCountdown > 0 && (
                      <p className="text-xs text-slate-500">
                        {language === "km"
                          ? `កំពុងប្តូរទៅទំព័រចូលគណនីក្នុងរយៈពេល ${redirectCountdown} វិនាទី...`
                          : `Redirecting to login in ${redirectCountdown} seconds...`}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/login"
                      className="w-full inline-flex items-center justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
                    >
                      ចូលគណនី
                    </Link>
                  </div>
                </div>
              ) : (
                /* Case 3: Reset Password Form */
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ពាក្យសម្ងាត់ថ្មី
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="••••••••"
                        disabled={isLoading}
                        autoFocus
                        className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-60"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      បញ្ជាក់ពាក្យសម្ងាត់
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-60"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>កំពុងកំណត់ពាក្យសម្ងាត់...</span>
                      </>
                    ) : (
                      <span>កំណត់ពាក្យសម្ងាត់</span>
                    )}
                  </button>
                </form>
              )}

              {/* Bottom return link */}
              {!isSuccess && !isTokenInvalid && (
                <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <Link
                    href="/login"
                    className="font-bold text-indigo-600 hover:text-indigo-700 transition inline-flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>ត្រឡប់ទៅចូលគណនី</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Copyright Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-400">
        © {new Date().getFullYear()} សេវាខ្មែរ (Khmer Service Marketplace). រក្សាសិទ្ធិគ្រប់យ៉ាង។
      </footer>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
