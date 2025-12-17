# Node Hierarchy - Quick Reference Guide

## 🎯 What Was Implemented

The **FlowBuilder** component now has complete node hierarchy support with:

1. ✅ **Manual Grouping** - Toolbar buttons to create/remove groups
2. ✅ **Auto-Parenting** - Drag nodes into groups to make them children
3. ✅ **Hierarchical Drag** - Moving parent moves all children together
4. ✅ **Multi-Selection** - Ctrl+Click to select multiple nodes

## 🚀 Quick Start

### Basic Usage

```typescript
import { FlowBuilder } from './components/FlowBuilder/FlowBuilder'

function MyComponent() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  
  return (
    <FlowBuilder
      nodes={nodes}
      edges={edges}
      onNodesChange={(changes) => {
        // Handle node changes
      }}
      onEdgesChange={(changes) => {
        // Handle edge changes
      }}
      readOnly={false} // Shows toolbar
    />
  )
}
```

## 📋 How to Use

### Create a Group (Manual)
1. Hold `Ctrl` and click multiple nodes to select them
2. Click the **"Group"** button in the toolbar (top-left)
3. All selected nodes become children of a new GroupNode

### Ungroup
1. Click a GroupNode to select it
2. Click the **"Ungroup"** button in the toolbar
3. All children are released from the group

### Auto-Parenting (Drag & Drop)
1. Drag any node from palette or canvas
2. Drop it inside a GroupNode (purple/orange container)
3. Node automatically becomes a child
4. Drag it outside to make it independent again

### Move Grouped Nodes
1. Click and drag a GroupNode
2. All children move together automatically
3. Relative positions are preserved

## 🎨 GroupNode Types

| Type | Color | Use Case |
|------|-------|----------|
| `category` | Orange | Process categories |
| `subprocess` | Blue | Subprocess containers |
| `container` | Purple | Generic grouping |
| `custom` | Gray | Custom groups |

## 🔧 Component Structure

```
FlowBuilder (Main Component)
├── Toolbar (Panel)
│   ├── Group Button
│   ├── Ungroup Button
│   └── Other controls
├── ReactFlow Canvas
│   ├── Regular Nodes
│   └── GroupNodes
│       └── Child Nodes (nested)
└── Hooks
    └── useHierarchicalDrag (moves children with parent)
```

## 📊 Node Data Structure

### Parent Node (Group)
```typescript
{
  id: 'group-1',
  type: 'group',
  position: { x: 100, y: 100 },
  style: { width: 400, height: 300 },
  data: {
    label: 'My Group',
    isGroup: true,
    groupType: 'category',
    childIds: ['child-1', 'child-2'],
    collapsed: false
  }
}
```

### Child Node
```typescript
{
  id: 'child-1',
  type: 'task',
  position: { x: 50, y: 50 },  // Relative to parent!
  parentNode: 'group-1',        // ReactFlow parent ref
  extent: 'parent',             // Keep inside parent bounds
  data: {
    label: 'Task inside group',
    parentId: 'group-1'         // Business logic ref
  }
}
```

## ⚙️ Key Features Explained

### Automatic Position Conversion
- **Entering group**: Absolute → Relative coordinates
- **Leaving group**: Relative → Absolute coordinates
- Handles automatically on drag

### Intersection Detection
- Uses bounding box calculation
- Checks if node **center point** is inside group
- More accurate than simple overlap

### Synchronized Movement
- `useHierarchicalDrag` hook tracks descendants
- All children move when parent is dragged
- Maintains relative positions

## 🎯 Props Reference

```typescript
interface FlowBuilderProps {
  // Required
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: any) => void
  onEdgesChange: (changes: any) => void
  
  // Optional
  onConnect?: (connection: Connection) => void
  onSave?: (nodes: Node[], edges: Edge[]) => void
  onInit?: (instance: ReactFlowInstance) => void
  onSelectionChange?: (params: OnSelectionChangeParams) => void
  gridSettings?: GridSettings
  showHelperLines?: boolean
  readOnly?: boolean  // Hides toolbar, disables grouping
}
```

## 🧪 Testing Scenarios

### ✅ Manual Grouping
- [ ] Select 2+ nodes with Ctrl+Click
- [ ] Click Group button
- [ ] Verify GroupNode created with correct size
- [ ] Verify children positioned inside

### ✅ Ungrouping
- [ ] Select a GroupNode
- [ ] Click Ungroup button
- [ ] Verify children released to absolute positions
- [ ] Verify group deleted

### ✅ Auto-Parenting
- [ ] Drag node into group
- [ ] Verify node becomes child
- [ ] Verify position converted to relative
- [ ] Drag child out of group
- [ ] Verify becomes independent

### ✅ Hierarchical Drag
- [ ] Create group with children
- [ ] Drag the group
- [ ] Verify all children move together
- [ ] Verify relative positions maintained

## 🐛 Common Issues

### "Group button not working"
- Ensure you selected nodes first (Ctrl+Click)
- Check `readOnly={false}` in FlowBuilder props

### "Node not becoming child when dragged"
- Drop node in the **center** of the group
- Ensure node center point is inside group bounds

### "Children not moving with parent"
- Verify `useHierarchicalDrag` hook is connected
- Check `onNodeDragStart` is wired to `hierarchicalDragStart`

## 📚 Related Files

| File | Purpose |
|------|---------|
| `FlowBuilder.tsx` | Main component with all hierarchy logic |
| `GroupNode.tsx` | Visual group container component |
| `Toolbar.tsx` | Group/Ungroup buttons |
| `useHierarchicalDrag.ts` | Hook for moving children with parent |
| `hierarchy.service.ts` | Pure functions for hierarchy operations |
| `node-hierarchy.ts` | TypeScript type definitions |

## 🎓 Advanced Usage

### Custom Group Creation
```typescript
const createCustomGroup = () => {
  const newGroup: Node = {
    id: `group-${Date.now()}`,
    type: 'group',
    position: { x: 200, y: 200 },
    style: { width: 500, height: 400 },
    data: {
      label: 'Custom Group',
      isGroup: true,
      groupType: 'custom',
      childIds: [],
      collapsed: false
    }
  }
  // Add to nodes array
}
```

### Programmatic Child Assignment
```typescript
const makeChildOfGroup = (childId: string, groupId: string) => {
  const updatedNodes = nodes.map(node => {
    if (node.id === childId) {
      const parent = nodes.find(n => n.id === groupId)
      return {
        ...node,
        position: {
          x: node.position.x - parent.position.x,
          y: node.position.y - parent.position.y
        },
        parentNode: groupId,
        extent: 'parent',
        data: { ...node.data, parentId: groupId }
      }
    }
    if (node.id === groupId) {
      return {
        ...node,
        data: {
          ...node.data,
          childIds: [...(node.data.childIds || []), childId]
        }
      }
    }
    return node
  })
}
```

## 📖 Further Reading

- [Full Architecture Documentation](./node-hierarchy-architecture.md)
- [Implementation Details](./flowbuilder-hierarchy-implementation.md)
- [ReactFlow Parent-Child Docs](https://reactflow.dev/learn/layouting/sub-flows)
