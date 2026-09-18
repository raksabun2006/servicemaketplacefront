export type ServiceCategory =
  | "CLEANING"
  | "PLUMBING"
  | "ELECTRICAL"
  | "CARPENTRY"
  | "PAINTING"
  | "APPLIANCE_REPAIR"
  | "AC_REPAIR"
  | "PEST_CONTROL"
  | "TUTORING"
  | "BEAUTY"
  | "OTHER";

export type ServiceRequestStatus =
  | "OPEN"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export interface ServiceRequestCreateRequest {
  title: string;
  description: string;
  category: ServiceCategory;
  budgetMin?: number;
  budgetMax?: number;
  preferredDate?: string;
  preferredTime?: string;
  address: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  urgent?: boolean;
  imageFileIds?: string[];
}

export interface ServiceRequestUpdateRequest {
  title?: string;
  description?: string;
  category?: ServiceCategory;
  budgetMin?: number;
  budgetMax?: number;
  preferredDate?: string;
  preferredTime?: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  urgent?: boolean;
}

export interface ServiceRequestResponse {
  id: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  selectedProviderId?: string;
  selectedProviderBusinessName?: string;
  title: string;
  description: string;
  category: ServiceCategory;
  budgetMin?: number;
  budgetMax?: number;
  preferredDate?: string;
  preferredTime?: string;
  address: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  urgent?: boolean;
  status: ServiceRequestStatus;
  imageUrls?: string[];
  offerCount?: number;
  cancellationReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceRequestSummaryResponse {
  id: string;
  title: string;
  category: ServiceCategory;
  city?: string;
  district?: string;
  distanceKm?: number;
  budgetMin?: number;
  budgetMax?: number;
  preferredDate?: string;
  preferredTime?: string;
  urgent?: boolean;
  status: ServiceRequestStatus;
  offerCount?: number;
  createdAt: string;
  imageUrls?: string[];
  imageFileIds?: string[];
  imageUrl?: string;
}

export interface CancelServiceRequestRequest {
  reason: string;
}
