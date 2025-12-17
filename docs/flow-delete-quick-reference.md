# Flow Save/Delete Quick Reference

## The Problem You Had

**Issue**: When you delete nodes locally and save, they reappear after reload.

**Why**: Backend only receives the remaining nodes. It doesn't know which ones were deleted.

## The Solution (3 Steps)

### 1️⃣ Initialize Tracking (on load)

```typescript
import { useFlowChanges } from '@/hooks/useFlowChanges'

const { initializeTracking, getDeletedNodes, getDeletedEdges, addNodeActions, addEdgeActions } = useFlowChanges()

useEffect(() => {
  if (flowData) {
    setNodes(flowData.nodes)
    setEdges(flowData.edges)
    initializeTracking(flowData.nodes, flowData.edges) // ✅ Store initial state
  }
}, [flowData])
```

### 2️⃣ Get Deleted Items (before save)

```typescript
const handleSave = async () => {
  const nodesWithActions = addNodeActions(nodes)
  const edgesWithActions = addEdgeActions(edges)
  
  // ✅ Get what was deleted
  const deletedNodes = getDeletedNodes(nodes)
  const deletedEdges = getDeletedEdges(edges)
  
  // ... continue with save
}
```

### 3️⃣ Send Deleted Items to Backend

```typescript
await saveFlowMutation.mutateAsync({
  processId,
  nodes: nodesWithActions,
  edges: edgesWithActions,
  deletedNodes,  // ✅ Include deleted!
  deletedEdges,  // ✅ Include deleted!
})

// ✅ Re-initialize for next save
initializeTracking(nodes, edges)
```

## Complete Example

```typescript
function FlowEditor({ processId }: { processId: string }) {
  const [nodes, setNodes] = useNodesState([])
  const [edges, setEdges] = useEdgesState([])
  
  const flowChanges = useFlowChanges()
  const { data: flowData } = useLoadFlow(processId)
  const saveFlowMutation = useSaveFlow()

  // 1. Load and initialize
  useEffect(() => {
    if (flowData) {
      setNodes(flowData.nodes)
      setEdges(flowData.edges)
      flowChanges.initializeTracking(flowData.nodes, flowData.edges)
    }
  }, [flowData])

  // 2. Save with deletions
  const handleSave = async () => {
    const nodesWithActions = flowChanges.addNodeActions(nodes)
    const edgesWithActions = flowChanges.addEdgeActions(edges)
    const deletedNodes = flowChanges.getDeletedNodes(nodes)
    const deletedEdges = flowChanges.getDeletedEdges(edges)

    await saveFlowMutation.mutateAsync({
      processId,
      nodes: nodesWithActions,
      edges: edgesWithActions,
      changesLog: 'Save',
      deletedNodes,
      deletedEdges,
    })

    flowChanges.initializeTracking(nodes, edges)
  }

  return <ReactFlow nodes={nodes} edges={edges} /* ... */ />
}
```

## How It Works

```typescript
// Load: 3 nodes
initialNodes = ['A', 'B', 'C']
initializeTracking(['A', 'B', 'C']) // ← Stores this

// User deletes 'B'
currentNodes = ['A', 'C']

// On save:
getDeletedNodes(['A', 'C']) 
// → Compares with initial state
// → Returns [{ id: 'B', action: 'DELETE' }]

// Backend receives:
{
  nodes: [
    { id: 'A', action: 'EDIT' },
    { id: 'C', action: 'EDIT' },
    { id: 'B', action: 'DELETE' }, // ← Deleted!
  ]
}

// Backend deletes 'B' from database ✅
```

## Checklist

- [ ] Called `initializeTracking()` after loading flow
- [ ] Called `getDeletedNodes()` before saving
- [ ] Passed `deletedNodes` to `saveFlow()`
- [ ] Called `initializeTracking()` after saving (to reset)
- [ ] Tested: Delete node → Save → Reload → Node stays deleted ✅

## Common Mistakes

❌ **Not including deleted items**
```typescript
saveFlow(processId, nodes, edges) // Missing deletedNodes!
```

✅ **Correct**
```typescript
const deletedNodes = getDeletedNodes(nodes)
saveFlow(processId, nodes, edges, 'Save', deletedNodes, deletedEdges)
```

---

❌ **Not initializing tracking**
```typescript
setNodes(flowData.nodes) // No initializeTracking!
```

✅ **Correct**
```typescript
setNodes(flowData.nodes)
initializeTracking(flowData.nodes, flowData.edges)
```

---

❌ **Not re-initializing after save**
```typescript
await saveFlow(...)
// Next save will be wrong!
```

✅ **Correct**
```typescript
await saveFlow(...)
initializeTracking(nodes, edges) // Reset baseline
```

## Testing

```bash
# 1. Load flow with 5 nodes
# 2. Delete 2 nodes
# 3. Save
# 4. Reload page
# 5. Verify only 3 nodes remain ✅
```

## Need Help?

See full documentation:
- `docs/flow-deletion-tracking.md` - Complete guide
- `docs/flow-change-tracking.md` - Change tracking system
- `docs/flow-id-management.md` - ID handling
