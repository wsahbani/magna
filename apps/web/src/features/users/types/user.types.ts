export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  position?: string;
  department?: {
    id: string;
    name: string;
  };
  departmentId?: string;
  group?: {
    id: string;
    name: string;
    code: string;
    color?: string;
  };
  groupId?: string;
  isActive: boolean;
  isAdmin: boolean;
  emailVerified: boolean;
  provider?: string;
  orangeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  position?: string;
  departmentId?: string;
  groupId?: string;
  password?: string;
  isActive?: boolean;
  isAdmin?: boolean;
  emailVerified?: boolean;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  position?: string;
  departmentId?: string;
  groupId?: string;
  isActive?: boolean;
  isAdmin?: boolean;
  emailVerified?: boolean;
}

export interface AssignGroupDto {
  userId: string;
  groupId: string;
}
