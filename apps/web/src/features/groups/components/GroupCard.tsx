/**
 * GroupCard Component
 * Displays group information in card format
 */

import { Group } from '../types/group.types'
import { Card, CardContent, Badge } from '@repo/ui'
import { Body, BodySmall, Caption } from '@repo/ui'
import { Users, Edit, Trash2, Shield } from 'lucide-react'

interface GroupCardProps {
  group: Group
  onEdit?: (group: Group) => void
  onDelete?: (group: Group) => void
  isAdmin?: boolean
}

export function GroupCard({ group, onEdit, onDelete, isAdmin }: GroupCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header with color indicator */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: group.color || '#EA580C' }}
            />
            <div>
              <Body className="font-semibold">{group.name}</Body>
              <Caption className="text-gray-500">Code: {group.code}</Caption>
            </div>
          </div>
          <Badge variant={group.isActive ? 'default' : 'secondary'}>
            {group.isActive ? 'Actif' : 'Inactif'}
          </Badge>
        </div>

        {/* Description */}
        {group.description && (
          <BodySmall className="text-gray-600 mb-4 line-clamp-2">
            {group.description}
          </BodySmall>
        )}

        {/* Stats */}
        <div className="flex items-center gap-6 mb-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <Caption className="text-gray-600">
              {group._count?.users || 0} utilisateurs
            </Caption>
          </div>
          {group._count?.permissions !== undefined && (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <Caption className="text-gray-600">
                {group._count.permissions} permissions
              </Caption>
            </div>
          )}
        </div>

        {/* Actions - Admin only */}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(group)}
              className="flex-1 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
            <button
              onClick={() => onDelete?.(group)}
              className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
