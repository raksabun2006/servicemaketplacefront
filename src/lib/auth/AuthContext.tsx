"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AuthResponse, LoginRequest, RegisterRequest, UserResponse, UserRole } from "@/types/auth";
import { authApi } from "@/lib/api/auth.api";
import { providerApi } from "@/lib/api/provider.api";
import { customerApi } from "@/lib/api/customer.api";
import { adminApi } from "@/lib/api/admin.api";
import api from "@/lib/api/client";

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCustomer: boolean;
  isProvider: boolean;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (user: UserResponse) => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUserProfile = useCallback(async () => {
    const currentToken = api.getToken();
    if (!currentToken) return;

    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser: UserResponse | null = storedUser ? JSON.parse(storedUser) : null;
      if (!parsedUser) return;

      if (parsedUser.role === "PROVIDER") {
        const prov = await providerApi.getMyProfile();
        if (prov) {
          const updated: UserResponse = {
            ...parsedUser,
            fullName: prov.fullName || parsedUser.fullName,
            avatarUrl: prov.avatarUrl || parsedUser.avatarUrl,
            phone: prov.phone || parsedUser.phone,
            verificationStatus: prov.verificationStatus,
            isVerified: prov.isVerified,
          };
          setUser(updated);
          localStorage.setItem("user", JSON.stringify(updated));
        }
      } else if (parsedUser.role === "CUSTOMER") {
        const cust = await customerApi.getMyProfile();
        if (cust) {
          const updated: UserResponse = {
            ...parsedUser,
            fullName: cust.fullName || parsedUser.fullName,
            avatarUrl: cust.avatarUrl || parsedUser.avatarUrl,
            phone: cust.phone || parsedUser.phone,
          };
          setUser(updated);
          localStorage.setItem("user", JSON.stringify(updated));
        }
      } else if (parsedUser.role === "ADMIN") {
        const adm = await adminApi.getMyProfile();
        if (adm) {
          const updated: UserResponse = {
            ...parsedUser,
            fullName: adm.fullName || parsedUser.fullName,
            avatarUrl: adm.avatarUrl || parsedUser.avatarUrl,
            phone: adm.phone || parsedUser.phone,
          };
          setUser(updated);
          localStorage.setItem("user", JSON.stringify(updated));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Synchronize with localStorage after initial mount to prevent hydration mismatch
  React.useEffect(() => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");
      if (storedToken) {
        setToken(storedToken);
        api.setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }

    // Always fetch latest profile & avatar in background
    refreshUserProfile();
  }, [refreshUserProfile]);

  const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await authApi.login(data);
    if (res.accessToken) {
      setToken(res.accessToken);
      setUser(res.user);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      // Refresh to grab full provider/customer profile avatar
      setTimeout(() => refreshUserProfile(), 100);
    }
    return res;
  };

  const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await authApi.register(data);
    if (res.accessToken) {
      setToken(res.accessToken);
      setUser(res.user);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    authApi.logout();
    setToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  const updateUser = (newUser: UserResponse) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const role = user?.role || null;
  const isAuthenticated = !!token && !!user;
  const isCustomer = role === "CUSTOMER";
  const isProvider = role === "PROVIDER";
  const isAdmin = role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        isLoading,
        isCustomer,
        isProvider,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
