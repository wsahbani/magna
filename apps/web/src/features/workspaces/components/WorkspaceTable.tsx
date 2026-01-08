import { Eye, Edit2, Trash2, CheckCircle, XCircle, Folder } from 'lucide-react';
import { Button, Badge } from '@repo/ui';
import { Body, BodySmall, Caption } from '@repo/ui';
import type { Workspace } from '../types/workspace.types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WorkspaceTableProps {
  workspaces: Workspace[];
  onWorkspaceClick: (workspace: Workspace) => void;
  onEditWorkspace: (workspace: Workspace) => void;
  onDeleteWorkspace: (workspace: Workspace) => void;
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

export const WorkspaceTable = ({
  workspaces,
  onWorkspaceClick,
  onEditWorkspace,
  onDeleteWorkspace,
}: WorkspaceTableProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left">
                <Caption className="font-semibold text-gray-700 uppercase">Nom</Caption>
              </th>
              <th className="px-6 py-3 text-left">
                <Caption className="font-semibold text-gray-700 uppercase">Code</Caption>
              </th>
              <th className="px-6 py-3 text-left">
                <Caption className="font-semibold text-gray-700 uppercase">Type</Caption>
              </th>
              <th className="px-6 py-3 text-left">
                <Caption className="font-semibold text-gray-700 uppercase">Statut</Caption>
              </th>
              <th className="px-6 py-3 text-center">
                <Caption className="font-semibold text-gray-700 uppercase">Départements</Caption>
              </th>
              <th className="px-6 py-3 text-center">
                <Caption className="font-semibold text-gray-700 uppercase">Processus</Caption>
              </th>
              <th className="px-6 py-3 text-center">
                <Caption className="font-semibold text-gray-700 uppercase">Membres</Caption>
              </th>
              <th className="px-6 py-3 text-left">
                <Caption className="font-semibold text-gray-700 uppercase">Mis à jour</Caption>
              </th>
              <th className="px-6 py-3 text-right">
                <Caption className="font-semibold text-gray-700 uppercase">Actions</Caption>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {workspaces.map((workspace) => {
              const typeColor = workspaceTypeColors[workspace.type] || 'bg-gray-500 text-white';
              const formattedDate = workspace.updatedAt
                ? formatDistanceToNow(new Date(workspace.updatedAt), { addSuffix: true, locale: fr })
                : '-';

              return (
                <tr
                  key={workspace.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onWorkspaceClick(workspace)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Folder className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex flex-col">
                        <Body className="font-medium text-gray-900">{workspace.name}</Body>
                        {workspace.description && (
                          <BodySmall className="text-gray-500 line-clamp-1 mt-1">
                            {workspace.description}
                          </BodySmall>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Caption className="font-mono text-gray-600">{workspace.code}</Caption>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`${typeColor} text-xs px-2 py-1`}>
                      {workspaceTypeLabels[workspace.type]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {workspace.isActive ? (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <Caption className="font-medium">Actif</Caption>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <XCircle className="w-4 h-4" />
                        <Caption className="font-medium">Inactif</Caption>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Body className="font-semibold text-gray-900">
                      {workspace._count?.departments || 0}
                    </Body>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Body className="font-semibold text-gray-900">
                      {workspace._count?.processes || 0}
                    </Body>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Body className="font-semibold text-gray-900">
                      {workspace._count?.workspaceMembers || 0}
                    </Body>
                  </td>
                  <td className="px-6 py-4">
                    <Caption className="text-gray-500">{formattedDate}</Caption>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onWorkspaceClick(workspace);
                        }}
                        className="hover:bg-orange-50 hover:text-orange-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditWorkspace(workspace);
                        }}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteWorkspace(workspace);
                        }}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
