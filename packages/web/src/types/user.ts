export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'WORKER';

export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  callSign?: string;
  role: UserRole;
} 