import { Trash2, Edit2, Eye } from 'lucide-react'
import { Button, BodySmall, Caption } from '@repo/ui'
import type { Process } from '../types/process.types'
import { ProcessStatus, ProcessType, ProcessPriority } from '../types/enums'

interface ProcessTableProps {
  processes: Process[]
  onEdit: (process: Process) => void
  onView: (process: Process) => void
  onDelete: (process: Process) => void
}

export const ProcessTable: React.FC<ProcessTableProps> = ({
  processes,
  onEdit,
  onView,
  onDelete,
}) => {
  const getStatusLabel = (status: ProcessStatus): string => {
    switch (status) {
      case ProcessStatus.DRAFT:
        return 'Brouillon'
      case ProcessStatus.IN_REVIEW:
        return 'En révision'
      case ProcessStatus.VALIDATED:
        return 'Validé'
      case ProcessStatus.PUBLISHED:
        return 'Publié'
      case ProcessStatus.ARCHIVED:
        return 'Archivé'
      case ProcessStatus.OBSOLETE:
        return 'Obsolète'
      default:
        return 'Inconnu'
    }
  }

  const getStatusStyle = (status: ProcessStatus): string => {
    switch (status) {
      case ProcessStatus.DRAFT:
        return 'bg-gray-100 text-gray-800'
      case ProcessStatus.IN_REVIEW:
        return 'bg-yellow-100 text-yellow-800'
      case ProcessStatus.VALIDATED:
        return 'bg-blue-100 text-blue-800'
      case ProcessStatus.PUBLISHED:
        return 'bg-green-100 text-green-800'
      case ProcessStatus.ARCHIVED:
        return 'bg-red-100 text-red-800'
      case ProcessStatus.OBSOLETE:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: ProcessType): string => {
    switch (type) {
      case ProcessType.FLOW:
        return 'Flux'
      case ProcessType.SIPOC:
        return 'SIPOC'
      default:
        return 'Inconnu'
    }
  }

  const getPriorityLabel = (priority?: ProcessPriority): string => {
    if (!priority) return '-'
    switch (priority) {
      case ProcessPriority.LOW:
        return 'Faible'
      case ProcessPriority.MEDIUM:
        return 'Moyenne'
      case ProcessPriority.HIGH:
        return 'Élevée'
      case ProcessPriority.CRITICAL:
        return 'Critique'
      default:
        return '-'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Titre</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Code</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Type</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Statut</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Priorité</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Procédures</Caption>
            </th>
            <th className="px-6 py-3 text-right">
              <Caption className="text-gray-500 uppercase tracking-wider">Actions</Caption>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {processes.map((process) => (
            <tr key={process.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="font-medium text-gray-900">{process.title}</BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="text-gray-500">{process.code}</BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="text-gray-500">{getTypeLabel(process.type)}</BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(process.status)}`}
                >
                  {getStatusLabel(process.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="text-gray-500">{getPriorityLabel(process.priority)}</BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="text-gray-500">
                  {process._count?.procedures || 0}
                </BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(process)}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(process)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(process)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

