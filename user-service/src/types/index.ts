export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserResponse {
  uuid: string;
  email: string;
  created_at: Date;
}

export interface JWTPayload {
  uuid: string;
  email: string;
  iat?: number;
  exp?: number;
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
