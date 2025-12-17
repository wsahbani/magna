import { Box } from 'lucide-react'
import { createNode, defineNodeConfig, COLOR_SCHEMES, HANDLE_CONFIGS } from './BaseNode'

/**
 * Process Node - Represents a sub-process or linked process
 * BPMN 2.0 compliant sub-process representation
 */
export const ProcessNode = createNode(
  defineNodeConfig({
    shape: 'rectangle',
    ...COLOR_SCHEMES.simple,
    borderWidth: 1,
    icon: <Box className="w-5 h-5" />,
    resizable: true,
    minWidth: 140,
    minHeight: 80,
    maxWidth: 500,
    maxHeight: 400,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
  })
)

ProcessNode.displayName = 'ProcessNode'
