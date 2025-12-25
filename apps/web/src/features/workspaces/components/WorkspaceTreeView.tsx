import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderTree, Eye, Edit2, Trash2, FileText, Users, Briefcase, Map, FileCog, ClipboardList } from 'lucide-react';
import { Button, Badge } from '@repo/ui';
import { Body, BodySmall, Caption } from '@repo/ui';
import type { Workspace } from '../types/workspace.types';
import type { ProcessMap } from '../../process-map/types/process-map.types';
import type { Process } from '../../process/types/process.types';

interface WorkspaceTreeViewProps {
  workspaces: Workspace[];
  processMaps?: ProcessMap[];
  processes?: Process[];
  onWorkspaceClick: (workspace: Workspace) => void;
  onEditWorkspace: (workspace: Workspace) => void;
  onDeleteWorkspace: (workspace: Workspace) => void;
  onProcessMapClick?: (processMap: ProcessMap) => void;
  onProcessClick?: (process: Process) => void;
}

interface TreeNodeProps {
  workspace: Workspace;
  level: number;
  onWorkspaceClick: (workspace: Workspace) => void;
  onEditWorkspace: (workspace: Workspace) => void;
  onDeleteWorkspace: (workspace: Workspace) => void;
  expandedNodes: Set<string>;
  toggleExpand: (id: string) => void;
  processes?: Process[];
  processMaps?: ProcessMap[];
  onProcessMapClick?: (processMap: ProcessMap) => void;
  onProcessClick?: (process: Process) => void;
}

interface ProcessMapNodeProps {
  processMap: ProcessMap;
  level: number;
  onProcessMapClick?: (processMap: ProcessMap) => void;
  expandedNodes: Set<string>;
  toggleExpand: (id: string) => void;
  processes?: Process[];
  onProcessClick?: (process: Process) => void;
}

