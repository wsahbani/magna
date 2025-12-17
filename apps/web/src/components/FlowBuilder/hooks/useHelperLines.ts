import { useCallback } from 'react'
import { Node } from '@xyflow/react'

interface HelperLines {
  horizontal?: number
  vertical?: number
}

/**
 * Hook for alignment helper lines during node dragging
 */
export function useHelperLines(
  nodes: Node[],
  showHelperLines: boolean,
  setHelperLines: (lines: HelperLines) => void
) {
  const calculateHelperLines = useCallback(
    (draggedNode: Node) => {
      if (!showHelperLines) {
        setHelperLines({})
        return
      }

      const threshold = 5 // pixels threshold for alignment
      let horizontalLine: number | undefined
      let verticalLine: number | undefined

      // Find nearby nodes to align with
      nodes.forEach((n) => {
        if (n.id === draggedNode.id) return

        const nCenter = {
          x: (n.position?.x || 0) + ((n.width || 0) / 2),
          y: (n.position?.y || 0) + ((n.height || 0) / 2),
        }
        const nodeCenter = {
          x: draggedNode.position.x + ((draggedNode.width || 0) / 2),
          y: draggedNode.position.y + ((draggedNode.height || 0) / 2),
        }

        // Check horizontal alignment (Y axis)
        if (Math.abs(nCenter.y - nodeCenter.y) < threshold) {
          horizontalLine = nCenter.y
        }
        if (Math.abs((n.position?.y || 0) - draggedNode.position.y) < threshold) {
          horizontalLine = n.position?.y || 0
        }
        if (Math.abs((n.position?.y || 0) + (n.height || 0) - (draggedNode.position.y + (draggedNode.height || 0))) < threshold) {
          horizontalLine = (n.position?.y || 0) + (n.height || 0)
        }

        // Check vertical alignment (X axis)
        if (Math.abs(nCenter.x - nodeCenter.x) < threshold) {
          verticalLine = nCenter.x
        }
        if (Math.abs((n.position?.x || 0) - draggedNode.position.x) < threshold) {
          verticalLine = n.position?.x || 0
        }
        if (Math.abs((n.position?.x || 0) + (n.width || 0) - (draggedNode.position.x + (draggedNode.width || 0))) < threshold) {
          verticalLine = (n.position?.x || 0) + (n.width || 0)
        }
      })

      setHelperLines({
        horizontal: horizontalLine,
        vertical: verticalLine,
      })
    },
    [nodes, showHelperLines, setHelperLines]
  )

  const clearHelperLines = useCallback(() => {
    setHelperLines({})
  }, [setHelperLines])

  return {
    calculateHelperLines,
    clearHelperLines,
  }
}
