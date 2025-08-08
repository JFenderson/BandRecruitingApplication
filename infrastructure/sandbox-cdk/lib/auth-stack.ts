import { Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
  UserPoolIdentityProviderGoogle,
  UserPoolIdentityProviderApple,
  UserPoolDomain,
  CfnUserPoolGroup,
  OAuthScope
} from 'aws-cdk-lib/aws-cognito';
import * as cognito from 'aws-cdk-lib/aws-cognito';


export class AuthStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // User Pool
    const userPool = new UserPool(this, 'UserPool', {
      userPoolName: 'BandRecruitingUserPool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true, mutable: false },
        givenName: { required: true, mutable: true },
        familyName: { required: true, mutable: true },
      },
      passwordPolicy: {
        minLength: 8,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,

    });

    // Hosted UI domain
    new UserPoolDomain(this, 'CognitoDomain', {
      userPool,
      cognitoDomain: {
        domainPrefix: 'bandrecruiting-app', // must be globally unique
      },
    });

    // Google IdP
    const googleProvider = new UserPoolIdentityProviderGoogle(this, 'Google', {
      userPool,
      clientId: 'GOOGLE_CLIENT_ID',
      clientSecret: 'GOOGLE_CLIENT_SECRET',
      scopes: ['openid', 'email', 'profile'],

    });

    // Apple IdP
    const appleProvider = new UserPoolIdentityProviderApple(this, 'Apple', {
      userPool,
      clientId: 'APPLE_CLIENT_ID',
      teamId: 'APPLE_TEAM_ID',
      keyId: 'APPLE_KEY_ID',
      privateKey: 'APPLE_PRIVATE_KEY', // use Secrets Manager in production
      scopes: ['name', 'email'],
    });

    // User Pool Client with refresh token support
    const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool,
      generateSecret: false,
      authFlows: {
        userSrp: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
        callbackUrls: ['http://localhost:4200/callback'], // adjust for your app
        logoutUrls: ['http://localhost:4200/logout'],
      },
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.COGNITO,
        UserPoolClientIdentityProvider.GOOGLE,
        UserPoolClientIdentityProvider.APPLE,
      ],
      refreshTokenValidity: Duration.days(30),
      accessTokenValidity: Duration.minutes(60),
      idTokenValidity: Duration.minutes(60),
    });

    // Groups
    new CfnUserPoolGroup(this, 'StudentGroup', {
      groupName: 'Student',
      userPoolId: userPool.userPoolId,
      description: 'Group for students',
    });

    new CfnUserPoolGroup(this, 'RecruiterGroup', {
      groupName: 'Recruiter',
      userPoolId: userPool.userPoolId,
      description: 'Group for recruiters',
    });

    // Outputs
    new CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });
  }
}
