import { useState, useEffect, useCallback } from 'react';

import { apiService } from '../services/api';
import type { ApiError } from '../types';

interface UseAuthReturn {
  isLoggedIn: boolean;
  token: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiService.login(email, password);
      const { token: newToken } = response;

      setToken(newToken);
      setIsLoggedIn(true);
      localStorage.setItem('token', newToken);
    } catch (error) {
      throw error as ApiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await apiService.register(email, password);
    } catch (error) {
      throw error as ApiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken('');
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  }, []);

  return {
    isLoggedIn,
    token,
    loading,
    login,
    register,
    logout,
  };
};
