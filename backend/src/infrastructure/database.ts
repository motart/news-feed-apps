import { Construct } from 'constructs';
import { Table, AttributeType, BillingMode, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

export class DatabaseConstruct extends Construct {
  public readonly usersTable: Table;
  public readonly postsTable: Table;
  public readonly relationshipsTable: Table;
  public readonly likesTable: Table;
  public readonly commentsTable: Table;
  public readonly feedsTable: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.usersTable = new Table(this, 'UsersTable', {
      tableName: 'newsfeed-users',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'username-index',
      partitionKey: { name: 'username', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'email-index',
      partitionKey: { name: 'email', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.postsTable = new Table(this, 'PostsTable', {
      tableName: 'newsfeed-posts',
      partitionKey: { name: 'postId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.postsTable.addGlobalSecondaryIndex({
      indexName: 'user-posts-index',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.relationshipsTable = new Table(this, 'RelationshipsTable', {
      tableName: 'newsfeed-relationships',
      partitionKey: { name: 'followerId', type: AttributeType.STRING },
      sortKey: { name: 'followingId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.relationshipsTable.addGlobalSecondaryIndex({
      indexName: 'following-followers-index',
      partitionKey: { name: 'followingId', type: AttributeType.STRING },
      sortKey: { name: 'followerId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.likesTable = new Table(this, 'LikesTable', {
      tableName: 'newsfeed-likes',
      partitionKey: { name: 'postId', type: AttributeType.STRING },
      sortKey: { name: 'userId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.likesTable.addGlobalSecondaryIndex({
      indexName: 'user-likes-index',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.commentsTable = new Table(this, 'CommentsTable', {
      tableName: 'newsfeed-comments',
      partitionKey: { name: 'commentId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.commentsTable.addGlobalSecondaryIndex({
      indexName: 'post-comments-index',
      partitionKey: { name: 'postId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.feedsTable = new Table(this, 'FeedsTable', {
      tableName: 'newsfeed-feeds',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'postId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.feedsTable.addGlobalSecondaryIndex({
      indexName: 'user-feed-timeline-index',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}