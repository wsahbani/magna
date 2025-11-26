import { Circle, AlertCircle, Clock, Mail, FileText, Users } from 'lucide-react'
import { createNode, defineNodeConfig, COLOR_SCHEMES, HANDLE_CONFIGS } from './BaseNode'

/**
 * Intermediate Event Node - Represents events that occur during process execution
 */
export const IntermediateEventNode = createNode(
  defineNodeConfig({
    shape: 'circle',
    backgroundColor: 'blue-50',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-600',
    borderWidth: 3,
    icon: <Circle className="w-4 h-4" />,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'below',
  })
)

IntermediateEventNode.displayName = 'IntermediateEventNode'

/**
 * Timer Event Node - Represents time-based events
 */
export const TimerEventNode = createNode(
  defineNodeConfig({
    shape: 'circle',
    backgroundColor: 'amber-50',
    borderColor: 'border-amber-500',
    iconColor: 'text-amber-600',
    borderWidth: 3,
    icon: <Clock className="w-5 h-5" />,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'below',
  })
)

TimerEventNode.displayName = 'TimerEventNode'

/**
 * Message Event Node - Represents message-based events
 */
export const MessageEventNode = createNode(
  defineNodeConfig({
    shape: 'circle',
    backgroundColor: 'cyan-50',
    borderColor: 'border-cyan-500',
    iconColor: 'text-cyan-600',
    borderWidth: 3,
    icon: <Mail className="w-5 h-5" />,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'below',
  })
)

MessageEventNode.displayName = 'MessageEventNode'

/**
 * Error Event Node - Represents error handling events
 */
export const ErrorEventNode = createNode(
  defineNodeConfig({
    shape: 'circle',
    backgroundColor: 'rose-50',
    borderColor: 'border-rose-500',
    iconColor: 'text-rose-600',
    borderWidth: 3,
    icon: <AlertCircle className="w-5 h-5" />,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'below',
  })
)

ErrorEventNode.displayName = 'ErrorEventNode'

/**
 * User Task Node - Represents tasks performed by users
 */
export const UserTaskNode = createNode(
  defineNodeConfig({
    shape: 'rectangle',
    ...COLOR_SCHEMES.blue,
    borderWidth: 2,
    icon: <Users className="w-4 h-4" />,
    resizable: true,
    minWidth: 120,
    minHeight: 60,
    maxWidth: 400,
    maxHeight: 300,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    className: 'border-l-4 border-l-blue-700',
  })
)

UserTaskNode.displayName = 'UserTaskNode'

/**
 * Service Task Node - Represents automated service tasks
 */
export const ServiceTaskNode = createNode(
  defineNodeConfig({
    shape: 'rectangle',
    backgroundColor: 'white',
    borderColor: 'border-indigo-500',
    iconColor: 'text-indigo-600',
    borderWidth: 2,
    icon: <FileText className="w-4 h-4" />,
    resizable: true,
    minWidth: 120,
    minHeight: 60,
    maxWidth: 400,
    maxHeight: 300,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    className: 'border-l-4 border-l-indigo-700',
  })
)

ServiceTaskNode.displayName = 'ServiceTaskNode'
