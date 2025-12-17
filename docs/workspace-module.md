# Workspace Module Documentation

## Overview

The Workspace module manages organizational hierarchy and structure in the Process Management System. It implements a flexible hierarchical workspace system that can represent various organizational levels: GROUPE → ENTITY → DIRECTION → DEPARTMENT → TEAM.

## Architecture

The module follows clean architecture principles with clear separation of concerns:

```
modules/workspace/
├── dto/                      # Data Transfer Objects
│   ├── create-workspace.dto.ts
│   ├── update-workspace.dto.ts
│   └── add-member.dto.ts
├── entities/                 # Domain models
│   └── workspace.entity.ts
├── repositories/             # Data access layer
│   └── workspace.repository.ts
├── workspace.service.ts      # Business logic
├── workspace.controller.ts   # API endpoints
└── workspace.module.ts       # Module definition
```

## Domain Model

### Workspace Entity

```typescript
interface Workspace {
  id: string;
  name: string;
  description?: string;
  code: string;                    // Unique identifier
  type: WorkspaceType;             // GROUPE | ENTITY | DIRECTION | DEPARTMENT | TEAM
  isActive: boolean;
  parentId?: string;               // For hierarchy
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  parent?: Workspace;
  children?: Workspace[];
  departments?: Department[];
  processes?: Process[];
  workspaceMembers?: WorkspaceMember[];
  settings?: WorkspaceSettings;
}
```

### Workspace Types

- **GROUPE**: Top-level organization (e.g., Orange Group)
- **ENTITY**: Major business entity (e.g., Orange France, Orange Spain)
- **DIRECTION**: Strategic direction (e.g., IT Direction, HR Direction)
- **DEPARTMENT**: Functional department (e.g., Software Engineering, Recruitment)
- **TEAM**: Operational team (e.g., Frontend Team, Backend Team)

### Workspace Member Roles

```typescript
enum WorkspaceRole {
  OWNER = 'OWNER',        // Full control over workspace
  ADMIN = 'ADMIN',        // Manage processes and users
  EDITOR = 'EDITOR',      // Create and edit processes
  REVIEWER = 'REVIEWER',  // Review and approve processes
  VIEWER = 'VIEWER'       // Read-only access
}
```

## API Endpoints

All endpoints are prefixed with `/workspaces` and documented in Swagger at `/api/docs`.

### Workspace Management

#### Create Workspace
```http
POST /workspaces
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "IT Direction",
  "description": "Information Technology Strategic Direction",
  "code": "IT-DIR",
  "type": "DIRECTION",
  "isActive": true,
  "parentId": "clx1234567890"  // Optional: parent workspace
}

Response: 201 Created
{
  "id": "clx9876543210",
  "name": "IT Direction",
  "code": "IT-DIR",
  "type": "DIRECTION",
  "isActive": true,
  "parentId": "clx1234567890",
  "createdAt": "2025-01-31T16:00:00Z",
  "updatedAt": "2025-01-31T16:00:00Z"
}
```

#### List All Workspaces
```http
GET /workspaces?page=1&limit=10&search=IT&type=DIRECTION
Authorization: Bearer <token>

Response: 200 OK
{
  "data": [
    {
      "id": "clx9876543210",
      "name": "IT Direction",
      "code": "IT-DIR",
      "type": "DIRECTION",
      "isActive": true,
      "_count": {
        "children": 3,
        "processes": 12,
        "members": 25
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### Get Root Workspaces
```http
GET /workspaces/roots
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "clx1234567890",
    "name": "Orange Group",
    "code": "OG",
    "type": "GROUPE",
    "_count": {
      "children": 5,
      "departments": 0,
      "processes": 2,
      "workspaceMembers": 10
    }
  }
]
```

#### Get Workspace by ID
```http
GET /workspaces/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "clx9876543210",
  "name": "IT Direction",
  "description": "Information Technology Strategic Direction",
  "code": "IT-DIR",
  "type": "DIRECTION",
  "isActive": true,
  "parentId": "clx1234567890",
  "parent": {
    "id": "clx1234567890",
    "name": "Orange Group",
    "code": "OG"
  },
  "children": [
    {
      "id": "clx5555555555",
      "name": "Software Engineering",
      "code": "SE-DEPT"
    }
  ],
  "_count": {
    "departments": 0,
    "processes": 12,
    "workspaceMembers": 25
  }
}
```

#### Update Workspace
```http
PATCH /workspaces/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "IT & Digital Direction",
  "description": "Updated description"
}

