import { api } from '../lib/api';
import type { LoginCredentials, LoginResponse, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Зберігаємо токен
    localStorage.setItem('accessToken', data.access_token);
    
    // Створюємо об'єкт користувача з усіма необхідними полями
    const user: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role
    };
    
    // Зберігаємо інформацію про користувача
    localStorage.setItem('user', JSON.stringify(user));
    
    return data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
}; 