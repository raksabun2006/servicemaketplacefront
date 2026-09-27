"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Mail,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Clock,
  Send,
} from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { mapPasswordResetError } from "@/lib/auth/password-reset-errors";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPasswordContent() {
  const { forgotPassword } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError(language === "km" ? "សូមបញ្ចូលអ៊ីមែល" : "Please enter your email");
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError(
        language === "km"
          ? "សូមបញ្ចូលអ៊ីមែលដែលត្រឹមត្រូវ"
          : "Please enter a valid email address"
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await forgotPassword(trimmedEmail);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const mapped = mapPasswordResetError(err, { isResetPassword: false });
      // Security rule: Never reveal whether an email exists in the database.
      // If server returns error, only show rate limit or network/server issue.
      if (mapped.isRateLimited) {
        setError(mapped.message);
      } else {
        // Even on 404/not found from edge servers, maintain generic security,
        // or show network error if unreachable.
        const status = (err as { status?: number })?.status;
        if (status && status >= 500) {
          setError(
            language === "km"
              ? "មានបញ្ហាក្នុងប្រព័ន្ធ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។"
              : "System error. Please try again later."
          );
        } else if (!status) {
          setError(
            language === "km"
              ? "មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ប្រព័ន្ធ។ សូមព្យាយាមម្តងទៀត។"
              : "Network connection error. Please try again."
          );
        } else {
          // If server accepted or returned generic, show success to avoid enumeration
          setIsSubmitted(true);
        }
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
                      សុវត្ថិភាពគណនី <br />
                      និងការកំណត់ឡើងវិញ
                    </>
                  ) : (
                    <>
                      Account Security <br />
                      & Fast Recovery
                    </>
                  )}
                </h3>
                <p className="text-[11px] text-indigo-100/90 leading-relaxed font-normal">
                  {language === "km"
                    ? "ការពារទិន្នន័យ និងគណនីរបស់អ្នកជាមួយនឹងប្រព័ន្ធផ្ទៀងផ្ទាត់សុវត្ថិភាពខ្ពស់។"
                    : "Protecting your data and account with secure password recovery."}
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center space-x-2 text-[11px] text-indigo-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {language === "km"
                      ? "តំណផ្ទៀងផ្ទាត់សុវត្ថិភាពតាមអ៊ីមែល"
                      : "Secure email verification link"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-indigo-100">
                  <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>
                    {language === "km"
                      ? "កំណត់ឡើងវិញរហ័សទាន់ចិត្ត"
                      : "Fast and easy recovery"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-indigo-100">
                  <KeyRound className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                  <span>
                    {language === "km"
                      ? "ការពារគណនីពីការជ្រៀតចូល"
                      : "Strong account protection"}
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

                {!isSubmitted ? (
                  <>
                    <div className="inline-flex p-2 bg-indigo-50 text-indigo-600 rounded-xl mb-1">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      ភ្លេចពាក្យសម្ងាត់?
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      បញ្ចូលអ៊ីមែលរបស់អ្នក ហើយយើងនឹងផ្ញើតំណសម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មី។
                    </p>
                  </>
                ) : (
                  <>
                    <div className="inline-flex p-2 bg-emerald-50 text-emerald-600 rounded-xl mb-1">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-emerald-700">
                      បានផ្ញើតំណកំណត់ពាក្យសម្ងាត់
                    </h1>
                  </>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start space-x-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Form State */}
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      អ៊ីមែល
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក"
                        disabled={isLoading}
                        autoFocus
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-60"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition disabled:opacity-60 disabled:cursor-not-allowed mt-1 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>កំពុងផ្ញើ...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>ផ្ញើតំណកំណត់ពាក្យសម្ងាត់</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success State */
                <div className="space-y-4 pt-1">
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-slate-700 text-xs sm:text-sm leading-relaxed space-y-2">
                    <p className="font-semibold text-emerald-900">
                      ប្រសិនបើអ៊ីមែលនេះមាននៅក្នុងប្រព័ន្ធ យើងបានផ្ញើតំណកំណត់ពាក្យសម្ងាត់ទៅកាន់អ៊ីមែលរបស់អ្នករួចហើយ។
                    </p>
                    <p className="text-slate-600 text-xs">
                      សូមពិនិត្យ Inbox និង Spam/Junk របស់អ្នក។
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Link
                      href="/login"
                      className="w-full inline-flex items-center justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
                    >
                      ត្រឡប់ទៅចូលគណនី
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setError(null);
                      }}
                      className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 transition cursor-pointer"
                    >
                      {language === "km"
                        ? "ផ្ញើទៅកាន់អ៊ីមែលផ្សេងទៀត"
                        : "Send to a different email"}
                    </button>
                  </div>
                </div>
              )}

              {/* Back to Login link */}
              {!isSubmitted && (
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

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
