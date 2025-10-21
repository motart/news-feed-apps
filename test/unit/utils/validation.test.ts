import {
  validateEmail,
  validateUsername,
  validatePostContent,
  validateCommentContent,
  sanitizeInput,
} from '../../../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test.domain.com')).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('should validate correct usernames', () => {
      expect(validateUsername('test_user')).toBe(true);
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('validuser')).toBe(true);
    });

    it('should reject invalid usernames', () => {
      expect(validateUsername('ab')).toBe(false); // too short
      expect(validateUsername('a'.repeat(21))).toBe(false); // too long
      expect(validateUsername('user-name')).toBe(false); // contains dash
      expect(validateUsername('user@name')).toBe(false); // contains special char
      expect(validateUsername('user name')).toBe(false); // contains space
    });
  });

  describe('validatePostContent', () => {
    it('should validate correct post content', () => {
      expect(validatePostContent('Valid post content')).toBe(true);
      expect(validatePostContent('a'.repeat(500))).toBe(true);
    });

    it('should reject invalid post content', () => {
      expect(validatePostContent('')).toBe(false);
      expect(validatePostContent('   ')).toBe(false);
      expect(validatePostContent('a'.repeat(501))).toBe(false);
    });
  });

  describe('validateCommentContent', () => {
    it('should validate correct comment content', () => {
      expect(validateCommentContent('Valid comment')).toBe(true);
      expect(validateCommentContent('a'.repeat(200))).toBe(true);
    });

    it('should reject invalid comment content', () => {
      expect(validateCommentContent('')).toBe(false);
      expect(validateCommentContent('   ')).toBe(false);
      expect(validateCommentContent('a'.repeat(201))).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('Normal text')).toBe('Normal text');
      expect(sanitizeInput('  Text with spaces  ')).toBe('Text with spaces');
    });
  });
});