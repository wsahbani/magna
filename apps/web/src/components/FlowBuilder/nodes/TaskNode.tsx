import { CheckSquare } from 'lucide-react'
import { createNode, defineNodeConfig, COLOR_SCHEMES, HANDLE_CONFIGS } from './BaseNode'

/**
 * Task Node - Represents a single activity or task
 * BPMN 2.0 compliant task representation
 */
export const TaskNode = createNode(
  defineNodeConfig({
    shape: 'rectangle',
    ...COLOR_SCHEMES.blue,
    borderWidth: 2,
    icon: <CheckSquare className="w-4 h-4" />,
    resizable: true,
    minWidth: 120,
    minHeight: 60,
    maxWidth: 1400,
    maxHeight: 300,
    handles: [
      HANDLE_CONFIGS.targetTop,
      HANDLE_CONFIGS.sourceBottom,
    ],
    
    showLabel: true,
    labelPosition: 'inside',
  })
)

TaskNode.displayName = 'TaskNode'
