import { useCallback } from 'react'
import { Node } from '@xyflow/react'

/**
 * Hook for managing group-to-group attachment via toolbar buttons
 */
interface NodeChange {
  item: Node
  type: string
  id: string
}

export function useGroupAttachment(
  nodes: Node[],
  onNodesChange: (changes: NodeChange[]) => void
) {
  /**
   * Attach a group node to another group node
   */
  const attachGroupToGroup = useCallback((childGroupId: string, parentGroupId: string) => {
    console.log('Attaching group', childGroupId, 'to group', parentGroupId)
    const childGroup = nodes.find(n => n.id === childGroupId)
    const parentGroup = nodes.find(n => n.id === parentGroupId)
    
    if (!childGroup || !parentGroup) {
      console.error('Child or parent group not found')
      return
    }
    
    // Prevent attaching to self
    if (childGroupId === parentGroupId) {
      console.error('Cannot attach group to itself')
      return
    }
    
    // Calculate absolute position of the child group (if it already has a parent)
    let absoluteChildPosition = { ...childGroup.position }
    const currentParentId = (childGroup as any).parentId
    if (currentParentId) {
      const currentParent = nodes.find(n => n.id === currentParentId)
      if (currentParent) {
        absoluteChildPosition = {
          x: childGroup.position.x + currentParent.position.x,
          y: childGroup.position.y + currentParent.position.y,
        }
      }
    }
    
    // Calculate absolute position of the parent group (if it has a parent)
    let absoluteParentPosition = { ...parentGroup.position }
    const parentGroupParentId = (parentGroup as any).parentId
    if (parentGroupParentId) {
      const parentGroupParent = nodes.find(n => n.id === parentGroupParentId)
      if (parentGroupParent) {
        absoluteParentPosition = {
          x: parentGroup.position.x + parentGroupParent.position.x,
          y: parentGroup.position.y + parentGroupParent.position.y,
        }
      }
    }
    
    // Calculate new relative position to the new parent
    const relativePosition = {
      x: absoluteChildPosition.x - absoluteParentPosition.x,
      y: absoluteChildPosition.y - absoluteParentPosition.y,
    }
    
    // Update all nodes
    const updatedNodes = nodes.map(n => {
      // Update the child group
      if (n.id === childGroupId) {
        return {
          ...n,
          position: relativePosition,
          parentId: parentGroupId,
          extent: 'parent' as const,
          data: {
            ...n.data,
            parentId: parentGroupId,
          },
        } as any
      }
      
      // Update new parent's childIds
      if (n.id === parentGroupId) {
        const currentChildIds = (n.data?.childIds as string[]) || []
        if (!currentChildIds.includes(childGroupId)) {
          return {
            ...n,
            data: {
              ...n.data,
              childIds: [...currentChildIds, childGroupId],
            },
          }
        }
      }
      
      // Remove from old parent's childIds (if moving from another parent)
      if (currentParentId && n.id === currentParentId && n.id !== parentGroupId) {
        const currentChildIds = (n.data?.childIds as string[]) || []
        return {
          ...n,
          data: {
            ...n.data,
            childIds: currentChildIds.filter(id => id !== childGroupId),
          },
        }
      }
      
      return n
    })
    
    onNodesChange(
      updatedNodes.map(n => ({
        item: n,
        type: 'replace',
        id: n.id,
      }))
    )
  }, [nodes, onNodesChange])
  
  /**
   * Detach a group node from its parent
   */
  const detachGroupFromParent = useCallback((groupId: string) => {
    const group = nodes.find(n => n.id === groupId)
    if (!group) {
      console.error('Group not found')
      return
    }
    
    const parentId = (group as any).parentId
    if (!parentId) {
      console.error('Group has no parent')
      return
    }
    
    const parent = nodes.find(n => n.id === parentId)
    if (!parent) {
      console.error('Parent not found')
      return
    }
    
    // Convert position to absolute
    const absolutePosition = {
      x: group.position.x + parent.position.x,
      y: group.position.y + parent.position.y,
    }
    
    // Update all nodes
    const updatedNodes = nodes.map(n => {
      // Update the group
      if (n.id === groupId) {
        return {
          ...n,
          position: absolutePosition,
          parentId: undefined,
          extent: undefined,
          data: {
            ...n.data,
            parentId: null,
          },
        } as any
      }
      
      // Remove from parent's childIds
      if (n.id === parentId) {
        const currentChildIds = (n.data?.childIds as string[]) || []
        return {
          ...n,
          data: {
            ...n.data,
            childIds: currentChildIds.filter(id => id !== groupId),
          },
        }
      }
      
      return n
    })
    
    onNodesChange(
      updatedNodes.map(n => ({
        item: n,
        type: 'replace',
        id: n.id,
      }))
    )
  }, [nodes, onNodesChange])
  
  /**
   * Get available groups for attachment (excludes self and descendants)
   */
  const getAvailableGroups = useCallback((groupId: string) => {
    const group = nodes.find(n => n.id === groupId)
    if (!group) return []
    
    // Get all descendants recursively
    const getDescendants = (nodeId: string): string[] => {
      const node = nodes.find(n => n.id === nodeId)
      if (!node) return []
      
      const childIds = (node.data?.childIds as string[]) || []
      const descendants: string[] = [...childIds]
      
      childIds.forEach(childId => {
        descendants.push(...getDescendants(childId))
      })
      
      return descendants
    }
    
    const descendants = getDescendants(groupId)
    
    // Return all group nodes (including domainGroup) except self and descendants
    return nodes.filter(n => 
      (n.type === 'group' || n.type === 'domainGroup') && 
      n.id !== groupId && 
      !descendants.includes(n.id)
    )
  }, [nodes])
  
  return {
    attachGroupToGroup,
    detachGroupFromParent,
    getAvailableGroups,
  }
}
