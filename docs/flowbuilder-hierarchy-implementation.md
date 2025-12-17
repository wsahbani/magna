# FlowBuilder Hierarchy Implementation

## Overview
The hierarchy mechanism has been successfully migrated from FlowEditor to **FlowBuilder**, making FlowBuilder the primary component responsible for all node hierarchy features.

## Implemented Features

### 1. **Automatic Parent-Child Assignment on Drag**
- When a node is dragged and dropped inside a GroupNode, it automatically becomes a child
- Position is converted from absolute to relative coordinates
- `parentNode`, `extent: 'parent'`, and `parentId` properties are set automatically
- Works bidirectionally: dragging a child out of a group removes the parent relationship

### 2. **Hierarchical Drag Behavior**
- When dragging a parent node, all children move together
- Uses `useHierarchicalDrag` hook to track descendants
- Maintains relative positions of children during drag
- Smooth synchronized movement

### 3. **Manual Group Creation**
- Toolbar with **Group** button for explicit grouping
- Multi-select nodes using `Ctrl+Click` or box selection
- Creates GroupNode with automatic size calculation based on selected nodes
- Converts child positions to relative coordinates
- Updates all parent-child relationships

### 4. **Manual Ungrouping**
- Toolbar with **Ungroup** button
- Select a GroupNode and click Ungroup to release all children
- Converts child positions back to absolute coordinates
- Removes all parent-child relationships
- Deletes the group container

## Technical Implementation

### Key Components Modified

#### FlowBuilder.tsx
```typescript
// Added imports
import { useHierarchicalDrag } from '../../hooks/useHierarchicalDrag'
import { Toolbar } from './Toolbar'
import { Panel } from '@xyflow/react'

// State management
const [groupCounter, setGroupCounter] = useState(1)
const selectedNodes = nodes.filter((node) => node.selected)
const selectedNodeCount = selectedNodes.length

// Hierarchical drag hook
const { handleNodeDragStart, handleNodeDrag, handleNodeDragStop } = 
  useHierarchicalDrag({ nodes, onNodesChange, enabled: true })

// Functions
- createGroup() - Manual group creation from selected nodes
- ungroupSelected() - Remove group and free children
- handleNodeDragStop() - Auto-parenting detection on drag
```

### Event Flow

#### Manual Grouping Flow
```
1. User selects multiple nodes (Ctrl+Click)
2. User clicks "Group" button in Toolbar
3. createGroup() calculates bounding box
4. Creates GroupNode with appropriate size
5. Updates children:
   - Converts to relative positions
   - Sets parentNode property
   - Sets extent: 'parent'
6. Triggers onNodesChange
7. ReactFlow re-renders
```

#### Auto-Parenting Flow (Drag & Drop)
```
1. User drags a node
2. hierarchicalDragStart() tracks descendants
3. During drag: hierarchicalDrag() moves children
4. On drop: handleNodeDragStop() checks intersection
5. If node center is inside a GroupNode:
   - Converts position to relative
   - Sets parent-child relationship
   - Updates childIds array
6. If dragged out of parent:
   - Converts position to absolute
   - Removes parent-child relationship
   - Updates childIds array
7. Triggers onNodesChange
```

## User Experience

### Multi-Selection
- Hold `Ctrl` (or `Cmd` on Mac) and click nodes to select multiple
- Use box selection by clicking and dragging on canvas
- Selected nodes are highlighted

### Creating Groups
1. Select multiple nodes using Ctrl+Click
2. Click the **Group** button in the toolbar
3. All selected nodes are grouped into a container
4. Group is automatically sized with padding

### Ungrouping
1. Click a GroupNode to select it
2. Click the **Ungroup** button in the toolbar
3. All children are released and positioned at absolute coordinates
4. Group container is removed

### Drag & Drop Grouping
1. Drag any node from the palette or canvas
2. Drop it inside a GroupNode (purple container)
3. Node automatically becomes a child
4. Position is adjusted to be relative to the group

### Drag & Drop Ungrouping
1. Drag a child node out of its parent GroupNode
2. Node automatically becomes independent
3. Position is adjusted to absolute coordinates

## GroupNode Types

