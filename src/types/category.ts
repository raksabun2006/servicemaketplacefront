import { FileUploadResponse } from "./file";

export interface CategoryResponse {
  id: string;
  name: string;
  code: string;
  description?: string;
  iconFile?: FileUploadResponse;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  code?: string;
  description?: string;
  iconFileId?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  code?: string;
  description?: string;
  iconFileId?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CategoryQueryParams {
  [key: string]: string | number | boolean | null | undefined;
  search?: string;
  isActive?: boolean;
  page?: number;
  size?: number;
}
