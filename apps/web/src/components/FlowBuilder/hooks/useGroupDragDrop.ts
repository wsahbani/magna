import { useCallback } from 'react'
import { Node, ReactFlowInstance } from '@xyflow/react'

/**
 * Hook for handling node drag-and-drop into groups
 * 
 * Features:
 * - Automatically attach nodes when dropped inside group boundaries
 * - Supports nested groups (groups within groups)
 * - Prevents circular dependencies (can't drop a group into its own descendant)
 * - Handles position conversion between absolute and relative coordinates
 * - Maintains parent-child relationships and updates childIds arrays
 * - Detaches nodes when dragged outside their parent group
 * 
 * How it works:
 * 1. On drag stop, checks if node center is inside any group
 * 2. Converts position from absolute to relative coordinates
 * 3. Sets parentNode and updates parent's childIds
 * 4. For nested groups, properly handles multi-level coordinate transformations
 * 5. Prevents dropping a group into any of its descendants
 */
interface NodeChange {
  item: Node
  type: string
  id: string
}

/**
 * Helper function to check if a node is a descendant of another node
 * Prevents circular dependencies when nesting groups
 */
const isDescendantOf = (nodes: Node[], childId: string, potentialAncestorId: string): boolean => {
  const child = nodes.find(n => n.id === childId)
  if (!child || !(child as any).parentId) return false
  
  if ((child as any).parentId === potentialAncestorId) return true
  
  // Recursively check parent chain
  return isDescendantOf(nodes, (child as any).parentId, potentialAncestorId)
}

/**
 * Helper function to get all descendants of a node (including nested children)
 */
const getAllDescendants = (nodes: Node[], nodeId: string): string[] => {
  const node = nodes.find(n => n.id === nodeId)
  if (!node) return []
  
  const childIds = (node.data?.childIds as string[]) || []
  const descendants: string[] = [...childIds]
  
  // Recursively get descendants of children
  childIds.forEach(childId => {
    const childDescendants = getAllDescendants(nodes, childId)
    descendants.push(...childDescendants)
  })
  
  return descendants
}

export function useGroupDragDrop(
  nodes: Node[],
  onNodesChange: (changes: NodeChange[]) => void,
  reactFlowInstance: ReactFlowInstance | null
) {
  /**
   * Handle node drag stop - check if node should become child of a group
   */
  const handleNodeDragStop = useCallback(
    (_event: React.DragEvent, node: Node) => {
      if (!reactFlowInstance) return

      // Calculate absolute position of the dragged node
      // If it has a parent, its position is relative, so we need to convert to absolute
      let absoluteNodePosition = { ...node.position }
      const nodeParentId = (node as any).parentId
      if (nodeParentId) {
        const currentParent = nodes.find((n) => n.id === nodeParentId)
        if (currentParent) {
          absoluteNodePosition = {
            x: node.position.x + currentParent.position.x,
            y: node.position.y + currentParent.position.y,
          }
        }
      }

      // Find if node is dropped inside a group
      const intersectingGroups = nodes.filter((n) => {
        if (n.id === node.id || n.type !== 'group') return false
        
        // Prevent circular dependency: don't allow dropping a group into its own descendant
        if (node.type === 'group') {
          const descendants = getAllDescendants(nodes, node.id)
          if (descendants.includes(n.id)) {
            return false
          }
        }
        
        // Calculate absolute position of the target group
        let absoluteGroupPosition = { ...n.position }
        const groupParentId = (n as any).parentId
        if (groupParentId) {
          const groupCurrentParent = nodes.find((gn) => gn.id === groupParentId)
          if (groupCurrentParent) {
            absoluteGroupPosition = {
              x: n.position.x + groupCurrentParent.position.x,
              y: n.position.y + groupCurrentParent.position.y,
            }
          }
        }
        
        const groupRect = {
          x: absoluteGroupPosition.x,
          y: absoluteGroupPosition.y,
          width: n.width || (n.style?.width as number) || 400,
          height: n.height || (n.style?.height as number) || 300,
        }
        
        const nodeRect = {
          x: absoluteNodePosition.x,
          y: absoluteNodePosition.y,
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
        
        // Skip if already in this parent
        if ((node as any).parentId === parentGroup.id) {
          return
        }
        
        // Calculate absolute position of the parent group (if it has a parent)
        let absoluteParentGroupPosition = { ...parentGroup.position }
        const parentGroupParentId = (parentGroup as any).parentId
        if (parentGroupParentId) {
          const parentGroupCurrentParent = nodes.find((n) => n.id === parentGroupParentId)
          if (parentGroupCurrentParent) {
            absoluteParentGroupPosition = {
              x: parentGroup.position.x + parentGroupCurrentParent.position.x,
              y: parentGroup.position.y + parentGroupCurrentParent.position.y,
            }
          }
        }
        
        // Calculate new relative position to the new parent
        // We already have absoluteNodePosition from the intersection check
        const relativePosition = {
          x: absoluteNodePosition.x - absoluteParentGroupPosition.x,
          y: absoluteNodePosition.y - absoluteParentGroupPosition.y,
        }
        
        // Update the node
        const updatedNodes = nodes.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              position: relativePosition,
              parentId: parentGroup.id,
              extent: 'parent' as const,
              zIndex: 1000,
              data: {
                ...n.data,
                parentId: parentGroup.id,
              },
            } as any
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
          // Remove from old parent's childIds (if moving from another parent)
          const nodeParentId = (node as any).parentId
          if (nodeParentId && n.id === nodeParentId && n.id !== parentGroup.id) {
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
      } else if ((node as any).parentId) {
        // Node was dragged out of its parent group
        const oldParentId = (node as any).parentId
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
                parentId: undefined,
                extent: undefined,
                zIndex: 0,
                data: {
                  ...n.data,
                  parentId: null,
                },
              } as any
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
