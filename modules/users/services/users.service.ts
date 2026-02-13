import { ConflictError, NotFoundError } from '@/shared/lib/api/errors';
import { prisma } from '@/shared/lib/db/prisma';
import { createUserSchema, listUsersSchema, updateUserSchema } from '@/shared/lib/validations/user';

// biome-ignore lint/complexity/noStaticOnlyClass: Service class pattern for better organization
export class UsersService {
  /**
   * List users with pagination and optional role filter
   */
  static async listUsers(params: unknown) {
    const validatedParams = listUsersSchema.parse(params);
    const skip = (validatedParams.page - 1) * validatedParams.limit;
    const where = validatedParams.role ? { role: validatedParams.role } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: validatedParams.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items: users,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total,
        totalPages: Math.ceil(total / validatedParams.limit),
      },
    };
  }

  /**
   * Create a new user
   */
  static async createUser(data: unknown) {
    const validatedData = createUserSchema.parse(data);

    // Check for existing user with same email
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const user = await prisma.user.create({
      data: validatedData,
    });

    return user;
  }

  /**
   * Get a user by ID
   */
  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Update a user by ID
   */
  static async updateUser(id: string, data: unknown) {
    const validatedData = updateUserSchema.parse(data);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // If updating email, check for conflicts
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      if (emailExists) {
        throw new ConflictError('Email already in use');
      }
    }

    // Build update data to avoid exactOptionalPropertyTypes issues
    const updateData: {
      email?: string;
      name?: string;
      role?: 'USER' | 'ADMIN';
    } = {};

    if (validatedData.email !== undefined) {
      updateData.email = validatedData.email;
    }
    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }
    if (validatedData.role !== undefined) {
      updateData.role = validatedData.role;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return user;
  }

  /**
   * Delete a user by ID
   */
  static async deleteUser(id: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await prisma.user.delete({ where: { id } });

    return { message: 'User deleted successfully' };
  }
}
