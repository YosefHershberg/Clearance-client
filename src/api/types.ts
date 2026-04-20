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

export type Project = {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  locality: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: { id: string; email: string; name: string };
};

export type ListProjectsResponse = {
  projects: Project[];
  nextCursor?: string;
};

export type ExtractionStatus = 'PENDING' | 'EXTRACTING' | 'COMPLETED' | 'FAILED';

export type DxfFile = {
  id: string;
  projectId: string;
  originalName: string;
  sha256: string;
  sizeBytes: number;
  extractionStatus: ExtractionStatus;
  extractionError: string | null;
  structuralHash: string | null;
  createdAt: string;
};

export type ListDxfFilesResponse = {
  dxfFiles: DxfFile[];
};
