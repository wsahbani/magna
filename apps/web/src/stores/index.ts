/**
 * Flow Store - Centralized state management for ReactFlow
 * 
 * This module provides a complete state management solution using Zustand
 * for managing flow diagrams with nodes and edges.
 * 
 * Features:
 * - Complete CRUD operations for nodes and edges
 * - Dirty state tracking for unsaved changes
 * - Selection management
 * - API integration helpers
 * - Advanced operations (duplicate, align, distribute)
 * - Export/Import functionality
 * - Flow validation
 * 
 * @example Basic usage
 * ```tsx
 * import { useFlowStore } from '@/stores'
 * 
 * function MyComponent() {
 *   const { nodes, edges, addNode, addEdge } = useFlowStore()
 *   // ... use the store
 * }
 * ```
 * 
 * @example Using helper hooks
 * ```tsx
 * import { useFlowOperations, useFlowApi } from '@/stores'
 * 
 * function MyComponent() {
 *   const { createNode, deleteSelected } = useFlowOperations()
 *   const { saveFlow, isDirty } = useFlowApi()
 *   // ... use the hooks
 * }
 * ```
 */

export { useFlowStore, useFlowSelectors, resetNodeIdCounter } from './flowStore'
export type { FlowState } from './flowStore'

export { useFlowOperations } from './hooks/useFlowOperations'
export { useFlowApi } from './hooks/useFlowApi'
export type { FlowData } from './hooks/useFlowApi'
