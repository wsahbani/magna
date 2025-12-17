# Flow Store - State Management Documentation

## Overview

The Flow Store is a centralized state management solution built with **Zustand** for managing ReactFlow diagrams. It provides a robust, type-safe, and extensible architecture for handling nodes, edges, and all flow-related operations.

## Architecture

### Core Components

```
stores/
├── flowStore.ts           # Main Zustand store with state and actions
├── hooks/
│   ├── useFlowOperations.ts  # Helper hook for common operations
│   └── useFlowApi.ts          # Helper hook for API integration
└── index.ts              # Barrel exports
```

## Features

### ✅ State Management
- **Nodes & Edges**: Complete CRUD operations
- **Selection Management**: Track selected nodes and edges
- **Dirty State**: Track unsaved changes
- **Process Binding**: Link flow to specific process ID
- **DevTools Integration**: Redux DevTools support for debugging

### ✅ Operations
- Add, update, delete nodes and edges
- Duplicate nodes with automatic positioning
- Bulk operations (delete multiple nodes/edges)
- Node alignment and distribution
- Style management

### ✅ API Integration
- Save/load flow data
- Auto-save functionality
- Import/Export as JSON
- Flow validation
- Version management (ready for implementation)

### ✅ Type Safety
- Full TypeScript support
- Strict typing for all operations
- IntelliSense support

## Usage

### Basic Store Usage

```tsx
import { useFlowStore } from '@/stores'

function FlowEditor() {
  // Subscribe to specific state
  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)
  const isDirty = useFlowStore((state) => state.isDirty)
  
  // Get actions
  const addNode = useFlowStore((state) => state.addNode)
  const deleteNode = useFlowStore((state) => state.deleteNode)
  
  // Use in your component
  const handleAddNode = () => {
    addNode({
      type: 'task',
      position: { x: 100, y: 100 },
      data: { label: 'New Task' }
    })
  }
  
  return (
    <div>
      <button onClick={handleAddNode}>Add Node</button>
      {isDirty && <span>⚠️ Unsaved changes</span>}
    </div>
  )
}
```

### Using Flow Operations Hook

```tsx
import { useFlowOperations } from '@/stores'

function FlowToolbar() {
  const {
    hasSelection,
    singleSelectedNode,
    deleteSelected,
    duplicateSelected,
    alignNodes,
    getFlowStats,
  } = useFlowOperations()
  
  const stats = getFlowStats()
  
  return (
    <div>
      <p>Nodes: {stats.totalNodes} | Edges: {stats.totalEdges}</p>
      
      {hasSelection && (
        <>
          <button onClick={deleteSelected}>Delete</button>
          <button onClick={duplicateSelected}>Duplicate</button>
          <button onClick={() => alignNodes('left')}>Align Left</button>
        </>
      )}
    </div>
  )
}
```

### Using Flow API Hook

```tsx
import { useFlowApi } from '@/stores'

function SaveButton() {
  const { 
    saveFlow, 
    isDirty, 
    validateFlow,
    exportFlowAsJson 
  } = useFlowApi()
  
  const handleSave = async () => {
    // Validate before saving
    const validation = validateFlow()
    
    if (!validation.isValid) {
      alert(`Validation errors:\n${validation.errors.join('\n')}`)
      return
    }
    
    try {
      await saveFlow()
      alert('Flow saved successfully!')
    } catch (error) {
      alert('Failed to save flow')
    }
  }
  
  return (
    <>
      <button onClick={handleSave} disabled={!isDirty}>
        💾 Save {isDirty && '*'}
      </button>
      <button onClick={exportFlowAsJson}>
        📥 Export JSON
      </button>
    </>
  )
}
```

### Complete Integration Example

