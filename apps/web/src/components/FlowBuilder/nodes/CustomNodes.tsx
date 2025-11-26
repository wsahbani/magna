import { Database, Settings } from 'lucide-react'
import { Position } from '@xyflow/react'
import { createNode, defineNodeConfig, HANDLE_CONFIGS } from './BaseNode'

/**
 * Database Node - Custom rendered node with multiple sections
 * Demonstrates the customRender capability
 */
export const DatabaseNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-teal-500',
    iconColor: 'text-teal-600',
    borderWidth: 2,
    resizable: true,
    minWidth: 180,
    minHeight: 120,
    maxWidth: 400,
    maxHeight: 600,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
      { type: 'source', position: Position.Bottom, id: 'data-out' },
    ],
    customRender: ({ data, selected, renderHandles }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      
      // Build inline styles from data.style
      const inlineStyle: any = {}
      if (data?.style?.backgroundColor) inlineStyle.backgroundColor = data.style.backgroundColor
      if (data?.style?.borderColor) {
        inlineStyle.borderColor = data.style.borderColor
        inlineStyle.borderStyle = 'solid'
      }
      if (data?.style?.borderWidth !== undefined) {
        inlineStyle.borderWidth = `${data.style.borderWidth}px`
        inlineStyle.borderStyle = 'solid'
      }
      if (data?.style?.borderRadius !== undefined) inlineStyle.borderRadius = `${data.style.borderRadius}px`
      if (data?.style?.color) inlineStyle.color = data.style.color
      if (data?.style?.fontSize) inlineStyle.fontSize = `${data.style.fontSize}px`
      if (data?.style?.fontWeight) inlineStyle.fontWeight = data.style.fontWeight
      if (data?.style?.textAlign) inlineStyle.textAlign = data.style.textAlign
      
      return (
        <div 
          className={`relative w-full h-full bg-white border-2 border-teal-500 rounded-lg overflow-hidden transition-all duration-200 flex flex-col ${selectedClass}`}
          style={inlineStyle}
        >
          {renderHandles()}
          
          {/* Header */}
          <div className="bg-teal-50 px-4 py-2 border-b border-teal-200 flex items-center gap-2 flex-shrink-0">
            <Database className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <div className="text-sm font-semibold text-gray-900 truncate flex-1 min-w-0">
              {data?.label || 'Database'}
            </div>
          </div>
          
          {/* Content */}
          <div className="px-4 py-3 flex-1 overflow-auto min-h-0">
            {data?.description && (
              <div className="text-xs text-gray-600 mb-2 break-words">
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
          
          {/* Footer Actions */}
          {data?.showActions && (
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex items-center justify-end gap-2 flex-shrink-0">
              <Settings className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          )}
        </div>
      )
    },
  })
)

DatabaseNode.displayName = 'DatabaseNode'

/**
 * API Call Node - Custom node with HTTP method badge
 */
export const ApiCallNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-indigo-500',
    borderWidth: 2,
    resizable: true,
    minWidth: 200,
    minHeight: 100,
    maxWidth: 400,
    maxHeight: 500,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
      { type: 'source', position: Position.Bottom, id: 'error' },
    ],
    customRender: ({ data, selected, renderHandles }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      
      // Build inline styles
      const style = data?.style || {}
      const inlineStyle: any = {}
      
      if (style.backgroundColor) {
        inlineStyle.backgroundColor = style.backgroundColor
      }
      if (style.borderColor) {
        inlineStyle.borderColor = style.borderColor
        inlineStyle.borderStyle = 'solid'
      }
      if (style.borderWidth !== undefined) {
        inlineStyle.borderWidth = `${style.borderWidth}px`
        inlineStyle.borderStyle = 'solid'
      }
      if (style.borderRadius !== undefined) {
        inlineStyle.borderRadius = `${style.borderRadius}px`
      }
      if (style.color) {
        inlineStyle.color = style.color
      }
      if (style.fontSize) {
        inlineStyle.fontSize = `${style.fontSize}px`
      }
      if (style.fontWeight) {
        inlineStyle.fontWeight = style.fontWeight
      }
      if (style.textAlign) {
        inlineStyle.textAlign = style.textAlign
      }
      
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
        <div 
          className={`relative w-full h-full bg-white border-2 border-indigo-500 rounded-lg transition-all duration-200 ${selectedClass}`}
          style={inlineStyle}
        >
          {renderHandles()}
          
          <div className="px-4 py-3 h-full overflow-auto">
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

/**
 * Conditional Node - Custom node with multiple condition branches
 */
export const ConditionalNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'amber-50',
    borderColor: 'border-amber-500',
    borderWidth: 3,
    resizable: true,
    minWidth: 160,
    minHeight: 140,
    maxWidth: 350,
    maxHeight: 500,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      { type: 'source', position: Position.Right, id: 'true' },
      { type: 'source', position: Position.Bottom, id: 'false' },
      { type: 'source', position: Position.Top, id: 'error' },
    ],
    customRender: ({ data, selected, renderHandles }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow-md'
      const conditions = data?.conditions || []
      
      // Build inline styles
      const style = data?.style || {}
      const inlineStyle: any = {}
      
      if (style.backgroundColor) {
        inlineStyle.backgroundColor = style.backgroundColor
      }
      if (style.borderColor) {
        inlineStyle.borderColor = style.borderColor
        inlineStyle.borderStyle = 'solid'
      }
      if (style.borderWidth !== undefined) {
        inlineStyle.borderWidth = `${style.borderWidth}px`
        inlineStyle.borderStyle = 'solid'
      }
      if (style.borderRadius !== undefined) {
        inlineStyle.borderRadius = `${style.borderRadius}px`
      }
      if (style.color) {
        inlineStyle.color = style.color
      }
      if (style.fontSize) {
        inlineStyle.fontSize = `${style.fontSize}px`
      }
      if (style.fontWeight) {
        inlineStyle.fontWeight = style.fontWeight
      }
      if (style.textAlign) {
        inlineStyle.textAlign = style.textAlign
      }
      
      return (
        <div 
          className={`relative w-full h-full bg-amber-50 border-3 border-amber-500 rounded-xl transition-all duration-200 ${selectedClass}`}
          style={inlineStyle}
        >
          {renderHandles()}
          
          <div className="px-4 py-3 h-full overflow-auto">
            {/* Icon + Label */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-amber-700">?</span>
              </div>
            </div>
            
            <div className="text-sm font-semibold text-gray-900 text-center mb-2">
              {data?.label || 'Condition'}
            </div>
            
            {/* Condition Expression */}
            {data?.expression && (
              <div className="text-xs font-mono text-amber-800 bg-amber-100 px-2 py-1 rounded text-center border border-amber-300">
                {data.expression}
              </div>
            )}
            
            {/* Multiple Conditions */}
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
          
          {/* Output Labels */}
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

ConditionalNode.displayName = 'ConditionalNode'
