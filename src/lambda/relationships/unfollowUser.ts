import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
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
      return errorResponse('User ID to unfollow is required', 400);
    }

    const existingRelationship = await dynamodb.get({
      TableName: RELATIONSHIPS_TABLE,
      Key: {
        followerId,
        followingId,
      },
    }).promise();

    if (!existingRelationship.Item) {
      return errorResponse('Not following this user', 404);
    }

    await dynamodb.delete({
      TableName: RELATIONSHIPS_TABLE,
      Key: {
        followerId,
        followingId,
      },
    }).promise();

    return successResponse({}, 'Successfully unfollowed user');
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return errorResponse('Internal server error', 500);
  }
};