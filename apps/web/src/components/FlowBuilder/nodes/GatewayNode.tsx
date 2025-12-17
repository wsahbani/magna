import { GitBranch } from 'lucide-react'
import { createNode, defineNodeConfig, COLOR_SCHEMES, HANDLE_CONFIGS } from './BaseNode'

/**
 * Gateway Node - Represents decision points or parallel flows
 * BPMN 2.0 compliant gateway representation
 */
export const GatewayNode = createNode(
  defineNodeConfig({
    shape: 'diamond',
    ...COLOR_SCHEMES.yellow,
    borderWidth: 4,
    icon: <GitBranch className="w-6 h-6" />,
    iconRotation: -45, // Compensate for diamond rotation
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
      HANDLE_CONFIGS.sourceTop,
      HANDLE_CONFIGS.sourceBottom,
    ],
    showLabel: true,
    labelPosition: 'below',
  })
)

GatewayNode.displayName = 'GatewayNode'
