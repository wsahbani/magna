# Process Management Module

## Overview

The Process Management module is the core feature of the Process Manager Orange application, implementing a comprehensive business process management system based on **PYX4 methodology**. It enables users to create, organize, and visualize hierarchical business processes with workflow diagrams.

## Architecture

### Three-Level Hierarchy

The module implements a strict three-level process hierarchy:

1. **Level 1 - Processus (Process)**: Top-level strategic processes
2. **Level 2 - Procédure (Procedure)**: Detailed procedures within processes
3. **Level 3 - Instruction (Instruction)**: Specific work instructions

Each level must respect the constraint: `child.level > parent.level`

### Five-State Workflow

Processes follow a defined lifecycle with five status states:

1. **DRAFT** (Brouillon): Initial creation, work in progress
2. **REVIEW** (En révision): Submitted for review
3. **APPROVED** (Approuvé): Validated but not yet published
4. **PUBLISHED** (Publié): Active and accessible to users
5. **ARCHIVED** (Archivé): Obsolete, kept for historical reference

Status transitions are controlled by business rules to ensure process integrity.

## Technical Stack

### Frontend

- **React 18.3.1**: Component framework
- **TanStack React Query 5.90.5**: Server state management
- **@xyflow/react 12.9.2**: Workflow diagram visualization
- **Tailwind CSS**: Styling with Orange brand colors
- **TypeScript**: Type safety

### Backend (API Module)

- **NestJS**: Server framework
- **Prisma ORM**: Database layer
- **PostgreSQL**: Data persistence
- **Clean Architecture**: Modules, services, repositories, DTOs

## Directory Structure

```
apps/web/src/features/processes/
├── components/
│   ├── ProcessCard.tsx           # Card display component
│   └── ProcessForm.tsx           # Create/edit form
├── hooks/
│   └── useProcesses.ts           # React Query hooks
├── pages/
│   └── ProcessesPage.tsx         # Main listing page
├── types/
│   └── process.types.ts          # TypeScript definitions
└── lib/
    └── api/
        └── process.api.ts        # API client service

apps/api/src/modules/process/
├── controllers/
│   └── process.controller.ts     # REST endpoints
├── services/
│   └── process.service.ts        # Business logic
├── repositories/
│   └── process.repository.ts     # Data access
├── dto/
│   ├── create-process.dto.ts     # Creation DTO
│   ├── update-process.dto.ts     # Update DTO
│   └── query-process.dto.ts      # Query parameters
└── entities/
    └── process.entity.ts         # Domain interfaces
```

## Frontend Implementation

### Type Definitions

```typescript
// Process Enums
export enum ProcessLevel {
  PROCESSUS = 1,
  PROCEDURE = 2,
  INSTRUCTION = 3,
}

export enum ProcessStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// Main Process Interface
export interface Process {
  id: string
  name: string
  description?: string
  code: string              // Unique identifier
  level: ProcessLevel
  status: ProcessStatus
  version: string
  isActive: boolean
  workspaceId?: string
  parentId?: string
  createdById: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  
  // Relations
  parent?: Process
  children?: Process[]
  workspace?: { id: string; name: string; code: string }
  creator?: { id: string; firstName: string; lastName: string; email: string }
  nodes?: ProcessNode[]
  edges?: ProcessEdge[]
  versions?: ProcessVersion[]
}
```

### React Query Hooks

The module uses a comprehensive set of hooks following best practices:

```typescript
// Query Key Factory (for cache management)
export const processKeys = {
  all: ['processes'] as const,
  lists: () => [...processKeys.all, 'list'] as const,
  list: (params?: ProcessListParams) => [...processKeys.lists(), params] as const,
  details: () => [...processKeys.all, 'detail'] as const,
  detail: (id: string) => [...processKeys.details(), id] as const,
  roots: () => [...processKeys.all, 'roots'] as const,
  hierarchy: (id: string) => [...processKeys.all, 'hierarchy', id] as const,
}

// Query Hooks
useProcesses(params?)        // Paginated list with filters
useRootProcesses()           // Top-level processes only
useProcess(id)               // Single process by ID
useProcessHierarchy(id)      // Process with full hierarchy tree

// Mutation Hooks
useCreateProcess()           // Create new process
useUpdateProcess()           // Update existing process
useUpdateProcessStatus()     // Status transition
useDeleteProcess()           // Soft delete process
```

