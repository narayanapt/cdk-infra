const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  const tableName = process.env.TABLE_NAME;
  const body = JSON.parse(event.body);
  const id = uuidv4(); // Generate a unique ID
  const inputText = body.input_text;
  const s3FilePath = body.s3_file_path;

  const params = {
    TableName: tableName,
    Item: {
      id: id,
      input_text: inputText,
      s3_file_path: s3FilePath,
    },
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data saved successfully', id: id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to save data', error: error.message }),
    };
  }
};
