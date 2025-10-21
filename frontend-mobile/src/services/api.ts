import { get, post, put, del } from 'aws-amplify/api';
import { APIResponse, PaginatedResponse, User, Post } from '../types';

const API_NAME = 'newsfeedApi';

class ApiService {
  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    data?: any
  ): Promise<T> {
    try {
      let response;
      const options = data ? { body: data } : {};

      switch (method) {
        case 'GET':
          response = await get({ apiName: API_NAME, path, options }).response;
          break;
        case 'POST':
          response = await post({ apiName: API_NAME, path, options }).response;
          break;
        case 'PUT':
          response = await put({ apiName: API_NAME, path, options }).response;
          break;
        case 'DELETE':
          response = await del({ apiName: API_NAME, path, options }).response;
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      const result = await response.body.json() as any;
      
      if (!result || !result.success) {
        throw new Error(result?.error || 'API request failed');
      }
      
      return result;
    } catch (error) {
      console.error(`API ${method} ${path} error:`, error);
      throw error;
    }
  }

  async createUser(userData: {
    email: string;
    username: string;
    displayName: string;
    bio?: string;
  }): Promise<APIResponse<User>> {
    return this.makeRequest('POST', '/users', userData);
  }

  async getUser(userId: string): Promise<APIResponse<User>> {
    return this.makeRequest('GET', `/users/${userId}`);
  }

  async getUserPosts(userId: string, limit = 20, nextToken?: string): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (nextToken) params.append('nextToken', nextToken);
    
    return this.makeRequest('GET', `/users/${userId}/posts?${params}`);
  }

  async createPost(content: string, imageUrl?: string): Promise<APIResponse<Post>> {
    return this.makeRequest('POST', '/posts', { content, imageUrl });
  }

  async followUser(userId: string): Promise<APIResponse> {
    return this.makeRequest('POST', `/users/${userId}/follow`);
  }

  async unfollowUser(userId: string): Promise<APIResponse> {
    return this.makeRequest('DELETE', `/users/${userId}/follow`);
  }

  async getFeed(limit = 20, nextToken?: string): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (nextToken) params.append('nextToken', nextToken);
    
    return this.makeRequest('GET', `/feed?${params}`);
  }
}

export const apiService = new ApiService();