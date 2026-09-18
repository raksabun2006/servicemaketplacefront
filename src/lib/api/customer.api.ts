import api from "./client";
import {
  CustomerDashboardResponse,
  CustomerProfileResponse,
  UpdateCustomerProfileRequest,
} from "@/types/customer";

export const customerApi = {
  getMyProfile: () =>
    api.get<CustomerProfileResponse>("/api/v1/customers/me"),

  updateMyProfile: (data: UpdateCustomerProfileRequest) =>
    api.put<CustomerProfileResponse>("/api/v1/customers/me", data),

  getDashboard: () =>
    api.get<CustomerDashboardResponse>("/api/v1/customers/me/dashboard"),
};
