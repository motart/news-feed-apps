import {
  createResponse,
  successResponse,
  errorResponse,
  paginatedResponse,
} from '../../../src/utils/response';

describe('Response Utils', () => {
  describe('createResponse', () => {
    it('should create a proper API Gateway response', () => {
      const response = createResponse(200, { success: true, data: 'test' });
      
      expect(response.statusCode).toBe(200);
      expect(response.headers!['Content-Type']).toBe('application/json');
      expect(response.headers!['Access-Control-Allow-Origin']).toBe('*');
      expect(JSON.parse(response.body)).toEqual({ success: true, data: 'test' });
    });

    it('should include custom headers', () => {
      const customHeaders = { 'Custom-Header': 'custom-value' };
      const response = createResponse(200, { success: true }, customHeaders);
      
      expect(response.headers!['Custom-Header']).toBe('custom-value');
    });
  });

  describe('successResponse', () => {
    it('should create a success response with data', () => {
      const data = { id: 1, name: 'test' };
      const response = successResponse(data, 'Success message');
      
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(data);
      expect(body.message).toBe('Success message');
    });

    it('should use custom status code', () => {
      const response = successResponse({}, undefined, 201);
      expect(response.statusCode).toBe(201);
    });
  });

  describe('errorResponse', () => {
    it('should create an error response', () => {
      const response = errorResponse('Something went wrong', 400);
      
      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Something went wrong');
    });

    it('should use default status code', () => {
      const response = errorResponse('Error');
      expect(response.statusCode).toBe(400);
    });
  });

  describe('paginatedResponse', () => {
    it('should create a paginated response', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const response = paginatedResponse(data, 'nextToken123', true, 'Success');
      
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(data);
      expect(body.nextToken).toBe('nextToken123');
      expect(body.hasMore).toBe(true);
      expect(body.message).toBe('Success');
    });
  });
});