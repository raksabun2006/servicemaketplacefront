"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Star,
  CheckCircle2,
  X,
  KeyRound,
  Send,
} from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { AuthResponse } from "@/types/auth";
import { mapPasswordResetError } from "@/lib/auth/password-reset-errors";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, forgotPassword } = useAuth();
  const { language, t } = useLanguage();

  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In-Place Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingForgot, setIsSendingForgot] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSendForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSendingForgot) return;

    const trimmed = forgotEmail.trim();
    if (!trimmed) {
      setForgotError(language === "km" ? "សូមបញ្ចូលអ៊ីមែល" : "Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setForgotError(
        language === "km"
          ? "សូមបញ្ចូលអ៊ីមែលដែលត្រឹមត្រូវ"
          : "Please enter a valid email address"
      );
      return;
    }

    try {
      setIsSendingForgot(true);
      setForgotError(null);
      await forgotPassword(trimmed);
      setForgotSuccess(true);
    } catch (err: unknown) {
      const mapped = mapPasswordResetError(err, { isResetPassword: false });
      if (mapped.isRateLimited) {
        setForgotError(mapped.message);
      } else {
        const status = (err as { status?: number })?.status;
        if (status && status >= 500) {
          setForgotError(
            language === "km"
              ? "មានបញ្ហាក្នុងប្រព័ន្ធ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។"
              : "System error. Please try again later."
          );
        } else if (!status) {
          setForgotError(
            language === "km"
              ? "មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ប្រព័ន្ធ។ សូមព្យាយាមម្តងទៀត។"
              : "Network connection error. Please try again."
          );
        } else {
          setForgotSuccess(true);
        }
      }
    } finally {
      setIsSendingForgot(false);
    }
  };

  const handleAuthSuccess = (res: AuthResponse) => {
    const redirectUrl = searchParams.get("redirect");
    if (redirectUrl && redirectUrl.startsWith("/")) {
      router.push(redirectUrl);
      return;
    }

    const role = res.user?.role;
    if (role === "PROVIDER") {
      router.push("/provider/dashboard");
    } else if (role === "ADMIN" || role === "MANAGER") {
      router.push("/admin/dashboard");
    } else {
      router.push("/customer/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(t("validationError"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await login({ email: email.trim(), password });
      handleAuthSuccess(res);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || "អ៊ីមែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។ សូមព្យាយាមម្តងទៀត។");
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

        {/* Language Switcher with Flags */}
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
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            <div className="max-w-sm w-full mx-auto space-y-4">
              
              {/* Header on Mobile/Tablet */}
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

                {/* Unified Auth Mode Switcher (Relating Login and Register) */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-3">
                  <div className="py-2 px-3 text-center text-xs font-bold rounded-lg bg-white text-indigo-600 shadow-2xs">
                    {t("login")}
                  </div>
                  <Link
                    href={email ? `/register?email=${encodeURIComponent(email)}` : "/register"}
                    className="py-2 px-3 text-center text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 transition flex items-center justify-center space-x-1"
                  >
                    <span>{t("register")}</span>
                  </Link>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {t("login")}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់របស់អ្នកដើម្បីបន្ត
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start space-x-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    អ៊ីមែល (Email)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      ពាក្យសម្ងាត់ (Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail("");
                        setForgotError(null);
                        setForgotSuccess(false);
                        setShowForgotModal(true);
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
                    >
                      {t("forgotPassword")}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showPassword ? (
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
                  className="w-full inline-flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isLoading ? "កំពុងផ្ទៀងផ្ទាត់..." : t("login")}</span>
                </button>
              </form>

              {/* Clean Divider */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="w-full border-t border-slate-200" />
                <span className="absolute bg-white px-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {language === "km" ? "ឬ" : "OR"}
                </span>
              </div>

              {/* Google Sign-In */}
              <GoogleLoginButton
                onSuccess={handleAuthSuccess}
                onError={(msg) => setError(msg)}
                disabled={isLoading}
              />

              {/* Footer Links */}
              <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                <p>
                  មិនទាន់មានគណនីនៅឡើយ?{" "}
                  <Link
                    href={email ? `/register?email=${encodeURIComponent(email)}` : "/register"}
                    className="font-bold text-indigo-600 hover:text-indigo-700 transition underline underline-offset-4"
                  >
                    {t("register")}
                  </Link>
                </p>
                <p className="text-[11px] text-slate-400">
                  តាមរយៈការចូលប្រើប្រាស់ អ្នកយល់ព្រមតាមលក្ខខណ្ឌប្រើប្រាស់របស់សេវាខ្មែរ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Copyright Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-400">
        © {new Date().getFullYear()} សេវាខ្មែរ (Khmer Service Marketplace). រក្សាសិទ្ធិគ្រប់យ៉ាង។
      </footer>

      {/* In-Place Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => {
            if (!isSendingForgot) setShowForgotModal(false);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 relative border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              disabled={isSendingForgot}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {!forgotSuccess ? (
              <>
                <div className="space-y-1.5 pr-8">
                  <div className="inline-flex p-2 bg-indigo-50 text-indigo-600 rounded-xl mb-1">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {language === "km" ? "ភ្លេចពាក្យសម្ងាត់?" : "Forgot Password?"}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === "km"
                      ? "បញ្ចូលអ៊ីមែលរបស់អ្នក ហើយយើងនឹងផ្ញើតំណសម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មី។"
                      : "Enter your email address and we'll send you a password reset link."}
                  </p>
                </div>

                {forgotError && (
                  <div className="flex items-start space-x-2.5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{forgotError}</span>
                  </div>
                )}

                <form onSubmit={handleSendForgotPassword} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === "km" ? "អ៊ីមែល" : "Email"}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          if (forgotError) setForgotError(null);
                        }}
                        placeholder={
                          language === "km" ? "បញ្ចូលអ៊ីមែលរបស់អ្នក" : "name@example.com"
                        }
                        disabled={isSendingForgot}
                        autoFocus
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-60"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingForgot}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSendingForgot ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === "km" ? "កំពុងផ្ញើ..." : "Sending..."}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {language === "km"
                            ? "ផ្ញើតំណកំណត់ពាក្យសម្ងាត់"
                            : "Send Password Reset Link"}
                        </span>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2 text-[11px] text-slate-400">
                  <Link
                    href="/forgot-password"
                    onClick={() => setShowForgotModal(false)}
                    className="hover:text-indigo-600 transition underline underline-offset-2"
                  >
                    {language === "km" ? "បើកក្នុងទំព័រពេញ" : "Open in full page"}
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900">
                    {language === "km"
                      ? "បានផ្ញើតំណកំណត់ពាក្យសម្ងាត់"
                      : "Password Reset Link Sent"}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {language === "km"
                      ? "ប្រសិនបើអ៊ីមែលនេះមាននៅក្នុងប្រព័ន្ធ យើងបានផ្ញើតំណកំណត់ពាក្យសម្ងាត់ទៅកាន់អ៊ីមែលរបស់អ្នករួចហើយ។"
                      : "If an account exists with this email, a password reset link has been sent."}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {language === "km"
                      ? "សូមពិនិត្យ Inbox និង Spam/Junk របស់អ្នក។"
                      : "Please check your Inbox and Spam/Junk folders."}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
                  >
                    {language === "km" ? "យល់ព្រម" : "OK"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
