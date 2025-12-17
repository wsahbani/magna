import { get, post, patch, del, handleApiError } from '../base-api'
import type {
  MacroProcess,
  MacroProcessWithRelations,
  CreateMacroProcessDto,
  UpdateMacroProcessDto,
  MacroProcessListParams,
  ReorderMacroProcessDto,
  PaginatedMacroProcessResponse,
} from '../../features/macro-processes/types/macro-process.types'

class MacroProcessApiService {
  private readonly baseUrl = '/macro-processes'

  /**
   * Get all macro processes with pagination
   */
  async getMacroProcesses(
    params?: MacroProcessListParams,
  ): Promise<PaginatedMacroProcessResponse> {
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
      return await get<PaginatedMacroProcessResponse>(url)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get macro process by ID
   */
  async getMacroProcessById(id: string): Promise<MacroProcessWithRelations> {
    try {
      return await get<MacroProcessWithRelations>(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create new macro process
   */
  async createMacroProcess(
    data: CreateMacroProcessDto,
  ): Promise<MacroProcess> {
    try {
      return await post<MacroProcess>(this.baseUrl, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update macro process
   */
  async updateMacroProcess(
    id: string,
    data: UpdateMacroProcessDto,
  ): Promise<MacroProcess> {
    try {
      return await patch<MacroProcess>(`${this.baseUrl}/${id}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete macro process (soft delete)
   */
  async deleteMacroProcess(id: string): Promise<void> {
    try {
      return await del<void>(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Reorder macro processes
   */
  async reorderMacroProcesses(
    data: ReorderMacroProcessDto,
  ): Promise<{ message: string }> {
    try {
      return await patch<{ message: string }>(
        `${this.baseUrl}/reorder`,
        data,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const macroProcessApi = new MacroProcessApiService()

