import { Plus } from 'lucide-react';
import { Button, Heading1, Body } from '@repo/ui';

interface ProcessPageHeaderProps {
  onCreateClick: () => void;
}

export const ProcessPageHeader: React.FC<ProcessPageHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <Heading1 className="text-gray-900">Processus</Heading1>
        <Body className="text-gray-500 mt-1">
          Gérez vos processus, procédures et instructions
        </Body>
      </div>
      <Button
        onClick={onCreateClick}
        className="bg-orange-600 hover:bg-orange-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nouveau processus
      </Button>
    </div>
  );
};
