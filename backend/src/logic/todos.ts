import { TodoItem } from 'src/models/TodoItem';
import { CreateTodoRequest } from 'src/requests/CreateTodoRequest';
import { TodoAccess } from '../dataLayer/todoAccess'
import { v4 as uuidv4 } from 'uuid';

export async function getTodos(userId: string) {
    const todoAccess = new TodoAccess();
    return await todoAccess.getTodos(userId);
}

export async function createTodo(userId: string, newTodo: CreateTodoRequest): Promise<TodoItem> {
    const todoAccess = new TodoAccess();
    const newItem = {
        userId: userId,
        todoId: uuidv4(),
        createdAt: new Date().toISOString(),
        done: false,
        ...newTodo
    } as TodoItem;
    return await todoAccess.createTodo(newItem);
}