import { Trash2, Edit2, Eye, MapPin, Building2 } from 'lucide-react'
import { Button, BodySmall, Caption } from '@repo/ui'
import type { ProcessMap } from '../types/process-map.types'
import { ProcessStatus } from '../types/enums'

interface ProcessMapGridViewProps {
  processMaps: ProcessMap[]
  onEdit: (processMap: ProcessMap) => void
  onView: (processMap: ProcessMap) => void
  onDelete: (id: string) => void
}

export const ProcessMapGridView: React.FC<ProcessMapGridViewProps> = ({
  processMaps,
  onEdit,
  onView,
  onDelete,
}) => {
  const getStatusLabel = (status: ProcessStatus): string => {
    switch (status) {
      case ProcessStatus.DRAFT:
        return 'Brouillon'
      case ProcessStatus.PUBLISHED:
        return 'Publié'
      case ProcessStatus.ARCHIVED:
        return 'Archivé'
      default:
        return 'Inconnu'
    }
  }

  const getStatusStyle = (status: ProcessStatus): string => {
    switch (status) {
      case ProcessStatus.DRAFT:
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case ProcessStatus.PUBLISHED:
        return 'bg-green-100 text-green-800 border-green-300'
      case ProcessStatus.ARCHIVED:
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {processMaps.map((processMap) => (
        <div
          key={processMap.id}
          className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{processMap.title}</h3>
                <BodySmall className="text-gray-500">{processMap.code}</BodySmall>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(
                  processMap.status
                )}`}
              >
                {getStatusLabel(processMap.status)}
              </span>
            </div>

            {processMap.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{processMap.description}</p>
            )}

            <div className="space-y-2 mb-4">
              {processMap.workspace && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4 text-orange-600" />
                  <span>{processMap.workspace.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-orange-600" />
                <span>{processMap._count?.processes || 0} processus</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(processMap)}
                className="text-orange-600 hover:text-orange-700"
              >
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(processMap)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(processMap.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

