import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { paginatedResponse, errorResponse } from '../../utils/response';

const dynamodb = new DynamoDB.DocumentClient();
const FEEDS_TABLE = process.env.FEEDS_TABLE!;
const POSTS_TABLE = process.env.POSTS_TABLE!;
const USERS_TABLE = process.env.USERS_TABLE!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims.sub;
    const limit = parseInt(event.queryStringParameters?.limit || '20');
    const nextToken = event.queryStringParameters?.nextToken;

    if (!userId) {
      return errorResponse('User not authenticated', 401);
    }

    if (limit > 50) {
      return errorResponse('Limit cannot exceed 50', 400);
    }

    const queryParams: DynamoDB.DocumentClient.QueryInput = {
      TableName: FEEDS_TABLE,
      IndexName: 'user-feed-timeline-index',
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

    const feedResult = await dynamodb.query(queryParams).promise();
    const feedItems = feedResult.Items || [];

    if (feedItems.length === 0) {
      return paginatedResponse([], undefined, false);
    }

    const postIds = feedItems.map(item => item.postId);
    const postKeys = postIds.map(postId => ({ postId }));

    const postsResult = await dynamodb.batchGet({
      RequestItems: {
        [POSTS_TABLE]: {
          Keys: postKeys,
        },
      },
    }).promise();

    const posts = postsResult.Responses?.[POSTS_TABLE] || [];
    
    const userIds = [...new Set(posts.map(post => post.userId))];
    const userKeys = userIds.map(userId => ({ userId }));

    const usersResult = await dynamodb.batchGet({
      RequestItems: {
        [USERS_TABLE]: {
          Keys: userKeys,
        },
      },
    }).promise();

    const users = usersResult.Responses?.[USERS_TABLE] || [];
    const userMap = users.reduce((acc, user) => {
      delete user.email;
      acc[user.userId] = user;
      return acc;
    }, {} as Record<string, any>);

    const enrichedPosts = posts.map(post => ({
      ...post,
      author: userMap[post.userId],
    }));

    const hasMore = !!feedResult.LastEvaluatedKey;
    const newNextToken = feedResult.LastEvaluatedKey 
      ? Buffer.from(JSON.stringify(feedResult.LastEvaluatedKey)).toString('base64')
      : undefined;

    return paginatedResponse(enrichedPosts, newNextToken, hasMore);
  } catch (error) {
    console.error('Error getting feed:', error);
    return errorResponse('Internal server error', 500);
  }
};