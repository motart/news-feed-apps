import { Construct } from 'constructs';
import { 
  UserPool, 
  UserPoolClient, 
  VerificationEmailStyle, 
  Mfa, 
  StringAttribute,
  AccountRecovery,
  OAuthScope
} from 'aws-cdk-lib/aws-cognito';
import { RemovalPolicy, Duration } from 'aws-cdk-lib';

export class AuthConstruct extends Construct {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.userPool = new UserPool(this, 'NewsfeedUserPool', {
      userPoolName: 'newsfeed-user-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        preferredUsername: {
          required: true,
          mutable: true,
        },
        fullname: {
          required: false,
          mutable: true,
        },
      },
      customAttributes: {
        bio: new StringAttribute({ mutable: true }),
        profileImageUrl: new StringAttribute({ mutable: true }),
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailSubject: 'Welcome to Newsfeed! Verify your email',
        emailBody: 'Hello {username}, Welcome to Newsfeed! Your verification code is {####}',
        emailStyle: VerificationEmailStyle.CODE,
      },
      mfa: Mfa.OPTIONAL,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.userPoolClient = new UserPoolClient(this, 'NewsfeedUserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: 'newsfeed-client',
      generateSecret: false,
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
      },
      refreshTokenValidity: Duration.days(30),
      accessTokenValidity: Duration.minutes(60),
      idTokenValidity: Duration.minutes(60),
    });
  }
}