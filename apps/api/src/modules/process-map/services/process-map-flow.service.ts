import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { SaveNodeDto, SaveEdgeDto, FlowAction } from '../../process/dto/save-flow.dto';
import { SaveProcessMapFlowDto } from '../dto/save-process-map-flow.dto';
import { FlowNodeType, ProcessType } from '@prisma/client';
import { ProcessService } from '../../process/services/process.service';
import { DiagramService } from '../../procedure/services/diagram.service';

/**
 * ProcessMap Flow Service
 * Handles saving and retrieving ReactFlow diagrams for ProcessMap (level 1)
 * Automatically creates Process entities when PROCESS_NODE is dropped
 */
@Injectable()
export class ProcessMapFlowService {
  private readonly logger = new Logger(ProcessMapFlowService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly processService: ProcessService,
    private readonly diagramService: DiagramService,
  ) {}

  /**
   * Get flow diagram for a ProcessMap (level 1)
   */
  async getFlow(processMapId: string) {
    this.logger.log(`Getting flow for ProcessMap: ${processMapId}`);

    const processMap = await this.prisma.processMap.findUnique({
      where: { id: processMapId },
    });

    if (!processMap) {
      throw new NotFoundException(`ProcessMap ${processMapId} not found`);
    }

    // Get FlowDiagram for this ProcessMap (level 1)
    const flowDiagram = await this.prisma.flowDiagram.findFirst({
      where: {
        processMapId,
        level: 1,
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    if (!flowDiagram) {
      // Return empty flow if no diagram exists yet
      return {
        processMapId,
        diagramId: null,
        nodes: [],
        edges: [],
        flowDirection: 'HORIZONTAL' as const,
      };
    }
    
    // Get all referenced Process IDs to enrich nodes with Process information
    const referencedProcessIds = flowDiagram.nodes
      .filter((node) => node.referencedEntityId && node.entityType === 'PROCESS')
      .map((node) => node.referencedEntityId!)
      .filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates
    
    // Fetch all referenced Processes in one query
    const referencedProcesses = referencedProcessIds.length > 0
      ? await this.prisma.process.findMany({
          where: { id: { in: referencedProcessIds } },
          select: { id: true, type: true },
        })
      : [];
    
    // Create a map for quick lookup
    const processTypeMap = new Map(
      referencedProcesses.map((p) => [p.id, p.type])
    );
    
    // Map all nodes first to get their rfIds for parent validation
    const allReactFlowNodes = flowDiagram.nodes.map((node) => {
      const reactFlowNode = this.mapFlowNodeToReactFlow(node);
      
      // Enrich with Process information if referencedEntityId exists
      if (node.referencedEntityId && node.entityType === 'PROCESS') {
        const processType = processTypeMap.get(node.referencedEntityId);
        if (processType) {
          reactFlowNode.data = {
            ...reactFlowNode.data,
            linkedProcessId: node.referencedEntityId,
            linkedProcessType: 'process',
            linkedProcessFlowType: processType === ProcessType.SIPOC ? 'SIPOC' : 'FLOW',
          };
        }
      }
      
      return reactFlowNode;
    });
    const nodeRfIdSet = new Set(allReactFlowNodes.map((n) => n.id));
    
    // Validate and clean up parent relationships
    const validatedNodes = allReactFlowNodes.map((node) => {
      const parentId = (node as any).parentId || (node as any).parentNode;
      if (parentId) {
        // Check if parent exists in the flow
        if (!nodeRfIdSet.has(parentId)) {
          this.logger.warn(
            `Node ${node.id} has parent ${parentId} that does not exist. Removing parent relationship.`,
          );
          // Remove invalid parent reference
          const nodeData = node.data || {};
          delete nodeData.parentNodeId;
          return {
            ...node,
            parentId: undefined,
            parentNode: undefined,
            extent: undefined,
            data: nodeData,
          };
        }
        
        // Verify parent is a group node
        const parentNode = allReactFlowNodes.find((n) => n.id === parentId);
        if (parentNode && parentNode.type !== 'domainGroup') {
          this.logger.warn(
            `Node ${node.id} has parent ${parentId} that is not a domainGroup. Removing parent relationship.`,
          );
          const nodeData = node.data || {};
          delete nodeData.parentNodeId;
          return {
            ...node,
            parentId: undefined,
            parentNode: undefined,
            extent: undefined,
            data: nodeData,
          };
        }
      }
      return node;
    });
    
    return {
      processMapId,
      diagramId: flowDiagram.id,
      nodes: validatedNodes,
      edges: flowDiagram.edges.map(this.mapFlowEdgeToReactFlow),
      flowDirection: flowDiagram.flowDirection,
    };
  }

  /**
   * Save flow diagram for ProcessMap (level 1)
   * Automatically creates Process entities when PROCESS_NODE is dropped
   */
  async saveFlow(saveFlowDto: SaveProcessMapFlowDto, userId: string) {
    this.logger.log(`Saving flow for ProcessMap: ${saveFlowDto.processMapId}`);

    if (!saveFlowDto.processMapId) {
      throw new NotFoundException('processMapId is required');
    }

    const processMap = await this.prisma.processMap.findUnique({
      where: { id: saveFlowDto.processMapId },
    });

    if (!processMap) {
      throw new NotFoundException(`ProcessMap ${saveFlowDto.processMapId} not found`);
    }

    // Get or create FlowDiagram for this ProcessMap (level 1)
    let flowDiagram = await this.prisma.flowDiagram.findFirst({
      where: {
        processMapId: saveFlowDto.processMapId,
        level: 1,
      },
    });

    if (!flowDiagram) {
      flowDiagram = await this.prisma.flowDiagram.create({
        data: {
          level: 1,
          processId: saveFlowDto.processMapId,
          processMapId: saveFlowDto.processMapId,
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

    // Save in transaction to ensure consistency
    // Increase timeout to 30 seconds for large operations (e.g., image extraction with many nodes)
    return await this.prisma.$transaction(
      async (tx) => {
      // Get all existing nodes and edges from database
      const existingNodes = await tx.flowNode.findMany({
        where: { diagramId: flowDiagram.id },
        select: { rfId: true, id: true },
      });
      const existingEdges = await tx.flowEdge.findMany({
        where: { diagramId: flowDiagram.id },
        select: { rfId: true, id: true },
      });

      // Create maps for quick lookup
      const existingRfIds = new Set(existingNodes.map((n) => n.rfId));
      const rfIdToDbId = new Map(existingNodes.map((n) => [n.rfId, n.id]));
      const existingEdgeRfIds = new Set(existingEdges.map((e) => e.rfId));
      const edgeRfIdToDbId = new Map(existingEdges.map((e) => [e.rfId, e.id]));

      // Get rfIds from incoming nodes and edges
      const incomingNodeRfIds = new Set(
        saveFlowDto.nodes.filter((n) => n.id).map((n) => n.id!),
      );
      const incomingEdgeRfIds = new Set(
        saveFlowDto.edges.filter((e) => e.id).map((e) => e.id!),
      );

      // Detect nodes to delete: present in DB but not in incoming data
      // OR explicitly marked with DELETE action
      const nodesToDeleteRfIds = new Set<string>();
      
      // Add nodes explicitly marked for deletion
      saveFlowDto.nodes
        .filter((n) => n.action === FlowAction.DELETE && n.id)
        .forEach((n) => nodesToDeleteRfIds.add(n.id!));
      
      // Add nodes that exist in DB but are not in incoming data (implicit deletion)
      existingNodes.forEach((node) => {
        if (!incomingNodeRfIds.has(node.rfId)) {
          nodesToDeleteRfIds.add(node.rfId);
        }
      });

      // Detect edges to delete: present in DB but not in incoming data
      // OR explicitly marked with DELETE action
      const edgesToDeleteRfIds = new Set<string>();
      
      // Add edges explicitly marked for deletion
      saveFlowDto.edges
        .filter((e) => e.action === FlowAction.DELETE && e.id)
        .forEach((e) => edgesToDeleteRfIds.add(e.id!));
      
      // Add edges that exist in DB but are not in incoming data (implicit deletion)
      existingEdges.forEach((edge) => {
        if (!incomingEdgeRfIds.has(edge.rfId)) {
          edgesToDeleteRfIds.add(edge.rfId);
        }
      });

      // Delete nodes that are no longer in the flow
      if (nodesToDeleteRfIds.size > 0) {
        await tx.flowNode.deleteMany({
          where: {
            diagramId: flowDiagram.id,
            rfId: { in: Array.from(nodesToDeleteRfIds) },
          },
        });
        this.logger.log(`Deleted ${nodesToDeleteRfIds.size} nodes from flow`);
      }

      // Delete edges that are no longer in the flow
      if (edgesToDeleteRfIds.size > 0) {
        await tx.flowEdge.deleteMany({
          where: {
            diagramId: flowDiagram.id,
            rfId: { in: Array.from(edgesToDeleteRfIds) },
          },
        });
        this.logger.log(`Deleted ${edgesToDeleteRfIds.size} edges from flow`);
      }

      // Filter out deleted nodes/edges from processing
      const nodesToProcess = saveFlowDto.nodes.filter(
        (n) => !n.id || !nodesToDeleteRfIds.has(n.id),
      );
      const edgesToProcess = saveFlowDto.edges.filter(
        (e) => !e.id || !edgesToDeleteRfIds.has(e.id),
      );

      // Create a map of all node rfIds (existing + new) for parent validation
      const allNodeRfIds = new Set<string>();
      existingNodes.forEach((n) => allNodeRfIds.add(n.rfId));
      nodesToProcess.forEach((n) => {
        if (n.id) allNodeRfIds.add(n.id);
      });

      // Validate parent relationships: ensure parent exists and is a valid group
      nodesToProcess.forEach((node) => {
        const parentId = node.parentId || node.data?.parentNodeId;
        if (parentId) {
          // Check if parent exists in the flow
          if (!allNodeRfIds.has(parentId)) {
            this.logger.warn(
              `Node ${node.id} has parent ${parentId} that does not exist in the flow. Removing parent relationship.`,
            );
            // Remove invalid parent reference
            node.parentId = undefined;
            if (node.data) {
              node.data.parentNodeId = undefined;
            }
          } else {
            // Verify parent is a group node (domainGroup)
            const parentNode = saveFlowDto.nodes.find((n) => n.id === parentId);
            if (parentNode && parentNode.type !== 'domainGroup') {
              this.logger.warn(
                `Node ${node.id} has parent ${parentId} that is not a domainGroup. Removing parent relationship.`,
              );
              // Remove invalid parent reference
              node.parentId = undefined;
              if (node.data) {
                node.data.parentNodeId = undefined;
              }
            }
          }
        }
      });

      // Process nodes by action (excluding deleted ones)
      const nodesToAdd = nodesToProcess.filter(
        (n) =>
          n.action === FlowAction.ADD ||
          (!n.action && (!n.id || !existingRfIds.has(n.id))),
      );
      const nodesToUpdate = nodesToProcess.filter(
        (n) =>
          n.action === FlowAction.EDIT ||
          (!n.action && n.id && existingRfIds.has(n.id) && !nodesToDeleteRfIds.has(n.id)),
      );

      // Create new nodes - auto-create Process if PROCESS_NODE
      const nodeRfIdMapping: Record<string, string> = {};
      // Utiliser un compteur pour générer des codes uniques pour les Process
      let processCounter = 0;
      const baseTimestamp = Date.now();
      
      const createdNodesWithMapping = await Promise.all(
        nodesToAdd.map(async (node, index) => {
          // Générer un rfId unique avec timestamp, index et random pour éviter les collisions
          const rfId = node.id || `node-${baseTimestamp}-${index}-${Math.random().toString(36).substring(2, 9)}`;
          
          // Auto-create Process if mainProcess, supportProcess, managementProcess, or sipoc is dropped
          let referencedEntityId: string | undefined;
          if (
            node.type === 'PROCESS_NODE' || 
            node.type === 'process' ||
            node.type === 'mainProcess' ||
            node.type === 'supportProcess' ||
            node.type === 'managementProcess' ||
            node.type === 'sipoc'
          ) {
            try {
              // Déterminer le type de Process
              const processType = node.type === 'sipoc' 
                ? ProcessType.SIPOC 
                : ProcessType.FLOW;
              
              // Générer un code unique avec timestamp, compteur et random
              const processCode = `PROC-${baseTimestamp}-${processCounter++}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
              const newProcess = await this.processService.create(
                {
                  code: processCode,
                  title: node.label || 'Nouveau Processus',
                  description: node.data?.description || node.description,
                  processMapId: saveFlowDto.processMapId!,
                  workspaceId: processMap.workspaceId,
                  departmentId: processMap.departmentId || undefined,
                  type: processType, // FLOW ou SIPOC selon le type de nœud
                },
                userId,
              );
              if (!newProcess || !newProcess.id) {
                this.logger.warn(`Process creation returned null/undefined for node ${rfId}`);
                referencedEntityId = undefined;
              } else {
                referencedEntityId = newProcess.id;
              }
            } catch (error) {
              this.logger.error(`Failed to auto-create Process for node ${rfId}:`, error);
              // Continue without referenced entity
              referencedEntityId = undefined;
            }
          }

          const created = await this.createFlowNode(
            tx,
            flowDiagram.id,
            node,
            rfId,
            referencedEntityId,
          );
          if (node.id && node.id !== rfId) {
            nodeRfIdMapping[node.id] = created.rfId;
          }
          return created;
        }),
      );

      // Update existing nodes
      const updatedNodes = await Promise.all(
        nodesToUpdate.map(async (node) => {
          const dbId = rfIdToDbId.get(node.id!);
          if (!dbId) {
            throw new NotFoundException(`Node with rfId "${node.id}" not found`);
          }
          return this.updateFlowNode(tx, dbId, node);
        }),
      );

      // Process edges by action (excluding deleted ones)
      const edgesToAdd = edgesToProcess.filter(
        (e) =>
          e.action === FlowAction.ADD ||
          (!e.action && (!e.id || !existingEdgeRfIds.has(e.id))),
      );
      const edgesToUpdate = edgesToProcess.filter(
        (e) =>
          e.action === FlowAction.EDIT ||
          (!e.action && e.id && existingEdgeRfIds.has(e.id) && !edgesToDeleteRfIds.has(e.id)),
      );

      // Create new edges - update source/target rfIds if they were remapped
      const createdEdgesWithMapping = await Promise.all(
        edgesToAdd.map(async (edge) => {
          const rfId = edge.id || `edge-${Date.now()}-${Math.random()}`;
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
        `Flow saved: ${allNodes.length} nodes (${createdNodesWithMapping.length} new, ${updatedNodes.length} updated, ${nodesToDeleteRfIds.size} deleted), ` +
          `${allEdges.length} edges (${createdEdgesWithMapping.length} new, ${updatedEdges.length} updated, ${edgesToDeleteRfIds.size} deleted)`,
      );

      return {
        diagramId: flowDiagram.id,
        nodesCount: allNodes.length,
        edgesCount: allEdges.length,
      };
      },
      {
        maxWait: 10000, // Maximum time to wait for a transaction slot (10 seconds)
        timeout: 30000, // Maximum time the transaction can run (30 seconds)
      },
    );
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
        entityType: referencedEntityId ? 'PROCESS' : undefined,
        referencedEntityId,
        data: {
          originalType: node.type, // Store original node type for ReactFlow mapping
          description: node.description,
          width: node.width,
          height: node.height,
          zIndex: node.zIndex,
          parentNodeId: node.parentId || node.data?.parentNodeId || node.data?.parentNode || node.parentNodeId, // Store parentId from ReactFlow (top level)
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
        parentNodeId: node.parentId || node.data?.parentNodeId || node.data?.parentNode || node.parentNodeId, // Store parentId from ReactFlow (top level)
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
        processId: node.referencedEntityId,
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
    // ReactFlow uses parentId at top level, not parentNode
    if (nodeData.parentNodeId) {
      reactFlowNode.parentId = nodeData.parentNodeId;
      reactFlowNode.parentNode = nodeData.parentNodeId; // Keep for backward compatibility
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
      PROCESS_NODE: FlowNodeType.PROCESS,
      PROCEDURE_NODE: FlowNodeType.PROCEDURE,
      PROCESS: FlowNodeType.PROCESS,
      PROCEDURE: FlowNodeType.PROCEDURE,
      START_EVENT: FlowNodeType.START,
      END_EVENT: FlowNodeType.END,
      TASK: FlowNodeType.ACTION,
      ACTIVITY: FlowNodeType.ACTION,
      DECISION: FlowNodeType.DECISION,
      SUBPROCESS: FlowNodeType.SUBFLOW,
      // Qualigram types for ProcessMap (Level 1)
      MAINPROCESS: FlowNodeType.PROCESS,
      SUPPORTPROCESS: FlowNodeType.PROCESS,
      MANAGEMENTPROCESS: FlowNodeType.PROCESS,
      SIPOC: FlowNodeType.PROCESS, // SIPOC nodes are also PROCESS type
      DOMAINGROUP: FlowNodeType.SUBFLOW, // Use SUBFLOW for domain groups (containers)
      ACTORDEPARTMENT: FlowNodeType.ACTION,
      EXTERNALENTITY: FlowNodeType.ACTION,
      // Text/Title node
      TEXT: FlowNodeType.ACTION, // Text nodes are treated as action nodes
    };

    return typeMap[upperType] || FlowNodeType.ACTION;
  }
}

