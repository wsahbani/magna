import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { SaveNodeDto, SaveEdgeDto } from '../../process/dto/save-flow.dto';
import { SaveProcessFlowDto } from '../dto/save-process-flow.dto';
import { FlowNodeType } from '@prisma/client';
import { ProcedureService } from '../../procedure/services/procedure.service';

/**
 * Process Flow Service
 * Handles saving and retrieving ReactFlow diagrams for Process (level 2)
 * Automatically creates Procedure entities when PROCEDURE_NODE is dropped
 */
@Injectable()
export class ProcessFlowService {
  private readonly logger = new Logger(ProcessFlowService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly procedureService: ProcedureService,
  ) {}

  /**
   * Get flow diagram for a Process (level 2)
   */
  async getFlow(processId: string) {
    this.logger.log(`Getting flow for Process: ${processId}`);

    const process = await this.prisma.process.findUnique({
      where: { id: processId },
    });

    if (!process) {
      throw new NotFoundException(`Process ${processId} not found`);
    }

    // Get FlowDiagram for this Process (level 2)
    const flowDiagram = await this.prisma.flowDiagram.findFirst({
      where: {
        processId_ref: processId,
        level: 2,
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    if (!flowDiagram) {
      // Return empty flow if no diagram exists yet
      return {
        processId,
        diagramId: null,
        nodes: [],
        edges: [],
        flowDirection: 'HORIZONTAL' as const,
      };
    }
    
    return {
      processId,
      diagramId: flowDiagram.id,
      nodes: flowDiagram.nodes.map(this.mapFlowNodeToReactFlow),
      edges: flowDiagram.edges.map(this.mapFlowEdgeToReactFlow),
      flowDirection: flowDiagram.flowDirection,
    };
  }

  /**
   * Save flow diagram for Process (level 2)
   * Automatically creates Procedure entities when PROCEDURE_NODE is dropped
   */
  async saveFlow(saveFlowDto: SaveProcessFlowDto, userId: string) {
    this.logger.log(`Saving flow for Process: ${saveFlowDto.processId}`);

    if (!saveFlowDto.processId) {
      throw new NotFoundException('processId is required');
    }

    const process = await this.prisma.process.findUnique({
      where: { id: saveFlowDto.processId },
      select: {
        id: true,
        code: true,
        workspaceId: true,
        departmentId: true,
        createdById: true,
      },
    });

    if (!process) {
      throw new NotFoundException(`Process ${saveFlowDto.processId} not found`);
    }

    // Get or create FlowDiagram for this Process (level 2)
    let flowDiagram = await this.prisma.flowDiagram.findFirst({
      where: {
        processId_ref: saveFlowDto.processId,
        level: 2,
      },
    });

    if (!flowDiagram) {
      flowDiagram = await this.prisma.flowDiagram.create({
        data: {
          level: 2,
          processId: saveFlowDto.processId, // Generic field for unique constraint
          processId_ref: saveFlowDto.processId, // Specific relation to Process
          flowDirection: saveFlowDto.flowDirection || 'HORIZONTAL',
        },
      });
    } else if (saveFlowDto.flowDirection !== undefined) {
      // Update flowDirection if provided
      flowDiagram = await this.prisma.flowDiagram.update({
        where: { id: flowDiagram.id },
        data: { flowDirection: saveFlowDto.flowDirection },
      });
    }

    // Get existing nodes and edges from database
    const existingNodes = await this.prisma.flowNode.findMany({
      where: { diagramId: flowDiagram.id },
    });

    const existingEdges = await this.prisma.flowEdge.findMany({
      where: { diagramId: flowDiagram.id },
    });

    // Identify nodes/edges to delete (present in DB but not in incoming DTO)
    const incomingNodeIds = new Set(saveFlowDto.nodes.map((n) => n.id));
    const incomingEdgeIds = new Set(saveFlowDto.edges.map((e) => e.id));

    const nodesToDelete = existingNodes.filter(
      (node) => !incomingNodeIds.has(node.rfId),
    );
    const edgesToDelete = existingEdges.filter(
      (edge) => !incomingEdgeIds.has(edge.rfId),
    );

    // Save flow in transaction
    return this.prisma.$transaction(async (tx) => {
      // Delete nodes that are no longer in the diagram
      for (const node of nodesToDelete) {
        // If it's a PROCEDURE node, delete the referenced Procedure entity
        if (node.entityType === 'PROCEDURE' && node.referencedEntityId) {
          // Check if Procedure is referenced by other nodes in the same diagram
          const otherNodesReferencing = await tx.flowNode.findFirst({
            where: {
              diagramId: flowDiagram.id,
              referencedEntityId: node.referencedEntityId,
              id: { not: node.id },
            },
          });

          if (!otherNodesReferencing) {
            // Delete the Procedure entity
            await tx.procedure.delete({
              where: { id: node.referencedEntityId },
            }).catch((err) => {
              this.logger.warn(`Failed to delete Procedure ${node.referencedEntityId}: ${err.message}`);
            });
          }
        }

        await tx.flowNode.delete({
          where: { id: node.id },
        });
      }

      // Delete edges that are no longer in the diagram
      for (const edge of edgesToDelete) {
        await tx.flowEdge.delete({
          where: { id: edge.id },
        });
      }

      // Process nodes: create/update
      for (const node of saveFlowDto.nodes) {
        const existingNode = existingNodes.find((n) => n.rfId === node.id);

        if (existingNode) {
          // Update existing node
          await this.updateFlowNode(tx, existingNode.id, node);
        } else {
          // Create new node
          let referencedEntityId: string | undefined;

          // If node type is PROCEDURE_NODE, create Procedure entity automatically
          if (node.type === 'PROCEDURE_NODE' || node.type === 'procedure') {
            const procedure = await this.createProcedureFromNode(tx, process, node, userId);
            referencedEntityId = procedure.id;
          }

          await this.createFlowNode(
            tx,
            flowDiagram.id,
            node,
            node.id,
            referencedEntityId,
          );
        }
      }

      // Process edges: create/update
      for (const edge of saveFlowDto.edges) {
        const existingEdge = existingEdges.find((e) => e.rfId === edge.id);

        if (existingEdge) {
          await this.updateFlowEdge(tx, existingEdge.id, edge);
        } else {
          await this.createFlowEdge(tx, flowDiagram.id, edge, edge.id);
        }
      }

      return {
        processId: saveFlowDto.processId,
        diagramId: flowDiagram.id,
        message: 'Flow diagram saved successfully',
      };
    });
  }

  /**
   * Create Procedure entity from a PROCEDURE_NODE
   */
  private async createProcedureFromNode(
    tx: any,
    process: any,
    node: SaveNodeDto,
    userId: string,
  ) {
    // Generate code for Procedure
    const procedureCount = await tx.procedure.count({
      where: { processId: process.id },
    });
    const code = `${process.code}-PROC-${String(procedureCount + 1).padStart(3, '0')}`;

    // Validate userId exists or use process.createdById as fallback
    let validUserId = userId;
    if (userId && userId !== 'system') {
      const userExists = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!userExists) {
        // Fallback to process creator if userId is invalid
        validUserId = process.createdById || 'system';
      }
    } else {
      // Use process creator if userId is 'system' or empty
      validUserId = process.createdById || 'system';
    }

    // Create Procedure
    const procedure = await tx.procedure.create({
      data: {
        title: node.label || 'Nouvelle Procédure',
        code,
        description: node.description,
        processId: process.id,
        workspaceId: process.workspaceId,
        departmentId: process.departmentId,
        createdById: validUserId,
      },
    });

    // Create FlowDiagram for Procedure (level 3) - automatically created like ProcedureService.create
    await tx.flowDiagram.create({
      data: {
        level: 3,
        processId: procedure.id, // Generic field for unique constraint
        procedureId: procedure.id, // Specific relation to Procedure
      },
    });

    return procedure;
  }

  /**
   * Create a FlowNode in the database
   */
  private async createFlowNode(
    tx: any,
    diagramId: string,
    node: SaveNodeDto,
    rfId: string,
    referencedEntityId?: string,
  ) {
    const flowNodeType = this.mapNodeTypeToFlowNodeType(node.type);

    return tx.flowNode.create({
      data: {
        diagramId,
        rfId,
        type: flowNodeType,
        label: node.label,
        position: {
          x: node.positionX,
          y: node.positionY,
        },
        entityType: referencedEntityId ? 'PROCEDURE' : undefined,
        referencedEntityId,
        data: {
          originalType: node.type, // Store original node type for ReactFlow mapping
          description: node.description,
          width: node.width,
          height: node.height,
          zIndex: node.zIndex,
          parentNodeId: node.data?.parentNode || node.parentNodeId,
          groupId: node.groupId,
          sourcePosition: node.sourcePosition,
          targetPosition: node.targetPosition,
          isConnectable: node.isConnectable ?? true,
          isDraggable: node.isDraggable ?? true,
          isSelectable: node.isSelectable ?? true,
          style: node.style,
          ...(node.data || {}),
        },
      },
    });
  }

  /**
   * Update an existing FlowNode in the database
   */
  private async updateFlowNode(tx: any, nodeId: string, node: SaveNodeDto) {
    const flowNodeType = this.mapNodeTypeToFlowNodeType(node.type);

    // Get existing node to preserve dimensions if not provided
    const existingNode = await tx.flowNode.findUnique({
      where: { id: nodeId },
      select: { data: true },
    });

    const existingData = (existingNode?.data as any) || {};

    // Handle linkedProcessId changes - update referencedEntityId if linkedProcessId is present
    const updateData: any = {
      type: flowNodeType,
      label: node.label,
      position: {
        x: node.positionX,
        y: node.positionY,
      },
      data: {
        originalType: node.type, // Store original node type for ReactFlow mapping
        description: node.description,
        // Preserve width/height if provided, otherwise keep existing values
        width: node.width !== undefined && node.width !== null ? node.width : (node.data?.width ?? existingData.width),
        height: node.height !== undefined && node.height !== null ? node.height : (node.data?.height ?? existingData.height),
        zIndex: node.zIndex,
        parentNodeId: node.data?.parentNode || node.parentNodeId,
        groupId: node.groupId,
        sourcePosition: node.sourcePosition,
        targetPosition: node.targetPosition,
        isConnectable: node.isConnectable ?? true,
        isDraggable: node.isDraggable ?? true,
        isSelectable: node.isSelectable ?? true,
        style: node.style,
        ...(node.data || {}),
      },
    };

    // Update referencedEntityId if linkedProcessId is present in node.data
    if (node.data?.linkedProcessId) {
      updateData.entityType = 'PROCESS';
      updateData.referencedEntityId = node.data.linkedProcessId;
    } else if (node.data?.linkedProcessId === null || node.data?.linkedProcessId === undefined) {
      // If linkedProcessId is explicitly cleared, remove the reference
      updateData.entityType = null;
      updateData.referencedEntityId = null;
    }

    return tx.flowNode.update({
      where: { id: nodeId },
      data: updateData,
    });
  }

  /**
   * Create a FlowEdge in the database
   */
  private async createFlowEdge(
    tx: any,
    diagramId: string,
    edge: SaveEdgeDto,
    rfId: string,
  ) {
    return tx.flowEdge.create({
      data: {
        diagramId,
        rfId,
        sourceRfId: edge.source,
        targetRfId: edge.target,
        label: edge.label,
        condition: edge.data?.condition,
        data: {
          type: edge.type || 'SEQUENCE_FLOW',
          animated: edge.animated ?? false,
          pathType: edge.pathType || 'smoothstep',
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          style: edge.style,
          ...(edge.data || {}),
        },
      },
    });
  }

  /**
   * Update an existing FlowEdge in the database
   */
  private async updateFlowEdge(tx: any, edgeId: string, edge: SaveEdgeDto) {
    return tx.flowEdge.update({
      where: { id: edgeId },
      data: {
        sourceRfId: edge.source,
        targetRfId: edge.target,
        label: edge.label,
        condition: edge.data?.condition,
        data: {
          type: edge.type || 'SEQUENCE_FLOW',
          animated: edge.animated ?? false,
          pathType: edge.pathType || 'SMOOTHSTEP',
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          style: edge.style,
          ...(edge.data || {}),
        },
      },
    });
  }

  /**
   * Map database FlowNode to ReactFlow format
   */
  private mapFlowNodeToReactFlow(node: any) {
    const nodeData = (node.data as any) || {};
    const position = (node.position as any) || { x: 0, y: 0 };

    // Use originalType if available (for Qualigram nodes), otherwise use the DB type
    const reactFlowType = nodeData.originalType || node.type.toLowerCase();

    // Restore width and height at the top level for ReactFlow NodeResizer
    const reactFlowNode: any = {
      id: node.rfId,
      type: reactFlowType,
      position: {
        x: position.x || 0,
        y: position.y || 0,
      },
      data: {
        label: node.label,
        description: nodeData.description,
        procedureId: node.referencedEntityId,
        width: nodeData.width,
        height: nodeData.height,
        zIndex: nodeData.zIndex,
        parentNodeId: nodeData.parentNodeId,
        groupId: nodeData.groupId,
        sourcePosition: nodeData.sourcePosition,
        targetPosition: nodeData.targetPosition,
        isConnectable: nodeData.isConnectable ?? true,
        isDraggable: nodeData.isDraggable ?? true,
        isSelectable: nodeData.isSelectable ?? true,
        style: nodeData.style || {},
        ...nodeData,
      },
    };

    // Restore width and height at top level if they exist (for NodeResizer)
    if (nodeData.width !== undefined && nodeData.width !== null) {
      reactFlowNode.width = nodeData.width;
    }
    if (nodeData.height !== undefined && nodeData.height !== null) {
      reactFlowNode.height = nodeData.height;
    }

    // Restore parent-child relationship if parentNodeId exists
    if (nodeData.parentNodeId) {
      reactFlowNode.parentNode = nodeData.parentNodeId;
      reactFlowNode.extent = 'parent';
    }

    return reactFlowNode;
  }

  /**
   * Map database FlowEdge to ReactFlow format
   */
  private mapFlowEdgeToReactFlow(edge: any) {
    const edgeData = (edge.data as any) || {};

    return {
      id: edge.rfId,
      source: edge.sourceRfId,
      target: edge.targetRfId,
      type: edgeData.pathType?.toLowerCase() || 'smoothstep',
      label: edge.label,
      animated: edgeData.animated ?? false,
      style: edgeData.style || {},
      data: {
        condition: edge.condition,
        ...edgeData,
      },
    };
  }

  /**
   * Map node type string to FlowNodeType enum
   */
  private mapNodeTypeToFlowNodeType(nodeType: string): FlowNodeType {
    const upperType = nodeType.toUpperCase();

    if (Object.values(FlowNodeType).includes(upperType as FlowNodeType)) {
      return upperType as FlowNodeType;
    }

    const typeMap: Record<string, FlowNodeType> = {
      // Legacy types
      PROCEDURE_NODE: FlowNodeType.PROCEDURE,
      PROCEDURE: FlowNodeType.PROCEDURE,
      START_EVENT: FlowNodeType.START,
      END_EVENT: FlowNodeType.END,
      ACTIVITY: FlowNodeType.ACTION,
      DECISION: FlowNodeType.DECISION,
      SUBPROCESS: FlowNodeType.SUBFLOW,
      // BPMN types for Process level (level 2)
      STARTEVENT: FlowNodeType.START,
      ENDEVENT: FlowNodeType.END,
      TASK: FlowNodeType.ACTION,
      USERTASK: FlowNodeType.ACTION,
      SERVICETASK: FlowNodeType.ACTION,
      MANUALTASK: FlowNodeType.ACTION,
      SCRIPTTASK: FlowNodeType.ACTION,
      GATEWAY: FlowNodeType.DECISION,
      EXCLUSIVEGATEWAY: FlowNodeType.DECISION,
      PARALLELGATEWAY: FlowNodeType.DECISION,
      INCLUSIVEGATEWAY: FlowNodeType.DECISION,
      EVENTBASEDGATEWAY: FlowNodeType.DECISION,
      COMPLEXGATEWAY: FlowNodeType.DECISION,
      INTERMEDIATEEVENT: FlowNodeType.ACTION,
      TIMEREVENT: FlowNodeType.ACTION,
      MESSAGEEVENT: FlowNodeType.ACTION,
      ERROREVENT: FlowNodeType.ACTION,
      SIGNALEVENT: FlowNodeType.ACTION,
      CANCELEVENT: FlowNodeType.ACTION,
      ESCALATIONEVENT: FlowNodeType.ACTION,
      NOTIFICATIONEVENT: FlowNodeType.ACTION,
      // Text/Title node
      TEXT: FlowNodeType.ACTION,
    };

    return typeMap[upperType] || FlowNodeType.ACTION;
  }
}

