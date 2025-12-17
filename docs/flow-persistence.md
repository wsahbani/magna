# Flow Persistence Feature

Complete guide to saving and loading flow diagrams in the Process Management System.

## Architecture Overview

The flow persistence system implements a **three-layer architecture**:

1. **Backend (NestJS)** - Process flow API endpoints with Prisma ORM
2. **Frontend Service** - API client abstraction layer
3. **React Hooks** - Auto-save, manual save, and load functionality

---

## Backend API

### Endpoints

#### 1. Save Flow Diagram
```http
POST /process/:processVersionId/flow
```

**Request Body:**
```json
{
  "nodes": [
    {
      "id": "node-1",
      "type": "task",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "Task 1" }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "processVersionId": "uuid",
  "message": "Flow diagram saved successfully"
}
```

#### 2. Load Flow Diagram
```http
GET /process/:processVersionId/flow
```

**Response:**
```json
{
  "nodes": [...],
  "edges": [...],
  "processVersionId": "uuid",
  "lastModified": "2025-11-10T12:00:00Z"
}
```

#### 3. Create Process with Flow
```http
POST /process/create-with-flow
```

**Request Body:**
```json
{
  "processData": {
    "name": "New Process",
    "description": "Process description",
    "level": 1,
    "parentId": "optional-parent-uuid"
  },
  "nodes": [...],
  "edges": [...]
}
```

#### 4. Export Flow (Future Enhancement)
```http
GET /process/:processVersionId/flow/export?format=json|png|svg|pdf
```

---

## Backend Implementation

### File Structure
```
apps/api/src/modules/process/
├── dto/
│   ├── save-flow.dto.ts          # Flow save validation
│   └── create-process-flow.dto.ts # Create with flow validation
├── services/
│   └── flow.service.ts           # Flow business logic
└── process.controller.ts         # Flow endpoints
```

### DTOs (Data Transfer Objects)

**SaveFlowDto** (`dto/save-flow.dto.ts`):
```typescript
export class SaveFlowDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NodeDto)
  nodes: NodeDto[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EdgeDto)
  edges: EdgeDto[]
}
```

**NodeDto** and **EdgeDto** validate ReactFlow node/edge structures.

### Flow Service

**FlowService** (`services/flow.service.ts`):

Key methods:
- `saveFlow(processVersionId, nodes, edges)` - Persist flow to database
- `loadFlow(processVersionId)` - Retrieve flow from database
- `createProcessWithFlow(processData, nodes, edges)` - Create process and initial flow
- `deleteFlow(processVersionId)` - Remove flow diagram
- `validateFlow(nodes, edges)` - Business rule validation

**Database Operations:**
```typescript
async saveFlow(processVersionId: string, nodes: Node[], edges: Edge[]) {
  // 1. Delete existing nodes and edges
  await this.prisma.node.deleteMany({ 
    where: { processVersionId } 
  })
  await this.prisma.edge.deleteMany({ 
    where: { processVersionId } 
  })

  // 2. Create new nodes
  await this.prisma.node.createMany({
    data: nodes.map(node => ({
      id: node.id,
      processVersionId,
      type: node.type,
      position: node.position,
      data: node.data
    }))
  })

  // 3. Create new edges
  await this.prisma.edge.createMany({
    data: edges.map(edge => ({
      id: edge.id,
      processVersionId,
      source: edge.source,
      target: edge.target,
      ...
    }))
  })
}
```

---

## Frontend Integration

### File Structure
```
apps/web/src/
├── services/
│   └── flowService.ts            # API client
├── hooks/
│   └── useFlowPersistence.ts     # React Query hooks
└── components/FlowBuilder/
    ├── FlowBuilder.tsx           # Main component with persistence
    └── Toolbar.tsx               # Save UI controls
```

### Flow Service

**FlowService** (`services/flowService.ts`):

```typescript
export class FlowService {
  static async saveFlow(processVersionId: string, nodes: Node[], edges: Edge[])
  static async loadFlow(processVersionId: string)
  static async autoSaveFlow(processVersionId: string, nodes: Node[], edges: Edge[])
  static async createProcessWithFlow(processData, nodes, edges)
  static async exportFlow(processVersionId: string, format: 'json' | 'png' | 'svg')
  static async validateFlow(nodes: Node[], edges: Edge[])
}
```

### React Hooks

**useFlowPersistence.ts** provides:

#### 1. Manual Save Hook
```typescript
const { mutate: saveFlow, isPending, error } = useSaveFlow()

// Usage
saveFlow({
  processVersionId: 'uuid',
  nodes: currentNodes,
  edges: currentEdges
})
```

