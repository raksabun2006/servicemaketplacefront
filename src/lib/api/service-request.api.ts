import api from "./client";
import { PagedResponse } from "@/types/api";
import {
  CancelServiceRequestRequest,
  ServiceCategory,
  ServiceRequestCreateRequest,
  ServiceRequestResponse,
  ServiceRequestStatus,
  ServiceRequestSummaryResponse,
  ServiceRequestUpdateRequest,
} from "@/types/service-request";

export const serviceRequestApi = {
  create: (data: ServiceRequestCreateRequest) =>
    api.post<ServiceRequestResponse>("/api/v1/service-requests", data),

  getMyRequests: (page = 0, size = 20) =>
    api.get<PagedResponse<ServiceRequestResponse>>("/api/v1/service-requests/my", { page, size }),

  getById: (id: string) =>
    api.get<ServiceRequestResponse>(`/api/v1/service-requests/${id}`),

  update: (id: string, data: ServiceRequestUpdateRequest) =>
    api.put<ServiceRequestResponse>(`/api/v1/service-requests/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/api/v1/service-requests/${id}`),

  cancel: (id: string, reason: string) =>
    api.post<ServiceRequestResponse>(`/api/v1/service-requests/${id}/cancel`, { reason } as CancelServiceRequestRequest),

  start: (id: string) =>
    api.post<ServiceRequestResponse>(`/api/v1/service-requests/${id}/start`),

  complete: (id: string) =>
    api.post<ServiceRequestResponse>(`/api/v1/service-requests/${id}/complete`),

  browse: (params?: {
    category?: ServiceCategory;
    city?: string;
    district?: string;
    status?: ServiceRequestStatus;
    minBudget?: number;
    maxBudget?: number;
    preferredDate?: string;
    urgent?: boolean;
    search?: string;
    page?: number;
    size?: number;
  }) => api.get<PagedResponse<ServiceRequestSummaryResponse>>("/api/v1/service-requests", params),

  getNearby: (params: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    category?: ServiceCategory;
    page?: number;
    size?: number;
  }) => api.get<PagedResponse<ServiceRequestSummaryResponse>>("/api/v1/service-requests/nearby", params),
};
