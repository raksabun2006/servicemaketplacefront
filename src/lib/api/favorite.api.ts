import api from "./client";
import { PagedResponse } from "@/types/api";
import { FavoriteProviderResponse } from "@/types/customer";

export const favoriteApi = {
  getMyFavorites: (page = 0, size = 20) =>
    api.get<PagedResponse<FavoriteProviderResponse>>("/api/v1/customers/me/favorites", { page, size }),

  favorite: (providerId: string) =>
    api.post<FavoriteProviderResponse>(`/api/v1/providers/${providerId}/favorite`),

  unfavorite: (providerId: string) =>
    api.delete<{ message: string }>(`/api/v1/providers/${providerId}/favorite`),

  isFavorite: (providerId: string) =>
    api.get<{ favorited: boolean }>(`/api/v1/providers/${providerId}/is-favorite`),
};
