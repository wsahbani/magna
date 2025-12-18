/**
 * Utility functions for calculating lane positions within a pool
 * Handles both vertical and horizontal orientations
 */

import type { Node } from '@xyflow/react';
import type { PoolNodeData, LaneData, SwimlaneOrientation } from '../types/flow-diagram.types';

export interface LaneBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calculate the absolute position and bounds of a lane within a pool
 * 
 * Structure based on SwimlaneNode component:
 * - Horizontal mode: Header left (40px), lanes stacked vertically, lane label left (32px)
 * - Vertical mode: Header top (40px), lanes stacked horizontally, lane label top (32px)
 */
export function calculateLanePosition(
  pool: Node,
  laneId: string,
  orientation?: SwimlaneOrientation,
): LaneBounds | null {
  const poolData = pool.data as PoolNodeData;
  const lanes = poolData.lanes || [];
  const poolOrientation = orientation || poolData.orientation || 'vertical';
  const isVertical = poolOrientation === 'vertical';

  const poolX = (pool.position?.x as number) || 0;
  const poolY = (pool.position?.y as number) || 0;
  const poolWidth = (pool.width as number) || (isVertical ? 200 : 1000);
  const poolHeight = (pool.height as number) || (isVertical ? 600 : 200);

  // Pool header dimensions (from SwimlaneNode component)
  // Horizontal: header left w-10 = 40px, lane label left w-8 = 32px
  // Vertical: header top h-10 = 40px, lane label top h-8 = 32px
  const poolHeaderSize = 40; // w-10 or h-10
  const laneLabelSize = 32; // w-8 or h-8

  // Find the lane and calculate cumulative size
  let cumulativeSize = 0;
  let foundLane: LaneData | null = null;

  for (const lane of lanes) {
    if (lane.id === laneId) {
      foundLane = lane;
      break;
    }

    // Add size of previous lanes
    // In horizontal mode: cumulativeSize is vertical (height)
    // In vertical mode: cumulativeSize is horizontal (width)
    if (lane.collapsed) {
      cumulativeSize += 40; // Collapsed size (same for both orientations)
    } else {
      cumulativeSize += lane.size || 200;
    }
  }

  if (!foundLane) {
    return null;
  }

  const laneSize = foundLane.collapsed ? 40 : (foundLane.size || 200);

  if (isVertical) {
    // Vertical: lanes are side by side horizontally (flex-row)
    // Structure: Pool header (top 40px) -> Lanes container (mt-10) -> Each lane has label (top 32px) -> Content (mt-8)
    // Lanes are positioned horizontally (x increases), content area starts after header + label
    return {
      x: poolX + cumulativeSize, // Lanes are side by side horizontally, x increases with each lane
      y: poolY + poolHeaderSize + laneLabelSize, // After pool header (40px) + lane label (32px)
      width: laneSize, // Lane width (horizontal dimension in vertical mode)
      height: poolHeight - poolHeaderSize - laneLabelSize, // Full height minus pool header and lane label
    };
  } else {
    // Horizontal: lanes are stacked vertically (flex-col)
    // Structure: Pool header (left 40px) -> Lanes container (ml-10) -> Each lane has label (left 32px) -> Content (ml-8)
    // Lanes are positioned vertically (y increases), content area starts after header + label
    return {
      x: poolX + poolHeaderSize + laneLabelSize, // After pool header (40px) + lane label (32px)
      y: poolY + cumulativeSize, // Lanes are stacked vertically, y increases with each lane
      width: poolWidth - poolHeaderSize - laneLabelSize, // Full width minus pool header and lane label
      height: laneSize, // Lane height (vertical dimension in horizontal mode)
    };
  }
}

/**
 * Calculate the relative position of a node within a lane
 * Returns the offset from the lane's top-left corner
 */
export function calculateRelativePositionInLane(
  nodeAbsoluteX: number,
  nodeAbsoluteY: number,
  laneBounds: LaneBounds,
): { x: number; y: number } {
  return {
    x: nodeAbsoluteX - laneBounds.x,
    y: nodeAbsoluteY - laneBounds.y,
  };
}

/**
 * Calculate the absolute position of a node from its relative position in a lane
 */
export function calculateAbsolutePositionFromLane(
  relativeX: number,
  relativeY: number,
  laneBounds: LaneBounds,
): { x: number; y: number } {
  return {
    x: laneBounds.x + relativeX,
    y: laneBounds.y + relativeY,
  };
}

