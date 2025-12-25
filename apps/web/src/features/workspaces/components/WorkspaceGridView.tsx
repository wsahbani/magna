import { WorkspaceCard } from './WorkspaceCard';
import type { Workspace } from '../types/workspace.types';

interface WorkspaceGridViewProps {
  workspaces: Workspace[];
  onWorkspaceClick: (workspace: Workspace) => void;
  onEditWorkspace: (workspace: Workspace) => void;
  onDeleteWorkspace: (workspace: Workspace) => void;
}

export const WorkspaceGridView = ({
  workspaces,
  onWorkspaceClick,
  onEditWorkspace,
  onDeleteWorkspace,
}: WorkspaceGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          onClick={() => onWorkspaceClick(workspace)}
          onEdit={onEditWorkspace}
          onDelete={onDeleteWorkspace}
        />
      ))}
    </div>
  );
};
