# Node Hierarchy & Grouping Feature

## Overview

This feature implements a comprehensive **parent-child relationship system** for flow diagram nodes, enabling:

- **Hierarchical organization** of processes with parent-child relationships
- **Visual grouping** with dedicated GroupNode components
- **Multi-node selection** and batch operations
- **Synchronized dragging** - when dragging a parent, all children move together
- **Category creation** for organizing related processes
- **Nested groups** with validation to prevent circular dependencies

## Architecture

### Clean Architecture Principles

The implementation follows **SOLID principles** and **clean architecture patterns**:

1. **Separation of Concerns**
   - `types/` - Type definitions and interfaces
   - `services/` - Business logic (validation, calculations)
   - `hooks/` - React integration and UI behavior
   - `components/` - Visual presentation
   - `stores/` - State management

2. **Single Responsibility**
   - `HierarchyService` - Read operations and validations
   - `HierarchyOperations` - Write operations and transformations
   - `useHierarchicalDrag` - Drag behavior management
   - `useMultiSelection` - Selection state management

3. **Dependency Inversion**
   - Services don't depend on UI components
   - Hooks depend on service abstractions
   - Components depend on hooks and services

4. **Open/Closed Principle**
   - Extensible through new node types
   - Group types can be added without modifying core logic
   - Validation rules can be extended

## Key Components

### 1. Type System (`types/node-hierarchy.ts`)

```typescript
interface NodeHierarchyData {
  parentId?: string | null          // Parent node ID
  childIds?: string[]                // Child node IDs
  level?: number                     // Hierarchy depth
  isGroup?: boolean                  // Is this a group node?
  groupType?: 'category' | 'subprocess' | 'container' | 'custom'
  collapsed?: boolean                // Collapse state
  metadata?: Record<string, any>     // Additional properties
}
```

**Features:**
- Type-safe hierarchy data structure
- Support for nested groups
- Flexible metadata for custom properties
- Helper type guards (`isGroupNode`, `hasParent`, `hasChildren`)

### 2. Hierarchy Service (`services/hierarchy.service.ts`)

**HierarchyService** (Read operations):
- `validateHierarchy()` - Prevent circular dependencies
- `getDescendants()` - Get all child nodes recursively
- `getAncestors()` - Get all parent nodes up to root
- `getSiblings()` - Get nodes at same level with same parent
- `calculateLevel()` - Determine node depth in hierarchy
- `getHierarchyStats()` - Statistics about the hierarchy
- `buildTree()` - Convert flat nodes to tree structure

**HierarchyOperations** (Write operations):
- `setParent()` - Establish parent-child relationship
- `removeParent()` - Remove node from parent
- `createGroup()` - Create a group node with children
- `moveNodesToParent()` - Batch move operation
- `toggleCollapse()` - Expand/collapse group
- `getNodesMovingWithParent()` - Get all affected nodes

