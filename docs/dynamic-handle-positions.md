# Dynamic Handle Positions Feature

## Overview

The **Dynamic Handle Positions** feature allows users to change the position of input (target) and output (source) connection handles on nodes dynamically through the toolbar UI. This provides flexibility in diagram layout and connection routing.

## Features

### ✅ User-Friendly Interface
- Visual handle position selector in the toolbar
- Separate controls for source (output) and target (input) handles
- 4 position options: Top, Right, Bottom, Left
- Color-coded selection (Orange for source, Blue for target)
- Apply/Cancel buttons for confirmation

### ✅ Real-Time Updates
- Positions update immediately when applied
- Maintains connection integrity
- Works with all node types
- Persists with node data in Zustand store

### ✅ Smart Implementation
- Handle positions stored in node data
- Backwards compatible (nodes without custom positions use defaults)
- Integrated with Zustand state management
- Type-safe with TypeScript

## How to Use

### 1. Select a Node
Click on any node in the flow diagram to select it.

### 2. Open Handle Position Menu
Click the **"Handles"** button in the toolbar (has a Move icon).

### 3. Choose Positions
- **Output (Source)**: Select where output connections should originate
  - Options: Top, Right, Bottom, Left
  - Highlighted in Orange when selected
  
- **Input (Target)**: Select where input connections should enter
  - Options: Top, Right, Bottom, Left
  - Highlighted in Blue when selected

### 4. Apply Changes
Click **"Apply"** to update the node with new handle positions.

## Technical Implementation

### Architecture

```
Toolbar (UI) 
  ↓ onChangeHandlePosition
FlowDetailPage (Handler)
  ↓ updateNodeHandles
FlowStore (State Management)
  ↓ updates node.data.handlePositions
BaseNode (Renderer)
  ↓ reads data.handlePositions
  → dynamically renders handles
```

### Data Structure

Handle positions are stored in the node's data:

```typescript
{
  id: "node_1",
  type: "task",
  position: { x: 100, y: 100 },
  data: {
    label: "My Task",
    handlePositions: {
      source: "right",  // or "top", "bottom", "left"
      target: "left"    // or "top", "bottom", "right"
    }
  }
}
```

### Key Files Modified

#### 1. **Toolbar.tsx**
- Added `HandlePosition` type
- Added `onChangeHandlePosition` prop
- Implemented handle position UI with dropdown menu
- State management for selected positions

```typescript
export type HandlePosition = 'top' | 'right' | 'bottom' | 'left'

interface ToolbarProps {
  // ... other props
  onChangeHandlePosition?: (sourcePos: HandlePosition, targetPos: HandlePosition) => void
  hasSelectedNode?: boolean
}
```

#### 2. **flowStore.ts**
- Added `updateNodeHandles` method
- Stores handle positions in node data
- Triggers dirty state for save tracking

```typescript
updateNodeHandles: (nodeId: string, sourcePosition: string, targetPosition: string) => void

// Implementation
updateNodeHandles: (nodeId, sourcePosition, targetPosition) => {
  set((state) => ({
    nodes: state.nodes.map((node) =>
      node.id === nodeId
        ? { 
            ...node, 
            data: { 
              ...node.data, 
              handlePositions: {
                source: sourcePosition,
                target: targetPosition,
              }
            } 
          }
        : node
    ),
    isDirty: true,
  }), false, 'updateNodeHandles')
}
```

#### 3. **BaseNode.tsx**
- Modified `renderHandles()` to read custom positions
- Maps position strings to ReactFlow Position enum
- Falls back to default positions if not set

```typescript
const renderHandles = () => {
  const customPositions = data?.handlePositions as { 
    source?: string
    target?: string 
  } | undefined
  
  const positionMap = {
    top: Position.Top,
    right: Position.Right,
    bottom: Position.Bottom,
    left: Position.Left,
  }
  
  return handles.map((handle, index) => {
    let actualPosition = handle.position
    
    if (customPositions) {
      if (handle.type === 'source' && customPositions.source) {
        actualPosition = positionMap[customPositions.source] || handle.position
      } else if (handle.type === 'target' && customPositions.target) {
        actualPosition = positionMap[customPositions.target] || handle.position
      }
    }
    
    // ... render Handle with actualPosition
  })
}
```

