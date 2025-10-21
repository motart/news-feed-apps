# Newsfeed - Social Media Platform

A complete social media platform built with AWS serverless architecture and modern frontend technologies.

## Project Structure

This repository contains three main projects:

### 📱 Backend (`/backend`)
AWS serverless backend infrastructure with:
- **AWS CDK** for Infrastructure as Code
- **Lambda Functions** for API endpoints
- **DynamoDB** for data storage
- **Cognito** for user authentication
- **S3 + CloudFront** for media storage
- **API Gateway** for REST API

[➤ Backend Documentation](./backend/README.md)

### 🌐 Frontend Web (`/frontend-web`)
React web application with:
- **React 19** with TypeScript
- **AWS Amplify** integration
- **Tailwind CSS** for styling
- **Infinite scroll** news feed
- **Responsive design**
- **Real-time authentication**

[➤ Frontend Web Documentation](./frontend-web/README.md)

### 📱 Frontend Mobile (`/frontend-mobile`)
React Native mobile application:
- **Cross-platform** iOS and Android
- **Native performance**
- **Camera integration**
- **Push notifications**
- **Offline support**

[➤ Frontend Mobile Documentation](./frontend-mobile/README.md) *(Coming Soon)*

## Features

- ✅ **User Authentication** - Sign up, sign in, email verification
- ✅ **Post Creation** - Share text posts with character limits
- ✅ **News Feed** - Infinite scroll through followed users' posts
- ✅ **Follow System** - Follow and unfollow other users
- ✅ **Real-time Updates** - Fresh content loading
- ✅ **Responsive Design** - Works on desktop and mobile web
- 🔄 **Mobile App** - Native iOS and Android experience *(In Development)*
- 🔄 **Media Posts** - Image and video sharing *(Planned)*
- 🔄 **Comments & Likes** - Post interactions *(Planned)*
- 🔄 **Push Notifications** - Real-time alerts *(Planned)*

## Quick Start

### Backend Setup
```bash
cd backend
npm install
npm run build
npm run deploy  # Deploy to AWS
```

### Frontend Web Setup
```bash
cd frontend-web
npm install
cp .env.example .env.local  # Configure AWS settings
npm start  # Development server
npm run build  # Production build
```

### Frontend Mobile Setup
```bash
cd frontend-mobile
# Coming soon - React Native setup
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web     │    │  React Native   │    │   Admin Panel   │
│   Frontend      │    │   Mobile App    │    │   (Future)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴───────────┐
                    │     API Gateway         │
                    │   (REST Endpoints)      │
                    └─────────────┬───────────┘
                                  │
                    ┌─────────────┴───────────┐
                    │   Lambda Functions      │
                    │   (Business Logic)      │
                    └─────────────┬───────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────┴────────┐    ┌──────────┴───────┐    ┌─────────────┴──────┐
│   DynamoDB     │    │     Cognito      │    │   S3 + CloudFront  │
│   (Database)   │    │ (Authentication) │    │   (Media Storage)   │
└────────────────┘    └──────────────────┘    └────────────────────┘
```

## Development Workflow

1. **Backend Development**
   - Modify infrastructure in `/backend/src/infrastructure/`
   - Add Lambda functions in `/backend/src/lambda/`
   - Write tests in `/backend/test/`
   - Deploy with `npm run deploy`

2. **Frontend Web Development**
   - Develop components in `/frontend-web/src/components/`
   - Update API integration in `/frontend-web/src/services/`
   - Test locally with `npm start`
   - Build for production with `npm run build`

3. **Frontend Mobile Development**
   - *Coming Soon* - React Native development workflow

## Environment Configuration

Each project requires specific environment variables:

- **Backend**: AWS credentials and region
- **Frontend Web**: AWS Cognito and API Gateway endpoints
- **Frontend Mobile**: Similar to web plus native configurations

See individual project READMEs for detailed setup instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes in the appropriate project folder
4. Add tests for new functionality
5. Ensure all projects build successfully
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [x] **Phase 1**: Backend infrastructure and API
- [x] **Phase 2**: Web frontend application
- [ ] **Phase 3**: Mobile application with React Native
- [ ] **Phase 4**: Advanced features (media, notifications, analytics)
- [ ] **Phase 5**: Admin dashboard and content moderation