Each mutation hook automatically invalidates relevant queries to keep the UI synchronized.

### Components

#### ProcessCard

Displays process information in a visually appealing card format:

- **Level Badge**: Color-coded (Purple/Blue/Green for levels 1/2/3)
- **Status Badge**: Five colors for five states
- **Statistics**: Children count, nodes count, versions count
- **Workspace Info**: Parent workspace name
- **Actions**: View, Edit, Delete buttons
- **Responsive**: Adapts to grid layout

```tsx
<ProcessCard
  process={process}
  onEdit={(process) => handleEdit(process)}
  onDelete={(process) => handleDelete(process)}
/>
```

#### ProcessForm

Form component for creating and editing processes:

- **Workspace Selection**: Dropdown with all available workspaces
- **Level Selector**: Three options (Processus, Procédure, Instruction)
- **Code Field**: Auto-generated, locked on edit
- **Character Counters**: Real-time validation feedback
- **Validation**: 2-200 chars for name, 2-50 for code, 1000 for description
- **Create/Edit Modes**: Adapts based on whether process is provided

```tsx
<ProcessForm
  process={existingProcess}  // Optional for edit mode
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

#### ProcessesPage

Main interface with comprehensive features:

- **View Modes**: Grid (cards) and Table views
- **Search**: Real-time filtering by name/code
- **Filters**: Level and Status dropdowns
- **Dialog Modals**: Create and Edit in modal dialogs
- **Pagination**: Navigate through large datasets
- **Responsive**: Mobile-friendly layout
- **Loading States**: Spinner during data fetch
- **Empty States**: Helpful message when no processes

### API Client

The `process.api.ts` service provides a clean API abstraction:

```typescript
// GET operations
processApi.getProcesses(params)      // List with pagination
processApi.getProcessById(id)        // Single process
processApi.getRootProcesses()        // Top-level only
processApi.getProcessHierarchy(id)   // With full tree

