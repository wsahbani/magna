import { Square } from 'lucide-react'
import { createNode, defineNodeConfig, COLOR_SCHEMES, HANDLE_CONFIGS } from './BaseNode'

/**
 * End Event Node - Marks the end of a process
 * BPMN 2.0 compliant end event representation
 */
export const EndEventNode = createNode(
  defineNodeConfig({
    shape: 'circle',
    ...COLOR_SCHEMES.red,
    borderWidth: 4,
    icon: <Square className="w-4 h-4 fill-current" />,
    handles: [HANDLE_CONFIGS.targetLeft],
    showLabel: true,
    labelPosition: 'below',
  })
)

EndEventNode.displayName = 'EndEventNode'