```tsx
import { useFlowStore, useFlowOperations, useFlowApi } from '@/stores'
import { FlowBuilder } from '@/components/FlowBuilder'
import { useEffect } from 'react'

function FlowDetailPage({ processId }: { processId: string }) {
  // Store state
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    loadFlow,
    setProcessId,
  } = useFlowStore()
  
  // Operations
  const { createNode, hasSelection, deleteSelected } = useFlowOperations()
  
  // API integration
  const { saveFlow, loadFlowFromApi, isDirty } = useFlowApi()
  
  // Load flow on mount
  useEffect(() => {
    setProcessId(processId)
    loadFlowFromApi(processId)
  }, [processId])
  
  // Handle drag & drop
  const handleDrop = (event: DragEvent, position: XYPosition) => {
    const nodeType = event.dataTransfer?.getData('nodeType')
    if (nodeType) {
      createNode(nodeType, position)
    }
  }
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && hasSelection) {
        deleteSelected()
      }
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        saveFlow()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasSelection, deleteSelected, saveFlow])
  
  return (
    <div>
      <FlowBuilder
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onDrop={handleDrop}
      />
      
      {isDirty && (
        <div className="fixed bottom-4 right-4">
          <button onClick={saveFlow}>
            💾 Save Changes
          </button>
        </div>
      )}
    </div>
  )
}
```

## API Reference

### FlowStore State

```typescript
interface FlowState {
  // Data
  nodes: Node[]
  edges: Edge[]
  selectedNodes: Node[]
  selectedEdges: Edge[]
  
  // Metadata
  processId: string | null
  isDirty: boolean
  lastSaved: Date | null
  
  // Node Operations
  addNode: (node: Partial<Node>) => Node
  updateNode: (nodeId: string, data: Partial<Node['data']>) => void
  updateNodePosition: (nodeId: string, position: XYPosition) => void
  updateNodeStyle: (nodeId: string, style: Record<string, any>) => void
  deleteNode: (nodeId: string) => void
  deleteNodes: (nodeIds: string[]) => void
  duplicateNode: (nodeId: string) => Node | null
  
  // Edge Operations
  addEdge: (connection: Connection) => void
  updateEdge: (edgeId: string, data: Partial<Edge>) => void
  deleteEdge: (edgeId: string) => void
  deleteEdges: (edgeIds: string[]) => void
  
  // Bulk Operations
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  clearFlow: () => void
  loadFlow: (nodes: Node[], edges: Edge[], processId?: string) => void
  
  // ReactFlow Handlers
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  
  // Selection
  setSelectedNodes: (nodes: Node[]) => void
  setSelectedEdges: (edges: Edge[]) => void
  clearSelection: () => void
  
  // Persistence
  markAsSaved: () => void
  setProcessId: (processId: string) => void
  
  // Undo/Redo (future)
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
}
```

### useFlowOperations Hook

```typescript
const {
  // State
  nodes,
  edges,
  selectedNodes,
  selectedEdges,
  isDirty,
  hasSelection,
  singleSelectedNode,
  singleSelectedEdge,
  
  // Operations
  createNode,
  updateNode,
  updateNodeStyle,
  deleteNode,
  duplicateNode,
  duplicateSelected,
  addEdge,
  updateEdge,
  deleteEdge,
  deleteSelected,
  clearSelection,
  
  // Layout
  alignNodes,
  distributeNodes,
  updateSelectedNodesStyle,
  
  // Utility
  exportFlow,
  getFlowStats,
} = useFlowOperations()
```

### useFlowApi Hook

```typescript
const {
  // State
  processId,
  isDirty,
  hasUnsavedChanges,
  
  // API Operations
  saveFlow,
  loadFlowFromApi,
  autoSave,
  
  // Import/Export
  exportFlowAsJson,
  importFlowFromJson,
  
  // Versioning
  createFlowVersion,
  
  // Validation
  validateFlow,
  
  // Utility
  clearFlow,
} = useFlowApi()
```

## Advanced Features

### Flow Validation

```tsx
const { validateFlow } = useFlowApi()

const validation = validateFlow()

if (!validation.isValid) {
  console.log('Validation errors:', validation.errors)
  // Example errors:
  // - "3 disconnected node(s) found"
  // - "Flow must have at least one Start Event"
  // - "Flow must have at least one End Event"
}
```

### Node Alignment

```tsx
const { alignNodes } = useFlowOperations()

// Align selected nodes
alignNodes('left')    // Align to leftmost node
alignNodes('right')   // Align to rightmost node
alignNodes('top')     // Align to topmost node
alignNodes('bottom')  // Align to bottommost node
alignNodes('center')  // Align to center (horizontal)
alignNodes('middle')  // Align to middle (vertical)
```

