#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { S3CdkStack } = require('../lib/s3-cdk-stack');
const { ApiGatewayLambdaDynamoDBStack } = require('../lib/api-gateway-lambda-dynamodb-stack');


const app = new cdk.App();
new S3CdkStack(app, 'S3CdkStack');
new ApiGatewayLambdaDynamoDBStack(app, 'ApiGatewayLambdaDynamoDBStack');
