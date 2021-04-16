import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
    signatureVersion: 'v4'
});

const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION;
const bucketName = process.env.TODOS_S3_BUCKET;

const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  try {
    const userId = event.requestContext.authorizer.principalId;
    const signedUrl = await getUploadUrl(userId, todoId);
    logger.info(`Processed request for ${userId} to generate signed url`, signedUrl);
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl: signedUrl
      })
    }
  } catch (e) {
    logger.info('Processed request but failed', e);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: e
      })
    }
  }
}

async function getUploadUrl(userId: string, todoId: string): Promise<string> {
    return await s3.getSignedUrlPromise('putObject', {
        Bucket: bucketName,
        Key: `${userId}/${todoId}.png`,
        Expires: parseInt(signedUrlExpiration),
    });
};