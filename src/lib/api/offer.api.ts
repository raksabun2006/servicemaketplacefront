import api from "./client";
import { PagedResponse } from "@/types/api";
import { ServiceRequestOfferRequest, ServiceRequestOfferResponse } from "@/types/offer";
import { ServiceRequestResponse } from "@/types/service-request";

export const offerApi = {
  submitOffer: (requestId: string, data: ServiceRequestOfferRequest) =>
    api.post<ServiceRequestOfferResponse>(`/api/v1/service-requests/${requestId}/offers`, data),

  getRequestOffers: (requestId: string, page = 0, size = 20) =>
    api.get<PagedResponse<ServiceRequestOfferResponse>>(`/api/v1/service-requests/${requestId}/offers`, { page, size }),

  acceptOffer: (requestId: string, offerId: string) =>
    api.post<ServiceRequestResponse>(`/api/v1/service-requests/${requestId}/offers/${offerId}/accept`),

  rejectOffer: (requestId: string, offerId: string) =>
    api.post<ServiceRequestOfferResponse>(`/api/v1/service-requests/${requestId}/offers/${offerId}/reject`),

  withdrawOffer: (offerId: string) =>
    api.put<ServiceRequestOfferResponse>(`/api/v1/offers/${offerId}/withdraw`),

  getMyOffers: (page = 0, size = 20) =>
    api.get<PagedResponse<ServiceRequestOfferResponse>>("/api/v1/providers/me/offers", { page, size }),
};
