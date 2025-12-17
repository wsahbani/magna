# Flow ID Management

## Problem Statement

ReactFlow requires nodes and edges to have IDs for rendering and connections. However, Prisma auto-generates IDs using `@default(cuid())` when creating database records. This creates a mismatch:

- **Frontend**: Needs IDs immediately for ReactFlow rendering
- **Backend**: Generates IDs only when creating database records

## Solution: Temporary ID Mapping

We use a **temporary ID → real ID mapping** system:

1. Frontend generates temporary IDs for new nodes/edges
2. Backend creates records with auto-generated IDs
3. Backend returns mapping from temp IDs to real IDs
4. Frontend updates ReactFlow state with real IDs

## Implementation

### 1. Frontend: Generate Temporary IDs

```typescript
// When user creates a new node in ReactFlow
const createNode = (type: string, position: { x: number; y: number }) => {
  const newNode = {
    id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,  // Temporary ID
    type,
    position,
    data: { label: 'New Node' }
  }
  
  setNodes(prev => [...prev, newNode])
}

// Temporary ID example: "node-1699876543210-k4j2h8"
```

### 2. Backend: Auto-Generate Real IDs

**Schema** (`schema.prisma`):
```prisma
model Node {
  id String @id @default(cuid())  // Auto-generated
  // ... other fields
}
```

**DTO** (`save-flow.dto.ts`):
```typescript
export class SaveNodeDto {
  @IsOptional()
  @IsString()
  id?: string  // Optional - ignored for ADD action
  
  @IsOptional()
  @IsEnum(FlowAction)
  action?: FlowAction
  
  // ... other fields
}
```

**Service** (`flow.service.ts`):
```typescript
private async createNode(tx: any, versionId: string, node: SaveNodeDto) {
  return tx.node.create({
    data: {
      // id NOT included - Prisma auto-generates it
      versionId,
      type: node.type,
      label: node.label,
      // ... other fields
    },
  })
}
```

### 3. Backend: Return ID Mapping

```typescript
async saveFlow(saveFlowDto: SaveFlowDto, userId: string) {
  return await this.prisma.$transaction(async (tx) => {
    // Track temp ID → real ID mappings
    const nodeIdMapping: Record<string, string> = {}
    const edgeIdMapping: Record<string, string> = {}
    
    // Create nodes
    const createdNodes = await Promise.all(
      nodesToAdd.map(async (node) => {
        const created = await this.createNode(tx, version.id, node)
        if (node.id) {
          nodeIdMapping[node.id] = created.id  // Map temp → real
        }
        return created
      })
    )
    
    // Create edges (with updated source/target references)
    const createdEdges = await Promise.all(
      edgesToAdd.map(async (edge) => {
        const updatedEdge = {
          ...edge,
          source: nodeIdMapping[edge.source] || edge.source,  // Use real node ID
          target: nodeIdMapping[edge.target] || edge.target   // Use real node ID
        }
        const created = await this.createEdge(tx, version.id, updatedEdge)
        if (edge.id) {
          edgeIdMapping[edge.id] = created.id
        }
        return created
      })
    )
    
    return {
      versionId: version.id,
      nodes: [...createdNodes, ...updatedNodes],
      edges: [...createdEdges, ...updatedEdges],
      nodeIdMapping,  // { "node-temp-123": "cm1x7y8z9..." }
      edgeIdMapping   // { "edge-temp-456": "cm1x7y8z9..." }
    }
  })
}
```

### 4. Frontend: Update ReactFlow State

```typescript
const handleSave = async () => {
  const response = await FlowService.saveFlow(
    processId,
    nodes,
    edges,
    'Save changes'
  )
  
  // Update nodes with real database IDs
  if (response.nodeIdMapping && Object.keys(response.nodeIdMapping).length > 0) {
    setNodes(prevNodes =>
      prevNodes.map(node => ({
        ...node,
        id: response.nodeIdMapping[node.id] || node.id  // Replace temp with real
      }))
    )
  }
  
  // Update edges with real IDs and updated source/target references
  if (response.edgeIdMapping && Object.keys(response.edgeIdMapping).length > 0) {
    setEdges(prevEdges =>
      prevEdges.map(edge => ({
        ...edge,
        id: response.edgeIdMapping[edge.id] || edge.id,
        source: response.nodeIdMapping[edge.source] || edge.source,
        target: response.nodeIdMapping[edge.target] || edge.target
      }))
    )
  }
}
```

## Complete Lifecycle Example

```typescript
// === STEP 1: User creates a node ===
const newNode = {
  id: 'node-temp-abc123',  // ← Temporary ID
  type: 'userTask',
  position: { x: 100, y: 100 },
  data: { label: 'New Task' }
}
setNodes([...nodes, newNode])

// === STEP 2: User creates an edge ===
const newEdge = {
  id: 'edge-temp-xyz789',     // ← Temporary ID
  source: 'node-temp-abc123', // ← References temp node ID
  target: 'existing-node-id',
  type: 'smoothstep'
}
setEdges([...edges, newEdge])

// === STEP 3: User saves ===
const response = await saveFlow(processId, [newNode], [newEdge], 'Added task')

// Response:
// {
//   nodes: [
//     { id: 'cm1x7y8z9...', type: 'userTask', ... }  ← Real DB ID
//   ],
//   edges: [
//     { 
//       id: 'cm1x7y8z0...', 
//       source: 'cm1x7y8z9...',      ← Updated to real node ID
//       target: 'existing-node-id'
//     }
//   ],
//   nodeIdMapping: { 'node-temp-abc123': 'cm1x7y8z9...' },
//   edgeIdMapping: { 'edge-temp-xyz789': 'cm1x7y8z0...' }
// }

// === STEP 4: Update frontend state ===
setNodes(prev => 
  prev.map(n => ({
    ...n,
    id: response.nodeIdMapping[n.id] || n.id
  }))
)
// Result: node-temp-abc123 → cm1x7y8z9...

setEdges(prev =>
  prev.map(e => ({
    ...e,
    id: response.edgeIdMapping[e.id] || e.id,
    source: response.nodeIdMapping[e.source] || e.source,
    target: response.nodeIdMapping[e.target] || e.target
  }))
)
// Result: 
// - edge-temp-xyz789 → cm1x7y8z0...
// - source: node-temp-abc123 → cm1x7y8z9...

// === STEP 5: Future edits use real IDs ===
const editNode = {
  id: 'cm1x7y8z9...',  // ← Real database ID
  action: 'EDIT',
  label: 'Updated Task'
}
```