#### 4. **FlowDetailPage.tsx**
- Added `updateNodeHandles` from store
- Created `handleChangeHandlePosition` callback
- Passed props to Toolbar component

```typescript
const handleChangeHandlePosition = useCallback((sourcePos: string, targetPos: string) => {
  if (selectedNode) {
    updateNodeHandles(selectedNode.id, sourcePos, targetPos)
  }
}, [selectedNode, updateNodeHandles])

<Toolbar
  // ... other props
  onChangeHandlePosition={handleChangeHandlePosition}
  hasSelectedNode={!!selectedNode}
/>
```

## Use Cases

### 1. **Optimize Layout**
Change handle positions to reduce edge crossings and improve diagram readability.

### 2. **Custom Flow Patterns**
- Top-to-bottom workflows: Use Top source and Bottom target
- Left-to-right workflows: Use Right source and Left target
- Circular flows: Mix positions for creative routing

### 3. **Space Constraints**
Adjust handle positions when nodes are tightly packed to avoid overlapping connections.

### 4. **Visual Consistency**
Standardize handle positions across similar node types for a cleaner look.

## Examples

### Example 1: Top-to-Bottom Flow
```
Start Event
  ↓ (source: bottom)
  ↓ (target: top)
Task Node
  ↓ (source: bottom)
  ↓ (target: top)
End Event
```

### Example 2: Horizontal Flow
```
Start Event → (source: right, target: left) → Task 1 → Task 2 → End
```

### Example 3: Gateway Split
```
        Task A (target: left)
       ↗ (source: top)
Gateway
       ↘ (source: bottom)
        Task B (target: left)
```

## Benefits

### For Users
- ✅ **Flexibility**: Customize connection points per node
- ✅ **Better Layouts**: Optimize edge routing
- ✅ **Visual Clarity**: Reduce visual clutter
- ✅ **Easy to Use**: Simple point-and-click interface

### For Developers
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **State Management**: Integrated with Zustand
- ✅ **Backwards Compatible**: Doesn't break existing nodes
- ✅ **Extensible**: Easy to add more positions or features

## Limitations & Future Enhancements

### Current Limitations
- Only applies to selected node (not bulk operations)
- Limited to 4 cardinal positions (no diagonal)
- Handle positions reset to default when node type changes

### Future Enhancements
- 📋 **Bulk Apply**: Change handle positions for multiple selected nodes
- 📋 **Templates**: Save and apply position presets
- 📋 **Auto-Layout**: Automatically suggest optimal handle positions
- 📋 **Per-Handle Control**: Set position for each individual handle
- 📋 **Visual Editor**: Drag handles to desired positions directly on node

## API Reference

### Toolbar Props
```typescript
interface ToolbarProps {
  onChangeHandlePosition?: (
    sourcePos: HandlePosition, 
    targetPos: HandlePosition
  ) => void
  hasSelectedNode?: boolean
}

type HandlePosition = 'top' | 'right' | 'bottom' | 'left'
```

### Store Method
```typescript
updateNodeHandles: (
  nodeId: string, 
  sourcePosition: string, 
  targetPosition: string
) => void
```

### Node Data Structure
```typescript
interface NodeData {
  label?: string
  description?: string
  handlePositions?: {
    source: 'top' | 'right' | 'bottom' | 'left'
    target: 'top' | 'right' | 'bottom' | 'left'
  }
  // ... other properties
}
```

## Testing

### Manual Testing Steps
1. Create a flow with multiple nodes
2. Connect some nodes
3. Select a node
4. Click "Handles" in toolbar
5. Change source position to "Top"
6. Change target position to "Bottom"
7. Click "Apply"
8. Verify handles moved to new positions
9. Verify connections maintained integrity
10. Save and reload to verify persistence

### Edge Cases
- ✅ Works with custom render nodes
- ✅ Works with resizable nodes
- ✅ Maintains connections when positions change
- ✅ Handles nodes with multiple source/target handles
- ✅ Button disabled when no node selected

## Related Documentation

- [Flow Store](./flow-store.md) - State management architecture
- [Base Node Architecture](./base-node-architecture.md) - Node system design
- [Flow Builder Component](./flow-builder-component.md) - ReactFlow integration

---

**Status**: ✅ **Implemented and Ready to Use**

**Version**: 1.0.0  
**Last Updated**: November 1, 2025
