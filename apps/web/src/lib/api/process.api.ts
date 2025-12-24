/**
 * Process API Client
 * Handles all API calls for Process (Level 2) entities
 */

import { get, post, patch, del } from '../base-api'
import type {
  Process,
  CreateProcessDto,
  UpdateProcessDto,
  ProcessListParams,
  ProcessListResponse,
} from '../../features/process/types/process.types'
import type {
  FlowDiagram,
  SaveProcessFlowDto,
} from '../../features/process/types/flow-diagram.types'

const BASE_URL = '/processes'

/**
 * Get all processes with optional filters
 */
export async function getProcesses(
  params?: ProcessListParams,
): Promise<ProcessListResponse> {
  const queryParams = new URLSearchParams()
  
  if (params?.processMapId) {
    queryParams.append('processMapId', params.processMapId)
  }
  if (params?.workspaceId) {
    queryParams.append('workspaceId', params.workspaceId)
  }
  if (params?.page) {
    queryParams.append('page', params.page.toString())
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString())
  }
  if (params?.search) {
    queryParams.append('search', params.search)
  }
  if (params?.status) {
    queryParams.append('status', params.status)
  }
  if (params?.type) {
    queryParams.append('type', params.type)
  }

  const queryString = queryParams.toString()
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL
  
  return get<ProcessListResponse>(url)
}

/**
 * Get a single process by ID
 */
export async function getProcess(id: string): Promise<Process> {
  return get<Process>(`${BASE_URL}/${id}`)
}

/**
 * Create a new process
 */
export async function createProcess(
  data: CreateProcessDto,
): Promise<Process> {
  return post<Process>(BASE_URL, data)
}

/**
 * Update an existing process
 */
export async function updateProcess(
  id: string,
  data: UpdateProcessDto,
): Promise<Process> {
  return patch<Process>(`${BASE_URL}/${id}`, data)
}

/**
 * Delete a process
 */
export async function deleteProcess(id: string): Promise<void> {
  return del<void>(`${BASE_URL}/${id}`)
}

/**
 * Get flow diagram for a process
 */
export async function getProcessFlow(processId: string): Promise<FlowDiagram> {
  return get<FlowDiagram>(`${BASE_URL}/${processId}/flow`)
}

/**
 * Save flow diagram for a process
 */
export async function saveProcessFlow(
  processId: string,
  nodes: any[],
  edges: any[],
  flowDirection?: 'horizontal' | 'vertical',
): Promise<{ diagramId: string; message: string }> {
  return post<{ diagramId: string; message: string }>(
    `${BASE_URL}/${processId}/flow/save`,
    {
      processId,
      nodes,
      edges,
      flowDirection: flowDirection ? flowDirection.toUpperCase() as 'HORIZONTAL' | 'VERTICAL' : undefined,
    },
  )
}

/**
 * Request validation for a process
 */
export async function requestProcessValidation(
  processId: string,
  validatorIds: string[],
): Promise<any> {
  return post(`/processes/${processId}/validation/request`, {
    validatorIds,
  });
}

/**
 * Get validation requests for a process
 */
export async function getProcessValidationRequests(processId: string): Promise<any> {
  return get(`/processes/${processId}/validation`);
}

/**
 * Approve a validation request
 */
export async function approveValidation(
  requestId: string,
  comment?: string,
): Promise<any> {
  return post(`/processes/validation/${requestId}/approve`, {
    comment,
  });
}

/**
 * Reject a validation request
 */
export async function rejectValidation(
  requestId: string,
  comment: string,
): Promise<any> {
  return post(`/processes/validation/${requestId}/reject`, {
    comment,
  });
}

/**
 * Get pending validation requests for current user
 */
export async function getPendingValidations(): Promise<any> {
  return get('/processes/validation/pending');
}

/**
 * Process API Client Object
 * For backward compatibility with existing code
 */
export const processApi = {
  /**
   * Get all processes with pagination and filters
   */
  getProcesses: async (params?: ProcessListParams): Promise<ProcessListResponse> => {
    const queryParams = new URLSearchParams()
    
    if (params?.processMapId) {
      queryParams.append('processMapId', params.processMapId)
    }
    if (params?.workspaceId) {
      queryParams.append('workspaceId', params.workspaceId)
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString())
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString())
    }
    if (params?.search) {
      queryParams.append('search', params.search)
    }
    if (params?.status) {
      queryParams.append('status', params.status)
    }
    if (params?.type) {
      queryParams.append('type', params.type)
    }

    const queryString = queryParams.toString()
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL
    
    return get<ProcessListResponse>(url)
  },

  /**
   * Get Process by ID
   */
  getProcessById: async (id: string): Promise<Process> => {
    return get<Process>(`${BASE_URL}/${id}`)
  },

  /**
   * Create new Process
   */
  createProcess: async (data: CreateProcessDto): Promise<Process> => {
    return post<Process>(BASE_URL, data)
  },

  /**
   * Update Process
   */
  updateProcess: async (id: string, data: UpdateProcessDto): Promise<Process> => {
    return patch<Process>(`${BASE_URL}/${id}`, data)
  },

  /**
   * Delete Process
   */
  deleteProcess: async (id: string): Promise<void> => {
    return del<void>(`${BASE_URL}/${id}`)
  },

  /**
   * Get root processes (for legacy compatibility)
   */
  getRootProcesses: async (): Promise<any[]> => {
    const response = await get<ProcessListResponse>(BASE_URL)
    return response.data || []
  },

  /**
   * Get process hierarchy (for legacy compatibility)
   */
  getProcessHierarchy: async (id: string): Promise<any> => {
    return get<Process>(`${BASE_URL}/${id}`)
  },

  /**
   * Get FlowDiagram for Process (level 2)
   */
  getFlow: async (processId: string): Promise<FlowDiagram> => {
    return get<FlowDiagram>(`${BASE_URL}/${processId}/flow`)
  },

  /**
   * Save FlowDiagram for Process (level 2)
   */
  saveFlow: async (processId: string, nodes: any[], edges: any[]): Promise<any> => {
    return post<{ diagramId: string; message: string }>(
      `${BASE_URL}/${processId}/flow/save`,
      {
        processId,
        nodes,
        edges,
      },
    )
  },
}