// POST/PATCH/DELETE operations
processApi.createProcess(data)           // Create
processApi.updateProcess(id, data)       // Update
processApi.updateProcessStatus(id, data) // Status change
processApi.deleteProcess(id)             // Delete
```

All methods include proper error handling with descriptive messages.

## Backend Implementation

### Controller Endpoints

RESTful API following best practices:

- `GET /processes` - List with pagination, search, filters
- `GET /processes/roots` - Top-level processes
- `GET /processes/:id` - Single process with relations
- `GET /processes/:id/hierarchy` - Process tree
- `POST /processes` - Create new process
- `PATCH /processes/:id` - Update process
- `PATCH /processes/:id/status` - Status transition
- `DELETE /processes/:id` - Soft delete

### Service Layer

Business logic implementation:

- **Validation**: Hierarchy constraints, status transitions
- **Authorization**: Role-based access control
- **Versioning**: Create new versions on publish
- **Audit Trail**: Track all changes
- **Error Handling**: Business exceptions with clear messages

### Repository Pattern

Data access abstraction:

```typescript
class ProcessRepository extends BaseRepository<Process> {
  findByCode(code: string)
  findWithHierarchy(id: string)
  findRoots(workspaceId?: string)
  findChildren(parentId: string)
  findByWorkspace(workspaceId: string)
  updateStatus(id: string, status: ProcessStatus)
}
```

### DTOs (Data Transfer Objects)

Input validation using class-validator:

```typescript
export class CreateProcessDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  code: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string

  @IsEnum(ProcessLevel)
  level: ProcessLevel

  @IsOptional()
  @IsUUID()
  workspaceId?: string

  @IsOptional()
  @IsUUID()
  parentId?: string
}
```

## Workflow Diagrams (XyFlow Integration)

The process module includes visual workflow modeling using **@xyflow/react** (modern replacement for deprecated ReactFlow).

### Node Types

Five types of nodes following PYX4 methodology:

1. **START_EVENT**: Process entry point (green circle)
2. **END_EVENT**: Process conclusion (red circle)
3. **TASK**: Work activities (blue rectangle)
4. **GATEWAY**: Decision points (yellow diamond)
5. **SUBPROCESS**: Nested processes (purple rectangle)

### Custom Node Components

Each node type has a custom React component with:

- **Role Assignment**: User/role responsible
- **Duration**: Estimated time
- **Description**: Detailed instructions
- **Status Indicators**: Visual feedback
- **Drag Handles**: Connection points

### Edge (Connection) Features

- **Conditional Flow**: Conditions on edges
- **Sequence Flow**: Ordered execution
- **Message Flow**: Communication between processes
- **Association**: Documentation links

### Diagram Editor Component (TODO)

The `ProcessDiagramEditor` component will provide:

- Drag-and-drop node placement
- Connection creation with validation
- Node property editing
- Zoom and pan controls
- Auto-layout algorithms
- Export to PNG/SVG
- Version comparison view

## Database Schema

```prisma
model Process {
  id           String        @id @default(uuid())
  name         String
  description  String?       @db.Text
  code         String        @unique
  level        Int           // 1, 2, or 3
  status       String        // DRAFT, REVIEW, APPROVED, PUBLISHED, ARCHIVED
  version      String
  isActive     Boolean       @default(true)
  workspaceId  String?
  parentId     String?
  createdById  String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  publishedAt  DateTime?

  workspace    Workspace?    @relation(fields: [workspaceId], references: [id])
  parent       Process?      @relation("ProcessHierarchy", fields: [parentId], references: [id])
  children     Process[]     @relation("ProcessHierarchy")
  creator      User          @relation(fields: [createdById], references: [id])
  nodes        ProcessNode[]
  edges        ProcessEdge[]
  versions     ProcessVersion[]
}

model ProcessNode {
  id          String   @id @default(uuid())
  processId   String
  type        String   // START_EVENT, END_EVENT, TASK, GATEWAY, SUBPROCESS
  label       String
  description String?  @db.Text
  positionX   Float
  positionY   Float
  width       Float    @default(150)
  height      Float    @default(60)
  data        Json?    // Custom node data
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  process     Process  @relation(fields: [processId], references: [id], onDelete: Cascade)
}

model ProcessEdge {
  id          String   @id @default(uuid())
  processId   String
  sourceId    String
  targetId    String
  type        String   // SEQUENCE, CONDITIONAL, MESSAGE, ASSOCIATION
  label       String?
  condition   String?  @db.Text
  data        Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  process     Process  @relation(fields: [processId], references: [id], onDelete: Cascade)
}
```

## Business Rules

### Hierarchy Validation

1. **Level Constraint**: Child level must be greater than parent level
   - Level 1 (PROCESSUS) can have Level 2 or 3 children
   - Level 2 (PROCEDURE) can only have Level 3 children
   - Level 3 (INSTRUCTION) cannot have children

2. **Parent Validation**: Parent must exist and be in the same workspace

### Status Transitions

Valid transitions:

- `DRAFT → REVIEW`: Submit for approval
- `REVIEW → APPROVED`: Approve changes
- `REVIEW → DRAFT`: Reject, needs revision
- `APPROVED → PUBLISHED`: Activate process
- `PUBLISHED → ARCHIVED`: Obsolete process
- `ARCHIVED → DRAFT`: Reactivate (creates new version)

Invalid transitions throw business exceptions.

### Version Management

- **Auto-versioning**: Publishing creates new version (e.g., 1.0 → 1.1)
- **Draft Version**: Each process can have one draft version
- **Published Version**: Multiple published versions for history
- **Version Comparison**: View changes between versions

### Authorization

Role-based permissions:

- **ADMIN**: Full access to all processes
- **EDITOR**: Create, edit, delete own processes
- **REVIEWER**: Approve processes
- **VIEWER**: Read-only access

## Usage Examples

### Creating a Process

```tsx
import { useCreateProcess } from '@/features/processes/hooks/useProcesses'

