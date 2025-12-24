/**
 * Types for Procedure Flow Store
 * TypeScript interfaces and types for Zustand store state management
 */

import type { Node, Edge, Viewport } from '@xyflow/react';

/**
 * Procedure Flow Store State
 */
export interface ProcedureFlowState {
  // Core state
  nodes: Node[];
  edges: Edge[];

  // Selection
  selectedNodeIds: string[];
  selectedEdgeIds: string[];

  // Dirty state
  isDirty: boolean;
  lastSaved: Date | null;

  // Procedure binding
  procedureId: string | null;

  // UI state
  viewport: Viewport;
  flowDirection: 'horizontal' | 'vertical';
}

/**
 * Actions for Procedure Flow Store
 */
export interface ProcedureFlowActions {
  // Node operations
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  deleteNode: (nodeId: string) => void;
  deleteNodes: (nodeIds: string[]) => void;

  // Edge operations
  setEdges: (edges: Edge[]) => void;
  addEdge: (edge: Edge) => void;
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void;
  deleteEdge: (edgeId: string) => void;
  deleteEdges: (edgeIds: string[]) => void;

  // Selection
  setSelectedNodes: (nodeIds: string[]) => void;
  setSelectedEdges: (edgeIds: string[]) => void;
  clearSelection: () => void;

  // Dirty state
  markAsDirty: () => void;
  markAsSaved: () => void;

  // Flow management
  loadFlow: (nodes: Node[], edges: Edge[], flowDirection?: 'horizontal' | 'vertical') => void;
  reset: () => void;
  setProcedureId: (id: string | null) => void;

  // Viewport
  setViewport: (viewport: Viewport) => void;

  // Flow direction
  setFlowDirection: (direction: 'horizontal' | 'vertical') => void;

  // ReactFlow handlers
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;

  // Swimlane operations
  addLaneToPool: (poolId: string, laneData?: { label?: string; size?: number; color?: string }) => void;
  removeLaneFromPool: (poolId: string, laneId: string) => void;
  updateLaneSize: (poolId: string, laneId: string, size: number) => void;
  updateLaneLabel: (poolId: string, laneId: string, label: string) => void;
  toggleLaneCollapsed: (poolId: string, laneId: string) => void;
  togglePoolOrientation: (poolId: string) => void;
  updatePoolLabel: (poolId: string, label: string) => void;
}

/**
 * Complete store type combining state and actions
 */
export type ProcedureFlowStore = ProcedureFlowState & ProcedureFlowActions;

