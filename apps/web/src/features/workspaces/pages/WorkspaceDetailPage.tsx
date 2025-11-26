import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Building2, Plus, Users, FileText, Heading4Icon } from 'lucide-react'
import { Button, Heading1, Heading3, Body, BodySmall, Caption, Text, Heading2 } from '@repo/ui'
import { ProcessCard } from '../../processes/components/ProcessCard'
import { useWorkspace } from '../hooks/useWorkspaces'
import { useProcesses } from '../../processes/hooks/useProcesses'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui'
import { ProcessForm } from '../../processes/components/ProcessForm'
import { useCreateProcess, useUpdateProcess, useDeleteProcess } from '../../processes/hooks/useProcesses'
import type { Process } from '../../processes/types/process.types'

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

  const createMutation = useCreateProcess()
  const updateMutation = useUpdateProcess()
  const deleteMutation = useDeleteProcess()

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
    // Navigate based on process level (type)
    switch (process.level) {
      case 1: // FLOW
        navigate({ to: '/processes/flow/$id', params: { id: process.id } })
        break
      case 2: // SIPOC
        navigate({ to: '/processes/sipoc/$id', params: { id: process.id } })
        break
      case 3: // BPMN
        navigate({ to: '/processes/bpmn/$id', params: { id: process.id } })
        break
      default:
        console.warn('Unknown process level:', process.level)
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/workspaces' })}
            className="mt-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <Heading1 className="text-gray-900">{workspace.name}</Heading1>
                <Caption className="font-mono">{workspace.code}</Caption>
              </div>
            </div>
            {workspace.description && (
              <Body className="text-gray-600 mt-2 ml-16">{workspace.description}</Body>
            )}
          </div>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          <Body as="span">Nouveau processus</Body>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  )
}

