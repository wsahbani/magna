# BaseNode Architecture - Scalable Node System

## Overview

The BaseNode architecture provides a robust, scalable foundation for creating custom ReactFlow nodes. It follows the **composition over inheritance** pattern and uses a **factory function** approach to generate node components with consistent behavior and appearance.

## Architecture Benefits

### 1. **DRY Principle (Don't Repeat Yourself)**
- Common node logic is centralized in `BaseNode.tsx`
- No code duplication across node types
- Single source of truth for node rendering

### 2. **Consistency**
- All nodes follow the same visual patterns
- Consistent selection states, handles, and labels
- Uniform behavior across all node types

### 3. **Scalability**
- Add new node types in seconds, not hours
- Simply configure shape, colors, icon, and handles
- No need to write repetitive JSX or handle logic

### 4. **Maintainability**
- Bug fixes in one place benefit all nodes
- Easy to add new features to all nodes
- Clear separation of concerns

### 5. **Type Safety**
- Full TypeScript support
- Type-safe configuration with interfaces
- Compile-time validation of node properties

## Core Components

### BaseNode.tsx

#### `createNode(config: BaseNodeConfig)`
Factory function that creates a memoized React component based on configuration.

**Parameters:**
- `config`: BaseNodeConfig - Complete node configuration

**Returns:**
- React.MemoExoticComponent - Memoized node component

#### `defineNodeConfig(config: BaseNodeConfig)`
Utility function for type-safe configuration definition.

**Example:**
```tsx
const config = defineNodeConfig({
  shape: 'circle',
  backgroundColor: 'green-100',
  borderColor: 'border-green-600',
  borderWidth: 4,
  icon: <Play className="w-5 h-5" />,
  handles: [HANDLE_CONFIGS.sourceRight],
})
```

### BaseNodeConfig Interface

```typescript
interface BaseNodeConfig {
  // Visual appearance
  shape: 'circle' | 'rectangle' | 'diamond' | 'rounded-rectangle'
  backgroundColor: string
  borderColor: string
  borderWidth: number
  size?: {
    width: string | number
    height: string | number
  }
  
  // Icon configuration
  icon?: ReactNode
  iconColor?: string
  iconRotation?: number  // Degrees, useful for diamond shapes
  
  // Handles configuration
  handles: Array<{
    type: 'source' | 'target'
    position: Position
    id?: string
  }>
  
  // Label configuration
  showLabel?: boolean
  labelPosition?: 'inside' | 'below' | 'above'
  
  // Additional styles
  className?: string
  selectedRingColor?: string  // Default: 'ring-orange-400'
}
```

### Predefined Utilities

#### COLOR_SCHEMES
Pre-configured color combinations for common node types:
- `green` - Start events, success states
- `red` - End events, error states
- `blue` - Tasks, general activities
- `yellow` - Gateways, decisions
- `purple` - Sub-processes, containers
- `orange` - Highlights, warnings
- `gray` - Neutral, disabled states

**Usage:**
```tsx
...COLOR_SCHEMES.green  // Expands to backgroundColor, borderColor, iconColor
```

#### HANDLE_CONFIGS
Pre-configured handle positions:
- `sourceRight` - Output on right side
- `targetLeft` - Input on left side
- `sourceBottom` - Output on bottom
- `targetTop` - Input on top
- `sourceTop` - Output on top
- `targetBottom` - Input on bottom

**Usage:**
```tsx
handles: [
  HANDLE_CONFIGS.targetLeft,
  HANDLE_CONFIGS.sourceRight,
]
```

## Creating New Node Types

### Example 1: Simple Event Node

```tsx
import { Circle } from 'lucide-react'
import { createNode, defineNodeConfig, COLOR_SCHEMES, HANDLE_CONFIGS } from './BaseNode'

export const IntermediateEventNode = createNode(
  defineNodeConfig({
    shape: 'circle',
    ...COLOR_SCHEMES.blue,
    borderWidth: 3,
    icon: <Circle className="w-4 h-4" />,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'below',
  })
)

IntermediateEventNode.displayName = 'IntermediateEventNode'
```

