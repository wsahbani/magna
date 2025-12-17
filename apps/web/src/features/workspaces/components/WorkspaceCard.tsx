/**
 * Workspace Card Component
 * Displays workspace information in card format
 */

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card'
import { Button } from '@repo/ui/components/ui/button'
import type { Workspace } from '../types/workspace.types'
import { Building2, Users, FileText } from 'lucide-react'

interface WorkspaceCardProps {
  workspace: Workspace
  onClick?: () => void
  onEdit?: (workspace: Workspace) => void
  onDelete?: (workspace: Workspace) => void
}

const workspaceTypeLabels: Record<string, string> = {
  GROUPE: 'Groupe',
  ENTITY: 'Entité',
  DIRECTION: 'Direction',
  DEPARTMENT: 'Département',
  TEAM: 'Équipe',
}

const workspaceTypeColors: Record<string, string> = {
  GROUPE: 'bg-purple-100 text-purple-800 border-purple-200',
  ENTITY: 'bg-blue-100 text-blue-800 border-blue-200',
  DIRECTION: 'bg-green-100 text-green-800 border-green-200',
  DEPARTMENT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  TEAM: 'bg-orange-100 text-orange-800 border-orange-200',
}

export function WorkspaceCard({ workspace, onClick, onEdit, onDelete }: WorkspaceCardProps) {
  const typeColor = workspaceTypeColors[workspace.type] || 'bg-gray-100 text-gray-800'

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger navigation if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    onClick?.()
  }

  return (
    <Card 
      className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base mb-1">{workspace.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${typeColor}`}
              >
                {workspaceTypeLabels[workspace.type]}
              </span>
              <span className="text-xs text-gray-500 font-mono">{workspace.code}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        {workspace.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{workspace.description}</p>
        )}

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Enfants</p>
              <p className="text-sm font-semibold">{workspace._count?.children || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Processus</p>
              <p className="text-sm font-semibold">{workspace._count?.processes || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Membres</p>
              <p className="text-sm font-semibold">{workspace._count?.workspaceMembers || 0}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(workspace)
              }}
              className="flex-1 h-8 text-xs"
            >
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(workspace)
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 text-xs"
            >
              Supprimer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