## Benefits

### 1. **Seamless User Experience**
- Users don't see temporary IDs
- No delay waiting for database IDs
- Instant visual feedback

### 2. **Data Integrity**
- Database controls ID generation (CUID = collision-resistant)
- No chance of duplicate IDs
- Consistent ID format

### 3. **Proper References**
- Edges automatically get correct node references
- No orphaned connections
- Clean database relationships

### 4. **Prisma Best Practices**
- Uses Prisma's auto-generation
- Follows `@id @default(cuid())` pattern
- No manual ID management

## Edge Cases

### Case 1: Create Node + Edge in Same Save

```typescript
const newNode = { id: 'temp-node-1', ... }
const newEdge = { 
  id: 'temp-edge-1',
  source: 'temp-node-1',  // ← References another temp ID
  target: 'existing-123'
}

// Backend automatically:
// 1. Creates node → gets real ID: 'cm1x...'
// 2. Maps: temp-node-1 → cm1x...
// 3. Creates edge with source: cm1x... (not temp-node-1)
```

### Case 2: Multiple New Nodes Connected

```typescript
const node1 = { id: 'temp-1', ... }
const node2 = { id: 'temp-2', ... }
const edge = {
  id: 'temp-edge',
  source: 'temp-1',
  target: 'temp-2'  // Both are temp IDs
}

// Backend:
// 1. Creates node1 → 'cm1x...' 
// 2. Creates node2 → 'cm1y...'
// 3. Maps: temp-1 → cm1x..., temp-2 → cm1y...
// 4. Creates edge with source: cm1x..., target: cm1y...
```

### Case 3: Update After Save

```typescript
// First save (new node)
const response1 = await save([{ id: 'temp-1', label: 'Task' }])
// nodeIdMapping: { 'temp-1': 'cm1x...' }

// Update frontend
setNodes(prev => prev.map(n => ({ 
  ...n, 
  id: response1.nodeIdMapping[n.id] || n.id 
})))

// Second save (edit node) - uses real ID
const response2 = await save([{
  id: 'cm1x...',  // ← Real ID from previous save
  action: 'EDIT',
  label: 'Updated Task'
}])
```

## Troubleshooting

### Issue: Edges pointing to wrong nodes
**Cause**: Frontend not updating edge source/target with real node IDs  
**Solution**: Always update both edge ID and source/target references:
```typescript
setEdges(prev =>
  prev.map(e => ({
    ...e,
    id: edgeIdMapping[e.id] || e.id,
    source: nodeIdMapping[e.source] || e.source,  // ← Don't forget this
    target: nodeIdMapping[e.target] || e.target   // ← And this
  }))
)
```

### Issue: Duplicate nodes after save
**Cause**: Not replacing temp IDs in frontend state  
**Solution**: Update state immediately after save response

### Issue: Can't edit newly created node
**Cause**: Frontend still using temp ID, backend has real ID  
**Solution**: Ensure state update includes ID mapping

### Issue: Changes lost after reload
**Cause**: Frontend state has temp IDs, database has real IDs  
**Solution**: Always update IDs before next save or reload from server

## Testing

### Unit Test Example

```typescript
describe('ID Mapping', () => {
  it('should replace temp IDs with real IDs', async () => {
    const tempNode = { id: 'temp-node', type: 'task', ... }
    
    const response = await flowService.saveFlow({
      processId: 'proc-1',
      nodes: [tempNode],
      edges: []
    })
    
    expect(response.nodeIdMapping['temp-node']).toBeDefined()
    expect(response.nodeIdMapping['temp-node']).toMatch(/^c[a-z0-9]{24}$/)  // CUID format
    expect(response.nodes[0].id).not.toBe('temp-node')
    expect(response.nodes[0].id).toBe(response.nodeIdMapping['temp-node'])
  })
  
  it('should update edge references to real node IDs', async () => {
    const tempNode1 = { id: 'temp-1', ... }
    const tempNode2 = { id: 'temp-2', ... }
    const tempEdge = { id: 'temp-edge', source: 'temp-1', target: 'temp-2' }
    
    const response = await flowService.saveFlow({
      processId: 'proc-1',
      nodes: [tempNode1, tempNode2],
      edges: [tempEdge]
    })
    
    const realNode1Id = response.nodeIdMapping['temp-1']
    const realNode2Id = response.nodeIdMapping['temp-2']
    
    expect(response.edges[0].source).toBe(realNode1Id)
    expect(response.edges[0].target).toBe(realNode2Id)
  })
})
```

## Summary

| Aspect | Solution |
|--------|----------|
| **Problem** | ReactFlow needs IDs before database creation |
| **Frontend** | Generates temporary IDs (`node-temp-xxx`) |
| **Backend** | Auto-generates real IDs via Prisma CUID |
| **Mapping** | Backend returns `{ tempId: realId }` mapping |
| **Update** | Frontend replaces temp IDs with real IDs |
| **Benefits** | Data integrity + instant UX + clean code |
