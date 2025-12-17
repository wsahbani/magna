import { Card, CardContent } from '@repo/ui/components/ui/card'
import { Button } from '@repo/ui/components/ui/button'
import type { Process } from '../types/process.types'
import { GitBranch, Workflow, Eye, MoreVertical } from 'lucide-react'

interface ProcessCardProps {
  process: Process
  onView?: (process: Process) => void
  onEdit?: (process: Process) => void
  onDelete?: (process: Process) => void
}

const LEVEL_CONFIG: Record<number, { label: string; color: string }> = {
  1: { label: 'Processus', color: 'bg-purple-100 text-purple-700' },
  2: { label: 'Procédure', color: 'bg-blue-100 text-blue-700' },
  3: { label: 'Instruction', color: 'bg-green-100 text-green-700' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Brouillon', color: 'bg-gray-100 text-gray-600' },
  REVIEW: { label: 'En révision', color: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: 'Approuvé', color: 'bg-green-100 text-green-700' },
  PUBLISHED: { label: 'Publié', color: 'bg-blue-100 text-blue-700' },
  ARCHIVED: { label: 'Archivé', color: 'bg-red-100 text-red-600' },
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  FLOW: { label: 'Flow', color: 'bg-cyan-100 text-cyan-700' },
  SIPOC: { label: 'SIPOC', color: 'bg-teal-100 text-teal-700' },
  BPMN: { label: 'BPMN', color: 'bg-sky-100 text-sky-700' },
  FORM: { label: 'Formulaire', color: 'bg-indigo-100 text-indigo-700' },
  CHECKLIST: { label: 'Checklist', color: 'bg-pink-100 text-pink-700' },
};


export function ProcessCard({ process, onView, onEdit, onDelete }: ProcessCardProps) {
  const level = LEVEL_CONFIG[process.level] || LEVEL_CONFIG[1]
  const status = STATUS_CONFIG[process.status] || STATUS_CONFIG.DRAFT
  const type = TYPE_CONFIG[process.type]

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-orange-500 h-full">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 truncate group-hover:text-orange-600 transition-colors">
              {process.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{process.code}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Description */}
        {process.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-1">
            {process.description}
          </p>
        )}

        {/* Metadata Grid */}
        <div className="flex items-center justify-between gap-2 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full ${level.color} font-medium`}>
              {level.label}
            </span>
            {type && (
              <span className={`px-2 py-0.5 rounded-full ${type.color} font-medium`}>
                {type.label}
              </span>
            )}
          </div>
          <span className="text-gray-500">v{process.version}</span>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <GitBranch className="h-3.5 w-3.5 text-gray-400" />
            <span>{process._count?.children || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Workflow className="h-3.5 w-3.5 text-gray-400" />
            <span>{process._count?.nodes || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 pt-2 border-t border-gray-100">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(process)}
              className="h-8 px-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 flex-1 text-xs"
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Voir
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(process)}
              className="h-8 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 flex-1 text-xs"
            >
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(process)}
              className="h-8 px-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
              title="Supprimer"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}