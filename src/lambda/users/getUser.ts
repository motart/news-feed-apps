import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { successResponse, errorResponse } from '../../utils/response';

const dynamodb = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.userId;

    if (!userId) {
      return errorResponse('User ID is required', 400);
    }

    const result = await dynamodb.get({
      TableName: USERS_TABLE,
      Key: {
        userId,
      },
    }).promise();

    if (!result.Item) {
      return errorResponse('User not found', 404);
    }

    const user = result.Item;
    delete user.email;

    return successResponse(user);
  } catch (error) {
    console.error('Error getting user:', error);
    return errorResponse('Internal server error', 500);
  }
};