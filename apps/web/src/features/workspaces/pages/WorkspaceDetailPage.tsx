import { useParams, useNavigate } from '@tanstack/react-router'
import { Building2, Plus, Users, FileText, Map } from 'lucide-react'
import { Button, Heading3, Body, BodySmall } from '@repo/ui'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { ProcessCard } from '../../process/components/ProcessCard'
import { ProcessMapCard } from '../../process-map/components/ProcessMapCard'
import { useWorkspace } from '../hooks/useWorkspaces'
import { useProcesses } from '../../process/hooks/useProcesses'
import { useProcessMaps, useDeleteProcessMap } from '../../process-map/hooks/useProcessMaps'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui'
import { ProcessForm } from '../../process/components/ProcessForm'
import { useCreateProcess, useUpdateProcess, useDeleteProcess } from '../../process/hooks/useProcesses'
import type { Process } from '../../process/types/process.types'
import type { ProcessMap } from '../../process-map/types/process-map.types'
import { ProcessType } from '../../process/types/enums'

export default function WorkspaceDetailPage() {
  const { id } = useParams({ from: '/workspaces/$id' })
  const navigate = useNavigate()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)

  // Fetch workspace details
  const { data: workspace, isLoading: isLoadingWorkspace } = useWorkspace(id)
  
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
  const createMutation = useCreateProcess()
  const updateMutation = useUpdateProcess()
  const deleteMutation = useDeleteProcess()
  const deleteProcessMapMutation = useDeleteProcessMap()

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync({
      ...formData,
      workspaceId: id,
    })
    setIsCreateDialogOpen(false)
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
      breadcrumbs={[
        { label: 'Workspaces', href: '/workspaces', icon: <Building2 className="w-4 h-4" /> },
        { label: workspace.name, icon: <Building2 className="w-4 h-4" /> },
      ]}
      actions={
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau processus
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

      {/* Processes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading3 className="text-gray-900">
            Processus de cet espace de travail
          </Heading3>
          <BodySmall>
            {processes.length} processus au total
          </BodySmall>
        </div>

        {isLoadingProcesses ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : processes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <Heading3 className="text-gray-900">
                Aucun processus pour le moment
              </Heading3>
              <Body className="text-gray-600">
                Commencez par créer votre premier processus pour cet espace de travail.
              </Body>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                <Body as="span">Créer le premier processus</Body>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processes.map((process: Process) => (
              <ProcessCard
                key={process.id}
                process={process}
                onEdit={handleEdit}
                onView={() => handleView(process)}
                onDelete={() => handleDelete(process.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ProcessMaps Section */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <Heading3 className="text-gray-900">
            Cartes de processus de cet espace de travail
          </Heading3>
          <BodySmall>
            {processMaps.length} carte{processMaps.length > 1 ? 's' : ''} au total
          </BodySmall>
        </div>

        {isLoadingProcessMaps ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : processMaps.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Map className="w-8 h-8 text-orange-600" />
              </div>
              <Heading3 className="text-gray-900">
                Aucune carte de processus pour le moment
              </Heading3>
              <Body className="text-gray-600">
                Créez votre première carte de processus pour visualiser et organiser vos processus.
              </Body>
              <Button
                onClick={() => navigate({ to: '/process-maps' })}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                <Body as="span">Créer une carte de processus</Body>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processMaps.map((processMap: ProcessMap) => (
              <ProcessMapCard
                key={processMap.id}
                processMap={processMap}
                onView={handleViewProcessMap}
                onEdit={handleEditProcessMap}
                onDelete={handleDeleteProcessMap}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Créer un nouveau processus
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <ProcessForm
              defaultWorkspaceId={id}
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
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
    </PageWrapper>
  )
}

