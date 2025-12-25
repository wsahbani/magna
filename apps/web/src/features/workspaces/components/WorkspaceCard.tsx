/**
 * Workspace Card Component
 * Displays workspace information in card format with professional design
 */

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Button, Badge } from '@repo/ui';
import { Body, BodySmall, Caption } from '@repo/ui';
import type { Workspace } from '../types/workspace.types';
import { Building2, Users, FileText, Eye, Edit2, CheckCircle, XCircle, Calendar, Briefcase, Folder, FolderTree } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from '@tanstack/react-router';

interface WorkspaceCardProps {
  workspace: Workspace;
  onClick?: () => void;
  onEdit?: (workspace: Workspace) => void;
  onDelete?: (workspace: Workspace) => void;
}

const workspaceTypeLabels: Record<string, string> = {
  GROUPE: 'Groupe',
  ENTITY: 'Entité',
  DIRECTION: 'Direction',
  DEPARTMENT: 'Département',
  TEAM: 'Équipe',
};

const workspaceTypeColors: Record<string, string> = {
  GROUPE: 'bg-orange-500 text-white',
  ENTITY: 'bg-orange-400 text-white',
  DIRECTION: 'bg-blue-500 text-white',
  DEPARTMENT: 'bg-orange-600 text-white',
  TEAM: 'bg-purple-500 text-white',
};

const getBorderColor = (type: string): string => {
  switch (type) {
    case 'GROUPE':
      return 'border-l-orange-500';
    case 'ENTITY':
      return 'border-l-orange-400';
    case 'DIRECTION':
      return 'border-l-blue-500';
    case 'DEPARTMENT':
      return 'border-l-orange-600';
    case 'TEAM':
      return 'border-l-purple-500';
    default:
      return 'border-l-gray-400';
  }
};

export function WorkspaceCard({ workspace, onClick, onEdit, onDelete }: WorkspaceCardProps) {
  const navigate = useNavigate();
  const typeColor = workspaceTypeColors[workspace.type] || 'bg-gray-100 text-gray-800';
  const borderColor = getBorderColor(workspace.type);
  const hasChildren = (workspace._count?.children || 0) > 0;

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    onClick?.();
  };

  const handleParentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (workspace.parent) {
      navigate({ to: '/workspaces/$id', params: { id: workspace.parent.id } });
    }
  };

  const formattedDate = workspace.updatedAt
    ? formatDistanceToNow(new Date(workspace.updatedAt), { addSuffix: true, locale: fr })
    : null;

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-200 border-l-4 ${borderColor} cursor-pointer bg-white`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {hasChildren ? (
                <FolderTree className="w-5 h-5 text-orange-600 flex-shrink-0" />
              ) : (
                <Folder className="w-5 h-5 text-orange-600 flex-shrink-0" />
              )}
              <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                {workspace.name}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`text-xs px-2 py-0.5 ${typeColor}`}>
                {workspaceTypeLabels[workspace.type]}
              </Badge>
              <Caption className="text-gray-500 font-mono">{workspace.code}</Caption>
              {workspace.isActive ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <Caption>Actif</Caption>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <XCircle className="w-3 h-3" />
                  <Caption>Inactif</Caption>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {workspace.description && (
          <BodySmall className="text-gray-600 line-clamp-2">
            {workspace.description}
          </BodySmall>
        )}

        {workspace.parent && (
          <button
            onClick={handleParentClick}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors w-full text-left"
          >
            <Building2 className="w-3.5 h-3.5 text-gray-400" />
            <Caption className="text-gray-600">
              Parent: <span className="font-medium text-orange-600 hover:text-orange-700">{workspace.parent.name}</span>
            </Caption>
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <Building2 className="w-4 h-4 text-blue-500" />
            <div className="flex-1 min-w-0">
              <Caption className="text-gray-500">Enfants</Caption>
              <Body className="font-semibold text-gray-900">
                {workspace._count?.children || 0}
              </Body>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <Briefcase className="w-4 h-4 text-purple-500" />
            <div className="flex-1 min-w-0">
              <Caption className="text-gray-500">Départements</Caption>
              <Body className="font-semibold text-gray-900">
                {workspace._count?.departments || 0}
              </Body>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <FileText className="w-4 h-4 text-orange-500" />
            <div className="flex-1 min-w-0">
              <Caption className="text-gray-500">Processus</Caption>
              <Body className="font-semibold text-gray-900">
                {workspace._count?.processes || 0}
              </Body>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <Users className="w-4 h-4 text-green-500" />
            <div className="flex-1 min-w-0">
              <Caption className="text-gray-500">Membres</Caption>
              <Body className="font-semibold text-gray-900">
                {workspace._count?.workspaceMembers || 0}
              </Body>
            </div>
          </div>
        </div>

        {formattedDate && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <Caption className="text-gray-500">Mis à jour {formattedDate}</Caption>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="flex-1 gap-2 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600"
          >
            <Eye className="w-4 h-4" />
            Voir
          </Button>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(workspace);
              }}
              className="flex-1 gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Modifier
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
