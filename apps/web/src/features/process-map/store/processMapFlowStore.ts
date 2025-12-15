/**
 * ProcessMap Flow Store
 * Zustand store for managing ProcessMap flow diagram state (Level 1)
 * 
 * Architecture: SOLID principles
 * - Single Responsibility: State management only
 * - Open/Closed: Extensible via actions
 * - Liskov Substitution: Compatible with ReactFlow hooks
 * - Interface Segregation: Granular selectors
 * - Dependency Inversion: No direct React Query dependency
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Node,
  Edge,
  Connection,
  addEdge as reactFlowAddEdge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Viewport,
} from '@xyflow/react';
import type { ProcessMapFlowStore } from './types';

/**
 * Initial viewport state
 */
const initialViewport: Viewport = {
  x: 0,
  y: 0,
  zoom: 1,
};

/**
 * Initial state
 */
const initialState = {
  nodes: [] as Node[],
  edges: [] as Edge[],
  selectedNodeIds: [] as string[],
  selectedEdgeIds: [] as string[],
  isDirty: false,
  lastSaved: null as Date | null,
  processMapId: null as string | null,
  viewport: initialViewport,
};

/**
 * ProcessMap Flow Store
 * 
 * Features:
 * - Complete CRUD operations for nodes and edges
 * - Selection management
 * - Dirty state tracking
 * - ReactFlow change handlers integration
 * - DevTools support for debugging
 */
