import { Play } from 'lucide-react'
import { createNode, defineNodeConfig, COLOR_SCHEMES, HANDLE_CONFIGS } from './BaseNode'

/**
 * Start Event Node - Marks the beginning of a process
 * BPMN 2.0 compliant start event representation
 */
export const StartEventNode = createNode(
  defineNodeConfig({
    shape: 'circle',
    ...COLOR_SCHEMES.green,
    borderWidth: 4,
    icon: <Play className="w-5 h-5 fill-current" />,
    handles: [HANDLE_CONFIGS.sourceBottom],
    showLabel: true,
    labelPosition: 'below',
  })
)

StartEventNode.displayName = 'StartEventNode'

