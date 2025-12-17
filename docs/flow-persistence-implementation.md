# Flow Persistence Implementation

## Overview
Complete implementation of flow diagram persistence for the Process Management System. Enables saving, loading, and auto-saving of React Flow diagrams (nodes + edges) to the database.

## Backend Implementation (API)

### DTOs Created
- **`SaveFlowDto`** (`apps/api/src/modules/process/dto/save-flow.dto.ts`)
  - Validates nodes and edges arrays
  - Used for saving flow diagrams to database

### Services Added
- **`FlowService`** (`apps/api/src/modules/process/services/flow.service.ts`)
  - `saveFlow()` - Saves nodes and edges to ProcessLayout table
  - `loadFlow()` - Retrieves saved flow for a process version
  - Handles JSON serialization/deserialization
  - Manages ProcessLayout records (creates/updates)

### Controller Endpoints
- **POST** `/process/:processVersionId/flow` - Save flow diagram
- **GET** `/process/:processVersionId/flow` - Load flow diagram

### Database Schema
Uses existing `ProcessLayout` model from Prisma schema:
```prisma
model ProcessLayout {
  id               String          @id @default(uuid())
  processVersionId String
  nodes            Json            // Stores ReactFlow nodes
  edges            Json            // Stores ReactFlow edges
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  processVersion   ProcessVersion  @relation(fields: [processVersionId], references: [id])
}
```

## Frontend Implementation

### Services Created
- **`FlowService`** (`apps/web/src/services/flowService.ts`)
  - `saveFlow()` - API call to save flow
  - `loadFlow()` - API call to load flow
  - `autoSaveFlow()` - Debounced auto-save
  - `createProcessWithFlow()` - Create process with initial flow
  - `exportFlow()` - Export flow to various formats
  - `validateFlow()` - Validate flow diagram
  - `getFlowHistory()` - Get flow version history

### React Hooks Created
- **`useFlowPersistence.ts`** (`apps/web/src/hooks/useFlowPersistence.ts`)
  - `useSaveFlow()` - Manual save with React Query mutation
  - `useLoadFlow()` - Load flow with caching
  - `useAutoSaveFlow()` - Auto-save with custom debouncing (2s default)
  - `useCreateProcessWithFlow()` - Create process + flow atomically
  - `useValidateFlow()` - Validate flow before save
  - `useExportFlow()` - Export flow with download
  - `useFlowHistory()` - Get flow history

### FlowBuilder Integration
Updated `FlowBuilder.tsx` with new props:
```typescript
interface FlowBuilderProps {
  // Existing props...
  
  // New persistence props
  processVersionId?: string | null
  enableAutoSave?: boolean
  autoSaveDelay?: number
  onLoadSuccess?: (nodes: Node[], edges: Edge[]) => void
  onLoadError?: (error: Error) => void
  onSaveSuccess?: (message: string) => void
  onSaveError?: (error: Error) => void
}
```

**Features:**
- Auto-loads flow when `processVersionId` is provided
- Auto-saves on every change (debounced)
- Manual save button in toolbar
- Save status indicators (saving, auto-saving, errors)
- Loading state during initial flow fetch

### Toolbar Enhancements
Updated `Toolbar.tsx` with save status UI:
- Save button shows loading spinner when saving
- Displays "Saving...", "Auto-saving..." states
- Error indicator with icon
- Disabled state during saves/loads

## Usage Examples

### Basic Usage with Auto-Save
```typescript
<FlowBuilder
  nodes={nodes}
  edges={edges}
  onNodesChange={setNodes}
  onEdgesChange={setEdges}
  processVersionId={processVersion.id}
  enableAutoSave={true}
  autoSaveDelay={2000}
  onSaveSuccess={(msg) => console.log(msg)}
  onSaveError={(err) => console.error(err)}
/>
```

### Manual Save Only
```typescript
<FlowBuilder
  nodes={nodes}
  edges={edges}
  onNodesChange={setNodes}
  onEdgesChange={setEdges}
  processVersionId={processVersion.id}
  enableAutoSave={false}
  onSave={(nodes, edges) => {
    // Custom save logic
  }}
/>
```

### Using Hooks Directly
```typescript
const { data: flow, isLoading } = useLoadFlow(processVersionId)
const saveFlowMutation = useSaveFlow()
const { autoSave, isAutoSaving } = useAutoSaveFlow(processVersionId)

// Manual save
await saveFlowMutation.mutateAsync({
  processVersionId,
  nodes,
  edges
})

// Auto-save (debounced)
useEffect(() => {
  autoSave(nodes, edges)
}, [nodes, edges])
```

