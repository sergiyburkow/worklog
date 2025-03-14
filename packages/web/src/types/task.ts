export enum TaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export enum TaskType {
  PRODUCT = 'PRODUCT',
  GENERAL = 'GENERAL',
  INTERMEDIATE = 'INTERMEDIATE'
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  code: string;
  estimatedTime?: string;
  complexity?: number;
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

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  [TaskType.PRODUCT]: 'Продукт',
  [TaskType.GENERAL]: 'Загальна',
  [TaskType.INTERMEDIATE]: 'Проміжна'
};

export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  [TaskType.PRODUCT]: 'blue',
  [TaskType.GENERAL]: 'orange',
  [TaskType.INTERMEDIATE]: 'cyan'
};

export interface RegisteredTask {
  id: string;
  name: string;
  type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
  assignee?: {
    name: string;
  };
  completionDate: string;
  duration: number;
  quantity?: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_COMPLETED';
  projectId: string;
  registeredAt: string;
  timeSpent?: number;
  product?: {
    id: string;
    code: string;
  };
  task: {
    type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
  };
} 