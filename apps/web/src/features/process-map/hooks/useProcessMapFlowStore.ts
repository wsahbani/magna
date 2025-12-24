/**
 * ProcessMap Flow Store Hook Wrapper
 * Orchestrates React Query and Zustand store integration
 * 
 * Architecture: Dependency Inversion Principle
 * - Store doesn't depend on React Query directly
 * - Hook wrapper orchestrates the dependencies
 * - Provides unified API for components
 */

import { useEffect, useCallback } from 'react';
import { useProcessMapFlowStore as useStore } from '../store/processMapFlowStore';
import { useProcessMapFlow, useSaveProcessMapFlow } from './useProcessMapFlow';
import { useNodes, useEdges, useSelectedNode, useSelectedEdge, useIsDirty } from '../store/selectors';
import type { Node, Edge, Connection } from '@xyflow/react';
import { addEdge as reactFlowAddEdge } from '@xyflow/react';
import { toast } from 'sonner';

/**
 * Hook return type
 */
export interface UseProcessMapFlowStoreReturn {
  // State
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;

  // Actions
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  deleteNode: (nodeId: string) => void;
  deleteNodes: (nodeIds: string[]) => void;
  addEdge: (edge: Edge) => void;
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void;
  deleteEdge: (edgeId: string) => void;
  deleteEdges: (edgeIds: string[]) => void;
  setSelectedNodes: (nodeIds: string[]) => void;
  setSelectedEdges: (edgeIds: string[]) => void;
  clearSelection: () => void;

  // ReactFlow handlers
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: any) => void;

  // Persistence
  saveFlow: () => Promise<void>;
  loadFlow: (nodes: Node[], edges: Edge[]) => void;
  reset: () => void;

  // Utils
  setProcessMapId: (id: string | null) => void;
  
  // Flow direction
  flowDirection: 'horizontal' | 'vertical';
  setFlowDirection: (direction: 'horizontal' | 'vertical') => void;
}

/**
 * Main hook for ProcessMap Flow Store
 * 
 * Features:
 * - Loads data from React Query on mount
 * - Synchronizes store with API data
 * - Provides unified API for components
 * - Handles save operations
 * 
 * @param processMapId - ProcessMap ID to load
 * @returns Store state and actions
 */
