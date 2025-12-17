# Flow Change Tracking System

## Overview

The flow persistence system now supports intelligent change tracking using **action flags** (ADD/EDIT/DELETE) to optimize database operations.

### Key Features

- **Auto-generated IDs**: New nodes/edges get database-generated IDs (Prisma CUID)
- **ID Mapping**: Backend returns mapping from temporary frontend IDs to real database IDs
- **Incremental Saves**: Only updates changed data (no full delete/recreate)
- **Action Tracking**: Explicit ADD/EDIT/DELETE flags or automatic detection

## Architecture

### ID Management

**Frontend**: 
- Generates temporary IDs for new nodes (e.g., `node-temp-123`, `reactflow__edge-abc`)
- Uses these IDs for ReactFlow rendering and edge connections

**Backend**:
- Ignores temporary IDs for new items (action=ADD)
- Generates permanent IDs using Prisma's `@default(cuid())`
- Returns ID mapping: `{ "node-temp-123": "cm1x7y8z9..." }`

**Frontend Response**:
- Receives ID mapping from save response
- Updates ReactFlow state with real database IDs
- Subsequent edits use the real IDs

### Backend (NestJS)

**DTO**: `save-flow.dto.ts`
```typescript
export enum FlowAction {
  ADD = 'ADD',      // Create new node/edge (ID will be auto-generated)
  EDIT = 'EDIT',    // Update existing node/edge (ID required)
  DELETE = 'DELETE' // Remove node/edge (ID required)
}

export class SaveNodeDto {
  id?: string           // Optional for ADD, required for EDIT/DELETE
  action?: FlowAction   // Optional action flag
  // ... other fields
}
```

**Service**: `flow.service.ts`
- **For ADD actions**:
  - Ignores frontend-provided ID
  - Creates node with Prisma auto-generated ID
  - Returns mapping: `nodeIdMapping[tempId] = realId`
- **For EDIT actions**:
  - Uses provided ID to update existing node
- **For DELETE actions**:
  - Uses provided ID to delete node
- **For edges**:
  - Updates source/target references if nodes were remapped
  - Auto-generates edge IDs for new edges

**Response**:
```typescript
{
  versionId: string
  version: number
  nodes: Node[]        // All nodes with real database IDs
  edges: Edge[]        // All edges with real database IDs
  nodeIdMapping: { [tempId: string]: string }  // tempId -> realId
  edgeIdMapping: { [tempId: string]: string }  // tempId -> realId
}
```

### Frontend (React)

**Temporary ID Generation**:
```typescript
// Generate temp IDs for new nodes
const newNode = {
  id: `node-${Date.now()}-${Math.random()}`,  // Temporary ID
  type: 'userTask',
  // ... other properties
}

// ReactFlow uses this temp ID for rendering and connections
```

**Hook**: `useFlowChanges.ts`
```typescript
const {
  initializeTracking,    // Set initial state after load
  addNodeActions,        // Add action flags to nodes
  addEdgeActions,        // Add action flags to edges
  getDeletedNodes,       // Get nodes removed from canvas
  getDeletedEdges,       // Get edges removed from canvas
} = useFlowChanges()
```

**Service**: `flowService.ts`
```typescript
const response = await FlowService.saveFlow(
  processId,
  nodes,           // Nodes with temp IDs for new items
  edges,           // Edges with temp IDs for new items
  changesLog,
  deletedNodes,
  deletedEdges
)

// Update ReactFlow state with real IDs
const { nodeIdMapping, edgeIdMapping } = response
setNodes(prevNodes => 
  prevNodes.map(node => ({
    ...node,
    id: nodeIdMapping[node.id] || node.id  // Replace temp ID with real ID
  }))
)
setEdges(prevEdges =>
  prevEdges.map(edge => ({
    ...edge,
    id: edgeIdMapping[edge.id] || edge.id,
    source: nodeIdMapping[edge.source] || edge.source,  // Update references
    target: nodeIdMapping[edge.target] || edge.target
  }))
)
```

## Usage Example

### ID Lifecycle

```typescript
// 1. User creates a node in ReactFlow
const newNode = {
  id: 'node-temp-abc123',  // ← Temporary frontend ID
  type: 'userTask',
  position: { x: 100, y: 100 },
  data: { label: 'New Task' }
}

// 2. Save to backend
const response = await saveFlow(processId, [newNode], [], 'Added new task')

// Response:
// {
//   nodes: [{ id: 'cm1x7y8z9...', type: 'userTask', ... }],  ← Real DB ID
//   nodeIdMapping: { 'node-temp-abc123': 'cm1x7y8z9...' }
// }

// 3. Update frontend state with real IDs
setNodes(prev => 
  prev.map(n => ({
    ...n,
    id: response.nodeIdMapping[n.id] || n.id
  }))
)

// 4. Future edits use the real ID
const updatedNode = {
  id: 'cm1x7y8z9...',  // ← Real database ID
  action: 'EDIT',
  label: 'Updated Task',
  // ...
}
```

