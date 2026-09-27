import { ApiError } from "@/types/api";

export interface ErrorMapOptions {
  isResetPassword?: boolean;
}

export function mapPasswordResetError(err: unknown, options?: ErrorMapOptions): {
  message: string;
  isTokenInvalidOrExpired: boolean;
  isRateLimited: boolean;
} {
  const apiErr = err as ApiError | undefined;
  const status = apiErr?.status;
  const rawMessage = (apiErr?.message || "").toLowerCase();

  // Rate limiting (429)
  if (status === 429 || rawMessage.includes("too many requests")) {
    return {
      message: "អ្នកបានស្នើសុំច្រើនពេក។ សូមរង់ចាំបន្តិច ហើយព្យាយាមម្តងទៀត។",
      isTokenInvalidOrExpired: false,
      isRateLimited: true,
    };
  }

  // Token invalid or expired patterns
  const tokenPattern =
    rawMessage.includes("invalid or expired") ||
    rawMessage.includes("token") ||
    rawMessage.includes("expired") ||
    rawMessage.includes("not found");

  if (options?.isResetPassword && (tokenPattern || status === 404 || status === 410)) {
    return {
      message: "តំណកំណត់ពាក្យសម្ងាត់នេះមិនត្រឹមត្រូវ ឬបានផុតកំណត់។",
      isTokenInvalidOrExpired: true,
      isRateLimited: false,
    };
  }

  if (status === 400) {
    if (options?.isResetPassword && tokenPattern) {
      return {
        message: "តំណកំណត់ពាក្យសម្ងាត់នេះមិនត្រឹមត្រូវ ឬបានផុតកំណត់។",
        isTokenInvalidOrExpired: true,
        isRateLimited: false,
      };
    }
    // Check validation error details if available
    if (apiErr?.errors && typeof apiErr.errors === "object") {
      const firstVal = Object.values(apiErr.errors)[0];
      if (typeof firstVal === "string" && firstVal.length > 0) {
        return {
          message: firstVal,
          isTokenInvalidOrExpired: false,
          isRateLimited: false,
        };
      }
    }
    return {
      message: "សំណើមិនត្រឹមត្រូវ សូមពិនិត្យព័ត៌មានឡើងវិញ។",
      isTokenInvalidOrExpired: false,
      isRateLimited: false,
    };
  }

  if (status === 401) {
    return {
      message: "សម័យកំណត់ពាក្យសម្ងាត់មិនត្រឹមត្រូវ",
      isTokenInvalidOrExpired: true,
      isRateLimited: false,
    };
  }

  if (status === 403) {
    return {
      message: "អ្នកមិនមានសិទ្ធិធ្វើសកម្មភាពនេះ",
      isTokenInvalidOrExpired: false,
      isRateLimited: false,
    };
  }

  if (status === 404) {
    return {
      message: "តំណកំណត់ពាក្យសម្ងាត់មិនត្រឹមត្រូវ",
      isTokenInvalidOrExpired: true,
      isRateLimited: false,
    };
  }

  if (status === 410) {
    return {
      message: "តំណកំណត់ពាក្យសម្ងាត់បានផុតកំណត់",
      isTokenInvalidOrExpired: true,
      isRateLimited: false,
    };
  }

  if (status && status >= 500) {
    return {
      message: "មានបញ្ហាក្នុងប្រព័ន្ធ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
      isTokenInvalidOrExpired: false,
      isRateLimited: false,
    };
  }

  // Network / connection error or unexpected failure
  return {
    message: "មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ប្រព័ន្ធ។ សូមព្យាយាមម្តងទៀត។",
    isTokenInvalidOrExpired: false,
    isRateLimited: false,
  };
}
