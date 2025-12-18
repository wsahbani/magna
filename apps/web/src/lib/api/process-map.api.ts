/**
 * ProcessMap API Client
 * Handles all process-map-related API calls
 */

import { get, post, patch, del } from '../base-api'
import type {
  ProcessMap,
  CreateProcessMapDto,
  UpdateProcessMapDto,
  ProcessMapListParams,
  ProcessMapListResponse,
} from '../../features/process-map/types/process-map.types'

export const processMapApi = {
  /**
   * Get all ProcessMaps with pagination and filters
   */
  getAll: async (params?: ProcessMapListParams): Promise<ProcessMapListResponse> => {
    return get<ProcessMapListResponse>('/process-maps', { params })
  },

  /**
   * Get ProcessMap by ID
   */
  getById: async (id: string): Promise<ProcessMap> => {
    return get<ProcessMap>(`/process-maps/${id}`)
  },

  /**
   * Create new ProcessMap
   */
  create: async (data: CreateProcessMapDto): Promise<ProcessMap> => {
    return post<ProcessMap>('/process-maps', data)
  },

  /**
   * Update ProcessMap
   */
  update: async (id: string, data: UpdateProcessMapDto): Promise<ProcessMap> => {
    return patch<ProcessMap>(`/process-maps/${id}`, data)
  },

  /**
   * Delete ProcessMap
   */
  delete: async (id: string): Promise<ProcessMap> => {
    return del<ProcessMap>(`/process-maps/${id}`)
  },

  /**
   * Get ProcessMap processes
   */
  getProcesses: async (id: string): Promise<any[]> => {
    return get<any[]>(`/process-maps/${id}/processes`)
  },

  /**
   * Get FlowDiagram for ProcessMap (level 1)
   */
  getFlow: async (processMapId: string): Promise<any> => {
    return get<any>(`/process-maps/${processMapId}/flow`)
  },

  /**
   * Save FlowDiagram for ProcessMap (level 1)
   */
  saveFlow: async (processMapId: string, nodes: any[], edges: any[]): Promise<any> => {
    return post<any>(`/process-maps/${processMapId}/flow/save`, {
      processMapId,
      nodes,
      edges,
    })
  },

  // ====================================
  // VALIDATION ENDPOINTS
  // ====================================

  /**
   * Request validation for a ProcessMap
   */
  requestValidation: async (
    processMapId: string,
    data: { validatorIds: string[]; comment?: string },
  ): Promise<any[]> => {
    return post<any[]>(`/process-maps/${processMapId}/validation/request`, data)
  },

  /**
   * Get all validation requests for a ProcessMap
   */
  getValidationRequests: async (processMapId: string): Promise<any[]> => {
    return get<any[]>(`/process-maps/${processMapId}/validation`)
  },

  /**
   * Approve a validation request
   */
  approveValidation: async (
    requestId: string,
    data: { comment?: string },
  ): Promise<any> => {
    return post<any>(`/process-maps/validation/${requestId}/approve`, data)
  },

  /**
   * Reject a validation request
   */
  rejectValidation: async (
    requestId: string,
    data: { comment: string },
  ): Promise<any> => {
    return post<any>(`/process-maps/validation/${requestId}/reject`, data)
  },

  /**
   * Get pending validation requests for current user
   */
  getPendingValidations: async (): Promise<any[]> => {
    return get<any[]>(`/process-maps/validation/pending`)
  },
}

