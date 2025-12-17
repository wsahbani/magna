/**
 * Swimlane Nodes (Pool and Lane)
 * BPMN-compliant swimlanes with vertical orientation by default
 * Support for orientation toggle (vertical/horizontal)
 * Modern styling with editable labels and resize handles
 */

import { memo, useState } from 'react'
import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react'
import { Plus, Trash2, GripVertical, GripHorizontal, RotateCw, Minimize2 } from 'lucide-react'
import type { SwimlaneOrientation } from '../../../features/procedures/types/flow-diagram.types'

interface PoolNodeProps extends NodeProps {
  data: {
    label?: string
    orientation?: SwimlaneOrientation
    width?: number
    height?: number
    color?: string
    onLabelChange?: (label: string) => void
    toggleOrientation?: () => void
    onAddLane?: () => void
    [key: string]: any
  }
}

interface LaneNodeProps extends NodeProps {
  data: {
    label: string
    orientation?: SwimlaneOrientation
    width?: number
    height?: number
    color?: string
    order?: number
    collapsed?: boolean
    poolId?: string
    onLabelChange?: (label: string) => void
    toggleCollapsed?: () => void
    onResize?: (size: number) => void
    onDelete?: () => void
    [key: string]: any
  }
}

/**
 * Pool Node - Container for multiple lanes (BPMN Pool)
 * Vertical orientation: lanes are side by side (columns)
 * Horizontal orientation: lanes are stacked (rows)
 */
export const PoolNode = memo(({ data, selected, width, height }: PoolNodeProps) => {
  const [isEditingPool, setIsEditingPool] = useState(false)
  const [poolLabel, setPoolLabel] = useState(data.label || 'Pool')
  
  const orientation = data.orientation || 'vertical'
  const isVertical = orientation === 'vertical'
  const poolColor = data.color || '#f3f4f6'

  // For vertical orientation: pool extends horizontally
  // For horizontal orientation: pool extends vertically
  const poolWidth = width || (isVertical ? 1200 : 400)
  const poolHeight = height || (isVertical ? 600 : 200)

  const handleLabelChange = (newLabel: string) => {
    setPoolLabel(newLabel)
    data.onLabelChange?.(newLabel)
  }

  // Horizontal layout (lanes stacked vertically)
  if (!isVertical) {
    return (
      <div className="relative">
        <NodeResizer
          color="#ff6900"
          isVisible={selected}
          minWidth={600}
          minHeight={150}
          lineClassName="!border-orange-500"
          handleClassName="!w-5 !h-5 !bg-orange-500 !border-2 !border-white"
        />
        
        <div 
          className={`bg-white border-2 rounded-lg overflow-hidden shadow-xl transition-shadow ${
            selected ? 'border-orange-500 shadow-lg ring-4 ring-orange-400 ring-opacity-50' : 'border-gray-300'
          }`}
          style={{ 
            width: '100%', 
            height: '100%',
            minWidth: 600,
            backgroundColor: poolColor,
          }}
        >
          {/* Pool header (left side) */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-700 border-r border-gray-500 flex items-center justify-center">
            <div 
              className="transform -rotate-90 whitespace-nowrap cursor-pointer"
              onDoubleClick={() => setIsEditingPool(true)}
            >
              {isEditingPool ? (
                <input
                  type="text"
                  value={poolLabel}
                  onChange={(e) => setPoolLabel(e.target.value)}
                  onBlur={() => {
                    setIsEditingPool(false)
                    handleLabelChange(poolLabel)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingPool(false)
                      handleLabelChange(poolLabel)
                    }
                  }}
                  className="text-sm font-semibold bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-900"
                  autoFocus
                />
              ) : (
                <span className="text-sm font-semibold text-white">{poolLabel}</span>
              )}
            </div>
          </div>
          
          {/* Lanes container (stacked vertically) - children will be rendered here by ReactFlow */}
          <div className="ml-10 h-full flex flex-col">
            {/* Children nodes (lanes) will be rendered here by ReactFlow */}
          </div>
          
          {/* Actions */}
          <div className="absolute bottom-2 right-2 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation()
                data.toggleOrientation?.()
              }}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-lg transition-all hover:scale-105"
              title="Changer l'orientation"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                data.onAddLane?.()
              }}
              className="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all hover:scale-105"
              title="Ajouter une Lane"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Vertical layout (lanes stacked horizontally)
  return (
    <div className="relative">
      <NodeResizer
        color="#ff6900"
        isVisible={selected}
        minWidth={150}
        minHeight={400}
        lineClassName="!border-orange-500"
        handleClassName="!w-3 !h-3 !bg-orange-500 !border-2 !border-white"
      />
      
      <div 
        className={`bg-white border-2 rounded-lg overflow-hidden shadow-xl transition-shadow ${
          selected ? 'border-orange-500 shadow-lg ring-4 ring-orange-400 ring-opacity-50' : 'border-gray-300'
        }`}
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: 400,
          backgroundColor: poolColor,
        }}
      >
        {/* Pool header (top) */}
        <div className="absolute left-0 top-0 right-0 h-10 bg-gray-700 border-b border-gray-500 flex items-center justify-center">
          <div 
            className="whitespace-nowrap cursor-pointer"
            onDoubleClick={() => setIsEditingPool(true)}
          >
            {isEditingPool ? (
              <input
                type="text"
                value={poolLabel}
                onChange={(e) => setPoolLabel(e.target.value)}
                onBlur={() => {
                  setIsEditingPool(false)
                  handleLabelChange(poolLabel)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingPool(false)
                    handleLabelChange(poolLabel)
                  }
                }}
                className="text-sm font-semibold bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-900"
                autoFocus
              />
            ) : (
              <span className="text-sm font-semibold text-white">{poolLabel}</span>
            )}
          </div>
        </div>
        
        {/* Lanes container (stacked horizontally) - children will be rendered here by ReactFlow */}
        <div className="mt-10 h-[calc(100%-40px)] flex flex-row">
          {/* Children nodes (lanes) will be rendered here by ReactFlow */}
        </div>
        
        {/* Actions */}
        <div className="absolute bottom-2 right-2 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              data.toggleOrientation?.()
            }}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-lg transition-all hover:scale-105"
            title="Changer l'orientation"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              data.onAddLane?.()
            }}
            className="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all hover:scale-105"
            title="Ajouter une Lane"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
})

