import { APIGatewayProxyEvent } from 'aws-lambda';

const mockDynamoDbQuery = jest.fn();
const mockDynamoDbPut = jest.fn();

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: mockDynamoDbQuery,
      put: mockDynamoDbPut,
    })),
  },
}));

import { handler } from '../../../../src/lambda/users/createUser';

describe('createUser Lambda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDynamoDbQuery.mockReturnValue({
      promise: () => Promise.resolve({ Items: [] }),
    });
    mockDynamoDbPut.mockReturnValue({
      promise: () => Promise.resolve({}),
    });
  });

  const createEvent = (body: any): APIGatewayProxyEvent => ({
    body: JSON.stringify(body),
    headers: {},
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/users',
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {} as any,
    resource: '',
    stageVariables: null,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
  });

  it('should create a user successfully', async () => {
    const event = createEvent({
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
      bio: 'Test bio',
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data.username).toBe('testuser');
    expect(body.data.displayName).toBe('Test User');
    expect(body.data.email).toBeUndefined(); // Should be removed from response
  });

  it('should return 400 for missing required fields', async () => {
    const event = createEvent({
      email: 'test@example.com',
      // Missing username and displayName
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('required');
  });

  it('should return 400 for invalid email', async () => {
    const event = createEvent({
      email: 'invalid-email',
      username: 'testuser',
      displayName: 'Test User',
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('Invalid email format');
  });

  it('should return 409 for existing email', async () => {
    mockDynamoDbQuery.mockReturnValueOnce({
      promise: () => Promise.resolve({ Items: [{ email: 'test@example.com' }] }),
    });

    const event = createEvent({
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(409);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('email already exists');
  });

  it('should sanitize input', async () => {
    const event = createEvent({
      email: 'test@example.com',
      username: 'testuser',
      displayName: '<script>Test User</script>',
      bio: '<div>Test bio</div>',
    });

    await handler(event);

    expect(mockDynamoDbPut).toHaveBeenCalledWith({
      TableName: process.env.USERS_TABLE,
      Item: expect.objectContaining({
        displayName: 'scriptTest User/script',
        bio: 'divTest bio/div',
      }),
    });
  });
});