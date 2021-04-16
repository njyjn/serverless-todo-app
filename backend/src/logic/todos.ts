import { TodoItem } from 'src/models/TodoItem';
import { CreateTodoRequest } from 'src/requests/CreateTodoRequest';
import { TodoAccess } from '../dataLayer/todoAccess'
import { v4 as uuidv4 } from 'uuid';
import { UpdateTodoRequest } from 'src/requests/UpdateTodoRequest';

const todoAccess = new TodoAccess();
const bucketName = process.env.TODOS_S3_BUCKET;
const attachmentBaseUrl = `https://${bucketName}.s3.amazonaws.com`

export async function getTodos(userId: string) {
    return await todoAccess.getTodos(userId);
}

export async function createTodo(userId: string, newTodo: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuidv4();
    const newItem = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: `${attachmentBaseUrl}/${userId}/${todoId}.png`,
        ...newTodo
    } as TodoItem;
    return await todoAccess.createTodo(newItem);
}

export async function updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest): Promise<TodoItem> {
    return await todoAccess.updateTodo(userId, todoId, updatedTodo) as TodoItem;
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
    await todoAccess.deleteTodo(userId, todoId);
}