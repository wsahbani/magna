import { useCallback } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Heading3, BodySmall } from '@repo/ui'
import {
  Play,
  Square,
  Activity,
  GitBranch,
  FileText,
  MessageSquare,
  Circle,
  Diamond,
  Clock,
  Mail,
  Layers,
  FileCode,
} from 'lucide-react'
import type { QualigramNodeType } from '../types/procedure.types'
import type { QualigramLevel } from '../../qualigram/types/qualigram-editor.types'

interface NodePaletteProps {
  level: QualigramLevel
  onNodeTypeSelect: (type: QualigramNodeType) => void
}

interface NodeTypeConfig {
  type: QualigramNodeType
  label: string
  icon: React.ReactNode
  color: string
  description: string
}

const ALL_NODE_TYPES: NodeTypeConfig[] = [
  {
    type: 'START',
    label: 'Début',
    icon: <Play className="h-4 w-4" />,
    color: 'bg-green-500',
    description: 'Événement de début',
  },
  {
    type: 'END',
    label: 'Fin',
    icon: <Square className="h-4 w-4" />,
    color: 'bg-red-500',
    description: 'Événement de fin',
  },
  {
    type: 'ACTIVITY',
    label: 'Activité',
    icon: <Activity className="h-4 w-4" />,
    color: 'bg-blue-500',
    description: 'Tâche ou activité',
  },
  {
    type: 'DECISION',
    label: 'Décision',
    icon: <Diamond className="h-4 w-4" />,
    color: 'bg-yellow-500',
    description: 'Point de décision',
  },
  {
    type: 'GATEWAY_AND',
    label: 'ET',
    icon: <Circle className="h-4 w-4" />,
    color: 'bg-purple-500',
    description: 'Porte ET (parallèle)',
  },
  {
    type: 'GATEWAY_OR',
    label: 'OU',
    icon: <Circle className="h-4 w-4" />,
    color: 'bg-indigo-500',
    description: 'Porte OU (inclusif)',
  },
  {
    type: 'GATEWAY_XOR',
    label: 'OU Exclusif',
    icon: <Circle className="h-4 w-4" />,
    color: 'bg-pink-500',
    description: 'Porte OU exclusif',
  },
  {
    type: 'SUBPROCESS',
    label: 'Sous-processus',
    icon: <GitBranch className="h-4 w-4" />,
    color: 'bg-teal-500',
    description: 'Sous-processus',
  },
  {
    type: 'DOCUMENT',
    label: 'Document',
    icon: <FileText className="h-4 w-4" />,
    color: 'bg-gray-500',
    description: 'Document',
  },
  {
    type: 'EVENT_TIMER',
    label: 'Événement Timer',
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-orange-500',
    description: 'Événement temporel',
  },
  {
    type: 'EVENT_MESSAGE',
    label: 'Événement Message',
    icon: <Mail className="h-4 w-4" />,
    color: 'bg-cyan-500',
    description: 'Événement message',
  },
  {
    type: 'PROCESS_NODE',
    label: 'Processus',
    icon: <Layers className="h-4 w-4" />,
    color: 'bg-orange-600',
    description: 'Créer un nouveau Processus',
  },
  {
    type: 'PROCEDURE_NODE',
    label: 'Procédure',
    icon: <FileCode className="h-4 w-4" />,
    color: 'bg-blue-600',
    description: 'Créer une nouvelle Procédure',
  },
]

/**
 * Get available node types for a level
 */
function getNodeTypesForLevel(level: QualigramLevel): NodeTypeConfig[] {
  switch (level) {
    case 'macro-process':
      // Only PROCESS_NODE for MacroProcess level
      return ALL_NODE_TYPES.filter((nt) => nt.type === 'PROCESS_NODE')
    case 'process':
      // Only PROCEDURE_NODE for Process level
      return ALL_NODE_TYPES.filter((nt) => nt.type === 'PROCEDURE_NODE')
    case 'procedure':
      // All Qualigram types except PROCESS_NODE and PROCEDURE_NODE
      return ALL_NODE_TYPES.filter(
        (nt) => nt.type !== 'PROCESS_NODE' && nt.type !== 'PROCEDURE_NODE',
      )
    default:
      return []
  }
}

export function NodePalette({ level, onNodeTypeSelect }: NodePaletteProps) {
  const nodeTypes = getNodeTypesForLevel(level)
  const handleDragStart = useCallback(
    (event: React.DragEvent, nodeType: QualigramNodeType) => {
      event.dataTransfer.setData('application/reactflow', nodeType)
      event.dataTransfer.effectAllowed = 'move'
    },
    [],
  )

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <Heading3 className="mb-4 text-lg font-semibold">Palette Qualigram</Heading3>
      <BodySmall className="text-gray-500 mb-4">
        Glissez-déposez les éléments sur le canvas
      </BodySmall>

      <div className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            draggable
            onDragStart={(e) => handleDragStart(e, nodeType.type)}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 hover:border-orange-300 transition-colors"
          >
            <div className={`${nodeType.color} p-2 rounded text-white`}>
              {nodeType.icon}
            </div>
            <div className="flex-1 min-w-0">
              <BodySmall className="font-medium text-sm">{nodeType.label}</BodySmall>
              <BodySmall className="text-xs text-gray-500">
                {nodeType.description}
              </BodySmall>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onNodeTypeSelect('ACTIVITY')}
        >
          <Activity className="h-4 w-4 mr-2" />
          Ajouter rapidement
        </Button>
      </div>
    </div>
  )
}

