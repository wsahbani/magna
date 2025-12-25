import { FolderPlus, Folder } from 'lucide-react';
import { Button } from '@repo/ui';
import { Heading3, Body } from '@repo/ui';

interface WorkspaceChildrenEmptyStateProps {
  onCreateClick: () => void;
}

export const WorkspaceChildrenEmptyState = ({ onCreateClick }: WorkspaceChildrenEmptyStateProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <Folder className="w-8 h-8 text-orange-600" />
        </div>
        <Heading3 className="text-gray-900">
          Aucun sous-espace de travail
        </Heading3>
        <Body className="text-gray-600">
          Ce workspace ne contient aucun sous-espace. Créez un sous-workspace pour organiser vos processus de manière hiérarchique.
        </Body>
        <Button
          onClick={onCreateClick}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          <Body as="span">Créer un Sous-Workspace</Body>
        </Button>
      </div>
    </div>
  );
};
