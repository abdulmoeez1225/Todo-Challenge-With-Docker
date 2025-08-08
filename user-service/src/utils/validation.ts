import { CreateUserRequest, LoginRequest } from '../types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return Boolean(password && password.length >= 6);
};

export const validateCreateUserRequest = (data: CreateUserRequest): void => {
  if (!data.email || !validateEmail(data.email)) {
    throw new ValidationError('Invalid email format');
  }

  if (!data.password || !validatePassword(data.password)) {
    throw new ValidationError('Password must be at least 6 characters long');
  }
};

export const validateLoginRequest = (data: LoginRequest): void => {
  if (!data.email || !data.password) {
    throw new ValidationError('Email and password are required');
  }

  if (!validateEmail(data.email)) {
    throw new ValidationError('Invalid email format');
  }
};
