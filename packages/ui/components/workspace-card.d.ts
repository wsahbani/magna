import * as React from "react";
export interface WorkspaceCardProps {
    workspace: {
        id: string;
        name: string;
        description?: string;
        type: 'GROUPE' | 'ENTITY' | 'DIRECTION' | 'DEPARTMENT' | 'TEAM';
        processCount?: number;
        memberCount?: number;
        isActive?: boolean;
    };
    onClick?: () => void;
    isSelected?: boolean;
    className?: string;
}
export declare const WorkspaceCard: React.ForwardRefExoticComponent<WorkspaceCardProps & React.RefAttributes<HTMLDivElement>>;
export interface WorkspaceGridProps {
    workspaces: WorkspaceCardProps['workspace'][];
    selectedWorkspaceId?: string;
    onWorkspaceSelect?: (workspaceId: string) => void;
    className?: string;
}
export declare const WorkspaceGrid: React.ForwardRefExoticComponent<WorkspaceGridProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=workspace-card.d.ts.map