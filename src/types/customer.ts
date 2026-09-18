export interface CustomerProfileResponse {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
}

export interface UpdateCustomerProfileRequest {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
}

export interface CustomerDashboardResponse {
  myRequestsCount?: number;
  openRequestsCount?: number;
  pendingOffersCount?: number;
  upcomingBookingsCount?: number;
  completedServicesCount?: number;
  cancelledRequestsCount?: number;
  favoriteProvidersCount?: number;
  unreadNotificationsCount?: number;
}

export interface FavoriteProviderResponse {
  id: string;
  providerId: string;
  providerBusinessName?: string;
  providerFullName?: string;
  providerAvatarUrl?: string;
  providerAverageRating?: number;
  providerTotalReviews?: number;
  providerCity?: string;
  providerServiceArea?: string;
  createdAt: string;
}
