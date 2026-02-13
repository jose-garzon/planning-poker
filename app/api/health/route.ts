import { apiResponse } from '@/shared/lib/api/response';

/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET() {
  return apiResponse({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
}