## Key Features

### 1. Auto-Save
- Debounced (default 2 seconds)
- Silent background saves
- No UI blocking
- Error handling without interruption

### 2. Manual Save
- Toolbar save button
- Visual feedback (spinner, states)
- Success/error callbacks
- Can disable auto-save if needed

### 3. Load on Mount
- Automatically loads flow when processVersionId changes
- Handles loading states
- Error recovery
- Callbacks for success/failure

### 4. Cache Management
- React Query cache invalidation
- Optimistic updates
- Stale-while-revalidate pattern
- 5-minute cache TTL

### 5. Error Handling
- API error capture
- User-friendly error messages
- Non-blocking error UI
- Retry mechanisms

## Performance Considerations

### Debouncing
- Auto-save debounced to 2 seconds (configurable)
- Prevents excessive API calls during rapid changes
- Uses window.setTimeout for browser compatibility

### Caching
- React Query caches loaded flows
- 5-minute stale time
- Background refetching
- Optimistic updates for saves

### Data Size
- Nodes and edges stored as JSON
- PostgreSQL handles JSON efficiently
- No size limit on number of nodes/edges
- Consider pagination for very large diagrams (>1000 nodes)

## Security

### Authentication
- All endpoints use JWT authentication via Passport
- Requires valid access token
- Token refresh on 401

### Authorization
- Only process owners/collaborators can save
- Read access based on process visibility
- Implements role-based access control

## Testing

### Backend Tests
```bash
cd apps/api
pnpm test
```

### Frontend Tests
```bash
cd apps/web
pnpm test
```

### E2E Test Scenarios
1. Create new flow → save → reload → verify
2. Load existing flow → modify → auto-save → verify
3. Network error during save → retry → verify
4. Multiple rapid changes → debounced save → single API call

## Future Enhancements

### Planned Features
- [ ] Flow version history with rollback
- [ ] Collaborative editing (real-time)
- [ ] Flow templates library
- [ ] Export to PNG/SVG/PDF
- [ ] Flow validation rules
- [ ] Undo/redo with flow persistence
- [ ] Conflict resolution for concurrent edits
- [ ] Offline support with local storage

### Performance Improvements
- [ ] Delta updates (only changed nodes/edges)
- [ ] Compression for large flows
- [ ] Lazy loading for huge diagrams
- [ ] Virtual scrolling for node palette

## API Reference

### POST /process/:processVersionId/flow
**Request:**
```json
{
  "nodes": [
    {
      "id": "1",
      "type": "startEvent",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "Start" }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "processVersionId": "uuid",
  "message": "Flow saved successfully"
}
```

### GET /process/:processVersionId/flow
**Response:**
```json
{
  "nodes": [...],
  "edges": [...],
  "processVersionId": "uuid",
  "lastModified": "2025-11-10T12:00:00Z"
}
```

## Troubleshooting

### Auto-save not working
1. Check `enableAutoSave={true}`
2. Verify `processVersionId` is set
3. Check browser console for errors
4. Verify API endpoint accessibility

### Save button disabled
- Loading flow in progress
- Save operation in progress
- Check `readOnly` prop

### Flow not loading
- Verify processVersionId is valid
- Check API endpoint returns 200
- Check network tab for errors
- Verify authentication token

## Architecture Decisions

### Why React Query?
- Built-in caching and state management
- Automatic background refetching
- Optimistic updates
- Retry logic
- DevTools for debugging

### Why Debouncing?
- Reduces API calls during active editing
- Improves performance
- Better UX (no save lag)
- Configurable delay

### Why JSON Storage?
- PostgreSQL has excellent JSON support
- Flexible schema for nodes/edges
- No need for separate tables
- Easy to query and update

### Why ProcessLayout Table?
- Existing schema supports it
- One-to-one with ProcessVersion
- Timestamps for audit trail
- Clean separation of concerns

## Dependencies

### Backend
- `@nestjs/common` - NestJS framework
- `@nestjs/swagger` - API documentation
- `class-validator` - DTO validation
- `@prisma/client` - Database ORM

### Frontend
- `@tanstack/react-query` - Data fetching/caching
- `@xyflow/react` - Flow diagram library
- `axios` - HTTP client
- `react` - UI framework

## Related Documentation
- [Flow Builder Component](./flow-builder-component.md)
- [Process Module](./process-module.md)
- [ReactFlow Integration](./reactflow-integration.md)
- [API Documentation](./api.md)
