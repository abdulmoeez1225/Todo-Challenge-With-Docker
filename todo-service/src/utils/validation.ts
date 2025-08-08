import type {
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoStatus,
} from '../types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const VALID_STATUSES: TodoStatus[] = ['pending', 'in-progress', 'completed'];

export const validateTodoStatus = (status: string): status is TodoStatus => {
  return VALID_STATUSES.includes(status as TodoStatus);
};

export const validateCreateTodoRequest = (data: CreateTodoRequest): void => {
  if (!data.title || data.title.trim().length === 0) {
    throw new ValidationError('Title is required and cannot be empty');
  }

  if (data.title.length > 255) {
    throw new ValidationError('Title cannot exceed 255 characters');
  }

  if (!data.status || !validateTodoStatus(data.status)) {
    throw new ValidationError(
      `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }

  if (data.description && data.description.length > 1000) {
    throw new ValidationError('Description cannot exceed 1000 characters');
  }
};

export const validateUpdateTodoRequest = (data: UpdateTodoRequest): void => {
  if (data.title !== undefined) {
    if (!data.title || data.title.trim().length === 0) {
      throw new ValidationError('Title cannot be empty');
    }
    if (data.title.length > 255) {
      throw new ValidationError('Title cannot exceed 255 characters');
    }
  }

  if (data.status !== undefined && !validateTodoStatus(data.status)) {
    throw new ValidationError(
      `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }

  if (data.description !== undefined && data.description.length > 1000) {
    throw new ValidationError('Description cannot exceed 1000 characters');
  }
};

export const validateTodoId = (id: string): number => {
  const numId = parseInt(id, 10);
  if (isNaN(numId) || numId <= 0) {
    throw new ValidationError('Invalid todo ID');
  }
  return numId;
};
