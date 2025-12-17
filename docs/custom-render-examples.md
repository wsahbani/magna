# Custom Render Examples

This document provides comprehensive examples of using the `customRender` feature in BaseNode to create advanced, fully customized nodes.

## Overview

The `customRender` prop allows you to override the default node rendering completely while still leveraging BaseNode utilities like handle rendering, icon display, and styling helpers.

## CustomRenderProps Interface

When you provide a `customRender` function, you receive these props:

```typescript
interface CustomRenderProps {
  data: any                                    // Node data from ReactFlow
  selected: boolean                            // Whether node is selected
  config: BaseNodeConfig                       // Original configuration
  renderHandles: () => ReactNode               // Helper to render connection points
  renderIcon: () => ReactNode                  // Helper to render the icon
  renderLabel: () => ReactNode                 // Helper to render the label
  renderDescription: () => ReactNode           // Helper to render the description
  getShapeStyles: () => string                 // Helper to get computed shape classes
}
```

## Example 1: Database Node

A multi-section node with header, content area, and optional footer.

```tsx
import { Database, Settings } from 'lucide-react'
import { Position } from '@xyflow/react'
import { createNode, defineNodeConfig, HANDLE_CONFIGS } from './BaseNode'

export const DatabaseNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-teal-500',
    iconColor: 'text-teal-600',
    borderWidth: 2,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
      { type: 'source', position: Position.Bottom, id: 'data-out' },
    ],
    customRender: ({ data, selected, renderHandles }) => {
      const selectedClass = selected 
        ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' 
        : 'shadow'
      
      return (
        <div className={`relative min-w-[180px] bg-white border-2 border-teal-500 rounded-lg overflow-hidden transition-all duration-200 ${selectedClass}`}>
          {renderHandles()}
          
          {/* Header Section */}
          <div className="bg-teal-50 px-4 py-2 border-b border-teal-200 flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-600" />
            <div className="text-sm font-semibold text-gray-900">
              {data?.label || 'Database'}
            </div>
          </div>
          
          {/* Content Section */}
          <div className="px-4 py-3">
            {data?.description && (
              <div className="text-xs text-gray-600 mb-2">
                {data.description}
              </div>
            )}
            
            {/* Database Details */}
            <div className="space-y-1">
              {data?.database && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">DB:</span>
                  <span className="font-mono text-gray-700">{data.database}</span>
                </div>
              )}
              {data?.table && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Table:</span>
                  <span className="font-mono text-gray-700">{data.table}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer Actions (Optional) */}
          {data?.showActions && (
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex items-center justify-end gap-2">
              <Settings className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          )}
        </div>
      )
    },
  })
)
```

**Usage:**
```tsx
const databaseNode = {
  id: 'db1',
  type: 'database',
  position: { x: 100, y: 100 },
  data: {
    label: 'User Database',
    description: 'PostgreSQL production database',
    database: 'users_db',
    table: 'accounts',
    showActions: true,
  },
}
```

## Example 2: API Call Node

A node with dynamic HTTP method badges and status indicators.