interface ProcessNodeProps {
  process: Process;
  level: number;
  onProcessClick?: (process: Process) => void;
  expandedNodes: Set<string>;
  toggleExpand: (id: string) => void;
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

// Process Node Component
const ProcessNode = ({
  process,
  level,
  onProcessClick,
  expandedNodes,
  toggleExpand,
}: ProcessNodeProps) => {
  const hasProcedures = (process._count?.procedures || 0) > 0;
  const isExpanded = expandedNodes.has(`process-${process.id}`);

  return (
    <div>
      <div
        className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={() => toggleExpand(`process-${process.id}`)}
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0"
          disabled={!hasProcedures}
        >
          {hasProcedures ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        {/* Icon */}
        <FileCog className="w-5 h-5 text-blue-600 flex-shrink-0" />

        {/* Process Info */}
        <button
          onClick={() => onProcessClick?.(process)}
          className="flex-1 flex items-center gap-3 min-w-0 text-left"
        >
          <Body className="font-medium text-gray-900 truncate">{process.title}</Body>
          <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5 flex-shrink-0">
            Level 2
          </Badge>
          <Caption className="text-gray-500 font-mono flex-shrink-0">{process.code}</Caption>
        </button>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 text-gray-500">
            <ClipboardList className="w-3.5 h-3.5" />
            <Caption>{process._count?.procedures || 0}</Caption>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onProcessClick?.(process);
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Render procedures */}
      {hasProcedures && isExpanded && process.procedures && (
        <div>
          {process.procedures.map((procedure: any) => (
            <div
              key={procedure.id}
              className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              style={{ paddingLeft: `${(level + 1) * 24 + 12}px` }}
            >
              <div className="w-5 h-5 flex-shrink-0" />
              <ClipboardList className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <button className="flex-1 flex items-center gap-3 min-w-0 text-left">
                <Body className="font-medium text-gray-900 truncate">{procedure.title}</Body>
                <Badge className="bg-purple-500 text-white text-xs px-2 py-0.5 flex-shrink-0">
                  Level 3
                </Badge>
                <Caption className="text-gray-500 font-mono flex-shrink-0">{procedure.code}</Caption>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ProcessMap Node Component
const ProcessMapNode = ({
  processMap,
  level,
  onProcessMapClick,
  expandedNodes,
  toggleExpand,
  processes,
  onProcessClick,
}: ProcessMapNodeProps) => {
  const processMapProcesses = processes?.filter((p) => p.processMapId === processMap.id) || [];
  const hasProcesses = processMapProcesses.length > 0;
  const isExpanded = expandedNodes.has(`processmap-${processMap.id}`);

  return (
    <div>
      <div
        className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={() => toggleExpand(`processmap-${processMap.id}`)}
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0"
          disabled={!hasProcesses}
        >
          {hasProcesses ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        {/* Icon */}
        <Map className="w-5 h-5 text-orange-600 flex-shrink-0" />

        {/* ProcessMap Info */}
        <button
          onClick={() => onProcessMapClick?.(processMap)}
          className="flex-1 flex items-center gap-3 min-w-0 text-left"
        >
          <Body className="font-medium text-gray-900 truncate">{processMap.title}</Body>
          <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5 flex-shrink-0">
            Level 1
          </Badge>
          <Caption className="text-gray-500 font-mono flex-shrink-0">{processMap.code}</Caption>
        </button>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 text-gray-500">
            <FileCog className="w-3.5 h-3.5" />
            <Caption>{processMapProcesses.length}</Caption>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onProcessMapClick?.(processMap);
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Render child processes */}
      {hasProcesses && isExpanded && (
        <div>
          {processMapProcesses.map((process) => (
            <ProcessNode
              key={process.id}
              process={process}
              level={level + 1}
              onProcessClick={onProcessClick}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeNode = ({
  workspace,
  level,
  onWorkspaceClick,
  onEditWorkspace,
  onDeleteWorkspace,
  expandedNodes,
  toggleExpand,
  processes,
  processMaps,
  onProcessMapClick,
  onProcessClick,
}: TreeNodeProps) => {
  const hasChildren = (workspace._count?.children || 0) > 0;
  const isExpanded = expandedNodes.has(workspace.id);
  const typeColor = workspaceTypeColors[workspace.type] || 'bg-gray-500 text-white';

  return (
    <div>
      <div
        className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={() => toggleExpand(workspace.id)}
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0"
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        {/* Icon */}
        {hasChildren ? (
          <FolderTree className="w-5 h-5 text-orange-600 flex-shrink-0" />
        ) : (
          <Folder className="w-5 h-5 text-orange-600 flex-shrink-0" />
        )}

        {/* Workspace Info */}
        <button
          onClick={() => onWorkspaceClick(workspace)}
          className="flex-1 flex items-center gap-3 min-w-0 text-left"
        >
          <Body className="font-medium text-gray-900 truncate">{workspace.name}</Body>
          <Badge className={`${typeColor} text-xs px-2 py-0.5 flex-shrink-0`}>
            {workspaceTypeLabels[workspace.type]}
          </Badge>
          <Caption className="text-gray-500 font-mono flex-shrink-0">{workspace.code}</Caption>
        </button>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 text-gray-500">
            <Briefcase className="w-3.5 h-3.5" />
            <Caption>{workspace._count?.departments || 0}</Caption>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <FileText className="w-3.5 h-3.5" />
            <Caption>{workspace._count?.processes || 0}</Caption>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Users className="w-3.5 h-3.5" />
            <Caption>{workspace._count?.workspaceMembers || 0}</Caption>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onWorkspaceClick(workspace);
            }}
            className="h-8 w-8 p-0"
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
            className="h-8 w-8 p-0"
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
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Render ProcessMaps for this workspace */}
      {isExpanded && processMaps && (
        <div>
          {processMaps
            .filter((pm) => pm.workspaceId === workspace.id)
            .map((processMap) => (
              <ProcessMapNode
                key={processMap.id}
                processMap={processMap}
                level={level + 1}
                onProcessMapClick={onProcessMapClick}
                expandedNodes={expandedNodes}
                toggleExpand={toggleExpand}
                processes={processes}
                onProcessClick={onProcessClick}
              />
            ))}
        </div>
      )}

      {/* Render children recursively */}
      {hasChildren && isExpanded && workspace.children && (
        <div>
          {workspace.children.map((child) => (
            <TreeNode
              key={child.id}
              workspace={child}
              level={level + 1}
              onWorkspaceClick={onWorkspaceClick}
              onEditWorkspace={onEditWorkspace}
              onDeleteWorkspace={onDeleteWorkspace}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
              processes={processes}
              processMaps={processMaps}
              onProcessMapClick={onProcessMapClick}
              onProcessClick={onProcessClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const WorkspaceTreeView = ({
  workspaces,
  processMaps,
  processes,
  onWorkspaceClick,
  onEditWorkspace,
  onDeleteWorkspace,
  onProcessMapClick,
  onProcessClick,
}: WorkspaceTreeViewProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (ws: Workspace) => {
      if ((ws._count?.children || 0) > 0) {
        allIds.add(ws.id);
      }
      ws.children?.forEach(collectIds);
    };
    workspaces.forEach(collectIds);
    
    // Add all ProcessMaps
    processMaps?.forEach((pm) => {
      const pmProcesses = processes?.filter((p) => p.processMapId === pm.id) || [];
      if (pmProcesses.length > 0) {
        allIds.add(`processmap-${pm.id}`);
      }
    });
    
    // Add all Processes with procedures
    processes?.forEach((p) => {
      if ((p._count?.procedures || 0) > 0) {
        allIds.add(`process-${p.id}`);
      }
    });
    
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with expand/collapse all */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <Body className="font-semibold text-gray-900">Arborescence des workspaces</Body>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Tout Ouvrir
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Tout Fermer
          </Button>
        </div>
      </div>

      {/* Tree */}
      <div className="p-2">
        {workspaces.map((workspace) => (
          <TreeNode
            key={workspace.id}
            workspace={workspace}
            level={0}
            onWorkspaceClick={onWorkspaceClick}
            onEditWorkspace={onEditWorkspace}
            onDeleteWorkspace={onDeleteWorkspace}
            expandedNodes={expandedNodes}
            toggleExpand={toggleExpand}
            processes={processes}
            processMaps={processMaps}
            onProcessMapClick={onProcessMapClick}
            onProcessClick={onProcessClick}
          />
        ))}
      </div>
    </div>
  );
};