### Node Distribution

```tsx
const { distributeNodes } = useFlowOperations()

// Distribute 3+ selected nodes evenly
distributeNodes('horizontal')  // Horizontal spacing
distributeNodes('vertical')    // Vertical spacing
```

### Export/Import

```tsx
const { exportFlowAsJson, importFlowFromJson } = useFlowApi()

// Export
exportFlowAsJson() // Downloads JSON file

// Import
const handleFileUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const json = e.target?.result as string
    importFlowFromJson(json)
  }
  reader.readAsText(file)
}
```

## Performance Optimization

### Selective Subscriptions

```tsx
// ✅ Good - Only re-renders when nodes change
const nodes = useFlowStore((state) => state.nodes)

// ❌ Bad - Re-renders on any state change
const store = useFlowStore()
const nodes = store.nodes
```

### Shallow Equality

```tsx
import { shallow } from 'zustand/shallow'

// Only re-renders when nodes or edges arrays change (shallow comparison)
const { nodes, edges } = useFlowStore(
  (state) => ({ nodes: state.nodes, edges: state.edges }),
  shallow
)
```

## Future Enhancements

### Undo/Redo (Planned)

```tsx
// Will be implemented using zustand/middleware
const { undo, redo, canUndo, canRedo } = useFlowStore()

<button onClick={undo} disabled={!canUndo}>↶ Undo</button>
<button onClick={redo} disabled={!canRedo}>↷ Redo</button>
```

### LocalStorage Persistence (Optional)

Uncomment the `persist` middleware in `flowStore.ts` to enable:

```typescript
export const useFlowStore = create<FlowState>()(
  devtools(
    persist(
      (set, get) => ({ /* ... */ }),
      {
        name: 'flow-storage',
        partialize: (state) => ({ 
          nodes: state.nodes,
          edges: state.edges,
          processId: state.processId,
        }),
      }
    )
  )
)
```

## Best Practices

### ✅ DO

- Use selective subscriptions for performance
- Validate flow before saving
- Track dirty state to prevent data loss
- Use helper hooks for common operations
- Use DevTools for debugging

### ❌ DON'T

- Don't mutate store state directly
- Don't subscribe to entire store unless needed
- Don't forget to handle errors in API operations
- Don't skip validation before save

## Debugging

### Redux DevTools

The store is configured with Redux DevTools support:

1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. Open DevTools in browser
3. Select "FlowStore" tab
4. View all actions and state changes

### Logging

Enable action logging in development:

```typescript
// In flowStore.ts
devtools(
  (set, get) => ({ /* ... */ }),
  {
    name: 'FlowStore',
    enabled: process.env.NODE_ENV === 'development',
  }
)
```

## Migration Guide

### From useState to Zustand

**Before:**
```tsx
const [nodes, setNodes, onNodesChange] = useNodesState([])
const [edges, setEdges, onEdgesChange] = useEdgesState([])
```

**After:**
```tsx
const { nodes, edges, onNodesChange, onEdgesChange } = useFlowStore()
```

### From Props to Store

**Before:**
```tsx
<FlowBuilder
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
/>
```

**After:**
```tsx
// FlowBuilder can read directly from store
const { nodes, edges, onNodesChange, onEdgesChange } = useFlowStore()
```

## Troubleshooting

### Issue: Changes not reflecting

**Solution:** Make sure you're using the store actions, not local state:
```tsx
// ❌ Wrong
setNodes([...nodes, newNode])

// ✅ Correct
addNode(newNode)
```

### Issue: Performance issues

**Solution:** Use selective subscriptions:
```tsx
// ❌ Wrong - subscribes to everything
const store = useFlowStore()

// ✅ Correct - only subscribes to what you need
const isDirty = useFlowStore((state) => state.isDirty)
```

## Related Documentation

- [FlowBuilder Component](./flow-builder-component.md)
- [Custom Nodes](./custom-render-examples.md)
- [API Integration](./api.md)
