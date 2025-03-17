import { RegisteredTask } from './task';

export interface Product {
  id: string;
  code: string;
  createdAt: string;
  projectId: string;
  taskLogs: RegisteredTask[];
}

export interface ProductWithProgress extends Product {
  progress: number;
} 