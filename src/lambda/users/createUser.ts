import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
const { v4: uuidv4 } = require('uuid');
import { User } from '../../types';
import { successResponse, errorResponse } from '../../utils/response';
import { validateEmail, validateUsername, sanitizeInput } from '../../utils/validation';

const dynamodb = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE!;

interface CreateUserRequest {
  email: string;
  username: string;
  displayName: string;
  bio?: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return errorResponse('Request body is required', 400);
    }

    const { email, username, displayName, bio }: CreateUserRequest = JSON.parse(event.body);

    if (!email || !username || !displayName) {
      return errorResponse('Email, username, and displayName are required', 400);
    }

    if (!validateEmail(email)) {
      return errorResponse('Invalid email format', 400);
    }

    if (!validateUsername(username)) {
      return errorResponse('Username must be 3-20 characters and contain only letters, numbers, and underscores', 400);
    }

    const sanitizedDisplayName = sanitizeInput(displayName);
    const sanitizedBio = bio ? sanitizeInput(bio) : undefined;

    const existingUserByEmail = await dynamodb.query({
      TableName: USERS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }).promise();

    if (existingUserByEmail.Items && existingUserByEmail.Items.length > 0) {
      return errorResponse('User with this email already exists', 409);
    }

    const existingUserByUsername = await dynamodb.query({
      TableName: USERS_TABLE,
      IndexName: 'username-index',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username,
      },
    }).promise();

    if (existingUserByUsername.Items && existingUserByUsername.Items.length > 0) {
      return errorResponse('Username already taken', 409);
    }

    const userId = uuidv4();
    const now = new Date().toISOString();

    const user: User = {
      userId,
      email,
      username,
      displayName: sanitizedDisplayName,
      bio: sanitizedBio,
      createdAt: now,
      updatedAt: now,
    };

    await dynamodb.put({
      TableName: USERS_TABLE,
      Item: user,
    }).promise();

    const { ...userResponse } = user;
    delete (userResponse as any).email;

    return successResponse(userResponse, 'User created successfully', 201);
  } catch (error) {
    console.error('Error creating user:', error);
    return errorResponse('Internal server error', 500);
  }
};