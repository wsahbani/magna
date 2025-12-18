import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { SaveNodeDto, SaveEdgeDto } from '../../process/dto/save-flow.dto';
import { SaveProcedureFlowDto } from '../dto/save-procedure-flow.dto';
import { FlowNodeType } from '@prisma/client';

/**
 * Procedure Flow Service
 * Handles saving and retrieving ReactFlow diagrams for Procedure (level 3)
 * Level 3 supports all BPMN elements (Start/End Events, Tasks, Gateways, etc.)
 */
@Injectable()
export class ProcedureFlowService {
  private readonly logger = new Logger(ProcedureFlowService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Get flow diagram for a Procedure (level 3)
   */
  async getFlow(procedureId: string) {
    this.logger.log(`Getting flow for Procedure: ${procedureId}`);

    const procedure = await this.prisma.procedure.findUnique({
      where: { id: procedureId },
    });

    if (!procedure) {
      throw new NotFoundException(`Procedure ${procedureId} not found`);
    }

    // Get FlowDiagram for this Procedure (level 3)
    const flowDiagram = await this.prisma.flowDiagram.findFirst({
      where: {
        procedureId: procedureId,
        level: 3,
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    if (!flowDiagram) {
      // Return empty flow if no diagram exists yet
      return {
        procedureId,
        diagramId: null,
        nodes: [],
        edges: [],
        flowDirection: 'HORIZONTAL' as const,
      };
    }
    
    return {
      procedureId,
      diagramId: flowDiagram.id,
      nodes: flowDiagram.nodes.map(this.mapFlowNodeToReactFlow),
      edges: flowDiagram.edges.map(this.mapFlowEdgeToReactFlow),
      flowDirection: flowDiagram.flowDirection,
    };
  }

  /**
   * Save flow diagram for Procedure (level 3)
   * Level 3 supports all BPMN elements
   */
  async saveFlow(saveFlowDto: SaveProcedureFlowDto, userId: string) {
    this.logger.log(`Saving flow for Procedure: ${saveFlowDto.procedureId}`);

    if (!saveFlowDto.procedureId) {
      throw new NotFoundException('procedureId is required');
    }

    const procedure = await this.prisma.procedure.findUnique({
      where: { id: saveFlowDto.procedureId },
      select: {
        id: true,
        code: true,
        workspaceId: true,
        departmentId: true,
        createdById: true,
      },
    });

    if (!procedure) {
      throw new NotFoundException(`Procedure ${saveFlowDto.procedureId} not found`);
    }

    // Get or create FlowDiagram for this Procedure (level 3)
    let flowDiagram = await this.prisma.flowDiagram.findFirst({
      where: {
        procedureId: saveFlowDto.procedureId,
        level: 3,
      },
    });

    if (!flowDiagram) {
      flowDiagram = await this.prisma.flowDiagram.create({
        data: {
          level: 3,
          processId: saveFlowDto.procedureId, // Generic field for unique constraint
          procedureId: saveFlowDto.procedureId, // Specific relation to Procedure
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
          await this.createFlowNode(
            tx,
            flowDiagram.id,
            node,
            node.id,
          );
        }
      }

      // Process edges: create/update
      for (const edge of saveFlowDto.edges) {
        const existingEdge = existingEdges.find((e) => e.rfId === edge.id);

        if (existingEdge) {
          // Update existing edge
          await this.updateFlowEdge(tx, existingEdge.id, edge);
        } else {
          // Create new edge
          await this.createFlowEdge(
            tx,
            flowDiagram.id,
            edge,
            edge.id,
          );
        }
      }

      this.logger.log(
        `Flow saved: ${saveFlowDto.nodes.length} nodes, ${saveFlowDto.edges.length} edges`,
      );

      return {
        diagramId: flowDiagram.id,
        message: 'Flow diagram saved successfully',
      };
    });
  }

  /**
   * Create a FlowNode in the database
   */
  private async createFlowNode(
    tx: any,
    diagramId: string,
    node: SaveNodeDto,
    rfId: string,
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
        data: {
          originalType: node.type, // Store original node type for ReactFlow mapping
          description: node.description,
          width: node.width,
          height: node.height,
          zIndex: node.zIndex,
          // parentNodeId should come from node.parentId (same level as data, type, position)
          // Use parentId first, then fallback to parentNodeId for backward compatibility
          parentNodeId: node.parentId || node.parentNodeId || node.data?.parentNodeId,
          groupId: node.groupId,
          sourcePosition: node.sourcePosition,
          targetPosition: node.targetPosition,
          isConnectable: node.isConnectable ?? true,
          isDraggable: node.isDraggable ?? true,
          isSelectable: node.isSelectable ?? true,
          style: node.style,
          // Swimlane specific properties
          orientation: node.data?.orientation,
          order: node.data?.order,
          collapsed: node.data?.collapsed,
          poolId: node.data?.poolId,
          laneId: node.data?.laneId,
          color: node.data?.color,
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

    return tx.flowNode.update({
      where: { id: nodeId },
      data: {
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
          // parentNodeId should come from node.parentId (same level as data, type, position)
          parentNodeId: node.parentId || (node.data?.parentNodeId ?? existingData.parentNodeId),
          groupId: node.groupId,
          sourcePosition: node.sourcePosition,
          targetPosition: node.targetPosition,
          isConnectable: node.isConnectable ?? true,
          isDraggable: node.isDraggable ?? true,
          isSelectable: node.isSelectable ?? true,
          style: node.style,
          // Swimlane specific properties (preserve existing or use new)
          orientation: node.data?.orientation ?? existingData.orientation,
          order: node.data?.order ?? existingData.order,
          collapsed: node.data?.collapsed ?? existingData.collapsed,
          poolId: node.data?.poolId ?? existingData.poolId,
          laneId: node.data?.laneId ?? existingData.laneId,
          color: node.data?.color ?? existingData.color,
          ...(node.data || {}),
        },
      },
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

    // Use originalType if available (for BPMN nodes), otherwise use the DB type
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
    // parentId and extent should be at the same level as data, type, position
    if (nodeData.parentNodeId) {
      reactFlowNode.parentId = nodeData.parentNodeId;
      reactFlowNode.extent = 'parent';
      // Also set parentNode for ReactFlow compatibility
      reactFlowNode.parentNode = nodeData.parentNodeId;
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
   * Level 3 supports all BPMN elements
   */
  private mapNodeTypeToFlowNodeType(nodeType: string): FlowNodeType {
    const upperType = nodeType.toUpperCase();

    if (Object.values(FlowNodeType).includes(upperType as FlowNodeType)) {
      return upperType as FlowNodeType;
    }

    const typeMap: Record<string, FlowNodeType> = {
      // BPMN Start Events
      STARTEVENT: FlowNodeType.START,
      START_EVENT: FlowNodeType.START,
      START: FlowNodeType.START,
      
      // BPMN End Events
      ENDEVENT: FlowNodeType.END,
      END_EVENT: FlowNodeType.END,
      END: FlowNodeType.END,
      
      // BPMN Tasks
      TASK: FlowNodeType.ACTION,
      USERTASK: FlowNodeType.ACTION,
      USER_TASK: FlowNodeType.ACTION,
      SERVICETASK: FlowNodeType.ACTION,
      SERVICE_TASK: FlowNodeType.ACTION,
      MANUALTASK: FlowNodeType.ACTION,
      MANUAL_TASK: FlowNodeType.ACTION,
      SCRIPTTASK: FlowNodeType.ACTION,
      SCRIPT_TASK: FlowNodeType.ACTION,
      BUSINESSRULETASK: FlowNodeType.ACTION,
      BUSINESS_RULE_TASK: FlowNodeType.ACTION,
      RECEIVETASK: FlowNodeType.ACTION,
      RECEIVE_TASK: FlowNodeType.ACTION,
      SENDTASK: FlowNodeType.ACTION,
      SEND_TASK: FlowNodeType.ACTION,
      
      // BPMN Gateways
      GATEWAY: FlowNodeType.DECISION,
      EXCLUSIVEGATEWAY: FlowNodeType.DECISION,
      EXCLUSIVE_GATEWAY: FlowNodeType.DECISION,
      PARALLELGATEWAY: FlowNodeType.DECISION,
      PARALLEL_GATEWAY: FlowNodeType.DECISION,
      INCLUSIVEGATEWAY: FlowNodeType.DECISION,
      INCLUSIVE_GATEWAY: FlowNodeType.DECISION,
      EVENTBASEDGATEWAY: FlowNodeType.DECISION,
      EVENT_BASED_GATEWAY: FlowNodeType.DECISION,
      COMPLEXGATEWAY: FlowNodeType.DECISION,
      COMPLEX_GATEWAY: FlowNodeType.DECISION,
      
      // BPMN Intermediate Events
      INTERMEDIATEEVENT: FlowNodeType.ACTION,
      INTERMEDIATE_EVENT: FlowNodeType.ACTION,
      TIMEREVENT: FlowNodeType.ACTION,
      TIME_EVENT: FlowNodeType.ACTION,
      MESSAGEEVENT: FlowNodeType.ACTION,
      MESSAGE_EVENT: FlowNodeType.ACTION,
      ERROREVENT: FlowNodeType.ACTION,
      ERROR_EVENT: FlowNodeType.ACTION,
      SIGNALEVENT: FlowNodeType.ACTION,
      SIGNAL_EVENT: FlowNodeType.ACTION,
      CANCELEVENT: FlowNodeType.ACTION,
      CANCEL_EVENT: FlowNodeType.ACTION,
      ESCALATIONEVENT: FlowNodeType.ACTION,
      ESCALATION_EVENT: FlowNodeType.ACTION,
      NOTIFICATIONEVENT: FlowNodeType.ACTION,
      NOTIFICATION_EVENT: FlowNodeType.ACTION,
      COMPENSATIONEVENT: FlowNodeType.ACTION,
      COMPENSATION_EVENT: FlowNodeType.ACTION,
      
      // Legacy types
      ACTIVITY: FlowNodeType.ACTION,
      DECISION: FlowNodeType.DECISION,
      SUBPROCESS: FlowNodeType.SUBFLOW,
      
      // Swimlanes (BPMN)
      POOL: FlowNodeType.SUBFLOW, // Pool is a container, use SUBFLOW type
      LANE: FlowNodeType.SUBFLOW, // Lane is also a container, use SUBFLOW type
      
      // Text/Title node
      TEXT: FlowNodeType.ACTION,
    };

    return typeMap[upperType] || FlowNodeType.ACTION;
  }
}

