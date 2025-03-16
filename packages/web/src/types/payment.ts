export interface Payment {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  user: {
    id: string;
    name: string;
    lastName: string | null;
    callSign: string | null;
  };
  createdBy: {
    id: string;
    name: string;
    lastName: string | null;
    callSign: string | null;
  };
} 