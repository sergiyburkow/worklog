export interface Project {
  id: string;
  name: string;
  clientId: string;
  startDate: string;
  deadline: string;
  actualEndDate?: string;
  status: ProjectStatus;
  quantity?: number;
  client: {
    id: string;
    name: string;
  };
  users: ProjectUserResponse[];
}

export type ProjectStatus = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'CANCELLED';

import { ProjectUserResponse } from './project-user'; 