/**
 * Find which lane (if any) contains a given absolute position
 */
export function findLaneAtPosition(
  pool: Node,
  absoluteX: number,
  absoluteY: number,
  orientation?: SwimlaneOrientation,
): { laneId: string; laneBounds: LaneBounds } | null {
  const poolData = pool.data as PoolNodeData;
  const lanes = poolData.lanes || [];
  const poolOrientation = orientation || poolData.orientation || 'vertical';

  for (const lane of lanes) {
    const laneBounds = calculateLanePosition(pool, lane.id, poolOrientation);
    if (!laneBounds) continue;

    if (
      absoluteX >= laneBounds.x &&
      absoluteX <= laneBounds.x + laneBounds.width &&
      absoluteY >= laneBounds.y &&
      absoluteY <= laneBounds.y + laneBounds.height
    ) {
      return {
        laneId: lane.id,
        laneBounds,
      };
    }
  }

  return null;
}

/**
 * Check if a node is within the bounds of its assigned lane
 * Returns true if the node is fully or mostly (>=50%) within the lane bounds
 */
export function isNodeInLaneBounds(
  node: Node,
  pool: Node,
  laneId: string,
  orientation?: SwimlaneOrientation,
): boolean {
  const laneBounds = calculateLanePosition(pool, laneId, orientation);
  if (!laneBounds) return false;

  // Calculate absolute position of the node
  const nodeAbsoluteX = (pool.position?.x as number || 0) + node.position.x;
  const nodeAbsoluteY = (pool.position?.y as number || 0) + node.position.y;
  
  const nodeWidth = (node.width as number) || 100;
  const nodeHeight = (node.height as number) || 50;

  // Calculate node bounds
  const nodeBounds = {
    x: nodeAbsoluteX,
    y: nodeAbsoluteY,
    width: nodeWidth,
    height: nodeHeight,
  };

  // Check intersection (at least 50% overlap)
  const overlapX = Math.max(
    0,
    Math.min(nodeBounds.x + nodeBounds.width, laneBounds.x + laneBounds.width) -
      Math.max(nodeBounds.x, laneBounds.x)
  );
  const overlapY = Math.max(
    0,
    Math.min(nodeBounds.y + nodeBounds.height, laneBounds.y + laneBounds.height) -
      Math.max(nodeBounds.y, laneBounds.y)
  );
  const overlapArea = overlapX * overlapY;
  const nodeArea = nodeBounds.width * nodeBounds.height;

  return overlapArea >= nodeArea * 0.5; // At least 50% overlap
}

/**
 * Constrain a node's position to stay within its lane bounds
 * If the node is outside the lane, reposition it to the nearest valid position
 */
export function constrainNodeToLane(
  node: Node,
  pool: Node,
  laneId: string,
  orientation?: SwimlaneOrientation,
): { x: number; y: number } | null {
  const laneBounds = calculateLanePosition(pool, laneId, orientation);
  if (!laneBounds) return null;

  // Calculate absolute position of the node
  const nodeAbsoluteX = (pool.position?.x as number || 0) + node.position.x;
  const nodeAbsoluteY = (pool.position?.y as number || 0) + node.position.y;
  
  const nodeWidth = (node.width as number) || 100;
  const nodeHeight = (node.height as number) || 50;

  // Constrain position to lane bounds
  let constrainedX = nodeAbsoluteX;
  let constrainedY = nodeAbsoluteY;

  // Constrain X
  if (nodeAbsoluteX < laneBounds.x) {
    constrainedX = laneBounds.x;
  } else if (nodeAbsoluteX + nodeWidth > laneBounds.x + laneBounds.width) {
    constrainedX = laneBounds.x + laneBounds.width - nodeWidth;
  }

  // Constrain Y
  if (nodeAbsoluteY < laneBounds.y) {
    constrainedY = laneBounds.y;
  } else if (nodeAbsoluteY + nodeHeight > laneBounds.y + laneBounds.height) {
    constrainedY = laneBounds.y + laneBounds.height - nodeHeight;
  }

  // Convert back to relative position
  return {
    x: constrainedX - (pool.position?.x as number || 0),
    y: constrainedY - (pool.position?.y as number || 0),
  };
}

