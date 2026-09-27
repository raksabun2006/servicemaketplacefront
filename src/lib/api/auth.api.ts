import api from "./client";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  MessageResponse,
} from "@/types/auth";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/api/v1/auth/login", data);
    if (res.accessToken) {
      api.setToken(res.accessToken);
    }
    return res;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/api/v1/auth/register", data);
    if (res.accessToken) {
      api.setToken(res.accessToken);
    }
    return res;
  },

  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const payload = {
      idToken,
      credential: idToken,
    };

    let lastError: unknown = null;

    // 1. Try primary endpoint: /api/v1/users/google
    try {
      const res = await api.post<AuthResponse>("/api/v1/users/google", payload);
      if (res?.accessToken) {
        api.setToken(res.accessToken);
      }
      return res;
    } catch (err: unknown) {
      lastError = err;
      const apiErr = err as { status?: number; message?: string };
      // If primary endpoint route is not mapped (404) or blocked by Spring Security filter (401 without token message),
      // gracefully try fallback endpoints.
      const isRouteMissing = apiErr?.status === 404;
      const isSecurityBlocked = apiErr?.status === 401 && (!apiErr.message || apiErr.message === "Unauthorized");

      if (isRouteMissing || isSecurityBlocked) {
        // 2. Try /api/v1/users/google-login
        try {
          const res = await api.post<AuthResponse>("/api/v1/users/google-login", payload);
          if (res?.accessToken) {
            api.setToken(res.accessToken);
          }
          return res;
        } catch (err2: unknown) {
          lastError = err2;
        }

        // 3. Try /api/v1/auth/google
        try {
          const res = await api.post<AuthResponse>("/api/v1/auth/google", payload);
          if (res?.accessToken) {
            api.setToken(res.accessToken);
          }
          return res;
        } catch (err3: unknown) {
          lastError = err3;
        }

        // 4. Try /api/v1/auth/google-login
        try {
          const res = await api.post<AuthResponse>("/api/v1/auth/google-login", payload);
          if (res?.accessToken) {
            api.setToken(res.accessToken);
          }
          return res;
        } catch (err4: unknown) {
          lastError = err4;
        }
      }
    }

    throw lastError;
  },

  forgotPassword: async (email: string): Promise<MessageResponse> => {
    return await api.post<MessageResponse>("/api/v1/auth/forgot-password", {
      email: email.trim().toLowerCase(),
    });
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<MessageResponse> => {
    return await api.post<MessageResponse>("/api/v1/auth/reset-password", {
      token: data.token.trim(),
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  },

  logout: () => {
    api.setToken(null);
  },
};
