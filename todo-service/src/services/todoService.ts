import { prisma } from '../db';
import type {
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoResponse,
  JWTPayload,
} from '../types';
import {
  validateCreateTodoRequest,
  validateUpdateTodoRequest,
  validateTodoId,
  ValidationError,
} from '../utils/validation';

export class TodoService {
  async createTodo(
    todoData: CreateTodoRequest,
    user: JWTPayload
  ): Promise<TodoResponse> {
    validateCreateTodoRequest(todoData);

    const todo = await prisma.todo.create({
      data: {
        userUuid: parseInt(user.uuid, 10),
        title: todoData.title.trim(),
        description: todoData.description?.trim() || '',
        status: todoData.status,
      },
    });

    return this.mapTodoToResponse(todo);
  }

  async getTodosByUser(user: JWTPayload): Promise<TodoResponse[]> {
    const todos = await prisma.todo.findMany({
      where: { userUuid: parseInt(user.uuid, 10) },
      orderBy: { createdAt: 'desc' },
    });

    return todos.map(this.mapTodoToResponse);
  }

  async getTodoById(id: number, user: JWTPayload): Promise<TodoResponse> {
    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userUuid: parseInt(user.uuid, 10),
      },
    });

    if (!todo) {
      throw new ValidationError('Todo not found or access denied');
    }

    return this.mapTodoToResponse(todo);
  }

  async updateTodo(
    id: number,
    updateData: UpdateTodoRequest,
    user: JWTPayload
  ): Promise<TodoResponse> {
    validateUpdateTodoRequest(updateData);

    // First check if todo exists and belongs to user
    await this.getTodoById(id, user);

    // Prepare update data
    const dataToUpdate: any = {};
    if (updateData.title !== undefined) {
      dataToUpdate.title = updateData.title.trim();
    }
    if (updateData.description !== undefined) {
      dataToUpdate.description = updateData.description.trim();
    }
    if (updateData.status !== undefined) {
      dataToUpdate.status = updateData.status;
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: dataToUpdate,
    });

    return this.mapTodoToResponse(updatedTodo);
  }

  async deleteTodo(id: number, user: JWTPayload): Promise<void> {
    // First check if todo exists and belongs to user
    await this.getTodoById(id, user);

    await prisma.todo.delete({
      where: { id },
    });
  }

  private mapTodoToResponse(todo: any): TodoResponse {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    };
  }
}
