import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { paginatedResponse, errorResponse } from '../../utils/response';

const dynamodb = new DynamoDB.DocumentClient();
const POSTS_TABLE = process.env.POSTS_TABLE!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.userId;
    const limit = parseInt(event.queryStringParameters?.limit || '20');
    const nextToken = event.queryStringParameters?.nextToken;

    if (!userId) {
      return errorResponse('User ID is required', 400);
    }

    if (limit > 50) {
      return errorResponse('Limit cannot exceed 50', 400);
    }

    const queryParams: DynamoDB.DocumentClient.QueryInput = {
      TableName: POSTS_TABLE,
      IndexName: 'user-posts-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false,
      Limit: limit,
    };

    if (nextToken) {
      queryParams.ExclusiveStartKey = JSON.parse(Buffer.from(nextToken, 'base64').toString());
    }

    const result = await dynamodb.query(queryParams).promise();

    const posts = result.Items || [];
    const hasMore = !!result.LastEvaluatedKey;
    const newNextToken = result.LastEvaluatedKey 
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : undefined;

    return paginatedResponse(posts, newNextToken, hasMore);
  } catch (error) {
    console.error('Error getting posts:', error);
    return errorResponse('Internal server error', 500);
  }
};