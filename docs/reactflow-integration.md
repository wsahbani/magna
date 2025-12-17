# ReactFlow Integration Documentation

## Overview

The process management system has been enhanced with comprehensive ReactFlow support for advanced process visualization and modeling. This document outlines the ReactFlow-specific features and capabilities.

## Enhanced Node Model

### Core ReactFlow Features

- **Positioning & Layout**: Precise positioning with `positionX`, `positionY`, `width`, `height`, and `zIndex`
- **Handle Configuration**: Source/target positions for connections (`HandlePosition` enum)
- **Interaction States**: Draggable, selectable, and connectable properties
- **Hierarchical Support**: Parent-child relationships with `parentNodeId` for grouped nodes

### Advanced Styling System

#### Basic Styling
```prisma
backgroundColor  String?    // Node background color
borderColor      String?    // Border color
borderWidth      Int?       // Border thickness
borderRadius     Int?       // Corner radius
fontSize         Int?       // Text size
fontColor        String?    // Text color
fontWeight       String?    // Font weight
opacity          Float?     // Transparency
```

#### Conditional Styling
- **Hover Effects**: `hoverStyle` JSON for mouse-over states
- **Selection States**: `selectedStyle` JSON for selected nodes
- **Error States**: `errorStyle` JSON for validation errors

#### Icon System
- **Icon Support**: Icon name/URL with position, size, and color configuration
- **Icon Positions**: LEFT, RIGHT, TOP, BOTTOM, CENTER

### Animation & Effects

- **Animation Types**: Pulse, shake, glow, and custom animations
- **Transitions**: CSS transition properties for smooth state changes
- **Duration Control**: Configurable animation timing

### Business Logic Integration

- **Validation Rules**: Custom JSON-based validation logic
- **Business Rules**: Process-specific business logic configuration
- **Performance Metrics**: Estimated vs actual duration tracking
- **SLA Monitoring**: Time limit enforcement

### Enhanced Node Types

#### BPMN 2.0 Compatible Types
- **Events**: START_EVENT, END_EVENT, INTERMEDIATE_EVENT
- **Activities**: TASK, USER_TASK, SERVICE_TASK, SCRIPT_TASK, etc.
- **Gateways**: EXCLUSIVE_GATEWAY, INCLUSIVE_GATEWAY, PARALLEL_GATEWAY
- **Data Objects**: DATA_OBJECT, DATA_STORE
- **Participants**: POOL, LANE

#### Orange-Specific Types (PYX4 Methodology)
- **INSTRUCTION**: Basic PYX4 instruction
- **MACRO_INSTRUCTION**: Grouped instructions
- **INSTRUCTION_COLLAB**: Collaborative tasks
- **ACTION_AMONT/AVAL**: Upstream/downstream processes
- **DOCUMENT_REF/MOYEN_REF**: Resource references

#### Custom ReactFlow Types
- **INPUT_NODE/OUTPUT_NODE**: Specialized I/O nodes
- **CUSTOM_NODE**: Fully customizable nodes

## Enhanced Edge Model

### ReactFlow Edge Features

#### Visual Configuration
- **Animation**: Animated flow indicators
- **Styling**: Custom colors, widths, and dash patterns
- **Markers**: Configurable start/end arrows with size control
- **Path Types**: STRAIGHT, SMOOTH_STEP, STEP, BEZIER, SIMPLE_BEZIER

#### Label System
- **Label Styling**: Custom text appearance
- **Background Control**: Label background with padding and border radius
- **Positioning**: Smart label placement along edges

#### Advanced Edge Types
- **Flow Types**: SEQUENCE_FLOW, CONDITIONAL_FLOW, MESSAGE_FLOW
- **Associations**: DATA_ASSOCIATION, ASSOCIATION
- **Custom Flows**: PARALLEL_FLOW, EXCLUSIVE_FLOW, INCLUSIVE_FLOW
- **Orange-Specific**: CONTROL_FLOW, DATA_FLOW, RESOURCE_FLOW

### Business Logic Support
- **Conditional Logic**: Condition expressions for decision flows
- **Probability**: Stochastic flow probability values
- **Priority**: Flow execution priority
- **Timing**: Estimated vs actual transition times

## ReactFlow Layout Configuration

### ProcessLayout Model

#### Viewport Management
```typescript
viewportX: number        // Viewport X position
viewportY: number        // Viewport Y position
viewportZoom: number     // Zoom level (1.0 = 100%)
```

