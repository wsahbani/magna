import { useCallback } from 'react'
import { Node, ReactFlowInstance } from '@xyflow/react'

/**
 * Hook for managing node grouping and ungrouping
 */
export function useNodeGrouping(
  nodes: Node[],
  onNodesChange: (changes: any) => void,
  groupCounter: number,
  setGroupCounter: (counter: number) => void
) {
  /**
   * Create a group from selected nodes
   */
  const createGroup = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected)
    const selectedNodeCount = selectedNodes.length

    if (selectedNodeCount === 0) {
      alert('Please select nodes to group (hold Ctrl and click multiple nodes)')
      return
    }

    const selectedNodeIds = selectedNodes.map((n) => n.id)
    
    // Calculate bounding box for selected nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    selectedNodes.forEach((node) => {
      minX = Math.min(minX, node.position.x)
      minY = Math.min(minY, node.position.y)
      maxX = Math.max(maxX, node.position.x + (node.width || 150))
      maxY = Math.max(maxY, node.position.y + (node.height || 100))
    })

    // Add padding
    const padding = 40
    const groupX = minX - padding
    const groupY = minY - padding
    const groupWidth = maxX - minX + padding * 2
    const groupHeight = maxY - minY + padding * 2

    const groupId = `group-${Date.now()}`

    const newGroup: Node = {
      id: groupId,
      type: 'group',
      position: { x: groupX, y: groupY },
      style: {
        width: groupWidth,
        height: groupHeight,
        zIndex: -1,
      },
      zIndex: -1,
      data: {
        label: `Group ${groupCounter}`,
        isGroup: true,
        groupType: 'category',
        childIds: selectedNodeIds,
        collapsed: false,
      },
    }

    // Update children to be positioned relative to parent
    const updatedNodes = nodes.map((node) => {
      if (selectedNodeIds.includes(node.id)) {
        return {
          ...node,
          position: {
            x: node.position.x - groupX,
            y: node.position.y - groupY,
          },
          parentNode: groupId,
          extent: 'parent' as const,
          zIndex: 1000,
          data: {
            ...node.data,
            parentId: groupId,
          },
          selected: false,
        }
      }
      return node
    })

    const allNodes = [...updatedNodes, newGroup]
    onNodesChange(
      allNodes.map((n) => ({
        item: n,
        type: 'replace',
        id: n.id,
      }))
    )
    setGroupCounter(groupCounter + 1)
  }, [nodes, onNodesChange, groupCounter, setGroupCounter])

  /**
   * Ungroup a selected group node
   */
  const ungroupSelected = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected)
    const selectedNode = selectedNodes.length === 1 ? selectedNodes[0] : null

    if (!selectedNode || selectedNode.type !== 'group') {
      alert('Please select a group node to ungroup')
      return
    }

    const groupId = selectedNode.id
    const groupPosition = selectedNode.position
    const childIds: string[] = Array.isArray(selectedNode.data?.childIds) 
      ? (selectedNode.data.childIds as string[])
      : []
    
    // Update children to absolute positions and remove parent
    const updatedNodes = nodes
      .filter((n) => n.id !== groupId)
      .map((node) => {
        if (childIds.includes(node.id)) {
          return {
            ...node,
            position: {
              x: node.position.x + groupPosition.x,
              y: node.position.y + groupPosition.y,
            },
            parentNode: undefined,
            extent: undefined,
            zIndex: 0,
            data: {
              ...node.data,
              parentId: null,
            },
          }
        }
        return node
      })

    onNodesChange(
      updatedNodes.map((n) => ({
        item: n,
        type: 'replace',
        id: n.id,
      }))
    )
  }, [nodes, onNodesChange])

  return {
    createGroup,
    ungroupSelected,
  }
}
