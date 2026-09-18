export type AvailabilityStatus = "AVAILABLE" | "BUSY" | "OFFLINE";

export type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";

export interface ProviderProfileResponse {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  businessName?: string;
  bio?: string;
  experienceYears?: number;
  serviceArea?: string;
  address?: string;
  city?: string;
  district?: string;
  hourlyRate?: number;
  latitude?: number;
  longitude?: number;
  serviceRadiusKm?: number;
  availabilityStatus?: AvailabilityStatus;
  workingDays?: string;
  workingHoursStart?: string;
  workingHoursEnd?: string;
  identityDocumentFileId?: string;
  profilePhotoFileId?: string;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
  isAvailable?: boolean;
  isVerified?: boolean;
  averageRating?: number;
  totalReviews?: number;
  completedServices?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProviderProfileRequest {
  businessName?: string;
  bio?: string;
  experienceYears?: number;
  serviceArea?: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  hourlyRate?: number;
}

export interface UpdateProviderProfileRequest {
  businessName?: string;
  bio?: string;
  avatarUrl?: string;
  experienceYears?: number;
  serviceArea?: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  hourlyRate?: number;
}

export interface UpdateAvailabilityRequest {
  availabilityStatus: AvailabilityStatus;
  workingHoursStart?: string;
  workingHoursEnd?: string;
  workingDays?: string;
  serviceRadiusKm?: number;
}

export interface ProviderVerificationRequest {
  identityDocumentFileId: string;
  profilePhotoFileId?: string;
}

export interface NearbyProviderResponse {
  id: string;
  businessName: string;
  fullName: string;
  avatarUrl?: string;
  city?: string;
  district?: string;
  distanceKm?: number;
  averageRating?: number;
  totalReviews?: number;
  hourlyRate?: number;
  isVerified?: boolean;
  availabilityStatus?: AvailabilityStatus;
  serviceArea?: string;
}

export interface ProviderDashboardResponse {
  newNearbyRequestsCount?: number;
  pendingOffersCount?: number;
  acceptedServicesCount?: number;
  todayBookingsCount?: number;
  completedServicesCount?: number;
  cancelledServicesCount?: number;
  averageRating?: number;
  totalReviews?: number;
}
