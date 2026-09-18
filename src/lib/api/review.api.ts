import api from "./client";
import { PagedResponse } from "@/types/api";
import { CreateReviewRequest, ReviewResponse } from "@/types/review";

export const reviewApi = {
  submitReview: (bookingId: string, data: CreateReviewRequest) =>
    api.post<ReviewResponse>(`/api/v1/bookings/${bookingId}/review`, data),

  getProviderReviews: (providerId: string, page = 0, size = 20) =>
    api.get<PagedResponse<ReviewResponse>>(`/api/v1/providers/${providerId}/reviews`, { page, size }),
};
