export interface PageMetadata {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface PagedResponse<T> {
  content: T[];
  page: PageMetadata;
}

export interface ApiError {
  status?: number;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
  timestamp?: string;
}
