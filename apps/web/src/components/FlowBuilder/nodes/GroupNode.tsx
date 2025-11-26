/**
 * GroupNode Component
 * 
 * Special node type that acts as a container for other nodes
 * Supports parent-child relationships and hierarchical grouping
 */

import { memo, useState } from 'react'
import { NodeProps, NodeResizer } from '@xyflow/react'
import { 
  Folder, 
  FolderOpen, 
  ChevronDown, 
  ChevronRight,
  Users,
  Box,
  Layers,
} from 'lucide-react'

/**
 * GroupNode Component
 */
export const GroupNode = memo(({ data, selected }: NodeProps) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Type-safe data access
  const label = (data?.label as string) || 'Group'
  const groupType = (data?.groupType as 'category' | 'subprocess' | 'container' | 'custom') || 'category'
  const collapsed = (data?.collapsed as boolean) || false
  const childIds = (data?.childIds as string[]) || []
  
  // Get style from data
  const nodeStyle = (data?.style as Record<string, any>) || {}
  const backgroundColor = nodeStyle.backgroundColor
  const borderColor = nodeStyle.borderColor
  const textColor = nodeStyle.color
  const fontSize = parseInt(nodeStyle.fontSize || '14')
  const fontWeight = nodeStyle.fontWeight || 'semibold'
  const textAlign = nodeStyle.textAlign || 'left'
  const borderWidth = parseInt(nodeStyle.borderWidth?.toString() || '2')
  const borderRadius = parseInt(nodeStyle.borderRadius?.toString() || '12')

  // Get icon based on group type
  const getIcon = () => {
    switch (groupType) {
      case 'subprocess':
        return <Layers className="w-5 h-5" />
      case 'container':
        return <Box className="w-5 h-5" />
      case 'category':
        return collapsed ? <Folder className="w-5 h-5" /> : <FolderOpen className="w-5 h-5" />
      case 'custom':
        return <Users className="w-5 h-5" />
      default:
        return <Folder className="w-5 h-5" />
    }
  }

  // Get background color - use custom or default based on type
  const getBgColor = () => {
    if (backgroundColor) return '' // Will use inline style
    
    switch (groupType) {
      case 'subprocess':
        return 'bg-blue-50'
      case 'container':
        return 'bg-purple-50'
      case 'category':
        return 'bg-orange-50'
      default:
        return 'bg-gray-50'
    }
  }

  // Get border color - use custom or default based on type
  const getBorderColor = () => {
    if (borderColor) return '' // Will use inline style
    
    switch (groupType) {
      case 'subprocess':
        return 'border-blue-400'
      case 'container':
        return 'border-purple-400'
      case 'category':
        return 'border-orange-400'
      default:
        return 'border-gray-400'
    }
  }

  return (
    <div
      className={`
        relative
        ${getBgColor()}
        ${getBorderColor()}
        shadow-md
        transition-all duration-200
        ${selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-xl' : ''}
        ${isHovered ? 'shadow-lg scale-[1.01]' : ''}
        w-full h-full
        min-w-[200px] min-h-[150px]
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        zIndex: 0, 
        pointerEvents: 'none',
        backgroundColor: backgroundColor || undefined,
        borderColor: borderColor || undefined,
        borderWidth: `${borderWidth}px`,
        borderStyle: 'solid',
        borderRadius: `${borderRadius}px`,
      }}
    >
      {/* Resizer when selected - must have pointer-events-auto */}
      {selected && (
        <div style={{ pointerEvents: 'auto' }}>
          <NodeResizer
            minWidth={200}
            minHeight={150}
            maxWidth={1200}
            maxHeight={800}
            color="#ff6600"
            handleClassName="!bg-orange-500 !border-2 !border-white !pointer-events-auto"
            lineClassName="!border-orange-500 !pointer-events-auto"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white bg-opacity-50 rounded-t-lg pointer-events-auto">
        <div className="flex items-center gap-2 flex-1">
          {/* Collapse/Expand icon */}
          <div className="text-gray-600 cursor-pointer hover:text-orange-600">
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          
          {/* Group icon */}
          <div className={`text-orange-600`}>
            {getIcon()}
          </div>
          
          {/* Label */}
          <h3 
            className="flex-1 truncate"
            style={{
              color: textColor || '#111827',
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight as any,
              textAlign: textAlign as any,
            }}
          >
            {label}
          </h3>
        </div>
        
        {/* Child count badge */}
        {childIds.length > 0 && (
          <div className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">
            {childIds.length} {childIds.length === 1 ? 'item' : 'items'}
          </div>
        )}
      </div>

      {/* Content area - No background, children render here */}
      <div className="p-4 h-[calc(100%-60px)] overflow-visible pointer-events-none">
        {!collapsed && childIds.length === 0 && (
          <div className="text-center text-gray-400 text-xs mt-8 pointer-events-none">
            <div className="flex flex-col items-center gap-2">
              <Box className="w-8 h-8 opacity-30" />
              <span>Drag nodes here to group them</span>
            </div>
          </div>
        )}
        
        {collapsed && (
          <div className="flex items-center justify-center h-full pointer-events-auto">
            <p className="text-xs text-gray-500">
              {childIds.length} child {childIds.length === 1 ? 'node' : 'nodes'} (collapsed)
            </p>
          </div>
        )}
      </div>

      {/* Type indicator */}
      <div className="absolute bottom-2 right-2 pointer-events-none">
        <span className="text-[10px] text-gray-400 uppercase font-medium">
          {groupType}
        </span>
      </div>
    </div>
  )
})

GroupNode.displayName = 'GroupNode'

/**
 * Export node type for ReactFlow
 */
export default GroupNode
