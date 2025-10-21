import { APIGatewayProxyResult } from 'aws-lambda';
import { APIResponse, PaginatedResponse } from '../types';

export const createResponse = (
  statusCode: number,
  body: APIResponse,
  headers: Record<string, string> = {}
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      ...headers,
    },
    body: JSON.stringify(body),
  };
};

export const successResponse = <T>(
  data: T,
  message?: string,
  statusCode: number = 200
): APIGatewayProxyResult => {
  return createResponse(statusCode, {
    success: true,
    data,
    message,
  });
};

export const errorResponse = (
  error: string,
  statusCode: number = 400
): APIGatewayProxyResult => {
  return createResponse(statusCode, {
    success: false,
    error,
  });
};

export const paginatedResponse = <T>(
  data: T[],
  nextToken?: string,
  hasMore: boolean = false,
  message?: string
): APIGatewayProxyResult => {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    nextToken,
    hasMore,
    message,
  };
  return createResponse(200, response);
};