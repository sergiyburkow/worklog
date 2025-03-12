import { TaskType } from '../components/forms/TaskForm';

export enum TaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export interface Task {
  id: string;
  code: string;
  name: string;
  description: string;
  estimatedTime: string;
  projectId: string;
  status: TaskStatus;
  type: TaskType;
  complexity: number;
  tags?: string;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.NEW]: 'Нове',
  [TaskStatus.IN_PROGRESS]: 'В роботі',
  [TaskStatus.COMPLETED]: 'Завершено',
  [TaskStatus.ON_HOLD]: 'На паузі',
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.NEW]: 'blue',
  [TaskStatus.IN_PROGRESS]: 'green',
  [TaskStatus.COMPLETED]: 'gray',
  [TaskStatus.ON_HOLD]: 'yellow',
}; 