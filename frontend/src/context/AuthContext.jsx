import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
      return;
    }

    setInitializing(false);
  }, [fetchUser, token]);

  const register = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(credentials);
      const { token: authToken, user: authUser } = response.data;
      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('token', authToken);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      const { token: authToken, user: authUser } = response.data;
      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('token', authToken);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
  }, []);

  const value = {
    user,
    token,
    loading,
    initializing,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
