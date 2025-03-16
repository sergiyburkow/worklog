import { RegisteredTask } from './task';

export interface Product {
  id: number;
  code: string;
  createdAt: string;
  projectId: number;
  registeredTasks: RegisteredTask[];
}

export interface ProductWithProgress extends Product {
  progress: number;
} 