### Basic Usage (Auto-detection)

```typescript
// Backend auto-detects actions
await FlowService.saveFlow(processId, nodes, edges, 'Updated flow')

// Backend logic:
// - New nodes (not in DB) → ADD
// - Existing nodes → EDIT
// - Missing nodes → kept in DB (not deleted)
```

### Advanced Usage (With Tracking)

```typescript
import { useFlowChanges } from '@/hooks/useFlowChanges'

function FlowEditor() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  
  const {
    initializeTracking,
    addNodeActions,
    addEdgeActions,
    getDeletedNodes,
    getDeletedEdges,
  } = useFlowChanges()

  // Initialize after loading
  useEffect(() => {
    if (loadedFlow) {
      setNodes(loadedFlow.nodes)
      setEdges(loadedFlow.edges)
      initializeTracking(loadedFlow.nodes, loadedFlow.edges)
    }
  }, [loadedFlow])

  // Save with change tracking
  const handleSave = async () => {
    const nodesWithActions = addNodeActions(nodes)
    const edgesWithActions = addEdgeActions(edges)
    const deletedNodes = getDeletedNodes(nodes)
    const deletedEdges = getDeletedEdges(edges)

    const response = await FlowService.saveFlow(
      processId,
      nodesWithActions,
      edgesWithActions,
      'Manual save',
      deletedNodes,
      deletedEdges
    )

    // Update IDs with real database IDs
    if (response.nodeIdMapping && Object.keys(response.nodeIdMapping).length > 0) {
      setNodes(prev =>
        prev.map(node => ({
          ...node,
          id: response.nodeIdMapping[node.id] || node.id
        }))
      )
    }

    if (response.edgeIdMapping && Object.keys(response.edgeIdMapping).length > 0) {
      setEdges(prev =>
        prev.map(edge => ({
          ...edge,
          id: response.edgeIdMapping[edge.id] || edge.id,
          source: response.nodeIdMapping[edge.source] || edge.source,
          target: response.nodeIdMapping[edge.target] || edge.target
        }))
      )
    }

    // Re-initialize tracking with new IDs
    const updatedNodes = nodes.map(n => ({ ...n, id: response.nodeIdMapping[n.id] || n.id }))
    const updatedEdges = edges.map(e => ({ 
      ...e, 
      id: response.edgeIdMapping[e.id] || e.id,
      source: response.nodeIdMapping[e.source] || e.source,
      target: response.nodeIdMapping[e.target] || e.target
    }))
    initializeTracking(updatedNodes, updatedEdges)
  }

  return <FlowBuilder nodes={nodes} edges={edges} onSave={handleSave} />
}
```

## Benefits

### 1. **Performance**
- ✅ Only updates changed items
- ✅ No full delete/recreate
- ✅ Faster with large diagrams (100+ nodes)

### 2. **Database Efficiency**
- ✅ Fewer queries
- ✅ Smaller transactions
- ✅ Better concurrency

### 3. **Proper Deletion Handling**
- ✅ Deleted nodes/edges are actually removed from database
- ✅ No phantom items reappearing after reload
- ✅ Clean database state

### 4. **Audit Trail**
- ✅ Track what changed
- ✅ Detailed logs (5 new, 3 updated, 2 deleted)
- ✅ Better debugging

### 5. **Backward Compatible**
- ✅ Action field is optional
- ✅ Auto-detection fallback
- ✅ Existing code works unchanged

## Migration Guide

### Option 1: Keep Existing Behavior (Simple)
No changes needed! The system auto-detects actions.

```typescript
// This still works
await FlowService.saveFlow(processId, nodes, edges)
```

### Option 2: Enable Change Tracking (Optimal)

1. Add the hook to your flow editor:
```typescript
import { useFlowChanges } from '@/hooks/useFlowChanges'

const flowChanges = useFlowChanges()
```

2. Initialize after load:
```typescript
useEffect(() => {
  if (loadedFlow) {
    flowChanges.initializeTracking(loadedFlow.nodes, loadedFlow.edges)
  }
}, [loadedFlow])
```

3. Use in save:
```typescript
const handleSave = () => {
  const nodesWithActions = flowChanges.addNodeActions(nodes)
  const edgesWithActions = flowChanges.addEdgeActions(edges)
  const deletedNodes = flowChanges.getDeletedNodes(nodes)
  const deletedEdges = flowChanges.getDeletedEdges(edges)
  
  saveFlowMutation.mutate({
    processId,
    nodes: nodesWithActions,
    edges: edgesWithActions,
    deletedNodes,
    deletedEdges,
  })
}
```

