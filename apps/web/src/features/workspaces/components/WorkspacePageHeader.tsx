import { Plus } from 'lucide-react';
import { Button } from '@repo/ui';
import { Heading1, Body } from '@repo/ui';

interface WorkspacePageHeaderProps {
  onCreateClick: () => void;
}

export const WorkspacePageHeader = ({ onCreateClick }: WorkspacePageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <Heading1 className="text-gray-900">Workspaces</Heading1>
        <Body className="text-gray-600 mt-1">
          Gérez vos espaces de travail et leur hiérarchie
        </Body>
      </div>
      <Button onClick={onCreateClick} variant="orange" className="gap-2">
        <Plus className="w-4 h-4" />
        Nouveau Workspace
      </Button>
    </div>
  );
};
