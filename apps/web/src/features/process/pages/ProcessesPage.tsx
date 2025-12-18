import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Dialog, DialogContent, DialogHeader, DialogTitle, BodySmall, Button } from '@repo/ui'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { Workflow, Plus, Sparkles } from 'lucide-react'
import { ViewModeToggle } from '../../process-map/components/ViewModeToggle'
import { ProcessGridView } from '../components/ProcessGridView'
import { ProcessTable } from '../components/ProcessTable'
import { ProcessEmptyState } from '../components/ProcessEmptyState'
import { ProcessForm } from '../components/ProcessForm'
import { AIGenerateProcessModal } from '../components/AIGenerateProcessModal'
import {
  useProcesses,
  useCreateProcess,
  useUpdateProcess,
  useDeleteProcess,
} from '../hooks/useProcesses'
import { createProcessFromAI } from '../../../lib/api/ai.api'
import type { Process } from '../types/process.types'
import type { GeneratedProcessStructure } from '../../../lib/api/ai.api'
import { ProcessType } from '../types/enums'
import { toast } from 'sonner'

export default function ProcessesPage() {
  const navigate = useNavigate()
  // Note: useSearch might not work if route search params are not defined in router
  // Using optional chaining and type assertion for now
  const searchParams = useSearch({ strict: false }) as any
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAIGenerateDialogOpen, setIsAIGenerateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)

  // Fetch Processes with optional filters
  const { data, isLoading } = useProcesses({
    processMapId: searchParams?.processMapId as string | undefined,
    workspaceId: searchParams?.workspaceId as string | undefined,
    page: searchParams?.page as number | undefined,
    limit: searchParams?.limit as number | undefined,
  })

  const createMutation = useCreateProcess()
  const updateMutation = useUpdateProcess()
  const deleteMutation = useDeleteProcess()

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData)
    setIsCreateDialogOpen(false)
  }

  const handleEdit = (process: Process) => {
    setSelectedProcess(process)
    setIsEditDialogOpen(true)
  }

  const handleView = (process: Process) => {
    // Navigate to SIPOC flow if type is SIPOC, otherwise to FlowDiagram
    if (process.type === ProcessType.SIPOC) {
      // Navigate to SIPOC detail page with process ID
      window.location.href = `/processes/sipoc/${process.id}`
    } else {
      navigate({ to: '/processes-level2/$id', params: { id: process.id } })
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

  const handleDelete = async (process: Process) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce processus ?')) {
      await deleteMutation.mutateAsync(process.id)
    }
  }

  const handleAIGenerateSuccess = async (response: {
    structure: GeneratedProcessStructure
    estimatedCost: number
    cached: boolean
    tokensUsed: { prompt: number; completion: number; total: number }
    processMapId?: string
    workspaceId?: string
    flowDirection?: 'horizontal' | 'vertical'
  }) => {
    try {
      // Récupérer le processMapId depuis la réponse
      const finalProcessMapId = response.processMapId || searchParams?.processMapId
      if (!finalProcessMapId) {
        toast.error('ProcessMap ID manquant')
        return
      }

      // Créer le Process à partir de la structure IA
      const process = await createProcessFromAI({
        structure: response.structure,
        processMapId: finalProcessMapId,
        workspaceId: response.workspaceId || searchParams?.workspaceId,
        departmentId: searchParams?.departmentId,
        code: undefined, // code généré automatiquement
        flowDirection: response.flowDirection || 'horizontal',
      })
      toast.success('Processus créé avec succès avec IA')
      setIsAIGenerateDialogOpen(false)
      // Naviguer vers la page de détail
      navigate({ to: '/processes-level2/$id', params: { id: process.id } })
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Erreur lors de la création du processus',
      )
    }
  }

  return (
    <PageWrapper
      title="Processus"
      description="Gérez vos processus métier (Niveau 2 - Process)"
      breadcrumbs={[{ label: 'Processus', icon: <Workflow className="w-4 h-4" /> }]}
      actions={
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAIGenerateDialogOpen(true)}
            variant="outline"
            className="border-orange-600 text-orange-600 hover:bg-orange-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Générer avec IA
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Processus
          </Button>
        </div>
      }
    >
      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4">
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : data?.data.length === 0 ? (
        <ProcessEmptyState onCreateClick={() => setIsCreateDialogOpen(true)} />
      ) : viewMode === 'grid' ? (
        <ProcessGridView
          processes={data?.data || []}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      ) : (
        <ProcessTable
          processes={data?.data || []}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={data.meta.page === 1}
            onClick={() => {
              /* TODO: Implement pagination */
            }}
          >
            Précédent
          </Button>
          <BodySmall className="text-gray-600">
            Page {data.meta.page} sur {data.meta.totalPages}
          </BodySmall>
          <Button
            variant="outline"
            disabled={data.meta.page === data.meta.totalPages}
            onClick={() => {
              /* TODO: Implement pagination */
            }}
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau processus</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <ProcessForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le processus</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            {selectedProcess && (
              <ProcessForm
                process={selectedProcess}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setSelectedProcess(null)
                }}
                isLoading={updateMutation.isPending}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Generate Dialog */}
      <AIGenerateProcessModal
        open={isAIGenerateDialogOpen}
        onOpenChange={setIsAIGenerateDialogOpen}
        processMapId={searchParams?.processMapId}
        workspaceId={searchParams?.workspaceId}
        departmentId={searchParams?.departmentId}
        onSuccess={handleAIGenerateSuccess}
      />
    </PageWrapper>
  )
}