PoolNode.displayName = 'PoolNode'

/**
 * Lane Node - Individual swimlane within a pool
 * Vertical orientation: lane is a column (width resizable)
 * Horizontal orientation: lane is a row (height resizable)
 */
export const LaneNode = memo(({ data, selected, width, height }: LaneNodeProps) => {
  const [isEditingLane, setIsEditingLane] = useState(false)
  const [laneLabel, setLaneLabel] = useState(data.label || 'Lane')
  
  const orientation = data.orientation || 'vertical'
  const isVertical = orientation === 'vertical'
  const collapsed = data.collapsed || false

  // Lane colors for visual distinction
  const laneColors = [
    'bg-blue-50',
    'bg-green-50', 
    'bg-purple-50',
    'bg-yellow-50',
    'bg-pink-50',
  ]
  const laneColorIndex = (data.order || 0) % laneColors.length
  const laneColorClass = laneColors[laneColorIndex]
  const laneColor = data.color || undefined

  // For vertical orientation: lane extends vertically (width resizable)
  // For horizontal orientation: lane extends horizontally (height resizable)
  const laneWidth = width || (isVertical ? 300 : 1200)
  const laneHeight = height || (isVertical ? 600 : 150)

  const handleLabelChange = (newLabel: string) => {
    setLaneLabel(newLabel)
    data.onLabelChange?.(newLabel)
  }

  if (collapsed) {
    // Collapsed lane - show only header
    return (
      <div
        className={`bg-white border-2 border-gray-400 rounded shadow ${
          selected ? 'ring-4 ring-orange-400 ring-opacity-50' : ''
        }`}
        style={{
          width: isVertical ? laneWidth : '100%',
          height: isVertical ? '40px' : laneHeight,
          backgroundColor: laneColor,
        }}
      >
        <div
          className={`bg-gray-600 text-white font-medium px-3 py-2 flex items-center justify-between ${
            isVertical ? 'border-b border-gray-500' : 'border-r border-gray-500'
          }`}
          style={{
            width: isVertical ? '100%' : '120px',
            height: isVertical ? '100%' : '100%',
            writingMode: isVertical ? 'horizontal-tb' : 'vertical-rl',
            textOrientation: isVertical ? 'mixed' : 'mixed',
          }}
        >
          <span className="truncate text-sm">{laneLabel}</span>
          <span className="text-xs opacity-75">(Réduite)</span>
        </div>
      </div>
    )
  }

  // Horizontal layout (lane is a row)
  if (!isVertical) {
    return (
      <div
        className={`relative ${laneColorClass} border-b border-gray-300 last:border-b-0 group`}
        style={{
          height: laneHeight,
          backgroundColor: laneColor,
        }}
      >
        {/* Lane label (left side) */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-200/50 border-r border-gray-300/50 flex items-center justify-center">
          <div 
            className="transform -rotate-90 whitespace-nowrap cursor-pointer"
            onDoubleClick={() => setIsEditingLane(true)}
          >
            {isEditingLane ? (
              <input
                type="text"
                value={laneLabel}
                onChange={(e) => setLaneLabel(e.target.value)}
                onBlur={() => {
                  setIsEditingLane(false)
                  handleLabelChange(laneLabel)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingLane(false)
                    handleLabelChange(laneLabel)
                  }
                }}
                className="text-xs bg-white border border-gray-300 rounded px-1 text-gray-900"
                autoFocus
              />
            ) : (
              <span className="text-xs text-gray-600">{laneLabel}</span>
            )}
          </div>
        </div>
        
        {/* Lane content area */}
        <div className="ml-8 h-full relative">
          {/* Lane actions (visible on hover) */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation()
                data.toggleCollapsed?.()
              }}
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
              title="Réduire/Agrandir"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                data.onDelete?.()
              }}
              className="p-1 rounded bg-red-500/80 hover:bg-red-600 text-white"
              title="Supprimer Lane"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          
          {/* Resize handle at bottom of each lane */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize bg-transparent hover:bg-orange-500/20 group/resize flex items-center justify-center"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const startY = e.clientY
              const startHeight = laneHeight
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaY = moveEvent.clientY - startY
                const newHeight = Math.max(100, startHeight + deltaY)
                data.onResize?.(newHeight)
              }
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }
              
              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
          >
            <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover/resize:opacity-100" />
          </div>
          
          {/* Children nodes will be rendered here by ReactFlow */}
        </div>
      </div>
    )
  }

  // Vertical layout (lane is a column)
  return (
    <div
      className={`relative ${laneColorClass} border-r border-gray-300 last:border-r-0 group`}
      style={{
        width: laneWidth,
        backgroundColor: laneColor,
      }}
    >
      {/* Lane label (top) */}
      <div className="absolute left-0 top-0 right-0 h-8 bg-gray-200/50 border-b border-gray-300/50 flex items-center justify-center">
        <div 
          className="whitespace-nowrap cursor-pointer"
          onDoubleClick={() => setIsEditingLane(true)}
        >
          {isEditingLane ? (
            <input
              type="text"
              value={laneLabel}
              onChange={(e) => setLaneLabel(e.target.value)}
              onBlur={() => {
                setIsEditingLane(false)
                handleLabelChange(laneLabel)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingLane(false)
                  handleLabelChange(laneLabel)
                }
              }}
              className="text-xs bg-white border border-gray-300 rounded px-1 text-gray-900"
              autoFocus
            />
          ) : (
            <span className="text-xs text-gray-600">{laneLabel}</span>
          )}
        </div>
      </div>
      
      {/* Lane content area */}
      <div className="mt-8 h-[calc(100%-32px)] relative">
        {/* Lane actions (visible on hover) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              data.toggleCollapsed?.()
            }}
            className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            title="Réduire/Agrandir"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              data.onDelete?.()
            }}
            className="p-1 rounded bg-red-500/80 hover:bg-red-600 text-white"
            title="Supprimer Lane"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        
        {/* Resize handle at right of each lane */}
        <div
          className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize bg-transparent hover:bg-orange-500/20 group/resize flex items-center justify-center"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            const startX = e.clientX
            const startWidth = laneWidth
            
            const handleMouseMove = (moveEvent: MouseEvent) => {
              const deltaX = moveEvent.clientX - startX
              const newWidth = Math.max(150, startWidth + deltaX)
              data.onResize?.(newWidth)
            }
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
            }
            
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
          }}
        >
          <GripHorizontal className="w-4 h-4 text-gray-400 opacity-0 group-hover/resize:opacity-100 rotate-90" />
        </div>
        
        {/* Children nodes will be rendered here by ReactFlow */}
      </div>
    </div>
  )
})

LaneNode.displayName = 'LaneNode'
