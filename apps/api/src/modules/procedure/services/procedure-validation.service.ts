import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { FlowNodeType } from '@prisma/client';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
  laneId?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
}

@Injectable()
export class ProcedureValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async validateProcedure(procedureId: string): Promise<ValidationResult> {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id: procedureId },
    });

    if (!procedure) {
      return {
        isValid: false,
        errors: [
          {
            code: 'PROCEDURE_NOT_FOUND',
            message: `Procedure with ID "${procedureId}" not found`,
          },
        ],
        warnings: [],
      };
    }

    // Get FlowDiagram for this procedure (level 3)
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
      // Empty diagram is valid but might be a warning
      return {
        isValid: true,
        errors: [],
        warnings: [
          {
            code: 'EMPTY_DIAGRAM',
            message: 'Procedure has no flow diagram yet',
          },
        ],
      };
    }

    const nodes = flowDiagram.nodes;
    const edges = flowDiagram.edges;

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Rule 1: Must have at least one START node
    const startNodes = nodes.filter((n) => n.type === FlowNodeType.START);
    if (startNodes.length === 0) {
      errors.push({
        code: 'NO_START_NODE',
        message: 'Procedure must have at least one START node',
      });
    } else if (startNodes.length > 1) {
      warnings.push({
        code: 'MULTIPLE_START_NODES',
        message: `Procedure has ${startNodes.length} START nodes. Consider having only one.`,
      });
    }

    // Rule 2: Must have at least one END node
    const endNodes = nodes.filter((n) => n.type === FlowNodeType.END);
    if (endNodes.length === 0) {
      errors.push({
        code: 'NO_END_NODE',
        message: 'Procedure must have at least one END node',
      });
    }

    // Rule 3: No orphaned nodes (all nodes must be connected)
    const connectedNodeRfIds = new Set<string>();
    edges.forEach((edge) => {
      connectedNodeRfIds.add(edge.sourceRfId);
      connectedNodeRfIds.add(edge.targetRfId);
    });

    nodes.forEach((node) => {
      if (!connectedNodeRfIds.has(node.rfId)) {
        // START and END nodes can be unconnected initially
        if (
          node.type !== FlowNodeType.START &&
          node.type !== FlowNodeType.END
        ) {
          errors.push({
            code: 'ORPHANED_NODE',
            message: `Node "${node.label || node.rfId}" (${node.rfId}) is not connected to any other node`,
            nodeId: node.rfId,
          });
        }
      }
    });

    // Rule 4: Decision nodes must have at least 2 outgoing edges with conditions
    const decisionNodes = nodes.filter((n) => n.type === FlowNodeType.DECISION);
    decisionNodes.forEach((node) => {
      const outgoingEdges = edges.filter(
        (e) => e.sourceRfId === node.rfId,
      );
      if (outgoingEdges.length < 2) {
        errors.push({
          code: 'DECISION_INSUFFICIENT_OUTGOING',
          message: `Decision node "${node.label || node.rfId}" must have at least 2 outgoing edges`,
          nodeId: node.rfId,
        });
      } else {
        const edgesWithConditions = outgoingEdges.filter(
          (e) => e.condition && e.condition.trim().length > 0,
        );
        if (edgesWithConditions.length < outgoingEdges.length) {
          warnings.push({
            code: 'DECISION_MISSING_CONDITIONS',
            message: `Some outgoing edges from decision node "${node.label || node.rfId}" are missing conditions`,
            nodeId: node.rfId,
          });
        }
      }
    });

    // Rule 5: Gateways - Note: FlowNodeType doesn't have separate gateway types
    // Decision nodes are used for gateways, so this rule is covered by Rule 4

    // Rule 6: RACI assignments - every ACTION must have at least Responsible and Accountable
    const actionNodes = nodes.filter((n) => n.type === FlowNodeType.ACTION);
    actionNodes.forEach((node) => {
      const nodeData = (node.data as any) || {};
      if (!nodeData.responsible || nodeData.responsible.trim().length === 0) {
        errors.push({
          code: 'MISSING_RESPONSIBLE',
          message: `Action "${node.label || node.rfId}" is missing a Responsible actor (RACI)`,
          nodeId: node.rfId,
        });
      }
      if (!nodeData.accountable || nodeData.accountable.trim().length === 0) {
        errors.push({
          code: 'MISSING_ACCOUNTABLE',
          message: `Action "${node.label || node.rfId}" is missing an Accountable actor (RACI)`,
          nodeId: node.rfId,
        });
      }
    });

    // Rule 7: Check for infinite loops (simplified - check for cycles)
    const cycles = this.detectCycles(nodes, edges);
    if (cycles.length > 0) {
      warnings.push({
        code: 'POTENTIAL_INFINITE_LOOP',
        message: `Potential infinite loop detected. Review the flow carefully.`,
      });
    }

    // Rule 8: Conditional edges must have labels/conditions
    edges.forEach((edge) => {
      const edgeData = (edge.data as any) || {};
      const edgeType = edgeData.type || 'SEQUENCE';
      
      // Check if it's a conditional edge (based on condition field or type)
      if (edge.condition || edgeType === 'CONDITIONAL' || edgeType === 'CONDITIONAL_FLOW') {
        if (!edge.condition || edge.condition.trim().length === 0) {
          errors.push({
            code: 'CONDITIONAL_EDGE_MISSING_CONDITION',
            message: `Conditional edge "${edge.rfId}" is missing a condition`,
            edgeId: edge.rfId,
          });
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private detectCycles(nodes: any[], edges: any[]): any[] {
    // Simplified cycle detection using DFS
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: any[] = [];

    // Build adjacency map using rfIds
    const adjacencyMap = new Map<string, string[]>();
    nodes.forEach((node) => {
      adjacencyMap.set(node.rfId, []);
    });
    edges.forEach((edge) => {
      const neighbors = adjacencyMap.get(edge.sourceRfId) || [];
      neighbors.push(edge.targetRfId);
      adjacencyMap.set(edge.sourceRfId, neighbors);
    });

    const dfs = (nodeRfId: string, path: string[]): void => {
      visited.add(nodeRfId);
      recursionStack.add(nodeRfId);

      const neighbors = adjacencyMap.get(nodeRfId) || [];
      for (const neighborRfId of neighbors) {
        if (!visited.has(neighborRfId)) {
          dfs(neighborRfId, [...path, neighborRfId]);
        } else if (recursionStack.has(neighborRfId)) {
          // Cycle detected
          cycles.push([...path, neighborRfId]);
        }
      }

      recursionStack.delete(nodeRfId);
    };

    nodes.forEach((node) => {
      if (!visited.has(node.rfId)) {
        dfs(node.rfId, [node.rfId]);
      }
    });

    return cycles;
  }
}
