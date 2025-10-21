import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
      userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID || '',
      userPoolClientId: process.env.EXPO_PUBLIC_USER_POOL_CLIENT_ID || '',
    },
  },
  API: {
    REST: {
      newsfeedApi: {
        endpoint: process.env.EXPO_PUBLIC_API_ENDPOINT || '',
        region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
      },
    },
  },
};

Amplify.configure(awsConfig);

export default awsConfig;