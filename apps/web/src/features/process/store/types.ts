/**
 * Types for Process Flow Store
 * TypeScript interfaces and types for Zustand store state management
 */

import type { Node, Edge, Viewport } from '@xyflow/react';

/**
 * Process Flow Store State
 */
export interface ProcessFlowState {
  // Core state
  nodes: Node[];
  edges: Edge[];

  // Selection
  selectedNodeIds: string[];
  selectedEdgeIds: string[];

  // Dirty state
  isDirty: boolean;
  lastSaved: Date | null;

  // Process binding
  processId: string | null;

  // UI state
  viewport: Viewport;
}

/**
 * Actions for Process Flow Store
 */
export interface ProcessFlowActions {
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
  loadFlow: (nodes: Node[], edges: Edge[]) => void;
  reset: () => void;
  setProcessId: (id: string | null) => void;

  // Viewport
  setViewport: (viewport: Viewport) => void;

  // ReactFlow handlers
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
}

/**
 * Complete store type combining state and actions
 */
export type ProcessFlowStore = ProcessFlowState & ProcessFlowActions;

