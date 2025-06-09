import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

interface EcsStackProps extends StackProps {
  vpc: Vpc;
}

export class EcsStack extends Stack {
  constructor(scope: Construct, id: string, props: EcsStackProps) {
    super(scope, id, props);

    const cluster = new Cluster(this, 'AppCluster', {
      vpc: props.vpc,
    });

    new ApplicationLoadBalancedFargateService(this, 'FargateService', {
      cluster,
      cpu: 256,
      desiredCount: 1,
      memoryLimitMiB: 512,
      taskImageOptions: {
        image: require('aws-cdk-lib/aws-ecs').ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
    });
  }
}
