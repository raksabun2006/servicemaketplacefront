export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN" | "MANAGER";

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  verificationStatus?: string;
  isVerified?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user: UserResponse;
}

export interface GoogleLoginRequest {
  idToken: string;
  credential?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
  businessName?: string;
  bio?: string;
  experienceYears?: number;
  serviceArea?: string;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  identityDocumentFileId?: string;
  profilePhotoFileId?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MessageResponse {
  message: string;
  timestamp?: string;
  status?: number;
  error?: string;
}
