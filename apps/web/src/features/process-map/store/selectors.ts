/**
 * ProcessMap Flow Store Selectors
 * Memoized selectors for optimized performance and avoiding unnecessary re-renders
 * 
 * Architecture: Interface Segregation Principle
 * - Granular selectors for specific use cases
 * - Memoization to prevent unnecessary recalculations
 * - Factory functions for dynamic selectors
 */

import { useProcessMapFlowStore } from './processMapFlowStore';
import type { Node, Edge } from '@xyflow/react';
import { useMemo } from 'react';

/**
 * Select all nodes
 */
export const useNodes = () => {
  return useProcessMapFlowStore((state) => state.nodes);
};

/**
 * Select all edges
 */
export const useEdges = () => {
  return useProcessMapFlowStore((state) => state.edges);
};

/**
 * Select selected node IDs
 */
export const useSelectedNodeIds = () => {
  return useProcessMapFlowStore((state) => state.selectedNodeIds);
};

/**
 * Select selected edge IDs
 */
export const useSelectedEdgeIds = () => {
  return useProcessMapFlowStore((state) => state.selectedEdgeIds);
};

/**
 * Select dirty state
 */
export const useIsDirty = () => {
  return useProcessMapFlowStore((state) => state.isDirty);
};

/**
 * Select last saved timestamp
 */
export const useLastSaved = () => {
  return useProcessMapFlowStore((state) => state.lastSaved);
};

/**
 * Select ProcessMap ID
 */
export const useProcessMapId = () => {
  return useProcessMapFlowStore((state) => state.processMapId);
};

/**
 * Select viewport
 */
export const useViewport = () => {
  return useProcessMapFlowStore((state) => state.viewport);
};

/**
 * Select selected nodes (full Node objects)
 * Memoized to prevent unnecessary recalculations
 */
export const useSelectedNodes = (): Node[] => {
  const nodes = useNodes();
  const selectedNodeIds = useSelectedNodeIds();

  return useMemo(() => {
    return nodes.filter((node) => selectedNodeIds.includes(node.id));
  }, [nodes, selectedNodeIds]);
};

/**
 * Select first selected node (single selection)
 * Returns null if no node is selected or multiple nodes are selected
 */
export const useSelectedNode = (): Node | null => {
  const selectedNodes = useSelectedNodes();

  return useMemo(() => {
    return selectedNodes.length === 1 ? selectedNodes[0] : null;
  }, [selectedNodes]);
};

/**
 * Select selected edges (full Edge objects)
 * Memoized to prevent unnecessary recalculations
 */
export const useSelectedEdges = (): Edge[] => {
  const edges = useEdges();
  const selectedEdgeIds = useSelectedEdgeIds();

  return useMemo(() => {
    return edges.filter((edge) => selectedEdgeIds.includes(edge.id));
  }, [edges, selectedEdgeIds]);
};

/**
 * Select first selected edge (single selection)
 * Returns null if no edge is selected or multiple edges are selected
 */
export const useSelectedEdge = (): Edge | null => {
  const selectedEdges = useSelectedEdges();

  return useMemo(() => {
    return selectedEdges.length === 1 ? selectedEdges[0] : null;
  }, [selectedEdges]);
};

/**
 * Select whether any node or edge is selected
 */
export const useHasSelection = (): boolean => {
  const selectedNodeIds = useSelectedNodeIds();
  const selectedEdgeIds = useSelectedEdgeIds();

  return useMemo(() => {
    return selectedNodeIds.length > 0 || selectedEdgeIds.length > 0;
  }, [selectedNodeIds, selectedEdgeIds]);
};

/**
 * Factory function to select a node by ID
 * Returns a memoized selector hook
 */
export const useNodeById = (nodeId: string | null | undefined): Node | null => {
  const nodes = useNodes();

  return useMemo(() => {
    if (!nodeId) return null;
    return nodes.find((node) => node.id === nodeId) || null;
  }, [nodes, nodeId]);
};

/**
 * Factory function to select an edge by ID
 * Returns a memoized selector hook
 */
export const useEdgeById = (edgeId: string | null | undefined): Edge | null => {
  const edges = useEdges();

  return useMemo(() => {
    if (!edgeId) return null;
    return edges.find((edge) => edge.id === edgeId) || null;
  }, [edges, edgeId]);
};

/**
 * Select all actions (for components that need multiple actions)
 * Use sparingly - prefer individual action selectors when possible
 */
export const useActions = () => {
  return useProcessMapFlowStore((state) => ({
    setNodes: state.setNodes,
    addNode: state.addNode,
    updateNode: state.updateNode,
    deleteNode: state.deleteNode,
    deleteNodes: state.deleteNodes,
    setEdges: state.setEdges,
    addEdge: state.addEdge,
    updateEdge: state.updateEdge,
    deleteEdge: state.deleteEdge,
    deleteEdges: state.deleteEdges,
    setSelectedNodes: state.setSelectedNodes,
    setSelectedEdges: state.setSelectedEdges,
    clearSelection: state.clearSelection,
    markAsDirty: state.markAsDirty,
    markAsSaved: state.markAsSaved,
    loadFlow: state.loadFlow,
    reset: state.reset,
    setProcessMapId: state.setProcessMapId,
    setViewport: state.setViewport,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
  }));
};

