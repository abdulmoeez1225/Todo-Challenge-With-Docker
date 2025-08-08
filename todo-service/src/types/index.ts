export interface Todo {
  id: number;
  userUuid: string;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export interface CreateTodoRequest {
  title: string;
  description?: string;
  status: TodoStatus;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  status?: TodoStatus;
}

export interface TodoResponse {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  uuid: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  service: string;
  timestamp: string;
  uptime: number;
}
