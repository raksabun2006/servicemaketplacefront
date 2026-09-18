import api from "./client";
import { PagedResponse } from "@/types/api";
import {
  CategoryQueryParams,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";

export const categoryApi = {
  /**
   * Retrieve all active service categories ordered by display order (Public)
   */
  getActive: () =>
    api.get<CategoryResponse[]>("/api/v1/categories"),

  /**
   * Retrieve details of a category by its unique ID (Public)
   */
  getById: (id: string) =>
    api.get<CategoryResponse>(`/api/v1/categories/${id}`),

  /**
   * Retrieve details of a category by its unique code (Public)
   */
  getByCode: (code: string) =>
    api.get<CategoryResponse>(`/api/v1/categories/code/${code}`),

  /**
   * Paginated list of categories with search & filter for Admin (Admin)
   */
  adminList: (params?: CategoryQueryParams) =>
    api.get<PagedResponse<CategoryResponse>>("/api/v1/admin/categories", params),

  /**
   * Create a new category (Admin)
   */
  create: (data: CreateCategoryRequest) =>
    api.post<CategoryResponse>("/api/v1/admin/categories", data),

  /**
   * Update an existing category (Admin)
   */
  update: (id: string, data: UpdateCategoryRequest) =>
    api.put<CategoryResponse>(`/api/v1/admin/categories/${id}`, data),

  /**
   * Delete a category by its ID (Admin)
   */
  delete: (id: string) =>
    api.delete<void>(`/api/v1/admin/categories/${id}`),

  /**
   * Toggle active/inactive status of a category (Admin)
   */
  toggleStatus: (id: string) =>
    api.patch<CategoryResponse>(`/api/v1/admin/categories/${id}/toggle-status`),
};
