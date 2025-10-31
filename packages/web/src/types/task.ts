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
  product?: string;
  quantity?: number;
  cost?: number;
  hasRecipe?: boolean;
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
    id: string;
    name: string;
    type: 'PRODUCT' | 'INTERMEDIATE' | 'GENERAL';
    status: TaskStatus;
    description?: string;
    code: string;
    estimatedTime?: string;
    complexity?: number;
    tags?: string;
  };
  user: {
    name: string;
  };
  completedAt: string | null;
  statusHistory: Array<{
    status: 'APPROVED' | 'NEEDS_FIXES' | 'ON_HOLD' | 'PENDING';
    createdAt: string;
  }>;
}

export interface TaskWithLogs {
  task: Task;
  logsCount: number;
  totalTimeSpent: number | null;
  quantity?: number;
  totalCost: number;
}

export interface TaskLog {
  id: string;
  task: {
    name: string;
    estimatedTime: number;
    type: TaskType;
  };
  user: {
    id?: string;
    name: string;
  };
  completedAt: string | null;
  registeredAt: string;
  timeSpent?: number;
  quantity?: number;
  product?: {
    id: string;
    code: string;
  };
  statusHistory?: Array<{
    status: 'APPROVED' | 'NEEDS_FIXES' | 'ON_HOLD';
    createdAt: string;
  }>;
}

export interface TaskLogFormData {
  productCode: string;
  taskId: string;
  registeredAt: string;
  userId?: string;
  timeSpent?: string;
  hours?: string;
  minutes?: string;
  quantity?: string;
} 