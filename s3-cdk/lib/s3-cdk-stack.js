const { Stack, Duration } = require('aws-cdk-lib');
const cdk = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
// const sqs = require('aws-cdk-lib/aws-sqs');

class S3CdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    new s3.Bucket(this, 'MyCdkBucketForTest', {
      bucketName: 'my-cdk-bucket-for-test', // Specify the bucket name
      versioned: false, // Disable versioning
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Automatically remove the bucket when the stack is deleted
      autoDeleteObjects: true, // Automatically delete objects in the bucket when the bucket is removed
      cors: [
        {
          allowedOrigins: ['*'], // Allow all origins
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD,
          ], // Allow these methods
          allowedHeaders: ['*'], // Allow all headers
        },
    ],
    });
  }
}

module.exports = { S3CdkStack }
