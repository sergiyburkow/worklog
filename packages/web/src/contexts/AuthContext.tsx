import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'WORKER' | 'GUEST';

interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  callSign?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Помилка при перевірці автентифікації:', error);
        localStorage.removeItem('accessToken');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Помилка при виході:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  if (isLoading) {
    return null; // або компонент завантаження
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 