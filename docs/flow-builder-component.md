# FlowBuilder Component - Advanced Process Flow Editor

## Overview

The FlowBuilder is a sophisticated BPMN-style process flow editor built with React and @xyflow/react. It provides a complete visual editor for creating, editing, and visualizing business process flows with a professional three-panel layout: Palette (left), Canvas (center), and Properties (right).

## Architecture

### Component Structure

```
/apps/web/src/components/FlowBuilder/
├── FlowBuilder.tsx          # Main ReactFlow wrapper component
├── Palette.tsx              # Left sidebar with draggable shapes
├── PropertiesPanel.tsx      # Right sidebar for editing properties
├── Toolbar.tsx              # Top toolbar with actions
├── index.ts                 # Barrel export
└── nodes/
    ├── StartEventNode.tsx   # BPMN start event (green circle)
    ├── EndEventNode.tsx     # BPMN end event (red circle)
    ├── TaskNode.tsx         # BPMN task (blue rectangle)
    ├── GatewayNode.tsx      # BPMN gateway (yellow diamond)
    ├── ProcessNode.tsx      # Sub-process (purple rounded rectangle)
    └── index.ts             # Barrel export
```

### EditorLayout

```
/apps/web/src/layouts/
└── EditorLayout.tsx         # Dedicated three-panel layout for editors
```

## Features

### 1. FlowBuilder Component

**Props:**
- `initialNodes: Node[]` - Initial nodes for the flow
- `initialEdges: Edge[]` - Initial edges/connections
- `onNodesChange: (nodes: Node[]) => void` - Callback when nodes change
- `onEdgesChange: (edges: Edge[]) => void` - Callback when edges change
- `onInit: (instance: ReactFlowInstance) => void` - Callback when ReactFlow initializes
- `onSelectionChange: (params) => void` - Callback when selection changes
- `onSave: (nodes, edges) => void` - Callback to save the flow
- `readOnly: boolean` - Enable read-only mode (default: false)

**Features:**
- Custom node types with BPMN-style styling
- Drag-and-drop from palette
- Node-to-node connections with smooth transitions
- Minimap with color-coded node types
- Zoom controls and fit-to-view
- Grid background
- Node/edge selection and deletion
- Read-only mode support

### 2. Custom Node Types

#### StartEventNode
- **Visual**: Green circle with play icon
- **Handles**: Source handle on the right
- **Usage**: Marks the beginning of a process flow
- **Color Scheme**: green-100 background, green-600 border

#### EndEventNode
- **Visual**: Red circle with square icon
- **Handles**: Target handle on the left
- **Usage**: Marks the end of a process flow
- **Color Scheme**: red-100 background, red-600 border

#### TaskNode
- **Visual**: Blue rounded rectangle with checkmark icon
- **Handles**: Target (left) and source (right)
- **Usage**: Represents a single activity or task
- **Color Scheme**: white background, blue-500 border
- **Properties**: label, description

#### GatewayNode
- **Visual**: Yellow diamond rotated 45 degrees with branch icon
- **Handles**: Target (left), source (right, top, bottom)
- **Usage**: Represents decision points or parallel flows
- **Color Scheme**: yellow-100 background, yellow-500 border
- **Special**: Icon rotates -45 degrees to compensate for container rotation

#### ProcessNode
- **Visual**: Purple rounded rectangle with box icon
- **Handles**: Target (left) and source (right)
- **Usage**: Represents a sub-process or linked process
- **Color Scheme**: purple-50 background, purple-500 border
- **Properties**: label, description, processReference

### 3. Palette Component

**Features:**
- Organized by category (Events, Tasks, Gateways, Processes)
- Drag-and-drop interface
- Visual icons for each shape type
- Hover effects with orange accent
- Responsive design

**Usage:**
```tsx
<Palette onDragStart={handleDragStart} />
```

### 4. PropertiesPanel Component

**Features:**
- Context-sensitive properties based on selection
- Editable properties:
  - Node: label, description, position (read-only), processReference (for ProcessNode)
  - Edge: label, condition, connection info (read-only)
- Real-time updates
- Empty state when nothing is selected

**Usage:**
```tsx
<PropertiesPanel
  selectedNode={selectedNode}
  selectedEdge={selectedEdge}
  onNodeUpdate={handleNodeUpdate}
  onEdgeUpdate={handleEdgeUpdate}
/>
```

### 5. Toolbar Component

**Actions:**
- **Save**: Save the current flow
- **Undo/Redo**: History navigation (with disabled states)
- **Zoom**: Zoom in, zoom out, fit to view
- **Edit**: Copy, delete selected elements
- **Align**: Left, center, right alignment

**Usage:**
```tsx
<Toolbar
  onSave={handleSave}
  onUndo={handleUndo}
  onRedo={handleRedo}
  onZoomIn={handleZoomIn}
  onZoomOut={handleZoomOut}
  onFitView={handleFitView}
  onDelete={handleDelete}
  onCopy={handleCopy}
  onAlignLeft={handleAlignLeft}
  onAlignCenter={handleAlignCenter}
  onAlignRight={handleAlignRight}
  canUndo={canUndo}
  canRedo={canRedo}
/>
```

### 6. EditorLayout Component

**Structure:**
- Fixed header with title
- Optional toolbar row
- Three-column layout:
  - Left sidebar (264px width) - Palette
  - Center canvas (flex-1) - Main editor
  - Right sidebar (320px width) - Properties
