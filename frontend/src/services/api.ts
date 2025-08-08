import axios, { AxiosInstance, AxiosResponse } from 'axios';

import type {
  Todo,
  AuthResponse,
  CreateTodoRequest,
  UpdateTodoRequest,
  ApiError,
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        const apiError: ApiError = {
          message:
            error.response?.data?.message || 'An unexpected error occurred',
          status: error.response?.status,
        };

        // Handle 401 errors by clearing token
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.reload();
        }

        return Promise.reject(apiError);
      }
    );
  }

  // Auth methods
  async register(email: string, password: string): Promise<void> {
    await this.api.post('/users/register', { email, password });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      '/users/login',
      { email, password }
    );
    return response.data;
  }

  // Todo methods
  async getTodos(): Promise<Todo[]> {
    const response: AxiosResponse<Todo[]> = await this.api.get('/todos');
    return response.data;
  }

  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    const response: AxiosResponse<Todo> = await this.api.post('/todos', todo);
    return response.data;
  }

  async updateTodo(todo: UpdateTodoRequest): Promise<Todo> {
    const { id, ...updateData } = todo;
    const response: AxiosResponse<Todo> = await this.api.put(
      `/todos/${id}`,
      updateData
    );
    return response.data;
  }

  async deleteTodo(id: number): Promise<void> {
    await this.api.delete(`/todos/${id}`);
  }
}

export const apiService = new ApiService();
export default apiService;
