import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { SaveFlowDto, SaveNodeDto, SaveEdgeDto, UpdateFlowLayoutDto, FlowAction } from '../dto/save-flow.dto';
import { ProcessStatus, NodeStatus, EdgeStatus } from '@prisma/client';

/**
 * Flow Service
 * Handles saving and retrieving ReactFlow diagrams for processes
 */
@Injectable()
export class FlowService {
  private readonly logger = new Logger(FlowService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Save complete flow diagram (nodes + edges)
   * Simplified: Works with a single version per process
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

    // Get or create a single version for this process
    let version = await this.prisma.processVersion.findFirst({
      where: { processId: saveFlowDto.processId },
    });
    
    if (!version) {
      // Create initial version
      version = await this.prisma.processVersion.create({
        data: {
          processId: saveFlowDto.processId,
          version: 1,
          status: ProcessStatus.DRAFT,
          changesLog: saveFlowDto.changesLog || 'Initial flow creation',
        },
      });
    } else {
      // Update existing version with changes log
      if (saveFlowDto.changesLog) {
        await this.prisma.processVersion.update({
          where: { id: version.id },
          data: { changesLog: saveFlowDto.changesLog },
        });
      }
    }

    // Save in transaction to ensure consistency
    return await this.prisma.$transaction(async (tx) => {
      // Handle nodes based on action
      const existingNodes = await tx.node.findMany({ 
        where: { versionId: version.id },
        select: { id: true }
      });
      const existingNodeIds = new Set(existingNodes.map(n => n.id));

      // Process nodes by action
      const nodesToDelete = saveFlowDto.nodes.filter(n => n.action === FlowAction.DELETE);
      const nodesToAdd = saveFlowDto.nodes.filter(n => n.action === FlowAction.ADD || (!n.action && (!n.id || !existingNodeIds.has(n.id))));
      const nodesToUpdate = saveFlowDto.nodes.filter(n => n.action === FlowAction.EDIT || (!n.action && n.id && existingNodeIds.has(n.id)));

      // Delete nodes
      if (nodesToDelete.length > 0) {
        await tx.node.deleteMany({
          where: {
            versionId: version.id,
            id: { in: nodesToDelete.filter(n => n.id).map(n => n.id!) }
          }
        });
      }

      // Create new nodes - store temp ID mapping
      const nodeIdMapping: Record<string, string> = {}; // tempId -> realId
      const createdNodesWithMapping = await Promise.all(
        nodesToAdd.map(async (node) => {
          const created = await this.createNode(tx, version.id, node);
          if (node.id) {
            nodeIdMapping[node.id] = created.id; // Map temp ID to real ID
          }
          return created;
        })
      );

      // Update existing nodes
      const updatedNodes = await Promise.all(
        nodesToUpdate.map(node => this.updateNode(tx, version.id, node))
      );

      // Handle edges based on action
      const existingEdges = await tx.edge.findMany({ 
        where: { versionId: version.id },
        select: { id: true }
      });
      const existingEdgeIds = new Set(existingEdges.map(e => e.id));

      // Process edges by action
      const edgesToDelete = saveFlowDto.edges.filter(e => e.action === FlowAction.DELETE);
      const edgesToAdd = saveFlowDto.edges.filter(e => e.action === FlowAction.ADD || (!e.action && (!e.id || !existingEdgeIds.has(e.id))));
      const edgesToUpdate = saveFlowDto.edges.filter(e => e.action === FlowAction.EDIT || (!e.action && e.id && existingEdgeIds.has(e.id)));

      // Delete edges
      if (edgesToDelete.length > 0) {
        await tx.edge.deleteMany({
          where: {
            versionId: version.id,
            id: { in: edgesToDelete.filter(e => e.id).map(e => e.id!) }
          }
        });
      }

      // Create new edges - store temp ID mapping and update source/target references
      const edgeIdMapping: Record<string, string> = {}; // tempId -> realId
      const createdEdgesWithMapping = await Promise.all(
        edgesToAdd.map(async (edge) => {
          // Update source/target if they were remapped from temp node IDs
          const updatedEdge = {
            ...edge,
            source: nodeIdMapping[edge.source] || edge.source,
            target: nodeIdMapping[edge.target] || edge.target,
          };
          const created = await this.createEdge(tx, version.id, updatedEdge);
          if (edge.id) {
            edgeIdMapping[edge.id] = created.id; // Map temp ID to real ID
          }
          return created;
        })
      );

      // Update existing edges
      const updatedEdges = await Promise.all(
        edgesToUpdate.map(edge => this.updateEdge(tx, version.id, edge))
      );

      const allNodes = [...createdNodesWithMapping, ...updatedNodes];
      const allEdges = [...createdEdgesWithMapping, ...updatedEdges];

      this.logger.log(
        `Flow saved: ${allNodes.length} nodes (${createdNodesWithMapping.length} new, ${updatedNodes.length} updated, ${nodesToDelete.length} deleted), ` +
        `${allEdges.length} edges (${createdEdgesWithMapping.length} new, ${updatedEdges.length} updated, ${edgesToDelete.length} deleted)`
      );

      return {
        versionId: version.id,
        version: version.version,
        nodesCount: allNodes.length,
        edgesCount: allEdges.length,
        nodes: allNodes,
        edges: allEdges,
        nodeIdMapping, // Return mapping from temp IDs to real IDs
        edgeIdMapping, // Return mapping from temp IDs to real IDs
      };
    });
  }

