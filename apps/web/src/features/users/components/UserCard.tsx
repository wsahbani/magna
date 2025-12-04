import { User } from '../types/user.types';
import { Badge } from '@repo/ui';
import { BodySmall, Caption } from '@repo/ui';
import { Mail, Briefcase, Shield, Users, Building2 } from 'lucide-react';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            {user.isAdmin && (
              <Badge variant="destructive" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>
          {user.displayName && (
            <Caption className="text-gray-500">{user.displayName}</Caption>
          )}
        </div>

        <div className="flex items-center gap-1">
          {user.isActive ? (
            <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>
          ) : (
            <Badge variant="secondary">Inactif</Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <BodySmall className="text-sm">{user.email}</BodySmall>
        </div>

        {user.position && (
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-4 h-4" />
            <BodySmall className="text-sm">{user.position}</BodySmall>
          </div>
        )}

        {user.department && (
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-4 h-4" />
            <BodySmall className="text-sm">{user.department.name}</BodySmall>
          </div>
        )}

        {user.group && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <Badge
              variant="secondary"
              style={{
                backgroundColor: user.group.color ? `${user.group.color}20` : undefined,
                color: user.group.color || undefined,
                borderColor: user.group.color || undefined,
              }}
            >
              {user.group.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Provider */}
      {user.provider && user.provider !== 'local' && (
        <div className="mb-4">
          <Badge variant="outline" className="text-xs">
            {user.provider === 'orange-openid' ? '🍊 Orange SSO' : user.provider}
          </Badge>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        {onEdit && (
          <button
            onClick={() => onEdit(user)}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
          >
            Modifier
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(user)}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}
