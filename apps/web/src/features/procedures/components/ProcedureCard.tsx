import { Trash2, Edit2, Eye, FileText, CheckCircle, Clock } from 'lucide-react'
import { Button, BodySmall } from '@repo/ui'
import type { Procedure } from '../types/procedure.types'

interface ProcedureCardProps {
  procedure: Procedure
  onView?: (procedure: Procedure) => void
  onEdit?: (procedure: Procedure) => void
  onDelete?: (procedure: Procedure) => void
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  IN_REVIEW: { label: 'En révision', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  VALIDATED: { label: 'Validé', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  PUBLISHED: { label: 'Publié', color: 'bg-green-100 text-green-800 border-green-300' },
  ARCHIVED: { label: 'Archivé', color: 'bg-red-100 text-red-800 border-red-300' },
  OBSOLETE: { label: 'Obsolète', color: 'bg-gray-100 text-gray-800 border-gray-300' },
}

export function ProcedureCard({ procedure, onView, onEdit, onDelete }: ProcedureCardProps) {
  const status = STATUS_CONFIG[procedure.status] || STATUS_CONFIG.DRAFT

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {procedure.title || 'Procédure sans nom'}
            </h3>
            <BodySmall className="text-gray-500">{procedure.code || 'N/A'}</BodySmall>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color} flex-shrink-0 ml-2`}
          >
            {status.label}
          </span>
        </div>

        {/* Description */}
        {procedure.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{procedure.description}</p>
        )}

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          {procedure.process && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4 text-orange-600 flex-shrink-0" />
              <span className="truncate">{procedure.process.title}</span>
            </div>
          )}
          {procedure.validatedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Validé le {new Date(procedure.validatedAt).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
          {procedure._count && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4 text-orange-600 flex-shrink-0" />
              <span>
                {procedure._count.nodes || 0} nœud{(procedure._count.nodes || 0) !== 1 ? 's' : ''} •{' '}
                {procedure._count.edges || 0} connexion{(procedure._count.edges || 0) !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(procedure)}
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
              onClick={() => onEdit(procedure)}
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
              onClick={() => onDelete(procedure)}
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