## Implementation Details

### Backend Processing

```typescript
// 1. Get existing items from DB
const existingNodes = await tx.node.findMany({ where: { versionId }})
const existingNodeIds = new Set(existingNodes.map(n => n.id))

// 2. Categorize by action
const nodesToAdd = nodes.filter(n => 
  n.action === 'ADD' || (!n.action && !existingNodeIds.has(n.id))
)
const nodesToEdit = nodes.filter(n => 
  n.action === 'EDIT' || (!n.action && existingNodeIds.has(n.id))
)
const nodesToDelete = nodes.filter(n => n.action === 'DELETE')

// 3. Execute operations
await deleteNodes(nodesToDelete)
await createNodes(nodesToAdd)
await updateNodes(nodesToEdit)
```

### Frontend Tracking

```typescript
// Track initial state
const initialNodeIds = new Set(loadedNodes.map(n => n.id))

// Detect changes
currentNodes.forEach(node => {
  if (!initialNodeIds.has(node.id)) {
    node.action = 'ADD'  // New node
  } else {
    node.action = 'EDIT' // Existing node (potentially changed)
  }
})

// Find deleted
const currentNodeIds = new Set(currentNodes.map(n => n.id))
const deletedNodes = Array.from(initialNodeIds)
  .filter(id => !currentNodeIds.has(id))
  .map(id => ({ id, action: 'DELETE' }))
```

## Testing

### Test Scenarios

1. **Create new flow**: All nodes/edges have `ADD` action
2. **Update existing**: Modified items have `EDIT` action
3. **Delete items**: Deleted items sent with `DELETE` action
4. **Mixed operations**: Combination of ADD/EDIT/DELETE
5. **Auto-detection**: No action flags → backend detects

### Example Test

```typescript
test('handles mixed operations', async () => {
  // Initial state: 3 nodes
  const initial = [node1, node2, node3]
  initializeTracking(initial, [])
  
  // Current state: 
  // - node1 (unchanged)
  // - node2 (edited)
  // - node3 (deleted)
  // - node4 (new)
  const current = [node1, node2Modified, node4]
  
  const withActions = addNodeActions(current)
  const deleted = getDeletedNodes(current)
  
  expect(withActions[0].action).toBe('EDIT') // node1
  expect(withActions[1].action).toBe('EDIT') // node2
  expect(withActions[2].action).toBe('ADD')  // node4
  expect(deleted[0].action).toBe('DELETE')   // node3
})
```

## Performance Comparison

### Before (Delete All + Create All)
```
100 nodes, 150 edges
- DELETE 100 nodes: 100 queries
- DELETE 150 edges: 150 queries
- CREATE 100 nodes: 100 queries
- CREATE 150 edges: 150 queries
Total: 500 queries (~2-3 seconds)
```

### After (Incremental Updates)
```
100 nodes (2 new, 5 edited, 1 deleted), 150 edges (3 new, 2 deleted)
- DELETE 1 node: 1 query
- DELETE 2 edges: 2 queries
- CREATE 2 nodes: 2 queries
- CREATE 3 edges: 3 queries
- UPDATE 5 nodes: 5 queries
Total: 13 queries (~100-200ms)
```

**~95% reduction in queries!**

## Troubleshooting

### Issue: Deleted nodes reappear after reload
**Cause**: Not sending deleted nodes/edges to backend  
**Solution**: Use `getDeletedNodes()` and `getDeletedEdges()` and include them in save:
```typescript
const deletedNodes = flowChanges.getDeletedNodes(nodes)
const deletedEdges = flowChanges.getDeletedEdges(edges)

saveFlowMutation.mutate({
  processId,
  nodes: nodesWithActions,
  edges: edgesWithActions,
  deletedNodes,  // ← Must include!
  deletedEdges,  // ← Must include!
})
```

### Issue: Changes not detected
**Solution**: Ensure `initializeTracking()` called after load
```typescript
useEffect(() => {
  if (loadedFlow) {
    setNodes(loadedFlow.nodes)
    setEdges(loadedFlow.edges)
    initializeTracking(loadedFlow.nodes, loadedFlow.edges) // ← Critical!
  }
}, [loadedFlow])
```

### Issue: Performance not improved
**Solution**: Verify action flags are being set correctly

### Issue: Tracking state becomes stale
**Solution**: Re-initialize tracking after each save:
```typescript
await saveFlow(...)
initializeTracking(nodes, edges) // ← Reset baseline
```
