export interface ProjectUser {
  id: string;
  name: string;
  lastName?: string | null;
  callSign?: string | null;
  email?: string;
  role: string;
  isActive?: boolean;
}

// Для API відповідей з вкладеною структурою
export interface ProjectUserResponse {
  userId: string;
  role: string;
  user: ProjectUser;
} 