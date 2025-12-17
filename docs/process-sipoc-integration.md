# Process-SIPOC Integration

## Overview

Automatic SIPOC diagram creation when a Process with type SIPOC is created.

## Implementation Details

### Changes Made

1. **ProcessModule** (`apps/api/src/modules/process/process.module.ts`)
   - Added `SipocModule` import
   - SipocService is now available via dependency injection

2. **ProcessService** (`apps/api/src/modules/process/services/process.service.ts`)
   - Injected `SipocService` into constructor
   - Enhanced `create()` method to automatically create SIPOC diagram when `ProcessType.SIPOC`
   - Error handling ensures Process creation succeeds even if SIPOC creation fails

### Flow

```
User creates Process (level=2) 
    ↓
ProcessService.create()
    ↓
Map level to type (2 → SIPOC)
    ↓
Create Process in database
    ↓
Check if type === SIPOC
    ↓
Call SipocService.createDiagram()
    ↓
SIPOC diagram created with:
    - Same title as Process
    - Same description
    - Process owner from authorName
    - Linked via processId
    - Status: draft
    - Version: 1
```

### Data Mapping

| Process Field | SIPOC Diagram Field |
|--------------|---------------------|
| `name` | `title` |
| `description` | `description` |
| `authorName` | `process_owner` |
| `id` | `processId` (foreign key) |
| - | `status` = "draft" |
| - | `version` = 1 |

### Error Handling

- SIPOC creation is wrapped in try-catch
- If SIPOC creation fails, Process creation still succeeds
- Errors are logged but not thrown
- This ensures backward compatibility and resilience

## Testing

### Manual Test

```bash
# Create a SIPOC process (level = 2)
curl -X POST http://localhost:3001/process \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Order Management",
    "description": "E-commerce order processing",
    "code": "ORD-001",
    "level": 2,
    "workspaceId": "workspace-id",
    "authorName": "John Doe"
  }'
```

### Expected Behavior

1. Process is created with `type: SIPOC`
2. SIPOC diagram is automatically created
3. SIPOC diagram has same title/description
4. SIPOC diagram is linked to Process via `processId`
5. Both records visible in database

### Verification Queries

```bash
# Get the created process
GET /process/:processId

# Get associated SIPOC diagram
GET /sipoc?processId=:processId

# Or query directly via Prisma
await prisma.process.findUnique({
  where: { id: processId },
  include: { sipocDiagrams: true }
})
```

## Benefits

✅ **Automatic**: No manual SIPOC creation needed
✅ **Consistent**: Same data across Process and SIPOC
✅ **Linked**: Bidirectional relationship maintained
✅ **Resilient**: Process creation succeeds even if SIPOC fails
✅ **Clean**: Follows dependency injection pattern
✅ **Logged**: All operations tracked in logs

## Future Enhancements

- [ ] Update SIPOC when Process is updated
- [ ] Archive SIPOC when Process is archived
- [ ] Sync status changes between Process and SIPOC
- [ ] Add configuration to enable/disable auto-creation
- [ ] Support SIPOC templates based on Process type

---

**Status**: ✅ Implemented and ready for testing
