# Flow Deletion Tracking - Complete Guide

## Problem

When users delete nodes/edges from the ReactFlow canvas and save, the deleted items are not removed from the database because:

1. Frontend only sends the **remaining nodes/edges** to the backend
2. Backend doesn't know which items were **deleted**
3. On reload, the deleted items reappear from the database

## Solution

Use the `useFlowChanges` hook to track deletions and send them to the backend with `action: DELETE`.

## Complete Implementation

### Step 1: Set Up Change Tracking

```typescript
import { useState, useEffect } from 'react'
import { Node, Edge } from '@xyflow/react'
import { useFlowChanges } from '@/hooks/useFlowChanges'
import { useSaveFlow, useLoadFlow } from '@/hooks/useFlowPersistence'

function FlowEditor({ processId }: { processId: string }) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  // Initialize change tracking hook
  const {
    initializeTracking,
    addNodeActions,
    addEdgeActions,
    getDeletedNodes,
    getDeletedEdges,
  } = useFlowChanges()

  // Load flow data
  const { data: flowData } = useLoadFlow(processId)
  const saveFlowMutation = useSaveFlow()

  // Initialize tracking when flow is loaded
  useEffect(() => {
    if (flowData) {
      setNodes(flowData.nodes)
      setEdges(flowData.edges)
      
      // ✅ CRITICAL: Initialize tracking with loaded data
      initializeTracking(flowData.nodes, flowData.edges)
    }
  }, [flowData, initializeTracking])

  return (
    <FlowBuilder
      nodes={nodes}
      edges={edges}
      onNodesChange={/* ... */}
      onEdgesChange={/* ... */}
      onSave={handleSave}
    />
  )
}
```

### Step 2: Handle Deletions When Saving

```typescript
const handleSave = async () => {
  // Add action flags to current nodes/edges
  const nodesWithActions = addNodeActions(nodes)
  const edgesWithActions = addEdgeActions(edges)

  // ✅ GET DELETED ITEMS - This is the key!
  const deletedNodes = getDeletedNodes(nodes)
  const deletedEdges = getDeletedEdges(edges)

  // Log what will be saved (for debugging)
  console.log('Saving:', {
    current: { nodes: nodesWithActions.length, edges: edgesWithActions.length },
    deleted: { nodes: deletedNodes.length, edges: deletedEdges.length }
  })

  // Save with deleted items
  await saveFlowMutation.mutateAsync({
    processId,
    nodes: nodesWithActions,
    edges: edgesWithActions,
    changesLog: 'Manual save',
    deletedNodes,  // ✅ Send deleted nodes
    deletedEdges,  // ✅ Send deleted edges
  })

  // Re-initialize tracking after save
  initializeTracking(nodes, edges)
}
```

### Step 3: Complete Working Example