Response: 200 OK
{
  "id": "clx9876543210",
  "name": "IT & Digital Direction",
  "description": "Updated description",
  ...
}
```

#### Delete Workspace (Soft Delete)
```http
DELETE /workspaces/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "clx9876543210",
  "isActive": false,
  ...
}
```

### Hierarchy Navigation

#### Get Workspace Children
```http
GET /workspaces/:id/children
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "clx5555555555",
    "name": "Software Engineering",
    "code": "SE-DEPT",
    "type": "DEPARTMENT",
    "_count": {
      "children": 2,
      "processes": 8
    }
  }
]
```

### Member Management

#### Get Workspace Members
```http
GET /workspaces/:id/members
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "clx7777777777",
    "workspaceId": "clx9876543210",
    "userId": "user123",
    "role": "ADMIN",
    "joinedAt": "2025-01-15T10:00:00Z",
    "user": {
      "id": "user123",
      "email": "alice.johnson@orange.com",
      "firstName": "Alice",
      "lastName": "Johnson",
      "displayName": "Alice J.",
      "position": "IT Manager"
    }
  }
]
```

#### Add Member to Workspace
```http
POST /workspaces/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user456",
  "role": "EDITOR"
}

Response: 201 Created
{
  "id": "clx8888888888",
  "workspaceId": "clx9876543210",
  "userId": "user456",
  "role": "EDITOR",
  "joinedAt": "2025-01-31T16:00:00Z"
}
```

#### Remove Member from Workspace
```http
DELETE /workspaces/:id/members/:userId
Authorization: Bearer <token>

Response: 204 No Content
```

#### Update Member Role
```http
PATCH /workspaces/:id/members/:userId/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "ADMIN"
}

Response: 200 OK
{
  "count": 1
}
```

### Statistics

#### Get Workspace Statistics
```http
GET /workspaces/:id/statistics
Authorization: Bearer <token>

Response: 200 OK
{
  "totalProcesses": 12,
  "publishedProcesses": 8,
  "totalDepartments": 3,
  "totalMembers": 25
}
```

## Business Logic

### Workspace Service

The `WorkspaceService` implements the following business rules:

1. **Hierarchy Validation**
   - Parent workspace must exist when creating child workspace
   - Workspace cannot be its own parent
   - Hierarchy must be maintained on updates

2. **Soft Delete**
   - Delete operations set `isActive: false` instead of removing records
   - Soft-deleted workspaces are excluded from queries by default

3. **Member Management**
   - Users can have different roles in different workspaces
   - One user can only have one role per workspace
   - Role changes update existing membership records

4. **Statistics**
   - Real-time counts of processes, departments, and members
   - Published vs draft process counts
   - Aggregated from related entities

### Repository Pattern

The `WorkspaceRepository` extends `BaseRepository<Workspace>` and provides:

**Base CRUD Operations:**
- `findById(id)` - Find by primary key
- `findMany(args)` - Find with filters
- `create(data)` - Create new record
- `update(id, data)` - Update existing record
- `delete(id)` - Remove record
- `exists(where)` - Check existence

**Custom Workspace Methods:**
- `findByCode(code)` - Find by unique code
- `findWithHierarchy(id)` - Include parent and children
- `findRoots()` - Get top-level workspaces
- `findChildren(parentId)` - Get direct children
- `findMembers(workspaceId)` - Get workspace members with user details
- `addMember(workspaceId, userId, role)` - Add user to workspace
- `removeMember(workspaceId, userId)` - Remove user from workspace
- `updateMemberRole(workspaceId, userId, role)` - Change member role
- `isMember(workspaceId, userId)` - Check membership
- `getMembersByRole(workspaceId, role)` - Filter by role
- `getStatistics(workspaceId)` - Aggregate statistics

## Data Validation

### CreateWorkspaceDto

```typescript
{
  name: string;              // Required, min 2 chars, max 100 chars
  description?: string;      // Optional, max 500 chars
  code: string;              // Required, min 2 chars, max 20 chars, unique
  type: WorkspaceType;       // Required, enum
  isActive?: boolean;        // Optional, default true
  parentId?: string;         // Optional, must be valid workspace ID
}
```

### UpdateWorkspaceDto

All fields from `CreateWorkspaceDto` are optional (using `PartialType`).

### AddMemberDto

```typescript
{
  userId: string;            // Required, valid user ID
  role: WorkspaceRole;       // Required, enum (OWNER|ADMIN|EDITOR|REVIEWER|VIEWER)
}
```

## Error Handling

The module uses NestJS exception filters and returns appropriate HTTP status codes:

- **400 Bad Request**: Invalid input data (validation errors)
- **401 Unauthorized**: Missing or invalid authentication token
- **404 Not Found**: Workspace not found
- **409 Conflict**: Duplicate code or constraint violation
- **500 Internal Server Error**: Unexpected server errors

Example error response:
```json
{
  "statusCode": 404,
  "message": "Workspace not found",
  "error": "Not Found"
}
```

## Security & Authorization

**Current Implementation:**
- All endpoints require JWT authentication (`@UseGuards(JwtAuthGuard)`)
- Bearer token must be provided in Authorization header

**Future Enhancements:**
- Role-based access control (RBAC) per workspace
- Permission checks based on workspace membership
- Owner-only operations (delete, add admins)
- Admin operations (manage members)
- Editor operations (create processes)

## Database Schema

```prisma
model Workspace {
  id          String        @id @default(cuid())
  name        String
  description String?
  code        String        @unique
  type        WorkspaceType
  isActive    Boolean       @default(true)
  parentId    String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  parent           Workspace?          @relation("WorkspaceHierarchy", fields: [parentId], references: [id])
  children         Workspace[]         @relation("WorkspaceHierarchy")
  departments      Department[]
  processes        Process[]
  workspaceMembers WorkspaceMember[]
  settings         WorkspaceSettings?

  @@map("workspaces")
}

