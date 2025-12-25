import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@repo/ui';
import { Heading2, Body } from '@repo/ui';

interface WorkspaceEmptyStateProps {
  onCreateClick: () => void;
  hasFilters?: boolean;
}

export const WorkspaceEmptyState = ({ onCreateClick, hasFilters = false }: WorkspaceEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
        <FolderOpen className="w-10 h-10 text-orange-500" />
      </div>
      
      <Heading2 className="text-gray-900 mb-2">
        {hasFilters ? 'Aucun workspace trouvé' : 'Aucun workspace'}
      </Heading2>
      
      <Body className="text-gray-600 text-center max-w-md mb-6">
        {hasFilters
          ? 'Aucun workspace ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
          : 'Commencez par créer votre premier workspace pour organiser vos processus et équipes.'}
      </Body>

      {!hasFilters && (
        <Button onClick={onCreateClick} variant="orange" className="gap-2">
          <Plus className="w-4 h-4" />
          Créer un Workspace
        </Button>
      )}
    </div>
  );
};
