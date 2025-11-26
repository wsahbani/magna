/**
 * Workspace Type Definitions
 */

export enum WorkspaceType {
  GROUPE = 'GROUPE',
  ENTITY = 'ENTITY',
  DIRECTION = 'DIRECTION',
  DEPARTMENT = 'DEPARTMENT',
  TEAM = 'TEAM',
}

export enum WorkspaceRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  REVIEWER = 'REVIEWER',
  VIEWER = 'VIEWER',
}

export interface Workspace {
  id: string
  name: string
  description?: string
  code: string
  type: WorkspaceType
  isActive: boolean
  parentId?: string
  createdAt: string
  updatedAt: string
  parent?: Workspace
  children?: Workspace[]
  _count?: {
    children: number
    departments: number
    processes: number
    workspaceMembers: number
  }
}

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: WorkspaceRole
  joinedAt: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    displayName?: string
    avatarUrl?: string
    position?: string
    isActive: boolean
  }
}

export interface WorkspaceStatistics {
  totalProcesses: number
  publishedProcesses: number
  totalDepartments: number
  totalMembers: number
}

export interface CreateWorkspaceDto {
  name: string
  description?: string
  code: string
  type: WorkspaceType
  isActive?: boolean
  parentId?: string
}

export interface UpdateWorkspaceDto {
  name?: string
  description?: string
  code?: string
  type?: WorkspaceType
  isActive?: boolean
  parentId?: string
}

export interface AddMemberDto {
  userId: string
  role: WorkspaceRole
}

export interface UpdateMemberRoleDto {
  role: WorkspaceRole
}

export interface WorkspaceListParams {
  page?: number
  limit?: number
  search?: string
  type?: WorkspaceType
  isActive?: boolean
}

export interface WorkspaceListResponse {
  data: Workspace[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