enum WorkspaceType {
  GROUPE
  ENTITY
  DIRECTION
  DEPARTMENT
  TEAM
}

model WorkspaceMember {
  id          String        @id @default(cuid())
  role        WorkspaceRole
  joinedAt    DateTime      @default(now())
  workspaceId String
  userId      String

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
  @@map("workspace_members")
}

enum WorkspaceRole {
  OWNER
  ADMIN
  EDITOR
  REVIEWER
  VIEWER
}
```

## Testing

### Unit Tests

Test the service layer with mocked repository:

```typescript
describe('WorkspaceService', () => {
  it('should create a workspace without parent', async () => {
    const dto = {
      name: 'Test Workspace',
      code: 'TEST',
      type: 'DEPARTMENT',
    };
    const result = await service.create(dto);
    expect(result.name).toBe('Test Workspace');
  });

  it('should validate parent exists when creating child', async () => {
    const dto = {
      name: 'Child',
      code: 'CHILD',
      type: 'TEAM',
      parentId: 'invalid-id',
    };
    await expect(service.create(dto)).rejects.toThrow('Parent workspace not found');
  });
});
```

### Integration Tests

Test the complete flow with real database:

```typescript
describe('WorkspaceController (e2e)', () => {
  it('/workspaces (POST)', () => {
    return request(app.getHttpServer())
      .post('/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'IT Direction',
        code: 'IT-DIR',
        type: 'DIRECTION',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('IT Direction');
      });
  });
});
```

## Usage Examples

### Creating a Complete Hierarchy

```typescript
// 1. Create root workspace (GROUPE)
const groupe = await workspaceService.create({
  name: 'Orange Group',
  code: 'OG',
  type: 'GROUPE',
});

// 2. Create entity under group
const entity = await workspaceService.create({
  name: 'Orange France',
  code: 'OF',
  type: 'ENTITY',
  parentId: groupe.id,
});

// 3. Create direction under entity
const direction = await workspaceService.create({
  name: 'IT Direction',
  code: 'IT-DIR',
  type: 'DIRECTION',
  parentId: entity.id,
});

// 4. Create department under direction
const department = await workspaceService.create({
  name: 'Software Engineering',
  code: 'SE-DEPT',
  type: 'DEPARTMENT',
  parentId: direction.id,
});

// 5. Create team under department
const team = await workspaceService.create({
  name: 'Frontend Team',
  code: 'FE-TEAM',
  type: 'TEAM',
  parentId: department.id,
});
```

### Managing Members

```typescript
// Add team members with different roles
await workspaceService.addMember(team.id, {
  userId: 'user1',
  role: 'ADMIN',
});

