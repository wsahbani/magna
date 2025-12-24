/**
 * Types for ProcessMap Flow Store
 * TypeScript interfaces and types for Zustand store state management
 */

import type { Node, Edge, XYPosition, Viewport } from '@xyflow/react';

/**
 * ProcessMap Flow Store State
 */
export interface ProcessMapFlowState {
  // Core state
  nodes: Node[];
  edges: Edge[];

  // Selection
  selectedNodeIds: string[];
  selectedEdgeIds: string[];

  // Dirty state
  isDirty: boolean;
  lastSaved: Date | null;

  // ProcessMap binding
  processMapId: string | null;

  // UI state
  viewport: Viewport;
  flowDirection: 'horizontal' | 'vertical';
}

/**
 * Actions for ProcessMap Flow Store
 */
export interface ProcessMapFlowActions {
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
  setProcessMapId: (id: string | null) => void;

  // Viewport
  setViewport: (viewport: Viewport) => void;

  // Flow direction
  setFlowDirection: (direction: 'horizontal' | 'vertical') => void;

  // ReactFlow handlers
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
}

/**
 * Complete store type combining state and actions
 */
export type ProcessMapFlowStore = ProcessMapFlowState & ProcessMapFlowActions;

