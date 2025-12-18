/**
 * Procedure Flow Store
 * Zustand store for managing Procedure flow diagram state (Level 3)
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
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Viewport,
} from '@xyflow/react';
import type { ProcedureFlowStore } from './types';
import type { LaneData, SwimlaneOrientation } from '../types/flow-diagram.types';
import { calculateLanePosition, calculateRelativePositionInLane, calculateAbsolutePositionFromLane } from '../utils/lanePosition';

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
  procedureId: null as string | null,
  viewport: initialViewport,
};

/**
 * Procedure Flow Store
 * 
 * Features:
 * - Complete CRUD operations for nodes and edges
 * - Selection management
 * - Dirty state tracking
 * - ReactFlow change handlers integration
 * - DevTools support for debugging
 * - Support for swimlanes (pools and lanes)
 */
export const useProcedureFlowStore = create<ProcedureFlowStore>()(
  devtools(
    (set) => ({
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
       * Set Procedure ID
       */
      setProcedureId: (id: string | null) => {
        set({ procedureId: id }, false, 'setProcedureId');
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

      // ==================== Swimlane Operations ====================

      /**
       * Add a lane to a pool
       * Redistributes lanes equally: each lane takes (poolSize / numberOfLanes)
       * Pool size remains constant (BPMN-compliant)
       */
      addLaneToPool: (poolId: string, laneData?: { label?: string; size?: number; color?: string }) => {
        set(
          (state) => {
            const pool = state.nodes.find((n) => n.id === poolId && n.type === 'pool');
            if (!pool || !pool.data) return state;

            const orientation = (pool.data.orientation || 'vertical') as SwimlaneOrientation;
            const isVertical = orientation === 'vertical';
            
            // Get current pool size (width for vertical, height for horizontal)
            const poolSize = isVertical 
              ? ((pool.width as number) || 200)
              : ((pool.height as number) || 600);
            
            const laneCount = (pool.data.lanes as LaneData[])?.length || 0;

            const newLane: LaneData = {
              id: `lane-${Date.now()}`,
              label: laneData?.label || `Lane ${laneCount + 1}`,
              size: poolSize / (laneCount + 1), // Will be recalculated below
              color: laneData?.color,
            };

            const updatedLanes = [...((pool.data.lanes as LaneData[]) || []), newLane];
            const numberOfLanes = updatedLanes.length;
            
            // Redistribute equally: each lane takes equal portion of pool size
            const equalSize = poolSize / numberOfLanes;
            const redistributedLanes = updatedLanes.map((lane) => ({
              ...lane,
              size: equalSize,
            }));

            return {
              nodes: state.nodes.map((node) =>
                node.id === poolId
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        lanes: redistributedLanes,
                      },
                      // Pool size remains constant (BPMN-compliant)
                      style: {
                        ...node.style,
                        ...(isVertical
                          ? { width: poolSize, height: node.height || 600 }
                          : { width: node.width || 1000, height: poolSize }),
                      },
                    }
                  : node,
              ),
              isDirty: true,
            };
          },
          false,
          'addLaneToPool',
        );
      },

      /**
       * Remove a lane from a pool
       * Redistributes remaining lanes equally: each lane takes (poolSize / numberOfLanes)
       * Pool size remains constant (BPMN-compliant)
       */
      removeLaneFromPool: (poolId: string, laneId: string) => {
        set(
          (state) => {
            const pool = state.nodes.find((n) => n.id === poolId && n.type === 'pool');
            if (!pool || !pool.data) return state;

            const lanes = (pool.data.lanes as LaneData[]) || [];
            if (lanes.length <= 1) return state; // Keep at least one lane

            const orientation = (pool.data.orientation || 'vertical') as SwimlaneOrientation;
            const isVertical = orientation === 'vertical';

            // Get current pool size (width for vertical, height for horizontal)
            const poolSize = isVertical 
              ? ((pool.width as number) || 200)
              : ((pool.height as number) || 600);

            const updatedLanes = lanes.filter((l) => l.id !== laneId);
            const numberOfLanes = updatedLanes.length;
            
            // Redistribute equally: each remaining lane takes equal portion of pool size
            const equalSize = poolSize / numberOfLanes;
            const redistributedLanes = updatedLanes.map((lane) => ({
              ...lane,
              size: equalSize,
            }));

            // Find all child nodes in the deleted lane
            const childNodesInDeletedLane = state.nodes.filter(
              (n) => 
                ((n as any).parentId === poolId || (n as any).parentNode === poolId) &&
                n.data?.laneId === laneId
            );

            // Get the first remaining lane as fallback destination
            const fallbackLaneId = updatedLanes.length > 0 ? updatedLanes[0].id : undefined;

            return {
              nodes: state.nodes.map((node) => {
                // Update pool with redistributed lanes
                if (node.id === poolId) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      lanes: redistributedLanes,
                    },
                    // Pool size remains constant (BPMN-compliant)
                    style: {
                      ...node.style,
                      ...(isVertical
                        ? { width: poolSize, height: node.height || 600 }
                        : { width: node.width || 1000, height: poolSize }),
                    },
                  };
                }

                // Move child nodes from deleted lane to fallback lane or detach
                if (childNodesInDeletedLane.some((cn) => cn.id === node.id)) {
                  if (fallbackLaneId) {
                    // Move to first remaining lane
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        laneId: fallbackLaneId,
                      },
                    };
                  } else {
                    // Detach if no lanes remain (shouldn't happen due to check above)
                    return {
                      ...node,
                      ...({ parentId: undefined, extent: undefined } as any),
                      ...({ parentNode: undefined } as any),
                      data: {
                        ...node.data,
                        parentNodeId: undefined,
                        poolId: undefined,
                        laneId: undefined,
                      },
                    };
                  }
                }

                return node;
              }),
              isDirty: true,
            };
          },
          false,
          'removeLaneFromPool',
        );
      },

      /**
       * Update lane size and recalculate pool size
       */
      updateLaneSize: (poolId: string, laneId: string, size: number) => {
        set(
          (state) => {
            const pool = state.nodes.find((n) => n.id === poolId && n.type === 'pool');
            if (!pool || !pool.data) return state;

            const orientation = (pool.data.orientation || 'vertical') as SwimlaneOrientation;
            const isVertical = orientation === 'vertical';

            const updatedLanes = ((pool.data.lanes as LaneData[]) || []).map((l) =>
              l.id === laneId ? { ...l, size: Math.max(100, size) } : l,
            );
            const totalSize = updatedLanes.reduce((sum, l) => sum + l.size, 0);

            return {
              nodes: state.nodes.map((node) =>
                node.id === poolId
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        lanes: updatedLanes,
                      },
                      style: {
                        ...node.style,
                        ...(isVertical
                          ? { width: totalSize, height: node.height || 600 }
                          : { width: node.width || 1000, height: totalSize }),
                      },
                    }
                  : node,
              ),
              isDirty: true,
            };
          },
          false,
          'updateLaneSize',
        );
      },

      /**
       * Update lane label
       */
      updateLaneLabel: (poolId: string, laneId: string, label: string) => {
        set(
          (state) => ({
            nodes: state.nodes.map((node) =>
              node.id === poolId && node.type === 'pool'
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      lanes: ((node.data.lanes as LaneData[]) || []).map((l) =>
                        l.id === laneId ? { ...l, label } : l,
                      ),
                    },
                  }
                : node,
            ),
            isDirty: true,
          }),
          false,
          'updateLaneLabel',
        );
      },

      /**
       * Toggle lane collapsed state
       */
      toggleLaneCollapsed: (poolId: string, laneId: string) => {
        set(
          (state) => ({
            nodes: state.nodes.map((node) =>
              node.id === poolId && node.type === 'pool'
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      lanes: ((node.data.lanes as LaneData[]) || []).map((l) =>
                        l.id === laneId ? { ...l, collapsed: !l.collapsed } : l,
                      ),
                    },
                  }
                : node,
            ),
            isDirty: true,
          }),
          false,
          'toggleLaneCollapsed',
        );
      },

      /**
       * Toggle pool orientation (vertical/horizontal)
       * Recalculates positions of child nodes to keep them in their lanes
       */
      togglePoolOrientation: (poolId: string) => {
        set(
          (state) => {
            const pool = state.nodes.find((n) => n.id === poolId && n.type === 'pool');
            if (!pool || !pool.data) return state;

            const currentOrientation = (pool.data.orientation || 'vertical') as SwimlaneOrientation;
            const newOrientation: SwimlaneOrientation =
              currentOrientation === 'vertical' ? 'horizontal' : 'vertical';
            const isVertical = newOrientation === 'vertical';

            const lanes = (pool.data.lanes as LaneData[]) || [];
            const numberOfLanes = lanes.length;
            
            // Get the pool size for the new orientation
            // When switching: use the dimension that corresponds to the new orientation
            const poolSize = isVertical 
              ? ((pool.width as number) || 200)
              : ((pool.height as number) || 600);
            
            // Redistribute lanes equally for the new orientation
            const equalSize = numberOfLanes > 0 ? poolSize / numberOfLanes : poolSize;
            const redistributedLanes = lanes.map((lane) => ({
              ...lane,
              size: equalSize,
            }));
            
            const totalSize = poolSize; // Pool size remains constant

            // Find all child nodes of this pool
            const childNodes = state.nodes.filter(
              (n) => ((n as any).parentId === poolId || (n as any).parentNode === poolId) && n.data?.laneId,
            );

            // Update pool orientation
            const updatedPool = {
              ...pool,
              data: {
                ...pool.data,
                orientation: newOrientation,
                lanes: redistributedLanes, // Use redistributed lanes
              },
              style: {
                ...pool.style,
                ...(isVertical
                  ? { width: totalSize, height: pool.height || 600 }
                  : { width: pool.width || 1000, height: totalSize }),
              },
            };

            // Recalculate positions of child nodes to keep them in their lanes
            const updatedChildNodes = childNodes.map((childNode) => {
              const laneId = childNode.data?.laneId as string;
              if (!laneId) return childNode;

              // Calculate old lane bounds (current orientation)
              const oldLaneBounds = calculateLanePosition(pool, laneId, currentOrientation);
              if (!oldLaneBounds) return childNode;

              // Get current relative position in the old lane
              const currentAbsoluteX = ((pool.position?.x as number) || 0) + childNode.position.x;
              const currentAbsoluteY = ((pool.position?.y as number) || 0) + childNode.position.y;
              const relativePos = calculateRelativePositionInLane(
                currentAbsoluteX,
                currentAbsoluteY,
                oldLaneBounds,
              );

              // Calculate new lane bounds (new orientation)
              const newLaneBounds = calculateLanePosition(updatedPool, laneId, newOrientation);
              if (!newLaneBounds) return childNode;

              // Calculate new absolute position in the new lane
              const newAbsolutePos = calculateAbsolutePositionFromLane(
                relativePos.x,
                relativePos.y,
                newLaneBounds,
              );

              // Calculate new relative position to pool
              const newRelativeX = newAbsolutePos.x - ((updatedPool.position?.x as number) || 0);
              const newRelativeY = newAbsolutePos.y - ((updatedPool.position?.y as number) || 0);

              return {
                ...childNode,
                position: {
                  x: newRelativeX,
                  y: newRelativeY,
                },
              };
            });

            // Update all nodes
            return {
              nodes: state.nodes.map((node) => {
                if (node.id === poolId) {
                  return updatedPool;
                }
                const updatedChild = updatedChildNodes.find((cn) => cn.id === node.id);
                if (updatedChild) {
                  return updatedChild;
                }
                return node;
              }),
              isDirty: true,
            };
          },
          false,
          'togglePoolOrientation',
        );
      },

      /**
       * Update pool label
       */
      updatePoolLabel: (poolId: string, label: string) => {
        set(
          (state) => ({
            nodes: state.nodes.map((node) =>
              node.id === poolId && node.type === 'pool'
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      label,
                    },
                  }
                : node,
            ),
            isDirty: true,
          }),
          false,
          'updatePoolLabel',
        );
      },
    }),
    {
      name: 'ProcedureFlowStore',
    },
  ),
);

