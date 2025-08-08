import { useState, useEffect, useCallback } from 'react';

import { apiService } from '../services/api';
import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoFilter,
  ApiError,
} from '../types';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  filteredTodos: Todo[];
  filter: TodoFilter;
  searchTerm: string;
  setFilter: (filter: TodoFilter) => void;
  setSearchTerm: (term: string) => void;
  fetchTodos: () => Promise<void>;
  createTodo: (todo: CreateTodoRequest) => Promise<void>;
  updateTodo: (todo: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}

export const useTodos = (isLoggedIn: boolean): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTodos = useCallback(async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const fetchedTodos = await apiService.getTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      throw error as ApiError;
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const createTodo = useCallback(async (todoData: CreateTodoRequest) => {
    try {
      const newTodo = await apiService.createTodo(todoData);
      setTodos(prev => [newTodo, ...prev]);
    } catch (error) {
      throw error as ApiError;
    }
  }, []);

  const updateTodo = useCallback(async (todoData: UpdateTodoRequest) => {
    try {
      const updatedTodo = await apiService.updateTodo(todoData);
      setTodos(prev =>
        prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
    } catch (error) {
      throw error as ApiError;
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await apiService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      throw error as ApiError;
    }
  }, []);

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || todo.status === filter;
    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    if (isLoggedIn) {
      fetchTodos().catch(console.error);
    }
  }, [isLoggedIn, fetchTodos]);

  return {
    todos,
    loading,
    filteredTodos,
    filter,
    searchTerm,
    setFilter,
    setSearchTerm,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  };
};
