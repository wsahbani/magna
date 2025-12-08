import { get, post, patch, del, handleApiError } from '../base-api'
import type {
  Procedure,
  ProcedureWithRelations,
  DiagramNode,
  DiagramEdge,
  DiagramLane,
  ProcedureVersion,
  CreateProcedureDto,
  UpdateProcedureDto,
  CreateDiagramNodeDto,
  CreateDiagramEdgeDto,
  CreateDiagramLaneDto,
  ValidationResult,
} from '../../features/procedures/types/procedure.types'

class ProcedureApiService {
  private readonly baseUrl = '/procedures'

  /**
   * Get all procedures
   */
  async getProcedures(processId?: string): Promise<Procedure[]> {
    try {
      const url = processId
        ? `${this.baseUrl}?processId=${processId}`
        : this.baseUrl
      return await get<Procedure[]>(url)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get procedure by ID
   */
  async getProcedureById(id: string): Promise<ProcedureWithRelations> {
    try {
      return await get<ProcedureWithRelations>(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Create procedure
   */
  async createProcedure(data: CreateProcedureDto): Promise<Procedure> {
    try {
      return await post<Procedure>(this.baseUrl, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Update procedure
   */
  async updateProcedure(
    id: string,
    data: UpdateProcedureDto,
  ): Promise<Procedure> {
    try {
      return await patch<Procedure>(`${this.baseUrl}/${id}`, data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Delete procedure
   */
  async deleteProcedure(id: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // Nodes
  async getNodes(procedureId: string): Promise<DiagramNode[]> {
    try {
      return await get<DiagramNode[]>(`${this.baseUrl}/${procedureId}/nodes`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async createNode(
    procedureId: string,
    data: CreateDiagramNodeDto,
  ): Promise<DiagramNode> {
    try {
      return await post<DiagramNode>(
        `${this.baseUrl}/${procedureId}/nodes`,
        data,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async updateNode(
    procedureId: string,
    nodeId: string,
    data: Partial<CreateDiagramNodeDto>,
  ): Promise<DiagramNode> {
    try {
      return await patch<DiagramNode>(
        `${this.baseUrl}/${procedureId}/nodes/${nodeId}`,
        data,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async deleteNode(procedureId: string, nodeId: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${procedureId}/nodes/${nodeId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // Edges
  async getEdges(procedureId: string): Promise<DiagramEdge[]> {
    try {
      return await get<DiagramEdge[]>(`${this.baseUrl}/${procedureId}/edges`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async createEdge(
    procedureId: string,
    data: CreateDiagramEdgeDto,
  ): Promise<DiagramEdge> {
    try {
      return await post<DiagramEdge>(
        `${this.baseUrl}/${procedureId}/edges`,
        data,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async updateEdge(
    procedureId: string,
    edgeId: string,
    data: Partial<CreateDiagramEdgeDto>,
  ): Promise<DiagramEdge> {
    try {
      return await patch<DiagramEdge>(
        `${this.baseUrl}/${procedureId}/edges/${edgeId}`,
        data,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async deleteEdge(procedureId: string, edgeId: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${procedureId}/edges/${edgeId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // Lanes
  async getLanes(procedureId: string): Promise<DiagramLane[]> {
    try {
      return await get<DiagramLane[]>(`${this.baseUrl}/${procedureId}/lanes`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async createLane(
    procedureId: string,
    data: CreateDiagramLaneDto,
  ): Promise<DiagramLane> {
    try {
      return await post<DiagramLane>(
        `${this.baseUrl}/${procedureId}/lanes`,
        data,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async updateLane(
    procedureId: string,
    laneId: string,
    data: Partial<CreateDiagramLaneDto>,
  ): Promise<DiagramLane> {
    try {
      return await patch<DiagramLane>(
        `${this.baseUrl}/${procedureId}/lanes/${laneId}`,
        data,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async deleteLane(procedureId: string, laneId: string): Promise<void> {
    try {
      await del(`${this.baseUrl}/${procedureId}/lanes/${laneId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // Validation & Publishing
  async validateProcedure(procedureId: string): Promise<ValidationResult> {
    try {
      return await get<ValidationResult>(
        `${this.baseUrl}/${procedureId}/validate`,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async publishProcedure(procedureId: string): Promise<Procedure> {
    try {
      return await post<Procedure>(`${this.baseUrl}/${procedureId}/publish`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // Versions
  async getVersions(procedureId: string): Promise<ProcedureVersion[]> {
    try {
      return await get<ProcedureVersion[]>(
        `${this.baseUrl}/${procedureId}/versions`,
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async createVersion(
    procedureId: string,
    changeLog?: string,
  ): Promise<ProcedureVersion> {
    try {
      return await post<ProcedureVersion>(
        `${this.baseUrl}/${procedureId}/versions`,
        { changeLog },
      )
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const procedureApi = new ProcedureApiService()

