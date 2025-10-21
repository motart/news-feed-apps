# Newsfeed Backend API

A serverless social media news feed API built with AWS CDK, Lambda, and DynamoDB.

## Features

- User management with Cognito authentication
- Post creation and retrieval
- Follow/unfollow relationships
- Personalized news feeds
- Media storage with S3 and CloudFront CDN
- Comprehensive unit tests

## Tech Stack

- **AWS CDK** - Infrastructure as Code
- **AWS Lambda** - Serverless functions
- **Amazon DynamoDB** - NoSQL database
- **Amazon Cognito** - User authentication
- **Amazon S3 + CloudFront** - Media storage and CDN
- **API Gateway** - REST API
- **TypeScript** - Language
- **Jest** - Testing framework

## API Endpoints

### Users
- `POST /users` - Create user
- `GET /users/{userId}` - Get user profile
- `GET /users/{userId}/posts` - Get user posts

### Posts
- `POST /posts` - Create post (authenticated)

### Relationships
- `POST /users/{userId}/follow` - Follow user (authenticated)
- `DELETE /users/{userId}/follow` - Unfollow user (authenticated)

### Feed
- `GET /feed` - Get personalized feed (authenticated)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Deploy to AWS:
```bash
npm run deploy
```

## Testing

Run unit tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Development

Start TypeScript compiler in watch mode:
```bash
npm run watch
```

Run linter:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## Architecture

The backend uses a serverless architecture with:

- **DynamoDB Tables**: Users, Posts, Relationships, Likes, Comments, Feeds
- **Lambda Functions**: Individual functions for each API endpoint
- **API Gateway**: RESTful API with Cognito authorization
- **S3 + CloudFront**: Media storage and global CDN

## Security

- All authenticated endpoints require valid Cognito JWT tokens
- Input validation and sanitization
- Private S3 bucket with CloudFront OAI
- CORS configuration for web clients