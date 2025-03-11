export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'WORKER' | 'GUEST';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  role: UserRole;
  phone?: string;
  callSign?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 