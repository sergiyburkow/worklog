export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'ENGINEER' | 'QA' | 'GUEST';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
} 