function CreateProcessButton() {
  const createMutation = useCreateProcess()

  const handleCreate = async () => {
    await createMutation.mutateAsync({
      name: 'New Process',
      code: 'PROC-001',
      level: ProcessLevel.PROCESSUS,
      workspaceId: 'workspace-id',
      description: 'Process description',
    })
  }

  return (
    <button onClick={handleCreate} disabled={createMutation.isPending}>
      {createMutation.isPending ? 'Creating...' : 'Create Process'}
    </button>
  )
}
```

### Updating Process Status

```tsx
import { useUpdateProcessStatus } from '@/features/processes/hooks/useProcesses'

function PublishButton({ processId }: { processId: string }) {
  const updateStatus = useUpdateProcessStatus()

  const handlePublish = async () => {
    await updateStatus.mutateAsync({
      id: processId,
      data: { status: ProcessStatus.PUBLISHED },
    })
  }

  return <button onClick={handlePublish}>Publish</button>
}
```

### Filtering Processes

```tsx
import { useProcesses } from '@/features/processes/hooks/useProcesses'

function ProcessList() {
  const { data, isLoading } = useProcesses({
    search: 'quality',
    level: ProcessLevel.PROCEDURE,
    status: ProcessStatus.PUBLISHED,
    page: 1,
    limit: 10,
  })

  if (isLoading) return <Spinner />

  return (
    <div>
      {data?.data.map((process) => (
        <ProcessCard key={process.id} process={process} />
      ))}
    </div>
  )
}
```

## Testing Strategy

### Unit Tests

- Service methods with business logic
- Repository queries
- DTO validation
- Status transition validation

### Integration Tests

- API endpoints with database
- Hierarchy constraint enforcement
- Version management flow

### E2E Tests

- Complete CRUD workflow
- Status transition flow
- Search and filter operations

## Performance Considerations

### Database Optimization

- Indexed fields: `code`, `workspaceId`, `parentId`, `status`, `level`
- Efficient hierarchy queries using recursive CTEs
- Pagination to limit result sets

### Caching Strategy

- React Query cache with 5-minute stale time
- Invalidation on mutations
- Optimistic updates for better UX

### Lazy Loading

- Diagram nodes loaded on demand
- Hierarchy expanded incrementally
- Virtual scrolling for large lists

## Future Enhancements

### Phase 1 (Current)

- ✅ Basic CRUD operations
- ✅ Hierarchy management
- ✅ Status workflow
- ✅ Search and filters
- ✅ Dialog modals

### Phase 2 (Next)

- [ ] XyFlow diagram editor
- [ ] Custom node components
- [ ] Drag-and-drop workflow design
- [ ] Version comparison UI
- [ ] Process templates

### Phase 3 (Future)

- [ ] Real-time collaboration
- [ ] Process execution engine
- [ ] Analytics and reporting
- [ ] Process mining
- [ ] AI-powered optimization

## Related Documentation

- [Authentication & Authorization](./authentication.md)
- [Workspace Module](./workspace-module.md)
- [XyFlow Integration Guide](./reactflow-integration.md)
- [API Documentation](./api.md)
- [Development Guide](./development.md)

## Contributing

When contributing to the process module:

1. **Follow SOLID principles**: Single responsibility, open/closed, etc.
2. **Use TypeScript strictly**: No `any` types
3. **Write tests**: Unit tests for business logic
4. **Document complex logic**: Comments for non-obvious code
5. **Respect the architecture**: Keep layers separate (controller → service → repository)
6. **Update this documentation**: Keep it synchronized with code changes

## Support

For questions or issues:

- Review existing documentation
- Check API endpoint documentation
- Consult the team lead
- Create an issue in the project repository
