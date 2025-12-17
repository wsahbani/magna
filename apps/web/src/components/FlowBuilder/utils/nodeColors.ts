import { Node } from '@xyflow/react'

/**
 * Get node color for minimap based on node type
 */
export function getNodeColor(node: Node): string {
  switch (node.type) {
    case 'startEvent': return '#4caf50'
    case 'endEvent': return '#f44336'
    case 'intermediateEvent': return '#3b82f6'
    case 'timerEvent': return '#f59e0b'
    case 'messageEvent': return '#06b6d4'
    case 'errorEvent': return '#f43f5e'
    case 'task': return '#2196f3'
    case 'userTask': return '#2563eb'
    case 'serviceTask': return '#6366f1'
    case 'gateway': return '#ff9800'
    case 'process': return '#9c27b0'
    case 'database': return '#14b8a6'
    case 'apiCall': return '#6366f1'
    case 'conditional': return '#f59e0b'
    case 'group': return '#a855f7'
    default: return '#9e9e9e'
  }
}
