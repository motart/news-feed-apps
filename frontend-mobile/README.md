# Newsfeed Mobile App

React Native mobile application for the social media newsfeed platform.

## Features

- **Cross-platform** - iOS and Android support with single codebase
- **User Authentication** - Sign up, sign in with AWS Cognito
- **News Feed** - Infinite scroll with pull-to-refresh
- **Post Creation** - Text posts with camera/photo library integration
- **User Profiles** - Profile management and settings
- **Native Performance** - Optimized for mobile devices
- **Responsive Design** - Adapts to different screen sizes
- **Offline Storage** - Local caching with AsyncStorage

## Tech Stack

- **React Native** with TypeScript
- **Expo** for development and deployment
- **AWS Amplify** for backend integration
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **Expo Camera & Image Picker** for media capture
- **React Native Safe Area Context** for proper layouts

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your AWS configuration:
- `EXPO_PUBLIC_AWS_REGION` - Your AWS region
- `EXPO_PUBLIC_USER_POOL_ID` - Cognito User Pool ID
- `EXPO_PUBLIC_USER_POOL_CLIENT_ID` - Cognito User Pool Client ID
- `EXPO_PUBLIC_API_ENDPOINT` - API Gateway endpoint URL

3. Start the development server:
```bash
npm start
```

4. Run on device/simulator:
```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run build` - Build for production

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── navigation/         # Navigation setup
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   └── main/          # Main app screens
├── services/          # API and external services
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── config/            # Configuration files
```

## Features Overview

### Authentication
- Native login and signup forms
- JWT token-based authentication
- Automatic session management
- Secure credential storage

### News Feed
- Infinite scroll with smooth performance
- Pull-to-refresh functionality
- Real-time post updates
- Optimized image loading

### Post Creation
- Rich text input with character limits
- Camera integration for photos
- Photo library access
- Image preview and editing

### User Profile
- Profile information display
- Settings and preferences
- Account management
- Sign out functionality

### Navigation
- Tab-based navigation for main screens
- Stack navigation for detailed views
- Modal presentations for creation flows
- Native-feeling transitions

## Development Workflow

1. **Start Development Server**
   ```bash
   npm start
   ```

2. **Run on Device**
   - Install Expo Go app on your device
   - Scan QR code from terminal
   - Or use iOS/Android simulators

3. **Live Reloading**
   - Changes automatically refresh the app
   - Fast Refresh preserves component state
   - TypeScript errors shown in real-time

4. **Debugging**
   - Use Expo Developer Tools
   - Chrome DevTools for debugging
   - React DevTools for component inspection

## Environment Configuration

Create `.env.local` with your AWS backend configuration:

```env
EXPO_PUBLIC_AWS_REGION=us-east-1
EXPO_PUBLIC_USER_POOL_ID=us-east-1_xxxxxxxxx
EXPO_PUBLIC_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_API_ENDPOINT=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
```

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### Expo Application Services (EAS)
```bash
eas build --platform all
```

## Device Support

- **iOS**: 11.0 and higher
- **Android**: API level 21 (Android 5.0) and higher
- **Web**: Modern browsers (development only)

## Permissions

The app requests the following permissions:
- **Camera**: For taking photos for posts
- **Photo Library**: For selecting existing photos
- **Network**: For API communication

## Performance Optimizations

- Image caching and optimization
- Lazy loading for large lists
- Background task management
- Memory usage optimization
- Bundle size optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.