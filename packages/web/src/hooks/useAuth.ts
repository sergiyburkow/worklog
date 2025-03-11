import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'ENGINEER' | 'QA' | 'GUEST';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = () => {
  const context = useContext<AuthContextType>(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 