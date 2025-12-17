import { Trash2, Edit2, Eye } from 'lucide-react'
import { Button, BodySmall, Caption } from '@repo/ui'
import type { Procedure } from '../types/procedure.types'

interface ProcedureTableProps {
  procedures: Procedure[]
  onEdit: (procedure: Procedure) => void
  onView: (procedure: Procedure) => void
  onDelete: (procedure: Procedure) => void
}

export const ProcedureTable: React.FC<ProcedureTableProps> = ({
  procedures,
  onEdit,
  onView,
  onDelete,
}) => {
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'DRAFT':
        return 'Brouillon'
      case 'IN_REVIEW':
        return 'En révision'
      case 'VALIDATED':
        return 'Validé'
      case 'PUBLISHED':
        return 'Publié'
      case 'ARCHIVED':
        return 'Archivé'
      case 'OBSOLETE':
        return 'Obsolète'
      default:
        return 'Inconnu'
    }
  }

  const getStatusStyle = (status: string): string => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'IN_REVIEW':
        return 'bg-yellow-100 text-yellow-800'
      case 'VALIDATED':
        return 'bg-blue-100 text-blue-800'
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'ARCHIVED':
        return 'bg-red-100 text-red-800'
      case 'OBSOLETE':
        return 'bg-gray-100 text-gray-800'
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
              <Caption className="text-gray-500 uppercase tracking-wider">Processus</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Statut</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Éléments</Caption>
            </th>
            <th className="px-6 py-3 text-right">
              <Caption className="text-gray-500 uppercase tracking-wider">Actions</Caption>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {procedures.map((procedure) => (
            <tr key={procedure.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="font-medium text-gray-900">{procedure.title}</BodySmall>
              </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <BodySmall className="text-gray-500">{procedure.code || 'N/A'}</BodySmall>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <BodySmall className="text-gray-500">
                    {procedure.process?.title || procedure.process?.code || 'N/A'}
                  </BodySmall>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(procedure.status)}`}
                  >
                    {getStatusLabel(procedure.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <BodySmall className="text-gray-500">
                    {procedure._count?.nodes || 0} nœuds • {procedure._count?.edges || 0} connexions
                  </BodySmall>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(procedure)}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(procedure)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(procedure)}
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

