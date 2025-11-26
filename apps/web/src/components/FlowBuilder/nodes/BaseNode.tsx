import { memo, ReactNode } from 'react'
import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react'

/**
 * Base configuration for all node types
 */
export interface BaseNodeConfig {
  // Visual appearance
  shape: 'circle' | 'rectangle' | 'diamond' | 'rounded-rectangle' | 'custom'
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
  iconRotation?: number
  
  // Handles configuration
  handles: {
    type: 'source' | 'target'
    position: Position
    id?: string
  }[]
  
  // Label configuration
  showLabel?: boolean
  labelPosition?: 'inside' | 'below' | 'above'
  
  // Additional styles
  className?: string
  selectedRingColor?: string
  
  // Resizable configuration
  resizable?: boolean
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  
  // Custom render function (overrides default rendering)
  customRender?: (props: CustomRenderProps) => ReactNode
}

/**
 * Props provided to custom render function
 */
export interface CustomRenderProps {
  data: {
    label?: string
    description?: string
    [key: string]: any
  }
  selected: boolean
  config: BaseNodeConfig
  renderHandles: () => ReactNode
  renderIcon: () => ReactNode
  renderLabel: () => ReactNode
  renderDescription: () => ReactNode
  getShapeStyles: () => string
}

/**
 * Base Node Props extending ReactFlow NodeProps
 */
export interface BaseNodeProps extends NodeProps {
  data: {
    label?: string
    description?: string
    [key: string]: any
  }
}

/**
 * Base Node Component
 * Provides common functionality for all node types
 */
export const createNode = (config: BaseNodeConfig) => {
  return memo(({ data, selected }: BaseNodeProps) => {
    const {
      shape,
      backgroundColor,
      borderColor,
      borderWidth,
      size,
      icon,
      iconColor,
      iconRotation = 0,
      handles,
      showLabel = true,
      labelPosition = 'below',
      className = '',
      selectedRingColor = 'none',
      customRender,
      resizable = false,
      minWidth = 50,
      minHeight = 50,
      maxWidth = 500,
      maxHeight = 500,
    } = config

    // Build inline styles from data.style
    const getInlineStyles = () => {
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
      
      return inlineStyle
    }

    // Shape-specific styles
    const getShapeStyles = () => {
      const baseStyles = `
        bg-${backgroundColor} 
        border-${borderWidth} 
        border-${borderColor}
        transition-all duration-200
        ${selected ? `outline-1 outline outline-blue-400 ${selectedRingColor}` : ''}
      `

      switch (shape) {
        case 'circle':
          return `${baseStyles} rounded-full ${size?.width || 'w-12'} ${size?.height || 'h-12'} flex items-center justify-center`
        
        case 'rectangle':
          return `${baseStyles}  ${resizable ? 'w-full h-full' : size?.width || 'min-w-[120px]'} px-4 py-3`
        
        case 'rounded-rectangle':
          return `${baseStyles} rounded-xl ${resizable ? 'w-full h-full' : size?.width || 'min-w-[140px]'} px-5 py-4`
        
        case 'diamond':
          return `${baseStyles} ${size?.width || 'w-16'} ${size?.height || 'h-16'} flex items-center justify-center transform rotate-45`
        
        case 'custom':
          return baseStyles
        
        default:
          return baseStyles
      }
    }

    // Render handles - supports dynamic positioning from node data
    const renderHandles = () => {
      // Get custom handle positions from node data (if set by user)
      const customPositions = data?.handlePositions as { source?: string; target?: string } | undefined
      
      // Create a map to override default positions
      const positionMap: Record<string, Position> = {
        top: Position.Top,
        right: Position.Right,
        bottom: Position.Bottom,
        left: Position.Left,
      }
      
      return handles.map((handle, index) => {
        // Determine actual position to use
        let actualPosition = handle.position
        
        // Override with custom position if available
        if (customPositions) {
          if (handle.type === 'source' && customPositions.source) {
            actualPosition = positionMap[customPositions.source] || handle.position
          } else if (handle.type === 'target' && customPositions.target) {
            actualPosition = positionMap[customPositions.target] || handle.position
          }
        }
        
        return (
          <Handle
            key={handle.id || `${handle.type}-${actualPosition}-${index}`}
            type={handle.type}
            position={actualPosition}
            id={handle.id}
            className={`w-2 h-2 !bg-${borderColor.replace('border-', '')}`}
            style={
              shape === 'diamond' && (actualPosition === Position.Left || actualPosition === Position.Right)
                ? { [actualPosition === Position.Left ? 'left' : 'right']: '-4px' }
                : shape === 'diamond' && (actualPosition === Position.Top || actualPosition === Position.Bottom)
                ? { [actualPosition === Position.Top ? 'top' : 'bottom']: '-4px' }
                : undefined
            }
          />
        )
      })
    }

    // Render icon with rotation
    const renderIcon = () => {
      if (!icon) return null
      
      const iconStyle = iconRotation !== 0 ? { transform: `rotate(${iconRotation}deg)` } : undefined
      
      return (
        <div 
          className={`${iconColor || 'text-current'} ${shape === 'circle' || shape === 'diamond' ? '' : 'flex-shrink-0'}`}
          style={iconStyle}
        >
          {icon}
        </div>
      )
    }

    // Render label based on position
    const renderLabel = () => {
      if (!showLabel || !data?.label) return null

      // Get text styling from data.style (merged with defaults)
      const nodeStyle = (data?.style as Record<string, any>) || {}
      const labelStyle: React.CSSProperties = {
        color: nodeStyle.color || '#374151', // gray-700
        fontSize: nodeStyle.fontSize ? `${nodeStyle.fontSize}px` : '12px', // text-xs
        fontWeight: nodeStyle.fontWeight || '400',
        textAlign: (nodeStyle.textAlign || 'left') as any,
      }

      if (labelPosition === 'below') {
        return (
          <div 
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            style={labelStyle}
          >
            {data.label}
          </div>
        )
      }

      if (labelPosition === 'above') {
        return (
          <div 
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            style={labelStyle}
          >
            {data.label}
          </div>
        )
      }

      // Inside label (for rectangle shapes) - allow wrapping when resizable
      return (
        <div 
          className={resizable ? 'break-words' : ''}
          style={{
            ...labelStyle,
            fontSize: nodeStyle.fontSize ? `${nodeStyle.fontSize}px` : '14px', // text-sm
            fontWeight: nodeStyle.fontWeight || '500', // font-medium
          }}
        >
          {data.label}
        </div>
      )
    }

    // Render description (only for rectangle shapes)
    const renderDescription = () => {
      if (shape === 'circle' || shape === 'diamond' || !data?.description) return null

      // Get text styling from data.style
      const nodeStyle = (data?.style as Record<string, any>) || {}
      const descriptionStyle: React.CSSProperties = {
        marginTop: '4px',
        fontSize: nodeStyle.fontSize ? `${parseInt(nodeStyle.fontSize) - 2}px` : '12px', // text-xs
        color: nodeStyle.color || '#6B7280', // gray-500
        fontWeight: nodeStyle.fontWeight || '400',
        textAlign: (nodeStyle.textAlign || 'left') as any,
      }

      return (
        <div 
          className={resizable ? 'break-words overflow-auto' : ''}
          style={descriptionStyle}
        >
          {data.description}
        </div>
      )
    }

    // Use custom render function if provided
    if (customRender) {
      return (
        <>
          {resizable && selected && (
            <NodeResizer
              minWidth={minWidth}
              minHeight={minHeight}
              maxWidth={maxWidth}
              maxHeight={maxHeight}
              color="#ff6600"
              handleClassName="!bg-orange-500 !border-2 !border-white"
            />
          )}
          {customRender({
            data,
            selected,
            config,
            renderHandles,
            renderIcon,
            renderLabel,
            renderDescription,
            getShapeStyles,
          })}
        </>
      )
    }

    // Main render (default behavior)
    if (shape === 'circle' || shape === 'diamond') {
      return (
        <div className="relative">
          {resizable && selected && (
            <NodeResizer
              minWidth={minWidth}
              minHeight={minHeight}
              maxWidth={maxWidth}
              maxHeight={maxHeight}
              color="#ff6600"
              handleClassName="!bg-orange-500 !border-2 !border-white"
            />
          )}
          {renderHandles()}
          <div 
            className={`${getShapeStyles()} ${className}`}
            style={getInlineStyles()}
          >
            {renderIcon()}
          </div>
          {renderLabel()}
        </div>
      )
    }

    // Rectangle shapes with content inside
    return (
      <div 
        className={`relative ${getShapeStyles()} ${className} ${resizable ? 'flex flex-col' : ''}`}
        style={getInlineStyles()}
      >
        {resizable && selected && (
          <NodeResizer
            minWidth={minWidth}
            minHeight={minHeight}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            color="#000"
            handleClassName="!bg-blue-500 !border-2 !border-blue-500 absolute"
          />
        )}
        {renderHandles()}
        
        {shape === 'rectangle' && (
          <div className={`flex items-center gap-2 ${resizable ? 'flex-1 min-h-0' : ''}`}>
            {renderIcon()}
            <div className="flex-1 min-w-0">
              {labelPosition === 'inside' && renderLabel()}
              {renderDescription()}
            </div>
          </div>
        )}
        
        {shape === 'rounded-rectangle' && (
          <div className={`flex flex-col gap-2 ${resizable ? 'flex-1 min-h-0' : ''}`}>
            <div className="flex items-center gap-2">
              {renderIcon()}
              {labelPosition === 'inside' && renderLabel()}
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              {renderDescription()}
            </div>
          </div>
        )}
      </div>
    )
  })
}

