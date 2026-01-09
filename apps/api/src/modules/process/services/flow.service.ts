import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { SaveFlowDto, SaveNodeDto, SaveEdgeDto, UpdateFlowLayoutDto, FlowAction } from '../dto/save-flow.dto';
import { FlowNodeType } from '@prisma/client';

/**
 * Flow Service
 * Handles saving and retrieving ReactFlow diagrams for processes (level 2)
 * Uses FlowDiagram, FlowNode, and FlowEdge models
 */
@Injectable()
export class FlowService {
  private readonly logger = new Logger(FlowService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Save complete flow diagram (nodes + edges)
   * Works with FlowDiagram for Process (level 2)
   */
  async saveFlow(saveFlowDto: SaveFlowDto, userId: string) {
    this.logger.log(`Saving flow for process: ${saveFlowDto.processId}`);

    // Verify process exists
    const process = await this.prisma.process.findUnique({
      where: { id: saveFlowDto.processId },
    });

    if (!process) {
      throw new NotFoundException(`Process ${saveFlowDto.processId} not found`);
    }

    // Get or create FlowDiagram for this process (level 2)
    let flowDiagram = await this.prisma.flowDiagram.findFirst({
      where: {
        processId_ref: saveFlowDto.processId,
        level: 2,
      },
    });

    if (!flowDiagram) {
      // Create FlowDiagram if it doesn't exist
      flowDiagram = await this.prisma.flowDiagram.create({
        data: {
          level: 2,
          processId: saveFlowDto.processId,
          processId_ref: saveFlowDto.processId,
        },
      });
    }

    // Save in transaction to ensure consistency
    return await this.prisma.$transaction(async (tx) => {
      // Handle nodes based on action
      const existingNodes = await tx.flowNode.findMany({
        where: { diagramId: flowDiagram.id },
        select: { rfId: true, id: true },
      });
      const existingRfIds = new Set(existingNodes.map((n) => n.rfId));
      const rfIdToDbId = new Map(existingNodes.map((n) => [n.rfId, n.id]));

      // Process nodes by action
      const nodesToDelete = saveFlowDto.nodes.filter(
        (n) => n.action === FlowAction.DELETE,
      );
      const nodesToAdd = saveFlowDto.nodes.filter(
        (n) =>
          n.action === FlowAction.ADD ||
          (!n.action && (!n.id || !existingRfIds.has(n.id))),
      );
      const nodesToUpdate = saveFlowDto.nodes.filter(
        (n) =>
          n.action === FlowAction.EDIT ||
          (!n.action && n.id && existingRfIds.has(n.id)),
      );

      // Delete nodes
      if (nodesToDelete.length > 0) {
        const rfIdsToDelete = nodesToDelete
          .filter((n) => n.id)
          .map((n) => n.id!);
        await tx.flowNode.deleteMany({
          where: {
            diagramId: flowDiagram.id,
            rfId: { in: rfIdsToDelete },
          },
        });
      }

      // Create new nodes - store rfId mapping
      const nodeRfIdMapping: Record<string, string> = {}; // tempRfId -> realRfId
      const createdNodesWithMapping = await Promise.all(
        nodesToAdd.map(async (node) => {
          const rfId = node.id || `node-${Date.now()}-${Math.random()}`;
          const created = await this.createFlowNode(tx, flowDiagram.id, node, rfId);
          if (node.id && node.id !== rfId) {
            nodeRfIdMapping[node.id] = created.rfId; // Map temp rfId to real rfId
          }
          return created;
        }),
      );

      // Update existing nodes
      const updatedNodes = await Promise.all(
        nodesToUpdate.map((node) => {
          const dbId = rfIdToDbId.get(node.id!);
          if (!dbId) {
            throw new NotFoundException(`Node with rfId "${node.id}" not found`);
          }
          return this.updateFlowNode(tx, dbId, node);
        }),
      );

      // Handle edges based on action
      const existingEdges = await tx.flowEdge.findMany({
        where: { diagramId: flowDiagram.id },
        select: { rfId: true, id: true },
      });
      const existingEdgeRfIds = new Set(existingEdges.map((e) => e.rfId));
      const edgeRfIdToDbId = new Map(existingEdges.map((e) => [e.rfId, e.id]));

      // Process edges by action
      const edgesToDelete = saveFlowDto.edges.filter(
        (e) => e.action === FlowAction.DELETE,
      );
      const edgesToAdd = saveFlowDto.edges.filter(
        (e) =>
          e.action === FlowAction.ADD ||
          (!e.action && (!e.id || !existingEdgeRfIds.has(e.id))),
      );
      const edgesToUpdate = saveFlowDto.edges.filter(
        (e) => 
          e.action === FlowAction.EDIT ||
          (!e.action && e.id && existingEdgeRfIds.has(e.id)),
      );

      // Delete edges
      if (edgesToDelete.length > 0) {
        const rfIdsToDelete = edgesToDelete
          .filter((e) => e.id)
          .map((e) => e.id!);
        await tx.flowEdge.deleteMany({
          where: {
            diagramId: flowDiagram.id,
            rfId: { in: rfIdsToDelete },
          },
        });
      }

      // Create new edges - update source/target rfIds if they were remapped
      const createdEdgesWithMapping = await Promise.all(
        edgesToAdd.map(async (edge) => {
          const rfId = edge.id || `edge-${Date.now()}-${Math.random()}`;
          // Update source/target if they were remapped from temp node rfIds
          const updatedEdge = {
            ...edge,
            source: nodeRfIdMapping[edge.source] || edge.source,
            target: nodeRfIdMapping[edge.target] || edge.target,
          };
          return await this.createFlowEdge(tx, flowDiagram.id, updatedEdge, rfId);
        }),
      );

      // Update existing edges
      const updatedEdges = await Promise.all(
        edgesToUpdate.map((edge) => {
          const dbId = edgeRfIdToDbId.get(edge.id!);
          if (!dbId) {
            throw new NotFoundException(`Edge with rfId "${edge.id}" not found`);
          }
          // Update source/target if they were remapped
          const updatedEdge = {
            ...edge,
            source: nodeRfIdMapping[edge.source] || edge.source,
            target: nodeRfIdMapping[edge.target] || edge.target,
          };
          return this.updateFlowEdge(tx, dbId, updatedEdge);
        }),
      );

      const allNodes = [...createdNodesWithMapping, ...updatedNodes];
      const allEdges = [...createdEdgesWithMapping, ...updatedEdges];

      this.logger.log(
        `Flow saved: ${allNodes.length} nodes (${createdNodesWithMapping.length} new, ${updatedNodes.length} updated, ${nodesToDelete.length} deleted), ` +
          `${allEdges.length} edges (${createdEdgesWithMapping.length} new, ${updatedEdges.length} updated, ${edgesToDelete.length} deleted)`,
      );

      return {
        diagramId: flowDiagram.id,
        processId: saveFlowDto.processId,
        nodesCount: allNodes.length,
        edgesCount: allEdges.length,
        nodes: allNodes.map(this.mapFlowNodeToReactFlow),
        edges: allEdges.map(this.mapFlowEdgeToReactFlow),
        nodeRfIdMapping, // Return mapping from temp rfIds to real rfIds
        edgeRfIdMapping: {}, // Return mapping from temp rfIds to real rfIds (if needed)
      };
    });
  }

  /**
   * Get flow diagram for a process (level 2)
   */
  async getFlow(processId: string) {
    this.logger.log(`Getting flow for process: ${processId}`);

    const process = await this.prisma.process.findUnique({
      where: { id: processId },
    });

    if (!process) {
      throw new NotFoundException(`Process ${processId} not found`);
    }

    // Get FlowDiagram for this process (level 2)
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
      };
    }