```tsx
export const ApiCallNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-indigo-500',
    borderWidth: 2,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
      { type: 'source', position: Position.Bottom, id: 'error' },
    ],
    customRender: ({ data, selected, renderHandles }) => {
      const selectedClass = selected 
        ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' 
        : 'shadow'
      
      const methodColors: Record<string, string> = {
        GET: 'bg-green-100 text-green-700',
        POST: 'bg-blue-100 text-blue-700',
        PUT: 'bg-amber-100 text-amber-700',
        DELETE: 'bg-red-100 text-red-700',
        PATCH: 'bg-purple-100 text-purple-700',
      }
      
      const method = data?.method?.toUpperCase() || 'GET'
      const methodClass = methodColors[method] || 'bg-gray-100 text-gray-700'
      
      return (
        <div className={`relative min-w-[200px] bg-white border-2 border-indigo-500 rounded-lg transition-all duration-200 ${selectedClass}`}>
          {renderHandles()}
          
          <div className="px-4 py-3">
            {/* Method Badge + Label */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded text-xs font-bold ${methodClass}`}>
                {method}
              </span>
              <div className="text-sm font-semibold text-gray-900 truncate">
                {data?.label || 'API Call'}
              </div>
            </div>
            
            {/* Endpoint */}
            {data?.endpoint && (
              <div className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200 truncate">
                {data.endpoint}
              </div>
            )}
            
            {/* Description */}
            {data?.description && (
              <div className="mt-2 text-xs text-gray-500">
                {data.description}
              </div>
            )}
            
            {/* Status Badge */}
            {data?.status && (
              <div className="mt-2 flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  data.status === 'active' ? 'bg-green-500' : 
                  data.status === 'inactive' ? 'bg-gray-400' : 
                  'bg-yellow-500'
                }`} />
                <span className="text-xs text-gray-500 capitalize">{data.status}</span>
              </div>
            )}
          </div>
        </div>
      )
    },
  })
)
```

**Usage:**
```tsx
const apiCallNode = {
  id: 'api1',
  type: 'apiCall',
  position: { x: 300, y: 100 },
  data: {
    label: 'Fetch Users',
    method: 'GET',
    endpoint: '/api/v1/users',
    description: 'Retrieves paginated user list',
    status: 'active',
  },
}
```

## Example 3: Conditional Node

A decision node with multiple branches and condition labels.

```tsx
export const ConditionalNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'amber-50',
    borderColor: 'border-amber-500',
    borderWidth: 3,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      { type: 'source', position: Position.Right, id: 'true' },
      { type: 'source', position: Position.Bottom, id: 'false' },
      { type: 'source', position: Position.Top, id: 'error' },
    ],
    customRender: ({ data, selected, renderHandles }) => {
      const selectedClass = selected 
        ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' 
        : 'shadow-md'
      const conditions = data?.conditions || []
      
      return (
        <div className={`relative min-w-[160px] bg-amber-50 border-3 border-amber-500 rounded-xl transition-all duration-200 ${selectedClass}`}>
          {renderHandles()}
          
          <div className="px-4 py-3">
            {/* Icon */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-amber-700">?</span>
              </div>
            </div>
            
            {/* Label */}
            <div className="text-sm font-semibold text-gray-900 text-center mb-2">
              {data?.label || 'Condition'}
            </div>
            
            {/* Expression */}
            {data?.expression && (
              <div className="text-xs font-mono text-amber-800 bg-amber-100 px-2 py-1 rounded text-center border border-amber-300">
                {data.expression}
              </div>
            )}
            
            {/* Multiple Conditions List */}
            {conditions.length > 0 && (
              <div className="mt-2 space-y-1">
                {conditions.slice(0, 3).map((condition: any, idx: number) => (
                  <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    <span className="truncate">{condition.name || condition}</span>
                  </div>
                ))}
                {conditions.length > 3 && (
                  <div className="text-xs text-gray-400 text-center">
                    +{conditions.length - 3} more
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Branch Labels (Positioned outside node) */}
          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
            True →
          </div>
          <div className="absolute left-1/2 -bottom-6 transform -translate-x-1/2 text-xs text-gray-500">
            False ↓
          </div>
          <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 text-xs text-rose-500">
            Error ↑
          </div>
        </div>
      )
    },
  })
)
```

**Usage:**
```tsx
const conditionalNode = {
  id: 'cond1',
  type: 'conditional',
  position: { x: 500, y: 100 },
  data: {
    label: 'Check User Role',
    expression: 'user.role === "admin"',
    conditions: [
      { name: 'Is Admin' },
      { name: 'Has Permission' },
      { name: 'Account Active' },
      { name: 'Email Verified' },
    ],
  },
}
```

## Example 4: Animated Progress Node

A node with animated progress indicator (demonstrates dynamic rendering).

```tsx
import { Loader } from 'lucide-react'

export const ProgressNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    handles: [HANDLE_CONFIGS.targetLeft, HANDLE_CONFIGS.sourceRight],
    customRender: ({ data, selected, renderHandles, renderIcon }) => {
      const progress = data?.progress || 0
      const status = data?.status || 'pending'
      
      return (
        <div className={`relative min-w-[160px] bg-white border-2 rounded-lg shadow ${selected ? 'ring-4 ring-orange-400' : ''}`}>
          {renderHandles()}
          
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              {status === 'processing' && (
                <Loader className="w-4 h-4 text-blue-600 animate-spin" />
              )}
              {renderIcon()}
              <span className="text-sm font-semibold">{data?.label}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="text-xs text-gray-500 text-right">
              {progress}% complete
            </div>
          </div>
        </div>
      )
    },
  })
)
```

## Example 5: Data-Driven Dynamic Node

A node that changes appearance based on data state.

```tsx
export const DataDrivenNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    handles: [HANDLE_CONFIGS.targetTop, HANDLE_CONFIGS.sourceBottom],
    customRender: ({ data, selected, renderHandles, config }) => {
      const severity = data?.severity || 'info'
      
      const severityConfig = {
        info: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
        warning: { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
        error: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700' },
        success: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700' },
      }[severity]
      
      return (
        <div className={`relative min-w-[140px] border-2 rounded-lg ${severityConfig.border} ${severityConfig.bg} ${selected ? 'shadow-lg' : 'shadow'}`}>
          {renderHandles()}
          
          <div className="px-3 py-2">
            <div className={`text-sm font-semibold ${severityConfig.text} mb-1`}>
              {data?.label}
            </div>
            
            {data?.items?.map((item: any, idx: number) => (
              <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                <span className={`w-1 h-1 rounded-full ${severityConfig.text}`} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
  })
)
```

## Best Practices

### 1. Always Use Render Helpers
```tsx
// ✅ Good: Use renderHandles() helper
customRender: ({ renderHandles, data }) => (
  <div>
    {renderHandles()}
    {/* Your content */}
  </div>
)

// ❌ Bad: Manually create handles
customRender: ({ data }) => (
  <div>
    <Handle type="source" position="right" />
    {/* Your content */}
  </div>
)
```

### 2. Respect Selected State
```tsx
// ✅ Good: Show visual feedback for selection
customRender: ({ selected, data }) => {
  const selectedClass = selected 
    ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' 
    : 'shadow'
  
  return <div className={selectedClass}>{/* content */}</div>
}
```

### 3. Handle Missing Data Gracefully
```tsx
// ✅ Good: Provide defaults
customRender: ({ data }) => (
  <div>
    <h3>{data?.label || 'Untitled'}</h3>
    {data?.description && <p>{data.description}</p>}
  </div>
)
```

### 4. Use Tailwind for Consistency
```tsx
// ✅ Good: Use project's design system
customRender: () => (
  <div className="bg-white border-2 border-gray-200 rounded-lg shadow">
    {/* Use consistent spacing, colors, typography */}
  </div>
)
```

### 5. Keep Custom Nodes Memoized
```tsx
// ✅ Good: BaseNode automatically memoizes
export const MyNode = createNode(defineNodeConfig({
  customRender: ({ data }) => <div>{data.label}</div>,
}))

MyNode.displayName = 'MyNode' // Add for debugging
```

## When to Use Custom Render

**Use `customRender` when:**
- Node has complex multi-section layout (header, body, footer)
- Need dynamic styling based on data state
- Require custom animations or interactions
- Node displays structured data (tables, lists, badges)
- Need positioned elements outside node bounds (labels, arrows)

**Use default rendering when:**
- Simple icon + label + description layout
- Standard BPMN/flowchart shapes
- Consistent styling across node types
- Following established patterns

## Performance Tips

1. **Memoize expensive calculations:**
```tsx
customRender: ({ data }) => {
  const computedValue = useMemo(() => heavyComputation(data), [data])
  return <div>{computedValue}</div>
}
```

2. **Avoid inline function definitions:**
```tsx
// ✅ Good
const handleClick = useCallback(() => {}, [])
customRender: () => <button onClick={handleClick}>Click</button>

// ❌ Bad
customRender: () => <button onClick={() => {}}>Click</button>
```

3. **Limit DOM complexity:**
Keep custom nodes under 50 DOM elements for optimal ReactFlow performance.

## Debugging

To debug custom render issues:

```tsx
customRender: (props) => {
  console.log('CustomRender props:', props)
  return <div>{/* your content */}</div>
}
```

Check that:
- `renderHandles()` is called inside the root element
- Node has proper `position: relative` for handles
- Data shape matches your expectations
- Selected state changes trigger re-render

## Advanced Patterns

### Reusable Custom Sections

```tsx
const NodeHeader = ({ icon, label }: any) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b">
    {icon}
    <span className="font-semibold">{label}</span>
  </div>
)

export const CustomNode = createNode(
  defineNodeConfig({
    customRender: ({ data, renderHandles }) => (
      <div className="bg-white border-2 rounded-lg">
        {renderHandles()}
        <NodeHeader icon={data.icon} label={data.label} />
        {/* body content */}
      </div>
    ),
  })
)
```

### Conditional Layouts

```tsx
customRender: ({ data, renderHandles }) => {
  if (data?.layout === 'compact') {
    return <CompactLayout data={data} renderHandles={renderHandles} />
  }
  return <ExpandedLayout data={data} renderHandles={renderHandles} />
}
```

## Summary

The `customRender` feature provides complete flexibility for creating advanced nodes while maintaining:
- **Type safety** through TypeScript
- **Performance** through React.memo
- **Consistency** by reusing render helpers
- **Maintainability** through configuration-driven approach

Use it to build data-rich, interactive, or domain-specific nodes that go beyond standard flowchart shapes.