  /**
   * Get flow diagram for a process
   * Simplified: Returns the single version for the process
   */
  async getFlow(processId: string, versionNumber?: number) {
    this.logger.log(`Getting flow for process: ${processId}`);

    const process = await this.prisma.process.findUnique({
      where: { id: processId },
    });

    if (!process) {
      throw new NotFoundException(`Process ${processId} not found`);
    }

    // Get the single version for this process
    const version = await this.prisma.processVersion.findFirst({
      where: { processId },
      include: { layout: true },
    });

    if (!version) {
      // Return empty flow if no version exists yet
      return {
        processId,
        versionId: null,
        version: 0,
        status: 'DRAFT',
        nodes: [],
        edges: [],
        layout: null,
      };
    }

    // Load nodes and edges
    const [nodes, edges] = await Promise.all([
      this.prisma.node.findMany({
        where: { versionId: version.id },
        orderBy: { zIndex: 'asc' },
      }),
      this.prisma.edge.findMany({
        where: { versionId: version.id },
      }),
    ]);

    return {
      processId,
      versionId: version.id,
      version: version.version,
      status: version.status,
      nodes: nodes.map(this.mapNodeToReactFlow),
      edges: edges.map(this.mapEdgeToReactFlow),
      layout: version.layout,
    };
  }

  /**
   * Update flow layout settings (zoom, viewport, grid)
   * Simplified: Works with the single version
   */
  async updateLayout(processId: string, layoutDto: UpdateFlowLayoutDto) {
    const version = await this.prisma.processVersion.findFirst({
      where: { processId },
    });

    if (!version) {
      throw new NotFoundException('No version found for this process');
    }

    const layout = await this.prisma.processLayout.upsert({
      where: { versionId: version.id },
      create: {
        versionId: version.id,
        ...layoutDto,
      },
      update: layoutDto,
    });

    return layout;
  }

  /**
   * Create a node in the database
   * Note: id is auto-generated by Prisma (cuid)
   */
  private async createNode(tx: any, versionId: string, node: SaveNodeDto) {
    return tx.node.create({
      data: {
        // id auto-generated by Prisma
        versionId,
        type: node.type,
        label: node.label,
        description: node.description,
        positionX: node.positionX,
        positionY: node.positionY,
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
        backgroundColor: node.style?.backgroundColor,
        borderColor: node.style?.borderColor,
        borderWidth: node.style?.borderWidth,
        borderRadius: node.style?.borderRadius,
        fontColor: node.style?.color,
        fontSize: node.style?.fontSize,
        fontWeight: node.style?.fontWeight,
        opacity: node.style?.opacity,
        style: node.style ? JSON.parse(JSON.stringify(node.style)) : null,
        data: node.data ? JSON.parse(JSON.stringify(node.data)) : null,
        status: NodeStatus.ACTIVE,
      },
    });
  }

