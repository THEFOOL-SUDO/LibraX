import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/auth.api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    try {
      const savedToken = localStorage.getItem('libra_token');
      if (savedToken) {
        setToken(savedToken);
        const userData = await authApi.getMe();
        if (userData?.id) {
          setUser(userData);
        } else {
          localStorage.removeItem('libra_token');
          setToken(null);
        }
      }
    } catch (error) {
      localStorage.removeItem('libra_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password, role) => {
    try {
      const response = await authApi.login({ email, password, role });
      if (!response?.token || !response?.user) {
        throw new Error('Unexpected login response');
      }
      localStorage.setItem('libra_token', response.token);
      setToken(response.token);
      setUser(response.user);
      
      // Redirect based on role
      if (response.user.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
      
      return response.user.role;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await authApi.register(data);
      if (!response?.token || !response?.user) {
        throw new Error('Unexpected registration response');
      }
      localStorage.setItem('libra_token', response.token);
      setToken(response.token);
      setUser(response.user);
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('libra_token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    login,
    logout,
    register,
    loading,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

