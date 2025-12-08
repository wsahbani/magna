import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateDiagramNodeDto } from '../dto/create-diagram-node.dto';
import { CreateDiagramEdgeDto } from '../dto/create-diagram-edge.dto';
import { CreateDiagramLaneDto } from '../dto/create-diagram-lane.dto';
import { FlowNodeType } from '@prisma/client';
import { ProcessService } from '../../process/services/process.service';
import { ProcedureService } from './procedure.service';

/**
 * Diagram Service (Legacy compatibility)
 * Adapts legacy diagram operations to use FlowDiagram, FlowNode, and FlowEdge
 * This service handles automatic creation of Process/Procedure when nodes are dropped
 */
@Injectable()
export class DiagramService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ProcessService))
    private readonly processService: ProcessService,
    private readonly procedureService: ProcedureService,
  ) {}

  /**
   * Create a FlowNode, automatically creating Process or Procedure if needed
   * Adapts legacy createNode to use FlowNode
   */
  async createNode(dto: CreateDiagramNodeDto, userId: string) {
    // Validate that exactly one level ID is provided
    const levelIds = [dto.macroProcessId, dto.processId, dto.procedureId].filter(Boolean);
    if (levelIds.length !== 1) {
      throw new BadRequestException('Exactly one of macroProcessId (processMapId), processId, or procedureId must be provided');
    }

    let referencedEntityId: string | undefined;
    let referencedEntityType: string | undefined;
    let flowDiagram: any;
    let level: number;

    // Auto-create Process if PROCESS_NODE is dropped in ProcessMap (level 1)
    if (dto.macroProcessId && dto.type === 'PROCESS_NODE') {
      const processMap = await this.prisma.processMap.findUnique({
        where: { id: dto.macroProcessId },
      });
      if (!processMap) {
        throw new NotFoundException(`ProcessMap with ID "${dto.macroProcessId}" not found`);
      }

      // Get or create FlowDiagram for ProcessMap (level 1)
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: {
          processMapId: dto.macroProcessId,
          level: 1,
        },
      });

      if (!flowDiagram) {
        flowDiagram = await this.prisma.flowDiagram.create({
          data: {
            level: 1,
            processId: dto.macroProcessId,
            processMapId: dto.macroProcessId,
          },
        });
      }

      level = 1;

      // Create a new Process (level 2)
      const newProcess = await this.processService.create(
        {
          code: `PROC-${Date.now()}`,
          title: dto.label || 'Nouveau Processus',
          description: dto.description,
          processMapId: dto.macroProcessId,
          workspaceId: processMap.workspaceId,
          departmentId: processMap.departmentId || undefined,
        },
        userId,
      );

      referencedEntityId = newProcess.id;
      referencedEntityType = 'PROCESS';
    }
    // Auto-create Procedure if PROCEDURE_NODE is dropped in Process (level 2)
    else if (dto.processId && dto.type === 'PROCEDURE_NODE') {
      const process = await this.prisma.process.findUnique({
        where: { id: dto.processId },
      });
      if (!process) {
        throw new NotFoundException(`Process with ID "${dto.processId}" not found`);
      }

      // Get or create FlowDiagram for Process (level 2)
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: {
          processId_ref: dto.processId,
          level: 2,
        },
      });

      if (!flowDiagram) {
        flowDiagram = await this.prisma.flowDiagram.create({
          data: {
            level: 2,
            processId: dto.processId,
            processId_ref: dto.processId,
          },
        });
      }

      level = 2;

      // Create a new Procedure (level 3)
      // Generate code from process code
      const processCode = process.code || 'PROC';
      const newProcedure = await this.procedureService.create({
        processId: dto.processId,
        title: dto.label || 'Nouvelle Procédure',
        code: `${processCode}-${Date.now()}`,
        description: dto.description,
        workspaceId: process.workspaceId,
        departmentId: process.departmentId || undefined,
      });

      referencedEntityId = newProcedure.id;
      referencedEntityType = 'PROCEDURE';
    }
    // Regular node in Procedure (level 3)
    else if (dto.procedureId) {
      const procedure = await this.prisma.procedure.findUnique({
        where: { id: dto.procedureId },
      });
      if (!procedure) {
        throw new NotFoundException(`Procedure with ID "${dto.procedureId}" not found`);
      }

      // Get or create FlowDiagram for Procedure (level 3)
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: {
          procedureId: dto.procedureId,
          level: 3,
        },
      });

      if (!flowDiagram) {
        flowDiagram = await this.prisma.flowDiagram.create({
          data: {
            level: 3,
            processId: dto.procedureId,
            procedureId: dto.procedureId,
          },
        });
      }

      level = 3;
    } else {
      throw new BadRequestException('Invalid level ID provided');
    }

    // Map node type to FlowNodeType
    const flowNodeType = this.mapNodeTypeToFlowNodeType(dto.type);

    // Create FlowNode
    return this.prisma.flowNode.create({
      data: {
        diagramId: flowDiagram.id,
        rfId: dto.nodeId, // Use nodeId as rfId
        type: flowNodeType,
        label: dto.label,
        position: {
          x: dto.positionX,
          y: dto.positionY,
        },
        entityType: referencedEntityType,
        referencedEntityId,
        data: {
          description: dto.description,
          width: dto.width,
          height: dto.height,
          duration: dto.duration,
          responsible: dto.responsible,
          accountable: dto.accountable,
          consulted: dto.consulted,
          informed: dto.informed,
          style: dto.style,
          ...(dto.data || {}),
        },
      },
    });
  }

  /**
   * Find a FlowNode by level and rfId (nodeId)
   */
  async findNodeByLevelAndNodeId(
    nodeId: string,
    macroProcessId?: string,
    processId?: string,
    procedureId?: string,
  ) {
    let flowDiagram: any;

    if (macroProcessId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { processMapId: macroProcessId, level: 1 },
      });
    } else if (processId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { processId_ref: processId, level: 2 },
      });
    } else if (procedureId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { procedureId, level: 3 },
      });
    } else {
      throw new BadRequestException('One level ID must be provided');
    }

    if (!flowDiagram) {
      return null;
    }

    return this.prisma.flowNode.findFirst({
      where: {
        diagramId: flowDiagram.id,
        rfId: nodeId,
      },
    });
  }

  /**
   * Update a FlowNode
   */
  async updateNode(
    macroProcessId: string | undefined,
    processId: string | undefined,
    procedureId: string | undefined,
    nodeId: string,
    dto: Partial<CreateDiagramNodeDto>,
  ) {
    const node = await this.findNodeByLevelAndNodeId(
      nodeId,
      macroProcessId,
      processId,
      procedureId,
    );
    if (!node) {
      throw new NotFoundException(`Node with nodeId "${nodeId}" not found`);
    }

    const updateData: any = {
      label: dto.label,
    };

    if (dto.positionX !== undefined || dto.positionY !== undefined) {
      updateData.position = {
        x: dto.positionX ?? (node.position as any)?.x ?? 0,
        y: dto.positionY ?? (node.position as any)?.y ?? 0,
      };
    }

    if (dto.description !== undefined || dto.width !== undefined || dto.height !== undefined) {
      const nodeData = (node.data as any) || {};
      updateData.data = {
        ...nodeData,
        description: dto.description ?? nodeData.description,
        width: dto.width ?? nodeData.width,
        height: dto.height ?? nodeData.height,
        duration: dto.duration ?? nodeData.duration,
        responsible: dto.responsible ?? nodeData.responsible,
        accountable: dto.accountable ?? nodeData.accountable,
        consulted: dto.consulted ?? nodeData.consulted,
        informed: dto.informed ?? nodeData.informed,
        style: dto.style ?? nodeData.style,
        ...(dto.data || {}),
      };
    }

    return this.prisma.flowNode.update({
      where: { id: node.id },
      data: updateData,
    });
  }

  /**
   * Delete a FlowNode
   */
  async deleteNode(
    macroProcessId: string | undefined,
    processId: string | undefined,
    procedureId: string | undefined,
    nodeId: string,
  ) {
    const node = await this.findNodeByLevelAndNodeId(
      nodeId,
      macroProcessId,
      processId,
      procedureId,
    );
    if (!node) {
      throw new NotFoundException(`Node with nodeId "${nodeId}" not found`);
    }

    return this.prisma.flowNode.delete({
      where: { id: node.id },
    });
  }

  /**
   * Create a FlowEdge
   */
  async createEdge(dto: CreateDiagramEdgeDto) {
    // Validate that exactly one level ID is provided
    const levelIds = [dto.macroProcessId, dto.processId, dto.procedureId].filter(Boolean);
    if (levelIds.length !== 1) {
      throw new BadRequestException('Exactly one of macroProcessId (processMapId), processId, or procedureId must be provided');
    }

    // Find FlowDiagram
    let flowDiagram: any;
    if (dto.macroProcessId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { processMapId: dto.macroProcessId, level: 1 },
      });
    } else if (dto.processId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { processId_ref: dto.processId, level: 2 },
      });
    } else if (dto.procedureId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { procedureId: dto.procedureId, level: 3 },
      });
    }

    if (!flowDiagram) {
      throw new NotFoundException('FlowDiagram not found for the specified level');
    }

    // Find source and target nodes by their rfId (nodeId)
    const sourceNode = await this.prisma.flowNode.findFirst({
      where: {
        diagramId: flowDiagram.id,
        rfId: dto.sourceId,
      },
    });
    const targetNode = await this.prisma.flowNode.findFirst({
      where: {
        diagramId: flowDiagram.id,
        rfId: dto.targetId,
      },
    });

    if (!sourceNode) {
      throw new NotFoundException(`Source node with rfId "${dto.sourceId}" not found`);
    }
    if (!targetNode) {
      throw new NotFoundException(`Target node with rfId "${dto.targetId}" not found`);
    }

    return this.prisma.flowEdge.create({
      data: {
        diagramId: flowDiagram.id,
        rfId: dto.edgeId,
        sourceRfId: sourceNode.rfId, // Use rfId
        targetRfId: targetNode.rfId, // Use rfId
        label: dto.label,
        condition: dto.condition,
        data: {
          type: dto.type || 'SEQUENCE',
          animated: dto.animated ?? false,
          style: dto.style,
          ...(dto.data || {}),
        },
      },
    });
  }

  /**
   * Find an edge by level and rfId (edgeId)
   */
  async findEdgeByLevelAndEdgeId(
    edgeId: string,
    macroProcessId?: string,
    processId?: string,
    procedureId?: string,
  ) {
    let flowDiagram: any;

    if (macroProcessId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { processMapId: macroProcessId, level: 1 },
      });
    } else if (processId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { processId_ref: processId, level: 2 },
      });
    } else if (procedureId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { procedureId, level: 3 },
      });
    } else {
      throw new BadRequestException('One level ID must be provided');
    }

    if (!flowDiagram) {
      return null;
    }

    return this.prisma.flowEdge.findFirst({
      where: {
        diagramId: flowDiagram.id,
        rfId: edgeId,
      },
    });
  }

  /**
   * Update a FlowEdge
   */
  async updateEdge(
    macroProcessId: string | undefined,
    processId: string | undefined,
    procedureId: string | undefined,
    edgeId: string,
    dto: Partial<CreateDiagramEdgeDto>,
  ) {
    const edge = await this.findEdgeByLevelAndEdgeId(
      edgeId,
      macroProcessId,
      processId,
      procedureId,
    );
    if (!edge) {
      throw new NotFoundException(`Edge with edgeId "${edgeId}" not found`);
    }

    const updateData: any = {
      label: dto.label,
      condition: dto.condition,
    };

    if (dto.sourceId || dto.targetId) {
      // Find FlowDiagram to get source/target nodes
      let flowDiagram: any;
      if (macroProcessId) {
        flowDiagram = await this.prisma.flowDiagram.findFirst({
          where: { processMapId: macroProcessId, level: 1 },
        });
      } else if (processId) {
        flowDiagram = await this.prisma.flowDiagram.findFirst({
          where: { processId_ref: processId, level: 2 },
        });
      } else if (procedureId) {
        flowDiagram = await this.prisma.flowDiagram.findFirst({
          where: { procedureId, level: 3 },
        });
      }

      if (flowDiagram) {
        if (dto.sourceId) {
          const sourceNode = await this.prisma.flowNode.findFirst({
            where: { diagramId: flowDiagram.id, rfId: dto.sourceId },
          });
          if (sourceNode) {
            updateData.sourceRfId = sourceNode.rfId;
          }
        }
        if (dto.targetId) {
          const targetNode = await this.prisma.flowNode.findFirst({
            where: { diagramId: flowDiagram.id, rfId: dto.targetId },
          });
          if (targetNode) {
            updateData.targetRfId = targetNode.rfId;
          }
        }
      }
    }

    if (dto.type || dto.animated !== undefined || dto.style || dto.data) {
      const edgeData = (edge.data as any) || {};
      updateData.data = {
        ...edgeData,
        type: dto.type || edgeData.type || 'SEQUENCE',
        animated: dto.animated ?? edgeData.animated ?? false,
        style: dto.style ?? edgeData.style,
        ...(dto.data || {}),
      };
    }

    return this.prisma.flowEdge.update({
      where: { id: edge.id },
      data: updateData,
    });
  }

  /**
   * Delete a FlowEdge
   */
  async deleteEdge(
    macroProcessId: string | undefined,
    processId: string | undefined,
    procedureId: string | undefined,
    edgeId: string,
  ) {
    const edge = await this.findEdgeByLevelAndEdgeId(
      edgeId,
      macroProcessId,
      processId,
      procedureId,
    );
    if (!edge) {
      throw new NotFoundException(`Edge with edgeId "${edgeId}" not found`);
    }

    return this.prisma.flowEdge.delete({
      where: { id: edge.id },
    });
  }

  /**
   * Create a diagram lane (DEPRECATED - lanes not supported in new model)
   * Returns a mock object for backward compatibility
   */
  async createLane(dto: CreateDiagramLaneDto) {
    // Lanes are not supported in the new FlowDiagram model
    // Return a mock object for backward compatibility
    return {
      id: `lane-${Date.now()}`,
      laneId: dto.laneId,
      name: dto.name,
      color: dto.color,
      order: dto.order || 0,
      height: dto.height,
      collapsed: dto.collapsed || false,
      data: dto.data,
      message: 'Lanes are not supported in the new FlowDiagram model. Consider using FlowNode grouping instead.',
    };
  }

  /**
   * Find a lane (DEPRECATED)
   */
  async findLaneByLevelAndLaneId(
    laneId: string,
    macroProcessId?: string,
    processId?: string,
    procedureId?: string,
  ) {
    // Lanes are not supported in the new FlowDiagram model
    return null;
  }

  /**
   * Update a lane (DEPRECATED)
   */
  async updateLane(
    macroProcessId: string | undefined,
    processId: string | undefined,
    procedureId: string | undefined,
    laneId: string,
    dto: Partial<CreateDiagramLaneDto>,
  ) {
    throw new BadRequestException('Lanes are not supported in the new FlowDiagram model');
  }

  /**
   * Delete a lane (DEPRECATED)
   */
  async deleteLane(
    macroProcessId: string | undefined,
    processId: string | undefined,
    procedureId: string | undefined,
    laneId: string,
  ) {
    throw new BadRequestException('Lanes are not supported in the new FlowDiagram model');
  }

  /**
   * Get all FlowNodes for a level
   */
  async getNodes(
    macroProcessId?: string,
    processId?: string,
    procedureId?: string,
  ) {
    let flowDiagram: any;

    if (macroProcessId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { processMapId: macroProcessId, level: 1 },
      });
    } else if (processId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { processId_ref: processId, level: 2 },
      });
    } else if (procedureId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { procedureId, level: 3 },
      });
    } else {
      throw new BadRequestException('One level ID must be provided');
    }

    if (!flowDiagram) {
      return [];
    }

    return this.prisma.flowNode.findMany({
      where: { diagramId: flowDiagram.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Get all FlowEdges for a level
   */
  async getEdges(
    macroProcessId?: string,
    processId?: string,
    procedureId?: string,
  ) {
    let flowDiagram: any;

    if (macroProcessId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { processMapId: macroProcessId, level: 1 },
      });
    } else if (processId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { processId_ref: processId, level: 2 },
      });
    } else if (procedureId) {
      flowDiagram = await this.prisma.flowDiagram.findFirst({
        where: { procedureId, level: 3 },
      });
    } else {
      throw new BadRequestException('One level ID must be provided');
    }

    if (!flowDiagram) {
      return [];
    }

    return this.prisma.flowEdge.findMany({
      where: { diagramId: flowDiagram.id },
      include: {
        diagram: {
          select: {
            nodes: {
              where: {},
              select: { rfId: true, label: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Get all lanes (DEPRECATED - returns empty array)
   */
  async getLanes(
    macroProcessId?: string,
    processId?: string,
    procedureId?: string,
  ) {
    // Lanes are not supported in the new FlowDiagram model
    return [];
  }

  /**
   * Map node type string to FlowNodeType enum
   */
  private mapNodeTypeToFlowNodeType(nodeType: string): FlowNodeType {
    const upperType = nodeType.toUpperCase();

    // Direct mapping for FlowNodeType enum values
    if (Object.values(FlowNodeType).includes(upperType as FlowNodeType)) {
      return upperType as FlowNodeType;
    }

    // Legacy type mappings
    const typeMap: Record<string, FlowNodeType> = {
      PROCESS_NODE: FlowNodeType.PROCESS,
      PROCEDURE_NODE: FlowNodeType.PROCEDURE,
      START_EVENT: FlowNodeType.START,
      END_EVENT: FlowNodeType.END,
      TASK: FlowNodeType.ACTION,
      ACTIVITY: FlowNodeType.ACTION,
      DECISION: FlowNodeType.DECISION,
      SUBPROCESS: FlowNodeType.SUBFLOW,
    };

    return typeMap[upperType] || FlowNodeType.ACTION;
  }
}
