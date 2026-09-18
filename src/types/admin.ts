export interface AdminDashboardResponse {
  totalUsers?: number;
  totalCustomers?: number;
  totalProviders?: number;
  totalServices?: number;
  totalBookings?: number;
  pendingBookings?: number;
  completedBookings?: number;
  cancelledBookings?: number;
  totalRevenue?: number;
  pendingProviderVerifications?: number;
}

export interface AdminProfileResponse {
  id?: string;
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  department?: string;
  position?: string;
  emergencyContact?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicantDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface ProviderApplicationResponse {
  id: string;
  applicant?: ApplicantDto;
  businessName?: string;
  bio?: string;
  experienceYears?: number;
  serviceArea?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  applicationStatus: ApplicationStatus;
  identityDocumentFileId?: string;
  identityDocumentUrl?: string;
  profilePhotoFileId?: string;
  profilePhotoUrl?: string;
  rejectionReason?: string;
  reviewedBy?: { id: string; fullName?: string; email?: string };
  reviewedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProviderReviewActionRequest {
  reason?: string;
}

export interface ProviderApplicationReviewRequest {
  reason?: string;
}
