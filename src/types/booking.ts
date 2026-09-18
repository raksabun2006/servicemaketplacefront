export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "NO_SHOW";

export interface BookingResponse {
  id: string;
  serviceId?: string;
  serviceTitle?: string;
  serviceCategory?: string;
  serviceRequestId?: string;
  acceptedOfferId?: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  providerId: string;
  providerBusinessName?: string;
  providerFullName?: string;
  providerPhone?: string;
  price?: number;
  status: BookingStatus;
  address: string;
  city?: string;
  scheduledDate?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  scheduledAt?: string;
  notes?: string;
  cancellationReason?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  serviceId?: string;
  serviceRequestId?: string;
  acceptedOfferId?: string;
  providerId?: string;
  scheduledAt?: string;
  scheduledDate?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  address: string;
  city?: string;
  notes?: string;
}

export interface CancelBookingRequest {
  reason: string;
}

export interface RejectBookingRequest {
  reason: string;
}
