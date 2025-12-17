import { Card, CardContent } from '@repo/ui/components/ui/card'
import { Button } from '@repo/ui/components/ui/button'
import { Heading3, Body, BodySmall, Caption } from '@repo/ui'
import type { MacroProcess } from '../types/macro-process.types'
import { Folder, Eye, MoreVertical, GripVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'

interface MacroProcessCardProps {
  macroProcess: MacroProcess
  onView?: (macroProcess: MacroProcess) => void
  onEdit?: (macroProcess: MacroProcess) => void
  onDelete?: (macroProcess: MacroProcess) => void
  isDragging?: boolean
}

export function MacroProcessCard({
  macroProcess,
  onView,
  onEdit,
  onDelete,
  isDragging,
}: MacroProcessCardProps) {
  const processCount = macroProcess._count?.processes || 0

  return (
    <Card
      className={`group hover:shadow-md transition-all duration-200 border-l-4 h-full ${
        macroProcess.color
          ? `border-l-[${macroProcess.color}]`
          : 'border-l-orange-500'
      } ${isDragging ? 'opacity-50' : ''}`}
      style={{
        borderLeftColor: macroProcess.color || '#ea580c',
      }}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <GripVertical className="h-4 w-4 text-gray-400 mt-1 cursor-move" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {macroProcess.icon ? (
                  <span className="text-lg">{macroProcess.icon}</span>
                ) : (
                  <Folder className="h-4 w-4 text-orange-500" />
                )}
                <Heading3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                  {macroProcess.name}
                </Heading3>
              </div>
              <Caption className="text-xs text-gray-500">
                {macroProcess.code}
              </Caption>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(macroProcess)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(macroProcess)}>
                  Modifier
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(macroProcess)}
                  className="text-red-600"
                >
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {macroProcess.description && (
          <BodySmall className="text-gray-600 mb-3 line-clamp-2">
            {macroProcess.description}
          </BodySmall>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Folder className="h-3 w-3 text-gray-400" />
              <Caption className="text-xs text-gray-500">
                {processCount} processus
              </Caption>
            </div>
          </div>

          {!macroProcess.active && (
            <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
              Inactif
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

