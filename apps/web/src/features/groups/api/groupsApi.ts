/**
 * Groups API Service
 * Handles all group-related API calls
 */

import { get, post, patch, del, handleApiError } from '../../../lib/base-api'
import type { Group, CreateGroupDto, UpdateGroupDto } from '../types/group.types'

// Re-export types for backwards compatibility
export type { Group, CreateGroupDto, UpdateGroupDto }

export interface GroupListParams {
  isActive?: boolean
}

export interface AddPermissionDto {
  resource: string
  action: string
  conditions?: any
}

class GroupsApiService {
  private readonly baseUrl = '/groups'

  /**
   * Get all groups with optional filters
   */
  async getGroups(params?: GroupListParams): Promise<Group[]> {
    try {
      return await get<Group[]>(this.baseUrl, { params })
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get group by ID
   */
  async getGroupById(id: string): Promise<Group> {
    try {
      return await get<Group>(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create new group (Admin only)
   */
  async createGroup(data: CreateGroupDto): Promise<Group> {
    try {
      return await post<Group>(this.baseUrl, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update group (Admin only)
   */
  async updateGroup(id: string, data: UpdateGroupDto): Promise<Group> {
    try {
      return await patch<Group>(`${this.baseUrl}/${id}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete group (Admin only)
   */
  async deleteGroup(id: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Add permission to group (Admin only)
   */
  async addPermission(groupId: string, permission: AddPermissionDto): Promise<Group> {
    try {
      return await post<Group>(`${this.baseUrl}/${groupId}/permissions`, permission)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Remove permission from group (Admin only)
   */
  async removePermission(permissionId: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/permissions/${permissionId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

// Export singleton instance
export const groupsApi = new GroupsApiService()
