import api from "./client";
import { PagedResponse } from "@/types/api";
import { NotificationResponse } from "@/types/notification";

export const notificationApi = {
  list: (page = 0, size = 20) =>
    api.get<PagedResponse<NotificationResponse>>("/api/v1/notifications", { page, size }),

  markAsRead: (id: string) =>
    api.post<NotificationResponse>(`/api/v1/notifications/${id}/read`),

  markAllAsRead: () =>
    api.post<{ message: string }>("/api/v1/notifications/read-all"),

  getUnreadCount: async () => {
    const res = await api.get<{ count: number } | number>("/api/v1/notifications/unread-count");
    if (typeof res === "number") return res;
    return res?.count ?? 0;
  },
};
