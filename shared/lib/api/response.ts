import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError, ValidationError } from './errors';

/**
 * Standard API success response format
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
  timestamp: string;
}

/**
 * Creates a standardized successful API response
 */
export function apiResponse<T>(options: {
  data: T;
  status?: number;
}): NextResponse<ApiSuccessResponse<T>> {
  const { data, status = 200 } = options;

  return NextResponse.json(
    {
      success: true as const,
      data,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

/**
 * Creates a standardized error API response
 */
export function apiError(error: unknown): NextResponse<ApiErrorResponse> {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false as const,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 400 },
    );
  }

  // Handle custom ApiError instances
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false as const,
        error: {
          message: error.message,
          code: error.code ?? 'API_ERROR',
          details: error instanceof ValidationError ? error.errors : undefined,
        },
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode },
    );
  }

  // Handle unknown errors
  const message = error instanceof Error ? error.message : 'Internal server error';

  return NextResponse.json(
    {
      success: false as const,
      error: {
        message,
        code: 'INTERNAL_ERROR',
      },
      timestamp: new Date().toISOString(),
    },
    { status: 500 },
  );
}
