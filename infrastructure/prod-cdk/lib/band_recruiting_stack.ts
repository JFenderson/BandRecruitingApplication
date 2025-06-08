import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class BandRecruitingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'FrontendHostingBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
    });
  }
}
