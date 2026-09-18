export interface ConversationResponse {
  id: string;
  customerId: string;
  customerName?: string;
  customerAvatarUrl?: string;
  providerId: string;
  providerBusinessName?: string;
  providerFullName?: string;
  providerAvatarUrl?: string;
  serviceRequestId?: string;
  serviceRequestTitle?: string;
  bookingId?: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatMessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderAvatarUrl?: string;
  message: string;
  isMine?: boolean;
  read?: boolean;
  createdAt: string;
}

export interface CreateConversationRequest {
  providerId: string;
  serviceRequestId?: string;
  bookingId?: string;
  initialMessage?: string;
  participantId?: string;
}

export interface SendMessageRequest {
  message: string;
}
