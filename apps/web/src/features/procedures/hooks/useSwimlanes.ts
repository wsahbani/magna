/**
 * Hook for managing swimlanes (Pools with Lanes)
 * Simplified version - lanes are stored in pool.data.lanes
 * Provides functions to create, update, delete pools and lanes
 */

import { useCallback, useMemo } from 'react';
import type { Node } from '@xyflow/react';
import type { PoolNodeData, LaneData, SwimlaneOrientation } from '../types/flow-diagram.types';

interface UseSwimlanesOptions {
  nodes: Node[];
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
  readOnly?: boolean;
  // Store actions
  addLaneToPool?: (poolId: string, laneData?: { label?: string; size?: number; color?: string }) => void;
  removeLaneFromPool?: (poolId: string, laneId: string) => void;
  updateLaneSize?: (poolId: string, laneId: string, size: number) => void;
  updateLaneLabel?: (poolId: string, laneId: string, label: string) => void;
  toggleLaneCollapsed?: (poolId: string, laneId: string) => void;
  togglePoolOrientation?: (poolId: string) => void;
  updatePoolLabel?: (poolId: string, label: string) => void;
}

interface PoolInfo {
  id: string;
  orientation: SwimlaneOrientation;
  lanes: LaneData[];
}

/**
 * Extract pools from nodes
 */
function extractPools(nodes: Node[]): PoolInfo[] {
  const pools: PoolInfo[] = [];

  nodes.forEach((node) => {
    if (node.type === 'pool' || node.type === 'swimlane') {
      const poolData = node.data as PoolNodeData;
      pools.push({
        id: node.id,
        orientation: poolData.orientation || 'vertical',
        lanes: poolData.lanes || [],
      });
    }
  });

  return pools;
}

/**
 * Hook for managing swimlanes
 */
