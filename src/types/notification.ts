export type NotificationType =
  | "NEW_OFFER"
  | "OFFER_ACCEPTED"
  | "OFFER_REJECTED"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_REJECTED"
  | "SERVICE_STARTED"
  | "SERVICE_COMPLETED"
  | "NEW_MESSAGE"
  | "REVIEW_RECEIVED"
  | "NEW_REQUEST_NEARBY"
  | "VERIFICATION_APPROVED"
  | "VERIFICATION_REJECTED"
  | "SYSTEM";

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: string;
  referenceType?: string;
  read: boolean;
  createdAt: string;
}
