/**
 * Data model types
 */

import type { Post, PostStatus, Role, User } from '@prisma/client';

// Re-export Prisma types
export type { User, Post, Role, PostStatus };

// Extended types with relations
export type UserWithPosts = User & {
  posts: Post[];
};

export type PostWithAuthor = Post & {
  author: User;
};

// DTOs (Data Transfer Objects)
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface PostDTO {
  id: string;
  title: string;
  content: string | null;
  status: PostStatus;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
