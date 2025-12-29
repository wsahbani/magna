import { Plus } from 'lucide-react';
import { BodySmall, Button, Heading3 } from '@repo/ui';
import { Heading1, Body } from '@repo/ui';

interface WorkspacePageHeaderProps {
  onCreateClick: () => void;
}

export const WorkspacePageHeader = ({ onCreateClick }: WorkspacePageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <Heading3 className="text-gray-900">Workspaces</Heading3>
        <BodySmall className="text-gray-600 mt-0.5">
          Gérez vos espaces de travail et leur hiérarchie
        </BodySmall>
      </div>
      <Button onClick={onCreateClick} variant="orange" size="sm" className="gap-2">
        <Plus className="w-4 h-4" />
        Nouveau
      </Button>
    </div>
  );
};
