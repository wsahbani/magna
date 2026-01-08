/**
 * Workspaces Page - Refactored with professional design
 * Main page for workspace management with enhanced UX
 */

import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui';
import { PageWrapper } from '../../../components/layout/PageWrapper';
import { WorkspacePageHeader } from '../components/WorkspacePageHeader';
import { WorkspaceStatCards } from '../components/WorkspaceStatCards';
import { WorkspaceFilters } from '../components/WorkspaceFilters';
import { ViewModeToggle } from '../components/ViewModeToggle';
import { WorkspaceGridView } from '../components/WorkspaceGridView';
import { WorkspaceTable } from '../components/WorkspaceTable';
import { WorkspaceEmptyState } from '../components/WorkspaceEmptyState';
import { WorkspaceLoadingSkeleton, WorkspaceStatCardsSkeleton } from '../components/WorkspaceLoadingSkeleton';
import { WorkspaceForm } from '../components/WorkspaceForm';
import {
  useRootWorkspaces,
  useCreateWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
} from '../hooks/useWorkspaces';
import type {
  Workspace,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from '../types/workspace.types';

type ViewMode = 'grid' | 'table';

export function WorkspacesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | undefined>();

  // Queries - Get only root workspaces (no parent)
  const { data: workspacesData, isLoading, error } = useRootWorkspaces();

  // Mutations
  const createMutation = useCreateWorkspace();
  const updateMutation = useUpdateWorkspace();
  const deleteMutation = useDeleteWorkspace();

  // Filter workspaces locally by search and type
  const workspaces = useMemo(() => {
    const allWorkspaces = workspacesData || [];
    
    return allWorkspaces.filter((workspace) => {
      const matchesSearch = !search || 
        workspace.name.toLowerCase().includes(search.toLowerCase()) ||
        workspace.code.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = typeFilter === 'all' || workspace.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [workspacesData, search, typeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      totalWorkspaces: workspaces.length,
      activeMembers: workspaces.reduce((acc, w) => acc + (w._count?.workspaceMembers || 0), 0),
      totalProcesses: workspaces.reduce((acc, w) => acc + (w._count?.processes || 0), 0),
      totalDepartments: workspaces.reduce((acc, w) => acc + (w._count?.departments || 0), 0),
    };
  }, [workspaces]);

  const handleCreate = () => {
    setSelectedWorkspace(undefined);
    setShowForm(true);
  };

  const handleEdit = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setShowForm(true);
  };

  const handleDelete = async (workspace: Workspace) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${workspace.name}" ?`)) {
      try {
        await deleteMutation.mutateAsync(workspace.id);
        alert('Workspace supprimé avec succès');
      } catch (error) {
        alert('Erreur lors de la suppression du workspace');
        console.error('Delete error:', error);
      }
    }
  };

  const handleWorkspaceClick = (workspace: Workspace) => {
    navigate({ to: `/workspaces/${workspace.id}` });
  };

  const handleSubmit = async (data: CreateWorkspaceDto | UpdateWorkspaceDto) => {
    try {
      if (selectedWorkspace) {
        await updateMutation.mutateAsync({
          id: selectedWorkspace.id,
          data: data as UpdateWorkspaceDto,
        });
        alert('Workspace mis à jour avec succès');
      } else {
        await createMutation.mutateAsync(data as CreateWorkspaceDto);
        alert('Workspace créé avec succès');
      }
      setShowForm(false);
      setSelectedWorkspace(undefined);
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'enregistrement");
      console.error('Submit error:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedWorkspace(undefined);
  };

  const hasFilters = search !== '' || typeFilter !== 'all';
  const hasWorkspaces = workspaces.length > 0;

  return (
    <PageWrapper title="" description="" breadcrumbs={[]}>
      {/* Form Dialog */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedWorkspace ? 'Modifier le Workspace' : 'Nouveau Workspace'}
              </DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <WorkspaceForm
                workspace={selectedWorkspace}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Page Header */}
      <WorkspacePageHeader onCreateClick={handleCreate} />

      {/* Statistics Cards */}
      {isLoading ? (
        <WorkspaceStatCardsSkeleton />
      ) : (
        <WorkspaceStatCards
          totalWorkspaces={stats.totalWorkspaces}
          activeMembers={stats.activeMembers}
          totalProcesses={stats.totalProcesses}
          totalDepartments={stats.totalDepartments}
        />
      )}

      {/* Filters */}
      <WorkspaceFilters
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      {/* View Mode Toggle */}
      <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Content */}
      {isLoading ? (
        <WorkspaceLoadingSkeleton />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Erreur lors du chargement des workspaces</p>
        </div>
      ) : !hasWorkspaces ? (
        <WorkspaceEmptyState onCreateClick={handleCreate} hasFilters={hasFilters} />
      ) : viewMode === 'grid' ? (
        <WorkspaceGridView
          workspaces={workspaces}
          onWorkspaceClick={handleWorkspaceClick}
          onEditWorkspace={handleEdit}
          onDeleteWorkspace={handleDelete}
        />
      ) : (
        <WorkspaceTable
          workspaces={workspaces}
          onWorkspaceClick={handleWorkspaceClick}
          onEditWorkspace={handleEdit}
          onDeleteWorkspace={handleDelete}
        />
      )}
    </PageWrapper>
  );
}
