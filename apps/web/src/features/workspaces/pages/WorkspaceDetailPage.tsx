import { useParams, useNavigate } from '@tanstack/react-router'
import { Building2, Plus, Users, FileText, Map, FolderPlus } from 'lucide-react'
import { Button, Heading3, Body, BodySmall } from '@repo/ui'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { ProcessCard } from '../../process/components/ProcessCard'
import { ProcessMapCard } from '../../process-map/components/ProcessMapCard'
import { WorkspaceGridView } from '../components/WorkspaceGridView'
import { WorkspaceChildrenEmptyState } from '../components/WorkspaceChildrenEmptyState'
import { WorkspaceForm } from '../components/WorkspaceForm'
import { WorkspaceTable } from '../components/WorkspaceTable';
import { ViewModeToggle } from '../components/ViewModeToggle';
import { useWorkspace, useWorkspaceChildren, useCreateWorkspace, useUpdateWorkspace, useDeleteWorkspace } from '../hooks/useWorkspaces'
import { useProcesses } from '../../process/hooks/useProcesses'
import { useProcessMaps, useDeleteProcessMap } from '../../process-map/hooks/useProcessMaps'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui'
import { UnifiedProcessForm } from '../components/UnifiedProcessForm'
import { useCreateProcess, useUpdateProcess, useDeleteProcess } from '../../process/hooks/useProcesses'
import { useCreateProcessMap } from '../../process-map/hooks/useProcessMaps'
import { useCreateProcedure } from '../../procedures/hooks/useProcedures'
import { ProcessForm } from '../../process/components/ProcessForm'
import type { Process } from '../../process/types/process.types'
import type { ProcessMap } from '../../process-map/types/process-map.types'
import type { Workspace, CreateWorkspaceDto, UpdateWorkspaceDto } from '../types/workspace.types'
import { ProcessType } from '../../process/types/enums'

