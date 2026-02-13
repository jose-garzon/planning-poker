import { z } from 'zod';

/**
 * Validation schemas for user operations
 */

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  role: z.enum(['USER', 'ADMIN']).optional().default('USER'),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export const userIdSchema = z.object({
  id: z.string().cuid('Invalid user ID'),
});

export const listUsersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

// Inferred types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdInput = z.infer<typeof userIdSchema>;
export type ListUsersInput = z.infer<typeof listUsersSchema>;
