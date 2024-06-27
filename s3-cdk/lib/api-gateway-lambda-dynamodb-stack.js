const { Stack } = require('aws-cdk-lib');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const path = require('path');


class ApiGatewayLambdaDynamoDBStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Define a DynamoDB table
    const table = new dynamodb.Table(this, 'FileTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    // Define a Lambda function
    const lambdaFunction = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/function.zip')),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Grant DynamoDB write permissions to the Lambda function
    table.grantWriteData(lambdaFunction);

    // Define an API Gateway REST API
    const api = new apigateway.RestApi(this, 'FileApi', {
      restApiName: 'File Service',
      description: 'This service handles file metadata.',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS, // this is also the default
      },
    });

    // Define a resource and method for the API
    const files = api.root.addResource('files');
    const postIntegration = new apigateway.LambdaIntegration(lambdaFunction);
    files.addMethod('POST', postIntegration);
  }
}

module.exports = { ApiGatewayLambdaDynamoDBStack };
