import { UsersService } from '@/modules/users/services/users.service';
import { apiError, apiResponse } from '@/shared/lib/api/response';
import type { NextRequest } from 'next/server';

/**
 * Get a user by ID
 * GET /api/users/[id]
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await UsersService.getUserById(id);

    return apiResponse({ data: { user } });
  } catch (error) {
    return apiError(error);
  }
}

/**
 * Update a user by ID
 * PATCH /api/users/[id]
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const user = await UsersService.updateUser(id, body);

    return apiResponse({ data: { user } });
  } catch (error) {
    return apiError(error);
  }
}

/**
 * Delete a user by ID
 * DELETE /api/users/[id]
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await UsersService.deleteUser(id);

    return apiResponse({ data: result });
  } catch (error) {
    return apiError(error);
  }
}
