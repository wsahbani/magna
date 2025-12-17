import { BackgroundVariant } from '@xyflow/react'

export interface GridSettings {
  snapToGrid: boolean
  gridSize: number
  showGrid: boolean
  backgroundPattern: 'dots' | 'lines' | 'cross' | 'none'
}

/**
 * Map background pattern to ReactFlow variant
 */
export function getBackgroundVariant(pattern: GridSettings['backgroundPattern']) {
  switch (pattern) {
    case 'dots':
      return BackgroundVariant.Dots
    case 'lines':
      return BackgroundVariant.Lines
    case 'cross':
      return BackgroundVariant.Cross
    case 'none':
      return undefined
    default:
      return BackgroundVariant.Dots
  }
}
