import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from '../models/TodoItem';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { UpdateTodoRequest } from 'src/requests/UpdateTodoRequest';

const XAWS = AWSXRay.captureAWS(AWS);

export class TodoAccess {
    
    constructor(
        private readonly docClient: DocumentClient = createDynamoDbClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODOS_INDEX
    ) {}

    async getTodos(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId 
            }
        }).promise();
    
        const todoItems = result.Items as TodoItem[];
        return todoItems ;
    };

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise();

        return todoItem;
    };

    async updateTodo(userId: string, todoId: string, todoItem: UpdateTodoRequest): Promise<any> {
        const todo = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId,
            },
            UpdateExpression: 'SET #N = :todoName, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':todoName': todoItem.name,
                ':dueDate': todoItem.dueDate,
                ':done': todoItem.done,
            },
            ExpressionAttributeNames: {
                '#N': 'name',
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();

        return todo.Attributes;
    }
};

function createDynamoDbClient() {
    return new XAWS.DynamoDB.DocumentClient();
};