import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../logic/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  try {
    const userId = event.requestContext.authorizer.principalId;
    await deleteTodo(userId, todoId);
    logger.info(`Processed request for ${userId} and deleted ${todoId}`);
    return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: ''
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