#### 2. Load Flow Hook
```typescript
const { data, isLoading, error } = useLoadFlow(processVersionId)

// data structure:
{
  nodes: Node[],
  edges: Edge[],
  processVersionId: string,
  lastModified: string
}
```

#### 3. Auto-Save Hook
```typescript
const { 
  autoSave, 
  isAutoSaving, 
  autoSaveError 
} = useAutoSaveFlow(processVersionId, 2000) // 2s debounce

// Usage - auto-saves with debouncing
useEffect(() => {
  autoSave(nodes, edges)
}, [nodes, edges])
```

---

## FlowBuilder Integration

### Props

```typescript
interface FlowBuilderProps {
  // ... existing props
  
  // Flow persistence props
  processVersionId?: string | null
  enableAutoSave?: boolean
  autoSaveDelay?: number
  onLoadSuccess?: (nodes: Node[], edges: Edge[]) => void
  onLoadError?: (error: Error) => void
  onSaveSuccess?: (message: string) => void
  onSaveError?: (error: Error) => void
}
```

### Usage Example

```tsx
function ProcessEditor() {
  const [processVersionId] = useState('process-uuid')
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  return (
    <FlowBuilder
      nodes={nodes}
      edges={edges}
      onNodesChange={setNodes}
      onEdgesChange={setEdges}
      
      // Enable flow persistence
      processVersionId={processVersionId}
      enableAutoSave={true}
      autoSaveDelay={2000}
      
      // Success/error callbacks
      onLoadSuccess={(nodes, edges) => {
        console.log('Flow loaded:', nodes.length, 'nodes')
      }}
      onSaveSuccess={(message) => {
        toast.success(message)
      }}
      onSaveError={(error) => {
        toast.error(`Save failed: ${error.message}`)
      }}
    />
  )
}
```

### Automatic Behaviors

1. **Auto-Load**: When `processVersionId` changes, flow loads automatically
2. **Auto-Save**: When nodes/edges change, saves after debounce delay (default 2s)
3. **Manual Save**: Click "Save" button in Toolbar for immediate save
4. **Error Recovery**: Failed auto-saves show error indicator but don't block user

---

## Toolbar Save Status

The Toolbar displays real-time save status:

### Status Indicators

1. **Save Button States**:
   - Normal: "Save" button enabled
   - Saving: "Saving..." with spinner icon, disabled
   - Loading Flow: Disabled while loading
   - Error: Shows error icon with tooltip

2. **Auto-Save Indicator**:
   - Shows "Auto-saving..." with spinner when auto-save is in progress
   - Appears next to save button
   - Disappears after successful save

3. **Error Indicator**:
   - Red "Save failed" message with alert icon
   - Hover for error details
   - Manual save button remains available for retry

4. **Loading Indicator**:
   - Blue "Loading..." message when fetching flow data
   - Shows on initial load and when processVersionId changes

### Visual Examples

```
┌─────────────────────────────────────────────┐
│ [💾 Save] │ [Auto-saving... ⟳]              │  ← Auto-save in progress
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ [⟳ Saving...] │                             │  ← Manual save in progress
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ [💾 Save] │ [❌ Save failed]                 │  ← Error state
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ [💾 Save (disabled)] │ [⟳ Loading...]       │  ← Loading state
└─────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FlowBuilder                              │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────────┐  │
│  │   useLoad    │───▶│  Load Nodes  │───▶│  onLoadSuccess  │  │
│  │     Flow     │    │   & Edges    │    │                 │  │
│  └──────────────┘    └──────────────┘    └─────────────────┘  │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────────┐  │
│  │ Node/Edge    │───▶│  Auto-Save   │───▶│   FlowService   │  │
│  │   Changes    │    │  (debounced) │    │                 │  │
│  └──────────────┘    └──────────────┘    └─────────────────┘  │
│                                                    │            │
│  ┌──────────────┐    ┌──────────────┐             │            │
│  │ Save Button  │───▶│ Manual Save  │─────────────┘            │
│  │   Click      │    │  (immediate) │                          │
│  └──────────────┘    └──────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   Backend API       │
                   │                     │
                   │  POST /flow         │
                   │  GET /flow          │
                   └─────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   Prisma ORM        │
                   │                     │
                   │  Node table         │
                   │  Edge table         │
                   └─────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   PostgreSQL        │
                   └─────────────────────┘
```

---

## Best Practices