FlowBuilder supports 4 group types:
- **category** (Orange) - Process categories
- **subprocess** (Blue) - Subprocess containers
- **container** (Purple) - Generic containers
- **custom** (Gray) - Custom groupings

## Integration Points

### Props
```typescript
interface FlowBuilderProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: any) => void
  onEdgesChange: (changes: any) => void
  onConnect?: (connection: Connection) => void
  onSave?: (nodes: Node[], edges: Edge[]) => void
  onInit?: (instance: ReactFlowInstance) => void
  onSelectionChange?: (params: OnSelectionChangeParams) => void
  gridSettings?: GridSettings
  showHelperLines?: boolean
  readOnly?: boolean // Hides toolbar and disables grouping
}
```

### Toolbar Integration
```typescript
<Panel position="top-left" className="...">
  <Toolbar
    onSave={onSave ? () => onSave(nodes, edges) : undefined}
    onGroup={createGroup}
    onUngroup={ungroupSelected}
    hasSelectedNode={!!selectedNode}
    selectedNodeCount={selectedNodeCount}
    isGroupSelected={selectedNode?.type === 'group'}
  />
</Panel>
```

## Node Data Structure

### Regular Node
```typescript
{
  id: 'node-1',
  type: 'task',
  position: { x: 100, y: 100 },
  data: {
    label: 'My Task',
    parentId: null, // or parent group ID
  }
}
```

### Child Node (inside group)
```typescript
{
  id: 'node-1',
  type: 'task',
  position: { x: 50, y: 50 }, // Relative to parent
  parentNode: 'group-123',      // ReactFlow parent reference
  extent: 'parent',             // Keep inside parent
  data: {
    label: 'My Task',
    parentId: 'group-123',      // Business logic reference
  }
}
```

### GroupNode
```typescript
{
  id: 'group-123',
  type: 'group',
  position: { x: 100, y: 100 }, // Absolute position
  style: {
    width: 400,
    height: 300,
  },
  data: {
    label: 'Group 1',
    isGroup: true,
    groupType: 'category',
    childIds: ['node-1', 'node-2'],
    collapsed: false,
  }
}
```

## Validation & Safety

### Circular Dependency Prevention
- `HierarchyService.wouldCreateCircular()` checks parent chain
- Prevents infinite loops
- Validates before setting parent

### Intersection Detection
- Uses bounding box calculation
- Checks if node **center point** is inside group
- More accurate than simple overlap detection

### Position Management
- Automatic conversion between relative/absolute coordinates
- Maintains visual positioning during transitions
- Preserves layout integrity

## Performance Considerations

1. **Map-based position storage** - O(1) lookup during drag
2. **Batch updates** - Single `onNodesChange` call for all affected nodes
3. **Ref-based drag state** - No re-renders during drag operations
4. **Selective re-renders** - Only affected nodes update

## Testing Checklist

✅ Multi-select nodes using Ctrl+Click
✅ Create group from selected nodes
✅ Group automatically sizes to fit children
✅ Children positioned relatively inside group
✅ Drag group moves all children together
✅ Ungroup releases children correctly
✅ Drag node into group makes it a child
✅ Drag child out of group makes it independent
✅ Position calculations correct (relative ↔ absolute)
✅ Toolbar buttons enable/disable correctly
✅ Group counter increments
✅ childIds array stays synchronized

## Next Steps / Future Enhancements

1. **Visual Feedback**
   - Highlight target group during drag
   - Show drop zones
   - Animate transitions

2. **Nested Groups**
   - Support groups inside groups
   - Multi-level hierarchy visualization
   - Recursive drag operations

3. **Collision Detection**
   - Prevent overlapping groups
   - Auto-adjust positions

4. **Keyboard Shortcuts**
   - `Ctrl+G` for group
   - `Ctrl+Shift+G` for ungroup

5. **Undo/Redo**
   - History tracking for group operations
   - State snapshots

6. **Persistence**
   - Save/load hierarchy to backend
   - Serialize parent-child relationships

## Migration Notes

### From FlowEditor to FlowBuilder
- All hierarchy logic moved to FlowBuilder
- FlowEditor can now delegate to FlowBuilder
- Maintains backward compatibility
- No breaking changes to external API

### Benefits
- Single source of truth for hierarchy features
- Simplified architecture
- Better maintainability
- Consistent behavior across app
