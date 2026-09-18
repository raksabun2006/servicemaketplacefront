import api from "./client";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

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

  logout: () => {
    api.setToken(null);
  },
};
