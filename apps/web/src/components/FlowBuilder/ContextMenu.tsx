/**
 * Context Menu Component for ReactFlow
 * Provides right-click menu for canvas and nodes
 */

import { useCallback, useEffect, useState } from 'react'
import { useReactFlow, Node, Edge } from '@xyflow/react'
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Maximize2, 
  Minimize2,
  RotateCw
} from 'lucide-react'
import { Button } from '@repo/ui'

interface ContextMenuProps {
  onAddLaneAbove?: (laneId: string) => void
  onAddLaneBelow?: (laneId: string) => void
  onDeleteLane?: (laneId: string) => void
  onResizeLane?: (laneId: string) => void
  onToggleLaneCollapsed?: (laneId: string) => void
  onChangePoolOrientation?: (poolId: string) => void
}

interface ContextMenuState {
  id: string | null
  top: number
  left: number
  type: 'lane' | 'pool' | 'canvas' | null
}

export function ContextMenu({
  onAddLaneAbove,
  onAddLaneBelow,
  onDeleteLane,
  onResizeLane,
  onToggleLaneCollapsed,
  onChangePoolOrientation,
}: ContextMenuProps) {
  const { screenToFlowPosition, getNode } = useReactFlow()
  const [menu, setMenu] = useState<ContextMenuState>({
    id: null,
    top: 0,
    left: 0,
    type: null,
  })

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault()
      
      // Check if clicking on a node
      const target = event.target as HTMLElement
      const nodeElement = target.closest('.react-flow__node')
      
      if (nodeElement) {
        const nodeId = nodeElement.getAttribute('data-id')
        if (nodeId) {
          const node = getNode(nodeId)
          if (node) {
            if (node.type === 'lane') {
              setMenu({
                id: nodeId,
                top: event.clientY,
                left: event.clientX,
                type: 'lane',
              })
            } else if (node.type === 'pool') {
              setMenu({
                id: nodeId,
                top: event.clientY,
                left: event.clientX,
                type: 'pool',
              })
            }
            return
          }
        }
      }
      
      // Canvas context menu
      setMenu({
        id: null,
        top: event.clientY,
        left: event.clientX,
        type: 'canvas',
      })
    }

    const handleClick = () => {
      setMenu({ id: null, top: 0, left: 0, type: null })
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
    }
  }, [getNode])

  if (!menu.type) return null

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] py-1"
      style={{
        top: menu.top,
        left: menu.left,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {menu.type === 'lane' && menu.id && (
        <>
          <button
            onClick={() => {
              onAddLaneAbove?.(menu.id!)
              setMenu({ id: null, top: 0, left: 0, type: null })
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <ArrowUp className="w-4 h-4" />
            Ajouter Lane au-dessus
          </button>
          <button
            onClick={() => {
              onAddLaneBelow?.(menu.id!)
              setMenu({ id: null, top: 0, left: 0, type: null })
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <ArrowDown className="w-4 h-4" />
            Ajouter Lane en-dessous
          </button>
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={() => {
              onResizeLane?.(menu.id!)
              setMenu({ id: null, top: 0, left: 0, type: null })
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Redimensionner automatiquement
          </button>
          <button
            onClick={() => {
              onToggleLaneCollapsed?.(menu.id!)
              setMenu({ id: null, top: 0, left: 0, type: null })
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <Minimize2 className="w-4 h-4" />
            Réduire/Agrandir
          </button>
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={() => {
              onDeleteLane?.(menu.id!)
              setMenu({ id: null, top: 0, left: 0, type: null })
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer Lane
          </button>
        </>
      )}

      {menu.type === 'pool' && menu.id && (
        <>
          <button
            onClick={() => {
              onChangePoolOrientation?.(menu.id!)
              setMenu({ id: null, top: 0, left: 0, type: null })
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Changer l'orientation
          </button>
        </>
      )}

      {menu.type === 'canvas' && (
        <>
          <div className="px-4 py-2 text-xs text-gray-500">
            Clic droit sur une lane pour plus d'options
          </div>
        </>
      )}
    </div>
  )
}
