/**
 * Workspace API Client
 * Handles all workspace-related API calls
 */

import { get, post, patch, del } from '../base-api'
import type {
  Workspace,
  WorkspaceMember,
  WorkspaceStatistics,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  AddMemberDto,
  UpdateMemberRoleDto,
  WorkspaceListParams,
  WorkspaceListResponse,
} from '../../features/workspaces/types/workspace.types'

export const workspaceApi = {
  /**
   * Get all workspaces with pagination and filters
   */
  getAll: async (params?: WorkspaceListParams): Promise<WorkspaceListResponse> => {
    return get<WorkspaceListResponse>('/workspaces', { params })
  },

  /**
   * Get root workspaces (no parent)
   */
  getRoots: async (): Promise<Workspace[]> => {
    return get<Workspace[]>('/workspaces/roots')
  },

  /**
   * Get workspace by ID
   */
  getById: async (id: string): Promise<Workspace> => {
    return get<Workspace>(`/workspaces/${id}`)
  },

  /**
   * Create new workspace
   */
  create: async (data: CreateWorkspaceDto): Promise<Workspace> => {
    return post<Workspace>('/workspaces', data)
  },

  /**
   * Update workspace
   */
  update: async (id: string, data: UpdateWorkspaceDto): Promise<Workspace> => {
    return patch<Workspace>(`/workspaces/${id}`, data)
  },

  /**
   * Delete workspace (soft delete)
   */
  delete: async (id: string): Promise<Workspace> => {
    return del<Workspace>(`/workspaces/${id}`)
  },

  /**
   * Get workspace children
   */
  getChildren: async (id: string): Promise<Workspace[]> => {
    return get<Workspace[]>(`/workspaces/${id}/children`)
  },

  /**
   * Get workspace members
   */
  getMembers: async (id: string): Promise<WorkspaceMember[]> => {
    return get<WorkspaceMember[]>(`/workspaces/${id}/members`)
  },

  /**
   * Add member to workspace
   */
  addMember: async (id: string, data: AddMemberDto): Promise<WorkspaceMember> => {
    return post<WorkspaceMember>(`/workspaces/${id}/members`, data)
  },

  /**
   * Remove member from workspace
   */
  removeMember: async (id: string, userId: string): Promise<void> => {
    return del<void>(`/workspaces/${id}/members/${userId}`)
  },

  /**
   * Update member role
   */
  updateMemberRole: async (
    id: string,
    userId: string,
    data: UpdateMemberRoleDto
  ): Promise<{ count: number }> => {
    return patch<{ count: number }>(`/workspaces/${id}/members/${userId}/role`, data)
  },

  /**
   * Get workspace statistics
   */
  getStatistics: async (id: string): Promise<WorkspaceStatistics> => {
    return get<WorkspaceStatistics>(`/workspaces/${id}/statistics`)
  },
}
