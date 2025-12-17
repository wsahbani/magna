import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { 
  Node, 
  Edge, 
  Connection, 
  addEdge as reactFlowAddEdge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
} from '@xyflow/react'
import { 
  NodeGroup, 
  HierarchyStats,
} from '../types/node-hierarchy'
import { 
  HierarchyService,
  HierarchyOperations,
} from '../services/hierarchy.service'

/**
 * Flow store state interface
 */
export interface FlowState {
  // Data
  nodes: Node[]
  edges: Edge[]
  selectedNodes: Node[]
  selectedEdges: Edge[]
  
  // Flow metadata
  processId: string | null
  isDirty: boolean // Track unsaved changes
  lastSaved: Date | null
  
  // Node operations
  addNode: (node: Omit<Node, 'id'> & { id?: string }) => Node
  updateNode: (nodeId: string, data: Partial<Node['data']>) => void
  updateNodePosition: (nodeId: string, position: XYPosition) => void
  updateNodeStyle: (nodeId: string, style: Record<string, any>) => void
  updateNodeHandles: (nodeId: string, sourcePosition: string, targetPosition: string) => void
  deleteNode: (nodeId: string) => void
  deleteNodes: (nodeIds: string[]) => void
  duplicateNode: (nodeId: string) => Node | null
  
  // Edge operations
  addEdge: (connection: Connection) => void
  updateEdge: (edgeId: string, data: Partial<Edge>) => void
  deleteEdge: (edgeId: string) => void
  deleteEdges: (edgeIds: string[]) => void
  
  // Bulk operations
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  clearFlow: () => void
  loadFlow: (nodes: Node[], edges: Edge[], processId?: string) => void
  
  // ReactFlow change handlers
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  
  // Selection
  setSelectedNodes: (nodes: Node[]) => void
  setSelectedEdges: (edges: Edge[]) => void
  clearSelection: () => void
  
  // Hierarchy operations
  setNodeParent: (childId: string, parentId: string | null) => void
  removeNodeParent: (childId: string) => void
  createGroup: (group: NodeGroup, position: XYPosition) => void
  moveNodesToGroup: (nodeIds: string[], groupId: string | null) => boolean
  toggleGroupCollapse: (groupId: string) => void
  getNodeDescendants: (nodeId: string) => Node[]
  getNodeAncestors: (nodeId: string) => Node[]
  getNodeSiblings: (nodeId: string) => Node[]
  getHierarchyStats: () => HierarchyStats
  
  // Persistence
  markAsSaved: () => void
  setProcessId: (processId: string) => void
  
  // Undo/Redo (future enhancement)
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
}

/**
 * Node ID generator
 */
let nodeIdCounter = 1
const generateNodeId = (): string => {
  const id = `node_${nodeIdCounter}`
  nodeIdCounter++
  return id
}

/**
 * Reset node ID counter (useful for testing or when loading a flow)
 */
export const resetNodeIdCounter = (startFrom: number = 1) => {
  nodeIdCounter = startFrom
}

/**
 * Sync node ID counter with existing nodes
 */
const syncNodeIdCounter = (nodes: Node[]) => {
  const maxId = nodes.reduce((max, node) => {
    const match = node.id.match(/^node_(\d+)$/)
    if (match) {
      const num = parseInt(match[1], 10)
      return num > max ? num : max
    }
    return max
  }, 0)
  nodeIdCounter = maxId + 1
}

/**
 * Flow store with Zustand
 * 
 * Features:
 * - Complete CRUD operations for nodes and edges
 * - Dirty state tracking for unsaved changes
 * - Selection management
 * - Type-safe operations
 * - DevTools integration for debugging
 * - Optional persistence to localStorage
 */