```typescript
import React, { useState, useEffect, useCallback } from 'react'
import { ReactFlow, Node, Edge, useNodesState, useEdgesState } from '@xyflow/react'
import { useFlowChanges } from '@/hooks/useFlowChanges'
import { useSaveFlow, useLoadFlow } from '@/hooks/useFlowPersistence'

function ProcessFlowEditor({ processId }: { processId: string }) {
  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Change tracking
  const {
    initializeTracking,
    addNodeActions,
    addEdgeActions,
    getDeletedNodes,
    getDeletedEdges,
  } = useFlowChanges()

  // API hooks
  const { data: flowData, isLoading } = useLoadFlow(processId)
  const saveFlowMutation = useSaveFlow()

  // Load flow data
  useEffect(() => {
    if (flowData) {
      setNodes(flowData.nodes)
      setEdges(flowData.edges)
      
      // ✅ Initialize tracking
      initializeTracking(flowData.nodes, flowData.edges)
      
      console.log('✅ Tracking initialized with:', {
        nodes: flowData.nodes.length,
        edges: flowData.edges.length
      })
    }
  }, [flowData])

  // Save handler
  const handleSave = useCallback(async () => {
    // Prepare data with actions
    const nodesWithActions = addNodeActions(nodes)
    const edgesWithActions = addEdgeActions(edges)
    const deletedNodes = getDeletedNodes(nodes)
    const deletedEdges = getDeletedEdges(edges)

    // Log the operation
    console.log('💾 Saving flow:', {
      nodes: {
        current: nodesWithActions.length,
        new: nodesWithActions.filter(n => n.action === 'ADD').length,
        edited: nodesWithActions.filter(n => n.action === 'EDIT').length,
        deleted: deletedNodes.length,
      },
      edges: {
        current: edgesWithActions.length,
        new: edgesWithActions.filter(e => e.action === 'ADD').length,
        edited: edgesWithActions.filter(e => e.action === 'EDIT').length,
        deleted: deletedEdges.length,
      }
    })

    try {
      await saveFlowMutation.mutateAsync({
        processId,
        nodes: nodesWithActions,
        edges: edgesWithActions,
        changesLog: 'Manual save',
        deletedNodes,
        deletedEdges,
      })

      // ✅ Re-initialize tracking with new state
      initializeTracking(nodes, edges)
      
      console.log('✅ Flow saved successfully')
    } catch (error) {
      console.error('❌ Save failed:', error)
    }
  }, [nodes, edges, processId, addNodeActions, addEdgeActions, getDeletedNodes, getDeletedEdges, initializeTracking])

  if (isLoading) return <div>Loading...</div>

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ padding: '10px', background: '#f5f5f5' }}>
        <button 
          onClick={handleSave}
          disabled={saveFlowMutation.isPending}
        >
          {saveFlowMutation.isPending ? 'Saving...' : 'Save Flow'}
        </button>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      />
    </div>
  )
}

export default ProcessFlowEditor
```

## How It Works

### Scenario: User Deletes a Node

```typescript
// 1. Initial state (loaded from database)
const initialNodes = [
  { id: 'node-1', ... },
  { id: 'node-2', ... },
  { id: 'node-3', ... },
]

// initializeTracking stores these IDs
// initialNodesRef.current = Set(['node-1', 'node-2', 'node-3'])

// 2. User deletes 'node-2'
const currentNodes = [
  { id: 'node-1', ... },
  { id: 'node-3', ... },
]

// 3. On save, getDeletedNodes compares:
const deletedNodes = getDeletedNodes(currentNodes)
// Returns: [{ id: 'node-2', action: 'DELETE', ... }]

// 4. Backend receives:
{
  nodes: [
    { id: 'node-1', action: 'EDIT', ... },  // Existing
    { id: 'node-3', action: 'EDIT', ... },  // Existing
    { id: 'node-2', action: 'DELETE', ... }, // ✅ Deleted!
  ]
}

// 5. Backend processes:
// - Keeps node-1 (EDIT)
// - Keeps node-3 (EDIT)
// - Deletes node-2 from database (DELETE)
```

### Scenario: Multiple Operations

```typescript
// Initial: 3 nodes
initialNodes = ['node-1', 'node-2', 'node-3']

// User actions:
// 1. Delete node-2
// 2. Add node-4
// 3. Edit node-1

currentNodes = [
  { id: 'node-1', label: 'Updated' },  // Modified
  { id: 'node-3', ... },               // Unchanged
  { id: 'node-temp-123', ... },        // New
]

// On save:
const nodesWithActions = addNodeActions(currentNodes)
// [
//   { id: 'node-1', action: 'EDIT' },
//   { id: 'node-3', action: 'EDIT' },
//   { id: 'node-temp-123', action: 'ADD' },
// ]

const deletedNodes = getDeletedNodes(currentNodes)
// [{ id: 'node-2', action: 'DELETE' }]

// Backend receives all 4 operations:
// - ADD node-temp-123 (new)
// - EDIT node-1 (modified)
// - EDIT node-3 (unchanged but sent anyway)
// - DELETE node-2 (removed)
```

## Backend Processing

The backend `flow.service.ts` handles deletions:

```typescript
// Extract nodes by action
const nodesToDelete = saveFlowDto.nodes.filter(n => n.action === FlowAction.DELETE)

// Delete from database
if (nodesToDelete.length > 0) {
  await tx.node.deleteMany({
    where: {
      versionId: version.id,
      id: { in: nodesToDelete.filter(n => n.id).map(n => n.id!) }
    }
  })
}

// Log result
console.log(`Flow saved: ${nodesToDelete.length} deleted`)
```