await workspaceService.addMember(team.id, {
  userId: 'user2',
  role: 'EDITOR',
});

await workspaceService.addMember(team.id, {
  userId: 'user3',
  role: 'VIEWER',
});

// Update a member's role
await workspaceService.updateMemberRole(team.id, 'user2', {
  role: 'ADMIN',
});

// Get all team members
const members = await workspaceService.getMembers(team.id);
console.log(members); // Array of WorkspaceMember with user details

// Remove a member
await workspaceService.removeMember(team.id, 'user3');
```

### Navigating Hierarchy

```typescript
// Get root workspaces
const roots = await workspaceService.getRootWorkspaces();

// Get children of a workspace
const children = await workspaceService.getChildren(direction.id);

// Get full hierarchy (parent and children)
const hierarchy = await workspaceService.findOne(direction.id);
console.log(hierarchy.parent); // Parent workspace
console.log(hierarchy.children); // Array of child workspaces

// Get statistics
const stats = await workspaceService.getStatistics(direction.id);
console.log(stats.totalProcesses);
console.log(stats.publishedProcesses);
console.log(stats.totalMembers);
```

## Frontend Integration

### API Client

Create a workspace API client:

```typescript
// lib/api/workspace.api.ts
import { baseApi } from '../base-api';

export interface Workspace {
  id: string;
  name: string;
  code: string;
  type: 'GROUPE' | 'ENTITY' | 'DIRECTION' | 'DEPARTMENT' | 'TEAM';
  isActive: boolean;
  parentId?: string;
  // ... other fields
}

export const workspaceApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; type?: string }) =>
    baseApi.get<{ data: Workspace[]; meta: any }>('/workspaces', { params }),
  
  getRoots: () =>
    baseApi.get<Workspace[]>('/workspaces/roots'),
  
  getById: (id: string) =>
    baseApi.get<Workspace>(`/workspaces/${id}`),
  
  create: (data: Partial<Workspace>) =>
    baseApi.post<Workspace>('/workspaces', data),
  
  update: (id: string, data: Partial<Workspace>) =>
    baseApi.patch<Workspace>(`/workspaces/${id}`, data),
  
  delete: (id: string) =>
    baseApi.del(`/workspaces/${id}`),
  
  getChildren: (id: string) =>
    baseApi.get<Workspace[]>(`/workspaces/${id}/children`),
  
  getMembers: (id: string) =>
    baseApi.get(`/workspaces/${id}/members`),
  
  addMember: (id: string, data: { userId: string; role: string }) =>
    baseApi.post(`/workspaces/${id}/members`, data),
  
  removeMember: (id: string, userId: string) =>
    baseApi.del(`/workspaces/${id}/members/${userId}`),
  
  updateMemberRole: (id: string, userId: string, data: { role: string }) =>
    baseApi.patch(`/workspaces/${id}/members/${userId}/role`, data),
  
  getStatistics: (id: string) =>
    baseApi.get(`/workspaces/${id}/statistics`),
};
```

### React Query Hooks

```typescript
// features/workspaces/hooks/useWorkspaces.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceApi } from '@/lib/api/workspace.api';

export const useWorkspaces = (params?: any) => {
  return useQuery({
    queryKey: ['workspaces', params],
    queryFn: () => workspaceApi.getAll(params),
  });
};

export const useWorkspace = (id: string) => {
  return useQuery({
    queryKey: ['workspace', id],
    queryFn: () => workspaceApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workspaceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      workspaceApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', id] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workspaceApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};
```

## Next Steps

1. **Authorization & Permissions**
   - Implement role-based access control
   - Add workspace-level permissions
   - Restrict operations based on user role

2. **Frontend Components**
   - WorkspaceList with data table and card views
   - WorkspaceForm for create/edit
   - WorkspaceHierarchyTree for visualization
   - MemberManagement component

3. **Advanced Features**
   - Workspace templates
   - Bulk operations
   - Import/export functionality
   - Activity logs and audit trail

4. **Integration**
   - Link processes to workspaces
   - Department assignment
   - User invitation system
   - Notification system for member changes

## Related Documentation

- [Authentication](./authentication.md)
- [Process Module](./api.md)
- [Development Guide](./development.md)
- [API Documentation](http://localhost:3001/api/docs)