export const useFlowStore = create<FlowState>()(
  devtools(
    // persist( // Uncomment to enable localStorage persistence
      (set, get) => ({
        // Initial state
        nodes: [],
        edges: [],
        selectedNodes: [],
        selectedEdges: [],
        processId: null,
        isDirty: false,
        lastSaved: null,
        canUndo: false,
        canRedo: false,
        
        // Node operations
        addNode: (nodeData) => {
          const id = nodeData.id || generateNodeId()
          const newNode: Node = {
            ...nodeData,
            id,
            type: nodeData.type || 'default',
            position: nodeData.position || { x: 0, y: 0 },
            data: nodeData.data || { label: 'New Node' },
          }
          
          set((state) => ({
            nodes: [...state.nodes, newNode],
            isDirty: true,
          }), false, 'addNode')
          
          return newNode
        },
        
        updateNode: (nodeId, data) => {
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, ...data } }
                : node
            ),
            isDirty: true,
          }), false, 'updateNode')
        },
        
        updateNodePosition: (nodeId, position) => {
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId ? { ...node, position } : node
            ),
            isDirty: true,
          }), false, 'updateNodePosition')
        },
        
        updateNodeStyle: (nodeId, style) => {
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? { 
                    ...node, 
                    data: { 
                      ...node.data, 
                      style: { ...(node.data?.style || {}), ...style } 
                    } 
                  }
                : node
            ),
            isDirty: true,
          }), false, 'updateNodeStyle')
        },
        
        updateNodeHandles: (nodeId, sourcePosition, targetPosition) => {
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? { 
                    ...node, 
                    data: { 
                      ...node.data, 
                      handlePositions: {
                        source: sourcePosition,
                        target: targetPosition,
                      }
                    } 
                  }
                : node
            ),
            isDirty: true,
          }), false, 'updateNodeHandles')
        },
        
        deleteNode: (nodeId) => {
          set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== nodeId),
            edges: state.edges.filter(
              (edge) => edge.source !== nodeId && edge.target !== nodeId
            ),
            selectedNodes: state.selectedNodes.filter((node) => node.id !== nodeId),
            isDirty: true,
          }), false, 'deleteNode')
        },
        
        deleteNodes: (nodeIds) => {
          const nodeIdSet = new Set(nodeIds)
          set((state) => ({
            nodes: state.nodes.filter((node) => !nodeIdSet.has(node.id)),
            edges: state.edges.filter(
              (edge) => !nodeIdSet.has(edge.source) && !nodeIdSet.has(edge.target)
            ),
            selectedNodes: state.selectedNodes.filter((node) => !nodeIdSet.has(node.id)),
            isDirty: true,
          }), false, 'deleteNodes')
        },
        
        duplicateNode: (nodeId) => {
          const state = get()
          const nodeToDuplicate = state.nodes.find((node) => node.id === nodeId)
          
          if (!nodeToDuplicate) return null
          
          const newNode: Node = {
            ...nodeToDuplicate,
            id: generateNodeId(),
            position: {
              x: nodeToDuplicate.position.x + 50,
              y: nodeToDuplicate.position.y + 50,
            },
            data: {
              ...nodeToDuplicate.data,
              label: `${nodeToDuplicate.data?.label} (Copy)`,
            },
          }
          
          set((state) => ({
            nodes: [...state.nodes, newNode],
            isDirty: true,
          }), false, 'duplicateNode')
          
          return newNode
        },
        
        // Edge operations
        addEdge: (connection) => {
          set((state) => ({
            edges: reactFlowAddEdge(connection, state.edges),
            isDirty: true,
          }), false, 'addEdge')
        },
        
        updateEdge: (edgeId, data) => {
          set((state) => ({
            edges: state.edges.map((edge) =>
              edge.id === edgeId ? { ...edge, ...data } : edge
            ),
            isDirty: true,
          }), false, 'updateEdge')
        },
        
        deleteEdge: (edgeId) => {
          set((state) => ({
            edges: state.edges.filter((edge) => edge.id !== edgeId),
            selectedEdges: state.selectedEdges.filter((edge) => edge.id !== edgeId),
            isDirty: true,
          }), false, 'deleteEdge')
        },
        
        deleteEdges: (edgeIds) => {
          const edgeIdSet = new Set(edgeIds)
          set((state) => ({
            edges: state.edges.filter((edge) => !edgeIdSet.has(edge.id)),
            selectedEdges: state.selectedEdges.filter((edge) => !edgeIdSet.has(edge.id)),
            isDirty: true,
          }), false, 'deleteEdges')
        },
        
        // Bulk operations
        setNodes: (nodes) => {
          syncNodeIdCounter(nodes)
          set({ nodes, isDirty: true }, false, 'setNodes')
        },
        
        setEdges: (edges) => {
          set({ edges, isDirty: true }, false, 'setEdges')
        },
        
        clearFlow: () => {
          resetNodeIdCounter()
          set({
            nodes: [],
            edges: [],
            selectedNodes: [],
            selectedEdges: [],
            isDirty: false,
          }, false, 'clearFlow')
        },
        
        loadFlow: (nodes, edges, processId) => {
          syncNodeIdCounter(nodes)
          set({
            nodes,
            edges,
            selectedNodes: [],
            selectedEdges: [],
            processId: processId || null,
            isDirty: false,
            lastSaved: new Date(),
          }, false, 'loadFlow')
        },
        
        // ReactFlow change handlers
        onNodesChange: (changes) => {
          set((state) => ({
            nodes: applyNodeChanges(changes, state.nodes),
            isDirty: true,
          }), false, 'onNodesChange')
        },
        
        onEdgesChange: (changes) => {
          set((state) => ({
            edges: applyEdgeChanges(changes, state.edges),
            isDirty: true,
          }), false, 'onEdgesChange')
        },
        
        // Selection
        setSelectedNodes: (nodes) => {
          set({ selectedNodes: nodes }, false, 'setSelectedNodes')
        },
        
        setSelectedEdges: (edges) => {
          set({ selectedEdges: edges }, false, 'setSelectedEdges')
        },
        
        clearSelection: () => {
          set({ selectedNodes: [], selectedEdges: [] }, false, 'clearSelection')
        },
        
        // Hierarchy operations
        setNodeParent: (childId, parentId) => {
          try {
            const state = get()
            const updatedNodes = HierarchyOperations.setParent(
              state.nodes,
              childId,
              parentId
            )
            set({ nodes: updatedNodes, isDirty: true }, false, 'setNodeParent')
          } catch (error) {
            console.error('Failed to set parent:', error)
          }
        },
        
        removeNodeParent: (childId) => {
          const state = get()
          const updatedNodes = HierarchyOperations.removeParent(state.nodes, childId)
          set({ nodes: updatedNodes, isDirty: true }, false, 'removeNodeParent')
        },
        
        createGroup: (group, position) => {
          const state = get()
          const updatedNodes = HierarchyOperations.createGroup(
            state.nodes,
            group,
            position
          )
          set({ nodes: updatedNodes, isDirty: true }, false, 'createGroup')
        },
        
        moveNodesToGroup: (nodeIds, groupId) => {
          const state = get()
          const result = HierarchyOperations.moveNodesToParent(
            state.nodes,
            nodeIds,
            groupId
          )
          
          if (result.success) {
            set({ nodes: result.updatedNodes, isDirty: true }, false, 'moveNodesToGroup')
            return true
          } else {
            console.error('Failed to move nodes:', result.error)
            return false
          }
        },
        
        toggleGroupCollapse: (groupId) => {
          const state = get()
          const updatedNodes = HierarchyOperations.toggleCollapse(state.nodes, groupId)
          set({ nodes: updatedNodes, isDirty: true }, false, 'toggleGroupCollapse')
        },
        
        getNodeDescendants: (nodeId) => {
          const state = get()
          return HierarchyService.getDescendants(state.nodes, nodeId)
        },
        
        getNodeAncestors: (nodeId) => {
          const state = get()
          return HierarchyService.getAncestors(state.nodes, nodeId)
        },
        
        getNodeSiblings: (nodeId) => {
          const state = get()
          return HierarchyService.getSiblings(state.nodes, nodeId)
        },
        
        getHierarchyStats: () => {
          const state = get()
          return HierarchyService.getHierarchyStats(state.nodes)
        },
        
        // Persistence
        markAsSaved: () => {
          set({ isDirty: false, lastSaved: new Date() }, false, 'markAsSaved')
        },
        
        setProcessId: (processId) => {
          set({ processId }, false, 'setProcessId')
        },
        
        // Undo/Redo (placeholder for future implementation)
        undo: () => {
          console.log('Undo not yet implemented')
        },
        
        redo: () => {
          console.log('Redo not yet implemented')
        },
      }),
    //   {
    //     name: 'flow-storage', // localStorage key
    //     partialize: (state) => ({ 
    //       // Only persist specific fields
    //       nodes: state.nodes,
    //       edges: state.edges,
    //       processId: state.processId,
    //     }),
    //   }
    // ),
    {
      name: 'FlowStore', // DevTools name
    }
  )
)

/**
 * Selectors for optimized access
 */
export const useFlowSelectors = () => {
  const getNodeById = (nodeId: string) => 
    useFlowStore((state) => state.nodes.find((n) => n.id === nodeId))
  
  const getEdgeById = (edgeId: string) =>
    useFlowStore((state) => state.edges.find((e) => e.id === edgeId))
  
  const getConnectedEdges = (nodeId: string) =>
    useFlowStore((state) => 
      state.edges.filter((e) => e.source === nodeId || e.target === nodeId)
    )
  
  return {
    getNodeById,
    getEdgeById,
    getConnectedEdges,
  }
}
