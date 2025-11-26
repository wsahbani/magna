import { useCallback } from 'react'
import { Node, ReactFlowInstance } from '@xyflow/react'

/**
 * Hook for handling node drag-and-drop into groups
 */
export function useGroupDragDrop(
  nodes: Node[],
  onNodesChange: (changes: any) => void,
  reactFlowInstance: ReactFlowInstance | null
) {
  /**
   * Handle node drag stop - check if node should become child of a group
   */
  const handleNodeDragStop = useCallback(
    (_event: any, node: Node) => {
      if (!reactFlowInstance) return

      // Find if node is dropped inside a group
      const intersectingGroups = nodes.filter((n) => {
        if (n.id === node.id || n.type !== 'group') return false
        
        const groupRect = {
          x: n.position.x,
          y: n.position.y,
          width: n.width || (n.style?.width as number) || 400,
          height: n.height || (n.style?.height as number) || 300,
        }
        
        const nodeRect = {
          x: node.position.x,
          y: node.position.y,
          width: node.width || 150,
          height: node.height || 100,
        }
        
        // Check if node center is inside group
        const nodeCenterX = nodeRect.x + nodeRect.width / 2
        const nodeCenterY = nodeRect.y + nodeRect.height / 2
        
        return (
          nodeCenterX >= groupRect.x &&
          nodeCenterX <= groupRect.x + groupRect.width &&
          nodeCenterY >= groupRect.y &&
          nodeCenterY <= groupRect.y + groupRect.height
        )
      })
      
      if (intersectingGroups.length > 0) {
        // Node dropped inside a group
        const parentGroup = intersectingGroups[0]
        
        if (node.data?.parentId === parentGroup.id) {
          return
        }
        
        // Calculate position relative to parent
        let currentPosition = { ...node.position }
        if (node.data?.parentId) {
          const oldParent = nodes.find((n) => n.id === node.data.parentId)
          if (oldParent) {
            currentPosition = {
              x: node.position.x + oldParent.position.x,
              y: node.position.y + oldParent.position.y,
            }
          }
        }
        
        const relativePosition = {
          x: currentPosition.x - parentGroup.position.x,
          y: currentPosition.y - parentGroup.position.y,
        }
        
        // Update the node
        const updatedNodes = nodes.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              position: relativePosition,
              parentNode: parentGroup.id,
              extent: 'parent' as const,
              zIndex: 1000,
              data: {
                ...n.data,
                parentId: parentGroup.id,
              },
            }
          }
          // Update new parent's childIds
          if (n.id === parentGroup.id) {
            const currentChildIds = (n.data?.childIds as string[]) || []
            if (!currentChildIds.includes(node.id)) {
              return {
                ...n,
                data: {
                  ...n.data,
                  childIds: [...currentChildIds, node.id],
                },
              }
            }
          }
          // Remove from old parent's childIds
          if (node.data?.parentId && n.id === node.data.parentId && n.id !== parentGroup.id) {
            const currentChildIds = (n.data?.childIds as string[]) || []
            return {
              ...n,
              data: {
                ...n.data,
                childIds: currentChildIds.filter((id) => id !== node.id),
              },
            }
          }
          return n
        })
        
        onNodesChange(
          updatedNodes.map((n) => ({
            item: n,
            type: 'replace',
            id: n.id,
          }))
        )
      } else if (node.parentId) {
        // Node was dragged out of its parent group
        const oldParentId = node.parentId
        const parentNode = nodes.find((n) => n.id === oldParentId)
        
        if (parentNode) {
          const absolutePosition = {
            x: node.position.x + parentNode.position.x,
            y: node.position.y + parentNode.position.y,
          }
          
          const updatedNodes = nodes.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                position: absolutePosition,
                parentNode: undefined,
                extent: undefined,
                zIndex: 0,
                data: {
                  ...n.data,
                  parentId: null,
                },
              }
            }
            // Remove from old parent's childIds
            if (n.id === oldParentId) {
              const currentChildIds = (n.data?.childIds as string[]) || []
              return {
                ...n,
                data: {
                  ...n.data,
                  childIds: currentChildIds.filter((id) => id !== node.id),
                },
              }
            }
            return n
          })
          
          onNodesChange(
            updatedNodes.map((n) => ({
              item: n,
              type: 'replace',
              id: n.id,
            }))
          )
        }
      }
    },
    [nodes, reactFlowInstance, onNodesChange]
  )

  return {
    handleNodeDragStop,
  }
}