- Full-height with overflow handling

**Usage:**
```tsx
<EditorLayout
  title="Process Name"
  toolbar={<Toolbar ... />}
  palette={<Palette ... />}
  canvas={<FlowBuilder ... />}
  properties={<PropertiesPanel ... />}
/>
```

## Usage Example

See `apps/web/src/features/processes/pages/FlowDetailPage.tsx` for a complete implementation:

```tsx
export default function FlowDetailPage() {
  const { id } = useParams({ from: '/processes/flow/$id' })
  const { data: process } = useProcess(id)
  
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)

  // Drag and drop handling
  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const type = event.dataTransfer.getData('application/reactflow')
    
    if (!type || !reactFlowInstance) return

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })

    const newNode: Node = {
      id: getNodeId(),
      type,
      position,
      data: { label: type, description: '' },
    }

    setNodes((nds) => nds.concat(newNode))
  }, [reactFlowInstance])

  return (
    <EditorLayout
      title={process.name}
      toolbar={<Toolbar ... />}
      palette={<Palette onDragStart={onDragStart} />}
      canvas={
        <div onDrop={onDrop} onDragOver={onDragOver}>
          <FlowBuilder
            initialNodes={nodes}
            initialEdges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
            onInit={setReactFlowInstance}
            onSelectionChange={onSelectionChange}
          />
        </div>
      }
      properties={
        <PropertiesPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onNodeUpdate={onNodeUpdate}
          onEdgeUpdate={onEdgeUpdate}
        />
      }
    />
  )
}
```

## Styling and Theme

### Color Palette
- **Primary**: Orange (#ff6900) - Brand color, selection highlights
- **Start Event**: Green (#4caf50) - Process beginning
- **End Event**: Red (#f44336) - Process end
- **Task**: Blue (#2196f3) - Activities
- **Gateway**: Yellow/Orange (#ff9800) - Decision points
- **Process**: Purple (#9c27b0) - Sub-processes
- **Background**: Gray-50 (#f9fafb) - Canvas background
- **Grid**: Gray-300 (#ddd) - Dot pattern

### Design Patterns
- **Selected State**: 4px orange ring with 50% opacity shadow
- **Borders**: 2-4px solid colors for emphasis
- **Shadows**: Subtle elevation on nodes
- **Rounded Corners**: 0.5rem (lg) for most nodes, full circle for events
- **Icons**: Lucide React icons (4-6px size)
- **Typography**: Tailwind CSS utilities

## Data Model Integration

The FlowBuilder is designed to work with the comprehensive Prisma Node and Edge models:

### Node Model (50+ attributes)
- **Position**: positionX, positionY
- **Size**: width, height
- **Appearance**: backgroundColor, borderColor, icon, iconPosition
- **Business Logic**: roleId, estimatedDuration, slaTime, status
- **Relations**: subProcessId, linkedDocumentId, linkedInstructionId
- **Advanced**: animation, isHidden, isLocked, data (JSON), metadata (JSON)

### Edge Model (30+ attributes)
- **Appearance**: strokeColor, strokeWidth, strokeDasharray, animated
- **Routing**: markerStart, markerEnd, pathType
- **Logic**: condition, priority, estimatedTime
- **Labels**: label, data (JSON)

## Future Enhancements

### Planned Features
1. **Undo/Redo**: Implement history stack for actions
2. **Copy/Paste**: Duplicate nodes and edge connections
3. **Alignment Tools**: Auto-align nodes horizontally/vertically
4. **Swimlanes/Pools**: BPMN-style organizational containers
5. **Node Grouping**: Group related nodes together
6. **Auto-Layout**: Automatic node arrangement algorithms
7. **Export/Import**: JSON, XML, PNG, SVG exports
8. **Validation**: Business rule validation for flows
9. **Comments**: Annotations and notes on canvas
10. **Collaboration**: Real-time multi-user editing

### API Integration
- Save flow data to ProcessVersion model
- Load existing flows from backend
- Version control for flow changes
- Publish/draft workflow states

### Performance Optimizations
- Virtual rendering for large flows (>100 nodes)
- Lazy loading of node details
- Memoization of expensive calculations
- Web Workers for layout algorithms

## Related Documentation

- [Process Module Documentation](./process-module.md) - Backend API and data models
- [ReactFlow Integration](./reactflow-integration.md) - @xyflow/react patterns and best practices
- [Flow Editor Implementation](./flow-editor-implementation.md) - Step-by-step implementation guide

## Dependencies

- **@xyflow/react**: ^12.9.2 - Modern ReactFlow library
- **lucide-react**: Icons for nodes and UI
- **@repo/ui**: Shared component library (Typography, Button, Input, etc.)
- **tailwindcss**: Utility-first CSS framework

## Development Notes

### Adding New Node Types
1. Create new node component in `nodes/` directory
2. Follow BPMN styling patterns (colored borders, icons, handles)
3. Add to `nodeTypes` object in FlowBuilder.tsx
4. Add to Palette.tsx with appropriate icon and category
5. Export from `nodes/index.ts`

### Testing
- Manual testing with drag-and-drop from palette
- Test node connections and selection
- Verify properties panel updates
- Test toolbar actions (zoom, delete, etc.)
- Check read-only mode functionality

### Performance Considerations
- Nodes are memoized with React.memo
- Use useCallback for event handlers
- Lazy load heavy components
- Limit minimap size for large flows
