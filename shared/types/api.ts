/**
 * API response and request types
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorDetails;
  timestamp: string;
}

export interface ApiErrorDetails {
  message: string;
  code?: string;
  details?: unknown;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
