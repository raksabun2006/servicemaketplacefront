export interface ReviewResponse {
  id: string;
  bookingId: string;
  customerId: string;
  customerName?: string;
  customerAvatarUrl?: string;
  providerId: string;
  providerBusinessName?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}
