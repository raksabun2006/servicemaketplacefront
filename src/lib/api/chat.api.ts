import api from "./client";
import { PagedResponse } from "@/types/api";
import {
  ChatMessageResponse,
  ConversationResponse,
  CreateConversationRequest,
  SendMessageRequest,
} from "@/types/chat";

export const chatApi = {
  getConversations: (page = 0, size = 20) =>
    api.get<PagedResponse<ConversationResponse>>("/api/v1/conversations", { page, size }),

  createOrGetConversation: (data: CreateConversationRequest) => {
    const payload = {
      providerId: data.providerId || data.participantId,
      serviceRequestId: data.serviceRequestId,
      bookingId: data.bookingId,
      initialMessage: data.initialMessage,
    };
    return api.post<ConversationResponse>("/api/v1/conversations", payload);
  },

  getMessages: (conversationId: string, page = 0, size = 50) =>
    api.get<PagedResponse<ChatMessageResponse>>(`/api/v1/conversations/${conversationId}/messages`, { page, size }),

  sendMessage: (conversationId: string, message: string) =>
    api.post<ChatMessageResponse>(`/api/v1/conversations/${conversationId}/messages`, { message } as SendMessageRequest),

  markAsRead: (conversationId: string) =>
    api.post<{ message: string }>(`/api/v1/conversations/${conversationId}/read`),
};
