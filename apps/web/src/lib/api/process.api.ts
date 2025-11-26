/**
 * Process API Service
 * Handles all process-related API calls
 */

import { get, post, patch, del, handleApiError } from '../base-api'
import type {
  Process,
  CreateProcessDto,
  UpdateProcessDto,
  UpdateProcessStatusDto,
  ProcessListParams,
  ProcessListResponse,
} from '../../features/processes/types/process.types'

// Re-export types for backwards compatibility
export type {
  Process,
  CreateProcessDto,
  UpdateProcessDto,
  UpdateProcessStatusDto,
  ProcessListParams,
  ProcessListResponse,
}

class ProcessApiService {
  private readonly baseUrl = '/processes'

  /**
   * Get all processes with pagination and filters
   */
  async getProcesses(params?: ProcessListParams): Promise<ProcessListResponse> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value))
          }
        })
      }

      const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      return await get<ProcessListResponse>(url)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get process by ID
   */
  async getProcessById(id: string): Promise<Process> {
    try {
      return await get<Process>(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get root processes (top-level processes)
   */
  async getRootProcesses(): Promise<Process[]> {
    try {
      return await get<Process[]>(`${this.baseUrl}/roots`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get process hierarchy (children)
   */
  async getProcessHierarchy(id: string): Promise<Process[]> {
    try {
      return await get<Process[]>(`${this.baseUrl}/${id}/hierarchy`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create new process
   */
  async createProcess(data: CreateProcessDto): Promise<Process> {
    try {
      return await post<Process>(this.baseUrl, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update process
   */
  async updateProcess(id: string, data: UpdateProcessDto): Promise<Process> {
    try {
      return await patch<Process>(`${this.baseUrl}/${id}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update process status
   */
  async updateProcessStatus(id: string, data: UpdateProcessStatusDto): Promise<Process> {
    try {
      return await patch<Process>(`${this.baseUrl}/${id}/status`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete process
   */
  async deleteProcess(id: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

// Export singleton instance
export const processApi = new ProcessApiService()
