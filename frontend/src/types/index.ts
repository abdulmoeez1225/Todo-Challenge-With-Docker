export interface Todo {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface UpdateTodoRequest extends Partial<CreateTodoRequest> {
  id: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export type TodoFilter = 'all' | 'pending' | 'in-progress' | 'completed';
