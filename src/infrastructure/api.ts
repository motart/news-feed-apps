import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration, Cors, AuthorizationType, CognitoUserPoolsAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Duration } from 'aws-cdk-lib';

interface ApiConstructProps {
  userPool: UserPool;
  usersTable: Table;
  postsTable: Table;
  relationshipsTable: Table;
  likesTable: Table;
  commentsTable: Table;
  feedsTable: Table;
}

export class ApiConstruct extends Construct {
  public readonly api: RestApi;

  constructor(scope: Construct, id: string, props: ApiConstructProps) {
    super(scope, id);

    this.api = new RestApi(this, 'NewsfeedApi', {
      restApiName: 'Newsfeed API',
      description: 'Social media newsfeed API',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    const authorizer = new CognitoUserPoolsAuthorizer(this, 'NewsfeedAuthorizer', {
      cognitoUserPools: [props.userPool],
      identitySource: 'method.request.header.Authorization',
    });

    const lambdaProps = {
      runtime: Runtime.NODEJS_18_X,
      timeout: Duration.seconds(30),
      environment: {
        USERS_TABLE: props.usersTable.tableName,
        POSTS_TABLE: props.postsTable.tableName,
        RELATIONSHIPS_TABLE: props.relationshipsTable.tableName,
        LIKES_TABLE: props.likesTable.tableName,
        COMMENTS_TABLE: props.commentsTable.tableName,
        FEEDS_TABLE: props.feedsTable.tableName,
      },
    };

    const createUserFunction = new Function(this, 'CreateUserFunction', {
      ...lambdaProps,
      functionName: 'newsfeed-create-user',
      code: Code.fromAsset('dist/lambda/users'),
      handler: 'createUser.handler',
    });

    const getUserFunction = new Function(this, 'GetUserFunction', {
      ...lambdaProps,
      functionName: 'newsfeed-get-user',
      code: Code.fromAsset('dist/lambda/users'),
      handler: 'getUser.handler',
    });

    const createPostFunction = new Function(this, 'CreatePostFunction', {
      ...lambdaProps,
      functionName: 'newsfeed-create-post',
      code: Code.fromAsset('dist/lambda/posts'),
      handler: 'createPost.handler',
    });

    const getPostsFunction = new Function(this, 'GetPostsFunction', {
      ...lambdaProps,
      functionName: 'newsfeed-get-posts',
      code: Code.fromAsset('dist/lambda/posts'),
      handler: 'getPosts.handler',
    });

    const followUserFunction = new Function(this, 'FollowUserFunction', {
      ...lambdaProps,
      functionName: 'newsfeed-follow-user',
      code: Code.fromAsset('dist/lambda/relationships'),
      handler: 'followUser.handler',
    });

    const unfollowUserFunction = new Function(this, 'UnfollowUserFunction', {
      ...lambdaProps,
      functionName: 'newsfeed-unfollow-user',
      code: Code.fromAsset('dist/lambda/relationships'),
      handler: 'unfollowUser.handler',
    });

    const getFeedFunction = new Function(this, 'GetFeedFunction', {
      ...lambdaProps,
      functionName: 'newsfeed-get-feed',
      code: Code.fromAsset('dist/lambda/feed'),
      handler: 'getFeed.handler',
    });

    props.usersTable.grantReadWriteData(createUserFunction);
    props.usersTable.grantReadData(getUserFunction);
    props.usersTable.grantReadData(getFeedFunction);
    
    props.postsTable.grantReadWriteData(createPostFunction);
    props.postsTable.grantReadData(getPostsFunction);
    props.postsTable.grantReadData(getFeedFunction);
    
    props.relationshipsTable.grantReadWriteData(followUserFunction);
    props.relationshipsTable.grantReadWriteData(unfollowUserFunction);
    
    props.feedsTable.grantReadData(getFeedFunction);

    const users = this.api.root.addResource('users');
    users.addMethod('POST', new LambdaIntegration(createUserFunction));
    
    const user = users.addResource('{userId}');
    user.addMethod('GET', new LambdaIntegration(getUserFunction));
    
    const userPosts = user.addResource('posts');
    userPosts.addMethod('GET', new LambdaIntegration(getPostsFunction));
    
    const follow = user.addResource('follow');
    follow.addMethod('POST', new LambdaIntegration(followUserFunction), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer,
    });
    follow.addMethod('DELETE', new LambdaIntegration(unfollowUserFunction), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer,
    });

    const posts = this.api.root.addResource('posts');
    posts.addMethod('POST', new LambdaIntegration(createPostFunction), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer,
    });

    const feed = this.api.root.addResource('feed');
    feed.addMethod('GET', new LambdaIntegration(getFeedFunction), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer,
    });
  }
}