import api from "./client";
import { PagedResponse } from "@/types/api";
import {
  CreateProviderProfileRequest,
  NearbyProviderResponse,
  ProviderDashboardResponse,
  ProviderProfileResponse,
  ProviderVerificationRequest,
  UpdateAvailabilityRequest,
  UpdateProviderProfileRequest,
} from "@/types/provider";

export const providerApi = {
  getMyProfile: () =>
    api.get<ProviderProfileResponse>("/api/v1/providers/me"),

  updateMyProfile: (data: UpdateProviderProfileRequest) =>
    api.put<ProviderProfileResponse>("/api/v1/providers/me", data),

  createProfile: (data: CreateProviderProfileRequest) =>
    api.post<ProviderProfileResponse>("/api/v1/providers/me", data),

  updateAvailability: (data: UpdateAvailabilityRequest) =>
    api.put<ProviderProfileResponse>("/api/v1/providers/me/availability", data),

  getDashboard: () =>
    api.get<ProviderDashboardResponse>("/api/v1/providers/me/dashboard"),

  submitVerification: (data: ProviderVerificationRequest) =>
    api.post<ProviderProfileResponse>("/api/v1/providers/me/verification", data),

  getById: (id: string) =>
    api.get<ProviderProfileResponse>(`/api/v1/providers/${id}`),

  list: (params?: { page?: number; size?: number }) =>
    api.get<PagedResponse<ProviderProfileResponse>>("/api/v1/providers", params),

  getNearby: (params: { latitude: number; longitude: number; radiusKm?: number; page?: number; size?: number }) =>
    api.get<PagedResponse<NearbyProviderResponse>>("/api/v1/providers/nearby", params),
};