### Example 2: Complex Task Node with Custom Colors

```tsx
import { Users } from 'lucide-react'
import { createNode, defineNodeConfig, HANDLE_CONFIGS } from './BaseNode'

export const UserTaskNode = createNode(
  defineNodeConfig({
    shape: 'rectangle',
    backgroundColor: 'white',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-600',
    borderWidth: 2,
    icon: <Users className="w-4 h-4" />,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    className: 'border-l-4 border-l-blue-700', // Custom left border accent
  })
)

UserTaskNode.displayName = 'UserTaskNode'
```

### Example 3: Gateway with Multiple Outputs

```tsx
import { GitBranch } from 'lucide-react'
import { createNode, defineNodeConfig, COLOR_SCHEMES, HANDLE_CONFIGS } from './BaseNode'

export const GatewayNode = createNode(
  defineNodeConfig({
    shape: 'diamond',
    ...COLOR_SCHEMES.yellow,
    borderWidth: 4,
    icon: <GitBranch className="w-6 h-6" />,
    iconRotation: -45, // Compensate for diamond rotation
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
      HANDLE_CONFIGS.sourceTop,
      HANDLE_CONFIGS.sourceBottom,
    ],
    showLabel: true,
    labelPosition: 'below',
  })
)

GatewayNode.displayName = 'GatewayNode'
```

## Node Shapes

### Circle
- Perfect for events (start, end, intermediate)
- Icon centered
- Label below by default
- Fixed size (w-12 h-12 default)

### Rectangle
- Standard tasks and activities
- Icon + label side-by-side
- Supports description text
- Flexible width (min-w-[120px] default)

### Rounded Rectangle
- Sub-processes and containers
- More prominent rounded corners
- Icon + label + description
- Wider default (min-w-[140px])

### Diamond
- Gateways and decision points
- Rotated 45 degrees
- Icon rotated back for readability
- Multiple output handles (top, bottom, right)

## Best Practices

### 1. Always Use defineNodeConfig
```tsx
// ✅ Good - Type-safe configuration
export const MyNode = createNode(
  defineNodeConfig({
    shape: 'circle',
    // ...
  })
)

// ❌ Bad - No type checking
export const MyNode = createNode({
  shape: 'circle',
  // ...
} as BaseNodeConfig)
```

### 2. Set Display Names
```tsx
export const MyNode = createNode(config)
MyNode.displayName = 'MyNode' // ✅ Helps with debugging
```

### 3. Use Predefined Utilities
```tsx
// ✅ Good - Reusable, consistent
...COLOR_SCHEMES.blue,
handles: [HANDLE_CONFIGS.sourceRight]

// ❌ Bad - Repetitive, error-prone
backgroundColor: 'white',
borderColor: 'border-blue-500',
iconColor: 'text-blue-600',
handles: [{ type: 'source', position: Position.Right }]
```

### 4. Icon Sizes
- Circle events: `w-4 h-4` to `w-5 h-5`
- Rectangle tasks: `w-4 h-4`
- Diamond gateways: `w-5 h-5` to `w-6 h-6`
- Rounded rectangles: `w-5 h-5`

### 5. Border Widths
- Events: `border-4` (thick, prominent)
- Tasks: `border-2` (standard)
- Gateways: `border-4` (thick)
- Sub-processes: `border-2` to `border-3`

## Registration Workflow

### 1. Create Node Component
```tsx
// /nodes/MyCustomNode.tsx
export const MyCustomNode = createNode(defineNodeConfig({ ... }))
MyCustomNode.displayName = 'MyCustomNode'
```

### 2. Export from Index
```tsx
// /nodes/index.ts
export { MyCustomNode } from './MyCustomNode'
```

