import { Trash2, Edit2, Eye, MapPin } from 'lucide-react'
import { Button, BodySmall } from '@repo/ui'
import type { ProcessMap } from '../types/process-map.types'
import { ProcessStatus } from '../types/enums'

interface ProcessMapCardProps {
  processMap: ProcessMap
  onView?: (processMap: ProcessMap) => void
  onEdit?: (processMap: ProcessMap) => void
  onDelete?: (processMap: ProcessMap) => void
}

const STATUS_CONFIG: Record<ProcessStatus, { label: string; color: string }> = {
  [ProcessStatus.DRAFT]: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  [ProcessStatus.PUBLISHED]: { label: 'Publié', color: 'bg-green-100 text-green-800 border-green-300' },
  [ProcessStatus.ARCHIVED]: { label: 'Archivé', color: 'bg-red-100 text-red-800 border-red-300' },
}

export function ProcessMapCard({ processMap, onView, onEdit, onDelete }: ProcessMapCardProps) {
  const status = STATUS_CONFIG[processMap.status] || STATUS_CONFIG[ProcessStatus.DRAFT]

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{processMap.title}</h3>
            <BodySmall className="text-gray-500">{processMap.code}</BodySmall>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color} flex-shrink-0 ml-2`}
          >
            {status.label}
          </span>
        </div>

        {/* Description */}
        {processMap.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{processMap.description}</p>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="h-4 w-4 text-orange-600 flex-shrink-0" />
          <span>{processMap._count?.processes || 0} processus</span>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(processMap)}
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
              onClick={() => onEdit(processMap)}
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
              onClick={() => onDelete(processMap)}
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