#### Layout Control
- **Direction**: LEFT_TO_RIGHT, RIGHT_TO_LEFT, TOP_TO_BOTTOM, BOTTOM_TO_TOP
- **Spacing**: Node and rank spacing configuration
- **Auto-layout**: Support for dagre, elk algorithms

#### Grid System
- **Snap to Grid**: Automatic node alignment
- **Grid Size**: Configurable grid spacing
- **Visual Grid**: Show/hide grid overlay

#### UI Components
- **Minimap**: Position and visibility control
- **Controls**: Pan/zoom controls positioning
- **Background**: DOTS, LINES, CROSS, or NONE patterns

## Node Templates System

### Template Categories
- **Basic**: Standard process elements
- **Gateways**: Decision and parallel gateways
- **Events**: Start, end, and intermediate events
- **Custom**: Organization-specific templates

### Template Features
- **Default Styling**: Pre-configured appearance
- **Icon Support**: Template icons and thumbnails
- **Usage Tracking**: Template popularity metrics
- **Workspace Scope**: Private and public templates

## Process Themes

### Theme Configuration
- **Node Styles**: Default styling by node type
- **Edge Styles**: Default styling by edge type
- **Color Palette**: Primary, secondary, success, error, warning colors
- **Typography**: Font family and size configuration
- **Spacing**: Layout spacing rules

### Organization Features
- **Workspace Themes**: Department-specific styling
- **Public/Private**: Shared vs private themes
- **Default Themes**: System-wide defaults

## Implementation Examples

### Creating a Custom Node
```typescript
const customNode = {
  type: NodeType.CUSTOM_NODE,
  label: "Custom Process Step",
  backgroundColor: "#e3f2fd",
  borderColor: "#1976d2",
  borderRadius: 8,
  icon: "custom-icon",
  iconPosition: IconPosition.LEFT,
  animation: "pulse",
  style: {
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  }
}
```

### Configuring Edge Styling
```typescript
const styledEdge = {
  type: EdgeType.CONDITIONAL_FLOW,
  strokeColor: "#f57c00",
  strokeWidth: 2,
  strokeDasharray: "5,5",
  animated: true,
  markerEnd: "arrowclosed",
  pathType: PathType.SMOOTH_STEP,
  labelStyle: {
    fill: "#f57c00",
    fontWeight: "bold"
  }
}
```

### Layout Configuration
```typescript
const processLayout = {
  layoutDirection: LayoutDirection.TOP_TO_BOTTOM,
  nodeSpacing: 60,
  rankSpacing: 120,
  snapToGrid: true,
  gridSize: 20,
  showMinimap: true,
  minimapPosition: MinimapPosition.BOTTOM_RIGHT,
  backgroundType: BackgroundType.DOTS
}
```

## Frontend Integration Guide

### ReactFlow Component Setup
1. **Install ReactFlow**: `npm install reactflow`
2. **Import Types**: Use Prisma-generated types for consistency
3. **Style Integration**: Map database styles to ReactFlow properties
4. **Event Handling**: Process node/edge interactions

### Key Integration Points
- **Node Data Mapping**: Convert database Node to ReactFlow Node
- **Edge Data Mapping**: Convert database Edge to ReactFlow Edge
- **Layout Persistence**: Save/restore viewport and layout settings
- **Template System**: Dynamic node creation from templates
- **Theme Application**: Apply workspace themes to visualization

## Benefits for Orange Group

### Enhanced Process Visualization
- **Professional Appearance**: Consistent, branded process diagrams
- **Interactive Elements**: Hover effects, selection states, animations
- **Responsive Design**: Adaptive layouts for different screen sizes

### Improved User Experience
- **Intuitive Modeling**: Drag-and-drop process creation
- **Real-time Collaboration**: Live editing capabilities
- **Template Library**: Quick process creation from templates

### Advanced Analytics
- **Performance Visualization**: Color-coded performance metrics
- **Status Indicators**: Real-time process status visualization
- **Flow Animation**: Animated process execution paths

### Customization Capabilities
- **Department Branding**: Custom themes per department
- **Role-based Views**: Different visualizations by user role
- **Export Options**: Professional diagram exports

This ReactFlow integration transforms the process management system into a powerful, visual process modeling tool suitable for enterprise-level process management across the Orange Group organization.