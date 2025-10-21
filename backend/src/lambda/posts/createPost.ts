import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
const { v4: uuidv4 } = require('uuid');
import { Post } from '../../types';
import { successResponse, errorResponse } from '../../utils/response';
import { validatePostContent, sanitizeInput } from '../../utils/validation';

const dynamodb = new DynamoDB.DocumentClient();
const POSTS_TABLE = process.env.POSTS_TABLE!;

interface CreatePostRequest {
  content: string;
  imageUrl?: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return errorResponse('Request body is required', 400);
    }

    const userId = event.requestContext.authorizer?.claims.sub;
    if (!userId) {
      return errorResponse('User not authenticated', 401);
    }

    const { content, imageUrl }: CreatePostRequest = JSON.parse(event.body);

    if (!content) {
      return errorResponse('Content is required', 400);
    }

    if (!validatePostContent(content)) {
      return errorResponse('Content must be between 1 and 500 characters', 400);
    }

    const sanitizedContent = sanitizeInput(content);
    const postId = uuidv4();
    const now = new Date().toISOString();

    const post: Post = {
      postId,
      userId,
      content: sanitizedContent,
      imageUrl,
      createdAt: now,
      updatedAt: now,
      likesCount: 0,
      commentsCount: 0,
    };

    await dynamodb.put({
      TableName: POSTS_TABLE,
      Item: post,
    }).promise();

    return successResponse(post, 'Post created successfully', 201);
  } catch (error) {
    console.error('Error creating post:', error);
    return errorResponse('Internal server error', 500);
  }
};