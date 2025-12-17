import { Trash2, Edit2, Eye, Workflow, Target, Shield } from 'lucide-react'
import { Button, BodySmall } from '@repo/ui'
import type { Process } from '../types/process.types'
import { ProcessStatus, ProcessType, ProcessPriority } from '../types/enums'

interface ProcessCardProps {
  process: Process
  onView?: (process: Process) => void
  onEdit?: (process: Process) => void
  onDelete?: (process: Process) => void
}

const STATUS_CONFIG: Record<ProcessStatus, { label: string; color: string }> = {
  [ProcessStatus.DRAFT]: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  [ProcessStatus.IN_REVIEW]: { label: 'En révision', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  [ProcessStatus.VALIDATED]: { label: 'Validé', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  [ProcessStatus.PUBLISHED]: { label: 'Publié', color: 'bg-green-100 text-green-800 border-green-300' },
  [ProcessStatus.ARCHIVED]: { label: 'Archivé', color: 'bg-red-100 text-red-800 border-red-300' },
  [ProcessStatus.OBSOLETE]: { label: 'Obsolète', color: 'bg-gray-100 text-gray-800 border-gray-300' },
}

const TYPE_CONFIG: Record<ProcessType, { label: string; icon: typeof Workflow }> = {
  [ProcessType.FLOW]: { label: 'Flux', icon: Workflow },
  [ProcessType.SIPOC]: { label: 'SIPOC', icon: Target },
}

const PRIORITY_CONFIG: Record<ProcessPriority, { label: string; color: string }> = {
  [ProcessPriority.LOW]: { label: 'Faible', color: 'text-gray-600' },
  [ProcessPriority.MEDIUM]: { label: 'Moyenne', color: 'text-blue-600' },
  [ProcessPriority.HIGH]: { label: 'Élevée', color: 'text-orange-600' },
  [ProcessPriority.CRITICAL]: { label: 'Critique', color: 'text-red-600' },
}

export function ProcessCard({ process, onView, onEdit, onDelete }: ProcessCardProps) {
  const status = STATUS_CONFIG[process.status] || STATUS_CONFIG[ProcessStatus.DRAFT]
  const type = TYPE_CONFIG[process.type] || TYPE_CONFIG[ProcessType.FLOW]
  const priority = process.priority ? PRIORITY_CONFIG[process.priority] : null
  const TypeIcon = type.icon

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{process.title}</h3>
            <BodySmall className="text-gray-500">{process.code}</BodySmall>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color} flex-shrink-0 ml-2`}
          >
            {status.label}
          </span>
        </div>

        {/* Description */}
        {process.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{process.description}</p>
        )}

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TypeIcon className="h-4 w-4 text-orange-600 flex-shrink-0" />
            <span>{type.label}</span>
          </div>
          {priority && (
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-orange-600 flex-shrink-0" />
              <span className={priority.color}>Priorité: {priority.label}</span>
            </div>
          )}
          {process.confidentiality && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-orange-600 flex-shrink-0" />
              <span>{process.confidentiality}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Workflow className="h-4 w-4 text-orange-600 flex-shrink-0" />
            <span>{process._count?.procedures || 0} procédure{process._count?.procedures !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(process)}
              className="text-orange-600 hover:text-orange-700"
            >
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(process)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(process)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

