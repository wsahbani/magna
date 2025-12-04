/**
 * Users API Service
 * Handles all user-related API calls
 */

import { get, post, patch, del, handleApiError } from '../../../lib/base-api'
import type { User, CreateUserDto, UpdateUserDto } from '../types/user.types'

// Re-export types for backwards compatibility
export type { User, CreateUserDto, UpdateUserDto }

export interface UserListParams {
  isActive?: boolean
  groupId?: string
  departmentId?: string
  search?: string
}

class UsersApiService {
  private readonly baseUrl = '/users'

  /**
   * Get all users with optional filters
   */
  async getUsers(params?: UserListParams): Promise<User[]> {
    try {
      return await get<User[]>(this.baseUrl, { params })
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      return await get<User>(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create new user (Admin only)
   */
  async createUser(data: CreateUserDto): Promise<User> {
    try {
      return await post<User>(this.baseUrl, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update user (Admin only)
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    try {
      return await patch<User>(`${this.baseUrl}/${id}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Assign user to group (Admin only)
   */
  async assignToGroup(userId: string, groupId: string): Promise<User> {
    try {
      return await post<User>(`${this.baseUrl}/${userId}/assign-group/${groupId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Remove user from group (Admin only)
   */
  async removeFromGroup(userId: string): Promise<User> {
    try {
      return await post<User>(`${this.baseUrl}/${userId}/remove-group`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

// Export singleton instance
export const usersApi = new UsersApiService()
