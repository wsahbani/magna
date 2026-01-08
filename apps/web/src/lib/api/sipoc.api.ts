/**
 * SIPOC API Service
 * Handles all SIPOC-related API calls
 */

import { get, post, patch, del, handleApiError, put } from '../base-api'
import type { SipocDiagram } from '../../features/sipoc/types/sipoc.types'

export interface CreateSipocDto {
  title: string
  description?: string
  process_owner?: string
  department?: string
  version?: number
  status?: string
  is_template?: boolean
  processId?: string
}

export interface UpdateSipocDto {
  title?: string
  description?: string
  process_owner?: string
  department?: string
  version?: number
  status?: string
  is_template?: boolean
  processId?: string
}

class SipocApiService {
  private readonly baseUrl = '/sipoc'

  /**
   * Get all SIPOC diagrams with optional filters
   */
  async getSipocDiagrams(params?: {
    userId?: string
    status?: string
    processId?: string
  }): Promise<SipocDiagram[]> {
    try {
      return await get<SipocDiagram[]>(this.baseUrl, { params })
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get SIPOC diagrams by process ID
   */
  async getSipocDiagramsByProcessId(processId: string): Promise<SipocDiagram> {
    try {
      return await get<SipocDiagram>(`${this.baseUrl}/process/${processId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get SIPOC diagram by ID
   */
  async getSipocDiagramById(id: string): Promise<SipocDiagram> {
    try {
      return await get<SipocDiagram>(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create a new SIPOC diagram
   */
  async createSipocDiagram(data: CreateSipocDto, userId: string): Promise<SipocDiagram> {
    try {
      return await post<SipocDiagram>(this.baseUrl, data, {
        params: { userId },
      })
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update SIPOC diagram
   */
  async updateSipocDiagram(id: string, data: UpdateSipocDto): Promise<SipocDiagram> {
    try {
      return await patch<SipocDiagram>(`${this.baseUrl}/${id}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete SIPOC diagram
   */
  async deleteSipocDiagram(id: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // ====================================
  // SIPOC ELEMENTS API
  // ====================================

  /**
   * Get elements by SIPOC ID
   */
  async getElements(sipocId: string) {
    try {
      return await get(`${this.baseUrl}/${sipocId}/elements`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update SIPOC element
   */
  async updateElement(
    sipocId: string,
    elementId: string,
    data: { title?: string; description?: string; contactInfo?: string }
  ) {
    try {
      return await put(`${this.baseUrl}/${sipocId}/elements/${elementId}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete SIPOC element
   */
  async deleteElement(sipocId: string, elementId: string) {
    try {
      await del(`${this.baseUrl}/${sipocId}/elements/${elementId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // ====================================
  // SIPOC CONNECTIONS API
  // ====================================

  /**
   * Create a SIPOC connection
   */
  async createConnection(data: {
    sourceElementId: string
    targetElementId: string
    sourceSipocId: string
    targetSipocId: string
    description?: string
  }) {
    try {
      return await post('/sipoc-connections', {
        sourceElementId: data.sourceElementId,
        targetElementId: data.targetElementId,
        sipoc_id: data.sourceSipocId,
        source_sipoc_id: data.sourceSipocId,
        target_sipoc_id: data.targetSipocId,
        description: data.description,
      })
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get connections by element ID
   */
  async getConnectionsByElement(elementId: string) {
    try {
      return await get(`/sipoc-connections/element/${elementId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get connections by SIPOC ID
   */
  async getConnectionsBySipoc(sipocId: string) {
    try {
      return await get(`/sipoc-connections/sipoc/${sipocId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete a connection
   */
  async deleteConnection(connectionId: string) {
    try {
      await del(`/sipoc-connections/${connectionId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // ====================================
  // SIPOC ELEMENTS - SIMILAR SEARCH
  // ====================================

  /**
   * Find similar elements based on title similarity
   */
  async findSimilarElements(
    sipocId: string,
    title: string,
    threshold: number = 0.3
  ) {
    try {
      return await get(
        `${this.baseUrl}/${sipocId}/elements/similar/${encodeURIComponent(title)}`,
        { params: { threshold } }
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const sipocApi = new SipocApiService()
