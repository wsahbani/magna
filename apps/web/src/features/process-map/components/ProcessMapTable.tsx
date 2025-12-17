import { Trash2, Edit2, Eye } from 'lucide-react'
import { Button, BodySmall, Caption } from '@repo/ui'
import type { ProcessMap } from '../types/process-map.types'
import { ProcessStatus } from '../types/enums'

interface ProcessMapTableProps {
  processMaps: ProcessMap[]
  onEdit: (processMap: ProcessMap) => void
  onView: (processMap: ProcessMap) => void
  onDelete: (id: string) => void
}

export const ProcessMapTable: React.FC<ProcessMapTableProps> = ({
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
        return 'bg-gray-100 text-gray-800'
      case ProcessStatus.PUBLISHED:
        return 'bg-green-100 text-green-800'
      case ProcessStatus.ARCHIVED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
              <Caption className="text-gray-500 uppercase tracking-wider">Statut</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Workspace</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Processus</Caption>
            </th>
            <th className="px-6 py-3 text-right">
              <Caption className="text-gray-500 uppercase tracking-wider">Actions</Caption>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {processMaps.map((processMap) => (
            <tr key={processMap.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="font-medium text-gray-900">{processMap.title}</BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="text-gray-500">{processMap.code}</BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                    processMap.status
                  )}`}
                >
                  {getStatusLabel(processMap.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="text-gray-500">
                  {processMap.workspace?.name || '-'}
                </BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="text-gray-500">
                  {processMap._count?.processes || 0}
                </BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(processMap)}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(processMap)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