/**
 * Utility function to create a node configuration
 */
export const defineNodeConfig = (config: BaseNodeConfig): BaseNodeConfig => config

/**
 * Common handle configurations
 */
export const HANDLE_CONFIGS = {
  sourceRight: { type: 'source' as const, position: Position.Right },
  targetLeft: { type: 'target' as const, position: Position.Left },
  sourceBottom: { type: 'source' as const, position: Position.Bottom },
  targetTop: { type: 'target' as const, position: Position.Top },
  sourceTop: { type: 'source' as const, position: Position.Top },
  targetBottom: { type: 'target' as const, position: Position.Bottom },
}

/**
 * Common color schemes
 */
export const COLOR_SCHEMES = {
  simple:{
    backgroundColor:'white',
    borderColor:'border-black',
    iconColor:'text-black'
  },
  green: {
    backgroundColor: 'green-100',
    borderColor: 'border-green-600',
    iconColor: 'text-green-700',
  },
  red: {
    backgroundColor: 'red-100',
    borderColor: 'border-red-600',
    iconColor: 'text-red-700',
  },
  blue: {
    backgroundColor: 'white',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-600',
  },
  yellow: {
    backgroundColor: 'yellow-100',
    borderColor: 'border-yellow-500',
    iconColor: 'text-yellow-700',
  },
  purple: {
    backgroundColor: 'purple-50',
    borderColor: 'border-purple-500',
    iconColor: 'text-purple-600',
  },
  orange: {
    backgroundColor: 'orange-100',
    borderColor: 'border-orange-500',
    iconColor: 'text-orange-700',
  },
  gray: {
    backgroundColor: 'gray-100',
    borderColor: 'border-gray-500',
    iconColor: 'text-gray-700',
  },
}