### 1. Error Handling
```typescript
<FlowBuilder
  onSaveError={(error) => {
    // Log to monitoring service
    console.error('Flow save failed:', error)
    
    // Show user-friendly message
    toast.error('Failed to save diagram. Changes are stored locally.')
    
    // Store in localStorage as backup
    localStorage.setItem('flowBackup', JSON.stringify({ nodes, edges }))
  }}
/>
```

### 2. Optimistic Updates
The system uses React Query's cache to provide instant feedback:
- Changes appear immediately
- Auto-save happens in background
- Cache updated on success
- Rollback on error (future enhancement)

### 3. Debounce Configuration
```typescript
// Fast auto-save for small diagrams
autoSaveDelay={1000}  // 1 second

// Standard for medium diagrams
autoSaveDelay={2000}  // 2 seconds (default)

// Conservative for large diagrams
autoSaveDelay={5000}  // 5 seconds
```

### 4. Loading States
```typescript
const { isLoading } = useLoadFlow(processVersionId)

if (isLoading) {
  return <FlowSkeleton />
}

return <FlowBuilder ... />
```

---

## Database Schema

### Node Table
```prisma
model Node {
  id                String          @id
  processVersionId  String
  type              String
  position          Json            // { x: number, y: number }
  data              Json            // ReactFlow node data
  parentNode        String?
  extent            String?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  
  processVersion    ProcessVersion  @relation(fields: [processVersionId], references: [id])
  
  @@index([processVersionId])
}
```

### Edge Table
```prisma
model Edge {
  id                String          @id
  processVersionId  String
  source            String
  target            String
  sourceHandle      String?
  targetHandle      String?
  type              String?
  animated          Boolean         @default(false)
  style             Json?
  data              Json?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  
  processVersion    ProcessVersion  @relation(fields: [processVersionId], references: [id])
  
  @@index([processVersionId])
  @@index([source])
  @@index([target])
}
```

---

## Testing

### API Testing
```bash
# Save flow
curl -X POST http://localhost:3001/process/:id/flow \
  -H "Content-Type: application/json" \
  -d '{"nodes":[...],"edges":[...]}'

# Load flow
curl http://localhost:3001/process/:id/flow
```

### Frontend Testing
```typescript
describe('Flow Persistence', () => {
  it('should load flow on mount', async () => {
    render(<FlowBuilder processVersionId="test-id" />)
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })
  })

  it('should auto-save after changes', async () => {
    const { rerender } = render(<FlowBuilder nodes={[]} edges={[]} />)
    
    rerender(<FlowBuilder nodes={[newNode]} edges={[]} />)
    
    await waitFor(() => {
      expect(mockAutoSave).toHaveBeenCalled()
    }, { timeout: 3000 })
  })
})
```

---

## Troubleshooting

### Issue: Auto-save not working
**Solution**: Check that `processVersionId` is provided and `enableAutoSave={true}`

### Issue: Flow doesn't load
**Solution**: Verify processVersionId exists in database and user has permissions

### Issue: Save errors
**Solution**: Check network tab for API errors, verify data structure matches DTOs

### Issue: Performance issues with large diagrams
**Solution**: 
- Increase `autoSaveDelay` to reduce save frequency
- Implement pagination for node/edge lists (future enhancement)
- Use React.memo() for node components

---

## Future Enhancements

1. **Version History**
   - Track all flow versions
   - Diff viewer between versions
   - Rollback to previous version

2. **Collaborative Editing**
   - WebSocket-based real-time updates
   - Conflict resolution
   - User presence indicators

3. **Export Formats**
   - PNG/SVG image export
   - PDF documentation export
   - BPMN 2.0 XML export

4. **Advanced Validation**
   - Business rule validation
   - Circular dependency detection
   - Completeness checking

5. **Offline Support**
   - IndexedDB storage
   - Sync queue for offline changes
   - Conflict resolution on reconnect

---

## API Reference Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/process/:id/flow` | Save flow diagram |
| GET | `/process/:id/flow` | Load flow diagram |
| POST | `/process/create-with-flow` | Create process with initial flow |
| GET | `/process/:id/flow/export` | Export flow (future) |
| GET | `/process/:id/flow/history` | Get version history (future) |
| POST | `/process/flow/validate` | Validate flow structure (future) |

---

## Related Documentation

- [FlowBuilder Component](./flow-builder-component.md)
- [Process Module API](./process-module.md)
- [ReactFlow Integration](./reactflow-integration.md)
- [Authentication](./authentication.md)