### 3. Register in FlowBuilder
```tsx
// FlowBuilder.tsx
import { MyCustomNode } from './nodes'

const nodeTypes: NodeTypes = {
  myCustom: MyCustomNode,
  // ...
}
```

### 4. Add to Palette
```tsx
// Palette.tsx
<PaletteItem
  icon={<MyIcon className="w-5 h-5 text-color" />}
  label="My Custom Node"
  nodeType="myCustom"
  onDragStart={onDragStart}
/>
```

### 5. Add Minimap Color (Optional)
```tsx
// FlowBuilder.tsx - MiniMap nodeColor function
case 'myCustom': return '#hexcolor'
```

## Current Node Types

### Core BPMN Nodes
1. **StartEventNode** - Process start (green circle)
2. **EndEventNode** - Process end (red circle)
3. **TaskNode** - General task (blue rectangle)
4. **GatewayNode** - Decision point (yellow diamond)
5. **ProcessNode** - Sub-process (purple rounded rectangle)

### Event Nodes
6. **IntermediateEventNode** - Mid-process event (blue circle)
7. **TimerEventNode** - Time-based trigger (amber circle)
8. **MessageEventNode** - Message trigger (cyan circle)
9. **ErrorEventNode** - Error handler (rose circle)

### Task Nodes
10. **UserTaskNode** - Human task (blue rectangle with left accent)
11. **ServiceTaskNode** - Automated task (indigo rectangle with left accent)

## Performance Considerations

### Memoization
All nodes created with `createNode` are automatically memoized with `React.memo`:
- Prevents unnecessary re-renders
- Only re-renders when props change
- Optimized for large diagrams (100+ nodes)

### Handle Positioning
- Handles are positioned with CSS, not JavaScript
- Diamond shape handles use inline styles for precise positioning
- Minimal DOM manipulation

### Icon Rotation
- CSS transforms for icon rotation (diamond shapes)
- Hardware-accelerated transformations
- No layout recalculation

## Future Enhancements

### Planned Features
1. **Animation Support**: Built-in animation configurations
2. **Conditional Styling**: Dynamic colors based on node state
3. **Custom Handle Rendering**: More flexible handle customization
4. **Shape Variants**: Hexagons, pentagons, custom SVG shapes
5. **Theming**: Global theme configuration for all nodes
6. **Accessibility**: ARIA labels, keyboard navigation
7. **Drag Previews**: Custom drag preview rendering
8. **Node Templates**: Pre-configured node bundles for common patterns

### Extension Points
```tsx
// Future: Custom shape renderer
interface BaseNodeConfig {
  // ...existing props
  customRenderer?: (props: RenderProps) => ReactNode
  theme?: 'light' | 'dark' | 'auto'
  animations?: {
    pulse?: boolean
    glow?: boolean
    shake?: boolean
  }
}
```

## Troubleshooting

### Node Not Appearing
- Check node type is registered in `nodeTypes` object
- Verify node is exported from `/nodes/index.ts`
- Ensure correct nodeType string in Palette and drag-drop handler

### Icon Not Rotating Correctly (Diamond)
- Use `iconRotation: -45` to compensate for diamond rotation
- Verify icon is wrapped in div with transform style

### Handles Not Clickable
- Ensure `!bg-{color}` has the `!` important prefix
- Check z-index if handles are behind node content
- Verify handle className includes size (`w-2 h-2`)

### Label Not Showing
- Set `showLabel: true` in config
- Verify `data.label` exists in node data
- Check labelPosition matches your shape type

## Related Files

- `/components/FlowBuilder/nodes/BaseNode.tsx` - Core architecture
- `/components/FlowBuilder/nodes/*.tsx` - Node implementations
- `/components/FlowBuilder/FlowBuilder.tsx` - Node registration
- `/components/FlowBuilder/Palette.tsx` - Node palette UI
- `/docs/flow-builder-component.md` - FlowBuilder overview
