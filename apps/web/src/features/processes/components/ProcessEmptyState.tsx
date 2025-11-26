import { Plus } from 'lucide-react';
import { Button, Body } from '@repo/ui';

interface ProcessEmptyStateProps {
  onCreateClick: () => void;
}

export const ProcessEmptyState: React.FC<ProcessEmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="text-center py-12">
      <Body className="text-gray-500">Aucun processus trouvé</Body>
      <Button
        onClick={onCreateClick}
        className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Créer le premier processus
      </Button>
    </div>
  );
};
