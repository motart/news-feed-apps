import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { Relationship } from '../../types';
import { successResponse, errorResponse } from '../../utils/response';

const dynamodb = new DynamoDB.DocumentClient();
const RELATIONSHIPS_TABLE = process.env.RELATIONSHIPS_TABLE!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const followerId = event.requestContext.authorizer?.claims.sub;
    const followingId = event.pathParameters?.userId;

    if (!followerId) {
      return errorResponse('User not authenticated', 401);
    }

    if (!followingId) {
      return errorResponse('User ID to follow is required', 400);
    }

    if (followerId === followingId) {
      return errorResponse('Cannot follow yourself', 400);
    }

    const existingRelationship = await dynamodb.get({
      TableName: RELATIONSHIPS_TABLE,
      Key: {
        followerId,
        followingId,
      },
    }).promise();

    if (existingRelationship.Item) {
      return errorResponse('Already following this user', 409);
    }

    const now = new Date().toISOString();
    const relationship: Relationship = {
      followerId,
      followingId,
      createdAt: now,
    };

    await dynamodb.put({
      TableName: RELATIONSHIPS_TABLE,
      Item: relationship,
    }).promise();

    return successResponse(relationship, 'Successfully followed user', 201);
  } catch (error) {
    console.error('Error following user:', error);
    return errorResponse('Internal server error', 500);
  }
};