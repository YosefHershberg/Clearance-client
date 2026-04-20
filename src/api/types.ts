export type Role = 'ADMIN' | 'USER';

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
};

export type AdminStats = {
  userCount: number;
  projectCount: number;
  analysisCount: number;
};

export type ListUsersResponse = {
  users: User[];
  nextCursor?: string;
};
