export interface Group {
  id: string;
  name: string;
  code: string;
  description?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    permissions: number;
  };
}

export interface CreateGroupDto {
  name: string;
  code: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface UpdateGroupDto {
  name?: string;
  code?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface GroupPermission {
  id: string;
  groupId: string;
  resource: string;
  action: string;
  conditions?: any;
  createdAt: string;
}
