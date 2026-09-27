import { Language } from "@/lib/i18n/translations";

/**
 * Maps any Google authentication or backend API error to a sanitized,
 * user-friendly localized message without exposing stack traces, tokens, or JWTs.
 */
export function formatGoogleAuthError(
  error: unknown,
  language: Language = "km"
): string {
  const isKm = language === "km";

  if (!error) {
    return isKm
      ? "ការផ្ទៀងផ្ទាត់ជាមួយ Google មិនបានជោគជ័យទេ។ សូមព្យាយាមម្តងទៀត។"
      : "Google authentication failed. Please try again.";
  }

  const err = error as {
    status?: number;
    message?: string;
    error?: string;
    type?: string;
  };

  const status = typeof err.status === "number" ? err.status : undefined;
  const rawMessage = (
    typeof err.message === "string"
      ? err.message
      : typeof err.error === "string"
      ? err.error
      : ""
  ).toLowerCase();

  // 1. Popup closed or cancelled by user
  if (
    rawMessage.includes("popup_closed_by_user") ||
    rawMessage.includes("cancelled") ||
    rawMessage.includes("canceled") ||
    rawMessage.includes("user_cancel") ||
    rawMessage.includes("dismissed")
  ) {
    return isKm
      ? "ការចូលប្រើប្រាស់ជាមួយ Google ត្រូវបានបោះបង់។"
      : "Google sign-in was cancelled.";
  }

  // 2. Account inactive or disabled
  if (
    rawMessage.includes("inactive") ||
    rawMessage.includes("disabled") ||
    rawMessage.includes("suspended") ||
    rawMessage.includes("locked") ||
    rawMessage.includes("account_disabled")
  ) {
    return isKm
      ? "គណនី Google នេះត្រូវបានផ្អាក ឬមិនសកម្ម។ សូមទាក់ទងផ្នែកជំនួយ។"
      : "Google account is inactive or disabled. Please contact support.";
  }

  // 3. Invalid Google ID token
  if (
    rawMessage.includes("invalid google id token") ||
    rawMessage.includes("invalid token") ||
    rawMessage.includes("credential token is required") ||
    rawMessage.includes("token expired") ||
    rawMessage.includes("jwt")
  ) {
    return isKm
      ? "ព័ត៌មានផ្ទៀងផ្ទាត់ Google មិនត្រឹមត្រូវ ឬផុតកំណត់។ សូមព្យាយាមម្តងទៀត។"
      : "Invalid Google ID token. Please try signing in again.";
  }

  // 4. Network error or connection dropped
  if (
    rawMessage.includes("network") ||
    rawMessage.includes("failed to fetch") ||
    rawMessage.includes("connection refused") ||
    rawMessage.includes("load failed") ||
    rawMessage.includes("timeout") ||
    status === 0
  ) {
    return isKm
      ? "មិនអាចភ្ជាប់ទៅកាន់ប្រព័ន្ធបានទេ។ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិតរបស់អ្នក។"
      : "Network error. Please check your internet connection and try again.";
  }

  // 5. Backend HTTP Status code handling
  if (status === 400) {
    return isKm
      ? "សំណើចូលគណនី Google មិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។"
      : "Invalid Google login request. Please try again.";
  }

  if (status === 401) {
    return isKm
      ? "ការផ្ទៀងផ្ទាត់ជាមួយ Google មិនបានជោគជ័យទេ។ សូមព្យាយាមម្តងទៀត។"
      : "Google authentication failed. Please try again.";
  }

  if (status === 403) {
    return isKm
      ? "ការចូលប្រើត្រូវបានបដិសេធ។ គណនីរបស់អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់ប្រព័ន្ធនេះទេ។"
      : "Access denied. Your account does not have permission to access this service.";
  }

  if (status && status >= 500) {
    return isKm
      ? "មានបញ្ហាបច្ចេកទេសក្នុងប្រព័ន្ធម៉ាស៊ីនបម្រើ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។"
      : "A server error occurred while signing in with Google. Please try again later.";
  }

  // Fallback safe message (guaranteed no stack traces or tokens)
  return isKm
    ? "ការផ្ទៀងផ្ទាត់ជាមួយ Google មិនបានជោគជ័យទេ។ សូមព្យាយាមម្តងទៀត។"
    : "Google authentication failed. Please try again.";
}
