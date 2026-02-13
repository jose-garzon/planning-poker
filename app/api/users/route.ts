import { UsersService } from '@/modules/users/services/users.service';
import { apiError, apiResponse } from '@/shared/lib/api/response';
import type { NextRequest } from 'next/server';

/**
 * List users with pagination
 * GET /api/users?page=1&limit=10&role=USER
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      role: searchParams.get('role') || undefined,
    };

    const result = await UsersService.listUsers(queryParams);

    return apiResponse({ data: result });
  } catch (error) {
    return apiError(error);
  }
}

/**
 * Create a new user
 * POST /api/users
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await UsersService.createUser(body);

    return apiResponse({
      data: { user },
      status: 201,
    });
  } catch (error) {
    return apiError(error);
  }
}
