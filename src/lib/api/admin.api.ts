import api from "./client";
import { PagedResponse } from "@/types/api";
import {
  AdminDashboardResponse,
  ProviderApplicationResponse,
  ProviderReviewActionRequest,
} from "@/types/admin";
import { UserResponse } from "@/types/auth";
import { BookingResponse } from "@/types/booking";
import { ProviderProfileResponse } from "@/types/provider";

export const adminApi = {
  getDashboard: () =>
    api.get<AdminDashboardResponse>("/api/v1/admin/dashboard"),

  getUsers: (page = 0, size = 20) =>
    api.get<PagedResponse<UserResponse>>("/api/v1/admin/users", { page, size }),

  getProviders: (page = 0, size = 20) =>
    api.get<PagedResponse<ProviderProfileResponse>>("/api/v1/admin/providers", { page, size }),

  getPendingProviders: (page = 0, size = 20) =>
    api.get<PagedResponse<ProviderProfileResponse>>("/api/v1/admin/providers/pending", { page, size }),

  approveProvider: (providerId: string, reason = "Approved") =>
    api.put<ProviderProfileResponse>(`/api/v1/admin/providers/${providerId}/approve`, { reason } as ProviderReviewActionRequest),

  rejectProvider: (providerId: string, reason: string) =>
    api.put<ProviderProfileResponse>(`/api/v1/admin/providers/${providerId}/reject`, { reason } as ProviderReviewActionRequest),

  getApplications: (params?: { status?: string; search?: string; page?: number; size?: number }) =>
    api.get<PagedResponse<ProviderApplicationResponse>>("/api/v1/admin/provider-applications", {
      page: params?.page ?? 0,
      size: params?.size ?? 20,
      ...(params?.status ? { status: params.status } : {}),
      ...(params?.search ? { search: params.search } : {}),
    }),

  approveApplication: (id: string) =>
    api.post<ProviderApplicationResponse>(`/api/v1/admin/provider-applications/${id}/approve`),

  rejectApplication: (id: string, reason: string) =>
    api.post<ProviderApplicationResponse>(`/api/v1/admin/provider-applications/${id}/reject`, { reason }),

  getBookings: (page = 0, size = 20) =>
    api.get<PagedResponse<BookingResponse>>("/api/v1/admin/bookings", { page, size }),
};