    return {
      processId,
      diagramId: flowDiagram.id,
      nodes: flowDiagram.nodes.map(this.mapFlowNodeToReactFlow),
      edges: flowDiagram.edges.map(this.mapFlowEdgeToReactFlow),
    };
  }

  /**
   * Update flow layout settings (zoom, viewport, grid)
   * Stores layout in FlowDiagram.snapshot
   */
  async updateLayout(processId: string, layoutDto: UpdateFlowLayoutDto) {
    const flowDiagram = await this.prisma.flowDiagram.findFirst({
      where: {
        processId_ref: processId,
        level: 2,
      },
    });

    if (!flowDiagram) {
      throw new NotFoundException('No flow diagram found for this process');
    }

    // Update snapshot with layout data
    const updatedDiagram = await this.prisma.flowDiagram.update({
      where: { id: flowDiagram.id },
      data: {
        snapshot: {
          ...((flowDiagram.snapshot as any) || {}),
          layout: layoutDto,
        },
      },
    });

    return updatedDiagram.snapshot;
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
    // Map node type to FlowNodeType enum
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
          description: node.description,
          width: node.width,
          height: node.height,
          zIndex: node.zIndex,
          parentNodeId: node.parentNodeId,
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

    // Handle linkedProcessId changes - update referencedEntityId if linkedProcessId is present
    const updateData: any = {
      type: flowNodeType,
      label: node.label,
      position: {
        x: node.positionX,
        y: node.positionY,
      },
      data: {
        description: node.description,
        width: node.width,
        height: node.height,
        zIndex: node.zIndex,
        parentNodeId: node.parentNodeId,
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
        sourceRfId: edge.source, // Use rfId of source node
        targetRfId: edge.target, // Use rfId of target node
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
        sourceRfId: edge.source, // Use rfId of source node
        targetRfId: edge.target, // Use rfId of target node
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

    return {
      id: node.rfId, // Use rfId as ReactFlow node ID
      type: node.type.toLowerCase(),
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
  }

  /**
   * Map database FlowEdge to ReactFlow format
   */
  private mapFlowEdgeToReactFlow(edge: any) {
    const edgeData = (edge.data as any) || {};

    return {
      id: edge.rfId, // Use rfId as ReactFlow edge ID
      source: edge.sourceRfId, // Use rfId of source node
      target: edge.targetRfId, // Use rfId of target node
      type: edgeData.pathType?.toLowerCase() || 'smoothstep',
      label: edge.label,
      animated: edgeData.animated || false,
      sourceHandle: edgeData.sourceHandle,
      targetHandle: edgeData.targetHandle,
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
    
    // Direct mapping for FlowNodeType enum values
    if (Object.values(FlowNodeType).includes(upperType as FlowNodeType)) {
      return upperType as FlowNodeType;
    }

    // Fallback mappings for common node types
    const typeMap: Record<string, FlowNodeType> = {
      START_EVENT: FlowNodeType.START,
      END_EVENT: FlowNodeType.END,
      TASK: FlowNodeType.ACTION,
      USER_TASK: FlowNodeType.ACTION,
      SERVICE_TASK: FlowNodeType.ACTION,
      EXCLUSIVE_GATEWAY: FlowNodeType.DECISION,
      INCLUSIVE_GATEWAY: FlowNodeType.DECISION,
      PARALLEL_GATEWAY: FlowNodeType.DECISION,
      SUBPROCESS: FlowNodeType.SUBFLOW,
      CALL_ACTIVITY: FlowNodeType.SUBFLOW,
    };

    return typeMap[upperType] || FlowNodeType.ACTION;
  }
}
