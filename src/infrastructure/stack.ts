import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DatabaseConstruct } from './database';
import { AuthConstruct } from './auth';
import { StorageConstruct } from './storage';
import { ApiConstruct } from './api';

export class NewsfeedStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new DatabaseConstruct(this, 'Database');
    const auth = new AuthConstruct(this, 'Auth');
    new StorageConstruct(this, 'Storage');
    
    new ApiConstruct(this, 'Api', {
      userPool: auth.userPool,
      usersTable: database.usersTable,
      postsTable: database.postsTable,
      relationshipsTable: database.relationshipsTable,
      likesTable: database.likesTable,
      commentsTable: database.commentsTable,
      feedsTable: database.feedsTable,
    });
  }
}