## Common Mistakes

### ❌ Mistake 1: Not calling initializeTracking

```typescript
// BAD - No tracking initialization
const { data } = useLoadFlow(processId)
setNodes(data.nodes)
// getDeletedNodes() returns empty array!
```

```typescript
// GOOD - Initialize tracking
const { data } = useLoadFlow(processId)
setNodes(data.nodes)
initializeTracking(data.nodes, data.edges) // ✅
```

### ❌ Mistake 2: Not sending deletedNodes

```typescript
// BAD - Deleted nodes not sent
saveFlowMutation.mutate({
  processId,
  nodes: nodesWithActions,
  edges: edgesWithActions,
  // deletedNodes missing!
})
```

```typescript
// GOOD - Include deleted items
const deletedNodes = getDeletedNodes(nodes)
saveFlowMutation.mutate({
  processId,
  nodes: nodesWithActions,
  edges: edgesWithActions,
  deletedNodes, // ✅
  deletedEdges,
})
```

### ❌ Mistake 3: Not re-initializing after save

```typescript
// BAD - Tracking state becomes stale
await saveFlow(...)
// Next save will think deleted items are still "missing"
```

```typescript
// GOOD - Reset tracking baseline
await saveFlow(...)
initializeTracking(nodes, edges) // ✅ Reset baseline
```

## Debugging

### Check What Will Be Deleted

```typescript
const deletedNodes = getDeletedNodes(nodes)
console.log('Will delete:', deletedNodes.map(n => n.id))

// Output: ['node-2', 'node-5']
```

### Verify Tracking State

```typescript
const {
  initializeTracking,
  getDeletedNodes,
  isInitialized,
} = useFlowChanges()

console.log('Tracking initialized?', isInitialized)

if (!isInitialized) {
  console.warn('⚠️ Tracking not initialized! Call initializeTracking() first')
}
```

### Backend Logs

Check backend console for deletion confirmation:

```
Flow saved: 5 nodes (2 new, 2 updated, 1 deleted), 3 edges (1 new, 1 updated, 1 deleted)
```

## Testing

### Manual Test

1. **Load a flow** with 3 nodes
2. **Delete 1 node** from canvas
3. **Save** the flow
4. **Reload** the page
5. **Verify** deleted node is gone ✅

### Unit Test

```typescript
import { renderHook, act } from '@testing-library/react'
import { useFlowChanges } from './useFlowChanges'

test('tracks deleted nodes', () => {
  const { result } = renderHook(() => useFlowChanges())

  // Initialize with 3 nodes
  const initialNodes = [
    { id: 'node-1', type: 'task', position: { x: 0, y: 0 }, data: {} },
    { id: 'node-2', type: 'task', position: { x: 0, y: 0 }, data: {} },
    { id: 'node-3', type: 'task', position: { x: 0, y: 0 }, data: {} },
  ]

  act(() => {
    result.current.initializeTracking(initialNodes, [])
  })

  // User deletes node-2
  const currentNodes = [
    { id: 'node-1', type: 'task', position: { x: 0, y: 0 }, data: {} },
    { id: 'node-3', type: 'task', position: { x: 0, y: 0 }, data: {} },
  ]

  // Get deleted nodes
  const deletedNodes = result.current.getDeletedNodes(currentNodes)

  expect(deletedNodes).toHaveLength(1)
  expect(deletedNodes[0].id).toBe('node-2')
  expect(deletedNodes[0].action).toBe('DELETE')
})
```

## Summary

| Action | Implementation |
|--------|----------------|
| **Load Flow** | Call `initializeTracking(nodes, edges)` |
| **Delete Node** | Remove from `nodes` array (ReactFlow handles this) |
| **Save Flow** | Call `getDeletedNodes(nodes)` and include in save |
| **Backend** | Receives nodes with `action: DELETE` and removes them |
| **After Save** | Call `initializeTracking(nodes, edges)` again |

✅ **Key Point**: The `useFlowChanges` hook tracks the **initial state** and compares it with the **current state** to find what was deleted.