export function useSwimlanes({
  nodes,
  setNodes,
  readOnly,
  addLaneToPool,
  removeLaneFromPool,
  updateLaneSize,
  updateLaneLabel,
  toggleLaneCollapsed,
  togglePoolOrientation,
  updatePoolLabel,
}: UseSwimlanesOptions) {
  const pools = useMemo(() => extractPools(nodes), [nodes]);

  /**
   * Create a new pool
   */
  const createPool = useCallback(
    (position?: { x: number; y: number }) => {
      if (readOnly) return;

      const defaultPosition = position || { x: 100, y: 100 };
      const poolId = `pool-${Date.now()}`;
      const laneId = `lane-${Date.now()}`;

      // Initial pool dimensions
      const initialPoolWidth = 200; // Vertical: lanes side by side
      const initialPoolHeight = 600; // Horizontal: lanes stacked
      
      // First lane takes 100% of pool size
      const firstLaneSize = initialPoolWidth; // For vertical orientation

      const newPool: Node = {
        id: poolId,
        type: 'pool',
        position: defaultPosition,
        data: {
          label: 'Nouveau Pool',
          orientation: 'vertical' as SwimlaneOrientation,
          lanes: [
            {
              id: laneId,
              label: 'Lane 1',
              size: firstLaneSize, // 100% of pool width (200px)
            },
          ],
          color: '#f3f4f6',
          // Callbacks for the component
          onLabelChange: (label: string) => {
            updatePoolLabel?.(poolId, label);
          },
          onToggleOrientation: (id: string) => {
            togglePoolOrientation?.(id);
          },
          onAddLane: (id: string) => {
            addLaneToPool?.(id);
          },
          onRemoveLane: (id: string, laneId: string) => {
            removeLaneFromPool?.(id, laneId);
          },
          onLaneResize: (id: string, laneId: string, size: number) => {
            updateLaneSize?.(id, laneId, size);
          },
          onLaneLabelChange: (id: string, laneId: string, label: string) => {
            updateLaneLabel?.(id, laneId, label);
          },
        },
        width: initialPoolWidth, // Initial width (vertical: lanes side by side)
        height: initialPoolHeight, // Initial height
        style: {
          backgroundColor: '#f3f4f6',
        },
      };

      setNodes((nds) => [...nds, newPool]);
      return poolId;
    },
    [setNodes, readOnly, addLaneToPool, removeLaneFromPool, updateLaneSize, updateLaneLabel, togglePoolOrientation, updatePoolLabel],
  );

  /**
   * Create a new lane in a pool
   */
  const createLane = useCallback(
    (poolId: string, options?: { label?: string; size?: number; color?: string }) => {
      if (readOnly) return;

      if (addLaneToPool) {
        addLaneToPool(poolId, {
          label: options?.label || `Lane ${(pools.find((p) => p.id === poolId)?.lanes.length || 0) + 1}`,
          size: options?.size || 200,
          color: options?.color,
        });
      } else {
        // Fallback to manual update if store actions not provided
        const pool = nodes.find((n) => n.id === poolId && (n.type === 'pool' || n.type === 'swimlane'));
        if (!pool) return;

        const poolData = pool.data as PoolNodeData;
        const orientation = poolData.orientation || 'vertical';
        const isVertical = orientation === 'vertical';
        const laneCount = poolData.lanes?.length || 0;

        // Get current pool size (width for vertical, height for horizontal)
        const poolSize = isVertical 
          ? ((pool.width as number) || 200)
          : ((pool.height as number) || 600);

        const newLane: LaneData = {
          id: `lane-${Date.now()}`,
          label: options?.label || `Lane ${laneCount + 1}`,
          size: poolSize / (laneCount + 1), // Will be recalculated below
          color: options?.color,
        };

        const updatedLanes = [...(poolData.lanes || []), newLane];
        const numberOfLanes = updatedLanes.length;
        
        // Redistribute equally: each lane takes equal portion of pool size
        const equalSize = poolSize / numberOfLanes;
        const redistributedLanes = updatedLanes.map((lane) => ({
          ...lane,
          size: equalSize,
        }));

        setNodes((nds) =>
          nds.map((node) =>
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
        );
      }
    },
    [nodes, setNodes, readOnly, addLaneToPool, pools],
  );

  /**
   * Delete a lane from a pool
   */
  const deleteLane = useCallback(
    (poolId: string, laneId: string) => {
      if (readOnly) return;

      if (removeLaneFromPool) {
        removeLaneFromPool(poolId, laneId);
      } else {
        // Fallback to manual update
        const pool = nodes.find((n) => n.id === poolId && (n.type === 'pool' || n.type === 'swimlane'));
        if (!pool) return;

        const poolData = pool.data as PoolNodeData;
        const lanes = poolData.lanes || [];
        if (lanes.length <= 1) return; // Keep at least one lane

        const orientation = poolData.orientation || 'vertical';
        const isVertical = orientation === 'vertical';

        // Get current pool size (width for vertical, height for horizontal)
        const poolSize = isVertical 
          ? ((pool.width as number) || 200)
          : ((pool.height as number) || 600);

        const updatedLanes = lanes.filter((l: LaneData) => l.id !== laneId);
        const numberOfLanes = updatedLanes.length;
        
        // Redistribute equally: each remaining lane takes equal portion of pool size
        const equalSize = poolSize / numberOfLanes;
        const redistributedLanes = updatedLanes.map((lane) => ({
          ...lane,
          size: equalSize,
        }));

        setNodes((nds) =>
          nds.map((node) =>
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
        );
      }
    },
    [nodes, setNodes, readOnly, removeLaneFromPool],
  );

  /**
   * Assign a node to a lane (for drag & drop)
   */
  const assignNodeToLane = useCallback(
    (nodeId: string, laneId: string | null) => {
      if (readOnly) return;

      const pool = nodes.find(
        (n) => (n.type === 'pool' || n.type === 'swimlane') && (n.data as PoolNodeData).lanes?.some((l) => l.id === laneId),
      );
      if (!pool && laneId) return;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            if (laneId && pool) {
              return {
                ...node,
                ...({ parentId: pool.id, extent: 'parent' } as any),
                ...({ parentNode: pool.id } as any),
                data: {
                  ...node.data,
                  parentNodeId: pool.id,
                  laneId: laneId,
                },
              };
            } else {
              return {
                ...node,
                ...({ parentId: undefined, extent: undefined } as any),
                ...({ parentNode: undefined } as any),
                data: {
                  ...node.data,
                  parentNodeId: undefined,
                  laneId: undefined,
                },
              };
            }
          }
          return node;
        }),
      );
    },
    [nodes, setNodes, readOnly],
  );

  /**
   * Auto-resize lane based on content (placeholder - can be enhanced)
   */
  const autoResizeLane = useCallback(
    (poolId: string, laneId: string) => {
      // This can be enhanced to calculate based on child nodes
      // For now, it's a placeholder
      console.log('Auto-resize lane', poolId, laneId);
    },
    [],
  );

  /**
   * Change pool orientation
   */
  const changePoolOrientation = useCallback(
    (poolId: string, orientation: SwimlaneOrientation) => {
      if (readOnly) return;

      if (togglePoolOrientation) {
        togglePoolOrientation(poolId);
      } else {
        // Fallback to manual update
        const pool = nodes.find((n) => n.id === poolId && (n.type === 'pool' || n.type === 'swimlane'));
        if (!pool) return;

        const poolData = pool.data as PoolNodeData;
        const lanes = poolData.lanes || [];
        const totalSize = lanes.reduce((sum: number, l: LaneData) => sum + l.size, 0);
        const isVertical = orientation === 'vertical';

        setNodes((nds) =>
          nds.map((node) =>
            node.id === poolId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    orientation,
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
        );
      }
    },
    [nodes, setNodes, readOnly, togglePoolOrientation],
  );

  /**
   * Toggle lane collapsed state
   */
  const toggleLaneCollapsedState = useCallback(
    (poolId: string, laneId: string) => {
      if (readOnly) return;

      if (toggleLaneCollapsed) {
        toggleLaneCollapsed(poolId, laneId);
      } else {
        // Fallback to manual update
        setNodes((nds) =>
          nds.map((node) =>
            node.id === poolId && (node.type === 'pool' || node.type === 'swimlane')
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    lanes: ((node.data as PoolNodeData).lanes || []).map((l: LaneData) =>
                      l.id === laneId ? { ...l, collapsed: !l.collapsed } : l,
                    ),
                  },
                }
              : node,
          ),
        );
      }
    },
    [setNodes, readOnly, toggleLaneCollapsed],
  );

  return {
    pools,
    createPool,
    createLane,
    deleteLane,
    assignNodeToLane,
    autoResizeLane,
    changePoolOrientation,
    toggleLaneCollapsed: toggleLaneCollapsedState,
  };
}
