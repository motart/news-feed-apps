export interface User {
  userId: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  postId: string;
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
}

export interface Relationship {
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface Like {
  postId: string;
  userId: string;
  createdAt: string;
}

export interface Comment {
  commentId: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedItem {
  userId: string;
  postId: string;
  authorId: string;
  createdAt: string;
  score: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  nextToken?: string;
  hasMore: boolean;
}