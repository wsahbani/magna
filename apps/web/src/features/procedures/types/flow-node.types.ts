/**
 * Flow Node Type Definitions
 * Proper types for ReactFlow nodes with parent/lane relationships
 */

import type { Node } from '@xyflow/react';

/**
 * Extended node data with parent and lane information
 */
export interface FlowNodeData {
  label: string;
  description?: string;
  parentNodeId?: string;
  laneId?: string;
  poolId?: string;
  [key: string]: any;
}

/**
 * Extended ReactFlow node with proper typing for parent relationships
 */
export interface FlowNode extends Node {
  data: FlowNodeData;
  parentId?: string;
  parentNode?: string;
  extent?: 'parent' | [number, number, number, number];
}

/**
 * Pool node specific data
 */
export interface PoolNodeData extends FlowNodeData {
  lanes?: LaneData[];
  orientation?: 'horizontal' | 'vertical';
  onLabelChange?: (label: string) => void;
  onToggleOrientation?: () => void;
  onAddLane?: () => void;
  onRemoveLane?: (poolId: string, laneId: string) => void;
  onLaneResize?: (poolId: string, laneId: string, size: number) => void;
  onLaneLabelChange?: (poolId: string, laneId: string, label: string) => void;
}

/**
 * Lane data structure within a pool
 */
export interface LaneData {
  id: string;
  label: string;
  size: number;
  color?: string;
  collapsed?: boolean;
}

/**
 * Position coordinates
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Lane bounds for collision detection
 */
export interface LaneBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Type guard to check if a node is a FlowNode
 */
export function isFlowNode(node: Node): node is FlowNode {
  return 'data' in node && typeof node.data === 'object';
}

/**
 * Type guard to check if a node is a pool
 */
export function isPoolNode(node: Node): node is Node<PoolNodeData> {
  return node.type === 'pool' || node.type === 'swimlane';
}

/**
 * Helper to create a node with parent relationship
 */
export function createNodeWithParent(
  node: Node,
  parentId: string,
  position: Position,
  laneId?: string
): FlowNode {
  return {
    ...node,
    position,
    parentId,
    parentNode: parentId,
    extent: 'parent',
    data: {
      ...node.data,
      parentNodeId: parentId,
      laneId,
      poolId: parentId,
    },
  };
}

/**
 * Helper to remove parent relationship from node
 */
export function removeNodeParent(node: FlowNode, absolutePosition: Position): FlowNode {
  const { parentNodeId, laneId, poolId, ...restData } = node.data;
  return {
    ...node,
    position: absolutePosition,
    parentId: undefined,
    parentNode: undefined,
    extent: undefined,
    data: restData,
  };
}