export const useProcessMapFlowStore = create<ProcessMapFlowStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ==================== Node Operations ====================

      /**
       * Set all nodes (replaces existing)
       */
      setNodes: (nodes: Node[]) => {
        set({ nodes, isDirty: true }, false, 'setNodes');
      },

      /**
       * Add a new node
       */
      addNode: (node: Node) => {
        set(
          (state) => ({
            nodes: [...state.nodes, node],
            isDirty: true,
          }),
          false,
          'addNode',
        );
      },

      /**
       * Update a node by ID
       */
      updateNode: (nodeId: string, updates: Partial<Node>) => {
        set(
          (state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId ? { ...node, ...updates } : node,
            ),
            isDirty: true,
          }),
          false,
          'updateNode',
        );
      },

      /**
       * Delete a node by ID
       */
      deleteNode: (nodeId: string) => {
        set(
          (state) => ({
            nodes: state.nodes.filter((node) => node.id !== nodeId),
            edges: state.edges.filter(
              (edge) => edge.source !== nodeId && edge.target !== nodeId,
            ),
            selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
            isDirty: true,
          }),
          false,
          'deleteNode',
        );
      },

      /**
       * Delete multiple nodes
       */
      deleteNodes: (nodeIds: string[]) => {
        set(
          (state) => ({
            nodes: state.nodes.filter((node) => !nodeIds.includes(node.id)),
            edges: state.edges.filter(
              (edge) => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target),
            ),
            selectedNodeIds: state.selectedNodeIds.filter((id) => !nodeIds.includes(id)),
            isDirty: true,
          }),
          false,
          'deleteNodes',
        );
      },

      // ==================== Edge Operations ====================

      /**
       * Set all edges (replaces existing)
       */
      setEdges: (edges: Edge[]) => {
        set({ edges, isDirty: true }, false, 'setEdges');
      },

      /**
       * Add a new edge
       */
      addEdge: (edge: Edge) => {
        set(
          (state) => ({
            edges: [...state.edges, edge],
            isDirty: true,
          }),
          false,
          'addEdge',
        );
      },

      /**
       * Update an edge by ID
       */
      updateEdge: (edgeId: string, updates: Partial<Edge>) => {
        set(
          (state) => ({
            edges: state.edges.map((edge) =>
              edge.id === edgeId ? { ...edge, ...updates } : edge,
            ),
            isDirty: true,
          }),
          false,
          'updateEdge',
        );
      },

      /**
       * Delete an edge by ID
       */
      deleteEdge: (edgeId: string) => {
        set(
          (state) => ({
            edges: state.edges.filter((edge) => edge.id !== edgeId),
            selectedEdgeIds: state.selectedEdgeIds.filter((id) => id !== edgeId),
            isDirty: true,
          }),
          false,
          'deleteEdge',
        );
      },

      /**
       * Delete multiple edges
       */
      deleteEdges: (edgeIds: string[]) => {
        set(
          (state) => ({
            edges: state.edges.filter((edge) => !edgeIds.includes(edge.id)),
            selectedEdgeIds: state.selectedEdgeIds.filter((id) => !edgeIds.includes(id)),
            isDirty: true,
          }),
          false,
          'deleteEdges',
        );
      },

      // ==================== Selection Operations ====================

      /**
       * Set selected nodes
       */
      setSelectedNodes: (nodeIds: string[]) => {
        set({ selectedNodeIds: nodeIds }, false, 'setSelectedNodes');
      },

      /**
       * Set selected edges
       */
      setSelectedEdges: (edgeIds: string[]) => {
        set({ selectedEdgeIds: edgeIds }, false, 'setSelectedEdges');
      },

      /**
       * Clear all selections
       */
      clearSelection: () => {
        set(
          { selectedNodeIds: [], selectedEdgeIds: [] },
          false,
          'clearSelection',
        );
      },

      // ==================== Dirty State Operations ====================

      /**
       * Mark store as dirty (has unsaved changes)
       */
      markAsDirty: () => {
        set({ isDirty: true }, false, 'markAsDirty');
      },

      /**
       * Mark store as saved
       */
      markAsSaved: () => {
        set(
          { isDirty: false, lastSaved: new Date() },
          false,
          'markAsSaved',
        );
      },

      // ==================== Flow Management ====================

      /**
       * Load flow data (from API)
       */
      loadFlow: (nodes: Node[], edges: Edge[]) => {
        set(
          {
            nodes,
            edges,
            isDirty: false,
            lastSaved: new Date(),
            selectedNodeIds: [],
            selectedEdgeIds: [],
          },
          false,
          'loadFlow',
        );
      },

      /**
       * Reset store to initial state
       */
      reset: () => {
        set(initialState, false, 'reset');
      },

      /**
       * Set ProcessMap ID
       */
      setProcessMapId: (id: string | null) => {
        set({ processMapId: id }, false, 'setProcessMapId');
      },

      // ==================== Viewport Operations ====================

      /**
       * Set viewport (position and zoom)
       */
      setViewport: (viewport: Viewport) => {
        set({ viewport }, false, 'setViewport');
      },

      // ==================== ReactFlow Handlers ====================

      /**
       * Handle ReactFlow node changes
       * This integrates with ReactFlow's useNodesState hook pattern
       */
      onNodesChange: (changes: NodeChange[]) => {
        set(
          (state) => {
            // Apply changes using ReactFlow's helper
            const updatedNodes = applyNodeChanges(changes, state.nodes);

            // Track selection changes
            const selectChanges = changes.filter(
              (change) => change.type === 'select',
            );
            let newSelectedNodeIds = [...state.selectedNodeIds];

            selectChanges.forEach((change) => {
              if (change.type === 'select') {
                if (change.selected) {
                  if (!newSelectedNodeIds.includes(change.id)) {
                    newSelectedNodeIds.push(change.id);
                  }
                } else {
                  newSelectedNodeIds = newSelectedNodeIds.filter(
                    (id) => id !== change.id,
                  );
                }
              }
            });

            // Track remove changes
            const removeChanges = changes.filter(
              (change) => change.type === 'remove',
            );
            removeChanges.forEach((change) => {
              if (change.type === 'remove') {
                newSelectedNodeIds = newSelectedNodeIds.filter(
                  (id) => id !== change.id,
                );
              }
            });

            return {
              nodes: updatedNodes,
              selectedNodeIds: newSelectedNodeIds,
              isDirty: true,
            };
          },
          false,
          'onNodesChange',
        );
      },

      /**
       * Handle ReactFlow edge changes
       * This integrates with ReactFlow's useEdgesState hook pattern
       */
      onEdgesChange: (changes: EdgeChange[]) => {
        set(
          (state) => {
            const updatedEdges = applyEdgeChanges(changes, state.edges);

            // Track selection changes
            const selectChanges = changes.filter(
              (change) => change.type === 'select',
            );
            let newSelectedEdgeIds = [...state.selectedEdgeIds];

            selectChanges.forEach((change) => {
              if (change.type === 'select') {
                if (change.selected) {
                  if (!newSelectedEdgeIds.includes(change.id)) {
                    newSelectedEdgeIds.push(change.id);
                  }
                } else {
                  newSelectedEdgeIds = newSelectedEdgeIds.filter(
                    (id) => id !== change.id,
                  );
                }
              }
            });

            // Track remove changes
            const removeChanges = changes.filter(
              (change) => change.type === 'remove',
            );
            removeChanges.forEach((change) => {
              if (change.type === 'remove') {
                newSelectedEdgeIds = newSelectedEdgeIds.filter(
                  (id) => id !== change.id,
                );
              }
            });

            return {
              edges: updatedEdges,
              selectedEdgeIds: newSelectedEdgeIds,
              isDirty: true,
            };
          },
          false,
          'onEdgesChange',
        );
      },
    }),
    {
      name: 'ProcessMapFlowStore',
    },
  ),
);

