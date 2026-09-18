export type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export interface ServiceRequestOfferRequest {
  proposedPrice: number;
  message: string;
  estimatedCompletionTime?: string;
}

export interface ServiceRequestOfferResponse {
  id: string;
  serviceRequestId: string;
  providerId: string;
  providerBusinessName?: string;
  providerFullName?: string;
  providerPhone?: string;
  providerAverageRating?: number;
  providerTotalReviews?: number;
  proposedPrice: number;
  message: string;
  estimatedCompletionTime?: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt?: string;
}
