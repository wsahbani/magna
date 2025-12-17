# Router Cleanup Summary

## Changes Made

### Commented Out Routes

The following deprecated routes have been commented out in the routeTree:

1. **Old Processes Feature** (`features/processes`):
   - `processesRoute` - `/processes`
   - `flowDetailRoute` - `/processes/flow/$id`
   - `sipocDetailRoute` - `/processes/sipoc/$id`
   - `bpmnDetailRoute` - `/processes/bpmn/$id`

2. **Procedures Feature** (`features/procedures`):
   - `procedureDetailRoute` - `/procedures/$id`
   - `proceduresLevel3Route` - `/procedures-level3`
   - `procedureDetailLevel3Route` - `/procedures-level3/$id`
   - `procedureFlowEditorLevel3Route` - `/procedures-level3/$id/flow`

3. **Qualigram Feature** (`features/qualigram`):
   - `qualigramEditorRoute` - `/qualigram/editor`
   - `qualigramEditorWithMacroRoute` - `/qualigram/editor/$macroProcessId`
   - `qualigramEditorWithProcessRoute` - `/qualigram/editor/$macroProcessId/$processId`
   - `qualigramEditorWithProcedureRoute` - `/qualigram/editor/$macroProcessId/$processId/$procedureId`

### Active Routes

These routes are still active and working:

- **Core**:
  - `/` - DashboardPage
  - `/login` - LoginPage

- **Workspaces**:
  - `/workspaces` - WorkspacesPage
  - `/workspaces/$id` - WorkspaceDetailPage

- **ProcessMaps (Level 1)**:
  - `/process-maps` - ProcessMapsPage
  - `/process-maps/$id` - ProcessMapDetailPage
  - `/process-maps/$id/flow` - ProcessMapFlowEditorPage

- **Processes (Level 2 - New)**:
  - `/processes-level2` - ProcessesPageLevel2
  - `/processes-level2/$id` - ProcessDetailPageLevel2
  - `/processes-level2/$id/flow` - ProcessFlowEditorPageLevel2

- **Other Features**:
  - `/sipoc` - SipocListPage
  - `/processes/$processId/fip` - FipDetailPage
  - `/users` - UsersPage
  - `/groups` - GroupsPage
  - `/macro-processes` - MacroProcessListPage

## Files Modified

1. **router.tsx**:
   - Commented out imports for deprecated features
   - Commented out routes in routeTree
   - Route definitions still exist but are not used

2. **tsconfig.json** (apps/web):
   - Added `exclude` patterns to skip deprecated features during TypeScript compilation:
     ```json
     "exclude": [
       "src/features/processes/**/*",
       "src/features/qualigram/**/*",
       "src/features/procedures/**/*"
     ]
     ```

## Remaining Tasks

### 1. Fix Router.tsx
The route definitions (lines 101-455) reference components that are no longer imported. Options:
- Comment out entire route definitions
- Delete route definitions completely
- Replace with placeholder components

### 2. Update WorkspaceDetailPage.tsx
Currently uses deprecated routes:
```typescript
// Current (BROKEN)
navigate({ to: '/processes/flow/$id', params: { id: process.id } })
navigate({ to: '/processes/sipoc/$id', params: { id: process.id } })

// Should be
navigate({ to: '/processes-level2/$id/flow', params: { id: process.id } as any })
// Or handle SIPOC differently
```

### 3. Fix SipocFlowRow.tsx
Uses deprecated route:
```typescript
// Current (BROKEN)
navigate({ to: '/processes/sipoc/$id', params: { id:sipocId } ,search :{sipoc :true} })

// Should navigate to dedicated SIPOC page or new route
```

### 4. Fix Type Issues

**strictNullChecks errors**:
- `FlowBuilder.tsx` / `FlowBuilder.refactored.tsx`: `loadedFlow` type mismatch
- `PropertiesPanel.tsx`: `unknown` types for linkedProcessId/linkedProcessType
- `useFlowSaving.ts`: `string | undefined` not assignable to `string`

**ReactFlow API changes**:
- `useProcessFlow.ts`: `parentNode` → `parentId`

## Build Status

- **Errors reduced**: From 71 → 31 errors
- **Main blockers**: 
  - 12 errors in router.tsx (undefined components)
  - 4 errors in WorkspaceDetailPage.tsx (invalid routes)
  - 3 errors in SipocFlowRow.tsx (invalid route)
  - 12 type errors (strictNullChecks, ReactFlow API)

## Next Steps

1. **Immediate** (to get build passing):
   - Comment out entire deprecated route definitions in router.tsx
   - Fix WorkspaceDetailPage.tsx to use new routes
   - Fix SipocFlowRow.tsx to use valid routes
   - Add type assertions (`as any`) for remaining strict type errors

2. **Short-term**:
   - Clean up router.tsx completely
   - Remove commented code
   - Update documentation

3. **Long-term**:
   - Delete deprecated features entirely
   - Migrate useful components to new architecture
   - Update all navigation links across the app
