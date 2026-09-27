"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { AuthResponse } from "@/types/auth";
import { loadGoogleScript } from "@/lib/auth/loadGoogleScript";
import { formatGoogleAuthError } from "@/lib/auth/googleAuthError";
import { Loader2 } from "lucide-react";

/**
 * Standard 4-color Google G icon matching Google brand guidelines.
 */
export function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27a7.22 7.22 0 0 1 0-4.54V6.58H1.25a11.96 11.96 0 0 0 0 10.84l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

interface GoogleLoginButtonProps {
  onSuccess: (res: AuthResponse) => void;
  onError?: (errorMessage: string) => void;
  disabled?: boolean;
  text?: "continue_with" | "signin_with" | "signup_with";
  className?: string;
}

export function GoogleLoginButton({
  onSuccess,
  onError,
  disabled = false,
  text = "continue_with",
  className = "",
}: GoogleLoginButtonProps) {
  const { googleLogin } = useAuth();
  const { language } = useLanguage();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const isConfigured = Boolean(
    clientId && clientId.trim() !== "" && !clientId.includes("your-google-client-id")
  );

  // Handle credential response from Google Identity Services
  const handleCredentialResponse = useCallback(
    async (idToken: string) => {
      // Prevent multiple simultaneous submissions
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsProcessing(true);

      try {
        if (!idToken) {
          throw new Error("Invalid Google ID token");
        }
        const authResponse = await googleLogin(idToken);
        onSuccess(authResponse);
      } catch (err: unknown) {
        const friendlyMessage = formatGoogleAuthError(err, language);
        onError?.(friendlyMessage);
      } finally {
        isSubmittingRef.current = false;
        setIsProcessing(false);
      }
    },
    [googleLogin, language, onError, onSuccess]
  );

  // Initialize and load official Google Identity Services library
  useEffect(() => {
    let isMounted = true;

    if (!isConfigured) {
      return;
    }

    loadGoogleScript()
      .then(() => {
        if (isMounted) {
          setIsScriptReady(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setScriptFailed(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isConfigured]);

  // Render official Google button inside the container
  useEffect(() => {
    if (!isScriptReady || !containerRef.current || !window.google?.accounts?.id || !isConfigured) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            handleCredentialResponse(response.credential);
          } else {
            onError?.(
              formatGoogleAuthError({ message: "Invalid Google ID token" }, language)
            );
          }
        },
        error_callback: () => {
          onError?.(
            formatGoogleAuthError({ message: "Google authentication failed" }, language)
          );
        },
      });

      // Clear previous button child nodes before re-rendering
      containerRef.current.innerHTML = "";

      const measuredWidth = containerRef.current.offsetWidth || 360;
      // Google GIS constraints: width must be between 200 and 400
      const clampedWidth = Math.min(Math.max(measuredWidth, 200), 400);

      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text,
        shape: "rectangular",
        logo_alignment: "left",
        width: clampedWidth,
        locale: language === "km" ? "km" : "en",
      });
    } catch {
      setScriptFailed(true);
    }
  }, [
    isScriptReady,
    clientId,
    isConfigured,
    text,
    language,
    handleCredentialResponse,
    onError,
  ]);

  // Fallback click handler if GIS is not yet ready or client ID is not configured
  const handleFallbackClick = () => {
    if (disabled || isProcessing) return;

    if (!isConfigured) {
      const msg =
        language === "km"
          ? "ប្រព័ន្ធ Google Sign-In មិនទាន់ត្រូវបានកំណត់រចនាសម្ព័ន្ធទេ។ សូមពិនិត្យ NEXT_PUBLIC_GOOGLE_CLIENT_ID។"
          : "Google Sign-In is not configured yet. Please check NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment.";
      onError?.(msg);
      return;
    }

    if (scriptFailed) {
      const msg =
        language === "km"
          ? "មិនអាចទាញយកប្រព័ន្ធ Google Identity Services បានទេ។ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត។"
          : "Failed to load Google Identity Services. Please check your internet connection.";
      onError?.(msg);
      return;
    }

    // Attempt One Tap prompt if available
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          const reason = notification.getNotDisplayedReason();
          if (reason === "opt_out_or_no_session") {
            onError?.(
              language === "km"
                ? "សូមចូលគណនី Google ក្នុងកម្មវិធីរុករករបស់អ្នកជាមុនសិន។"
                : "Please sign in to your Google account in this browser first."
            );
          }
        }
      });
    }
  };

  const buttonText = language === "km" ? "បន្តជាមួយ Google" : "Continue with Google";
  const loadingText = language === "km" ? "កំពុងចូលប្រើ..." : "Signing in...";

  // 1. Loading state: active request in progress
  if (isProcessing) {
    return (
      <button
        type="button"
        disabled
        className={`w-full h-11 inline-flex items-center justify-center space-x-2.5 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 cursor-not-allowed shadow-2xs transition ${className}`}
      >
        <Loader2 className="w-4 h-4 animate-spin text-indigo-600 shrink-0" />
        <span>{loadingText}</span>
      </button>
    );
  }

  // 2. Disabled state (e.g. while email/password login is submitting)
  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className={`w-full h-11 inline-flex items-center justify-center space-x-2.5 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 cursor-not-allowed opacity-60 ${className}`}
      >
        <GoogleIcon className="w-4 h-4 grayscale opacity-60" />
        <span>{buttonText}</span>
      </button>
    );
  }

  // 3. Official Google GIS button rendered container
  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Hidden container where Google renders its official iframe */}
      <div
        ref={containerRef}
        className={`w-full flex justify-center min-h-[44px] ${
          !isScriptReady || !isConfigured || scriptFailed ? "hidden" : ""
        }`}
      />

      {/* Styled fallback button when script is loading or client ID is not configured */}
      {(!isScriptReady || !isConfigured || scriptFailed) && (
        <button
          type="button"
          onClick={handleFallbackClick}
          className="w-full h-11 inline-flex items-center justify-center space-x-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition duration-150 cursor-pointer"
        >
          <GoogleIcon className="w-4 h-4 shrink-0" />
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
}
export default GoogleLoginButton;
