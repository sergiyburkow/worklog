import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { User } from '../types/auth';

export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'WORKER' | 'GUEST';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 