export function useProcessMapFlowStore(
  processMapId: string | undefined,
): UseProcessMapFlowStoreReturn {
  // Store state (using selectors for optimization)
  const nodes = useNodes();
  const edges = useEdges();
  const selectedNode = useSelectedNode();
  const selectedEdge = useSelectedEdge();
  const isDirty = useIsDirty();

  // Store actions - Zustand actions are stable, so we can select them directly
  // Using individual selectors to avoid unnecessary re-renders
  const addNode = useStore((state) => state.addNode);
  const updateNode = useStore((state) => state.updateNode);
  const deleteNode = useStore((state) => state.deleteNode);
  const deleteNodes = useStore((state) => state.deleteNodes);
  const setEdges = useStore((state) => state.setEdges);
  const addEdge = useStore((state) => state.addEdge);
  const updateEdge = useStore((state) => state.updateEdge);
  const deleteEdge = useStore((state) => state.deleteEdge);
  const deleteEdges = useStore((state) => state.deleteEdges);
  const setSelectedNodes = useStore((state) => state.setSelectedNodes);
  const setSelectedEdges = useStore((state) => state.setSelectedEdges);
  const clearSelection = useStore((state) => state.clearSelection);
  const markAsSaved = useStore((state) => state.markAsSaved);
  const loadFlowToStore = useStore((state) => state.loadFlow);
  const reset = useStore((state) => state.reset);
  const setProcessMapId = useStore((state) => state.setProcessMapId);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const flowDirection = useStore((state) => state.flowDirection);
  const setFlowDirection = useStore((state) => state.setFlowDirection);

  // React Query hooks
  const { data: flowData, isLoading } = useProcessMapFlow(processMapId);
  const saveFlowMutation = useSaveProcessMapFlow();

  // Load flow data from API into store when available
  useEffect(() => {
    if (flowData && processMapId) {
      // Set ProcessMap ID first
      setProcessMapId(processMapId);

      // Load nodes and edges into store
      const apiNodes = flowData.nodes || [];
      const apiEdges = flowData.edges || [];

      // Restore parentId and extent at top level for nodes that have parentNodeId in data
      // (Backend returns parentNode in top level, but we need to ensure parentId is set)
      const restoredNodes = apiNodes.map((node) => {
        const nodeData = node.data || {};
        // Backend returns parentNode at top level, but ReactFlow uses parentId
        const parentId = (node as any).parentId || (node as any).parentNode || nodeData.parentNodeId;
        
        if (parentId) {
          return {
            ...node,
            parentId, // Set at top level (ReactFlow standard)
            extent: 'parent' as const,
          };
        }
        return node;
      });

      // Only load if data is different to avoid unnecessary updates
      // Compare by IDs and length to detect changes
      const currentNodesIds = nodes.map((n) => n.id).sort().join(',');
      const apiNodesIds = restoredNodes.map((n) => n.id).sort().join(',');

      if (currentNodesIds !== apiNodesIds || nodes.length !== restoredNodes.length || edges.length !== apiEdges.length) {
        // Convert flowDirection from API format (HORIZONTAL/VERTICAL) to store format (horizontal/vertical)
        const apiFlowDirection = flowData.flowDirection === 'VERTICAL' ? 'vertical' : 'horizontal';
        loadFlowToStore(restoredNodes, apiEdges, apiFlowDirection);
      }
      
      // Update flowDirection separately if it changed
      if (flowData.flowDirection) {
        const apiFlowDirection = flowData.flowDirection === 'VERTICAL' ? 'vertical' : 'horizontal';
        if (flowDirection !== apiFlowDirection) {
          setFlowDirection(apiFlowDirection);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowData, processMapId]);

  // Handle connections (create new edge from ReactFlow Connection)
  const onConnect = useCallback(
    (connection: Connection) => {
      // reactFlowAddEdge returns the updated edges array
      // We need to update the store with all edges
      const currentEdges = useStore.getState().edges;
      const updatedEdges = reactFlowAddEdge(connection, currentEdges);
      
      // Update all edges in the store (reactFlowAddEdge handles deduplication)
      if (updatedEdges && updatedEdges.length !== currentEdges.length) {
        // Use setEdges to replace all edges with the updated array
        setEdges(updatedEdges);
      }
    },
    [setEdges],
  );

  // Save flow to API
  const saveFlow = useCallback(async () => {
    if (!processMapId) {
      toast.error('ProcessMap ID manquant');
      return;
    }

    try {
      // Get current state from store to ensure we have the latest data
      const currentState = useStore.getState();
      await saveFlowMutation.mutateAsync({
        processMapId,
        nodes: currentState.nodes,
        edges: currentState.edges,
        flowDirection: currentState.flowDirection,
      });

      // Mark as saved after successful API call
      markAsSaved();
    } catch (error) {
      // Error handling is done in the mutation
      throw error;
    }
  }, [processMapId, saveFlowMutation, markAsSaved]);

  // Load flow (manual, for testing or special cases)
  const loadFlow = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      loadFlowToStore(newNodes, newEdges);
    },
    [loadFlowToStore],
  );

  return {
    // State
    nodes,
    edges,
    selectedNode,
    selectedEdge,
    isDirty,
    isLoading,
    isSaving: saveFlowMutation.isPending,

    // Actions
    addNode,
    updateNode,
    deleteNode,
    deleteNodes,
    addEdge,
    updateEdge,
    deleteEdge,
    deleteEdges,
    setSelectedNodes,
    setSelectedEdges,
    clearSelection,

    // ReactFlow handlers
    onNodesChange,
    onEdgesChange,
    onConnect,

    // Persistence
    saveFlow,
    loadFlow,
    reset,

    // Utils
    setProcessMapId,
    
    // Flow direction
    flowDirection,
    setFlowDirection,
  };
}