**Validation Rules:**
1. No self-reference (node can't be its own parent)
2. No circular dependencies (A → B → C → A)
3. Maximum depth of 10 levels
4. Warnings when moving nodes with children

### 3. GroupNode Component (`components/FlowBuilder/nodes/GroupNode.tsx`)

Visual container node with:
- **Resizable** - Can be resized with drag handles
- **Collapsible** - Expand/collapse to show/hide children
- **Type indicators** - Different icons for category/subprocess/container
- **Child count badge** - Shows number of contained nodes
- **Color coding** - Visual differentiation by type

**Group Types:**
- `category` - Organizational grouping (orange)
- `subprocess` - Process decomposition (blue)
- `container` - Logical container (purple)
- `custom` - User-defined (gray)

### 4. Hierarchical Drag Hook (`hooks/useHierarchicalDrag.ts`)

**Features:**
- Automatically moves all descendants when dragging parent
- Maintains relative positions of children
- Smooth synchronized movement
- Can be enabled/disabled

**How It Works:**
1. **Drag Start**: Capture all descendants and their positions
2. **Drag Move**: Calculate delta and update all descendant positions
3. **Drag Stop**: Reset drag state

### 5. Multi-Selection Hook (`hooks/useHierarchicalDrag.ts`)

**Features:**
- Multi-select with Ctrl/Cmd + Click
- Box selection support (via ReactFlow)
- Group creation from selection
- Batch operations on selected nodes

### 6. FlowStore Extensions (`stores/flowStore.ts`)

New hierarchy operations in Zustand store:
- `setNodeParent()` - Set parent for a node
- `removeNodeParent()` - Make node root-level
- `createGroup()` - Create group with children
- `moveNodesToGroup()` - Move nodes into group
- `toggleGroupCollapse()` - Collapse/expand group
- `getNodeDescendants()` - Get all children recursively
- `getNodeAncestors()` - Get all parents up to root
- `getNodeSiblings()` - Get sibling nodes
- `getHierarchyStats()` - Get statistics

## Usage Guide

### Creating a Group

```typescript
// Option 1: Create group manually
const group: NodeGroup = {
  id: 'group-1',
  label: 'User Management',
  type: 'category',
  nodeIds: ['node-1', 'node-2', 'node-3'],
  color: '#ff6600',
}

flowStore.createGroup(group, { x: 100, y: 100 })

// Option 2: Create from selection in UI
// Select nodes with Ctrl+Click, then click "Group" button
```

### Setting Parent-Child Relationships

```typescript
// Set parent
flowStore.setNodeParent('child-node-id', 'parent-node-id')

// Remove parent (make root-level)
flowStore.removeNodeParent('child-node-id')

// Move multiple nodes to parent
flowStore.moveNodesToGroup(['node-1', 'node-2'], 'group-id')
```

### Querying Hierarchy

```typescript
// Get all descendants (children, grandchildren, etc.)
const descendants = flowStore.getNodeDescendants('parent-node-id')

// Get all ancestors (parent, grandparent, etc.)
const ancestors = flowStore.getNodeAncestors('child-node-id')

// Get siblings (same parent)
const siblings = flowStore.getNodeSiblings('node-id')

// Get hierarchy statistics
const stats = flowStore.getHierarchyStats()
// Returns: { totalNodes, rootNodes, groupNodes, maxDepth, averageChildrenPerParent }
```

### Drag Behavior

When you drag a parent node:
1. All child nodes move with it
2. All grandchild nodes move with their parents
3. Relative positions are maintained
4. Connected edges update automatically

**To enable in ReactFlow:**

```tsx
<ReactFlow
  nodes={nodes}
  onNodeDragStart={handleNodeDragStart}
  onNodeDrag={handleNodeDrag}
  onNodeDragStop={handleNodeDragStop}
  // ... other props
/>
```

### Multi-Selection

**Keyboard:**
- `Ctrl + Click` (Windows/Linux) or `Cmd + Click` (Mac) - Add to selection
- `Ctrl/Cmd + Drag` - Box selection
- Click empty area - Clear selection

**Programmatic:**

```typescript
const { handleNodeClick, getSelectedNodeIds, clearSelection } = useMultiSelection({
  nodes,
  onSelectionChange: (selected) => console.log(selected),
})

// Handle click with multi-select support
<Node onClick={(e, node) => handleNodeClick(e, node)} />
```

## FlowEditor Integration

The FlowEditor component now includes:

### Toolbar Additions

```tsx
<Button onClick={createGroup}>
  Group ({selectedNodes.length})
</Button>

<Button onClick={ungroupSelected}>
  Ungroup
</Button>
```

### Features

1. **Group Creation**: Select nodes → Click "Group" button
2. **Ungrouping**: Select group node → Click "Ungroup" button
3. **Hierarchical Dragging**: Drag parent → Children move together
4. **Multi-Selection**: Ctrl+Click to select multiple nodes
5. **Visual Feedback**: Selected nodes highlighted

## Data Model

### Node Structure with Hierarchy

```typescript
{
  id: 'node-1',
  type: 'task',
  position: { x: 100, y: 100 },
  data: {
    label: 'Process Step',
    parentId: 'group-1',     // Parent node ID
    level: 1,                // Depth in hierarchy
    // ... other properties
  }
}
```

### Group Node Structure

```typescript
{
  id: 'group-1',
  type: 'group',
  position: { x: 0, y: 0 },
  data: {
    label: 'Category Name',
    isGroup: true,
    groupType: 'category',
    childIds: ['node-1', 'node-2', 'node-3'],
    collapsed: false,
    level: 0,
  }
}
```

## Validation & Error Handling

### Automatic Validation

When setting parent-child relationships, the system automatically validates:

1. **Circular Dependencies**: Prevents A → B → C → A
2. **Self-Reference**: Node cannot be its own parent
3. **Max Depth**: Prevents nesting beyond 10 levels
4. **Existing Children Warning**: Alerts when moving nodes with children

### Error Messages

```typescript
const result = flowStore.moveNodesToGroup(['node-1'], 'parent-1')

if (!result) {
  // Validation failed
  // Error logged to console
}
```

## Performance Considerations

### Optimizations

1. **Memoization**: GroupNode is memoized with React.memo()
2. **Efficient Lookups**: Map-based position storage during drag
3. **Batch Updates**: Multiple nodes updated in single operation
4. **Lazy Rendering**: Collapsed groups don't render children

### Best Practices

- Keep hierarchy depth < 5 levels for optimal performance
- Limit groups to < 20 children for best UX
- Use collapsed state for large groups
- Batch operations when possible

## API Reference

### FlowStore Methods

```typescript
// Hierarchy operations
setNodeParent(childId: string, parentId: string | null): void
removeNodeParent(childId: string): void
createGroup(group: NodeGroup, position: XYPosition): void
moveNodesToGroup(nodeIds: string[], groupId: string | null): boolean
toggleGroupCollapse(groupId: string): void

// Query operations
getNodeDescendants(nodeId: string): Node[]
getNodeAncestors(nodeId: string): Node[]
getNodeSiblings(nodeId: string): Node[]
getHierarchyStats(): HierarchyStats
```

### Hook APIs

```typescript
// Hierarchical drag
const {
  handleNodeDragStart,
  handleNodeDrag,
  handleNodeDragStop,
  dragState,
} = useHierarchicalDrag({ nodes, onNodesChange, enabled })

// Multi-selection
const {
  handleNodeClick,
  clearSelection,
  getSelectedNodeIds,
  isNodeSelected,
} = useMultiSelection({ nodes, onSelectionChange })
```

## Examples

### Example 1: Create Process Hierarchy

```typescript
// Create main process group
flowStore.createGroup({
  id: 'process-main',
  label: 'User Registration Process',
  type: 'subprocess',
  nodeIds: [],
}, { x: 100, y: 100 })

// Add sub-processes
const subProcesses = ['validate-email', 'create-account', 'send-confirmation']
subProcesses.forEach(id => {
  flowStore.setNodeParent(id, 'process-main')
})

// Create nested category within process
flowStore.createGroup({
  id: 'validation-group',
  label: 'Validation Steps',
  type: 'category',
  nodeIds: ['check-email', 'check-password', 'check-terms'],
}, { x: 150, y: 200 })

flowStore.setNodeParent('validation-group', 'process-main')
```

### Example 2: Drag with Children

```typescript
// When user drags "process-main" node:
// - All sub-processes move with it
// - validation-group moves with it
// - All validation steps move with validation-group
// Relative positions are maintained automatically
```

### Example 3: Batch Move to Group

```typescript
// Select multiple nodes
const selectedIds = ['node-1', 'node-2', 'node-3', 'node-4']

// Move all to existing group
const success = flowStore.moveNodesToGroup(selectedIds, 'group-1')

if (success) {
  console.log('All nodes moved to group-1')
}
```

## Troubleshooting

### Common Issues

1. **Circular Dependency Error**
   - **Cause**: Trying to set A as parent of B when B is ancestor of A
   - **Solution**: Check hierarchy before setting parent

2. **Max Depth Exceeded**
   - **Cause**: Nesting level > 10
   - **Solution**: Flatten hierarchy or increase MAX_DEPTH constant

3. **Children Not Moving with Parent**
   - **Cause**: Hierarchical drag not enabled
   - **Solution**: Ensure drag handlers are connected to ReactFlow

4. **Group Not Showing Children**
   - **Cause**: Group is collapsed or childIds not set
   - **Solution**: Check collapsed state and verify childIds array

## Future Enhancements

Potential improvements:
1. Visual connection lines between parent and children
2. Automatic layout for grouped nodes
3. Drag-and-drop to add nodes to groups
4. Group templates/presets
5. Import/export group configurations
6. Undo/redo for hierarchy changes
7. Visual hierarchy tree view panel

## Related Documentation

- [Flow Builder Component](./flow-builder-component.md)
- [Flow Store](./flow-store.md)
- [Base Node Architecture](./base-node-architecture.md)
- [ReactFlow Integration](./reactflow-integration.md)
