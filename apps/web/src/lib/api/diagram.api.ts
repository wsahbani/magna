/**
 * Generic Diagram API Service
 * Supports MacroProcess, Process, and Procedure levels
 */

import { get, post, patch, del, handleApiError } from '../base-api'
import type {
  DiagramNode,
  DiagramEdge,
  DiagramLane,
  CreateDiagramNodeDto,
  CreateDiagramEdgeDto,
  CreateDiagramLaneDto,
} from '../../features/procedures/types/procedure.types'

export type DiagramLevel = 'macro-process' | 'process' | 'procedure'

class DiagramApiService {
  /**
   * Get nodes for a level
   */
  async getNodes(
    level: DiagramLevel,
    levelId: string,
  ): Promise<DiagramNode[]> {
    try {
      const baseUrl = this.getBaseUrl(level)
      return await get<DiagramNode[]>(`${baseUrl}/${levelId}/nodes`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create a node
   */
  async createNode(
    level: DiagramLevel,
    levelId: string,
    data: CreateDiagramNodeDto,
  ): Promise<DiagramNode> {
    try {
      const baseUrl = this.getBaseUrl(level)
      return await post<DiagramNode>(`${baseUrl}/${levelId}/nodes`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update a node
   */
  async updateNode(
    level: DiagramLevel,
    levelId: string,
    nodeId: string,
    data: Partial<CreateDiagramNodeDto>,
  ): Promise<DiagramNode> {
    try {
      const baseUrl = this.getBaseUrl(level)
      return await patch<DiagramNode>(
        `${baseUrl}/${levelId}/nodes/${nodeId}`,
        data,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete a node
   */
  async deleteNode(
    level: DiagramLevel,
    levelId: string,
    nodeId: string,
  ): Promise<void> {
    try {
      const baseUrl = this.getBaseUrl(level)
      await del(`${baseUrl}/${levelId}/nodes/${nodeId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get edges for a level
   */
  async getEdges(
    level: DiagramLevel,
    levelId: string,
  ): Promise<DiagramEdge[]> {
    try {
      const baseUrl = this.getBaseUrl(level)
      return await get<DiagramEdge[]>(`${baseUrl}/${levelId}/edges`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create an edge
   */
  async createEdge(
    level: DiagramLevel,
    levelId: string,
    data: CreateDiagramEdgeDto,
  ): Promise<DiagramEdge> {
    try {
      const baseUrl = this.getBaseUrl(level)
      return await post<DiagramEdge>(`${baseUrl}/${levelId}/edges`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update an edge
   */
  async updateEdge(
    level: DiagramLevel,
    levelId: string,
    edgeId: string,
    data: Partial<CreateDiagramEdgeDto>,
  ): Promise<DiagramEdge> {
    try {
      const baseUrl = this.getBaseUrl(level)
      return await patch<DiagramEdge>(
        `${baseUrl}/${levelId}/edges/${edgeId}`,
        data,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete an edge
   */
  async deleteEdge(
    level: DiagramLevel,
    levelId: string,
    edgeId: string,
  ): Promise<void> {
    try {
      const baseUrl = this.getBaseUrl(level)
      await del(`${baseUrl}/${levelId}/edges/${edgeId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get lanes for a level
   */
  async getLanes(
    level: DiagramLevel,
    levelId: string,
  ): Promise<DiagramLane[]> {
    try {
      const baseUrl = this.getBaseUrl(level)
      return await get<DiagramLane[]>(`${baseUrl}/${levelId}/lanes`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create a lane
   */
  async createLane(
    level: DiagramLevel,
    levelId: string,
    data: CreateDiagramLaneDto,
  ): Promise<DiagramLane> {
    try {
      const baseUrl = this.getBaseUrl(level)
      return await post<DiagramLane>(`${baseUrl}/${levelId}/lanes`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update a lane
   */
  async updateLane(
    level: DiagramLevel,
    levelId: string,
    laneId: string,
    data: Partial<CreateDiagramLaneDto>,
  ): Promise<DiagramLane> {
    try {
      const baseUrl = this.getBaseUrl(level)
      return await patch<DiagramLane>(
        `${baseUrl}/${levelId}/lanes/${laneId}`,
        data,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete a lane
   */
  async deleteLane(
    level: DiagramLevel,
    levelId: string,
    laneId: string,
  ): Promise<void> {
    try {
      const baseUrl = this.getBaseUrl(level)
      await del(`${baseUrl}/${levelId}/lanes/${laneId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get base URL for a level
   */
  private getBaseUrl(level: DiagramLevel): string {
    switch (level) {
      case 'macro-process':
        return '/macro-processes'
      case 'process':
        return '/processes'
      case 'procedure':
        return '/procedures'
      default:
        throw new Error(`Unknown level: ${level}`)
    }
  }
}

export const diagramApi = new DiagramApiService()