  /**
   * Update an existing node in the database
   */
  private async updateNode(tx: any, versionId: string, node: SaveNodeDto) {
    return tx.node.update({
      where: { id: node.id },
      data: {
        type: node.type,
        label: node.label,
        description: node.description,
        positionX: node.positionX,
        positionY: node.positionY,
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
        backgroundColor: node.style?.backgroundColor,
        borderColor: node.style?.borderColor,
        borderWidth: node.style?.borderWidth,
        borderRadius: node.style?.borderRadius,
        fontColor: node.style?.color,
        fontSize: node.style?.fontSize,
        fontWeight: node.style?.fontWeight,
        opacity: node.style?.opacity,
        style: node.style ? JSON.parse(JSON.stringify(node.style)) : null,
        data: node.data ? JSON.parse(JSON.stringify(node.data)) : null,
      },
    });
  }

  /**
   * Create an edge in the database
   * Note: id is auto-generated by Prisma (cuid)
   */
  private async createEdge(tx: any, versionId: string, edge: SaveEdgeDto) {
    return tx.edge.create({
      data: {
        // id auto-generated by Prisma
        versionId,
        fromId: edge.source,
        toId: edge.target,
        type: edge.type || 'SEQUENCE_FLOW',
        label: edge.label,
        animated: edge.animated ?? false,
        pathType: edge.pathType || 'SMOOTH_STEP',
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        strokeColor: edge.style?.strokeColor,
        strokeWidth: edge.style?.strokeWidth,
        strokeDasharray: edge.style?.strokeDasharray,
        style: edge.style ? JSON.parse(JSON.stringify(edge.style)) : null,
        metadata: edge.data ? JSON.parse(JSON.stringify(edge.data)) : null,
        status: EdgeStatus.ACTIVE,
      },
    });
  }

  /**
   * Update an existing edge in the database
   */
  private async updateEdge(tx: any, versionId: string, edge: SaveEdgeDto) {
    return tx.edge.update({
      where: { id: edge.id },
      data: {
        fromId: edge.source,
        toId: edge.target,
        type: edge.type || 'SEQUENCE_FLOW',
        label: edge.label,
        animated: edge.animated ?? false,
        pathType: edge.pathType || 'SMOOTH_STEP',
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        strokeColor: edge.style?.strokeColor,
        strokeWidth: edge.style?.strokeWidth,
        strokeDasharray: edge.style?.strokeDasharray,
        style: edge.style ? JSON.parse(JSON.stringify(edge.style)) : null,
        metadata: edge.data ? JSON.parse(JSON.stringify(edge.data)) : null,
      },
    });
  }

  /**
   * Map database node to ReactFlow format
   */
  private mapNodeToReactFlow(node: any) {
    return {
      id: node.id,
      type: node.type.toLowerCase(),
      position: { x: node.positionX, y: node.positionY },
      data: {
        label: node.label,
        description: node.description,
        style: {
          backgroundColor: node.backgroundColor,
          borderColor: node.borderColor,
          borderWidth: node.borderWidth,
          borderRadius: node.borderRadius,
          color: node.fontColor,
          fontSize: node.fontSize,
          fontWeight: node.fontWeight,
          opacity: node.opacity,
          ...((node.style as any) || {}),
        },
        ...((node.data as any) || {}),
      },
      style: {
        width: node.width,
        height: node.height,
        zIndex: node.zIndex,
      },
      parentNode: node.parentNodeId,
      extent: node.parentNodeId ? 'parent' : undefined,
      draggable: node.isDraggable,
      selectable: node.isSelectable,
      connectable: node.isConnectable,
    };
  }

  /**
   * Map database edge to ReactFlow format
   */
  private mapEdgeToReactFlow(edge: any) {
    return {
      id: edge.id,
      source: edge.fromId,
      target: edge.toId,
      type: edge.pathType?.toLowerCase() || 'smoothstep',
      label: edge.label,
      animated: edge.animated,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      style: {
        stroke: edge.strokeColor || '#b1b1b7',
        strokeWidth: edge.strokeWidth || 1.5,
        strokeDasharray: edge.strokeDasharray,
        ...((edge.style as any) || {}),
      },
      data: (edge.metadata as any) || {},
    };
  }
}
