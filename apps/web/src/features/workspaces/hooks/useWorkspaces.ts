/**
 * React Query hooks for workspace data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceApi } from '../../../lib/api/workspace.api'
import type {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  AddMemberDto,
  UpdateMemberRoleDto,
  WorkspaceListParams,
} from '../types/workspace.types'

// Query keys
export const workspaceKeys = {
  all: ['workspaces'] as const,
  lists: () => [...workspaceKeys.all, 'list'] as const,
  list: (params?: WorkspaceListParams) => [...workspaceKeys.lists(), params] as const,
  roots: () => [...workspaceKeys.all, 'roots'] as const,
  details: () => [...workspaceKeys.all, 'detail'] as const,
  detail: (id: string) => [...workspaceKeys.details(), id] as const,
  children: (id: string) => [...workspaceKeys.detail(id), 'children'] as const,
  members: (id: string) => [...workspaceKeys.detail(id), 'members'] as const,
  statistics: (id: string) => [...workspaceKeys.detail(id), 'statistics'] as const,
}

/**
 * Get all workspaces with pagination
 */
export const useWorkspaces = (params?: WorkspaceListParams) => {
  return useQuery({
    queryKey: workspaceKeys.list(params),
    queryFn: () => workspaceApi.getAll(params),
  })
}

/**
 * Get root workspaces
 */
export const useRootWorkspaces = () => {
  return useQuery({
    queryKey: workspaceKeys.roots(),
    queryFn: () => workspaceApi.getRoots(),
  })
}

/**
 * Get workspace by ID
 */
export const useWorkspace = (id: string | undefined) => {
  return useQuery({
    queryKey: workspaceKeys.detail(id!),
    queryFn: () => workspaceApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Get workspace children
 */
export const useWorkspaceChildren = (id: string | undefined) => {
  return useQuery({
    queryKey: workspaceKeys.children(id!),
    queryFn: () => workspaceApi.getChildren(id!),
    enabled: !!id,
  })
}

/**
 * Get workspace members
 */
export const useWorkspaceMembers = (id: string | undefined) => {
  return useQuery({
    queryKey: workspaceKeys.members(id!),
    queryFn: () => workspaceApi.getMembers(id!),
    enabled: !!id,
  })
}

/**
 * Get workspace statistics
 */
export const useWorkspaceStatistics = (id: string | undefined) => {
  return useQuery({
    queryKey: workspaceKeys.statistics(id!),
    queryFn: () => workspaceApi.getStatistics(id!),
    enabled: !!id,
  })
}

/**
 * Create workspace mutation
 */
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateWorkspaceDto) => workspaceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workspaceKeys.roots() })
    },
  })
}

/**
 * Update workspace mutation
 */
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkspaceDto }) =>
      workspaceApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
    },
  })
}

/**
 * Delete workspace mutation
 */
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => workspaceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workspaceKeys.roots() })
    },
  })
}

/**
 * Add member mutation
 */
export const useAddMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddMemberDto }) =>
      workspaceApi.addMember(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(variables.id) })
      queryClient.invalidateQueries({ queryKey: workspaceKeys.statistics(variables.id) })
    },
  })
}

/**
 * Remove member mutation
 */
export const useRemoveMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      workspaceApi.removeMember(id, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(variables.id) })
      queryClient.invalidateQueries({ queryKey: workspaceKeys.statistics(variables.id) })
    },
  })
}

/**
 * Update member role mutation
 */
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userId, data }: { id: string; userId: string; data: UpdateMemberRoleDto }) =>
      workspaceApi.updateMemberRole(id, userId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(variables.id) })
    },
  })
}