export default function WorkspaceDetailPage() {
  const { id } = useParams({ from: '/workspaces/$id' })
  const navigate = useNavigate()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [isCreateWorkspaceDialogOpen, setIsCreateWorkspaceDialogOpen] = useState(false)
  const [isEditWorkspaceDialogOpen, setIsEditWorkspaceDialogOpen] = useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | undefined>()
  const [childViewMode, setChildViewMode] = useState<'grid' | 'table'>('grid')

  // Fetch workspace details
  const { data: workspace, isLoading: isLoadingWorkspace } = useWorkspace(id)
  
  // Fetch child workspaces
  const { data: childrenData, isLoading: isLoadingChildren } = useWorkspaceChildren(id)
  
  // Fetch processes for this workspace
  const { data: processesData, isLoading: isLoadingProcesses } = useProcesses({
    workspaceId: id,
  })

  // Fetch ProcessMaps for this workspace
  const { data: processMapsData, isLoading: isLoadingProcessMaps } = useProcessMaps({
    workspaceId: id,
    page: 1,
    limit: 100, // Get all ProcessMaps for this workspace
  })

  // All hooks must be called before any conditional returns
  const createProcessMutation = useCreateProcess()
  const createProcessMapMutation = useCreateProcessMap()
  const createProcedureMutation = useCreateProcedure()
  const updateMutation = useUpdateProcess()
  const deleteMutation = useDeleteProcess()
  const deleteProcessMapMutation = useDeleteProcessMap()
  const createWorkspaceMutation = useCreateWorkspace()
  const updateWorkspaceMutation = useUpdateWorkspace()
  const deleteWorkspaceMutation = useDeleteWorkspace()

  const handleUnifiedCreate = async (formData: any, level: 1 | 2 | 3) => {
    try {
      if (level === 1) {
        // Create ProcessMap
        await createProcessMapMutation.mutateAsync({
          title: formData.title,
          code: formData.code,
          description: formData.description,
          workspaceId: formData.workspaceId,
          status: formData.status,
        })
      } else if (level === 2) {
        // Create Process
        await createProcessMutation.mutateAsync({
          title: formData.title,
          code: formData.code,
          description: formData.description,
          workspaceId: formData.workspaceId,
          processMapId: formData.processMapId,
          type: formData.type,
          status: formData.status,
        })
      } else if (level === 3) {
        // Create Procedure
        await createProcedureMutation.mutateAsync({
          title: formData.title,
          code: formData.code,
          description: formData.description,
          workspaceId: formData.workspaceId,
          processId: formData.processId,
        })
      }
      setIsCreateDialogOpen(false)
    } catch (error: any) {
      console.error('Create error:', error)
      alert(error.message || 'Erreur lors de la création')
    }
  }

  const handleEdit = (process: Process) => {
    setSelectedProcess(process)
    setIsEditDialogOpen(true)
  }

  const handleView = (process: Process) => {
    // Navigate based on process type - using new routes
    switch (process.type) {
      case ProcessType.FLOW:
        navigate({ to: '/processes-level2/$id/flow', params: { id: process.id } as any })
        break
      case ProcessType.SIPOC:
        // SIPOC now in dedicated list page or process detail
        navigate({ to: '/sipoc', search: {} as any })
        break
      default:
        console.warn('Unknown process type:', process.type)
    }
  }

  const handleUpdate = async (formData: any) => {
    if (selectedProcess) {
      await updateMutation.mutateAsync({
        id: selectedProcess.id,
        data: formData,
      })
      setIsEditDialogOpen(false)
      setSelectedProcess(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce processus ?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const handleCreateChildWorkspace = () => {
    setSelectedWorkspace(undefined)
    setIsCreateWorkspaceDialogOpen(true)
  }

  const handleEditChildWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setIsEditWorkspaceDialogOpen(true)
  }

  const handleDeleteChildWorkspace = async (workspace: Workspace) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${workspace.name}" ?`)) {
      try {
        await deleteWorkspaceMutation.mutateAsync(workspace.id)
      } catch (error) {
        alert('Erreur lors de la suppression du workspace')
        console.error('Delete error:', error)
      }
    }
  }

  const handleWorkspaceClick = (workspace: Workspace) => {
    navigate({ to: '/workspaces/$id', params: { id: workspace.id } })
  }

  const handleProcessMapClick = (processMap: ProcessMap) => {
    navigate({ to: '/process-maps/$id', params: { id: processMap.id } })
  }

  const handleWorkspaceSubmit = async (data: CreateWorkspaceDto | UpdateWorkspaceDto) => {
    try {
      if (selectedWorkspace) {
        await updateWorkspaceMutation.mutateAsync({
          id: selectedWorkspace.id,
          data: data as UpdateWorkspaceDto,
        })
        alert('Workspace mis à jour avec succès')
      } else {
        await createWorkspaceMutation.mutateAsync({
          ...data,
          parentId: id, // Set parent to current workspace
        } as CreateWorkspaceDto)
        alert('Sous-workspace créé avec succès')
      }
      setIsCreateWorkspaceDialogOpen(false)
      setIsEditWorkspaceDialogOpen(false)
      setSelectedWorkspace(undefined)
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'enregistrement")
      console.error('Submit error:', error)
    }
  }

  const handleWorkspaceCancel = () => {
    setIsCreateWorkspaceDialogOpen(false)
    setIsEditWorkspaceDialogOpen(false)
    setSelectedWorkspace(undefined)
  }

  if (isLoadingWorkspace) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Body className="text-gray-500">Espace de travail non trouvé</Body>
          <Button
            onClick={() => navigate({ to: '/workspaces' })}
            className="mt-4"
          >
            <Body as="span">Retour aux espaces de travail</Body>
          </Button>
        </div>
      </div>
    )
  }

  const processes = processesData?.data || []
  const processMaps = processMapsData?.data || []
  const childWorkspaces = childrenData || []

  // Combine and sort all items by creation date
  const allItems = [
    ...processMaps.map(pm => ({ 
      ...pm, 
      itemType: 'processMap' as const, 
      level: 1,
      createdAt: pm.createdAt 
    })),
    ...processes.map(p => ({ 
      ...p, 
      itemType: 'process' as const, 
      level: 2,
      createdAt: p.createdAt 
    }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Build breadcrumb hierarchy from parent chain
  const buildBreadcrumbs = () => {
    const breadcrumbs: Array<{ label: string; href?: string; icon: React.ReactNode }> = [
      { label: 'Workspaces', href: '/workspaces', icon: <Building2 className="w-4 h-4" /> },
    ]

    if (workspace) {
      // Build parent chain
      const parents: Workspace[] = []
      let current: Workspace | undefined = workspace.parent
      
      while (current) {
        parents.unshift(current)
        current = current.parent
      }

      // Add parent breadcrumbs
      parents.forEach((parent) => {
        breadcrumbs.push({
          label: parent.name,
          href: `/workspaces/${parent.id}`,
          icon: <Building2 className="w-4 h-4" />,
        })
      })

      // Add current workspace
      breadcrumbs.push({
        label: workspace.name,
        icon: <Building2 className="w-4 h-4" />,
      })
    }

    return breadcrumbs
  }

  const handleViewProcessMap = (processMap: ProcessMap) => {
    navigate({ to: '/process-maps/$id', params: { id: processMap.id } })
  }

  const handleEditProcessMap = (processMap: ProcessMap) => {
    navigate({ to: '/process-maps/$id/flow', params: { id: processMap.id } })
  }

  const handleDeleteProcessMap = async (processMap: ProcessMap) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carte de processus ?')) {
      await deleteProcessMapMutation.mutateAsync(processMap.id)
    }
  }

  return (
    <PageWrapper
      title={workspace.name}
      description={workspace.description || `Code: ${workspace.code} | Type: ${workspace.type}`}
      breadcrumbs={buildBreadcrumbs()}
      actions={
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel élément
        </Button>
      }
    >

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <BodySmall>Processus</BodySmall>
              <p className="text-2xl font-bold text-gray-900">
                {workspace._count?.processes || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Map className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <BodySmall>Cartes de processus</BodySmall>
              <p className="text-2xl font-bold text-gray-900">
                {processMapsData?.data?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <BodySmall>Membres</BodySmall>
              <p className="text-2xl font-bold text-gray-900">
                {workspace._count?.workspaceMembers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <BodySmall>Sous-espaces</BodySmall>
              <p className="text-2xl font-bold text-gray-900">
                {workspace._count?.children || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Sous-workspaces */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <Heading3 className="text-gray-900">
            Sous-espaces de travail
          </Heading3>
          <div className="flex items-center gap-4">
            <BodySmall>
              {childWorkspaces.length} sous-espace{childWorkspaces.length > 1 ? 's' : ''}
            </BodySmall>
            <Button
              onClick={handleCreateChildWorkspace}
              variant="orange"
              size="sm"
              className="gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              Créer Sous-Workspace
            </Button>
          </div>
        </div>

        {isLoadingChildren ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : childWorkspaces.length === 0 ? (
          <WorkspaceChildrenEmptyState onCreateClick={handleCreateChildWorkspace} />
        ) : (
          <>
            <ViewModeToggle
              viewMode={childViewMode}
              onViewModeChange={setChildViewMode}
            />
            {childViewMode === 'table' ? (
              <WorkspaceTable
                workspaces={childWorkspaces}
                onWorkspaceClick={handleWorkspaceClick}
                onEditWorkspace={handleEditChildWorkspace}
                onDeleteWorkspace={handleDeleteChildWorkspace}
              />
            ) : (
              <WorkspaceGridView
                workspaces={childWorkspaces}
                onWorkspaceClick={handleWorkspaceClick}
                onEditWorkspace={handleEditChildWorkspace}
                onDeleteWorkspace={handleDeleteChildWorkspace}
              />
            )}
          </>
        )}
      </div>

      {/* Section 2: Processus et Cartes (tous niveaux mélangés) */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <Heading3 className="text-gray-900">
            Processus et Cartes
          </Heading3>
          <BodySmall>
            {allItems.length} élément{allItems.length > 1 ? 's' : ''} (triés par date de création)
          </BodySmall>
        </div>

        {isLoadingProcessMaps || isLoadingProcesses ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : allItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Body className="text-gray-500">Aucun processus ou carte</Body>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItems.map((item) => (
              item.itemType === 'processMap' ? (
                <ProcessMapCard
                  key={`pm-${item.id}`}
                  processMap={item}
                  onView={handleViewProcessMap}
                  onEdit={handleEditProcessMap}
                  onDelete={handleDeleteProcessMap}
                  showLevelBadge={true}
                />
              ) : (
                <ProcessCard
                  key={`p-${item.id}`}
                  process={item}
                  onEdit={handleEdit}
                  onView={() => handleView(item)}
                  onDelete={() => handleDelete(item.id)}
                  showLevelBadge={true}
                />
              )
            ))}
          </div>
        )}
      </div>

      {/* Create Process Dialog - Unified Form */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Créer un élément de processus
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <UnifiedProcessForm
              workspaceId={id}
              onSubmit={handleUnifiedCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createProcessMutation.isPending || createProcessMapMutation.isPending || createProcedureMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Process Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Modifier le processus
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            {selectedProcess && (
              <ProcessForm
                process={selectedProcess}
                defaultWorkspaceId={id}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setSelectedProcess(null)
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Child Workspace Dialog */}
      <Dialog open={isCreateWorkspaceDialogOpen} onOpenChange={setIsCreateWorkspaceDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Créer un sous-workspace
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <WorkspaceForm
              workspace={undefined}
              onSubmit={handleWorkspaceSubmit}
              onCancel={handleWorkspaceCancel}
              isLoading={createWorkspaceMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Child Workspace Dialog */}
      <Dialog open={isEditWorkspaceDialogOpen} onOpenChange={setIsEditWorkspaceDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Modifier le workspace
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <WorkspaceForm
              workspace={selectedWorkspace}
              onSubmit={handleWorkspaceSubmit}
              onCancel={handleWorkspaceCancel}
              isLoading={updateWorkspaceMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}

