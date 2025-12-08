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

  // ====================================
  // PROCESS METADATA ENDPOINTS
  // ====================================

  /**
   * Get process actors
   */
  async getProcessActors(processId: string): Promise<Record<string, unknown>[]> {
    try {
      return await get<Record<string, unknown>[]>(`${this.baseUrl}/${processId}/actors`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create process actor
   */
  async createProcessActor(processId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return await post<Record<string, unknown>>(`${this.baseUrl}/${processId}/actors`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update process actor
   */
  async updateProcessActor(processId: string, actorId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return await patch<Record<string, unknown>>(`${this.baseUrl}/${processId}/actors/${actorId}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete process actor
   */
  async deleteProcessActor(processId: string, actorId: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${processId}/actors/${actorId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get process inputs
   */
  async getProcessInputs(processId: string): Promise<Record<string, unknown>[]> {
    try {
      return await get<Record<string, unknown>[]>(`${this.baseUrl}/${processId}/inputs`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get process outputs
   */
  async getProcessOutputs(processId: string): Promise<Record<string, unknown>[]> {
    try {
      return await get<Record<string, unknown>[]>(`${this.baseUrl}/${processId}/outputs`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create process IO
   */
  async createProcessIO(processId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return await post<Record<string, unknown>>(`${this.baseUrl}/${processId}/ios`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update process IO
   */
  async updateProcessIO(processId: string, ioId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return await patch<Record<string, unknown>>(`${this.baseUrl}/${processId}/ios/${ioId}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete process IO
   */
  async deleteProcessIO(processId: string, ioId: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${processId}/ios/${ioId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get process indicators
   */
  async getProcessIndicators(processId: string): Promise<Record<string, unknown>[]> {
    try {
      return await get<Record<string, unknown>[]>(`${this.baseUrl}/${processId}/indicators`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create process indicator
   */
  async createProcessIndicator(processId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return await post<Record<string, unknown>>(`${this.baseUrl}/${processId}/indicators`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update process indicator
   */
  async updateProcessIndicator(processId: string, indicatorId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return await patch<Record<string, unknown>>(`${this.baseUrl}/${processId}/indicators/${indicatorId}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete process indicator
   */
  async deleteProcessIndicator(processId: string, indicatorId: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${processId}/indicators/${indicatorId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get process risks
   */
  async getProcessRisks(processId: string): Promise<Record<string, unknown>[]> {
    try {
      return await get<Record<string, unknown>[]>(`${this.baseUrl}/${processId}/risks`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create process risk
   */
  async createProcessRisk(processId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return await post<Record<string, unknown>>(`${this.baseUrl}/${processId}/risks`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update process risk
   */
  async updateProcessRisk(processId: string, riskId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return await patch<Record<string, unknown>>(`${this.baseUrl}/${processId}/risks/${riskId}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete process risk
   */
  async deleteProcessRisk(processId: string, riskId: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${processId}/risks/${riskId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get process documents
   */
  async getProcessDocuments(processId: string): Promise<Record<string, unknown>[]> {
    try {
      return await get<Record<string, unknown>[]>(`${this.baseUrl}/${processId}/documents`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create process document
   */
  async createProcessDocument(processId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return await post<Record<string, unknown>>(`${this.baseUrl}/${processId}/documents`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update process document
   */
  async updateProcessDocument(processId: string, documentId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return await patch<Record<string, unknown>>(`${this.baseUrl}/${processId}/documents/${documentId}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete process document
   */
  async deleteProcessDocument(processId: string, documentId: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${processId}/documents/${documentId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

// Export singleton instance
export const processApi = new ProcessApiService()
