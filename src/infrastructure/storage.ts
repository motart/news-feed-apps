import { Construct } from 'constructs';
import { Bucket, BucketAccessControl, BlockPublicAccess, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Distribution, OriginAccessIdentity, AllowedMethods, CachedMethods } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { RemovalPolicy } from 'aws-cdk-lib';

export class StorageConstruct extends Construct {
  public readonly mediaBucket: Bucket;
  public readonly cloudFrontDistribution: Distribution;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.mediaBucket = new Bucket(this, 'NewsfeedMediaBucket', {
      bucketName: 'newsfeed-media-bucket',
      accessControl: BucketAccessControl.PRIVATE,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST, HttpMethods.DELETE],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
    });

    const originAccessIdentity = new OriginAccessIdentity(this, 'OAI', {
      comment: 'OAI for Newsfeed media bucket',
    });

    this.mediaBucket.grantRead(originAccessIdentity);

    this.cloudFrontDistribution = new Distribution(this, 'NewsfeedCDN', {
      defaultBehavior: {
        origin: new S3Origin(this.mediaBucket, {
          originAccessIdentity,
        }),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: CachedMethods.CACHE_GET_HEAD,
      },
      comment: 'Newsfeed Media CDN',
    });
  }
}