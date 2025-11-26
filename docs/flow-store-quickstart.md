# Flow Store Implementation - Quick Start Guide

## 🎯 Overview

Zustand-based state management for ReactFlow with complete CRUD operations, API integration, and advanced features.

## 📦 What's Included

### 1. **Core Store** (`stores/flowStore.ts`)
- Centralized state for nodes, edges, selection
- All CRUD operations
- Dirty state tracking
- DevTools integration

### 2. **Helper Hooks**
- `useFlowOperations` - Common operations (align, duplicate, etc.)
- `useFlowApi` - API integration, validation, export/import

### 3. **Complete Documentation** (`docs/flow-store.md`)
- API reference
- Usage examples
- Best practices
- Performance tips

## 🚀 Quick Start

### 1. Install Dependencies

Already installed: `zustand@5.0.8`

### 2. Import and Use

```tsx
import { useFlowStore } from '@/stores/flowStore'

function MyFlowEditor() {
  const { 
    nodes, 
    edges, 
    addNode, 
    onNodesChange, 
    onEdgesChange 
  } = useFlowStore()
  
  return (
    <FlowBuilder
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    />
  )
}
```

## 📋 Key Features

### ✅ Complete CRUD
```tsx
// Add node
addNode({ type: 'task', position: { x: 0, y: 0 }, data: { label: 'Task' } })

// Update node
updateNode('node_1', { label: 'Updated Task' })

// Delete node (and connected edges)
deleteNode('node_1')

// Add edge
addEdge({ source: 'node_1', target: 'node_2' })
```

### ✅ Selection Management
```tsx
const { selectedNodes, selectedEdges } = useFlowStore()
```

### ✅ Dirty State
```tsx
const isDirty = useFlowStore((state) => state.isDirty)

{isDirty && <span>⚠️ Unsaved changes</span>}
```

### ✅ Advanced Operations
```tsx
import { useFlowOperations } from '@/stores'

const { 
  duplicateSelected,
  alignNodes,
  distributeNodes 
} = useFlowOperations()
```

### ✅ API Integration
```tsx
import { useFlowApi } from '@/stores'

const { 
  saveFlow, 
  loadFlowFromApi, 
  validateFlow,
  exportFlowAsJson 
} = useFlowApi()
```

## 🎨 Usage in FlowDetailPage

The `FlowDetailPage` has been updated to use Zustand:

**Before:**
```tsx
const [nodes, setNodes, onNodesChange] = useNodesState([])
const [edges, setEdges, onEdgesChange] = useEdgesState([])
```

**After:**
```tsx
const {
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  addNode,
  addEdge,
  // ... all actions available
} = useFlowStore()
```

## 🔧 Next Steps - API Integration

### Step 1: Update Process API

Add diagram field to process update:

```tsx
// In apps/web/src/lib/api/processes.ts

export const updateProcessDiagram = async (
  processId: string, 
  diagram: string
) => {
  const response = await baseApi.patch(`/processes/${processId}`, {
    diagram
  })
  return response.data
}
```

### Step 2: Implement Save in FlowDetailPage

```tsx
import { useFlowApi } from '@/stores'
import { updateProcessDiagram } from '@/lib/api/processes'

const handleSave = async () => {
  const { nodes, edges } = useFlowStore.getState()
  
  const flowData = JSON.stringify({ nodes, edges })
  await updateProcessDiagram(processId, flowData)
  
  markAsSaved()
}
```

### Step 3: Load Flow on Mount

```tsx
useEffect(() => {
  if (process?.diagram) {
    const flowData = JSON.parse(process.diagram)
    loadFlow(flowData.nodes, flowData.edges, id)
  }
}, [process])
```

## 🎯 Benefits

### Before Zustand
- ❌ State scattered across components
- ❌ Props drilling for sharing state
- ❌ Complex update logic
- ❌ Difficult to add features
- ❌ No centralized dirty state

### After Zustand
- ✅ Single source of truth
- ✅ No props drilling
- ✅ Simple, predictable updates
- ✅ Easy to extend
- ✅ Built-in dirty tracking
- ✅ DevTools support
- ✅ Type-safe operations

## 🔍 DevTools

Store is configured with Redux DevTools:

1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. Open browser DevTools
3. Look for "FlowStore" tab
4. See all actions and state changes in real-time

## 📝 Example: Complete Flow Editor

```tsx
import { useFlowStore, useFlowOperations, useFlowApi } from '@/stores'
import { FlowBuilder } from '@/components/FlowBuilder'

function FlowEditor({ processId }: { processId: string }) {
  // Store
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange 
  } = useFlowStore()
  
  // Operations
  const { 
    createNode, 
    hasSelection, 
    deleteSelected 
  } = useFlowOperations()
  
  // API
  const { 
    saveFlow, 
    isDirty, 
    validateFlow 
  } = useFlowApi()
  
  const handleSave = async () => {
    const validation = validateFlow()
    if (!validation.isValid) {
      alert(validation.errors.join('\n'))
      return
    }
    
    try {
      await saveFlow()
      alert('✅ Saved!')
    } catch (error) {
      alert('❌ Failed to save')
    }
  }
  
  return (
    <div>
      {/* Toolbar */}
      <div>
        <button onClick={handleSave} disabled={!isDirty}>
          💾 Save {isDirty && '*'}
        </button>
        
        {hasSelection && (
          <button onClick={deleteSelected}>
            🗑️ Delete
          </button>
        )}
      </div>
      
      {/* Canvas */}
      <FlowBuilder
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </div>
  )
}
```

## 🚦 Migration Checklist

- [x] Install Zustand
- [x] Create flowStore.ts
- [x] Create helper hooks (useFlowOperations, useFlowApi)
- [x] Update FlowDetailPage to use store
- [x] Remove local state (useNodesState, useEdgesState)
- [x] Test all operations work
- [ ] Implement API save endpoint
- [ ] Implement API load endpoint
- [ ] Add error handling
- [ ] Add success/error toasts
- [ ] Add auto-save (optional)
- [ ] Enable localStorage persistence (optional)
- [ ] Implement undo/redo (optional)

## 📚 Full Documentation

See [flow-store.md](./flow-store.md) for:
- Complete API reference
- Advanced features
- Performance optimization
- Best practices
- Troubleshooting

## 🎓 Learn More

- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [ReactFlow Documentation](https://reactflow.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
