import { App, Environment, Stack, StackProps } from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { CognitoStack } from '../lib/cognito-stack';
import { S3CloudFrontStack } from '../lib/s3-cloudfront-stack';
import { RdsStack } from '../lib/rds-stack';
import { EcsStack } from '../lib/ecs-stack';
import { Construct } from 'constructs';


export class SandboxCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

const app = new App();

const env: Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

const vpcStack = new VpcStack(app, 'VpcStack', { env });
new CognitoStack(app, 'CognitoStack', { env });
new S3CloudFrontStack(app, 'S3CloudFrontStack', { env });
new RdsStack(app, 'RdsStack', { env, vpc: vpcStack.vpc });
new EcsStack(app, 'EcsStack', { env, vpc: vpcStack.vpc });
  }
}