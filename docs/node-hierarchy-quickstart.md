# Node Hierarchy Feature - Quick Start Guide

## What Was Implemented

A complete **parent-child relationship system** for flow diagram nodes with:

✅ **Hierarchical Organization**: Parent-child relationships between nodes  
✅ **Visual Grouping**: Dedicated GroupNode component for containers  
✅ **Multi-Selection**: Select multiple nodes with Ctrl+Click  
✅ **Synchronized Dragging**: Drag parent → children move together automatically  
✅ **Category Management**: Create process categories and nested groups  
✅ **Clean Architecture**: SOLID principles, separation of concerns, type-safe

## Quick Usage

### 1. Create a Group

```typescript
// In FlowEditor UI:
// 1. Select multiple nodes (Ctrl+Click)
// 2. Click "Group" button in toolbar
// 3. Group is created at center of selection
```

### 2. Ungroup Nodes

```typescript
// In FlowEditor UI:
// 1. Click on a group node
// 2. Click "Ungroup" button
// 3. All children become independent
```

### 3. Drag with Children

```typescript
// Just drag any node with children
// All descendants move automatically
// Relative positions maintained
```

### 4. Programmatic API

```typescript
import { useFlowStore } from '@/stores/flowStore'

const flowStore = useFlowStore()

// Set parent-child relationship
flowStore.setNodeParent('child-id', 'parent-id')

// Create a group
flowStore.createGroup({
  id: 'group-1',
  label: 'User Management',
  type: 'category',
  nodeIds: ['node-1', 'node-2'],
}, { x: 100, y: 100 })

// Move nodes to group
flowStore.moveNodesToGroup(['node-3', 'node-4'], 'group-1')

// Get descendants
const children = flowStore.getNodeDescendants('parent-id')

// Get statistics
const stats = flowStore.getHierarchyStats()
```

## Files Created

### Core Files
- **`/types/node-hierarchy.ts`** - Type definitions and interfaces
- **`/services/hierarchy.service.ts`** - Business logic and validation
- **`/hooks/useHierarchicalDrag.ts`** - React hooks for drag behavior
- **`/components/FlowBuilder/nodes/GroupNode.tsx`** - Visual group component

### Updated Files
- **`/stores/flowStore.ts`** - Added hierarchy operations
- **`/features/processes/components/FlowEditor.tsx`** - Integrated grouping UI

### Documentation
- **`/docs/node-hierarchy-feature.md`** - Complete implementation guide

## Key Features

### 1. GroupNode Component
- **Resizable** - Drag corners to resize
- **Collapsible** - Expand/collapse view
- **Type-based styling** - Different colors for category/subprocess/container
- **Child counter** - Badge showing number of children

### 2. Validation & Safety
- ✅ Prevents circular dependencies (A → B → C → A)
- ✅ Prevents self-reference (A → A)
- ✅ Maximum depth of 10 levels
- ✅ Warnings for complex operations

### 3. Hierarchical Dragging
- **Automatic**: When dragging parent, children follow
- **Recursive**: Grandchildren move with their parents
- **Maintains layout**: Relative positions preserved
- **Smooth**: No jitter or lag

### 4. Multi-Selection
- **Keyboard**: Ctrl+Click or Cmd+Click
- **Box selection**: Drag to select multiple
- **Batch operations**: Group selected nodes at once

## Architecture Highlights

### SOLID Principles Applied

✅ **Single Responsibility**
- `HierarchyService` - Read operations only
- `HierarchyOperations` - Write operations only
- `useHierarchicalDrag` - Drag behavior only

✅ **Dependency Inversion**
- Services don't depend on UI
- Hooks depend on service abstractions
- Components consume hooks

✅ **Open/Closed**
- Extensible via new group types
- Can add validation rules
- Custom node types supported

### Data Flow

```
User Action (UI)
    ↓
Hook (useHierarchicalDrag)
    ↓
Service (HierarchyOperations)
    ↓
Store (flowStore)
    ↓
ReactFlow (renders)
```

## Common Use Cases

### Use Case 1: Process Categorization

```typescript
// Create categories for different process types
flowStore.createGroup({
  id: 'user-processes',
  label: 'User Management',
  type: 'category',
  nodeIds: [],
}, { x: 0, y: 0 })

// Add processes to category
flowStore.moveNodesToGroup([
  'login',
  'register',
  'forgot-password'
], 'user-processes')
```

### Use Case 2: Subprocess Decomposition

```typescript
// Break down complex process into sub-processes
flowStore.createGroup({
  id: 'order-process',
  label: 'Order Processing',
  type: 'subprocess',
  nodeIds: [
    'validate-order',
    'process-payment',
    'fulfill-order',
    'send-confirmation'
  ],
}, { x: 200, y: 100 })
```

### Use Case 3: Nested Organization

```typescript
// Create nested hierarchy
flowStore.createGroup({
  id: 'main-process',
  label: 'E-Commerce System',
  type: 'container',
  nodeIds: [],
}, { x: 0, y: 0 })

// Add sub-groups
flowStore.setNodeParent('user-processes', 'main-process')
flowStore.setNodeParent('order-process', 'main-process')
flowStore.setNodeParent('inventory-processes', 'main-process')
```

## Group Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `category` | Folder | Orange | Organizational grouping |
| `subprocess` | Layers | Blue | Process decomposition |
| `container` | Box | Purple | Logical containers |
| `custom` | Users | Gray | Custom usage |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Click` | Add to selection |
| `Ctrl/Cmd + Drag` | Box selection |
| `Click empty area` | Clear selection |
| `Delete` | Delete selected |

## Best Practices

1. **Keep hierarchy shallow** (< 5 levels) for best performance
2. **Limit children per group** (< 20) for optimal UX
3. **Use meaningful labels** for groups
4. **Choose appropriate group type** for visual clarity
5. **Collapse large groups** when not in use

## Troubleshooting

**Q: Children not moving with parent?**  
A: Ensure hierarchical drag handlers are connected in ReactFlow

**Q: Can't create group?**  
A: Check that nodes are selected (Ctrl+Click)

**Q: Circular dependency error?**  
A: Trying to make a child the parent of its own ancestor

**Q: Group not showing children?**  
A: Check if group is collapsed or childIds array is set

## Next Steps

To extend this feature:

1. **Visual connections** - Draw lines from parent to children
2. **Auto-layout** - Automatically arrange children in group
3. **Drag-to-group** - Drag nodes onto group to add
4. **Group templates** - Predefined group structures
5. **Export/import** - Save group configurations

## Support

For detailed documentation, see:
- [`/docs/node-hierarchy-feature.md`](./node-hierarchy-feature.md) - Complete guide
- [`/types/node-hierarchy.ts`](../apps/web/src/types/node-hierarchy.ts) - Type definitions
- [`/services/hierarchy.service.ts`](../apps/web/src/services/hierarchy.service.ts) - API reference
